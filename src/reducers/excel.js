import {
  GET_DATA_REQUEST,
  GET_XML_DATA_SUCCESS,
  GET_XML_DATA_FAILURE,
  GET_DATA_SUCCESS,
  GET_DATA_FAILURE,
  CALCULATE_INITIAL_DATA,
  CREATE_NEW_DOCUMENT,
  UPDATE_STORE,
  SAVE_DATA_REQUEST,
  SAVE_DATA_SUCCESS,
  SAVE_DATA_FAILURE
} from '../constants/index';

/**
 * Created by lzdyd
 */

/**
 * @description Creates initial state for excel table
 * @property { object }  data              - Contains excel data
 * @property { boolean } fetching          - If true, inform that data is being fetched
 * @property { Object } savingDataFetching - If data is being saved, fetching key is stated to true.
 *                                           Response key contains server's response
 * @property { Object } valuesHash         - Hash table of received attributes
 */

const initialState = {
  data: {},
  fetching: false,
  savingDataFetching: {
    fetching: false,
    response: null
  },
  valuesHash: {}
};

/**
 Additional check - checks if value can be changed
 Not really sure that this check is needed
 @param { Object } payloadData - Updated data received from input
 */
function checkStoreData(payloadData) {
  const elementPos = this.data.attributes.map((item) => {
    return item.id;
  }).indexOf(payloadData.id);

  const tableRowToUpdate = this.data.attributes[elementPos];

  if (tableRowToUpdate.state === 'input-field') {
    return true;
  }
}

/**
 * @description Finds in store object with id === payload.id
 * and updates it with new value
 * NOT sure that it's a good solution from the point of view of perfomance
 * @param { Object } payloadData - Row id and new value
 */
function updateStoreData(payloadData) {
  const elementPos = this.data.attributes.map((item) => {
    return item.id;
  }).indexOf(payloadData.id);

  this.data.attributes[elementPos].value = payloadData.data;

  return this.data;
}

/**
 * @param { String } formula - cell's formula
 * @returns { Array } Array of cells on which current cell depends
 */
function getDependencies(formula) {
  if (!formula) return null;

  return formula.match(/F\d+/g);
}

/**
 * @description Creates hash table, where key is cell's id, value is object of cell's attributes
 * Attributes:
 * 1) Dependencies - array of cells on which current cell depends
 * 2) Value - cell's value
 * 3) State - if cell contains formula, this attributes says if the cell needs recalculation
 * State takes 2 parameters - "Waiting" and "Calculated"
 * @param { Object } data - received data from REST API server
 * @returns {{}}
 */
function createValuesHash(data) {
  const hash = {};
  // debugger;
  Object.values(this.docType1.attributes).forEach((item) => {
    hash[item.id] = {};
    hash[item.id].value = null;
  });

  if (data) {
    // debugger
    Object.values(data.data).forEach((item) => {
      // debugger;
      hash[item.fieldName] = {
        value: item.dbvalue || null
      };
    });
  }

  Object.values(this.docType1.attributes).forEach((item) => {
    const dependencies = getDependencies(item.formula);

    if (dependencies) {
      hash[item.id].dependencies = dependencies;
      hash[item.id].state = null;
      hash[item.id].formula = item.formula;
    }
  });

  return hash;
}

/**
 * @description Evaluates JS code
 * @param { Object } item - cell
 * @returns {*}
 */
function evalJSON(item) {
  const restructuredFunc = item.formula.replace(/F\d+/g, (str) => {
    return `+this.F${str.match(/\d+/)}.value`;
  });

  let result;

  try {
    result = eval(`(${restructuredFunc})`) || 'Ошибка вычислений';
  } catch (e) {
    result = 'Ошибка вычислений';
  }

  return result;
}

/**
 * @description Watch calculatedData function
 * @param dependency
 */
const calculateDependency = function calculateDependency(dependency) {
  let hash = JSON.parse(JSON.stringify(this));

  if (this[dependency].dependencies) {
    const dependencyDependencies = this[dependency].dependencies;

    dependencyDependencies.forEach((item) => {
      if (hash[item].dependencies) {
        hash[item].dependencies.forEach((currentItem) => {
          if (hash[currentItem].dependencies) {
            hash = calculateDependency.call(hash, currentItem);
          }
        });

        const currentItemResult = evalJSON.call(hash, hash[item]);

        hash[item].value = currentItemResult;
        hash[item].state = 'calculated';
      }
    });

    const result = evalJSON.call(hash, hash[dependency]);
    hash[dependency].value = result;
    hash[dependency].state = 'calculated';

    return hash;
  }

  return hash[dependency];
};

/**
 * @description Some kind of Depth-first search.
 * First, it goes through each node and set 'state = waiting' if node contains dependencies.
 * Then it goes through each node again and check its dependencies and state.
 * If these conditions are fulfilled, this algorithm checks if node's dependency contains
 * its own dependencies. If it does, it calculates them.
 * Once all the dependencies are calculated, it calculates our node.
 * After all, it sets node's state to 'calculated'.
 * @return { Object } valuesHash - Hash table of cells
 */
// TODO: refactor this method
function calculateData() {
  let valuesHash = JSON.parse(JSON.stringify(this.valuesHash));

  for (const key in valuesHash) {
    if (Object.prototype.hasOwnProperty.call(valuesHash, key)) {
      if (valuesHash[key].dependencies) valuesHash[key].state = 'waiting';
    }
  }

  for (const key in valuesHash) {
    if (Object.prototype.hasOwnProperty.call(valuesHash, key)) {
      const item = Object.assign({}, valuesHash[key]);

      if (item.dependencies && item.state !== 'calculated') {
        item.dependencies.forEach((dependency) => {
          if (valuesHash[dependency].dependencies) {
            valuesHash = JSON.parse(JSON.stringify(calculateDependency.call(valuesHash, dependency)));
          }
        });

        const evaluatedJSON = evalJSON.call(valuesHash, item);
        valuesHash[key].value = evaluatedJSON;
        valuesHash[key].state = 'calculated';
      }
    }
  }

  return valuesHash;
}

/**
 * @description Checks node's dependencies
 * @param node
 * @param updatedNode
 */
const checkDependencies = function checkDependencies(node, updatedNode) {
  let hash = JSON.parse(JSON.stringify(this));
  const dependencyDependencies = hash[node].dependencies || null;

  if (dependencyDependencies) {
    dependencyDependencies.forEach((item) => {
      if (item === `id${updatedNode}`) {
        hash[node].state = 'waiting';
      }

      if (hash[item].dependencies) {
        hash[item].dependencies.forEach((currentItem) => {
          if (currentItem === `id${updatedNode}`) {
            hash[node].state = 'waiting';
            hash[item].state = 'waiting';
          } else {
            hash = checkDependencies.call(hash, currentItem, updatedNode);
          }

          if (hash[currentItem].state === 'waiting') {
            hash[node].state = 'waiting';
            hash[item].state = 'waiting';
          }
        });
      }
    });
  }

  return hash;
};

function updateStore(payload) {
  // debugger;
  // TODO: create array of dependencies, go through each elem and set elem's state to 'waiting'
  const store = JSON.parse(JSON.stringify(this));
  let valuesHash = JSON.parse(JSON.stringify(this.valuesHash));

  valuesHash[payload.id].value = payload.data;

  for (const key in valuesHash) {
    if (Object.prototype.hasOwnProperty.call(valuesHash, key)) {
      if (valuesHash[key].dependencies && valuesHash[key].state !== 'waiting') {
        valuesHash = checkDependencies.call(valuesHash, key, payload.id);
      }
    }
  }

  store.valuesHash = valuesHash;

  return calculateData.call(store);
}

/**
 * @description Goes through every attribute and saves its value to JS object
 * @param { DOM } xml - Received XML via REST API
 * @returns { Object } regular JS object
 */
function parseDoctypeXML(xml) {
  // debugger;
  const attributes = Array.from(xml.querySelectorAll('attribute')).map((item) => {
    // debugger;
    const currentAttribute = {
      id: item.querySelector('id').firstChild.nodeValue,
      label: item.querySelector('label').firstChild.nodeValue,
      type: item.querySelector('type').firstChild.nodeValue,
      formatMask: item.querySelector('formatMask').firstChild.nodeValue
    };

    const additionalAttrs = {
      formula: item.querySelector('formula') || null,
      isObligatory: item.querySelector('isObligatory') || null
    };

    Object.keys(additionalAttrs).forEach((key) => {
      if (additionalAttrs[key] !== null) {
        currentAttribute[key] = additionalAttrs[key].firstChild.nodeValue;
      }
    });

    return currentAttribute;
  });

  const doctype = {
    attributes,
    id: xml.querySelector('id').firstChild.nodeValue,
    name: xml.querySelector('name').firstChild.nodeValue,
    periodType: xml.querySelector('periodType').firstChild.nodeValue
  };

  return doctype;
}

/**
 * @description Goes through every attribute and saves its value to JS object
 * @param { DOM } xml - Received XML via REST API
 * @returns { Object } regular JS object
 */
function parseReportTypeXML(xml) {
  const rowParams = Array.from(xml.querySelectorAll('rowParam')).map((item) => {
    const currentRowParam = {
      rowNumber: item.querySelector('rowNumber').firstChild.nodeValue,
      rowHeight: item.querySelector('rowHeight').firstChild.nodeValue
    };

    return currentRowParam;
  });

  const columnParams = Array.from(xml.querySelectorAll('columnParam')).map((item) => {
    const currentColumnParam = {
      rowNumber: item.querySelector('colNumber').firstChild.nodeValue,
      rowHeight: item.querySelector('colWidth').firstChild.nodeValue
    };

    return currentColumnParam;
  });

  const cells = Array.from(xml.querySelectorAll('cell')).map((item) => {
    const currentCell = {
      row: item.querySelector('row').firstChild.nodeValue,
      column: item.querySelector('column').firstChild.nodeValue
    };

    const additionalAttrs = {
      cellText: item.querySelector('cellText') || null,
      style: item.querySelector('style') || null,
      docFieldLabel: item.querySelector('docFieldLabel') || null,
      docField: item.querySelector('docField') || null
    };

    Object.keys(additionalAttrs).forEach((key) => {
      if (additionalAttrs[key] !== null) {
        if (additionalAttrs[key].firstChild) {
          currentCell[key] = additionalAttrs[key].firstChild.nodeValue;
        } else {
          currentCell[key] = '';
        }
      }
    });

    return currentCell;
  });

  const doctypeView = {
    id: xml.querySelector('id').firstChild.nodeValue,
    title: xml.querySelector('title').firstChild.nodeValue,
    doStickHeader: xml.querySelector('doStickHeader').firstChild.nodeValue,
    doStickLeft: xml.querySelector('doStickLeft').firstChild.nodeValue,
    table: {
      rowParams,
      columnParams,
      cells,
      rowCnt: xml.querySelector('rowCnt').firstChild.nodeValue,
      colCnt: xml.querySelector('colCnt').firstChild.nodeValue,
      resizable: xml.querySelector('resizable').firstChild.nodeValue
    }
  };

  return doctypeView;
}

/**
 * @param { Object } payload     - received XML via REST API and its type
 * @returns { Object } parsedXML - regular JS object
 */
function parseXML(payload) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(payload.response, 'text/xml');
  const xmlDocType = payload.type;

  let parsedXML;

  switch (xmlDocType) {
    case 'docType1':
      parsedXML = parseDoctypeXML(xmlDoc);
      break;

    case 'ReportType1':
      parsedXML = parseReportTypeXML(xmlDoc);
      break;

    default:
      break;
  }

  return parsedXML;
}

/**
 * @description If we need to create a new document, this function creates initial data for it
 * @param { String } url
 * @return {{status: number, version: number, client, type, period, year, edit}}
 */
function createInitialData(url) {
  const data = {
    status: 0,
    version: 1,
    client: url.match(/clientName=([^&]*)/)[1],
    type: url.match(/type=([^&]*)/)[1],
    period: url.match(/Q=([^&]*)/)[1],
    year: url.match(/year=([^&]*)/)[1],
    edit: JSON.parse(url.match(/edit=([^&]*)/)[1])
  };

  return data;
}

/**
 * @description Checks if we need to edit an existing document or to create a new one
 * @param payload
 * @return {{status: number, version: number, client, type, period, year, edit}}
 */
function checkData(payload) {
  if (payload.response) {
    const updatedPayload = JSON.parse(JSON.stringify(payload.response));

    updatedPayload.edit = JSON.parse(payload.url.match(/edit=([^&]*)/)[1]);

    return updatedPayload;
  }

  if (payload.response) return payload.response;

  return createInitialData(payload);
}


function pasteValuesFromExcel(state, entryData) {
  const data = { ...state.valuesHash };

  entryData.forEach((item) => {
    data[item.id].value = +item.value;
  });

  return data;
}

export default function employeesTable(state = initialState, action) {
  switch (action.type) {
    case GET_DATA_REQUEST:
      return { ...state, fetching: true };

    case GET_XML_DATA_SUCCESS:
      switch (action.payload.type) {
        case 'docType1':
          return { ...state, docType1: parseXML(action.payload) };

        case 'ReportType1':
          return { ...state, ReportType1: parseXML(action.payload) };

        default:
          return { ...state };
      }

    case GET_XML_DATA_FAILURE:
      return { ...state, error: action.payload };

    case GET_DATA_SUCCESS:
      return { ...state,
        data: checkData(action.payload),
        valuesHash: createValuesHash.call(state, action.payload.response),
        fetching: false
      };

    case CREATE_NEW_DOCUMENT:
      return { ...state };

    case GET_DATA_FAILURE:
      return { ...state, error: action.payload, fetching: false };

    case CALCULATE_INITIAL_DATA:
      return { ...state, valuesHash: calculateData.call(state) };

    case UPDATE_STORE:
      return { ...state, valuesHash: updateStore.call(state, action.payload) };

    case SAVE_DATA_REQUEST:
      return { ...state, savingDataFetching: { fetching: true, response: null } };

    case SAVE_DATA_SUCCESS:
      return { ...state, savingDataFetching: { fetching: false, response: action.payload } };

    case SAVE_DATA_FAILURE:
      return { ...state, savingDataFetching: { fetching: false, response: action.payload } };

    case 'PASTE_DATA':
      return {
        ...state,
        valuesHash: pasteValuesFromExcel.call(this, state, action.payload)
      };

    default:
      return state;
  }
}
