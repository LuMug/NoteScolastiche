import Auth from '../../auth/Auth';
import GradientButton from '../gradient-button/GradientButton';
import LoadingPage from '../LoadingPage/LoadingPage';
import React, { useState } from 'react';
import TextInput from '../text-input/TextInput';
import { IUser } from '../../@types';
import { useHistory } from 'react-router-dom';
import './LoginPage.css';

interface ILoginPageProps {

  onLoginSuccess?: (uuid: number) => void;
}

const LoginPage = (props: ILoginPageProps) => {
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const attemptLogin = async () => {
    setShowError(false);
    setError('');
    if (username.trim() === '' || pw.trim() === '') {
      setShowError(true);
      setError('Riempi tutti i campi');
      return;
    }
    setLoading(true);
    let user: IUser | null = null;
    try {
      user = await Auth.login(username, pw);
    } catch (err) {
      setLoading(false);
      setShowError(true);
      let errMsg = err.error?.message.includes('incorrect')
        ? 'Nome utente o password errati'
        : err.error?.message.includes('valid username')
          ? 'Nome utente invalido'
          : err.error?.message || 'Internal error';
      setError(errMsg);
      return;
    }
    if (user) {
      if (props.onLoginSuccess) {
        props.onLoginSuccess(user.uid);
      }
      history.push('/');
    } else {
      setShowError(true);
      setError('Username o password invalidi');
    }
    setLoading(false);
  }

  const onKeyPressed = (key: string) => {
    if (key == 'Enter') {
      attemptLogin();
    }
  }

  let loader = loading
    ? <div className="lp-loading-icon"></div>
    : null;

  let errWrapper = showError
    ? <div className="lp-left-error-wrapper">
      <p className="lp-left-error">{error}</p>
    </div>
    : null;

  return (
    <div className="lp-page">
      <div className="lp-main-content intro">
        <div className="lp-left-section">
          <div className="lp-left-top">
            <div className="lp-left-title">
              <h1>Login</h1>
            </div>
          </div>
          <div className="lp-left-bottom">
            <TextInput
              inputType="text"
              placeHolder="Username"
              toolTipText="Inserisci il nome utente della scuola"
              onChange={(text) => setUsername(text)}
              onKeyPress={key => onKeyPressed(key)} />
            <TextInput
              inputType="password"
              placeHolder="Password"
              toolTipText="Inserisci la password di scuola"
              onChange={(text) => setPw(text)}
              onKeyPress={key => onKeyPressed(key)} />
            {errWrapper}
          </div>
          <div className="lp-left-botbot">
            {!loading
              ? <GradientButton message="Login" onClick={() => attemptLogin()} />
              : loader}
          </div>
        </div>
        <div className="lp-right-section">
          <div className="lp-right-title">
            <h1>Come fare?</h1>
          </div>
          <div className="lp-right-content">
            <div className="lp-le">
              <p className="lp-le-bullet">•</p>
              <div className="lp-le-content">Utilizza l'account di scuola:</div>
            </div>
            <div className="lp-le">
              <p className="lp-le-bullet">•</p>
              <div className="lp-le-content">
                <span className="lp-le-content-lowa">nome.cognome</span>
              </div>
            </div>
            <div className="lp-le">
              <p className="lp-le-bullet">•</p>
              <div className="lp-le-content">
                <span className="lp-le-content-lowa">La tua password</span>
              </div>
            </div>
            <div className="lp-le">
              <p className="lp-le-bullet">•</p>
              <div className="lp-le-content">
                <span className="lp-le-content-lowa">Clicca su </span>Login
              </div>
            </div>
          </div>
          <div>
            {/* <AboutButton /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
