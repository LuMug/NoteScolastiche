import { Component } from 'react';
import './GradientButton.css';

export interface IGradientButtonProps {

    onClick: () => void;

    message?: string;
}

export default class GradientButton extends Component<IGradientButtonProps> {

    render() {
        return (
            <div className="gb-button-wrapper"
                onClick={() => this.props.onClick()}>
                <div className="gb-button-border">
                    <input
                        type="submit"
                        className="gb-login-button"
                        tabIndex={3}
                        value={this.props.message}
                    />
                </div>
            </div>

        );
    }
}
