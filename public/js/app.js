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

// Erase values in DOM
const erase = () => {
    for (const key in pageObj) {
        pageObj[key].textContent = ' empty '
    }
}

// Set signs for values
const setSigns = () => {
    pageObj.resp_price.textContent = '$' +pageObj.resp_price.textContent
    pageObj.resp_naked.textContent += '%'
    pageObj.resp_squeeze.textContent += '%'
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
    erase()

    const response = await getResponse()

    // Set values
    for (const key in pageObj) {
        pageObj[key].textContent = response[key] || 'none'
    }

    setSigns()
})