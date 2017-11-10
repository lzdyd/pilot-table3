import {
  GET_DOCLIST_REQUEST,
  GET_DOCLIST_SUCCESS,
  GET_DOCLIST_FAILURE
} from '../constants';

const initialState = {
  fetching: true,
  docs: null
};

export default function doclist(state = initialState, { type, payload }) {
  switch (type) {
    case GET_DOCLIST_REQUEST:
      return {
        ...state,
        fetching: true
      };

    case GET_DOCLIST_SUCCESS:
      return {
        ...state,
        docs: payload,
        fetching: false
      };

    case GET_DOCLIST_FAILURE:
      return {
        ...state,
        error: payload,
        fetching: false
      };

    default:
      return state;
  }
}

