<script setup lang="ts">
import LinkButton from "@/components/elements/LinkButton.vue";
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
defineProps<{
  ticker: string;
  exchange: string;
}>();
</script>

<template>
  <div class="w-full">
    <HeaderH5>{{ $t("links.title") }}</HeaderH5>
    <LinkButton
      v-for="link in [
        {
          url: `https://tradingview.com/chart?symbol=${exchange}%3A${ticker}`,
          text: 'TradingView: ' + ticker,
        },
        {
          url: `https://tightshorts.extr.app/quote/${ticker}`,
          text: 'TightShorts: ' + ticker,
        },
        {
          url: `https://finviz.com/quote.ashx?t=${ticker}`,
          text: 'Finviz: ' + ticker,
        },
        {
          url: `https://finance.yahoo.com/quote/${ticker}`,
          text: 'Yahoo! finance: ' + ticker,
        },
        {
          url: `https://www.gurufocus.com/stock/${ticker}/summary`,
          text: 'guruFocus: ' + ticker,
        },
        {
          url: `https://seekingalpha.com/symbol/${ticker}`,
          text: 'Seeking Alpha: ' + ticker,
        },
        {
          url: `https://www.zacks.com/stock/quote/${ticker}`,
          text: 'Zacks: ' + ticker,
        },
      ]"
      :key="link.text"
      :url="link.url"
      :text="link.text"
    />
  </div>
</template>
