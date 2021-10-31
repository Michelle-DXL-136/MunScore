const baseChartOptions = {
    scales: {
        x: {
            title: {
                display: true,
                text: '自开始时间（分钟）',
            },
            ticks: {
                callback: (value, index, values) => Math.round(value / 60),
                maxTicksLimit: 8,
                stepSize: 15 * 60,
            }
        },
        y: {
            title: {
                display: true,
                text: '分值',
            },
            beginAtZero: true,
        },
    },
    elements: {
        point:{
            radius: 0,
        }
    },
    legend: {
        onHover: (event, legendItem) => {
            const chart = this.chart;
            const index = legendItem.index;
            const segment = chart.getDatasetMeta(0).data[index];
            chart.tooltip._active = [segment]
            chart.tooltip.update()
            chart.draw()
        }
    }
}

const baseDatasetSetting = {
    showLine: true,
    label: '',
    data: [],
}

const baseChartSetting = {
    type: 'scatter',
    data: {datasets: [baseDatasetSetting]},
    options: baseChartOptions,
}

const chartColors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22'];
