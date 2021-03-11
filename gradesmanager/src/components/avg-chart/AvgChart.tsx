import React, { Component, ReactNode } from 'react';
import { Chart } from 'chart.js';

export type AvgChartDataSet = {

    label: string;

    data: number[];

    backgroundColor: string;
};

interface IAvgChartProps {

    color: string;

    labels: string[];

    dataset: AvgChartDataSet;
}

class AvgChart extends Component<IAvgChartProps> {

    private chartRef: any;

    private myChart?: Chart;

    constructor(props: IAvgChartProps) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
            type: 'bar',
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

export default AvgChart;
