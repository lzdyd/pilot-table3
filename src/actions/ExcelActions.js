import axios from 'axios';
import fetch from 'isomorphic-fetch';
import ls from 'local-storage';

import getDocumentDataAPI from 'api/getDocumentData';
import saveDocumentDataAPI from 'api/saveDocumentData';

/**
 * Created by lzdyd
 */

import {
  GET_DOCLIST_REQUEST,
  GET_DOCLIST_SUCCESS,
  GET_DOCLIST_FAILURE,
  GET_DATA_REQUEST,
  GET_XML_DATA_SUCCESS,
  GET_XML_DATA_FAILURE,
  GET_DATA_SUCCESS,
  GET_DATA_FAILURE,
  CALCULATE_INITIAL_DATA,
  UPDATE_STORE,
  SAVE_DATA_REQUEST,
  SAVE_DATA_SUCCESS,
  SAVE_DATA_FAILURE
} from '../constants/index';

export function pasteDataInExcel(obj) {
  return ((dispatch) => {
    dispatch({
      type: 'PASTE_DATA',
      payload: obj
    });
  });
}


export function getDocList({ client, year, period }) {
  const url = `http://192.168.235.188:9081/prototype/docList?clientName=${client}&Q=${period}&year=${year}`;

  return ((dispatch) => {
    dispatch({
      type: GET_DOCLIST_REQUEST,
      payload: 'Loading...'
    });

    axios.get(url, {
      withCredentials: true
    })
      .then((response) => {
        dispatch({
          type: GET_DOCLIST_SUCCESS,
          payload: response.data
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_DOCLIST_FAILURE,
          payload: err
        });
      });
  });
}

export function fetchDocHistory({ client, type, period, year }) {
  const url =
    `http://192.168.235.188:9081/prototype/getDocHistory?clientName=${client}&type=${type}&Q=${period}&year=${year}`;

  return ((dispatch) => {
    dispatch({
      type: 'GET_DOCHISTORY_REQUEST'
    });

    axios.get(url, {
      withCredentials: true
    })
      .then(({ data }) => {
        dispatch({
          type: 'GET_DOCHISTORY_SUCCESS',
          payload: data
        });
      })
      .catch((error) => {
        dispatch({
          type: 'GET_DOCHISTORY_FAILURE',
          payload: error.message
        });
      });
  });
}

// TODO: move it to services/api
function getXMLDocViewAPI(formNum) {
  return dispatch =>
    fetch(
      `http://192.168.235.188:9081/prototype/getDocView?docType=FORM${formNum}`, {
        credentials: 'include'
      }
    ).then(
      response => response.text()
    ).then(
      response => dispatch({
        type: GET_XML_DATA_SUCCESS,
        payload: {
          response,
          type: 'ReportType1'
        }
      })
    ).catch((err) => {
      dispatch({
        type: GET_XML_DATA_FAILURE,
        payload: err
      });
    });
}

// TODO: move it to services/api
function getXMLDocModelAPI(formNum) {
  return dispatch =>
    fetch(
      `http://192.168.235.188:9081/prototype/getDocModel?docType=FORM${formNum}`, {
        credentials: 'include'
      }
    ).then(
      response => response.text()
    ).then(
      response => dispatch({
        type: GET_XML_DATA_SUCCESS,
        payload: {
          response,
          type: 'docType1'
        }
      })
    ).catch((err) => {
      dispatch({
        type: GET_XML_DATA_FAILURE,
        payload: err
      });
    });
}

function getXMLData(doctypeURL) {
  return dispatch => Promise.all([
    dispatch(getXMLDocViewAPI(doctypeURL)),
    dispatch(getXMLDocModelAPI(doctypeURL))
  ]);
}

/**
 * @description Makes request via REST API to get JSON of needed document. If document has not
 * been created, server returns nothing. In this case, we create JSON manually based on url params
 * @param { String } url
 */
function getJSONData(url) {
  return dispatch => getDocumentDataAPI(url)
    .then((response) => {
      if (response) {
        dispatch({
          type: GET_DATA_SUCCESS,
          payload: {
            url,
            response: JSON.parse(response)
          }
        });
      } else {
        dispatch({
          type: GET_DATA_SUCCESS,
          payload: url
        });
      }
    });
}

/**
 * @description Makes 3 GET requests to the server:
 * 1) XML Doc View
 * 2) XML Doc Model
 * 3) JSON of doc's data
 * Once the data is received, we calculate formula-cells
 * @param { String } url
 * @returns {function(*=)}
 */
export function getDocumentData(url) {
  return ((dispatch) => {
    dispatch({
      type: GET_DATA_REQUEST,
      payload: 'Loading...'
    });

    const doctypeURL = url.match(/type=[^&]*/g)[0].match(/\d+/g)[0];

    dispatch(getXMLData(doctypeURL)).then(() => {
      dispatch(getJSONData(`http://192.168.235.188:9081/prototype/${url.match(/\/([^\/]+)\/?$/)[1]}`)).then(() => {
        dispatch({
          type: CALCULATE_INITIAL_DATA
        });
      }).catch((err) => {
        dispatch({
          type: GET_DATA_FAILURE,
          payload: err
        });
      });
    });
  });
}

/**
 * @description Updates store if cell was changed
 * @param { String } id   - id of the changed cell
 * @param { Number } data - value of the changed cell
 * @returns {{type, payload: {id: *, data: *}}}
 */
export function updateStore(id, data) {
  return {
    type: UPDATE_STORE,
    payload: {
      id,
      data
    }
  };
}

/**
 * @description Saves data to the server via REST API
 * @param { Object } data    - Hash table of values
 * @param { Object } doctype - Doc's data
 * @returns {function(*)}
 */
export function saveData(data, doctype) {
  return ((dispatch) => {
    dispatch({
      type: SAVE_DATA_REQUEST
    });

    // TODO: change local storage only after the action (success or failure) is done
    // (like in getDocumentData function)
    saveDocumentDataAPI(data, doctype)
      .then((response) => {
        dispatch({
          type: SAVE_DATA_SUCCESS,
          payload: JSON.parse(response)
        });
      })
      .then(() => {
        ls.set('save', 'true');
      })
      .catch((err) => {
        dispatch({
          type: SAVE_DATA_FAILURE,
          payload: err
        });
      });
  });
}
