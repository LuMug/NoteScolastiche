import React, { Component, ReactNode } from 'react';
import { Chart } from 'chart.js';

export type TrendChartDataSet = {

    label: string;

    data: number[];

    backgroundColor: string;
};

interface ITrendChartProps {

    color: string;

    labels: string[];

    dataset: TrendChartDataSet;
}

class TrendChart extends Component<ITrendChartProps> {

    private chartRef: any;

    private myChart?: Chart;

    constructor(props: ITrendChartProps) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
            type: 'line',
            data: {
                labels: this.props.labels,
                datasets: [this.props.dataset]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                min: 1,
                                max: 6
                            }
                        }
                    ]
                }
            }
        });
    }

    render(): ReactNode {
        return (
            <canvas ref={this.chartRef} />
        );
    }
}

export default TrendChart;
