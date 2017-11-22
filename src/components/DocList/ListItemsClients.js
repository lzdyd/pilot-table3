import React, { PureComponent } from 'react';

export default class ListItemsClients extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: null
    }
  }


  getclientCurrent({ target }) {
    this.setState({
      isChecked: target.dataset.descr
    });
  }

  clickHandlerClientRemove() {
    this.props.handlerclientRemove();
    this.props.handlerOnClickHide();
    this.setState({ isChecked: false });
    this.props.filterListClients(null);
    this.textInput.value = '';
  }

  handleClientChecked() {
    this.props.handlerclientIsChecked(this.state.isChecked);

    const dataObjForRequst = {
      client: this.state.isChecked,
      year: this.props.yearIsChecked,
      period: this.props.periodIsChecked
    };

    this.props.getdocList(dataObjForRequst);
    this.props.setDataForFetchDocs(dataObjForRequst);

    this.props.handlerOnClickHide();
  }

  onDubleClickHandler () {
    this.handleClientChecked();
    this.getclientCurrent();
  }

  filterList(event) {
    let updatedList = this.props.listClient;

    updatedList = updatedList.filter(function(item){
      return item.descr.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });

    if (event.target.value.length === 0) {
      this.props.filterListClients(null);
      return;
    }
    this.props.filterListClients(updatedList);
  }

  render() {
    const { isChecked } = this.state;
    const {
      clientShow,
      handlerOnClickHide,
      listClientFiltered
    } = this.props;

    const clientClassName = `clients ${clientShow ? 'show' : ''}`;

    const clientItems = listClientFiltered && listClientFiltered.map((item, i) => {
      const clientListItemClassName = `clients-list__item ${isChecked === item.divid ? 'is-checked-client' : ''}`;
      return (
        <li
          className={clientListItemClassName}
          key={ i }
          id={item.id}
          data-descr={item.divid}
          onClick={::this.getclientCurrent}
          onDoubleClick={::this.onDubleClickHandler}
        >{ item.descr }
        </li>
      );
    });


    return (
      <div className={clientClassName}>
        <label className="clients-search-label">
          Поиск
          <input
            ref={(input) => { this.textInput = input; }}
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