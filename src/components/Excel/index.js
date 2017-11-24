import React, { Component } from 'react';

import TableHeaders from './components/TableHeaders';
import TableRows from './components/TableRows';
import DescrDocument from './components/DescrDocument/';

import './style.scss';
import saveIcon from '../../../img/floppy.png';
import checkIcon from '../../../img/check.png';
import acceptIcon from '../../../img/accept.png';
import xmlIcon from '../../../img/xml.jpg';
import excelIcon from '../../../img/excel.png';

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
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onSaveData() {
    this.props.onSaveData();
    this.setState({ renderModalBox: true });

    this.timer = setTimeout(() => {
      this.setState({ renderModalBox: false });
    }, 1000);
  }


  render() {
    const {
      pasteData,
      status,
      toAcceptDoc,
      onClickHandlerToAccept,
      descrDoc,
      jsonData
    } = this.props;

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

    const modalBoxClass = "modal-box " + (this.state.renderModalBox ? "modal-box-show" : "modal-box-hide");

    return (
      <div className="excel">
        <div className={modalBoxClass}>Документ успешно сохранен!</div>
        {
          this.props.jsonData.edit ?
            <ul className="controls-list">
              <li>
                <button onClick={ this.onSaveData }>
                  <img
                    src={saveIcon}
                    className="img-btn"
                    alt="Созранить"
                    title="Созранить"
                  />
                </button>
              </li>
              <li>
                <button>
                  <img
                    title="Проверить"
                    src={checkIcon}
                    className="img-btn"
                    alt="Проверить"
                  />
                </button>
              </li>
              {
                status !== 7 &&
                  <li>
                    <button onClick={onClickHandlerToAccept}>
                      <img
                        src={acceptIcon}
                        alt="Утвердить"
                        title="Утвердить"
                      />
                    </button>
                  </li>
              }
              <li>
                <button>
                  <img
                    src={excelIcon}
                    alt="Выгрузить в Excel"
                    title="Выгрузить в Excel"
                  />
                </button>
              </li>
              <li>
                <button>
                  <img
                    src={xmlIcon}
                    alt="Загруить Xml"
                    title="Загруить Xml"
                  />
                </button>
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
        <h1>{ data.name }</h1>
        <DescrDocument descrDoc={jsonData}/>
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
