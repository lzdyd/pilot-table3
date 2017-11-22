import React, { Component } from 'react';

import TableHeaders from './components/TableHeaders';
import TableRows from './components/TableRows';
import ModalBox from './components/ModalBox';

import './style.scss';

/**
 * Created by lzdyd
 */

export default class Excel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderModalBox: false,
      activeCell: 1
    };

    this.onSaveData = this.onSaveData.bind(this);
    this.mountModalBox = this.mountModalBox.bind(this);
    this.unmountModalBox = this.unmountModalBox.bind(this);
  }

  onSaveData() {
    this.props.onSaveData();
  }

  mountModalBox() {
    this.setState({
      renderModalBox: true
    });
  }

  unmountModalBox() {
    this.setState({
      renderModalBox: false
    });
  }

  render() {
    const { pasteData } = this.props;
    /**
     * If data is being fetched, render "Loading spinner"
     */
    if (this.props.fetching) {
      return (
        <div className="loading">
          <div className="wBall" id="wBall_1">
            <div className="wInnerBall"></div>
          </div>
          <div className="wBall" id="wBall_2">
            <div className="wInnerBall"></div>
          </div>
          <div className="wBall" id="wBall_3">
            <div className="wInnerBall"></div>
          </div>
          <div className="wBall" id="wBall_4">
            <div className="wInnerBall"></div>
          </div>
          <div className="wBall" id="wBall_5">
            <div className="wInnerBall"></div>
          </div>
        </div>
      );
    }

    /**
     If data was not received, inform user about it
     */
    if (this.props.data === undefined) {
      return <h1>Something went wrong</h1>;
    }

    const data = this.props.data;
    const modelView = this.props.modelView;
    const valuesHash = this.props.valuesHash;

    // TODO: remove this code to reducer and save this data in store
    let periodType;

    switch (data.periodType) {
      case 'Q1':
        periodType = `За 1 квартал (${this.props.jsonData.year})`;
        break;

      case 'Q2':
        periodType = `За 1 полугодие (${this.props.jsonData.year})`;
        break;

      case 'Q3':
        periodType = `За 9 месяцев (${this.props.jsonData.year})`;
        break;

      case 'Q4':
        periodType = `За год (${this.props.jsonData.year})`;
        break;

      default:
        break;
    }

    return (
      <div className="excel">
        {
          this.props.savingDataFetching.response ?
            <ModalBox
              show={ this.state.renderModalBox }
              response={ this.props.savingDataFetching.response }
              mountModalBox={ this.mountModalBox }
              unmountModalBox={ this.unmountModalBox }
            /> :
            null
        }
        <h1>{ data.name }</h1>

        <p>Документ заполняется в тысячах рублей</p>

        <p>{ periodType }</p>

        {
          this.props.jsonData.edit ?
            <ul className="controls-list">
              <li>
                <button onClick={ this.onSaveData }>
                  {
                    this.props.savingDataFetching.fetching ?
                      <span>Сохраняю...</span> :
                      <span>Сохранить</span>
                  }
                </button>
              </li>
              <li>
                <button>Проверить</button>
              </li>
              <li>
                <button>Утвердить</button>
              </li>
              <li>
                <button>Загрузить данные из MS Excel</button>
              </li>
              <li>
                <button>Выгрузить данные в XML</button>
              </li>
            </ul> :
            <ul className="controls-list">
              <li>
                <button>Проверить</button>
              </li>
              <li>
                <button>Выгрузить данные в XML</button>
              </li>
            </ul>
        }

        <div className="excel-table">
          <TableHeaders data={ modelView }/>
          {
            modelView.table.rowParams.map((item, i) => {
              if (+item.rowNumber !== 1) {
                return (
                  <TableRows
                    row={ item }
                    data={ modelView }
                    dataAttrs={ this.props.data }
                    editable={ this.props.jsonData.edit }
                    valuesHash={ valuesHash }
                    key={ i }
                    onCellChange={ this.props.onCellChange }
                    dataKey={ i }
                    activeCell={ this.state.activeCell }
                    pasteData={pasteData}
                  />
                );
              }

              return null;
            })
          }
        </div>
      </div>
    );
  }
}
