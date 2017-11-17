import React, { Component } from 'react';

import numeral from 'numeral';

import './style.scss';

export default class TableCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      editing: false
    };

    this.getLabel = this.getLabel.bind(this);
    this.getRowNumber = this.getRowNumber.bind(this);
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
      })
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

    console.log(this.refs.input.value);

    if (+this.refs.input.value !== this.props.value) {
      const id = this.props.data.docField;
      this.props.onCellChange(id, +this.refs.input.value);
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
    let len;
    let target = e.target.parentNode.parentNode;
    let arrValueTarget = [];

    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text').split(/\n/).map((item) => {
      let num = item.trim().replace(/\,/g, '.').split('');
      num.splice(num.indexOf('.'), 4);

      let pp1 = new RegExp("\\(", "g");
      let pp2 = new RegExp("\\)", "g");

      if (num.indexOf(' ') !== -1) {
        if (num.indexOf('(') !== -1) {
          num.splice(num.indexOf('('), 1);
          num.splice(num.indexOf(')'), 1);

          return -num.join('').replace(' ', '');
        }
        return num.join('').replace(' ', '');
      }

      if (num.indexOf('(') !== -1) {
        num.splice(num.indexOf('('), 1);
        num.splice(num.indexOf(')'), 1);

        return -num.join('');
      }

        return num.join('');
    });

    pastedData.pop();
    len = pastedData.length - 1;

    arrValueTarget.push('F' + target.childNodes[1].innerHTML);

    let i = 0;

    while (true) {
      if (!target.nextSibling.childNodes[2].dataset.key) {
        target = target.nextSibling;
        continue;
      }

      arrValueTarget.push('F' + target.nextSibling.childNodes[1].innerHTML);
      target = target.nextSibling;

      i++;

      if (i === len) {
        break;
      }
    }

    let mapValue = [];

    for (let i = 0; i < arrValueTarget.length; i++) {
      mapValue.push({
        id: arrValueTarget[i],
        value: +pastedData[i]
      });
    }

    return this.props.pasteData(mapValue);
  }

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
          )
        }

        return (
          <div className={ 'table-cell table-cell-data table-cell-input-field' }
               onClick={ ::this.onFocus }
               data-key={ this.props.dataKey }>
            {
              this.state.editing ?
                <input
                  onPaste={::this.handlePaste}
                  className="table-cell__input"
                  type="text"
                  ref="input"
                  defaultValue={ this.props.valuesHash[this.props.data.docField].value }
                  onBlur={ ::this.onBlur }
                /> :
                <span>{ numeral(this.props.valuesHash[this.props.data.docField].value).format('(0,0)') }</span>
              
                
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
    /*    if (this.state.editable) {
          return (
            <div className={ `table-cell table-cell-data ${this.props.data.formula ? '' : 'table-cell-input-field'}` }
                 onClick={ ::this.onFocus }>
              {
                this.state.editing ?
                  <input
                    className="table-cell__input"
                    type="text"
                    ref="input"
                    defaultValue={ this.props.value }
                    onBlur={ ::this.onBlur }
                  /> :
                  <span>{ numeral(this.props.value).format('(0,0)') }</span>
              }
            </div>
          );
        }
        return (
          <div className={ `table-cell table-cell-data ${this.props.data.formula ? 'table-cell-data-bold' : 'table-cell-input-field'}` }>
            {
              numeral(this.props.value).format('(0,0)')
            }
          </div>
        );*/
  }
}