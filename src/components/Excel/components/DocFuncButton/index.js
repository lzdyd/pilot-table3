import React, { Component } from 'react';

import './style.css';

export default class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHover: false
    }
  }

  handlerTitleVisible = () => {
    this.setState({ isHover: true });
  };


  handlerTitleInVisible = () => {
    this.setState({ isHover: false });
  };


  render() {
    const {
      disabled,
      alt,
      onclick,
      src
    } = this.props;

    return (
      <li
        onMouseOver={this.handlerTitleVisible}
        onMouseOut={this.handlerTitleInVisible}
        className="controls-list__item"
      >
        {
          this.state.isHover
            && <div className="button-title">{alt}</div>
        }
        <button
          disabled={disabled}
          onClick={onclick}
        >
          <img
            // src={`${CONTEXT}${src}`} //For Production
            src={src} //For Developer
            className="img-btn"
            alt={alt}
          />
        </button>
      </li>
    );
  }
}
