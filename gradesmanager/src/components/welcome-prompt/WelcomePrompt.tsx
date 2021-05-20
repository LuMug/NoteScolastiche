import Prompt, { IPromptProps } from '../prompt/Prompt';

interface IWelcomePromptProps extends Omit<IPromptProps, 'title'> {

    htmlData?: string;
}

const WelcomePrompt: React.FunctionComponent<IWelcomePromptProps> = (props) => {
    return <Prompt title="Hey!" onAbort={props.onAbort}>
        <p>Nuovo/a da queste parti?</p>
        <p>TODO: testo introduttivo per welcome message</p>
        <p>TODO: parse html in pre</p>
        <img className="prom-body-centered" src="#" alt="TODO: gif dove trovare sezione tutorial??" />
    </Prompt>
}
export default WelcomePrompt;