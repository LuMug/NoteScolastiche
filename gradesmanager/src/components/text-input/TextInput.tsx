import React, { Component } from 'react';
import './TextInput.css';

export interface ITextInputProps {
    inputType: string;
    placeHolder: string;
    toolTipText: string;
}

export default class TextInput extends Component<ITextInputProps> {

    constructor(props: ITextInputProps) {
        super(props);
    }

    render() {
        return (
            <div className="input">
                <input
                    type={this.props.inputType}
                    autoComplete="off"
                    spellCheck="false"
                    title={this.props.toolTipText}
                    tabIndex={1}
                />
                <label className="label">
                    <span>{this.props.placeHolder}</span>
                </label>
            </div>
        );
    }
}
