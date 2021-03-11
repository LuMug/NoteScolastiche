import React from 'react';
import './add-grade-button.css';

interface IAddGradeButtonProps {

    onClick?: () => void;
}

function AddGradeButton(props: IAddGradeButtonProps) {

    return (
        <div className="agb-wrapper" onClick={() => { if (props.onClick) { props.onClick(); } }}>
            <div className="agb-add noselect">+</div>
        </div>
    );
}

export default AddGradeButton;
