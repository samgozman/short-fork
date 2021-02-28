# Short Fork

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/54b51710fc20496a8157929c3cd9f800)](https://www.codacy.com/gh/samgozman/short-fork/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=samgozman/short-fork&amp;utm_campaign=Badge_Grade)
![GitHub](https://img.shields.io/github/license/samgozman/short-fork)

Данный проект нацелен на агрегирование основных финансовых индикаторов американских акций, торгующихся на фондовой бирже. Основной упор приложение делает на данные о количестве шортовых позиций (Short Float и Short Volume).

Изначально делал веб приложение для себя, чтобы выводить самую нужную для меня информацию в читабельном виде на экране смартфона.

**[Перейти на short fork](https://short-fork.herokuapp.com)**

## Как пользоваться

![Первый экран приложения после ввода](doc/img/01.png)

Введите тикер компании (например **FLWS**) в поле ТИКЕР и нажмите Enter либо стрелочку слева. На данный момент приложение работает только с иностранными компаниями!

После этого данные начнут собираться с нескольких источников, что может занять непродолжительное время.

## Источники данных

* [finviz.com](https://finviz.com/) - Название компании, сайт, цена, P/E, P/S, ROE, ROA, Debt/Eq, Short Float %, RSI, recom.
* [shortsqueeze.com](https://shortsqueeze.com/) - Short Float %. По данному параметру сразу два источника для информативности.
* [nakedshortreport.com](https://nakedshortreport.com/) - Short Volume %
* [tradingview.com](https://tradingview.com/) - Виджет технического анализа
