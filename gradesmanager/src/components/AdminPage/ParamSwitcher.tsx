import React from 'react';
import Slider from '../slider/Slider';
import './param-switcher.css';

interface IParamSwitcher {

    label: string;

    defaultValue?: boolean;

    onSwitch?: (state: boolean) => void;
}

const ParamSwitcher: React.FunctionComponent<IParamSwitcher> = (props) => {
    let def = (props.defaultValue) ? true : false;
    return (
        <div className="pas-main-content">
            <p className="pas-label">{props.label}</p>
            <div className="pas-slider">
                <Slider
                    default={def}
                    onChangeState={state => {
                        if (props.onSwitch) {
                            props.onSwitch(state);
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default ParamSwitcher;