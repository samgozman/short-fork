// Define chart and render it
const chartVolume = new ApexCharts(document.querySelector("#chartVolume"), {
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
        zoom: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    yaxis: {
        labels: {
            minWidth: 0,
            show: false,
            formatter: function (value) {
                return Number(value || '').toLocaleString('en-US', {maximumFractionDigits:2})
            }
        },
        type: 'numeric'
    },
    xaxis: {
        type: 'datetime',
        categories: []
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

// Define chart and render it
const chartShortPercent = new ApexCharts(document.querySelector("#chartShortPercent"), {
    series: [{
        name: "% шортовых сделок за день",
        data: []
    }],
    chart: {
        height: 200,
        width: '100%',
        type: 'line',
        group: 'synced-charts',
        id: 'shortChart',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
        },
        toolbar: {
            show: false
        }
    },
    fill: {
        type: "gradient",
        gradient: {
            type: 'vertical',
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            colorStops: [{
                    offset: 0,
                    color: "#EB656F",
                    opacity: 1
                },
                {
                    offset: 20,
                    color: "#FAD375",
                    opacity: 1
                },
                {
                    offset: 100,
                    color: "#95DA74",
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
            minWidth: 0,
            formatter: function (value) {
                return value + '%'
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

// Get percentage of volume shorted
const getPercentageOfShorted = (volArr = [], shortArr = []) => {
    const shortVolPercentage = []

    for (let i = 0; i < volArr.length; i++) {
        shortVolPercentage.push(((shortArr[i] / volArr[i]) * 100).toFixed(2) || 0)
    }
    return shortVolPercentage
}

/**
 * ! Tradingview Widget
 * 
 * @param {String} ticker 
 */
const widget = (ticker = '') => {
    const quote = ticker.toUpperCase()
    let html = `
        <!-- TradingView Widget BEGIN -->
        <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/${quote}/technicals/"
                    rel="noopener" target="_blank"><span class="blue-text">Technical Analysis for ${quote}</span></a> by
                TradingView</div>
            <script type="text/javascript"
                src="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js" async>
                {
                    "interval": "1D",
                    "width": "100%",
                    "isTransparent": true,
                    "height": "100%",
                    "symbol": "${quote}",
                    "showIntervalTabs": true,
                    "locale": "ru",
                    "colorTheme": "light"
                }
            </script>
        </div>
        <!-- TradingView Widget END -->
    `
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html)
}


// DOM object of elements which should be changed during request
let pageObj = {
    name: document.querySelector('#resp_name'),
    price: document.querySelector('#resp_price'),
    pe: document.querySelector('#resp_pe'),
    ps: document.querySelector('#resp_ps'),
    pb: document.querySelector('#resp_pb'),
    roe: document.querySelector('#resp_roe'),
    roa: document.querySelector('#resp_roa'),
    debteq: document.querySelector('#resp_debteq'),
    naked_current_short_volume: document.querySelector('#resp_naked'),
    squeeze_short_flow: document.querySelector('#resp_squeeze'),
    finviz_short_flow: document.querySelector('#resp_finviz'),
    site: document.querySelector('#resp_site')
}

const form = document.querySelector('form')
const ticker = document.querySelector('#input_ticker')
const error_message = document.querySelector('#error-message')

// Extension block
const resp_tinkoff = document.querySelector('#resp_tinkoff')
const resp_finviz_target = document.querySelector('#resp_finviz_target')
const resp_finviz_rsi = document.querySelector('#resp_finviz_rsi')
const resp_finviz_recom = document.querySelector('#resp_finviz_recom')

// Widget div
const tradingview = document.querySelector('.tradingview')

// Erase values in DOM
const erase = (word = ' пусто ') => {
    for (const key in pageObj) {
        pageObj[key].textContent = word
    }
    error_message.textContent = ''

    // Reset indicators
    resp_tinkoff.textContent = 'OFF'
    resp_tinkoff.classList.remove('is-success')

    resp_finviz_target.textContent = '0'
    resp_finviz_rsi.textContent = '0'
    resp_finviz_recom.textContent = '0 - Нет'

    resp_finviz_target.classList.remove(...['is-success', 'is-danger', 'is-warning'])
    resp_finviz_rsi.classList.remove(...['is-success', 'is-danger', 'is-warning'])
    resp_finviz_recom.classList.remove(...['is-success', 'is-danger', 'is-warning'])

    // Clear volume chart
    chartVolume.updateSeries([{
        data: []
    }, {
        data: []
    }])

    chartShortPercent.updateSeries([{
        data: []
    }])
}

// Is loading - add loading styles
const isLoading = (bool = true) => {
    const targetIDs = [
        'submit_button'
    ]

    targetIDs.forEach(id => {
        if(bool) {
            // add class
            document.getElementById(id).classList.add('is-loading')
        } else {
            // remove
            document.getElementById(id).classList.remove('is-loading')
        }

    })
}

// Set signs for values
const setSigns = () => {
    pageObj.price.textContent = '$' + pageObj.price.textContent
    pageObj.naked_current_short_volume.textContent += '%'
    pageObj.squeeze_short_flow.textContent += '%'
    pageObj.finviz_short_flow.textContent += '%'
    resp_finviz_target.textContent += '%'
}

// Get response from server side
const getResponse = async () => {

    try {
        const resp = await fetch('/stocks?ticker=' + ticker.value)
        if (resp.status !== 200) {
            throw new Error(resp.status)
        }
        return resp.json()
    } catch (error) {
        return error
    }
}

// Set default values
erase()

// Set S&P500 as placeholder
widget('SPX')

form.addEventListener('submit', async (e) => {
    // Prevent from refreshing the browser once form submited 
    e.preventDefault()
    try {
        if (!ticker.value) {
            throw new Error()
        }

        isLoading(true)
        erase(' Loading ')

        const response = await getResponse()
        if (response.message) {
            throw new Error(response.message)
        }

        // Set values
        for (const key in pageObj) {
            pageObj[key].textContent = response[key] || '-'
        }

        // Set site href
        pageObj.site.setAttribute('href', response.site)

        // Set tinkoff indicator
        if (response.tinkoff) {
            resp_tinkoff.textContent = 'ON'
            resp_tinkoff.classList.add('is-success')
        } else {
            resp_tinkoff.textContent = 'OFF'
            resp_tinkoff.classList.remove('is-success')
        }

        // Set target indicator
        const targetUpside = (response.target_price != null && response.price != null) ? ((response.target_price / response.price - 1) * 100).toFixed(1) : null
        if (targetUpside > 0) {
            resp_finviz_target.textContent = '+' + targetUpside
            resp_finviz_target.classList.add('is-success')
        } else {
            resp_finviz_target.textContent = targetUpside
            resp_finviz_target.classList.add('is-danger')
        }

        // Set RSI indicator
        resp_finviz_rsi.textContent = response.rsi
        if (response.rsi > 70) {
            resp_finviz_rsi.classList.add('is-danger')
        } else if (response.rsi < 70 && response.rsi > 30) {
            resp_finviz_rsi.classList.add('is-warning')
        } else if (response.rsi < 30) {
            resp_finviz_rsi.classList.add('is-success')
        }

        // Set analytics recomendation indicator
        if (response.recomendation < 3) {
            resp_finviz_recom.textContent = response.recomendation + ' - Buy'
            resp_finviz_recom.classList.add('is-success')
        } else if (response.recomendation > 3 && response.recomendation < 4) {
            resp_finviz_recom.textContent = response.recomendation + ' - Hold'
            resp_finviz_recom.classList.add('is-warning')
        } else if (response.recomendation > 4) {
            resp_finviz_recom.textContent = response.recomendation + ' - Sell'
            resp_finviz_recom.classList.add('is-danger')
        }

        setSigns()

        // ! APPEND TRADINGVIEW WIDGET
        widget(ticker.value)

        // ! UPDATE VOLUME CHART
        chartVolume.updateOptions({
            xaxis: {
                categories: response.naked_chart[0].xAxisArr
            }
        })

        chartVolume.updateSeries([{
            data: response.naked_chart[0].regularVolArr
        }, {
            data: response.naked_chart[0].shortVolArr
        }])

        // ! UPDATE SHORT PERCENT CHART
        chartShortPercent.updateOptions({
            xaxis: {
                categories: response.naked_chart[0].xAxisArr
            }
        })

        chartShortPercent.updateSeries([{
            data: getPercentageOfShorted(response.naked_chart[0].regularVolArr, response.naked_chart[0].shortVolArr)
        }])
        
        isLoading(false)

    } catch (error) {
        isLoading(false)
        erase(' ошибка ')
        error_message.textContent = error.message == 429 ? 'Превышен лимит запросов в минуту!' : 'Ошибка! Введите правильный тикер'
    }
})