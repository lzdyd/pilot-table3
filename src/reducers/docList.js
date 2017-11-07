import {
  GET_DOCLIST_REQUEST,
  GET_DOCLIST_SUCCESS,
  GET_DOCLIST_FAILURE
} from '../constants';

const initialState = {
  fetching: true,
  docs: null
};

export default function doclist(state = initialState, action) {
  switch (action.type) {
    case GET_DOCLIST_REQUEST:
      return {
        ...state,
        fetching: true
      };

    case GET_DOCLIST_SUCCESS:
      return {
        ...state,
        docs: action.payload,
        fetching: false
      };

    case GET_DOCLIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        fetching: false
      };

    default:
      return state;
  }
}
