<script setup lang="ts">
import ContentBox from "@/components/layout/ContentBox.vue";
import WarningBox from "@/components/layout/WarningBox.vue";
import ErrorText from "@/components/layout/typography/ErrorText.vue";
import MainWidget from "@/components/widgets/MainWidget.vue";
import LinksWidget from "@/components/widgets/LinksWidget.vue";
import InsidersTableWidget from "@/components/widgets/InsidersTableWidget.vue";
import OptionsWidget from "@/components/widgets/OptionsWidget.vue";
import FinancialReportWarning from "@/components/widgets/FinancialReportWarning.vue";
import NetIncomeChartWidget from "@/components/widgets/NetIncomeChartWidget.vue";
import DebtChartWidget from "@/components/widgets/DebtChartWidget.vue";
import AnalyticsWidget from "@/components/widgets/AnalyticsWidget.vue";
import TightshortsChartWidget from "@/components/widgets/TightshortsChartWidget.vue";
import TechnicalAnalysisWidget from "@/components/widgets/TechnicalAnalysisWidget.vue";
import TradingviewChartWidget from "@/components/widgets/TradingviewChartWidget.vue";
import FooterBlock from "@/components/elements/FooterBlock.vue";
import { currentTheme } from "@/components/elements/themeSwitcher";
import { currentLanguage } from "@/components/elements/languageSwitcher";
</script>

<template>
  <div>
    <div class="grid grid-cols-1">
      <WarningBox v-if="showEarningsWarning">
        <FinancialReportWarning :earnings="earnings" />
      </WarningBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox>
        <MainWidget
          @stockWithExchange="updateLinksAndTradingView"
          @getInsiders="getInsiders"
          @setEarnings="setEarnings"
          @getBarchartOverview="getBarchartOverview"
          @getBarchartFinancials="getBarchartFinancials"
          @setFinvizRating="setFinvizRating"
          @setTightshortsChart="setTightshortsChart"
          :key="currentLanguage"
        />
      </ContentBox>
      <ContentBox>
        <TechnicalAnalysisWidget
          :stock="stockTicker"
          :exchange="stockExchange"
          :key="`${tradingViewKey}_${currentTheme}`"
        />
      </ContentBox>
      <ContentBox>
        <TightshortsChartWidget
          :chart="tightshortsChart"
          :key="tightshortsChartKey"
        />
      </ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox class="lg:row-start-1 lg:row-end-2">
        <OptionsWidget
          :options="barchartOverview.options"
          :key="`${barchartOverviewKey}_${currentLanguage}`"
        />
        <ErrorText v-if="isBarchartOverviewNotFound">
          Error! Data not found
        </ErrorText>
      </ContentBox>
      <ContentBox class="lg:row-start-2 lg:row-end-3">
        <LinksWidget :ticker="stockTicker" :exchange="stockExchange" />
      </ContentBox>
      <ContentBox class="lg:row-start-1 lg:row-end-3">
        <AnalyticsWidget
          :barchartAnalytics="barchartAnalytics"
          :finvizRating="finvizRating"
          :key="barchartAnalyticsKey"
        />
      </ContentBox>
      <ContentBox class="lg:row-start-1 lg:row-end-3">
        <NetIncomeChartWidget
          :series="netIncomeChart.series"
          :xaxis="netIncomeChart.xaxis"
          :key="netIncomeChartKey"
        />
        <ErrorText v-if="isBarchartFinancialsNotFound">
          Error! Data not found
        </ErrorText>
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
        <ErrorText v-if="isBarchartFinancialsNotFound">
          Error! Data not found
        </ErrorText>
      </ContentBox>
    </div>
    <div class="grid grid-cols-1">
      <ContentBox>
        <TradingviewChartWidget
          :stock="stockTicker"
          :exchange="stockExchange"
          :key="`${tradingViewKey}_${currentTheme}`"
        />
      </ContentBox>
    </div>
    <div class="grid grid-cols-1">
      <ContentBox class="py-12">
        <FooterBlock />
      </ContentBox>
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
import type { IBarchartAnalytics } from "@/components/interfaces/analytics.interface";
import type { ITightshortsChart } from "@/components/interfaces/tightshorts/chart.interface";

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
  isBarchartFinancialsNotFound: boolean;
  isBarchartOverviewNotFound: boolean;
  barchartAnalytics: IBarchartAnalytics | undefined;
  barchartAnalyticsKey: number;
  finvizRating: number | null;
  tightshortsChart: ITightshortsChart;
  tightshortsChartKey: number;
  tradingViewKey: number;
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
      isBarchartFinancialsNotFound: false,
      isBarchartOverviewNotFound: false,
      barchartAnalytics: undefined,
      barchartAnalyticsKey: 0,
      finvizRating: null,
      tightshortsChart: {} as ITightshortsChart,
      tightshortsChartKey: 0,
      tradingViewKey: 0,
    };
  },
  methods: {
    updateLinksAndTradingView(stock: string, exchange: string) {
      this.stockTicker = stock;
      this.stockExchange = exchange === "NASD" ? "NASDAQ" : exchange;
      this.tradingViewKey = Math.random();
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
    setFinvizRating(rating: number | null) {
      this.finvizRating = rating;
      this.barchartAnalyticsKey = Math.random();
    },
    setTightshortsChart(chart: ITightshortsChart) {
      this.tightshortsChart = chart;
      this.tightshortsChartKey = Math.random();
    },
    async getBarchartOverview(stock: string) {
      const overview = await FetchData.getBarchartOverview(stock);

      if (!overview) {
        this.isBarchartOverviewNotFound = true;
        this.barchartOverview = {} as IBarchartOverview;
      } else {
        this.barchartOverview = overview;
        this.isBarchartOverviewNotFound = false;

        this.barchartAnalytics = overview.analytics;
        this.barchartAnalyticsKey = Math.random();
      }

      this.barchartOverviewKey = Math.random(); // to force re-render
    },
    async getBarchartFinancials(stock: string) {
      const barchartFinancials = await FetchData.getBarchartFinancials(stock);

      if (!barchartFinancials) {
        this.isBarchartFinancialsNotFound = true;
        this.netIncomeChart = {} as Data["netIncomeChart"];
        this.netIncomeChartKey = Math.random();
        this.debtChart = {} as Data["debtChart"];
        this.debtChartKey = Math.random();
        return;
      }

      this.netIncomeChart = {
        series: [
          {
            name: "Net Income",
            data: barchartFinancials.netIncome || [],
          },
          {
            name: "Revenue",
            data: barchartFinancials.revenue || [],
          },
        ],
        xaxis: barchartFinancials.dates,
      };

      this.netIncomeChartKey = Math.random(); // to force re-render

      this.debtChart = {
        series: [
          {
            name: "Debt",
            data: barchartFinancials.longTermDebt || [],
          },
          {
            name: "Equity",
            data: barchartFinancials.shareholdersEquity || [],
          },
        ],
        xaxis: barchartFinancials.dates,
      };

      this.debtChartKey = Math.random(); // to force re-render

      this.isBarchartFinancialsNotFound = false;
    },
  },
});
</script>
