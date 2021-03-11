import React from 'react';
import './grade-options.css';

// export type GradeOption = { name?: string; };

interface IGradeOptionsProps {

    // options: GradeOption[];

    onOptionClick: (index: number) => void;
}

function GradeOptions(props: IGradeOptionsProps) {

    let options = [0, 1];

    return (
        <div className="gp-main-content">
            {options.map((o, i) => {
                return <div
                    key={i}
                    className="gp-option-wrapper noselect"
                    onClick={() => props.onOptionClick(i)}>
                    <div className={`gp-option ${(i == 1) ? 'gp-option-delete' : ''}`}></div>
                </div>
            })}
        </div>
    );
}

export default GradeOptions;