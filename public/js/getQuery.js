/* eslint-disable no-unused-vars */
/**
 * Get url parameter by it's name
 * @param {String} name Query name
 * @param {String} url Optional url
 * @return {String} Value of a query
 */
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href
    }
    const params = new URL(url).searchParams
    return params.get(name)
}
