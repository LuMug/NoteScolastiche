import './circular-fade-border.css';

const CircularFadeBorder: React.FunctionComponent<{}> = (props) => {
    return <div className="cfb-wrapper">
        <div className="cfb-border">
            <div className="cfb-content">{props.children}</div>
        </div>
    </div>
}

export default CircularFadeBorder;