/*global ApexCharts, iframe_tech, iframe_chart, getParameterByName*/

// Preloader
var preloader = document.getElementById('preloader_preload');

/**
 * Fade out animation for element
 * 
 * @param {*} el Element
 * @return {void}
 */
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

    // Get url params
    const queryParam = getParameterByName('stock')
    if (queryParam) {
        ticker.value = queryParam
        document.getElementById('submit_button').click()
    }
}

// Define Volume chart and render it
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
const chartAnalytics = new ApexCharts(document.querySelector('#chartAnalytics'), {
    series: [44, 55, 41, 17, 15],
    labels: ['Strong Buy', 'Moderate Buy', 'Hold', 'Moderate Sell', 'Strong Sell'],
    chart: {
        width: '100%',
        type: 'donut',
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

// Get percentage of volume shorted
const getPercentageOfShorted = (volArr = [], shortArr = []) => {
    const shortVolPercentage = []

    for (let i = 0; i < volArr.length; i++) {
        shortVolPercentage.push(((shortArr[i] / volArr[i]) * 100).toFixed(2) || 0)
    }
    return shortVolPercentage
}

/**
 * Check for theme settings for tradingview widgets
 * @return {String} 'light' or 'dark'
 */
const checkForThemeSettings = () => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
    return localStorage.getItem('theme') || (userPrefersDark ? 'dark' : userPrefersLight ? 'light' : 'light')
}

/**
 * ! Tradingview Technical Widget
 * 
 * @param {String} ticker Stock quote
 * @return {void}
 */
const techWidget = (ticker = '') => {
    const quote = ticker.toUpperCase()
    const theme = checkForThemeSettings()

    const html = `
        <!-- TradingView Widget BEGIN -->
        <div class='tradingview-widget-container'>
            <div class='tradingview-widget-container__widget'></div>
            <div class='tradingview-widget-copyright'><a href='https://www.tradingview.com/symbols/${quote}/technicals/'
                    rel='noopener' target='_blank'><span class='blue-text'>Technical Analysis for ${quote}</span></a> by
                TradingView</div>
            <script type='text/javascript'
                src='https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js' async>
                {
                    "interval": "1D",
                    "width": "100%",
                    "isTransparent": false,
                    "height": "100%",
                    "symbol": "${quote}",
                    "showIntervalTabs": true,
                    "locale": "ru",
                    "colorTheme": "${theme}"
                }
            </script>
        </div>
        <!-- TradingView Widget END -->
    ` // eslint-disable-line quotes
    iframe_tech.src = 'data:text/html;charset=utf-8,' + encodeURI(html)
}

/**
 * ! Tradingview Chart Widget
 * 
 * @param {String} ticker Stock quote
 * @return {void}
 */
const chartWidget = (ticker = '') => {
    const quote = ticker.toUpperCase()
    const theme = checkForThemeSettings()

    iframe_chart.src = 'charts/chart.html?stock=' + quote + '&theme=' + theme
}

// DOM object of elements which should be changed during request
let pageObj = {
    finviz: {
        name: document.querySelector('#resp_name'),
        price: document.querySelector('#resp_price'),
        pe: document.querySelector('#resp_pe'),
        ps: document.querySelector('#resp_ps'),
        pb: document.querySelector('#resp_pb'),
        roe: document.querySelector('#resp_roe'),
        roa: document.querySelector('#resp_roa'),
        debteq: document.querySelector('#resp_debteq'),
        short_flow: document.querySelector('#resp_finviz'),
        site: document.querySelector('#resp_site'),
        peg: document.querySelector('#resp_peg'),
        dividend_percent: document.querySelector('#resp_dividend_percent')
    },
    barchartoptions: {
        impliedVolatility: document.querySelector('#resp_impliedVolatility'),
        historicalVolatility: document.querySelector('#resp_historicalVolatility'),
        ivPercentile: document.querySelector('#resp_ivPercentile'),
        ivRank: document.querySelector('#resp_ivRank'),
        putCallVolRatio: document.querySelector('#resp_putCallVolRatio'),
        todaysVolume: document.querySelector('#resp_todaysVolume'),
        volumeAvg30Day: document.querySelector('#resp_volumeAvg30Day'),
        putCallOiRatio: document.querySelector('#resp_putCallOiRatio'),
        todaysOpenInterest: document.querySelector('#resp_todaysOpenInterest'),
        openInt30Day: document.querySelector('#resp_openInt30Day')
    },
    nakedshort: {
        current_short_volume: document.querySelector('#resp_naked')
    },
    shortsqueeze: {
        short_flow: document.querySelector('#resp_squeeze')
    }
}

const form = document.querySelector('form')
const ticker = document.querySelector('#input_ticker')
const error_message = document.querySelector('#error-message')

// Extension block
const resp_tinkoff = document.querySelector('#resp_tinkoff')
const resp_finviz_target = document.querySelector('#resp_finviz_target')
const resp_finviz_rsi = document.querySelector('#resp_finviz_rsi')
const resp_finviz_recom = document.querySelector('#resp_finviz_recom')

// Progress bar block
const progress_finviz = document.querySelector('#progress-finviz')
const progress_finviz_value = document.querySelector('#progress-finviz-value')
const progress_barchart = document.querySelector('#progress-barchart')
const progress_barchart_value = document.querySelector('#progress-barchart-value')

// Erase values in DOM
const erase = (word = ' пусто ') => {
    const colorClassArr = ['is-success', 'is-danger', 'is-warning']

    for (const key in pageObj.finviz) {
        pageObj.finviz[key].textContent = word
        pageObj.finviz[key].classList.remove(...colorClassArr)
    }
    for (const key in pageObj.barchartoptions) {
        pageObj.barchartoptions[key].textContent = word
        pageObj.barchartoptions[key].classList.remove(...colorClassArr)
    }
    pageObj.nakedshort.current_short_volume.classList.remove(...colorClassArr)
    pageObj.shortsqueeze.short_flow.classList.remove(...colorClassArr)

    progress_finviz.classList.remove(...colorClassArr)
    progress_barchart.classList.remove(...colorClassArr)

    error_message.textContent = ''

    // Reset indicators
    resp_tinkoff.textContent = 'OFF'
    resp_tinkoff.classList.remove(...['is-success', 'is-danger'])

    resp_finviz_target.textContent = '0'
    resp_finviz_rsi.textContent = '0'
    resp_finviz_recom.textContent = '0 - Нет'

    resp_finviz_target.classList.remove(...colorClassArr)
    resp_finviz_rsi.classList.remove(...colorClassArr)
    resp_finviz_recom.classList.remove(...colorClassArr)

    // Reset progressbar 
    progress_barchart.removeAttribute('value')
    progress_barchart_value.textContent = ''
    progress_finviz.removeAttribute('value')
    progress_finviz_value.textContent = ''

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
    pageObj.finviz.price.textContent = '$' + pageObj.finviz.price.textContent
    pageObj.nakedshort.current_short_volume.textContent += '%'
    pageObj.shortsqueeze.short_flow.textContent += '%'
    pageObj.finviz.short_flow.textContent += '%'
    pageObj.finviz.roe.textContent += '%'
    pageObj.finviz.roa.textContent += '%'
    pageObj.finviz.dividend_percent.textContent += '%'
    pageObj.barchartoptions.impliedVolatility.textContent += '%'
    pageObj.barchartoptions.historicalVolatility.textContent += '%'
    pageObj.barchartoptions.ivPercentile.textContent += '%'
    pageObj.barchartoptions.ivRank.textContent += '%'
    resp_finviz_target.textContent += '%'
}
// Set tags colors and values
const setTags = (response = {}) => {
    // Set values for finviz
    for (const key in pageObj.finviz) {
        pageObj.finviz[key].textContent = response.finviz[key] || '-'
    }
    // Set values for barchart options
    for (const key in pageObj.barchartoptions) {
        pageObj.barchartoptions[key].textContent = response.barchartoverview.options[key] || '-'
    }
    // Set values for naked & squeeze
    pageObj.nakedshort.current_short_volume.textContent = response.nakedshort.current_short_volume || '-'
    pageObj.shortsqueeze.short_flow.textContent = response.shortsqueeze.short_flow || '-'

    // Set site href
    pageObj.finviz.site.setAttribute('href', response.finviz.site)

    // Set tinkoff indicator
    if (response.tinkoff) {
        resp_tinkoff.textContent = 'ON'
        resp_tinkoff.classList.add('is-success')
    } else {
        resp_tinkoff.textContent = 'OFF'
        resp_tinkoff.classList.add('is-danger')
    }

    // Set target indicator
    const targetUpside = (response.finviz.target_price !== null && response.finviz.price !== null) ? ((response.finviz.target_price / response.finviz.price - 1) * 100).toFixed(1) : null
    if (targetUpside > 0) {
        resp_finviz_target.textContent = '+' + targetUpside
        resp_finviz_target.classList.add('is-success')
    } else {
        resp_finviz_target.textContent = targetUpside
        resp_finviz_target.classList.add('is-danger')
    }

    // Set RSI indicator
    resp_finviz_rsi.textContent = response.finviz.rsi
    resp_finviz_rsi.classList.add(response.finviz.rsi < 30 ? 'is-success' : response.finviz.rsi < 70 ? 'is-warning' : 'is-danger')

    // Set analytics recomendation indicator
    if (response.finviz.recomendation < 3) {
        resp_finviz_recom.textContent = response.finviz.recomendation + ' - Buy'
        resp_finviz_recom.classList.add('is-success')
    } else if (response.finviz.recomendation > 3 && response.finviz.recomendation < 4) {
        resp_finviz_recom.textContent = response.finviz.recomendation + ' - Hold'
        resp_finviz_recom.classList.add('is-warning')
    } else if (response.finviz.recomendation > 4) {
        resp_finviz_recom.textContent = response.finviz.recomendation + ' - Sell'
        resp_finviz_recom.classList.add('is-danger')
    }

    // Set debt indicator
    pageObj.finviz.debteq.classList.add(response.finviz.debteq < 0.4 ? 'is-success' : response.finviz.debteq < 1 ? 'is-warning' : 'is-danger')

    // Set roa indicator
    pageObj.finviz.roa.classList.add(response.finviz.roa > 0 ? 'is-success' : 'is-danger')

    // Set roe indicator
    pageObj.finviz.roe.classList.add(response.finviz.roe > 0 && response.finviz.roe < 20 ? 'is-warning' : response.finviz.roe > 20 && response.finviz.roe < 40 ? 'is-success' : 'is-danger')

    // Set p/b indicator
    pageObj.finviz.pb.classList.add(response.finviz.pb > 0 && response.finviz.pb < 1 ? 'is-success' : response.finviz.pb < 4 ? 'is-warning' : 'is-danger')

    // Set p/s indicator
    pageObj.finviz.ps.classList.add(response.finviz.ps > 0 && response.finviz.ps < 1 ? 'is-success' : response.finviz.ps < 3 ? 'is-warning' : 'is-danger')

    // Set p/e indicator
    pageObj.finviz.pe.classList.add(response.finviz.pe > 0 && response.finviz.pe < 15 ? 'is-success' : response.finviz.pe < 25 ? 'is-warning' : 'is-danger')

    // Set peg indicator
    pageObj.finviz.peg.classList.add(response.finviz.peg > 0 && response.finviz.peg < 1 ? 'is-success' : response.finviz.peg < 3 ? 'is-warning' : 'is-danger')

    // Set options indicators

    // Set P/C OI
    pageObj.barchartoptions.putCallOiRatio.classList.add(response.barchartoverview.options.putCallOiRatio < 0.7 ? 'is-success' : response.barchartoverview.options.putCallOiRatio < 1 ? 'is-warning' : 'is-danger')

    // Set PCR
    pageObj.barchartoptions.putCallVolRatio.classList.add(response.barchartoverview.options.putCallVolRatio < 0.7 ? 'is-success' : response.barchartoverview.options.putCallVolRatio < 1 ? 'is-warning' : 'is-danger')

    // Set ivRank
    pageObj.barchartoptions.ivRank.classList.add(response.barchartoverview.options.ivRank < 30 ? 'is-success' : response.barchartoverview.options.ivRank < 70 ? 'is-warning' : 'is-danger')

    // Set ivPercentile
    pageObj.barchartoptions.ivPercentile.classList.add(response.barchartoverview.options.ivPercentile < 30 ? 'is-success' : response.barchartoverview.options.ivRank < 70 ? 'is-warning' : 'is-danger')

    // Set Tod OI
    const oiTodToAvg = response.barchartoverview.options.todaysOpenInterest / response.barchartoverview.options.openInt30Day
    if (oiTodToAvg < 0.7 || oiTodToAvg > 1.3) pageObj.barchartoptions.todaysOpenInterest.classList.add('is-warning')

    // Set Tod Vol
    const volTodToAvg = response.barchartoverview.options.todaysVolume / response.barchartoverview.options.volumeAvg30Day
    if (volTodToAvg < 0.7 || volTodToAvg > 1.3) pageObj.barchartoptions.todaysVolume.classList.add('is-warning')
}

// Set values and colors for progress bar
const setProgressBar = (response = {}) => {
    // Sum analytics values
    const barchartRating = (obj = {}) => {
        const total = Object.values(obj).reduce((a, b) => a + b, 0)
        const sum = obj.strongBuy * 5 + obj.moderateBuy * 4 + obj.hold * 3 + obj.moderateSell * 2 + obj.strongSell * 1
        return (sum / total).toFixed(2)
    }
    const barchartAnal = barchartRating(response.barchartoverview.analytics)

    // Set barchart progress bar value
    progress_barchart.value = barchartAnal
    progress_barchart_value.textContent = barchartAnal
    progress_barchart.classList.add(barchartAnal <= 2 ? 'is-danger' : barchartAnal <= 3.5 ? 'is-warning' : 'is-success')

    // Set finviz progress bar value
    progress_finviz.value = 6 - response.finviz.recomendation
    progress_finviz_value.textContent = 6 - response.finviz.recomendation
    progress_finviz.classList.add(progress_finviz.value <= 2 ? 'is-danger' : progress_finviz.value <= 3.5 ? 'is-warning' : 'is-success')
}

// Update dats set in nakedshort charts
const setNakedshortChart = (response = {}) => {
    if (response.nakedshort.chart && !response.nakedshort.chart[0].error && response.nakedshort.chart[0].xAxisArr.length > 0 && response.nakedshort.chart[0].shortVolArr.length > 0) {
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
    } else if (response.nakedshort.chart === null || response.nakedshort.chart[0].error) {
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

const setAnalyticsChart = (response = {}) => {
    if (response.barchartoverview.analytics && !response.barchartoverview.analytics.error) {
        const obj = response.barchartoverview.analytics
        chartAnalytics.updateOptions({
            series: [obj.strongBuy, obj.moderateBuy, obj.hold, obj.moderateSell, obj.strongSell]
        })
    }
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
techWidget('SPY')
chartWidget('SPY')

// Set starting colors for 'stock short' values
pageObj.finviz.short_flow.classList.add('is-link')
pageObj.nakedshort.current_short_volume.classList.add('is-link')
pageObj.shortsqueeze.short_flow.classList.add('is-link')

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

        // Setup url search query
        if ('URLSearchParams' in window) {
            const searchParams = new URLSearchParams(window.location.search)
            searchParams.set('stock', ticker.value)
            const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()
            history.pushState(null, '', newRelativePathQuery)
        }

        setTags(response)
        setSigns()
        setProgressBar(response)

        // ! APPEND TRADINGVIEW WIDGET
        techWidget(ticker.value)
        chartWidget(ticker.value)

        setNakedshortChart(response)
        setAnalyticsChart(response)
        
        isLoading(false)

    } catch (error) {
        isLoading(false)
        erase(' ошибка ')
        console.log(error)
        error_message.textContent = error.message === 429 ? 'Превышен лимит запросов в минуту!' : 'Ошибка! Введите правильный тикер'
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

    /**
     * Hide modals
     * @return {void}
     */
    function closeModals() {
        rootEl.classList.remove('is-clipped')
        modals.forEach(function (el) {
            el.classList.remove('is-active')
        })
    }

    /**
     * Get all elements with query selector
     * @param {*} selector Query selector
     * @return {Array} Array of selected DOM elements
     */
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

const setThemeForElements = (theme = 'light') => {
    switch (theme) {
        case 'light':
            document.querySelector('.sponsor').classList.remove('is-dark')
            chartVolume.updateOptions(lightModeChartsSettings)
            chartShortPercent.updateOptions(lightModeChartsSettings)
            break

        case 'dark':
            document.querySelector('.sponsor').classList.toggle('is-dark')
            chartVolume.updateOptions(darkModeChartsSettings)
            chartShortPercent.updateOptions(darkModeChartsSettings)
            break
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
    techWidget(ticker.value || 'SPY')
    chartWidget(ticker.value || 'SPY')

    if (event.currentTarget.checked) {
        setThemeForElements('dark')
    } else {
        setThemeForElements('light')
    }
})

if ((currentTheme === 'dark') || (prefersDarkScheme.matches && currentTheme !== 'light')) {
    document.body.classList.toggle('dark-theme')
    checkbox.checked = true
    setThemeForElements('dark')

} else if (currentTheme === 'light' || prefersLightScheme.matches) {
    document.body.classList.toggle('light-theme')
    setThemeForElements('light')
}

// END OF DARK MODE