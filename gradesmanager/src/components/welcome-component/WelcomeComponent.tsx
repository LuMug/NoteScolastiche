import './welcome-component.css';

interface IWelcomeComponentProps {
    name: string;
}

const WelcomeComponent: React.FunctionComponent<IWelcomeComponentProps> = (props) => {
    return (
        <div className="wc-main-content">
            <h1 className="wc-welcome-text">Benvenuto, <span className="capitalize">{props.name}</span></h1>
            <div className="wc-welcome-separator"></div>
        </div>
    );
}
export default WelcomeComponent;