import AbstractChart, { IAbstractChartProps } from '../chart/AbstractChart';
import React from 'react';

const AvgChart: React.FunctionComponent<IAbstractChartProps> = (props) => {
    return <AbstractChart
        dataset={props.dataset}
        labels={props.labels}
        type="bar"
        options={{
            scales: {
                yAxes: [
                    {
                        ticks: {
                            min: 1,
                            max: 6
                        }
                    }
                ],
                unitStepSize: 0.25
            },
            maintainAspectRatio: false,

        }}
        shouldUpdate={props.shouldUpdate}
        onUpdate={() => {
            if (props.onUpdate) {
                props.onUpdate();
            }
        }}
    />;
}

export default AvgChart;