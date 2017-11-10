import React, { PureComponent } from 'react';

import './style.scss';

export default class ReportPeriod extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false
    };

    this.isCheckAnalyticYear = this.isCheckAnalyticYear.bind(this);
  }

  componentDidMount () {
    this.isCheckAnalyticYear();
  }

  isCheckAnalyticYear() {
    const inputValue = this.inputText.value;
    console.log(inputValue);

    if (inputValue >= 1996 && inputValue <= 2017) {
      this.setState({
        isChecked: true
      });

      return false;
    }

    this.setState({
      isChecked: false
    });
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
    const { isChecked } = this.state;

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

    const labalYearClassName = '' + (!isChecked ? 'error-border' : '');

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
        {
          !isChecked &&
            <span className="year-popup">
                Поле "Год" должно быть в диапазоне от 1996 года и не позже текущего года!
            </span>
        }
        <label className="label-year">
          Год
          <input
            onBlur={this.isCheckAnalyticYear}
            ref={input => this.inputText = input}
            className={labalYearClassName}
            defaultValue={yearIsChecked}
            onChange={handlerYearIsChecked}
            type="text"
          />
        </label>
        <button
          onClick={::this.getDocs}
          disabled={!clientIsChecked && isChecked}
        >применить ✔
        </button>
        <button onClick={::this.changePeriodsPrev}>◄ назад</button>
        <button onClick={::this.changePeriodsOnNext}>вперед ►</button>
      </div>
    );
  }
}
