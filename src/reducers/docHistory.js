
const innitialState = {
  fetching: false,
  fetchingError: null,
  docs: [],
  curDocHistoryId: null
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

    case 'SAVE_DOC_ID':
      return {
        ...state,
        curDocHistoryId: payload
      };


    default:
      return state;
  }
}
