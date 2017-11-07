import React, { Component } from 'react';

import TableCell from '../TableCell/index';

import './style.scss';

export default class TableRows extends Component {
  render() {
    const currentRow = this.props.data.table.cells.filter((item) => {
      return item.row === this.props.row.rowNumber;
    });

    const currentRowHTML = currentRow.map((item, i) => {
      return (
        <TableCell data={ item } key={ i } activeCell={ this.props.activeCell } dataKey={ this.props.dataKey}
                   dataAttrs={ this.props.dataAttrs } valuesHash={ this.props.valuesHash }
                   onCellChange={ this.props.onCellChange }/>
      );
    });

    // return (
    //   <div className="table-row">
    //     <div className={ `table-cell table-cell-label ${this.props.data.formula ? 'table-cell-label-bold' : ''}` }>
    //       { this.props.data.label }
    //     </div>
    //     <div className={ `table-cell table-cell-label ${this.props.data.formula ? 'table-cell-label-bold' : ''}` }>
    //       { this.props.data.id }
    //     </div>
    //     <TableCell data={ this.props.data } value={ this.props.value } onCellChange={ this.props.onCellChange } />
    //   </div>
    // );
    return (
      <div className="table-row">
        { currentRowHTML }
      </div>
    );
  }
}
