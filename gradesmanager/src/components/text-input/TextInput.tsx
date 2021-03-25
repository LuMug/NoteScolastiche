import React, { Component } from 'react';
import './TextInput.css';

export interface ITextInputProps {

    inputType: 'text' | 'password' | 'number';

    placeHolder: string;

    toolTipText: string;

    onChange: (text: string) => void;
}

export default function TextInput(props: ITextInputProps) {
    let input = <input
        type={props.inputType}
        autoComplete="off"
        spellCheck="false"
        title={props.toolTipText}
        pattern=""
        onChange={(e) => props.onChange(e.target.value)}
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