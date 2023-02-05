<script setup lang="ts">
import ContentBox from "@/components/layout/ContentBox.vue";
import MainWidget from "@/components/widgets/MainWidget.vue";
import LinksWidget from "@/components/widgets/LinksWidget.vue";
import InsidersTableWidget from "@/components/widgets/InsidersTableWidget.vue";
import OptionsWidget from "@/components/widgets/OptionsWidget.vue";
import FinancialReportWarning from "@/components/widgets/FinancialReportWarning.vue";
import NetIncomeChartWidget from "@/components/widgets/NetIncomeChartWidget.vue";
import DebtChartWidget from "@/components/widgets/DebtChartWidget.vue";
</script>

<template>
  <div>
    <div class="grid grid-cols-1">
      <ContentBox class="bg-yellow-300" v-if="showEarningsWarning">
        <FinancialReportWarning :earnings="earnings" />
      </ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox
        ><MainWidget
          @stockWithExchange="updateLinksAndTradingView"
          @getInsiders="getInsiders"
          @setEarnings="setEarnings"
          @getBarchartOverview="getBarchartOverview"
          @getBarchartFinancials="getBarchartFinancials"
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
      <ContentBox class="lg:row-start-1 lg:row-end-3">
        <NetIncomeChartWidget
          :series="netIncomeChart.series"
          :xaxis="netIncomeChart.xaxis"
          :key="netIncomeChartKey"
        />
      </ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox class="col-span-1 lg:col-span-2">
        <InsidersTableWidget :insidersTrades="insiders" :key="insidersKey" />
      </ContentBox>
      <ContentBox>
        <DebtChartWidget
          :series="debtChart.series"
          :xaxis="debtChart.xaxis"
          :key="debtChartKey"
        />
      </ContentBox>
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
import type { IEarnings } from "@/components/interfaces/earnings.interface";
import type { ApexChartSeries } from "@/components/types/apex";

const DaysBeforeEarningsWarning = 14;

interface Data {
  insiders: IInsider[];
  insidersKey: number;
  stockTicker: string;
  stockExchange: string;
  barchartOverview: IBarchartOverview;
  barchartOverviewKey: number;
  earnings: IEarnings;
  showEarningsWarning: boolean;
  netIncomeChart: {
    series: ApexChartSeries;
    xaxis: string[] | number[];
  };
  netIncomeChartKey: number;
  debtChart: {
    series: ApexChartSeries;
    xaxis: string[] | number[];
  };
  debtChartKey: number;
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
      earnings: {} as IEarnings,
      showEarningsWarning: false,
      netIncomeChart: {} as Data["netIncomeChart"],
      netIncomeChartKey: 0,
      debtChart: {} as Data["debtChart"],
      debtChartKey: 0,
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
    setEarnings(earnings: IEarnings) {
      const earningsDate = new Date(earnings.date);
      const earningsTimeFrame = earningsDate.getTime() - new Date().getTime();

      if (
        earningsTimeFrame >= 0 &&
        earningsTimeFrame < DaysBeforeEarningsWarning * 24 * 60 * 60 * 1000
      ) {
        this.earnings = earnings;
        this.showEarningsWarning = true;
        return;
      }

      this.earnings = {} as IEarnings;
      this.showEarningsWarning = false;
    },
    async getBarchartOverview(stock: string) {
      this.barchartOverview = await FetchData.getBarchartOverview(stock);
      this.barchartOverviewKey = Math.random(); // to force re-render
    },
    async getBarchartFinancials(stock: string) {
      const barchartFinancials = await FetchData.getBarchartFinancials(stock);
      this.netIncomeChart = {
        series: [
          {
            name: "Net Income",
            data: barchartFinancials.netIncome,
          },
          {
            name: "Revenue",
            data: barchartFinancials.revenue,
          },
        ],
        xaxis: barchartFinancials.dates,
      };

      this.netIncomeChartKey = Math.random(); // to force re-render

      this.debtChart = {
        series: [
          {
            name: "Debt",
            data: barchartFinancials.longTermDebt,
          },
          {
            name: "Equity",
            data: barchartFinancials.shareholdersEquity,
          },
        ],
        xaxis: barchartFinancials.dates,
      };

      this.debtChartKey = Math.random(); // to force re-render
    },
  },
});
</script>
