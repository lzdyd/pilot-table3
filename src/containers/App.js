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
      invalid: false,
      isAuthorized: false
    };
  }

  componentDidMount() {
    this.fetchingClientsAndForms();
  }

  fetchingClientsAndForms() {
    axios.all([
      axios.get('http://192.168.235.188:9081/prototype/getDocTypeList'),
      axios.get('http://192.168.235.188:9081/prototype/getClientList')
    ])
      .then(axios.spread((forms, clients) => {
        this.setState({
          isAuthorized: true,
          formsList: forms.data,
          listClient: clients.data,
          // listClientFiltered: clients.data
        });
      }))
      .catch((error) => {
        let response = error.response;
        if (response.status === 401 && response.statusText === "Unauthorized") {
          this.setState({
            isAuthorized: false
          });
          console.log(response);
        }
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
    const {
      getDocList,
      fetchDocHistory
    } = this.props.excelActions;
    const {
      listClient,
      listClientFiltered,
      formsList,
      isAuthorized
    } = this.state;

    const { doclist, dochistory } = this.props;

    return (
      <div className="main-app">
        {
          isAuthorized &&
            <DocList
              fetchDocHistory={fetchDocHistory}
              getdocList={ getDocList }
              doclist={ doclist }
              dochistory={dochistory}
              filterListClients={::this.filterListClients}
              listClient={listClient}
              listClientFiltered={listClientFiltered}
              formsList={formsList}
            />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    doclist: state.doclist.docs,
    dochistory: state.docHistory.docs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    excelActions: bindActionCreators(ExcelActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
