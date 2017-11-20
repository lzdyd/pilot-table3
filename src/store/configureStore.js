import { createStore, applyMiddleware  } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

/**
 * Created by lzdyd
 */

export default function configureStore(initialState) {
  let store;

  const logger = createLogger();

  if (NODE_ENV === 'development') {
    store = createStore(rootReducer, initialState, applyMiddleware(thunk, logger));
  } else {
    store = createStore(rootReducer, initialState, applyMiddleware(thunk));
  }

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
