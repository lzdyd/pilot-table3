import React from 'react';

import './style.scss';

export default function({ data }) {
  const headerCells = data.table.cells.filter(item => +item.row === 1);

  const tableHeaders = data.table.columnParams.map((item, i) => {
    return (
      <div className="table-cell table-cell-headers" key={ i }>
        { headerCells[i].cellText }
      </div>
    );
  });

  return (
    <div className="table-row table-row-headers">
      { tableHeaders }
    </div>
  );
}
