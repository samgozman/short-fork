# Short Fork

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C1DI4VL)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/54b51710fc20496a8157929c3cd9f800)](https://www.codacy.com/gh/samgozman/short-fork/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=samgozman/short-fork&amp;utm_campaign=Badge_Grade)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=samgozman_short-fork&metric=alert_status)](https://sonarcloud.io/dashboard?id=samgozman_short-fork)
![GitHub](https://img.shields.io/github/license/samgozman/short-fork)

This project aims to aggregate the main financial indicators of traded USA stocks.

Initially, I created a web application for myself to display the most important information in a readable format on the smartphone screen.

**[Go to short fork](https://short-fork.extr.app)**

## How to use

Enter the company ticker (for example, **NVDA**) in the text input field and press Enter. The indicators that show that the company is currently can be undervalued are marked in green, those that are fairly valued are marked in yellow, and those that are overvalued (or simply have an inadequate value) are marked in red.

After that, data will begin to be collected from several sources, which may take some amount of time.

![The first screen of the application after entering the data](doc/img/01.png)

The main financial indicator multipliers, technical analysis from TradingView, and a chart of short volumes (from my other project TightShorts) are displayed at the first level.

![Second screen](doc/img/02.png)

Next, data on options trading, links to third-party services, consensus analysts, and a chart of the company's revenue and profit changes over 5 years are provided.

If you do not know what each indicator means, simply **click on it** and a tooltip will appear!

![Third screen](doc/img/03.png)

The third row displays data on insider sales and a chart of the company's debt-to-equity ratio.

![Chart](doc/img/04.png)

And finally, the TradingView chart with the most popular oscillators: RSI, AO, BB.

## Data sources

* [finviz.com](https://finviz.com/) - Company name, website, price, P/E, P/S, ROE, ROA, Debt/Eq, Short Float %, RSI, etc.
* [shortsqueeze.com](https://shortsqueeze.com/) - Short Float %. For this parameter, there are two sources of data.
* [tightshorts.ru](https://tightshorts.ru/) - Short Volume %.
* [tradingview.com](https://ru.tradingview.com/gopro/?share_your_love=eragonovich) - Technical analysis widget and price chart.
* [www.barchart.com](https://www.barchart.com/) - Debt to Equity, Revenue and Earnings, Options, Analyst Opinion.
