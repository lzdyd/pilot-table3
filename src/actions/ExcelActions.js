import axios from 'axios';
import fetch from 'isomorphic-fetch';

import getDocumentDataAPI from 'api/getDocumentData';
import saveDocumentDataAPI from 'api/saveDocumentData';

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
  CREATE_NEW_DOCUMENT,
  UPDATE_STORE
} from '../constants/index';

export function getDocList(options) {
  const url = `http://192.168.235.188:9081/prototype/docList?clientName=${options.client}&Q=${options.period}&year=${options.year}`;

  return ((dispatch) => {
    dispatch({
      type: GET_DOCLIST_REQUEST,
      payload: 'Loading...'
    });

    axios.get(url)
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

function getView(formNum) {
  return ((dispatch) => {
    getDocumentDataAPI(`http://localhost:8080/prototype/getDocView?docType=FORM${formNum}`)
      .then((response) => {
        dispatch({
          type: GET_XML_DATA_SUCCESS,
          payload: {
            response,
            type: 'ReportType1'
          }
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_XML_DATA_FAILURE,
          payload: err
        });
      });
  });
}

function getDoctype(formNum) {
  return ((dispatch) => {
    getDocumentDataAPI(`http://localhost:8080/prototype/getDocModel?docType=FORM${formNum}`)
      .then((response) => {
        dispatch({
          type: GET_XML_DATA_SUCCESS,
          payload: {
            response,
            type: 'docType1'
          }
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_XML_DATA_FAILURE,
          payload: err
        });
      });
  });
}

// TODO: move it to services/api
function getXMLDocViewAPI(formNum) {
  return dispatch =>
    fetch(
      `http://192.168.235.188:9081/prototype/getDocView?docType=FORM${formNum}`
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
      `http://192.168.235.188:9081/prototype/getDocModel?docType=FORM${formNum}`
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

/*    dispatch(getXMLData(doctypeURL)).then(() => {
      getDocumentDataAPI(`http://192.168.235.188:9081/prototype/${url.match(/\/([^\/]+)\/?$/)[1]}`)
        .then((response) => {
          if (response) {
            dispatch({
              type: GET_DATA_SUCCESS,
              payload: JSON.parse(response)
            });
          } else {
            dispatch({
              type: GET_DATA_SUCCESS,
              payload: url
            });
          }
        })
        .then(() => {
          dispatch({
            type: CALCULATE_INITIAL_DATA
          });
        })
        .catch((err) => {
          dispatch({
            type: GET_DATA_FAILURE,
            payload: err
          });
        });
    });*/
  });
}

export function updateStore(id, data) {
  return {
    type: UPDATE_STORE,
    payload: {
      id,
      data
    }
  };
}

export function saveData(data, doctype) {
  saveDocumentDataAPI(data, doctype);
}
