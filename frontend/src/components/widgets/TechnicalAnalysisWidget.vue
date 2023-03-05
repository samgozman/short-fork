<script setup lang="ts">
import { TechnicalAnalysis } from "vue-tradingview-widgets";
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import HiddenParagraph from "@/components/layout/typography/HiddenParagraph.vue";
import { useI18n } from "vue-i18n";
import { currentTheme } from "@/components/elements/themeSwitcher";

const { locale } = useI18n();

defineProps<{
  stock: string;
  exchange: string;
}>();
</script>

<template>
  <div class="flex flex-col w-full h-full min-h-[600px]">
    <HeaderH5>{{ $t("technicalAnalysis.title") }}</HeaderH5>
    <TechnicalAnalysis
      :options="{
        interval: '1D',
        width: '100%',
        height: '100%',
        symbol: `${exchange}:${stock}`,
        isTransparent: 'true',
        showIntervalTabs: 'true',
        locale: locale,
        colorTheme: currentTheme || 'light',
      }"
      class="grow"
    />
    <p class="text-center text-sm py-2 dark:text-gray-300">
      <a
        href="https://tradingview.com/gopro/?share_your_love=eragonovich"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-500 hover:text-blue-600"
        >{{ $t("technicalAnalysis.copyright") }}&nbsp;</a
      >TradingView
    </p>
    <HiddenParagraph>
      {{ $t("technicalAnalysis.disclaimer") }}
    </HiddenParagraph>
  </div>
</template>
