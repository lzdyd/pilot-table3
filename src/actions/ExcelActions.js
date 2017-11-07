import axios from 'axios';

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
    // getDocumentDataAPI('http://cors.io/?http://localhost:8080/prototype/getDocView?docType=FORM02')
    // getDocumentDataAPI('./doctype_view_opu.xml')
    // getDocumentDataAPI('http://localhost:8080/getDocModel?docType=FORM01')
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

export function getDocumentData(url) {
  return ((dispatch) => {
    dispatch({
      type: GET_DATA_REQUEST,
      payload: 'Loading...'
    });

    const doctypeURL = url.match(/type=[^&]*/g)[0].match(/\d+/g)[0];

    Promise.all([
      dispatch(getView(doctypeURL)),
      dispatch(getDoctype(doctypeURL))
    ]).then(() => {
      getDocumentDataAPI('http://localhost:8080/prototype/getDocData?docid=430100')
        .then((response) => {
          dispatch({
            type: GET_DATA_SUCCESS,
            payload: JSON.parse(response)
          });
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
    });
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
