import React, { Component } from 'react';

import TableCell from '../TableCell/index';

import './style.scss';

export default class TableRows extends Component {
  render() {
    const { pasteData } = this.props;

    const currentRow = this.props.data.table.cells.filter((item) => {
      return item.row === this.props.row.rowNumber;
    });

    const currentRowHTML = currentRow.map((item, i) => {
      return (
        <TableCell
          data={ item }
          key={ i }
          editable={ this.props.editable }
          activeCell={ this.props.activeCell }
          dataKey={ this.props.dataKey}
          dataAttrs={ this.props.dataAttrs }
          valuesHash={ this.props.valuesHash }
          onCellChange={ this.props.onCellChange }
          pasteData={pasteData}
        />
      );
    });

    return (
      <div className="table-row">
        { currentRowHTML }
      </div>
    );
  }
}
