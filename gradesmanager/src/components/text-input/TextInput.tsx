import React, { Component } from 'react';
import './TextInput.css';

export interface ITextInputProps {
    inputType: 'text' | 'password' | 'number';
    placeHolder: string;
    toolTipText: string;
}

export default class TextInput extends Component<ITextInputProps> {

    constructor(props: ITextInputProps) {
        super(props);
    }

    render() {
        let input;
        if (this.props.inputType == 'number') {
            input = <input
                type={this.props.inputType}
                step={0.25}
                autoComplete="off"
                spellCheck="false"
                title={this.props.toolTipText}
                tabIndex={1}
                pattern=""
                min={1}
                max={6}
            />;
        }
        return (
            <div className="ti-input">
                {input}
                <label className="ti-label">
                    <span>{this.props.placeHolder}</span>
                </label>
            </div>
        );
    }
}