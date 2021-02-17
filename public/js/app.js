// DOM object of elements which should be changed during request
let pageObj = {
    name: document.querySelector('#resp_name'),
    price: document.querySelector('#resp_price'),
    pe: document.querySelector('#resp_pe'),
    ps: document.querySelector('#resp_ps'),
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
const examples = document.querySelectorAll('.example')

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
    resp_tinkoff.textContent = 'TinkOFF'
    resp_tinkoff.classList.remove('active')

    resp_finviz_target.textContent = '0'
    resp_finviz_rsi.textContent = '0'
    resp_finviz_recom.textContent = '0 - Нет'

    resp_finviz_target.classList.remove(...['upside', 'downside', 'hold'])
    resp_finviz_rsi.classList.remove(...['upside', 'downside', 'hold'])
    resp_finviz_recom.classList.remove(...['upside', 'downside', 'hold'])

    tradingview.classList.add('h0')
}

// Set signs for values
const setSigns = () => {
    pageObj.price.textContent = '$' + pageObj.price.textContent
    pageObj.naked_current_short_volume.textContent += '% SV'
    pageObj.squeeze_short_flow.textContent += '% SF'
    pageObj.finviz_short_flow.textContent += '% SF'
    resp_finviz_target.textContent += '%'
}

// Get response from server side
const getResponse = async () => {
    return (await fetch('/stocks?ticker=' + ticker.value)).json()
}

// Set default values
erase()


//  ! Tradingview Widget
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
    tradingview.classList.remove('h0')
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html)
}


form.addEventListener('submit', async (e) => {
    // Prevent from refreshing the browser once form submited 
    e.preventDefault()
    try {
        if (!ticker.value) {
            throw new Error()
        }

        erase(' Loading ')

        const response = await getResponse()

        // Set values
        for (const key in pageObj) {
            pageObj[key].textContent = response[key] || '-'
        }

        // Set site href
        pageObj.site.setAttribute('href', response.resp_site)
        
        // Set tinkoff indicator
        if (response.tinkoff) {
            resp_tinkoff.textContent = 'TinkON'
            resp_tinkoff.classList.add('active')
        } else {
            resp_tinkoff.textContent = 'TinkOFF'
            resp_tinkoff.classList.remove('active')
        }

        // Set target indicator
        const targetUpside = (response.target_price != null && response.price != null) ? ((response.target_price / response.price - 1) * 100).toFixed(1) : null
        if (response.target_price > 0) {
            resp_finviz_target.textContent = '+' + targetUpside
            resp_finviz_target.classList.add('upside')
        } else {
            resp_finviz_target.textContent = targetUpside
            resp_finviz_target.classList.add('downside')
        }

        // Set RSI indicator
        resp_finviz_rsi.textContent = response.rsi
        if (response.rsi > 70) {
            resp_finviz_rsi.classList.add('downside')
        } else if (response.rsi < 70 && response.rsi > 30) {
            resp_finviz_rsi.classList.add('hold')
        } else if (response.rsi < 30) {
            resp_finviz_rsi.classList.add('upside')
        }

        // Set analytics recomendation indicator
        if (response.recomendation < 3) {
            resp_finviz_recom.textContent = response.recomendation + ' - Buy'
            resp_finviz_recom.classList.add('upside')
        } else if (response.recomendation > 3 && response.recomendation < 4) {
            resp_finviz_recom.recomendation = response.recomendation + ' - Hold'
            resp_finviz_recom.classList.add('hold')
        } else if (response.recomendation > 4) {
            resp_finviz_recom.textContent = response.resp_finviz_recom + ' - Sell'
            resp_finviz_recom.classList.add('downside')
        }

        setSigns()

        // ! APPEND TRADINGVIEW WIDGET
        widget(ticker.value)

    } catch (error) {
        erase(' ошибка ')
        error_message.textContent = 'Ошибка! Введите правильный тикер'
    }
})

// Insert example
examples.forEach(element => {
    element.addEventListener('click', () => {
        ticker.value = element.innerHTML
    })
})