import React, { Component } from 'react';
import './AboutButton.css';

export interface IAboutButtonProps {

    message?: string;
}

export default class AboutButton extends Component<IAboutButtonProps> {

    constructor(props: IAboutButtonProps) {
        super(props);
    }

    render() {
        return (
            <div className="about-button-wrapper">
                <div className="about-button-border">
                    <input
                        type="submit"
                        className="about-button"
                        tabIndex={3}
                        value="?"
                        onClick={() => {
                            let el = document.getElementById('content');
                            if(el){
                                el.style.display = 'block';
                            }
                        }}
                    />
                </div>
                <div className="ab-popup" id="content">
                    <p>Progetto svolto da: Ambrosetti Nicola, Previtali Aris, Trentin Ismael e Viola Francisco</p>
                </div>
            </div>

        );
    }
}
