import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as ExcelActions from '../actions/ExcelActions';

import Authentication from './Authentication';
import { DocList } from '../components/DocList/DocList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formsList: null,
      listClient: null,
      listClientFiltered: null,
      invalid: false
    };
  }

  fetchingClientsAndForms() {
    axios.all([
      axios.get('http://192.168.235.188:9081/prototype/getAllTypeList'),
      axios.get('http://192.168.235.188:9081/prototype/getClientList')
    ])
      .then(axios.spread((forms, clients) => {
        this.setState({
          formsList: forms.data,
          listClient: clients.data,
          listClientFiltered: clients.data
        });
      }))
      .catch((error) => {
        console.log(error);
      });
  }

  filterListClients (list) {
    this.setState({
      listClientFiltered: list
    });
  }

  onClickHandler() {
    this.setState({
      invalid: !this.state.invalid
    });
  }

  render() {
    const { getDocList } = this.props.excelActions;
    const { listClient, listClientFiltered, formsList } = this.state;

    return (
      <div className="main-app">
        {!this.state.invalid ?
          <Authentication
            onClick={::this.onClickHandler.bind(this)}
            fetchingClientsAndForms={::this.fetchingClientsAndForms}
          /> :
          <DocList
            getdocList={ getDocList }
            doclist={ this.props.doclist }
            filterListClients={::this.filterListClients}
            listClient={listClient}
            listClientFiltered={listClientFiltered}
            formsList={formsList}
          /> }
        <div>
          <ul>
            <li><a href="/getDocDataByKey?clientName=CLIENT1&type=FORM02&Q=3&year=2016">Бухгалтерский баланс</a></li>
            <li><a href="/getDocDataByKey?clientName=CLIENT1&type=FORM02&Q=3&year=2016">Отчет о финансовых результатах</a></li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    doclist: state.doclist.docs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    excelActions: bindActionCreators(ExcelActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
