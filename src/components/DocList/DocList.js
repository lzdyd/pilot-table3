import React, { Component } from 'react';
import ListItemsClients from './ListItemsClients';
import ReportPeriod from './ReportPeriod';
import Report from './Report';
import DocTable from './DocTable';
import './style.css';
// import axios from 'axios';

export let data;

//TODO ПЕРЕДЕЛАТЬ В UTILS getCurPeriod И getCurYear
const curPeriod = Math.ceil((new Date().getMonth() + 1) / 3);
const currentTime = new Date();
const curYear = currentTime.getFullYear();


const periods = {
  1: '1 квартал',
  2: '2 квартал',
  3: '3 квартал',
  4: '4 квартал'
};


export class DocList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPeriod: periods,
      clientShow: false,
      clientIsChecked: null,
      periodIsChecked: curPeriod,
      yearIsChecked: curYear,
      dataPeriodAndYear: null,
      docPeriods: null,
      showGenerateReport: false,
      analyticReportYear: null
    };

    this.onKeydownhandler = this.onKeydownhandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydownhandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydownhandler)
  }


  changePeriodsOnNext() {
    let { periodIsChecked, yearIsChecked } = this.state;

    if (periodIsChecked !== 4) {
      this.setState({periodIsChecked: ++periodIsChecked});
      return;
    }
    if (yearIsChecked !== curYear) {
      this.setState({periodIsChecked: 1, yearIsChecked: ++yearIsChecked});
    }
  }

  changePeriodsOnPrev() {
    let { periodIsChecked, yearIsChecked } = this.state;

    if (periodIsChecked !== 1) {
      this.setState({periodIsChecked: --periodIsChecked});
      return;
    }
    if (yearIsChecked !== 1996) {
      this.setState({periodIsChecked: 4, yearIsChecked: --yearIsChecked});
    }
  }


  onKeydownhandler(e) {
    const { clientShow } = this.state;

    if (e.keyCode === 27) {
      if (this.state.clientShow) {
        this.setState({
          clientShow: false
        });
      }

      if (this.state.showGenerateReport) {
        this.setState({
          showGenerateReport: false
        });
      }
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

  setClient(listClient, clientId) {
    let res;
    listClient.forEach((item) => {
      if (item.divid === clientId) {
        res = item.descr;
      }
    });

    return res;
  }


  render() {
    const {
      getdocList,
      doclist,
      listClientFiltered,
      listClient,
      formsList,
      filterListClients
    } = this.props;

    const {
      clientShow,
      clientIsChecked,
      isPeriod,
      dataPeriodAndYear,
      showGenerateReport,
      periodIsChecked,
      yearIsChecked
    } = this.state;


    return (
      <div className="">
        Клиент:
        <button
          onClick={::this.handlerOnClickShow}
          className='clients-items-btn'
        >{!clientIsChecked ? 'Выберите клиента из справочника' :
            ::this.setClient(listClient, clientIsChecked)}
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
          changePeriodsOnPrev={::this.changePeriodsOnPrev}
          changePeriodsOnNext={::this.changePeriodsOnNext}
          receiveOnClick={::this.receiveOnClick}
          handlerYearIsChecked={::this.handlerYearIsChecked}
          handlerPeriodIsChecked={::this.handlerPeriodIsChecked}
          isPeriod={isPeriod}
          clientIsChecked={clientIsChecked}
          getdocList={getdocList}
          // dataPeriodAndYear={dataPeriodAndYear}
          periodIsChecked={periodIsChecked}
          yearIsChecked={yearIsChecked}
        />
        <ListItemsClients
          handlerclientRemove={::this.handlerclientRemove}
          handlerOnClickHide={::this.handlerOnClickHide}
          handlerclientIsChecked={::this.handlerclientIsChecked}
          filterListClients={filterListClients}
          clientIsChecked={clientIsChecked}
          listClient={listClient}
          listClientFiltered={listClientFiltered}
          clientShow={clientShow}
        />
        <DocTable
          dataPeriodAndYear={dataPeriodAndYear}
          formsList={formsList}
          doclist={doclist}
          clientIsChecked={clientIsChecked}
        />
      </div>
    );
  }
}