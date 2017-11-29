import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as ExcelActions from '../actions/ExcelActions';
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
      axios.get('http://192.168.235.188:9081/prototype/getDocTypeList', {
        withCredentials: true
      }),
      axios.get('http://192.168.235.188:9081/prototype/getClientList', {
        withCredentials: true
      })
    ])
      .then(axios.spread((forms, clients) => {
        this.setState({
          isAuthorized: true,
          formsList: forms.data,
          listClient: clients.data,
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

  handlerSendFiles = (e) => {
    e.preventDefault();
    // const form = this.form;
    // const formData = new FormData(form);
    //
    // formData.append('section', 'general');
    // formData.append('action', 'previewImg');
    // formData.append('image', this.fileInput.files[0]);

    const data = {

    };

    axios.post('http://192.168.235.188:9081/prototype/getReportData', formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));

    // debugger;
  };

  render() {
    const {
      getDocList,
      fetchDocHistory,
      saveDocHistoryId
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
        {/*<form*/}
          {/*action=""*/}
          {/*id="form"*/}
          {/*ref={(form) => {this.form = form}}*/}
        {/*>*/}
          {/*<input*/}
            {/*type="file"*/}
            {/*name="file"*/}
            {/*id="file-id"*/}
            {/*ref={(input) => {this.fileInput = input}}*/}
          {/*/>*/}
          {/*<button*/}
            {/*type="submit"*/}
            {/*id="file-send"*/}
            {/*onClick={this.handlerSendFiles}*/}
          {/*>Отправить*/}
          {/*</button>*/}
        {/*</form>*/}
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
              saveDocHistoryId={saveDocHistoryId}
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
