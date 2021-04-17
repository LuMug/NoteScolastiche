import './circular-fade-border.css';

interface ICircularFadeBorderProps {

    fontSize?: 'small' | 'medium';
}

const CircularFadeBorder: React.FunctionComponent<ICircularFadeBorderProps> = (props) => {
    let cname;
    if (props.fontSize) {
        cname = (props.fontSize == 'medium') ? '' : '';
    } else {
        cname = 'cfb-medium-font';
    }
    return <div className="cfb-wrapper">
        <div className="cfb-border">
            <div className={`cfb-content ${cname}`}>{props.children}</div>
        </div>
    </div>
}

export default CircularFadeBorder;