<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import type { ApexChartSeries } from "@/components/types/apex";
import type { ITightshortsChart } from "@/components/interfaces/tightshorts/chart.interface";
import HiddenParagraph from "@/components/layout/typography/HiddenParagraph.vue";
import { currentTheme } from "@/components/elements/themeSwitcher";

defineProps<{
  chart: ITightshortsChart;
}>();
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <HeaderH5>{{ $t("tightshorts.title") }}</HeaderH5>
    <div class="grow">
      <apexchart
        width="100%"
        height="265"
        type="area"
        :toolbar="{
          show: false,
        }"
        :zoom="{
          enabled: false,
        }"
        :options="volumeChartOptions"
        :series="chartSeries"
      ></apexchart>
      <apexchart
        width="100%"
        height="265"
        type="line"
        :toolbar="{
          show: false,
        }"
        :zoom="{
          enabled: false,
        }"
        :options="percentChartOptions"
        :series="chartSeriesShort"
      ></apexchart>
    </div>

    <HiddenParagraph>
      {{ $t("tightshorts.disclaimer") }}
      <a
        href="https://tightshorts.ru"
        rel="noopener"
        target="_blank"
        class="underline"
      >
        Tightshorts
      </a>
    </HiddenParagraph>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ApexOptions } from "apexcharts";

interface Data {
  volumeChartOptions: ApexOptions;
  percentChartOptions: ApexOptions;
  chartSeriesShort: ApexChartSeries;
  chartSeries: ApexChartSeries;
}

export default defineComponent({
  data: (): Data => {
    return {
      volumeChartOptions: {
        chart: {
          id: "volume-chart",
          group: "synced-charts",
          foreColor: currentTheme.value === "light" ? "#373d3f" : "#ccc",
          toolbar: {
            show: false,
            tools: {
              download: false,
            },
          },
        },
        colors: ["#2196f3", "#ef5350"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        yaxis: {
          labels: {
            minWidth: -1,
            show: false,
            formatter: function (value) {
              return Number(value || "").toLocaleString("en-US", {
                maximumFractionDigits: 2,
              });
            },
          },
        },
        xaxis: {
          type: "datetime",
          categories: [],
          labels: {
            show: true,
            style: {
              colors: currentTheme.value === "light" ? "#333" : "#dbdbdb",
            },
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: true,
            },
          },
          borderColor: currentTheme.value === "light" ? "#e0e0e0" : "#535A6C",
        },
        tooltip: {
          style: {
            fontSize: "9px",
          },
          theme: currentTheme.value,
        },
        noData: {
          text: "Loading...",
        },
      },
      percentChartOptions: {
        chart: {
          id: "percent-chart",
          group: "synced-charts",
          foreColor: currentTheme.value === "light" ? "#373d3f" : "#ccc",
          toolbar: {
            show: false,
            tools: {
              download: false,
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            type: "vertical",
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            colorStops: [
              {
                offset: 0,
                color: "#EB656F",
                opacity: 1,
              },
              {
                offset: 20,
                color: "#FAD375",
                opacity: 1,
              },
              {
                offset: 100,
                color: "#95DA74",
                opacity: 1,
              },
            ],
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (value = 0) {
            return Number(value).toFixed(0) + "%";
          },
          style: {
            fontSize: "9px",
            colors:
              currentTheme.value === "light"
                ? ["#333", "#333"]
                : ["#dbdbdb", "#dbdbdb"],
          },
          background: {
            enabled: false,
          },
          offsetY: -5,
        },
        stroke: {
          curve: "smooth",
        },
        markers: {
          size: 1,
        },
        xaxis: {
          type: "datetime",
          categories: [],
          title: {
            text: "Day",
            style: {
              color: currentTheme.value === "light" ? "#333" : "#dbdbdb",
            },
          },
          labels: {
            show: true,
            style: {
              colors: currentTheme.value === "light" ? "#333" : "#dbdbdb",
            },
          },
        },
        yaxis: {
          min: 0,
          max: 100,
          labels: {
            show: false,
            minWidth: -1,
            formatter: function (value) {
              return value + "%";
            },
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: true,
            },
          },
          borderColor: currentTheme.value === "light" ? "#e0e0e0" : "#535A6C",
        },
        tooltip: {
          style: {
            fontSize: "9px",
          },
          theme: currentTheme.value,
        },
        noData: {
          text: "Loading...",
        },
      },
      chartSeriesShort: [],
      chartSeries: [],
    };
  },
  methods: {
    calcShortPercent(volArr: number[], shortArr: number[]): number[] {
      const shortVolPercentage: number[] = [];

      for (let i = 0; i < volArr.length; i++) {
        shortVolPercentage.push(
          Number(((shortArr[i] / volArr[i]) * 100).toFixed(2)) || 0
        );
      }
      return shortVolPercentage;
    },
  },
  beforeMount() {
    if (
      !this.volumeChartOptions ||
      !this.volumeChartOptions.xaxis ||
      !this.percentChartOptions ||
      !this.percentChartOptions.xaxis
    ) {
      return;
    }

    if (!this.chart || !this.chart.xAxis || !this.chart.totalVolume) {
      this.volumeChartOptions.xaxis.categories = [];
      this.percentChartOptions.xaxis.categories = [];
      this.chartSeriesShort = [];
      this.chartSeries = [];
      return;
    }

    if (this.chart) {
      this.volumeChartOptions.xaxis.categories = this.chart.xAxis;
      this.percentChartOptions.xaxis.categories = this.chart.xAxis;
      this.chartSeries = [
        {
          name: "Total Volume",
          data: this.chart.totalVolume,
        },
        {
          name: "Short Volume",
          data: this.chart.shortVolume,
        },
      ];
      this.chartSeriesShort = [
        {
          name: "% Short Volume",
          data: this.calcShortPercent(
            this.chart.totalVolume,
            this.chart.shortVolume
          ),
        },
      ];
      return;
    }
  },
});
</script>
