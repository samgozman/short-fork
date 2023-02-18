<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import ProgressBar from "@/components/elements/ProgressBar.vue";
import type { IBarchartAnalytics } from "@/components/interfaces/analytics.interface";

defineProps<{
  barchartAnalytics?: IBarchartAnalytics;
  finvizRating?: number | null;
}>();
</script>

<template>
  <div class="w-full">
    <HeaderH5>{{ $t("analyst.title") }}</HeaderH5>
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
        colors: ["#48c774", "#C5D86D", "#ffdd57", "#FD6A6A", "#f14668"],
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
