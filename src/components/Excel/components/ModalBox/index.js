import React, { Component } from 'react';

export default class ModalBox extends Component {
  componentDidMount() {
    this.props.mountModalBox();

    this.timer = setTimeout(() => {
      this.props.unmountModalBox();
    }, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    if (this.props.state) {
      return <div id="modalbox">{ this.props.response.message }</div>;
    }

    return null;
  }
}
