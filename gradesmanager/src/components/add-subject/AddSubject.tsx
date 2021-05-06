import './add-subject.css';

interface IAddSubjectProps {
    onClick: () => void;
}

const AddSubject: React.FunctionComponent<IAddSubjectProps> = (props: IAddSubjectProps) => {
    return (
        <div className="as-main" onClick={() => props.onClick()}>
            <div className="as-icon noselect">+</div>
        </div>
    );
}

export default AddSubject;