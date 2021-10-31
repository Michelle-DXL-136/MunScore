const baseChartOptions = {
    scales: {
        x: {
            // type: 'time',
            ticks: {
                callback: (value, index, values) => Math.round(value / 60),
                maxTicksLimit: 8,
                stepSize: 15 * 60,
            }
        },
        y: {
            beginAtZero: true,
        },
    },
    elements: {
        point:{
            radius: 0,
        }
    },
    legend: {
        onHover: function (event, legendItem) {
            var chart = this.chart;
            var index = legendItem.index;
            var segment = chart.getDatasetMeta(0).data[index];
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
