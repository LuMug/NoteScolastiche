import GradeHelper from '../../helpers/GradeHelper';
import React, { Component, ReactNode } from 'react';
import SimpleTextInput from '../simple-text-input/SimpleTextInput';
import { IGrade } from '../../@types';
import './grade-prompt.css';

interface IGradePromptProps {

    onSubmit: (value: number, weight: number, date: Date) => void;

    onAbort: () => void;

    title: string;
}

export interface IGradePromptState {

    value?: number;

    weight?: number;

    date?: Date;
}

class GradePrompt extends Component<IGradePromptProps, IGradePromptState> {

    constructor(props: IGradePromptProps) {
        super(props);
        this.state = {
            value: 4.5,
            weight: 1.0,
            date: new Date()
        };
    }

    private onChangeGrade(value: number) {
        this.setState({
            value: Math.min(6, Math.max(1, value))
        });
    }

    private onChangeWeight(value: number) {
        this.setState({ weight: value });
    }

    private onChangeDate(value: Date) {
        this.setState({ date: value });
    }

    private onAbort() {
        // this.setState({
        //     value: 4.5,
        //     weight: 1,
        //     date: new Date()
        // });
        this.props.onAbort();
    }

    render(): ReactNode {
        let okBtnCName;
        if (!this.state.date || !this.state.value || !this.state.weight) {
            okBtnCName = 'gp-disabled';
        }
        return (
            <div className="gp-main">
                <div className="gp-content">
                    <h1 className="gp-title">{this.props.title}</h1>
                    <div className="gp-abort noselect" onClick={() => this.onAbort()}></div>
                    <div className="gp-inputs">
                        <div className="gp-input">
                            <SimpleTextInput
                                value={this.state.value}
                                forceType="number"
                                placeHolder="Nota"
                                toolTipText="La nota del test"
                                min={1}
                                max={6}
                                step={0.25}
                                onChange={(v) => this.onChangeGrade(v as number)}
                            />
                        </div>
                        <div className="gp-input">
                            <SimpleTextInput
                                value={this.state.weight}
                                forceType="number"
                                placeHolder="Peso"
                                toolTipText="Il peso della nota"
                                min={0}
                                step={0.1}
                                onChange={(v) => this.onChangeWeight(v as number)}
                            />
                        </div>
                        <div className="gp-input">
                            <SimpleTextInput
                                value={this.state.date}
                                forceType="date"
                                placeHolder="Data"
                                toolTipText="La data di consegna"
                                onChange={(v) => this.onChangeDate(v as Date)}
                            />
                        </div>
                    </div>
                    <div className={`gp-ok-btn ${okBtnCName} noselect`} onClick={() => {
                        this.props.onSubmit(
                            this.state.value as number,
                            this.state.weight as number,
                            this.state.date as Date
                        );
                        setTimeout(() => {
                            this.props.onAbort();
                        }, 80);
                    }}>OK</div>
                </div>
            </div>
        );
    }
}

export default GradePrompt;
