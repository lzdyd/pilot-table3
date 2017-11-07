import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ExcelActions from '../actions/ExcelActions';

import Excel from '../components/Excel/index';

class App extends Component {
  componentDidMount() {
    this.props.excelActions.getDocumentData(window.location.href);
  }

  onCellChange(id, value) {
    this.props.excelActions.updateStore(id, value);
  }

  onSaveData() {
    this.props.excelActions.saveData(this.props.excel.valuesHash, this.props.excel.data);
  }

  render() {
    const { data, docType1, ReportType1, fetching, valuesHash } = this.props.excel;
    const updateStore = this.props.excelActions.updateStore;

    return (
      <div className="main-app">
        <Excel jsonData={ data } data={ docType1 } modelView={ ReportType1 } fetching={ fetching }
               valuesHash={ valuesHash } onCellChange={ ::this.onCellChange } onSaveData={ ::this.onSaveData } />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    excel: state.excel
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    excelActions: bindActionCreators(ExcelActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
