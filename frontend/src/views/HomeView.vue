<script setup lang="ts">
import ContentBox from "@/components/layout/ContentBox.vue";
import MainWidget from "@/components/widgets/MainWidget.vue";
import LinksWidget from "@/components/widgets/LinksWidget.vue";
import InsidersTableWidget from "@/components/widgets/InsidersTableWidget.vue";
import OptionsWidget from "@/components/widgets/OptionsWidget.vue";
</script>

<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox
        ><MainWidget
          @stockWithExchange="updateLinksAndTradingView"
          @getInsiders="getInsiders"
          @getBarchart="getBarchart"
      /></ContentBox>
      <ContentBox>Trading view widget</ContentBox>
      <ContentBox>Tightshorts</ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox class="lg:row-start-1 lg:row-end-2">
        <OptionsWidget
          :options="barchartOverview.options"
          :key="barchartOverviewKey"
        />
      </ContentBox>
      <ContentBox class="lg:row-start-2 lg:row-end-3">
        <LinksWidget :ticker="stockTicker" :exchange="stockExchange" />
      </ContentBox>
      <ContentBox class="lg:row-start-1 lg:row-end-3">Analyst</ContentBox>
      <ContentBox class="lg:row-start-1 lg:row-end-3">Income chart</ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox class="col-span-1 lg:col-span-2">
        <InsidersTableWidget :insidersTrades="insiders" :key="insidersKey" />
      </ContentBox>
      <ContentBox>Debt to capital chart</ContentBox>
    </div>
    <div class="grid grid-cols-1">
      <ContentBox>Trading view big chart</ContentBox>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { IInsider } from "@/components/interfaces/insider.interface";
import { FetchData } from "@/components/utils/FetchData";
import type { IBarchartOverview } from "@/components/interfaces/overview.interface";

interface Data {
  insiders: IInsider[];
  insidersKey: number;
  stockTicker: string;
  stockExchange: string;
  barchartOverview: IBarchartOverview;
  barchartOverviewKey: number;
}
export default defineComponent({
  data(): Data {
    return {
      insiders: [],
      insidersKey: 0,
      stockTicker: "SPY",
      stockExchange: "AMEX",
      barchartOverview: {} as IBarchartOverview,
      barchartOverviewKey: 0,
    };
  },
  methods: {
    updateLinksAndTradingView(stock: string, exchange: string) {
      this.stockTicker = stock;
      this.stockExchange = exchange === "NASD" ? "NASDAQ" : exchange;
      // TODO: Update trading view widget and chart
    },
    getInsiders(insidersTable: IInsider[]) {
      this.insiders = insidersTable;
      this.insidersKey = Math.random(); // to force re-render
    },
    // This route is outside of barchart modules to not to call overview api twice
    async getBarchart(stock: string) {
      this.barchartOverview = await FetchData.getBarchartOverview(stock);
      this.barchartOverviewKey = Math.random(); // to force re-render
    },
  },
});
</script>
