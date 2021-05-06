import './prompt.css';

export interface IPromptProps {

    title: string;

    onAbort?: () => void;
}

const Prompt: React.FunctionComponent<IPromptProps> = (props) => {
    return (
        <div className="prom-wrapper">
            <div className="prom-prompt">
                <div className="prom-abort noselect" onClick={() => props.onAbort ? props.onAbort() : null}></div>
                <div className="prom-header">
                    <h1 className="prom-title">{props.title}</h1>
                </div>
                <div className="prom-body">
                    {props.children}
                </div>
            </div>
        </div>
    );
}
export default Prompt;