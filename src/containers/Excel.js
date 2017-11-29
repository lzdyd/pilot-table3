import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', (e) => {
      e.returnValue = "Возможно, внесенные изменения не сохранятся!";
    });

    this.props.excelActions.getDocumentData(window.location.href);

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


  onCellChange(id, value) {
    this.props.excelActions.updateStore(id, value);
  }

  onSaveData() {
    const { valuesHash, data } = this.props.excel;
    this.props.excelActions.saveData(valuesHash, data);
  }

  render() {
    const {
      status,
      toAcceptDoc
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
      changeStatusEdit,
      getDocumentData
    } = this.props.excelActions;


    return (
      <div className="main-app">
        <Excel
          getDocumentData={getDocumentData}
          changeStatusEdit={changeStatusEdit}
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
