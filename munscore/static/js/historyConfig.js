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
    events: ['mousemove', 'mouseout'],
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
