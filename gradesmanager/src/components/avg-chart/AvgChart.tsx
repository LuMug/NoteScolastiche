import React, { Component, ReactNode } from 'react';
import { Chart } from 'chart.js';

export type AvgChartDataSet = {

    label: string;

    data: number[];

    backgroundColor: string;
};

interface IAvgChartProps {

    labels: string[];

    dataset: AvgChartDataSet;
}

class AvgChart extends Component<IAvgChartProps> {

    private chartRef: any;

    private chart: Chart | null;

    constructor(props: IAvgChartProps) {
        super(props);
        this.chartRef = React.createRef();
        this.chart = null;
    }

    componentDidUpdate() {
        this.chart = this.buildChart();
        this.chart.update();
    }

    componentDidMount() {
        this.chart = this.buildChart();
    }

    private buildChart() {
        return new Chart(this.chartRef.current, {
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
                    ],
                    unitStepSize: 0.25
                },
                maintainAspectRatio: false,

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
