import React, { Component } from 'react';

export default class ListItemsClients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: null
    }
  }

  getclientCurrent({ target }) {
    this.setState({
      isChecked: target.id
    });
  }

  clickHandlerClientRemove() {
    this.props.handlerclientRemove();
    this.props.handlerOnClickHide();
  }

  handleClientChecked() {
    this.props.handlerclientIsChecked(this.state.isChecked);
    this.props.handlerOnClickHide();
  }

  onDubleClickHandler () {
    this.handleClientChecked();
    this.getclientCurrent();
  }

  filterList(event) {
    let updatedList = this.props.listClient;
    updatedList = updatedList.filter(function(item){
      return item.value.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    console.log(updatedList);
    this.props.filterListClients(updatedList);
  }

  render() {
    const { isChecked } = this.state;
    const {
      clientShow,
      handlerOnClickHide,
      listClientFiltered
    } = this.props;

    const clientItems = listClientFiltered.map((item, i) => {
      return (
        <li
          className={`clients-list__item ${isChecked === item.id ?
            'is-checked-client' : ''}`}
          key={ i }
          id={item.id}
          onClick={::this.getclientCurrent}
          onDoubleClick={::this.onDubleClickHandler}
        >{ item.value }
        </li>
      );
    });

    return (
      <div className={`clients ${clientShow ? 'show' : ''}`}>
        <label className="clients-search-label">
          Поиск
          <input
            type="text"
            className="clients-search"
            required
            onInput={this.filterList.bind(this)}
          />
        </label>
        <ul className="clients-list">
          { clientItems }
        </ul>
        <div className="clients-btn">
          <button
            className="receiveBtn"
            onClick={::this.handleClientChecked}
            disabled={!isChecked}
          > Выбрать
          </button>
          <button onClick={::this.clickHandlerClientRemove}>Очистить</button>
          <button onClick={handlerOnClickHide}>Отмена</button>
        </div>
      </div>
    );
  }
}