import React, { Component } from 'react';

import './style.scss';

export let AllPeriods;

const curPeriod = Math.ceil((new Date().getMonth() + 1) / 3);

export class TableHeader extends Component {

  /**
   * Generate headers for table
   * @returns {Array.<*>}
   */
  generateHeaders() {
    const { period, year } = this.props.dataPeriodAndYear;
    const periods = [];
    const currentTime = new Date();
    let p = +period || curPeriod;
    let y = +year || currentTime.getFullYear();

    for (let i = 0; i < 10; i++) {
      periods.push({
        period: p,
        year: y
      });

      p -= 1;
      if (p === 0) {
        p = 4;
        y -= 1;
      }
    }

    return periods.reverse();
  }

  /**
   * Render headers
   * @param data {<Array>}
   */
  renderHeaders(data) {
    const templateHeaders = data.map((item, i) => {
      let text = '';
      switch (item.period) {
        case 1:
          text = 'I';
          break;
        case 2:
          text = 'II';
          break;
        case 3:
          text = 'III';
          break;
        case 4:
          text = 'IV';
          break;
      }
      return (
        <span key={i} className="table-header__items">
          {`${text} квартал ${item.year}` }
        </span>
      );
    });

    return templateHeaders;
  }

  render() {
    const { dataPeriodAndYear } = this.props;
    let Allperiod;

    return (
      <div className='table-header'>
        {
          dataPeriodAndYear &&
          <span className="table-header__items table-header__items-fix"></span>
        }
        {
          dataPeriodAndYear &&
          (Allperiod = AllPeriods = ::this.generateHeaders()) && ::this.renderHeaders(Allperiod)
        }
      </div>
    );
  }
}
