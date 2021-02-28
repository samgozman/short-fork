/*global ApexCharts, iframe*/

// Preloader
var preloader = document.getElementById('preloader_preload');

function fadeOut(el) {
    el.style.opacity = 1
    const preloaderinterval = setInterval(function () {
        el.style.opacity = el.style.opacity - 0.05
        if (el.style.opacity <= 0.05) {
            clearInterval(preloaderinterval)
            preloader.style.display = 'none'
        }
    }, 16)
}
window.onload = function () {
    setTimeout(function () {
        fadeOut(preloader)
    }, 1000)
}

// Define chart and render it
const chartVolume = new ApexCharts(document.querySelector('#chartVolume'), {
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

// Define chart and render it
const chartShortPercent = new ApexCharts(document.querySelector('#chartShortPercent'), {
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
            minWidth: 0,
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
const techWidget = (ticker = '') => {
    const quote = ticker.toUpperCase()

    // Check users theme settings
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
    const theme = localStorage.getItem('theme') || (userPrefersDark ? 'dark' : userPrefersLight ? 'light' : 'light')

    let html = `
        <!-- TradingView Widget BEGIN -->
        <div class='tradingview-widget-container'>
            <div class='tradingview-widget-container__widget'></div>
            <div class='tradingview-widget-copyright'><a href='https://www.tradingview.com/symbols/${quote}/technicals/'
                    rel='noopener' target='_blank'><span class='blue-text'>Technical Analysis for ${quote}</span></a> by
                TradingView</div>
            <script type='text/javascript'
                src='https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js' async>
                {
                    'interval': '1D',
                    'width': '100%',
                    'isTransparent': false,
                    'height': '100%',
                    'symbol': '${quote}',
                    'showIntervalTabs': true,
                    'locale': 'ru',
                    'colorTheme': '${theme}'
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

// Erase values in DOM
const erase = (word = ' пусто ') => {
    for (const key in pageObj) {
        pageObj[key].textContent = word
        pageObj[key].classList.remove(...['is-success', 'is-danger', 'is-warning'])
    }
    error_message.textContent = ''

    // Reset indicators
    resp_tinkoff.textContent = 'OFF'
    resp_tinkoff.classList.remove(...['is-success', 'is-danger'])

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
        'submit_button',
        'input_ticker_control'
    ]

    targetIDs.forEach(id => {
        if (bool) {
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
    pageObj.roe.textContent += '%'
    pageObj.roa.textContent += '%'
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

// Set S&P500 as default tradingview widget
techWidget('SPX')

// Set starting colors for 'stock short' values
Array('finviz_short_flow', 'naked_current_short_volume', 'squeeze_short_flow').forEach(key => pageObj[key].classList.add('is-link'))

// ! FORM SUBMIT EVENT
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
            resp_tinkoff.classList.add('is-danger')
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
        resp_finviz_rsi.classList.add(response.rsi < 30 ? 'is-success' : response.rsi < 70 ? 'is-warning' : 'is-danger')

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

        // Set debt indicator
        pageObj.debteq.classList.add(response.debteq < 0.4 ? 'is-success' : response.debteq < 1 ? 'is-warning' : 'is-danger')

        // Set roa indicator
        pageObj.roa.classList.add(response.roa > 0 ? 'is-success' : 'is-danger')

        // Set roe indicator
        pageObj.roe.classList.add(response.roe > 0 && response.roe < 20 ? 'is-warning' : response.roe > 20 && response.roe < 40 ? 'is-success' : 'is-danger')

        // Set p/b indicator
        pageObj.pb.classList.add(response.pb > 0 && response.pb < 1 ? 'is-success' : response.pb < 4 ? 'is-warning' : 'is-danger')

        // Set p/s indicator
        pageObj.ps.classList.add(response.ps > 0 && response.ps < 1 ? 'is-success' : response.ps < 3 ? 'is-warning' : 'is-danger')

        // Set p/e indicator
        pageObj.pe.classList.add(response.ps > 0 && response.pe < 15 ? 'is-success' : response.pe < 25 ? 'is-warning' : 'is-danger')


        setSigns()

        // ! APPEND TRADINGVIEW WIDGET
        techWidget(ticker.value)

        if (response.naked_chart && response.naked_chart[0].xAxisArr.length > 0 && response.naked_chart[0].shortVolArr.length > 0) {
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
        }

        isLoading(false)

    } catch (error) {
        isLoading(false)
        erase(' ошибка ')
        error_message.textContent = error.message == 429 ? 'Превышен лимит запросов в минуту!' : 'Ошибка! Введите правильный тикер'
    }
})

//! SET MODAL EVENT LISTNERS
//? Source: https://siongui.github.io/2018/02/11/bulma-modal-with-javascript/
document.addEventListener('DOMContentLoaded', function () {

    // Modals

    const rootEl = document.documentElement
    const modals = getAll('.modal')
    const modalButtons = getAll('.modal-button')
    const modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

    if (modalButtons.length > 0) {
        modalButtons.forEach(function (el) {
            el.addEventListener('click', function () {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                rootEl.classList.add('is-clipped')
                $target.classList.add('is-active')
            })
        })
    }

    if (modalCloses.length > 0) {
        modalCloses.forEach(function (el) {
            el.addEventListener('click', function () {
                closeModals();
            })
        })
    }

    document.addEventListener('keydown', function (event) {
        const e = event || window.event;
        if (e.keyCode === 27) {
            closeModals()
        }
    })

    function closeModals() {
        rootEl.classList.remove('is-clipped')
        modals.forEach(function (el) {
            el.classList.remove('is-active')
        })
    }

    // Functions

    function getAll(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector), 0)
    }

})

//! END MODAL EVENT LISTNERS

// DARK MODE
//? Source: https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)')
const checkbox = document.getElementById('color_mode')
const currentTheme = localStorage.getItem('theme')

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

checkbox.addEventListener('change', (event) => {
    var theme = ''
    if (prefersDarkScheme.matches) {
        document.body.classList.toggle('light-theme')
        theme = document.body.classList.contains('light-theme') ?
            'light' :
            'dark'
    } else {
        document.body.classList.toggle('dark-theme')
        theme = document.body.classList.contains('dark-theme') ?
            'light' :
            'dark'
    }
    localStorage.setItem('theme', theme)
    techWidget(ticker.value || 'SPX')

    if (event.currentTarget.checked) {
        chartVolume.updateOptions(darkModeChartsSettings)
        chartShortPercent.updateOptions(darkModeChartsSettings)

    } else {
        chartVolume.updateOptions(lightModeChartsSettings)
        chartShortPercent.updateOptions(lightModeChartsSettings)
    }
})

if ((currentTheme == 'dark') || (prefersDarkScheme.matches && currentTheme != 'light')) {
    document.body.classList.toggle('dark-theme')
    checkbox.checked = true
    chartVolume.updateOptions(darkModeChartsSettings)
    chartShortPercent.updateOptions(darkModeChartsSettings)

} else if (currentTheme == 'light' || prefersLightScheme.matches) {
    document.body.classList.toggle('light-theme')
    chartVolume.updateOptions(lightModeChartsSettings)
    chartShortPercent.updateOptions(lightModeChartsSettings)
} 

// END OF DARK MODE