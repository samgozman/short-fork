<script setup lang="ts">
import { Chart } from "vue-tradingview-widgets";
import { useI18n } from "vue-i18n";
import { currentTheme } from "@/components/elements/themeSwitcher";

const { locale } = useI18n();

defineProps<{
  stock: string;
  exchange: string;
}>();
</script>

<template>
  <div class="w-full h-full">
    <Chart
      :options="{
        autosize: true,
        symbol: `${exchange}:${stock}`,
        timezone: 'Etc/UTC',
        theme: currentTheme || 'light',
        style: '1',
        locale: locale,
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        range: '3M',
        hide_side_toolbar: false,
        studies: [
          'Volume@tv-basicstudies',
          'RSI@tv-basicstudies',
          'BB@tv-basicstudies',
          'AwesomeOscillator@tv-basicstudies',
        ],
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
      }"
      class="h-[95vh] sm:h-[80vh]"
    />
    <p class="text-center text-sm py-2 dark:text-gray-300">
      <a
        href="https://tradingview.com/gopro/?share_your_love=eragonovich"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-500 hover:text-blue-600"
        >{{ $t("chart.copyright") }}&nbsp;</a
      >TradingView
    </p>
  </div>
</template>
