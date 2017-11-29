import React, { Component } from 'react';
import axios from 'axios';

import TableHeaders from './components/TableHeaders';
import TableRows from './components/TableRows';
import DescrDocument from './components/DescrDocument/';
import Preloader from './components/Prealoader';
import DocFuncButton from './components/DocFuncButton';

import './style.scss';
import saveIcon from '../../../img/floppy.png';
import checkIcon from '../../../img/check.png';
import acceptIcon from '../../../img/accept.png';
import xmlIcon from '../../../img/xml.jpg';
import excelIcon from '../../../img/excel.png';

/**
 * Created by lzdyd
 */

export default class Excel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderModalBox: false,
      docToAccept: false,
      activeCell: 1
    };

    this.onSaveData = this.onSaveData.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handlerToAccept = () => {
    const { id } = this.props.jsonData;
    const url = `http://192.168.235.188:9081/prototype/docAccept?docid=${id}`;
    let data;

    //Пока что не работает
    const promise = new Promise((resolve) => {
      // this.props.onSaveData();
      // !this.props.savingDataFetching.fetching && resolve();
      let data;
      if (this.props.savingDataFetching.response) {
        data = JSON.parse(this.props.savingDataFetching.response);
        data && this.props.getDocumentData(null, data.id);
        debugger;
      }
      this.props.savingDataFetching.response && resolve();
    });

    promise
      .then((resolve) => {
        if (data.id) {
          axios.get(url, { withCredentials: true })
            .then((response) => {
              this.props.changeStatusEdit();

              this.setState({
                docToAccept: true
              });

              localStorage.setItem('accept', 'true');
              return response;
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err))
  };

  //Переписать, потому что модальное окно должно появляться,
  //после 100% сохранения документа в базе
  onSaveData() {
    this.props.onSaveData();
    this.setState({ renderModalBox: true });

    this.timer = setTimeout(() => {
      this.setState({ renderModalBox: false });
    }, 1000);
  }


  render() {
    const {
      data,
      jsonData,
      fetching,
      pasteData,
      modelView,
      valuesHash
    } = this.props;

    /**
     * If data is being fetched, render "Loading spinner"
     */
    if (fetching) {
      return <Preloader />
    }

    /**
     If data was not received, inform user about it
     */
    if (data === undefined) {
      return <h1>Something went wrong</h1>;
    }

    const modalBoxClass = "modal-box " + (this.state.renderModalBox ? "modal-box-show" : "modal-box-hide");
    const status = jsonData.status;
    const edit = jsonData.edit;

    return (
      <div className="excel">
        <div className={modalBoxClass}>Документ успешно сохранен!</div>
        <ul className="controls-list">
          <DocFuncButton
            src={saveIcon}
            alt="Созранить"
            onclick={this.onSaveData}
            disabled={!edit}
          />
          <DocFuncButton
            src={checkIcon}
            alt="Проверить"
          />
          <DocFuncButton
            src={acceptIcon}
            alt="Утвердить"
            onclick={this.handlerToAccept}
            disabled={status === 7 || !edit}
          />
          <DocFuncButton
            src={xmlIcon}
            alt="Выгрузить в Xml"
          />
          <DocFuncButton
            src={excelIcon}
            alt="Загрузить из MS Excel"
            disabled={!edit}
          />
        </ul>

        <h1>{ data.name }</h1>

        <DescrDocument descrDoc={jsonData}/>

        <div className="excel-table">
          <TableHeaders data={ modelView }/>
            {
              modelView.table.rowParams.map((item, i) => {
                if (+item.rowNumber !== 1) {
                  return (
                    <TableRows
                      key={ i }
                      row={ item }
                      dataKey={ i }
                      data={ modelView }
                      dataAttrs={ data }
                      pasteData={pasteData}
                      editable={ edit }
                      valuesHash={ valuesHash }
                      onCellChange={ this.props.onCellChange }
                      activeCell={ this.state.activeCell }
                    />
                  );
                }

              return null;
            })
          }
        </div>
      </div>
    );
  }
}
