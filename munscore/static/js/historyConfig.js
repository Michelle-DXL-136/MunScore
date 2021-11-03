const baseChartOptions = {
    maintainAspectRatio: false,
    scales: {
        x: {
            title: {
                display: true,
                text: '时间',
            },
            ticks: {
                // callback: (value, index, values) => value / 60,
                callback: (value, index, values) => ts2str(value),
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
    plugins: {
        legend: {
            // onHover: (event, legendItem) => {
            //     const chart = this.chart;
            //     console.log(legendItem, chart.getDatasetMeta(0).data[index]);
            //     const index = legendItem.index;
            //     const segment = ts2str(chart.getDatasetMeta(0).data[index]);
            //     chart.tooltip._active = [segment]
            //     chart.tooltip.update()
            //     chart.draw()
            // },
            // onHover: function(e) {
            //     e.target.style.cursor = 'pointer';
            // },
        },
        // tooltip: {
        //     mode: 'dataset',
        // },
    },
    hover: {
        mode: null, // 毁灭吧，累了
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

const chartColors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22'];

const LIMIT_TIME_HOURS = 0; // 0 to disable
