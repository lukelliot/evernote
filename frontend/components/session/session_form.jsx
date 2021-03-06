// React
import React from 'react';
import { Link } from 'react-router';

// Actions
import SessionActions from '../../actions/session_actions';
import ErrorActions from '../../actions/error_actions';

// Stores
import SessionStore from '../../stores/session_store';
import ErrorStore from '../../stores/error_store';

const SessionForm = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return({
      email: "",
      password: "",
      errors: []
    });
  },

  componentDidMount() {
    this.errorListener = ErrorStore.addListener(this._onErrorChange);
    ErrorActions.clearErrors();

    this.sessionListener = SessionStore.addListener(this._onSessionChange);
  },

  componentWillUnmount() {
    this.errorListener.remove();
    this.sessionListener.remove();
  },

  _onErrorChange() {
    this.setState({
      errors: ErrorStore.errors('signup')
    });
  },

  _onSessionChange() {
    if (SessionStore.isUserLoggedIn) {
      this.context.router.push('/main');
    }
  },

  updateEmail(e) {
    this.setState({ email: e.target.value });
  },

  updatePassword(e) {
    this.setState({ password: e.target.value });
  },

  _handleErrors() {
    let errs = this.state.errors;
    while (errs.length < 2) {
      errs = errs.concat([""]);
    }
    return errs;
  },

  _submitUser(e) {
    e.preventDefault();

    let path = this.props.location.pathname;
    if (path === '/signup') {
      SessionActions.signup(this.state);
    } else if (path === '/signin' ) {
      SessionActions.login(this.state);
    }
  },

  _setFormContext() {
    let path = this.props.location.pathname;

    if (path === '/signup') {
      return('Create Account');
    } else if (path === '/signin') {
      return('Sign In');
    }
  },

  _setEmailContextDisplay() {
    let path = this.props.location.pathname;

    if (path === '/signup') {
      return('Your Email Address');
    } else if (path === '/signin') {
      return('Email Address or username');
    }
  },

  _setPasswordContextDisplay() {
    let path = this.props.location.pathname;

    if (path === '/signup') {
      return('Create a password');
    } else if (path === '/signin') {
      return('Password');
    }
  },

  _guestLogin(e) {
    e.preventDefault();

    SessionActions.login({
      email: 'demo@fake.com',
      password: 'password'
    });
  },

  _setDisplayAltLink() {
    let path = this.props.location.pathname;

    if (path === '/signup') {
      return(
        <section className='alt-link'>
          <p className='link-prompt'>Already have an account?</p>
          <Link to='signin'>Sign In</Link>
        </section>
      );
    } else if (path === '/signin') {
      return(
        <section className='alt-link'>
          <p className='link-prompt'>Dont have an account?</p>
          <Link to='signup'>Create Account</Link>
          <p>or</p>
          <a onClick={ this._guestLogin }>Guest Login</a>
        </section>
      );
    }
  },

  render() {
    let errors = this._handleErrors(),
        passwordError = errors[0],
        emailError = errors[1];

    return(
      <article className='form-all'>
        <section className='form-header'>
          <img className='form-logo' src={ Images.logo } height='68' width='68' />
          <div className='form-title'><h1>{ this._setFormContext() }</h1></div>
          </section>
        <section className='form-body'>
          <form onSubmit={ this._submitUser } className='signup-form'>
            <div className='form-content'>
              <ol className='form-list'>
                <li className='client-input'>
                  <label className='input-type'>{ this._setEmailContextDisplay() }<br/>
                    <input className='text-input' type="text" onChange={ this.updateEmail } />
                    <div className='error'><div className='error-message'>{ emailError }</div></div>
                  </label>
                </li>
                <li className='client-input'>
                  <label className='input-type'>{ this._setPasswordContextDisplay() }<br/>
                    <input className='text-input' type="password" onChange={ this.updatePassword } />
                    <div className='error'><div className='error-message'>{ passwordError }</div></div>
                  </label>
                </li>
                <li className='submit'>
                  <button className='signup-submit' type='submit' >{ this._setFormContext() }</button>
                </li>
              </ol>
            </div>
          </form>
        </section>
        <section>
          { this._setDisplayAltLink() }
        </section>
      </article>
  );}
});

module.exports = SessionForm;
