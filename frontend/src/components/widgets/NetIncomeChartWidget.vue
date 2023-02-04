<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import type { ApexChartSeries } from "@/components/types/apex";

defineProps<{
  series?: ApexChartSeries;
  xaxis?: string[] | number[];
}>();
</script>

<template>
  <div class="w-full">
    <HeaderH5>Net income and profit</HeaderH5>
    <apexchart
      height="450"
      type="bar"
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

interface Data {
  chartOptions: ApexOptions;
  chartSeries: ApexChartSeries;
}

export default defineComponent({
  data: (): Data => {
    return {
      chartOptions: {
        chart: {
          id: "net-income-chart",
        },
        colors: ["#2196f3", "#C4BBAF"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: [],
          title: {
            text: "Year",
          },
        },
        yaxis: {
          labels: {
            minWidth: -1,
            show: false,
            formatter: function (value) {
              return (
                "$" +
                Number(value || "").toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })
              );
            },
          },
        },
        noData: {
          text: "Loading...",
        },
      },
      chartSeries: [],
    };
  },

  beforeMount() {
    if (!this.chartOptions ?? !this.chartOptions.xaxis) {
      return;
    }

    if (!this.series ?? !this.xaxis) {
      this.chartOptions.xaxis.categories = [];
      this.chartSeries = [];
      return;
    }

    if (this.series) {
      this.chartOptions.xaxis.categories = this.xaxis;
      this.chartSeries = this.series;
      return;
    }
  },
});
</script>
