<script setup lang="ts">
import { TechnicalAnalysis } from "vue-tradingview-widgets";
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

defineProps<{
  stock: string;
  exchange: string;
}>();
</script>

<template>
  <div class="w-full h-full min-h-[500px]">
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
        colorTheme: 'light',
      }"
      class="h-[90%]"
    />
  </div>
</template>
