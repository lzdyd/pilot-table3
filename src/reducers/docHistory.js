
const innitialState = {
  fetching: false,
  fetchingError: null,
  docs: []
};

export default function docHistory(state = innitialState, { type, payload }) {

  switch (type) {
    case 'GET_DOCHISTORY_REQUEST':
      return {
        ...state,
        fetching: true
      };

    case 'GET_DOCHISTORY_SUCCESS':
      return {
        ...state,
        fetching: false,
        docs: [...payload]
      };

    case 'GET_DOCHISTORY_FAILURE':
      return {
        ...state,
        fetching: false,
        fetchingError: payload
      };

    default:
      return state;
  }
}