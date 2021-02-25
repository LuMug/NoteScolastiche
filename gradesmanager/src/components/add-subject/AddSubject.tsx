import './add-subject.css';

interface IAddSubject {

    onClick: () => void;
}

function AddSubject(props: IAddSubject) {

    return (
        <div className="as-main" onClick={() => props.onClick()}>
            <div className="as-icon noselect">+</div>
        </div>
    );
}

export default AddSubject;
