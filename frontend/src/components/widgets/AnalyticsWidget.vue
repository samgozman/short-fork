<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import ProgressBar from "@/components/elements/ProgressBar.vue";
import type { IBarchartAnalytics } from "@/components/interfaces/analytics.interface";
import HiddenParagraph from "@/components/layout/typography/HiddenParagraph.vue";
import { currentTheme } from "@/components/elements/themeSwitcher";

defineProps<{
  barchartAnalytics?: IBarchartAnalytics;
  finvizRating?: number | null;
}>();
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <HeaderH5>{{ $t("analyst.title") }}</HeaderH5>
    <div class="grow">
      <ProgressBar label="Finviz" :value="finvizRating ?? 0" />
      <ProgressBar label="Barchart" :value="barchartAverage ?? 0" />

      <apexchart
        width="100%"
        type="donut"
        :toolbar="{
          show: false,
        }"
        :zoom="{
          enabled: false,
        }"
        :options="chartOptions"
        :series="chartSeries"
      ></apexchart>
    </div>
    <HiddenParagraph>
      {{ $t("analyst.disclaimer") }}
    </HiddenParagraph>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ApexOptions } from "apexcharts";
import type { ApexChartSeries } from "@/components/types/apex";

interface Data {
  chartOptions: ApexOptions;
  chartSeries: ApexChartSeries;
  barchartAverage: number | null;
}

export default defineComponent({
  data: (): Data => {
    return {
      chartOptions: {
        chart: {
          id: "analytics-chart",
          foreColor: currentTheme.value === "light" ? "#373d3f" : "#ccc",
          toolbar: {
            show: false,
            tools: {
              download: false,
            },
          },
        },
        labels: [
          "Strong Buy",
          "Moderate Buy",
          "Hold",
          "Moderate Sell",
          "Strong Sell",
        ],
        legend: {
          position: "right",
        },
        colors:
          currentTheme.value === "light"
            ? ["#48c774", "#C5D86D", "#ffdd57", "#FD6A6A", "#f14668"]
            : ["#1ca64c", "#C5D86D", "#ffd324", "#FD6A6A", "#ff0537"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "100%",
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        stroke: {
          show: false,
          width: 0,
        },
        noData: {
          text: "Loading...",
        },
        tooltip: {
          theme: currentTheme.value,
        },
        grid: {
          borderColor: currentTheme.value === "light" ? "#e0e0e0" : "#535A6C",
        },
      },
      chartSeries: [],
      barchartAverage: null,
    };
  },
  methods: {
    barchartRating(obj: IBarchartAnalytics): number | null {
      const total = Object.values(obj).reduce((a, b) => a + b, 0);
      const sum =
        obj.strongBuy * 5 +
        obj.moderateBuy * 4 +
        obj.hold * 3 +
        obj.moderateSell * 2 +
        obj.strongSell * 1;
      return !isNaN(sum) && sum !== 0 ? sum / total : null;
    },
  },
  beforeMount() {
    if (!this.barchartAnalytics) {
      return;
    }

    this.chartSeries = [
      this.barchartAnalytics.strongBuy,
      this.barchartAnalytics.moderateBuy,
      this.barchartAnalytics.hold,
      this.barchartAnalytics.moderateSell,
      this.barchartAnalytics.strongSell,
    ];

    this.barchartAverage = this.barchartRating(this.barchartAnalytics);
  },
});
</script>
