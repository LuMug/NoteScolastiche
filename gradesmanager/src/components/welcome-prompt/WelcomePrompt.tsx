import Prompt, { IPromptProps } from '../prompt/Prompt';

interface IWelcomePromptProps extends Omit<IPromptProps, 'title'> {

}

const WelcomePrompt: React.FunctionComponent<IWelcomePromptProps> = (props) => {
    return <Prompt title="Hey!" onAbort={props.onAbort}>
        <p>Nuovo/a da queste parti?</p>
        <p>TODO: testo introduttivo per welcome message</p>
        <img className="prom-body-centered" src="#" alt="TODO: gif dove trovare sezione tutorial??" />
    </Prompt>
}
export default WelcomePrompt;