import React from 'react';

import './style.scss';

export default function ReportPeriod({
                                       isPeriod,
                                       handlerPeriodIsChecked,
                                       handlerYearIsChecked,
                                       receiveOnClick,
                                       getdocList,
                                       clientIsChecked,
                                       dataPeriodAndYear
                                     }) {
  const curPeriod = Math.ceil((new Date().getMonth() + 1) / 3);

  const perodItemsTemplate = Object.keys(isPeriod).map((item, i) => {
    return (
      <option
        value={item}
        key={i}
      >{isPeriod[item]}
      </option>
    );
  });

  const currentTime = new Date();
  const curYear = currentTime.getFullYear();
  const limitYear = 1996;

  function getYear() {
    const periods = [];

    for (let i = +curYear; i >= limitYear; i--) {
      periods.push(
        <option
          value={i}
          key={i}
        >{i}
        </option>
      );
    }

    return periods;
  }

  function getDocs() {
    // const { period, year } = dataPeriodAndYear;
    receiveOnClick();
    getdocList();
  }

  return (
    <div className='report-period'>
      Отчетный период:
      <select
        className="select-periods"
        defaultValue={curPeriod}
        onChange={handlerPeriodIsChecked}
      >
        { perodItemsTemplate }
      </select>
      <select
        defaultValue={curYear}
        onChange={handlerYearIsChecked}
      >
        { getYear() }
      </select>
      <button
        onClick={getDocs}
        disabled={!clientIsChecked}
      >применить ✔
      </button>
      <button>◄ назад</button>
      <button>вперед ►</button>
    </div>
  );
}
