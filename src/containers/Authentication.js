import React, { Component } from 'react';
import '../components/DocList/style.scss';


export default class Authentication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      isRemember: false,
      error: false
    }
  }

  handleRememberChange() {
    this.setState({ isRemember: !this.state.isRemember });
  }

  handleLoginChange(e) {
    this.setState({ login: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handlerOnKeyDown(e) {
    if (e.key === 'Enter') {
      this.signIn();
    }
  }

  signIn() {
    const userName = this.state.login;
    const password = this.state.password;

    if (userName === 'admin' && password === 'admin') {
      this.props.onClick();
      this.props.fetchingClientsAndForms();
    } else if (userName === 'jamik' && password === 'jamik') {
      this.props.onClick();
      this.props.fetchingClientsAndForms();
    } else {
      this.setState({
        error: !this.state.error
      });
    }
  }

  render() {
    return (
      <form className="form-signin">
        <h2 className="form-signin-heading"> Войти в систему </h2>
        {this.state.error && <p className="error">Неверный логин или пароль</p>}
        <input
          type="text"
          id="inputText"
          className="form-control"
          placeholder="Логин"
          required="true"
          autoFocus="true"
          onChange={::this.handleLoginChange}
        />
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Пароль"
          required="true"
          onChange={::this.handlePasswordChange}
          onKeyDown={::this.handlerOnKeyDown}
        />
        <label htmlFor="checkbox-field" className="checkbox">
          <input
            type="checkbox"
            id="checkbox-field"
            onChange={::this.handleRememberChange}
          />
          Запомнить
        </label>
        <button
          className="btn btn-lg btn-primary btn-block"
          type="button"
          onClick={::this.signIn}
        > Войти
        </button>
      </form>
    );
  }
}