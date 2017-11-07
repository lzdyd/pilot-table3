import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { Router, Route, browserHistory, IndexRoute, Switch } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createBrowserHistory } from 'history';

import App from './containers/App';
import Excel from './containers/Excel';
import NotFound from './components/NotFound';

import configureStore from './store/configureStore';

import './common/style.scss';

const store = configureStore();

const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDOM.render(
  <Provider store={ store }>
    {/*<App />*/}
    <Router history={ history }>
      <Switch>
        <Route exact path='/' component={ App } />
        <Route path='/getDocDataByKey' component={ Excel }/>
        <Route path='/getDocDataByKey' component={ Excel }/>
        <Route render={() => <NotFound/>}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
