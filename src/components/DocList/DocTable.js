import React, { Component } from 'react';

import { TableHeader } from './TableHeader';
import FormList from './FormList';

export default function DocTable({
  dataPeriodAndYear,
  curYear,
  formsList,
  doclist,
  clientIsChecked
  }) {

  return (
    <div className="table">
      <TableHeader
        dataPeriodAndYear={dataPeriodAndYear}
        curYear={curYear}
      />
      {
        dataPeriodAndYear &&
        <FormList
          formsList={formsList}
          dataPeriodAndYear={dataPeriodAndYear}
          doclist={doclist}
          clientIsChecked={clientIsChecked}
        />
      }
    </div>
  );
}
