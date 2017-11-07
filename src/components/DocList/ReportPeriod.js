import React, { Component } from 'react';

import './style.scss';

export default class ReportPeriod extends Component {

   getYear() {
    const currentTime = new Date();
    const curYear = currentTime.getFullYear();
    const limitYear = 1996;
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

  getDocs() {
    const dataObjForRequst = {
      client: this.props.clientIsChecked,
      year: this.props.yearIsChecked,
      period: this.props.periodIsChecked
    };

     this.props.getdocList(dataObjForRequst);
      this.props.receiveOnClick();
  }

  changePeriodsPrev() {
    let promise = new Promise((resolve, reject) => {
      this.props.changePeriodsOnPrev();
      resolve();
    });

    promise
      .then(result => this.getDocs())
      .catch(err => console.log(err));
  }

  changePeriodsOnNext() {
    let promise = new Promise((resolve, reject) => {
      this.props.changePeriodsOnNext();
      resolve();
    });

    promise
      .then(result => this.getDocs())
      .catch(err => console.log(err));
  }

  render () {
    const {
      isPeriod,
      handlerPeriodIsChecked,
      handlerYearIsChecked,
      clientIsChecked,
      yearIsChecked,
      periodIsChecked,
    } = this.props;

    const perodItemsTemplate = Object.keys(isPeriod).map((item, i) => {
      return (
        <option
          value={item}
          key={i}
        >{isPeriod[item]}
        </option>
      );
    });

    return (
      <div className='report-period'>
        Отчетный период:
        <select
          className="select-periods"
          defaultValue={periodIsChecked}
          onChange={handlerPeriodIsChecked}
        >
          { perodItemsTemplate }
        </select>
        <select
          defaultValue={yearIsChecked}
          onChange={handlerYearIsChecked}
        >
          { this.getYear() }
        </select>
        <button
          onClick={::this.getDocs}
          disabled={!clientIsChecked}
        >применить ✔
        </button>
        <button onClick={::this.changePeriodsPrev}>◄ назад</button>
        <button onClick={::this.changePeriodsOnNext}>вперед ►</button>
        <span className="test">{periodIsChecked}</span>
        <span>{yearIsChecked}</span>
      </div>
    );
  }
}
