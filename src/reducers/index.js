import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import doclist from './docList';
import docHistory from './docHistory';
import excel from './excel';

export default combineReducers({
  docHistory,
  doclist,
  excel,
  routing: routerReducer
});
