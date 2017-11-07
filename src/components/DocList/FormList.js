import React, { Component } from 'react';

import { AllPeriods } from './TableHeader';

function generateFormList(data) {
  const formsArray = [];

  data.forEach((item) => {
    const type = item.formType;

    if (type !== null && type === 'INPUT') {
      const formObject = {
        formid: item.formid,
        fullName: item.fullName,
        type: item.formType,
        periv: null
      };

      formsArray.push(formObject);
    }
  });

  return formsArray;
}


function renderFormList(data, docList_v2) {
  function docRender(key, isExist, docList_v2) {
    if (docList_v2.hasOwnProperty(key)) {
      isExist = true;
      const doc = docList_v2[key];
      return (
        <div
          className="doc"
          data-key={key}>
          <div className={`doc-status ${doc.status === 0 ?
            'red-status' : 'green-status'}`}>
          </div>
          <div className="doc-date">{doc.modify_date}</div>
          <div className="doc-version">вер.:{doc.version}</div>
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


  const rowsTemplate = data.map((item, i) => {
    if (item.type !== null && item.type === 'INPUT') {
      return (
        <div
          id={item.formid}
          key={i}
          className="table-rows-item"
        >
          <span
            className="table-header__items  table-header__items-fix"
          >{item.fullName}
          </span>
          {setDocFromList(AllPeriods, item.formid)}
        </div>
      );
    }
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
        creation_date: item.creation_date,
        modify_date: item.modify_date
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
      curDoc: null,
      curDocObj: null,
      popupIsShow: false
    };

    this.getcurDocData = this.getcurDocData.bind(this);
    this.popupClose = this.popupClose.bind(this);
  }


  getcurDocData({ target }) {
    const dataKey = target.dataset.key || target.parentNode.dataset.key;

    this.setState({
      curDoc: dataKey,
      curDocObj: this.getCurDoc(dataKey),
      popupIsShow: dataKey && true
    });
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


  setTitleForDocs(status, curDoc) {
    if (status === 0) {
      return (
        <p>Документ {::this.renderLabelDependFromForm(curDoc)} уже существует,
          открыть документ на редактирование или открыть документ на просмотр?</p>
      );
    } else if (status === 7) {
      return (
        <p>Документ {::this.renderLabelDependFromForm(curDoc)} уже существует в статусе утверждён,
          создать новую версию документа или открыть документ на просмотр?</p>
      );
    }

    // return (
    //   <p>Документ {this.renderLabelDependFromForm(curDoc)} отсутствует в выбранном периоде,
    //     создать новый документ </p>
    // )
  }

  setTitleForDocsDefault(curDoc) {
    return <p>Документ {this.renderLabelDependFromForm(curDoc)} отсутствует в выбранном периоде,
      создать новый документ </p>;
  }


  contextMenu(e) {
    const dataKey = e.target.dataset.key || e.target.parentNode.dataset.key;
    // console.log(e);
    console.log(dataKey);
  }

  getActionCurStatus(curDocObj, curDoc) {
    if (curDocObj.status === 0) {
      return (
        <button
          onClick={this.EditDocs.bind(this, curDocObj)}>
          Редактировать
        </button>
      );
    }

    return (
      <button
        onClick={this.createDocs.bind(this, curDocObj, curDoc)}>
        Создать
      </button>
    );
  }


  lookDocs(curDocObj) {
    console.log(curDocObj);
  }

  EditDocs(curDocObj) {
    console.log(curDocObj);
  }

  createDocs(curDocObj, curDoc) {
    console.log(curDoc);
    console.log(curDocObj && curDocObj);
  }


  render() {
    const {
      curDoc,
      curDocObj,
      popupIsShow
    } = this.state;

    const {
      formsList,
      dataPeriodAndYear,
      doclist
    } = this.props;

    const forms = generateFormList(formsList);
    const docList_v2 = createDocList(doclist);

    return (
      <div
        // onContextMenu={popupIsShow && ::this.renderLabelDependFromForm(curDoc, curDocObj)}
        className="TBL"
        onClick={this.getcurDocData}
      >
        {dataPeriodAndYear && renderFormList(forms, docList_v2)}
        <div className={`popup ${popupIsShow ? 'popup-show' : null}`}>
          <p className="popup-text">
            {popupIsShow && !curDocObj && ::this.setTitleForDocsDefault(curDoc)}
            {popupIsShow && curDocObj &&
            ::this.setTitleForDocs(curDocObj.status, curDoc)}
          </p>
          <div className="popup-btn">
            {popupIsShow && curDocObj &&
            this.getActionCurStatus(curDocObj, curDoc)}
            <button
              onClick={this.createDocs.bind(this, curDoc)}
              className={`${popupIsShow && curDocObj && 'none'}`}
            >Создать
            </button>
            <button
              onClick={this.lookDocs.bind(this, curDocObj)}
              className={`${!curDocObj ? 'none' : null}`}
            >Просмотреть
            </button>
            <button onClick={this.popupClose}>Отмена</button>
          </div>
        </div>

        <nav id="context-menu">
          <ul className="context-menu__items">
            <li className="context-menu__item">
              <a href="#" className="context-menu__link">
                <i className="fa fa-eye"></i> View Task
              </a>
            </li>
            <li className="context-menu__item">
              <a href="#" className="context-menu__link">
                <i className="fa fa-edit"></i> Edit Task
              </a>
            </li>
            <li className="context-menu__item">
              <a href="#" className="context-menu__link">
                <i className="fa fa-times"></i> Delete Task
              </a>
            </li>
          </ul>
        </nav>

      </div>
    );
  }
}