import React, { Component } from 'react';

import TableHeaders from './components/TableHeaders';
import TableRows from './components/TableRows';

import './style.scss';

export default class Excel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCell: 1
    }
  }

  onSaveData() {
    this.props.onSaveData();
  }

  render() {
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

    // TODO: remove this code to reducer
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
        <h1>{ data.name }</h1>

        <p>Документ заполняется в тысячах рублей</p>

        <p>{ periodType }</p>

        <button onClick={ ::this.onSaveData }>Сохранить</button>

        <div className="excel-table">
          <TableHeaders data={ modelView }/>
{/*          {
            data.attributes.map((item) => {
              return (
                <TableRows data={ item } value={ valuesHash[item.id].value } key={ item.id }
                           onCellChange={ this.props.onCellChange}/>
              );
            })
          }*/}
          {
            modelView.table.rowParams.map((item, i) => {
              if (+item.rowNumber !== 1) {
                return (
                  <TableRows row={ item } data={ modelView } dataAttrs={ this.props.data }
                             valuesHash={ valuesHash } key={ i } onCellChange={ this.props.onCellChange }
                             dataKey={ i } activeCell={ this.state.activeCell } />
                );
              }

              return null;
            })
          }
        </div>
      </div>
    );
/*
    return (
      <div className="excel">
        <h1>{ data.title }</h1>

        <p>{ data.description }</p>

        <div className="excel-table">
          <TableHeaders data={ data.tableHeaders }/>
          {
            data.attributes.map((item) => {
              return (
                <TableRows data={ item } value={ valuesHash[`id${item.id}`].value } key={ item.id }
                           onCellChange={ this.props.onCellChange } />
              );
            })
          }
        </div>
      </div>
    );*/
  }
}
