import Chart from 'chart.js';
import React, { Component, ReactNode } from 'react';
import './abstract-chart.css';

export type AbstractChartDataSet = {

    label: string;

    data: number[];

    backgroundColor?: string | CanvasGradient;
};

export interface IAbstractChartProps {

    type?: 'bar' | 'line';

    labels: string[];

    dataset: AbstractChartDataSet;

    options?: Chart.ChartOptions;

    shouldUpdate?: boolean;

    onUpdate?: () => void;
}

class AbstractChart extends Component<IAbstractChartProps> {

    private chartRef: any;

    private chart: Chart | null;

    constructor(props: IAbstractChartProps) {
        super(props);
        this.chartRef = React.createRef();
        this.chart = null;
    }

    componentDidUpdate() {
        if (this.props.shouldUpdate) {
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = this.buildChart();
            if (this.props.onUpdate) {
                this.props.onUpdate();
            }
        }
    }

    componentDidMount() {
        this.chart = this.buildChart();
    }

    private buildChart() {
        if (this.props.type == 'line') {
            // hard coded trash 
            let ctx: CanvasRenderingContext2D = this.chartRef.current.getContext('2d');
            let gradient = ctx.createLinearGradient(0, 0, 0, 310);
            gradient.addColorStop(0.3, '#007eff');
            gradient.addColorStop(1, '#007eff00');
            this.props.dataset.backgroundColor = gradient;
        }
        return new Chart(this.chartRef.current, {
            type: this.props.type || 'bar',
            data: {
                labels: this.props.labels,
                datasets: [this.props.dataset]
            },
            options: this.props.options
        });
    }

    render(): ReactNode {
        return (
            <canvas ref={this.chartRef} />
        );
    }
}

export default AbstractChart;
