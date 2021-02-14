// DOM object of elements which should be changed during request
let pageObj = {
    resp_name: document.querySelector('#resp_name'),
    resp_price: document.querySelector('#resp_price'),
    resp_pe: document.querySelector('#resp_pe'),
    resp_ps: document.querySelector('#resp_ps'),
    resp_roe: document.querySelector('#resp_roe'),
    resp_roa: document.querySelector('#resp_roa'),
    resp_debteq: document.querySelector('#resp_debteq'),
    resp_naked: document.querySelector('#resp_naked'),
    resp_squeeze: document.querySelector('#resp_squeeze'),
    resp_finviz: document.querySelector('#resp_finviz'),
    resp_site: document.querySelector('#resp_site')
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
const erase = (word = ' none ') => {
    for (const key in pageObj) {
        pageObj[key].textContent = word
    }
    error_message.textContent = ''

    // Reset indicators
    resp_tinkoff.textContent = 'TinkOFF'
    resp_tinkoff.classList.remove('active')

    resp_finviz_target.textContent = '0'
    resp_finviz_rsi.textContent = '0'
    resp_finviz_recom.textContent = '0 - None'

    resp_finviz_target.classList.remove(...['upside', 'downside', 'hold'])
    resp_finviz_rsi.classList.remove(...['upside', 'downside', 'hold'])
    resp_finviz_recom.classList.remove(...['upside', 'downside', 'hold'])

    tradingview.classList.add('h0')
}

// Set signs for values
const setSigns = () => {
    pageObj.resp_price.textContent = '$' + pageObj.resp_price.textContent
    pageObj.resp_naked.textContent += '% SV'
    pageObj.resp_squeeze.textContent += '% SF'
    pageObj.resp_finviz.textContent += '% SF'
    resp_finviz_target.textContent += '%'
}

// Get response from server side
const getResponse = async () => {
    return (await fetch('/request?ticker=' + ticker.value)).json()
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
                    "locale": "en",
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
        pageObj.resp_site.setAttribute('href', response.resp_site)
        
        // Set tinkoff indicator
        if (response.resp_tinkoff) {
            resp_tinkoff.textContent = 'TinkON'
            resp_tinkoff.classList.add('active')
        } else {
            resp_tinkoff.textContent = 'TinkOFF'
            resp_tinkoff.classList.remove('active')
        }

        // Set target indicator
        if (response.resp_finviz_target > 0) {
            resp_finviz_target.textContent = '+' + response.resp_finviz_target
            resp_finviz_target.classList.add('upside')
        } else {
            resp_finviz_target.textContent = response.resp_finviz_target
            resp_finviz_target.classList.add('downside')
        }

        // Set RSI indicator
        resp_finviz_rsi.textContent = response.resp_finviz_rsi
        if (response.resp_finviz_rsi > 70) {
            resp_finviz_rsi.classList.add('downside')
        } else if (response.resp_finviz_rsi < 70 && response.resp_finviz_rsi > 30) {
            resp_finviz_rsi.classList.add('hold')
        } else if (response.resp_finviz_rsi < 30) {
            resp_finviz_rsi.classList.add('upside')
        }

        // Set analytics recomendation indicator
        if (response.resp_finviz_recom < 3) {
            resp_finviz_recom.textContent = response.resp_finviz_recom + ' - Buy'
            resp_finviz_recom.classList.add('upside')
        } else if (response.resp_finviz_recom > 3 && response.resp_finviz_recom < 4) {
            resp_finviz_recom.textContent = response.resp_finviz_recom + ' - Hold'
            resp_finviz_recom.classList.add('hold')
        } else if (response.resp_finviz_recom > 4) {
            resp_finviz_recom.textContent = response.resp_finviz_recom + ' - Sell'
            resp_finviz_recom.classList.add('downside')
        }

        setSigns()

        // ! APPEND TRADINGVIEW WIDGET
        widget(ticker.value)

    } catch (error) {
        erase(' error ')
        error_message.textContent = 'Error! Please provide a valid ticker'
    }
})

// Insert example
examples.forEach(element => {
    element.addEventListener('click', () => {
        ticker.value = element.innerHTML
    })
})