import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import className from 'classnames';
import $ from 'jquery';
import { openExternal } from '../utils/app_utils';
import AuthLoader from './auth_loader';
import { MESSAGES } from '../constant';

export default class Settings extends Component {

  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
    this.checkAuthenticated = this.checkAuthenticated.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.clearErrMsg = this.clearErrMsg.bind(this);
  }

  static propTypes = {
    userLogin: PropTypes.func.isRequired,
    cancelAuthReq: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    authProcessing: PropTypes.bool.isRequired
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  checkAuthenticated(props) {
    if (props.authenticated) {
      return this.context.router.push('/account_app_list');
    }
  }

  showPassword(e) {
    const currentTarget = e.currentTarget;
    if (currentTarget.classList.contains('active')) {
      currentTarget.classList.remove('active');
    } else {
      currentTarget.classList.add('active');
    }
    const targetEle = this.refs[currentTarget.dataset.target];
    if (targetEle.getAttribute('type') === 'text') {
      return targetEle.setAttribute('type', 'password');
    }
    targetEle.setAttribute('type', 'text');
  }

  clearErrMsg(e) {
    let ele = $(e.currentTarget);
    let parentEle = ele.parent();
    if (!parentEle.hasClass('error')) {
      return;
    }
    let msgEle = ele.siblings('.msg');
    parentEle.removeClass('error');
    msgEle.text('');
  }

  componentWillMount() {
    this.props.resetUser();
    this.checkAuthenticated(this.props);
  }

  componentWillUpdate(nextProps) {
    const { error, showToaster } = nextProps;
    this.checkAuthenticated(nextProps);
    this.errMsg = null;
    if (error) {
      this.errMsg = window.msl.errorCodeLookup(error.errorCode || 0);
      switch (this.errMsg) {
        case 'CoreError::RequestTimeout':
          this.errMsg = 'Request timed out';
          break;
        case 'CoreError::GetFailure::GetError::NoSuchAccount':
        case 'CoreError::GetFailure::GetError::NoSuchData':
          this.errMsg = 'Account not found';
          break;
        case 'CoreError::SymmetricDecipherFailure':
          this.errMsg = 'Invalid password';
          break;
        default:
          this.errMsg = this.errMsg.replace('CoreError::', '');
      }
      this.errMsg = 'Login failed. ' + this.errMsg;
      showToaster(this.errMsg, { autoHide: true, error: true });
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const { networkStatus, userLogin } = this.props;

    if (networkStatus !== 1) {
      this.props.showToaster(MESSAGES.NETWORK_NOT_CONNECTED, { autoHide: true });
      console.log(MESSAGES.NETWORK_NOT_CONNECTED);
      return;
    }

    let accountSecretVal = accountSecret.value.trim()
    let accountPasswordVal = accountPassword.value.trim();
    if (!accountSecretVal || !accountPasswordVal) {
      return;
    }
    this.isLoading = true;
    userLogin({
      accountSecret: accountSecretVal,
      accountPassword: accountPasswordVal
    });
  }

  render() {
    const { error, user, authenticated, authProcessing, showToaster } = this.props;
    if (authProcessing) {
      return <AuthLoader { ...this.props }/>
    }

    let inputGrpClassNames = className(
      'inp-grp',
      { 'error': this.errMsg }
    );

    return (
      <div className="form-b">
        <form className="form" name="loginForm" onSubmit={this.handleLogin}>
          <div id="errorTarget" className={inputGrpClassNames}>
            <input id="accountSecret" type="password" ref="accountSecret" required="true" onFocus={ this.onFocus } onKeyUp={this.clearErrMsg} autoFocus />
            <label htmlFor="accountSecret">Account Secret</label>
            <div className="msg">{ this.errMsg ? this.errMsg : '' }</div>
            <div className="opt">
              <div className="opt-i">
                  <span className="eye" onClick={this.showPassword} data-target="accountSecret"></span>
              </div>
            </div>
          </div>
          <div className="inp-grp">
            <input id="accountPassword" type="password" ref="accountPassword" required="true" />
            <label htmlFor="accountPassword">Account Password</label>
            <div className="msg"></div>
            <div className="opt">
              <div className="opt-i">
                  <span className="eye" data-target="accountPassword" onClick={this.showPassword}></span>
              </div>
            </div>
          </div>
          <div className="inp-btn">
            <button type="submit" className="btn primary" name="login">Login</button>
          </div>
        </form>
        <div className="form-f">
          <div className="form-f-b">
            Don&rsquo;t have a account ? <a href="#" onClick={e => {
              e.preventDefault();
              this.context.router.push('register');
            }}>Create Account</a>
          </div>
        </div>
      </div>
    )
  }
}