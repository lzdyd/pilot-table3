import React, { PureComponent } from 'react';


export default class ContextMenu extends PureComponent {

  fetchingDocHistory() {
    const {
      showHistory,
      curDoc,
      constextPopupIsShow
    } = this.props;

    showHistory(curDoc);
    constextPopupIsShow();
    return false;
  }

  render() {
    const {
      menuPositionX,
      menuPositionY,
      constextPopupIsShow,
      toArchive,
      toOk,
      showHistory,
      toEdit,
      curDoc
    } = this.props;

    const divStyle = {
      left: menuPositionX,
      top: menuPositionY
    };


    return (
      <div
        className="menu-context"
        id="context-menu"
        style={divStyle} >
        <a
          className="btn"
          onClick={toArchive.bind(this, curDoc)}
        >Перевести в архив
        </a>
        {/*<a*/}
          {/*className="btn"*/}
          {/*onClick={toOk.bind(this, curDoc)}*/}
        {/*>Перевести в УТВЕРЖДЕН*/}
        {/*</a>*/}
        {/*<a*/}
          {/*className="btn"*/}
          {/*onClick={toEdit.bind(this, curDoc)}*/}
        {/*>Перевести в Редактировать*/}
        {/*</a>*/}
        <a
          className="btn"
          onClick={::this.fetchingDocHistory}
        >Просмотреть версии документа
        </a>
      </div>
    );
  }
}
