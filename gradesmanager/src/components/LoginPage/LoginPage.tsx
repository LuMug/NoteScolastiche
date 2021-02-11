import AboutButton from '../about-button/AboutButton';
import GradientButton from '../gradient-button/GradientButton';
import TextInput from '../text-input/TextInput';
import './LoginPage.css';


function test() {
    return (
        <div className="lp-main-content intro">
      <div className="lp-left-section">
        <div className="lp-left-top"></div>
        <div className="lp-left-bottom">
          <TextInput inputType="text" placeHolder="Username" toolTipText="Inserisci il nome utente della scuola"></TextInput>
          <TextInput inputType="password" placeHolder="Password" toolTipText="Inserisci la password di scuola"></TextInput>
        </div>
        <form className="lp-left-botbot" action="/home">
          <GradientButton />
        </form>
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
          <AboutButton />
        </div>
      </div>
    </div>
    );
}

export default test;
