import React, { Component } from 'react';

import numeral from 'numeral';

import './style.scss';

export default class TableCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      editing: false,
      onPaste: false
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this.getRowNumber = this.getRowNumber.bind(this);
    // this.keyPressHandler = _.throttle(this.keyPressHandler.bind(this), 0);
  }

  /**
   Checks if cell is editable
   */
  componentWillMount() {
    if (!this.props.data.formula) {
      this.setState({
        editable: true
      });
    }

    if (this.props.activeCell === this.props.dataKey) {
      this.setState({
        // editing: true
      });
    }
  }


  onFocus() {
    this.setState({ editing: true }, () => {
      this.refs.input.focus();
    });
  }

  onBlur() {
    this.setState({
      editing: false
    });

    if (+this.refs.input.value !== this.props.value) {
      const id = this.props.data.docField;
      if (!this.state.onPaste && this.refs.input.value) {
        this.props.onCellChange(id, Math.round(+this.refs.input.value));
      }
    }
  }

  getLabel(total) {
    if (total && !this.props.data.docFieldLabel) {
      return this.props.data.cellText;
    }

    const label = this.props.dataAttrs.attributes.filter((item) => {
      return item.id === this.props.data.docFieldLabel;
    });

    return label[0].label;
  }

  getRowNumber() {
    return this.props.data.cellText;
  }

  handlePaste (e) {
    let clipboardData;
    let pastedData;
    let target = e.target.parentNode.parentNode;
    let arrValueTarget = [];

    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text').split(/\n/).map((item) => {

      let num;

      if (item.indexOf('(') !== -1) {
        num = -item.replace(/[^0-9]/g, '');
      } else {
        num = item.replace(/[^0-9]/g, '');
      }

      return num;
    });

    let len = pastedData.length - 1;
    let i = 0;

    arrValueTarget.push('F' + target.childNodes[1].innerHTML);

    while (true) {
      if (!target.nextSibling.childNodes[2].dataset.key) {
        target = target.nextSibling;
        continue;
      }

      arrValueTarget.push('F' + target.nextSibling.childNodes[1].innerHTML);
      target = target.nextSibling;

      i++;

      if (i === len) break;
    }

    let mapValue = [];

    for (let i = 0; i < arrValueTarget.length; i++) {
      mapValue.push({
        id: arrValueTarget[i],
        value: +pastedData[i]
      });
    }

    this.setState({
      onPaste: true
    });

    return this.props.pasteData(mapValue);
  }

  // keyPress = (e) => {
  //   this.keyPressHandler(e);
  // };
  //
  // keyPressHandler({ charCode }) {
  //   if (charCode < 48 || charCode > 57 ) {
  //     console.log(charCode);
  //     return false;
  //   }
  // };

  render() {
    const cellType = this.props.data.style;

    switch (cellType) {
      case 'TextField':
        return (
          <div className="table-cell table-cell-label">
            { this.getLabel() }
          </div>
        );

      case 'TextTotal':
        return (
          <div className="table-cell table-cell-label table-cell-label-bold">
            { this.getLabel(true) }
          </div>
        );

      case 'RowNumber':
        return (
          <div className="table-cell table-cell-rowNumber">
            { this.getRowNumber() }
          </div>
        );

      case 'RowNumberTotal':
        return (
          <div className="table-cell table-cell-rowNumber table-cell-rowNumber-total">
            { this.getRowNumber() }
          </div>
        );

      case 'NumberField':
        if (!this.props.editable) {
          return (
            <div className={ 'table-cell table-cell-data' }>
              <span>{ numeral(this.props.valuesHash[this.props.data.docField].value).format('(0,0)') }</span>
            </div>
          );
        }

        return (
          <div
            className={ 'table-cell table-cell-data table-cell-input-field' }
            onClick={ this.onFocus }
            data-key={ this.props.dataKey }>
            {
              this.state.editing ?
                <input
                  onKeyPress={this.keyPress}
                  onPaste={::this.handlePaste}
                  className="table-cell__input"
                  type="text"
                  ref="input"
                  defaultValue={ this.props.valuesHash[this.props.data.docField].value }
                  onBlur={ this.onBlur }
                /> :
                  (() => {
                    if (this.props.valuesHash[this.props.data.docField].value ||
                        this.props.valuesHash[this.props.data.docField].value === 0) {
                      return (
                        <span>
                          {numeral(this.props.valuesHash[this.props.data.docField].value).format('(0,0)')}
                        </span>
                      );
                    } else if (this.props.valuesHash[this.props.data.docField].value === null) {
                      return <span></span>;
                    }


                  })()
                // <span>
                //   {numeral(this.props.valuesHash[this.props.data.docField].value).format('(0,0)')}
                // </span>
            }
          </div>
        );

      case 'TotalField':
        return (
          <div className="table-cell table-cell-data table-cell-data-bold">
            {
              numeral(this.props.valuesHash[this.props.data.docField].value).format('(0,0)')
            }
          </div>
        );

      default:
        break;
    }

    return (
      <div className="table-cell"></div>
    );
  }
}
