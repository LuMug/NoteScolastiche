import AboutButton from '../about-button/AboutButton';
import Auth from '../../auth/Auth';
import FetchHelper from '../../helpers/FetchHelper';
import GradientButton from '../gradient-button/GradientButton';
import TextInput from '../text-input/TextInput';
import {
  Link,
  Redirect,
  RouteComponentProps,
  useHistory
  } from 'react-router-dom';
import { useState } from 'react';
import './LoginPage.css';

interface ILoginPageProps {

  onLoginSuccess?: (uuid: number) => void;
}

const LoginPage = (props: ILoginPageProps) => {
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const history = useHistory();

  const attemptLogin = async () => {
    let uid = await Auth.login(username, pw);
    if (uid) {
      if (props.onLoginSuccess) {
        props.onLoginSuccess(uid);
      }
      history.push('/');
    }
  }

  const onKeyPressed = (key: string) => {
    console.warn('A');
    if (key == 'Enter') {
      attemptLogin();
    }
  }

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
          </div>
          <div className="lp-left-botbot">
            <GradientButton onClick={() => attemptLogin()} />
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
