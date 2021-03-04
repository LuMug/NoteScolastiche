import React, { Component } from 'react';
import './TextInput.css';

export interface ITextInputProps {

    inputType: 'text' | 'password' | 'number';

    placeHolder: string;

    toolTipText: string;
}

export default function TextInput(props: ITextInputProps) {
    let input = <input
        type={props.inputType}
        autoComplete="off"
        spellCheck="false"
        title={props.toolTipText}
        pattern=""
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