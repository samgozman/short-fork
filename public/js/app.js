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
    resp_finviz: document.querySelector('#resp_finviz')
}

const form = document.querySelector('form')
const ticker = document.querySelector('#input_ticker')
const error_message = document.querySelector('#error-message')
const examples = document.querySelectorAll('.example')

// Erase values in DOM
const erase = (word = ' empty ') => {
    for (const key in pageObj) {
        pageObj[key].textContent = word
    }
    error_message.textContent = ''
}

// Set signs for values
const setSigns = () => {
    pageObj.resp_price.textContent = '$' + pageObj.resp_price.textContent
    pageObj.resp_naked.textContent += '% SV'
    pageObj.resp_squeeze.textContent += '% SF'
    pageObj.resp_finviz.textContent += '% SF'
}

// Get response from server side
const getResponse = async () => {
    return (await fetch('/request?ticker=' + ticker.value)).json()
}

// Set default values
erase()

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

        setSigns()
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