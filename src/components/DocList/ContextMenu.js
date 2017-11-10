import React, { PureComponent } from 'react';


export default class ContextMenu extends PureComponent {

  fetchingDocHistory() {
    this.props.foo(this.props.curDoc);
    this.props.constextPopupIsShow();
    return false;
  }

  render() {
    const {
      menuPositionX,
      menuPositionY,
      constextPopupIsShow,
      toArchive,
      toOk,
      foo,
      toEdit,
      curDoc
    } = this.props;

    const divStyle = {
      left: menuPositionX,
      top: menuPositionY
    };

    // console.log(this.props.div);

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
