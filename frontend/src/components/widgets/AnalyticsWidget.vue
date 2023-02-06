<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import ProgressBar from "@/components/elements/ProgressBar.vue";
// import type { ApexChartSeries } from "@/components/types/apex";

// defineProps<{
//   series?: ApexChartSeries;
//   xaxis?: string[] | number[];
// }>();
</script>

<template>
  <div class="w-full">
    <HeaderH5>Analyst</HeaderH5>
    <ProgressBar label="Finviz" :value="3.3" />
    <ProgressBar label="Barchart" :value="4.1" />
  </div>
</template>
