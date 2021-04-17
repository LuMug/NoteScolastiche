import React, { Component } from 'react';
import './TextInput.css';

export interface ITextInputProps {

    inputType: 'text' | 'password' | 'number';

    placeHolder: string;

    toolTipText: string;

    onChange: (text: string) => void;

    onKeyPress?: (key: string) => void;
}

const TextInput: React.FunctionComponent<ITextInputProps> = (props) => {
    let input = <input
        type={props.inputType}
        autoComplete="false"
        spellCheck="false"
        title={props.toolTipText}
        pattern=""
        onChange={e => props.onChange(e.target.value)}
        onKeyPress={e => {
            if (props.onKeyPress) {
                props.onKeyPress(e.key);
            }
        }}
    />
    return (
        <div className="ti-input">
            {input}
            <label className="ti-label">
                <span>{props.placeHolder}</span>
            </label>
        </div>
    );
}
export default TextInput;