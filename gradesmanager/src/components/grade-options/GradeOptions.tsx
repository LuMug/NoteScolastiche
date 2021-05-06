import './grade-options.css';

interface IGradeOptionsProps {
    onOptionClick: (index: number) => void;
}

const GradeOptions: React.FunctionComponent<IGradeOptionsProps> = (props: IGradeOptionsProps) => {
    let options = [0, 1];
    return (
        <div className="gp-main-content">
            {options.map((o, i) => {
                return <div
                    key={i}
                    className="gp-option-wrapper noselect"
                    onClick={() => props.onOptionClick(i)}>
                    <div className={`gp-option ${(i === 1) ? 'gp-option-delete' : ''}`}></div>
                </div>
            })}
        </div>
    );
}

export default GradeOptions;