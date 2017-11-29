import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';


import { AllPeriods } from './TableHeader';
import DocHistory from './DocHistory';
import ContextMenu from './ContextMenu';
import warning from '../../../img/warning.png';
import error from '../../../img/block.png';


function generateFormList(data) {
  const formsArray = [];
  
  data.forEach((item) => {
    const formid = item.formCode;

      const formObject = {
        formid: item.formCode,
        fullName: item.fullName,
        type: item.DocType,
        perivCode: item.perivCode
      };

      formsArray.push(formObject);
  });

  return formsArray;
}

function getClassDepenstatus(status) {
  switch (status) {
    case 0:
      return 'red-status';

    case 7:
      return 'green-status';

    default:
      return 'dark-status';
  }
}


function errorRate(data) {
  let res = 0;

  data.forEach((item) => {
    if (item.type > res) {
      res = item.type;
    }
  });

  return res;
}


function renderFormList(data, docList_v2) {
  function docRender(key, isExist, docList_v2) {
    if (docList_v2.hasOwnProperty(key)) {
      isExist = true;
      const doc = docList_v2[key];
      const rate = errorRate(doc.messages);
      return (
        <div
          className="doc"
          data-key={key}>
          <div className={`doc-status ${getClassDepenstatus(doc.status)}`}>
          </div>
          <div className="doc-date">{doc.modify_date}</div>
          <div className="doc-version">вер.:{doc.version}</div>
          {
            (() => {
              if (rate === 2) return <img className="indicate" src={error} alt=""/>;
              if (rate === 1) return <img className="indicate" src={warning} alt=""/>;
            })()
          }
        </div>
      );
    }
  }


  function setDocFromList(period, formId) {
    const arr = [];

    for (let i = 0; i < period.length; i++) {
      const key = `${formId}_${period[i].period}_${period[i].year}`;
      const isExist = false;

      arr.push(
        <span
          className="table-header__items table-rows__items"
          key={i}
          data-key={key}
          id={`${formId}_${i}`}
        >
          {docRender(key, isExist, docList_v2)}
        </span>
      );
    }

    return arr;
  }


  const rowsTemplate = data.map(({ formid, fullName }, i) => {
    return (
      <div
        id={formid}
        key={i}
        className="table-rows-item"
      >
        <span
          className="table-header__items  table-header__items-fix"
        >{fullName}
        </span>
        {setDocFromList(AllPeriods, formid)}
      </div>
    );
  });

  return rowsTemplate;
}

function createDocList(data) {
  const mapOfDocs = {};
  let doclist;

  if (data) {
    data.forEach((item) => {
      doclist = {
        id: item.id,
        status: item.status,
        version: item.version,
        period: item.period,
        year: item.year,
        client: item.client,
        type: item.type,
        creation_date: item.creationDate,
        modify_date: item.modifyDate,
        messages: [...item.messages]
      };

      const key = `${doclist.type}_${doclist.period}_${doclist.year}`;
      mapOfDocs[key] = doclist;
    });
  }

  return mapOfDocs;
}

export default class FormList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popupHistoryShow: false,
      curDoc: null,
      curDocObj: null,
      popupIsShow: false,
      constextPopupIsShow: false
    };

    this.constextPopupIsShow = this.constextPopupIsShow.bind(this);
    this.closePopupHistory = this.closePopupHistory.bind(this);
    this.getcurDocData = this.getcurDocData.bind(this);
    this.getCurDoc = this.getCurDoc.bind(this);
    this.popupClose = this.popupClose.bind(this);
    this.onKeydownhandler = this.onKeydownhandler.bind(this);
    this.setContextMenuPosition = _.throttle(this.setContextMenuPosition.bind(this), 0);
  }


  getcurDocData({ target }) {
    const dataKey = target.dataset.key || target.parentNode.dataset.key;

    this.setState({
      curDoc: dataKey,
      curDocObj: this.getCurDoc(dataKey),
      popupIsShow: dataKey && true,
      constextPopupIsShow: false,
      menuPositionX: null,
      menuPositionY: null
    });
  }

  componentDidMount() {
    let _this = this;

    document.addEventListener('keydown', this.onKeydownhandler);
    document.addEventListener('click', this.closeContextPpopup);

    window.addEventListener('storage', () => {
      localStorage.clear();
      _this.props.getdocList(_this.props.dataPeriodAndYear);
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydownhandler)
  }

  popupClose() {
    this.setState({
      popupIsShow: false
    });
  }

  // TODO переписать, потому что потому...
  getCurDoc(id) {
    const docList_v2 = createDocList(this.props.doclist);
    return docList_v2[id];
  }

  renderLabelDependFromForm(curdoc) {
    const docForm = curdoc.split('_')[0];

    if (docForm === 'FORM01') {
      return <span className="popup-title">Бухгалтерский баланс</span>;
    } else if (docForm === 'FORM02') {
      return <span className="popup-title">Отчёт о финансовых результатах</span>;
    }
  }

  getclientDescr(id) {
    for (let item of this.props.listClient) {
      if (item.divid === id) {
        return item.descr;
      }
    }
  }

  setTitleForDocs(status, curDoc) {
    let doc = curDoc.split('_');

    if (status === 0) {
      return (
        <p className="popup-text">Открыть документ {::this.renderLabelDependFromForm(curDoc)} за {doc[1]} кв {doc[2]} года
          по клиенту {this.getclientDescr(this.props.clientIsChecked)}?
        </p>
      );
    } else if (status === 7 || status === 3) {
        return (
          <p className="popup-text">Документ {::this.renderLabelDependFromForm(curDoc)} за {doc[1]} кв {doc[2]} года
            по клиенту {this.getclientDescr(this.props.clientIsChecked)} утверждён
            или находится в архиве. Создать новую версию?
          </p>
        );
    }
  }

  setTitleForDocsDefault(curDoc) {
    let doc = curDoc.split('_');

    return (
      <p className="popup-text">Документ {this.renderLabelDependFromForm(curDoc)} за {doc[1]} кв {doc[2]} года
        отсутствует в выбранном периоде. Создать новый документ?
      </p>
    );
  }

  setContextMenuPosition(e) {
    let menuPosition = this.getPosition(e);
    const dataKey = e.target.dataset.key  || e.target.parentNode.dataset.key;

    this.setState({
      curDoc: dataKey,
      menuPositionX: menuPosition.x + "px",
      menuPositionY: menuPosition.y + "px"
    });
  }

  contextssss(e) {
    e.preventDefault();
    e.persist();
    this.setContextMenuPosition(e);
    this.setState({
      constextPopupIsShow: true,
      popupHistoryShow: false
    });
  }

  getPosition(e) {
    let posx = 0;
    let posy = 0;

    if (e.clientX || e.nativeEvent) {
      posx = e.clientX;
      posy = e.nativeEvent.offsetY;
    }

    return {
      x: posx,
      y: posy
    }
  }

  onKeydownhandler(e) {
    const { constextPopupIsShow, popupIsShow } = this.state;

    if (e.keyCode === 27) {
      if (constextPopupIsShow) {
        this.setState({
          constextPopupIsShow: false
        });
      }
      if (popupIsShow) {
        this.setState({
          popupIsShow: false
        });
      }
    }
  }

  getActionCurStatus(curDocObj, curDoc) {
    if (curDocObj.status === 0) {
      return (
        <a
          className="btn"
          href={this.toEditDocs.call(this, curDocObj) + '&edit=true&status=' + curDocObj.status}
          target="_blank"
        >
          Редактировать
        </a>
      );
    }

    return (
      <a
        href={this.toEditDocs.call(this, curDocObj) + '&edit=true&status=' + curDocObj.status}
        target="_blank"
        className="btn"
      >
        Создать
      </a>
    );
  }

  toEditDocs({ client, period, year, type, id }) {
    return `${CONTEXT}getDocDataByKey?clientName=${client}&type=${type}&Q=${period}&year=${year}&id=${id}`;
  }

  createDocs(curDoc, client) {
    let doc =  curDoc.split('_');
    return `${CONTEXT}getDocDataByKey?clientName=${client}&type=${doc[0]}&Q=${doc[1]}&year=${doc[2]}&edit=true`;
  }

  constextPopupIsShow() {
    this.setState({ constextPopupIsShow: false });
  }

  showHistory(curDoc, e) {
    let promise = new Promise((resolve, rejected) => {
      resolve(this.getCurDoc(curDoc));
    });

    promise
      .then(doc => {
        this.props.fetchDocHistory(doc);
        this.setState({
          popupHistoryShow: true
        });
      })
      .catch(error => console.log(error));
  }

  toArchive(curDoc, e) {
    let doc = this.getCurDoc(curDoc);
    const { getdocList, dataPeriodAndYear } = this.props;
    const url = doc && `http://192.168.235.188:9081/prototype/setStatus?docid=${doc.id}&status=3`;

    let promise = new Promise((resolve, rejected) => {
      if (doc) {
        axios.get(url, {
          withCredentials: true
        })
          .then((response) => response)
          .then(response => {
            if (response.status === 200) resolve()
          })
          .catch((err) => console.log(err));
      }
    });

    promise
      .then((response) => getdocList(dataPeriodAndYear))
      .catch((err) => console.log(err))
  }

  toOk(curDoc, e) {
    let doc = this.getCurDoc(curDoc);
    const url = `http://192.168.235.188:9081/prototype/setStatus?docid=${doc.id}&status=7`;

    let promise = new Promise((resolve, rejected) => {
      axios.get(url, {
        withCredentials: true
      })
        .then(response => response)
        .then(response => {
          if (response.status === 200) resolve()
        })
        .catch(err => console.log(err));
    });

    promise
      .then(response => {
        let res = this.props.getdocList(this.props.dataPeriodAndYear);
      })
      .catch(err => console.log(err))
  }

  toEdit(curDoc, e) {
    let doc = this.getCurDoc(curDoc);
    const url = `http://192.168.235.188:9081/prototype/setStatus?docid=${doc.id}&status=0`;

    let promise = new Promise((resolve, rejected) => {
      axios.get(url, {
        withCredentials: true
      })
        .then(response => response)
        .then(response => {
          if (response.status === 200) resolve()
        })
        .catch(err => console.log(err));
    });

    promise
      .then(response => {
        let res = this.props.getdocList(this.props.dataPeriodAndYear);
      })
      .catch(err => console.log(err))
  }

  closePopupHistory() {
    this.setState({
      popupHistoryShow: false
    });
  }

  render() {
    const {
      popupHistoryShow,
      curDoc,
      curDocObj,
      popupIsShow,
      constextPopupIsShow,
      menuPositionX,
      menuPositionY
    } = this.state;

    const {
      formsList,
      dataPeriodAndYear,
      doclist,
      clientIsChecked,
      dochistory,
      saveDocHistoryId
    } = this.props;

    const positionX = menuPositionX;
    const positionY = menuPositionY;

    const divStyle = {
      left: positionX,
      top: positionY
    };

    const forms = generateFormList(formsList);
    const docList_v2 = createDocList(doclist);

    const popupClass = `popup ${popupIsShow ? 'popup-show' : ''}`;
    const popupClassNameBtnCreate = `btn ${popupIsShow && curDocObj && 'none'}`;
    const popupClassNameBtnLook = `btn ${!curDocObj ? 'none' : ''}`;

    const popupBtnHref = `${popupIsShow && this.createDocs.call(this, curDoc, clientIsChecked)}&edit=true`;

    return (
      <div
        onContextMenu={::this.contextssss}
        className="TBL"
        onClick={this.getcurDocData}
      >
        {dataPeriodAndYear.client && renderFormList(forms, docList_v2)}
        <div className={popupClass}>
          {popupIsShow && !curDocObj && ::this.setTitleForDocsDefault(curDoc)}
          {popupIsShow && curDocObj && ::this.setTitleForDocs(curDocObj.status, curDoc)}

          <div className="popup-btn">
            {popupIsShow && curDocObj && this.getActionCurStatus(curDocObj, curDoc)}
            {popupIsShow &&
              <a
                href={popupBtnHref}
                target="_blank"
                className={popupClassNameBtnCreate}
              >Создать
              </a>
            }
            {popupIsShow && curDocObj &&
              <a
                href={`${this.toEditDocs.call(this, curDocObj)}&edit=false` }
                target="_blank"
                className={popupClassNameBtnLook}
              >Просмотреть
              </a>
            }
            <a
              className="btn"
              onClick={this.popupClose}
            >Отмена
            </a>
          </div>
        </div>

        {constextPopupIsShow &&
          <ContextMenu
            curDoc={curDoc}
            menuPositionX={menuPositionX}
            menuPositionY={menuPositionY}
            toArchive={::this.toArchive}
            toOk={::this.toOk}
            toEdit={::this.toEdit}
            showHistory={::this.showHistory}
            constextPopupIsShow={::this.constextPopupIsShow}
          />
        }
        {popupHistoryShow &&
          <DocHistory
            div={divStyle}
            menuPositionX={menuPositionX}
            menuPositionY={menuPositionY}
            dochistory={dochistory}
            saveDocHistoryId={saveDocHistoryId}
            closePopupHistory={::this.closePopupHistory}
          />}
      </div>
    );
  }
}
