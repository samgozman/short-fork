<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import type { ApexChartSeries } from "@/components/types/apex";
import HiddenParagraph from "@/components/layout/typography/HiddenParagraph.vue";

defineProps<{
  series?: ApexChartSeries;
  xaxis?: string[] | number[];
}>();
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <HeaderH5>{{ $t("debtToEquity.title") }}</HeaderH5>
    <apexchart
      height="450"
      type="area"
      :toolbar="{
        show: false,
      }"
      :zoom="{
        enabled: false,
      }"
      :options="chartOptions"
      :series="chartSeries"
      class="grow"
    ></apexchart>
    <HiddenParagraph>
      {{ $t("debtToEquity.disclaimer") }}
    </HiddenParagraph>
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
          id: "debt-chart",
          toolbar: {
            show: false,
            tools: {
              download: false,
            },
          },
        },
        colors: ["#ef5350", "#2196f3"],
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
