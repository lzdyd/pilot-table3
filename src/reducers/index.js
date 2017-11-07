import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import doclist from './docList';
import excel from './excel';

export default combineReducers({
  doclist,
  excel,
  routing: routerReducer
});
