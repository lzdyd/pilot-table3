import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ExcelActions from '../actions/ExcelActions';

import Excel from '../components/Excel/index';

class App extends Component {
  componentDidMount() {
    window.addEventListener('beforeunload', (e) => {
      e.returnValue = "Возможно, внесенные изменения не сохранятся!";
    });

    this.props.excelActions.getDocumentData(window.location.href);
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

  onCellChange(id, value) {
    this.props.excelActions.updateStore(id, value);
  }

  onSaveData() {
    this.props.excelActions.saveData(this.props.excel.valuesHash, this.props.excel.data);
    // debugger;
  }

  render() {
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
      pasteDataInExcel
    } = this.props.excelActions;


    return (
      <div className="main-app">
        <Excel
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
