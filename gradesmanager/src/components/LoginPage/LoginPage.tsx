import AboutButton from '../about-button/AboutButton';
import GradientButton from '../gradient-button/GradientButton';
import HowToList from '../howto-list/HowToList';
import TextInput from '../text-input/TextInput';
import './LoginPage.css';


function LoginPage() {
    return (
        <div className="main-content intro">
            <div className="left-section">
                <div className="left-top"></div>
                <div className="left-bottom">
                    <TextInput placeHolder="Username" toolTipText="Inserisci il nome utente della scuola" inputType="text" />
                    <TextInput placeHolder="Password" toolTipText="Inserisci la password della scuola" inputType="password" />
                    <GradientButton />
                </div>
            </div>
            <div className="right-section">
                <div className="right-title">
                    <h1>Come fare?</h1>
                </div>
                <HowToList></HowToList>
                <AboutButton></AboutButton>
            </div>
        </div>
    );
}

export default LoginPage;
