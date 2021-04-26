/*global ApexCharts, iframe_tech, iframe_chart, getParameterByName, Tag*/

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
        input_ticker.value = queryParam
        document.getElementById('submit_button').click()
    }
}

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

/**
 * Check for theme settings for tradingview widgets
 * @return {String} 'light' or 'dark'
 */
const checkForThemeSettings = () => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : undefined,
        userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : undefined

    return localStorage.getItem('theme') || userPrefersDark || userPrefersLight || 'light'
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
        name: document.getElementById('resp_name'),
        site: document.getElementById('resp_site'),
        tags: {
            price: new Tag('resp_price', 0, { sign: '$', isInfo: true}),
            pe: new Tag('resp_pe', 0, { best: [0, 15], danger: [25, Infinity]}),
            forwardPe: new Tag('resp_forwardPe', 0, { best: [0, 15], danger: [25, Infinity]}),
            ps: new Tag('resp_ps', 0, { best: [0, 1], danger: [3, Infinity]}),
            pb: new Tag('resp_pb', 0, { best: [0, 1], danger: [4, Infinity]}),
            roe: new Tag('resp_roe', 0, { sign: '%', best: [0, 100], danger: [-Infinity, 0]}),
            roa: new Tag('resp_roa', 0, { sign: '%', best: [0, 100], danger: [-Infinity, 0]}),
            debteq: new Tag('resp_debteq', 0, { best: [0, 0.4], danger: [1, Infinity]}),
            short_flow: new Tag('resp_finviz', 0, { sign: '%', isShort: true}),
            peg: new Tag('resp_peg', 0, { best: [0, 1], danger: [3, Infinity]}),
            dividend_percent: new Tag('resp_dividend_percent', 0, { sign: '%', isInfo: true}),
            target: new Tag('resp_finviz_target', 0, { sign: '%', best: [0, Infinity], danger: [Infinity, 0]}),
            rsi: new Tag('resp_finviz_rsi', 0, { best: [0, 30], danger: [70, Infinity] })
        }
    },
    barchartoptions: {
        tags: {
            impliedVolatility: new Tag('resp_impliedVolatility', 0, { sign: '%', isInfo: true}),
            historicalVolatility: new Tag('resp_historicalVolatility', 0, { sign: '%', isInfo: true}),
            ivPercentile: new Tag('resp_ivPercentile', 0, { sign: '%', best: [0, 30], danger: [70, Infinity]}),
            ivRank: new Tag('resp_ivRank', 0, { sign: '%', best: [0, 30], danger: [70, Infinity] }),
            putCallVolRatio: new Tag('resp_putCallVolRatio', 0, { best: [0, 0.7], danger: [1, Infinity]}),
            todaysVolume: new Tag('resp_todaysVolume', 0, { isInfo: true}),
            volumeAvg30Day: new Tag('resp_volumeAvg30Day', 0, { isInfo: true}),
            putCallOiRatio: new Tag('resp_putCallOiRatio', 0, { best: [0, 0.7], danger: [1, Infinity] }),
            todaysOpenInterest: new Tag('resp_todaysOpenInterest', 0, { isInfo: true}),
            openInt30Day: new Tag('resp_openInt30Day', 0, { isInfo: true})
        }
    },
    nakedshort: {
        current_short_volume: new Tag('resp_naked', 0, { sign: '%', isShort: true})
    },
    shortsqueeze: {
        short_flow: new Tag('resp_squeeze', 0, { sign: '%', isShort: true})
    },
    insidersDeals: document.getElementById('resp_insidersDeals_tbody'),
    extension: {
        resp_tinkoff: new Tag('resp_tinkoff', 0, { bool: false })
    }
}

const form = document.querySelector('form')
const input_ticker = document.getElementById('input_ticker')
const error_message = document.getElementById('error-message')
const links_list = document.getElementById('links_list')

// Progress bar block
const progress_finviz = document.getElementById('progress-finviz')
const progress_finviz_value = document.getElementById('progress-finviz-value')
const progress_barchart = document.getElementById('progress-barchart')
const progress_barchart_value = document.getElementById('progress-barchart-value')

// Erase values in charts and progressbar
const erase = () => {
    // Reset progressbar 
    progress_barchart.removeAttribute('value')
    progress_barchart_value.textContent = ''
    progress_finviz.removeAttribute('value')
    progress_finviz_value.textContent = ''

    // Clear insidersDeals table
    pageObj.insidersDeals.innerHTML = ''

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

    // Clear links list
    links_list.innerHTML = ''
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

// Set values and colors for progress bar
const setProgressBar = (response = {}) => {
    // Sum analytics values
    const barchartRating = (obj = {}) => {
        const total = Object.values(obj).reduce((a, b) => a + b, 0)
        const sum = obj.strongBuy * 5 + obj.moderateBuy * 4 + obj.hold * 3 + obj.moderateSell * 2 + obj.strongSell * 1
        return !isNaN(sum) && sum !== 0 ? (sum / total).toFixed(2) : null
    }
    const barchartAnal = barchartRating(response.barchartoverview.analytics)

    // Set barchart progress bar value
    progress_barchart.value = barchartAnal
    progress_barchart_value.textContent = barchartAnal
    progress_barchart.classList.add(barchartAnal <= 2 ? 'is-danger' : barchartAnal <= 3.5 ? 'is-warning' : 'is-success')

    // Set finviz progress bar value
    progress_finviz.value = response.finviz.recomendation ? 6 - response.finviz.recomendation : null
    progress_finviz_value.textContent = response.finviz.recomendation ? 6 - response.finviz.recomendation : null
    progress_finviz.classList.add(progress_finviz.value <= 2 ? 'is-danger' : progress_finviz.value <= 3.5 ? 'is-warning' : 'is-success')
}

const setInsidersTable = (response = {}) => {
    response.finviz.insidersDeals.forEach((element) => {
        let row = pageObj.insidersDeals.insertRow()
        row.insertCell(0).innerHTML = `<b>${element.relationship}</b><br>${element.insiderTrading}`
        row.insertCell(1).innerHTML = element.date
        row.insertCell(2).innerHTML = element.transaction === 'Option Exercise' ? 'Option' : element.transaction
        row.insertCell(3).innerHTML = '$' + element.value

        // Set color
        element.transaction === 'Buy' ? row.classList.add('is-buy') : element.transaction === 'Sale' ? row.classList.add('is-sale') : row.classList.add('is-option')
    })
}

// Update dats set in nakedshort charts
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

const setTags = (response = {}) => {
    for (const key in pageObj.finviz.tags) {
        pageObj.finviz.tags[key].value = response.finviz[key] || '-'
    }
        
    // Set values for barchart options
    for (const key in pageObj.barchartoptions.tags) {
        pageObj.barchartoptions.tags[key].value = response.barchartoverview.options[key] || '-'
    }

    pageObj.nakedshort.current_short_volume.value = response.nakedshort.current_short_volume || '-'
    pageObj.shortsqueeze.short_flow.value = response.shortsqueeze.short_flow || '-'

    // Set target indicator
    const targetUpside = (response.finviz.target_price !== null && response.finviz.price !== null) ? ((response.finviz.target_price / response.finviz.price - 1) * 100).toFixed(1) : null
    pageObj.finviz.tags.target.value = targetUpside

    // Set tinkoff indicator
    pageObj.extension.resp_tinkoff.bool = response.tinkoff
}

// Set links
const setLinks = (exchange = '', quote = '') => {
    const setChild = (name, link) => {
        const a = document.createElement('a')
        a.textContent = name
        a.href = link
        a.target = '_blank'
        a.rel = 'nofollow'
        a.classList.add('button', 'is-small', 'is-link', 'is-outlined')
        return a
    }

    const full_exchange = exchange === 'NASD' ? 'NASDAQ' : exchange

    links_list.appendChild(setChild(`График ${quote} TradingView`, `https://ru.tradingview.com/chart?symbol=${full_exchange}%3A${quote}`))
    links_list.appendChild(setChild(`Finviz: ${quote}`, `https://finviz.com/quote.ashx?t=${quote}`))
    links_list.appendChild(setChild(`Yahoo! finance: ${quote}`, `https://finance.yahoo.com/quote/${quote}`))
    links_list.appendChild(setChild(`guruFocus: ${quote}`, `https://www.gurufocus.com/stock/${quote}/summary`))
    links_list.appendChild(setChild(`Seeking Alpha: ${quote}`, `https://seekingalpha.com/symbol/${quote}`))
}

// Get response from server side
const getResponse = async () => {
    try {
        const resp = await fetch('/stocks?ticker=' + input_ticker.value)
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

// ! FORM SUBMIT EVENT
form.addEventListener('submit', async (e) => {
    // Prevent from refreshing the browser once form submited 
    e.preventDefault()
    try {
        let quote = input_ticker.value
        if (!quote) {
            throw new Error()
        }
        quote = quote.toUpperCase()

        isLoading(true)
        erase()

        const response = await getResponse()
        if (response.message) {
            throw new Error(response.message)
        }

        // Setup url search query
        if ('URLSearchParams' in window) {
            const searchParams = new URLSearchParams(window.location.search)
            searchParams.set('stock', quote)
            const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()
            history.pushState(null, '', newRelativePathQuery)
        }

       setTags(response)

        setProgressBar(response)
        setInsidersTable(response)

        // ! APPEND TRADINGVIEW WIDGET
        techWidget(quote)
        chartWidget(quote)

        setNakedshortChart(response)
        setAnalyticsChart(response)
        setChartDebtEquity(response)
        setNetIncomeChart(response)
        setLinks(response.finviz.exchange, quote)

        // Set page title
        document.title = `Short fork: ${quote}`

        isLoading(false)

    } catch (error) {
        isLoading(false)
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

const setThemeForElements = (theme = 'light') => {
    switch (theme) {
        case 'light':
            document.querySelector('.sponsor').classList.remove('is-dark')
            chartVolume.updateOptions(lightModeChartsSettings)
            chartShortPercent.updateOptions(lightModeChartsSettings)
            chartDebtEquity.updateOptions(lightModeChartsSettings)
            chartNetIncome.updateOptions(lightModeChartsSettings)
            chartAnalytics.updateOptions(lightModePieChartsSettings)
            break

        case 'dark':
            document.querySelector('.sponsor').classList.toggle('is-dark')
            chartVolume.updateOptions(darkModeChartsSettings)
            chartShortPercent.updateOptions(darkModeChartsSettings)
            chartDebtEquity.updateOptions(darkModeChartsSettings)
            chartNetIncome.updateOptions(darkModeChartsSettings)
            chartAnalytics.updateOptions(darkModePieChartsSettings)
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
    techWidget(input_ticker.value || 'SPY')
    chartWidget(input_ticker.value || 'SPY')

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