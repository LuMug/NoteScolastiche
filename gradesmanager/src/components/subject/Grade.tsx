import React from 'react'
import { IGrade } from '../../@types';

interface IGradeProps {

    gradeObj: IGrade;

    editable?: boolean;
}

function Grade(props: IGradeProps) {

    return (
        <input
            type="number"
            min="1"
            max="6"
            value={props.gradeObj.value.toFixed(1)}
            disabled={!props.editable}
            step="0.25"
            className="editable-p s-subject-grade"
        />
    );
}

export default Grade;