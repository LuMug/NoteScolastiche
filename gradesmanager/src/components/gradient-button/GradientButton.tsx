import React, { Component } from 'react';
import './GradientButton.css';

export interface IGradientButtonProps {

    onClick: () => void;

    message?: string;
}

export default class GradientButton extends Component<IGradientButtonProps> {

    constructor(props: IGradientButtonProps) {
        super(props);
    }

    render() {
        return (
            <div className="gb-button-wrapper"
                onClick={() => this.props.onClick()}>
                <div className="gb-button-border">
                    <input
                        type="submit"
                        className="gb-login-button"
                        tabIndex={3}
                        value="Login"
                    />
                </div>
            </div>

        );
    }
}
