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
            <div className="ab-about-button-wrapper">
                <div className="ab-about-button-border">
                    <input
                        type="submit"
                        className="ab-about-button"
                        tabIndex={3}
                        value="?"
                        onClick={() => {
                            let el = document.getElementById('ab-content');
                            if(el){
                                let display = el.style.display;
                                if(el && display == 'none'){
                                    el.style.display = 'block';
                                    el.style.visibility = 'visible';
                                }else{
                                    el.style.display = 'none';
                                    el.style.visibility = 'hidden';
                                }
                            }
                        }}
                    />
                </div>
                <div className="ab-popup" id="ab-content">
                    <p>Progetto svolto da: Ambrosetti Nicola, Previtali Aris, Trentin Ismael e Viola Francisco</p>
                </div>
            </div>

        );
    }
}
