import SimpleTextInput from '../simple-text-input/SimpleTextInput';
import { useEffect, useState } from 'react';
import './grade-prompt.css';

interface IGradePromptProps {

    onSubmit: (value: number, weight: number, date: Date) => void;

    onAbort: () => void;

    title: string;

    value?: number;

    weight?: number;

    date?: Date;
}

const GradePrompt: React.FunctionComponent<IGradePromptProps> = (props) => {
    const [value, setValue] = useState<number>(props.value ? props.value : 4.5);
    const [weight, setWeight] = useState<number>(props.weight ? props.weight : 1);
    const [date, setDate] = useState<Date>(props.date ? props.date : new Date());

    const reset = () => {
        setValue(4.5);
        setWeight(1);
        setDate(new Date());
    }

    const onChangeGrade = (value: number) => {
        setValue(Math.min(6, Math.max(1, value)));
    }

    const onChangeWeight = (value: number) => {
        setWeight(value);
    }

    const onChangeDate = (value: Date) => {
        setDate(value);
    }

    const onAbort = () => {
        reset();
        props.onAbort();
    }

    const onSubmit = (value: number, weight: number, date: Date) => {
        reset();
        props.onSubmit(value, weight, date);
    }

    let okBtnCName;
    if (!date || !value || !weight) {
        okBtnCName = 'gp-disabled';
    }
    return (
        <div className="gp-main">
            <div className="gp-content">
                <h1 className="gp-title">{props.title}</h1>
                <div className="gp-abort noselect" onClick={() => onAbort()}></div>
                <div className="gp-inputs">
                    <div className="gp-input">
                        <SimpleTextInput
                            value={value}
                            forceType="number"
                            placeHolder="Nota"
                            toolTipText="La nota del test"
                            min={1}
                            max={6}
                            step={0.25}
                            onChange={(v) => onChangeGrade(v as number)}
                        />
                    </div>
                    <div className="gp-input">
                        <SimpleTextInput
                            value={weight}
                            forceType="number"
                            placeHolder="Peso"
                            toolTipText="Il peso della nota"
                            min={0}
                            step={0.1}
                            onChange={(v) => onChangeWeight(v as number)}
                        />
                    </div>
                    <div className="gp-input">
                        <SimpleTextInput
                            value={date}
                            forceType="date"
                            placeHolder="Data"
                            toolTipText="La data di consegna"
                            onChange={(v) => onChangeDate(v as Date)}
                        />
                    </div>
                </div>
                <div className={`gp-ok-btn ${okBtnCName} noselect`} onClick={() => {
                    onSubmit(
                        value as number,
                        weight as number,
                        date as Date
                    );
                }}>OK</div>
            </div>
        </div>
    );
}
export default GradePrompt;
