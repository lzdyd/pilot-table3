import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as ExcelActions from '../actions/ExcelActions';

import Excel from '../components/Excel/index';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: null,
      docId: null,
      toAcceptDoc: false,
      descrDoc: null
    };

    this.onClickHandlerToAccept = this.onClickHandlerToAccept.bind(this);
  }

  componentWillMount() {
    const client = window.location.href.match(/clientName=[^&]*/g).join('').slice(11);
    const year = window.location.href.match(/year=[^&]*/g).join('').slice(5);
    const period = window.location.href.match(/Q=[^&]*/g).join('').slice(2);
    const formType = window.location.href.match(/type=[^&]*/g).join('').slice(5);

    const docObj = {
      client,
      year,
      period,
      formType
    };

    this.setState({
      descrDoc: docObj
    });
  }

  componentDidMount() {
    window.addEventListener('beforeunload', (e) => {
      e.returnValue = "Возможно, внесенные изменения не сохранятся!";
    });

    // const url = window.location.href.match(/status=[^&]*/g)[0].match(/\d+/g)[0];
    // const urlId = window.location.href.match(/id=[^&]*/g)[0].match(/\d+/g)[0];

    // const client = window.location.href.match(/clientName=[^&]*/g).join('').slice(11);

    this.props.excelActions.getDocumentData(window.location.href);
    // debugger;

    // if (urlId) this.setState({ docId: urlId });
    // if (url) this.setState({ status: +url });

    // this.setState({
    //   descrDoc: {
    //     client: client
    //   }
    // });
    // debugger;

    let titles = ['Отчет о финансовых результатах', 'Бухгалтерский баланс'];
    let curTitle = this.props.location.search.match('FORM01') ||
                    this.props.location.search.match('FORM02');

    if (curTitle) {
      switch (curTitle[0]) {
        case 'FORM01':
          document.title = titles[1];
          break;

        case 'FORM02':
          document.title = titles[0];
          break;

        default:
          break;
      }
    }
  }

  onClickHandlerToAccept() {
    const { docId } = this.state;
    const url = `http://192.168.235.188:9081/prototype/docAccept?docid=${docId}`;

      axios.get(url, { withCredentials: true })
        .then((response) => {
          this.setState({ toAcceptDoc: true });
          localStorage.setItem('accept', 'true');
        })
        .catch((err) => console.log(err));
  }

  onCellChange(id, value) {
    this.props.excelActions.updateStore(id, value);
  }

  onSaveData() {
    this.props.excelActions.saveData(this.props.excel.valuesHash, this.props.excel.data);
  }

  render() {
    const {
      status,
      toAcceptDoc ,
      descrDoc
    } = this.state;

    const {
      data,
      docType1,
      ReportType1,
      fetching,
      valuesHash,
      savingDataFetching
    } = this.props.excel;

    const {
      updateStore,
      pasteDataInExcel,
    } = this.props.excelActions;


    return (
      <div className="main-app">
        <Excel
          descrDoc={descrDoc}
          status={status}
          toAcceptDoc={toAcceptDoc}
          jsonData={ data }
          data={ docType1 }
          modelView={ ReportType1 }
          fetching={ fetching }
          valuesHash={ valuesHash }
          savingDataFetching={ savingDataFetching }
          pasteData={pasteDataInExcel}
          updateStore={updateStore}
          onCellChange={ ::this.onCellChange }
          onSaveData={ ::this.onSaveData }
          onClickHandlerToAccept={this.onClickHandlerToAccept}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    excel: state.excel,
    curDocHistoryId: state.docHistory.curDocHistoryId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    excelActions: bindActionCreators(ExcelActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
