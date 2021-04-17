import * as ObjectHelper from './../../helpers/ObjectHelper';
import AbstractChart, { IAbstractChartProps } from '../chart/AbstractChart';
import React, { Component, ReactNode } from 'react';
import { Chart } from 'chart.js';

const TrendChart: React.FunctionComponent<IAbstractChartProps> = (props) => {
    return <AbstractChart
        dataset={props.dataset}
        labels={props.labels}
        type="line"
        options={{
            responsive: true,
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
    />
}

export default TrendChart;