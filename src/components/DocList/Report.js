import React, { Component } from 'react';

export default class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false
    }
  }

  setAnalyticYear() {
    if (!this.isCheckAnalyticYear(this.inputYear.value)) return;

    this.props.setAnalitycReportYear(this.inputYear.value);
    this.props.HideGenerateAnalyticReport();
  }

  isCheckAnalyticYear(date) {
    if (date >= 1996 && date <= 2017) {
      this.setState({
        isChecked: false
      });
      return true;
    }

    this.setState({
      isChecked: true
    });
  }


  render() {
    const { isChecked } = this.state;
    const { HideGenerateAnalyticReport } = this.props;

    return (
      <div className="report-popup">
        <p className="report-popup__text">
          Укажите финансовый года, за который необходимо сформировать отчет.
        </p>
        {
          isChecked &&
          <span className="year-popup-error">
              Поле "Год" должно быть в диапазоне от 1996 года и не позже текущего года!
            </span>
        }
        <label className="label-year-popup">
          Год
          <input
            ref={input => this.inputYear = input}
            defaultValue=""
            type="text"
          />
        </label>
        <div className="report-btn">
          <button
            onClick={::this.setAnalyticYear}
            className="create-report">Создать
          </button>
          <button
            onClick={HideGenerateAnalyticReport}
            className="close-report">Отмена
          </button>
        </div>
      </div>
    );
  }
}