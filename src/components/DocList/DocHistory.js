import React, { Component } from 'react';


export default class DocHistory extends Component {

  // foo(e) {
  //   e.preventDefault();
  //   this.props.closePopupHistory();
  //   this.props.constextPopupIsShow();
  // }

  render() {
    const {
      menuPositionX,
      menuPositionY,
      closePopupHistory
    } = this.props;



    // console.log(this.props.div);

    return (
      <div className="docs-history">HISTORY
        <button
          onClick={closePopupHistory}
          className="close-btn"
        >
        </button>
      </div>
    );
  }
}
