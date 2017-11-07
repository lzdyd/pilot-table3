import React, { Component } from 'react';
import ListItemsClients from './ListItemsClients';
import ReportPeriod from './ReportPeriod';
import Report from './Report';
import DocTable from './DocTable';
import './style.css';

export let data;
const curPeriod = Math.ceil((new Date().getMonth() + 1) / 3);
const currentTime = new Date();
const curYear = currentTime.getFullYear();

const clients = {
  '1-10KWGP': 'Эсти',
  '1-1PALWC': 'Весенний холм',
  '1-2DTA97': 'Брокинвестсервис',
  '1-2W1T5D': 'СК Октябрьский'
};

const periods = {
  1: '1 квартал',
  2: '2 квартал',
  3: '3 квартал',
  4: '4 квартал'
};

const formsList = [
  {
    formType: 'INPUT',
    formid: 'FORM01',
    fullName: 'Бухгалтерский баланс'
    // perivCode:
  },
  {
    formType: 'INPUT',
    formid: 'FORM02',
    fullName: 'Отчет о финансовых результатах'
    // perivCode:
  }
];


export class DocList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listClient: clients,
      isPeriod: periods,
      clientShow: false,
      clientIsChecked: null,
      periodIsChecked: curPeriod,
      yearIsChecked: curYear,
      dataPeriodAndYear: null,
      formsList,
      docPeriods: null,
      showGenerateReport: false,
      analyticReportYear: null
    }
  }


  setAnalitycReportYear(date) {
    this.setState({
      analyticReportYear: date
    });
  }

  showGenerateAnalyticReport() {
    this.setState({
      showGenerateReport: true
    });
  }

  HideGenerateAnalyticReport() {
    this.setState({
      showGenerateReport: false
    });
  }


  receiveOnClick() {
    const obj = {
      client: this.state.clientIsChecked,
      year: this.state.yearIsChecked,
      period: this.state.periodIsChecked
    };

    this.setState({
      dataPeriodAndYear: obj
    });

    return obj;
  }


  handlerOnClickShow() {
    this.setState({
      clientShow: true
    });
  }

  handlerclientRemove() {
    this.setState({
      clientIsChecked: null
    });
  }


  handlerOnClickHide() {
    this.setState({
      clientShow: false
    });
  }

  handlerclientIsChecked(id) {
    this.setState({
      clientIsChecked: id
    });
  }

  handlerPeriodIsChecked(e) {
    this.setState({
      periodIsChecked: e.target.value
    });
  }

  handlerYearIsChecked(e) {
    this.setState({
      yearIsChecked: e.target.value
    });
  }


  render() {
    const {
      getdocList,
      doclist
    } = this.props;

    const {
      listClient,
      clientShow,
      clientIsChecked,
      isPeriod,
      dataPeriodAndYear,
      formsList,
      showGenerateReport
    } = this.state;


    return (
      <div className="">
        Клиент:
        <button
          onClick={::this.handlerOnClickShow}
          className='clients-items-btn'
        >{!clientIsChecked ?
          'Выберите клиента из справочника' : listClient[clientIsChecked]}
          ▼
        </button>
        <button
          onClick={::this.showGenerateAnalyticReport}
          disabled={!clientIsChecked && 'true'}
        >
          Сформировать аналитический отчет
        </button>
        {
          showGenerateReport &&
          <Report
            clientIsChecked={clientIsChecked}
            setAnalitycReportYear={::this.setAnalitycReportYear}
            HideGenerateAnalyticReport={::this.HideGenerateAnalyticReport}
          />
        }
        <ReportPeriod
          receiveOnClick={::this.receiveOnClick}
          handlerYearIsChecked={::this.handlerYearIsChecked}
          handlerPeriodIsChecked={::this.handlerPeriodIsChecked}
          isPeriod={isPeriod}
          clientIsChecked={clientIsChecked}
          getdocList={getdocList}
          dataPeriodAndYear={dataPeriodAndYear}
        />
        <ListItemsClients
          handlerclientRemove={::this.handlerclientRemove}
          handlerOnClickHide={::this.handlerOnClickHide}
          handlerclientIsChecked={::this.handlerclientIsChecked}
          clientIsChecked={clientIsChecked}
          listClient={listClient}
          clientShow={clientShow}
        />
        <DocTable
          dataPeriodAndYear={dataPeriodAndYear}
          formsList={formsList}
          doclist={doclist}
        />
      </div>
    );
  }
}