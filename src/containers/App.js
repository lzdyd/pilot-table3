import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ExcelActions from '../actions/ExcelActions';

// import Authentication from './Authentication';
import { DocList } from '../components/DocList/DocList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invalid: false
    };
  }

  render() {
    const { getDocList } = this.props.excelActions;

    return (
      <div className="main-app">
        <DocList
          getdocList={ getDocList }
          doclist={ this.props.doclist }
        />

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
