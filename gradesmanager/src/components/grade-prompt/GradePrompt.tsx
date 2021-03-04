import React, { Component, ReactNode } from 'react';
import TextInput from '../text-input/TextInput';
import './grade-prompt.css';

interface IGradePromptProps {

    onSubmit: () => void;

    onAbort: () => void;
}

interface IGradePromptState {

    value?: string;

    weight?: string;

    date?: Date;
}

class GradePrompt extends Component<IGradePromptProps, IGradePromptState> {

    constructor(props: IGradePromptProps) {
        super(props);
        this.state = {
            weight: '1',
            date: new Date()
        };
    }

    render(): ReactNode {
        return (
            <div className="gp-main">
                {/* <input type="text" name="value" id="value" className="gp-input" />
                <input type="text" name="weight" id="weight" className="gp-input" />
                <input type="text" name="date" id="date" className="gp-input" />
                <label htmlFor="value" className="gp-label">Value:</label>
                <label htmlFor="weight" className="gp-label"></label>
                <label htmlFor="date" className="gp-label"></label> */}
                <div className="gp-input">
                    <TextInput inputType="number" placeHolder="Value" toolTipText="The grade value" />
                </div>
                <div className="gp-input">
                    <TextInput inputType="text" placeHolder="Weight" toolTipText="The grade weight" />
                </div>
                <div className="gp-input">
                    <TextInput inputType="text" placeHolder="Date" toolTipText="When you took the test" />
                </div>
            </div>
        );
    }
}

export default GradePrompt;
