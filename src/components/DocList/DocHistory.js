import React, { PureComponent } from 'react';


export default class DocHistory extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      header: ['Номер версии', 'Статус', 'Дата изменения', 'Автор'],
      idCheckedVersion: null,
      docId: null
    };

    this.toCheckedVersion = this.toCheckedVersion.bind(this);
  }

  renderHeaderDocHistory(data) {
    return data.map((item, i) => <div key={i} className="doc-history-header-item">{item}</div>);
  }

  renderRowsItemsDocHistory(data) {
    const rowsItems = [];
    rowsItems.push(
      <div className="doc-history-rows-items">{data.version}</div>,
      <div className="doc-history-rows-items">{data.status}</div>,
      <div className="doc-history-rows-items">{data.modifyDate}</div>,
      <div className="doc-history-rows-items">{data.modify_user}</div>
    );

    return rowsItems;
  }

  toCheckedVersion(e) {
    const id = +e.target.parentNode.dataset.id;
    this.props.saveDocHistoryId(id);

    const dochistory = this.props.dochistory;
    let url;

    let promise = new Promise((resolve, rejected) => {


      dochistory.forEach((item) => {
        if (item.id === id) {
          url =`getDocDataByKey?clientName=${item.client}&type=${item.type}&Q=${item.period}&year=${item.year}&edit=false&id=${id}`;
          resolve(url);
          return;
        }
      });
    });

    promise
      .then((response) => {
        console.log(response);
        window.open(response, '_blank')
      })
      .catch((errro) => console.log(error));

    return url;
  }


  renderRowsDocHistory(data) {
    const idChecked = this.props.isChecked;
    const rowsTemplate = data.map(
      (item, i) => {
        return (
          <a
            // href={idChecked && this.lookingDocs.call(this, idChecked)}
            target="_blank"
            onDoubleClick={::this.toCheckedVersion}
            data-id={item.id}
            className="doc-history-rows"
            key={i}>
            {this.renderRowsItemsDocHistory(item)}
          </a>
        );
      }
    );

    return rowsTemplate;
  }


  render() {
    const {
      menuPositionX,
      menuPositionY,
      closePopupHistory,
      dochistory
    } = this.props;

    const { header } = this.state;

    return (
      <div className="docs-history">
        <div className="docs-history-table-headers">
          {this.renderHeaderDocHistory(header)}
        </div>
        <div className="docs-history-table-rows">
          {this.renderRowsDocHistory(dochistory)}
        </div>
        <button
          onClick={closePopupHistory}
          className="close-btn"
        >
        </button>
      </div>
    );
  }
}
