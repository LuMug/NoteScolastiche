import * as ObjectHelper from './../../helpers/ObjectHelper';
import React, { Component, ReactNode } from 'react';
import { Chart } from 'chart.js';

export type TrendChartDataSet = {

    label: string;

    data: number[];

    backgroundColor?: string | CanvasGradient;
};

interface ITrendChartProps {

    labels: string[];

    dataset: TrendChartDataSet;
}


class TrendChart extends Component<ITrendChartProps> {

    private chartRef: any;

    private chart: Chart | null;

    constructor(props: ITrendChartProps) {
        super(props);
        this.chartRef = React.createRef();
        this.chart = null;
    }

    componentDidUpdate(prevProps: ITrendChartProps) {


        //if (!ObjectHelper.equals(prevProps, this.props)) {
        console.log('full update');
        this.chart = this.buildChart();
        this.chart.update();
        //}
    }

    componentDidMount() {
        this.chart = this.buildChart();
    }

    private buildChart() {
        let ctx: CanvasRenderingContext2D = this.chartRef.current.getContext('2d');
        let gradient = ctx.createLinearGradient(0, 0, 0, 310);
        gradient.addColorStop(0.3, '#007eff');
        gradient.addColorStop(1, '#007eff00');
        this.props.dataset.backgroundColor = gradient;
        return new Chart(this.chartRef.current, {
            type: 'line',
            data: {
                labels: this.props.labels,
                datasets: [this.props.dataset]
            },
            options: {
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
