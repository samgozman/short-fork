/*global ApexCharts*/
// Define Volume chart and render it
const chartVolume = new ApexCharts(document.getElementById('chartVolume'), {
    series: [{
        name: 'Общий объём',
        data: []
    }, {
        name: 'Объём в шорт',
        data: []
    }],
    chart: {
        height: 200,
        width: '100%',
        type: 'area',
        group: 'synced-charts',
        id: 'volumeChart',
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    colors: ['#2196f3', '#ef5350'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    yaxis: {
        labels: {
            minWidth: -1,
            show: false,
            formatter: function (value) {
                return Number(value || '').toLocaleString('en-US', {
                    maximumFractionDigits: 2
                })
            }
        },
        type: 'numeric'
    },
    xaxis: {
        type: 'datetime',
        categories: []
    },
    grid: {
        xaxis: {
            lines: {
                show: true
            }
        }
    },
    tooltip: {
        style: {
            fontSize: '9px'
        }
    },
    noData: {
        text: 'Загрузка...'
    }
})
chartVolume.render()

// Define ShortPercent chart and render it
const chartShortPercent = new ApexCharts(document.getElementById('chartShortPercent'), {
    series: [{
        name: '% шортовых сделок за день',
        data: []
    }],
    chart: {
        height: 200,
        width: '100%',
        type: 'line',
        group: 'synced-charts',
        id: 'shortChart',
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            type: 'vertical',
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            colorStops: [{
                    offset: 0,
                    color: '#EB656F',
                    opacity: 1
                },
                {
                    offset: 20,
                    color: '#FAD375',
                    opacity: 1
                },
                {
                    offset: 100,
                    color: '#95DA74',
                    opacity: 1
                }
            ]
        }
    },

    dataLabels: {
        enabled: true,
        formatter: function (value = 0) {
            return value.toFixed(0) + '%'
        },
        style: {
            fontSize: '9px',
            colors: ['#333', '#333']
        },
        background: false,
        offsetY: -5
    },
    stroke: {
        curve: 'smooth'
    },
    markers: {
        size: 1
    },
    xaxis: {
        type: 'datetime',
        categories: [],
        title: {
            text: 'День'
        }
    },
    yaxis: {
        min: 0,
        max: 100,
        labels: {
            show: false,
            minWidth: -1,
            formatter: function (value) {
                return value + '%'
            }
        }
    },
    grid: {
        xaxis: {
            lines: {
                show: true
            }
        }
    },
    tooltip: {
        style: {
            fontSize: '9px'
        }
    },
    noData: {
        text: 'Загрузка...'
    }
})
chartShortPercent.render()

// Define analytics chart and render it
const chartAnalytics = new ApexCharts(document.getElementById('chartAnalytics'), {
    series: [44, 55, 41, 17, 15],
    labels: ['Strong Buy', 'Moderate Buy', 'Hold', 'Moderate Sell', 'Strong Sell'],
    chart: {
        width: '100%',
        type: 'donut',
    },
    stroke: {
        show: false,
        width: 0
    },
    legend: {
        position: 'right'
    },
    colors: ['#48c774', '#C5D86D', '#ffdd57', '#FD6A6A', '#f14668'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: '100%'
            },
            legend: {
                position: 'bottom'
            }
        }
    }],
    noData: {
        text: 'Загрузка...'
    }
})
chartAnalytics.render()

// Define Debt Equity chart
const chartDebtEquity = new ApexCharts(document.getElementById('chartDebtEquity'), {
    series: [{
        name: 'Долг',
        data: []
    }, {
        name: 'Капитал',
        data: []
    }],
    chart: {
        height: 350,
        type: 'area',
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    colors: ['#ef5350', '#2196f3'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'string',
        categories: [],
        title: {
            text: 'Год'
        }
    },
    yaxis: {
        min: function (min) {
            return min / 2
        },
        labels: {
            minWidth: -1,
            show: false,
            formatter: function (value) {
                return '$' + Number(value || '').toLocaleString('en-US', {
                    maximumFractionDigits: 2
                })
            }
        },
        type: 'numeric'
    },
    noData: {
        text: 'Загрузка...'
    }
})
chartDebtEquity.render()

// Define netIncome chart
const chartNetIncome = new ApexCharts(document.getElementById('chartNetIncome'), {
    series: [{
            name: 'Выручка',
            data: []
        },
        {
            name: 'Прибыль',
            data: []
        }
    ],
    chart: {
        height: 350,
        type: 'bar',
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    colors: ['#2196f3', '#C4BBAF'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'string',
        categories: [],
        title: {
            text: 'Год'
        }
    },
    yaxis: {
        labels: {
            minWidth: -1,
            show: false,
            formatter: function (value) {
                return '$' + Number(value || '').toLocaleString('en-US', {
                    maximumFractionDigits: 2
                })
            }
        },
        type: 'numeric'
    },
    noData: {
        text: 'Загрузка...'
    }
})
chartNetIncome.render()

// Get percentage of volume shorted
const getPercentageOfShorted = (volArr = [], shortArr = []) => {
    const shortVolPercentage = []

    for (let i = 0; i < volArr.length; i++) {
        shortVolPercentage.push(((shortArr[i] / volArr[i]) * 100).toFixed(2) || 0)
    }
    return shortVolPercentage
}

const clearCharts = () => {
    // Clear volume chart
    chartVolume.updateSeries([{
        data: []
    }, {
        data: []
    }])

    chartShortPercent.updateSeries([{
        data: []
    }])

    // Clear analytics chart
    chartAnalytics.updateOptions({
        series: []
    })

    // Clear debt chart
    chartDebtEquity.updateSeries([{
        data: []
    }, {
        data: []
    }])

    // Clear NetIncome chart
    chartNetIncome.updateSeries([{
        data: []
    }, {
        data: []
    }])
}

// Update data set in nakedshort charts
const setNakedshortChart = (response = {}) => {
    if (response.nakedshort.chart[0] && !response.nakedshort.chart[0].error && response.nakedshort.chart[0].xAxisArr.length > 0 && response.nakedshort.chart[0].shortVolArr.length > 0) {
        // ! UPDATE VOLUME CHART
        chartVolume.updateOptions({
            xaxis: {
                categories: response.nakedshort.chart[0].xAxisArr
            }
        })

        chartVolume.updateSeries([{
            data: response.nakedshort.chart[0].regularVolArr
        }, {
            data: response.nakedshort.chart[0].shortVolArr
        }])

        // ! UPDATE SHORT PERCENT CHART
        chartShortPercent.updateOptions({
            xaxis: {
                categories: response.nakedshort.chart[0].xAxisArr
            }
        })

        chartShortPercent.updateSeries([{
            data: getPercentageOfShorted(response.nakedshort.chart[0].regularVolArr, response.nakedshort.chart[0].shortVolArr)
        }])
    } else if (response.nakedshort.chart === null || !response.nakedshort.chart[0] || response.nakedshort.chart[0].error) {
        chartVolume.updateOptions({
            noData: {
                text: 'Данные Nakedshort недоступны'
            }
        })

        chartShortPercent.updateOptions({
            noData: {
                text: 'Данные Nakedshort недоступны'
            }
        })
    }
}

// Update dats set in DebtEquity charts
const setChartDebtEquity = (response = {}) => {
    try {
        if (!response.barchartfinancials.longTermDebt || response.barchartfinancials.longTermDebt.length < 1) {
            throw new Error()
        }

        // Debt equity compare with finviz value
        const length = response.barchartfinancials.longTermDebt.length - 1
        const dtey = response.finviz.debteq / (response.barchartfinancials.longTermDebt[length] / response.barchartfinancials.shareholdersEquity[length])
        if (dtey === 0 || dtey < 0.35 || dtey > 1.75) {
            throw new Error()
        }

        chartDebtEquity.updateOptions({
            xaxis: {
                categories: response.barchartfinancials.dates
            }
        })

        chartDebtEquity.updateSeries([{
            data: response.barchartfinancials.longTermDebt
        }, {
            data: response.barchartfinancials.shareholdersEquity
        }])

    } catch (error) {
        chartDebtEquity.updateOptions({
            noData: {
                text: 'Данные Barchart Financials недоступны'
            }
        })
    }
}

const setAnalyticsChart = (response = {}) => {
    if (response.barchartoverview.analytics && !response.barchartoverview.analytics.error) {
        const obj = response.barchartoverview.analytics
        chartAnalytics.updateOptions({
            series: [obj.strongBuy, obj.moderateBuy, obj.hold, obj.moderateSell, obj.strongSell]
        })
    } else {
        chartAnalytics.updateOptions({
            series: [],
            noData: {
                text: 'Данные Barchart недоступны'
            }
        })
    }
}

// Update dats set in net income chart
const setNetIncomeChart = (response = {}) => {
    if (response.barchartfinancials.netIncome && response.barchartfinancials.netIncome.length > 0) {
        chartNetIncome.updateOptions({
            xaxis: {
                categories: response.barchartfinancials.dates
            }
        })

        chartNetIncome.updateSeries([{
            data: response.barchartfinancials.revenue
        }, {
            data: response.barchartfinancials.netIncome
        }])
    } else {
        chartNetIncome.updateOptions({
            noData: {
                text: 'Данные Barchart Financials недоступны'
            }
        })
    }
}


// DARK MODE chart
const darkModeChartsSettings = {
    chart: {
        foreColor: '#ccc'
    },
    tooltip: {
        theme: 'dark'
    },
    grid: {
        borderColor: '#535A6C'
    },
    dataLabels: {
        style: {
            colors: ['#ccc', '#ccc']
        }
    }
}

const lightModeChartsSettings = {
    chart: {
        foreColor: '#373d3f'
    },
    tooltip: {
        theme: 'light'
    },
    grid: {
        borderColor: '#e0e0e0'
    },
    dataLabels: {
        style: {
            colors: ['#333', '#333']
        }
    }
}

const darkModePieChartsSettings = {
    colors: ['#1ca64c', '#C5D86D', '#ffd324', '#FD6A6A', '#ff0537'],
    chart: {
        foreColor: '#ccc'
    },
    tooltip: {
        theme: 'dark'
    },
    grid: {
        borderColor: '#535A6C'
    }
}

const lightModePieChartsSettings = {
    colors: ['#48c774', '#C5D86D', '#ffdd57', '#FD6A6A', '#f14668'],
    chart: {
        foreColor: '#373d3f'
    },
    tooltip: {
        theme: 'dark'
    },
    grid: {
        borderColor: '#e0e0e0'
    }
}

const apexLightMode = () => {
    chartVolume.updateOptions(lightModeChartsSettings)
    chartShortPercent.updateOptions(lightModeChartsSettings)
    chartDebtEquity.updateOptions(lightModeChartsSettings)
    chartNetIncome.updateOptions(lightModeChartsSettings)
    chartAnalytics.updateOptions(lightModePieChartsSettings)
}

const apexDarkMode = () => {
    chartVolume.updateOptions(darkModeChartsSettings)
    chartShortPercent.updateOptions(darkModeChartsSettings)
    chartDebtEquity.updateOptions(darkModeChartsSettings)
    chartNetIncome.updateOptions(darkModeChartsSettings)
    chartAnalytics.updateOptions(darkModePieChartsSettings)
}

module.exports = {
    apexDarkMode,
    apexLightMode,
    setNetIncomeChart,
    setAnalyticsChart,
    clearCharts,
    setNakedshortChart,
    setChartDebtEquity
}