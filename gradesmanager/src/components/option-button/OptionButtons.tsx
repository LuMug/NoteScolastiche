import React, { Component } from 'react';
import './OptionButton.css';

export interface IOptionButtonProps {

    message?: string;
}

export default class OptionButton extends Component<IOptionButtonProps> {

    constructor(props: IOptionButtonProps) {
        super(props);
    }

    render() {
        return (
            <div className="ob-buttons">
                <input type="button" className="ob-add-button" value="AGGIUNGI"/>
                <input type="button" className="ob-option-button" value="..." />
            </div>

        );
    }
}
