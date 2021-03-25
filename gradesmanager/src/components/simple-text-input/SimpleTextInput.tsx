import GradeHelper from '../../helpers/GradeHelper';
import { Component } from 'react';
import { ITextInputProps } from '../text-input/TextInput';
import './simple-text-input.css';

type STIOptions = 'text' | 'number' | 'password' | 'date';

interface ISimpleTextInputProps<T extends STIOptions> extends Omit<Omit<ITextInputProps, 'inputType'>, 'onChange'> {

    value?: T extends 'number'
    ? number
    : T extends 'date'
    ? Date
    : string;

    step?: number;

    min?: number;

    max?: number;

    forceType?: STIOptions;

    onChange: (newValue: T extends 'number'
        ? number
        : T extends 'date'
        ? Date
        : string) => void;
}

interface ISimpleTextInputState {

    value?: number | string | Date;
}

export default class SimpleTextInput<T extends STIOptions> extends Component<ISimpleTextInputProps<T>, ISimpleTextInputState> {

    constructor(props: ISimpleTextInputProps<T>) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    private onChange(value: any) {
        this.setState({ value: value });
        this.props.onChange(value);
    }

    render() {
        let input;
        if (typeof this.props.value == 'number') {
            input = <input
                type={this.props.forceType || typeof this.props.value}
                title={this.props.toolTipText}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                value={this.state.value as number}
                onChange={(e) => this.onChange(e.target.valueAsNumber)}
            />;
        } else if (typeof this.props.value == 'string' || !this.props.value) {
            input = <input
                type={this.props.forceType || "text"}
                autoComplete="off"
                spellCheck="false"
                title={this.props.toolTipText}
                value={this.state.value?.toString() || ''}
                onChange={(e) => this.onChange(e.target.value)}
            />;
        } else if (typeof this.props.value == 'object') {
            let date = new Date(this.state.value as string);
            let dateComps = GradeHelper.getDate({ date: date.toISOString(), value: -1, weight: -1 }).split('.');
            input = <input
                type={this.props.forceType || "date"}
                autoComplete="off"
                spellCheck="false"
                title={this.props.toolTipText}
                defaultValue={`${dateComps[2]}-${dateComps[1]}-${dateComps[0]}`}
                onChange={(e) => this.onChange(e.target.valueAsDate)}
            />;
        }
        return (
            <div className="sti-input">
                {input}
                <label className="sti-label">
                    <span>{this.props.placeHolder}</span>
                </label>
            </div>
        );
    }
}