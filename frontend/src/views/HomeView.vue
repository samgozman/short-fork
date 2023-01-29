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
      <ContentBox><MainWidget /></ContentBox>
      <ContentBox>Trading view widget</ContentBox>
      <ContentBox>Tightshorts</ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox class="lg:row-start-1 lg:row-end-2">
        <OptionsWidget ticker="AAPL" />
      </ContentBox>
      <ContentBox class="lg:row-start-2 lg:row-end-3">
        <LinksWidget ticker="AAPL" exchange="NASDAQ" />
      </ContentBox>
      <ContentBox class="lg:row-start-1 lg:row-end-3">Analyst</ContentBox>
      <ContentBox class="lg:row-start-1 lg:row-end-3">Income chart</ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox class="col-span-1 lg:col-span-2">
        <InsidersTableWidget
          :insidersTrades="[
            {
              insider: 'John Doe',
              date: 'Nov 21',
              transaction: 'Buy',
              value: '$1000',
            },
            {
              insider: 'John Doe Junior',
              date: 'Oct 23',
              transaction: 'Buy',
              value: '$54000',
            },
            {
              insider: 'John Doe',
              date: 'Nov 21',
              transaction: 'Buy',
              value: '$1000',
            },
            {
              insider: 'John Doe Junior',
              date: 'Oct 23',
              transaction: 'Sell',
              value: '$54000',
            },
            {
              insider: 'John Doe',
              date: 'Nov 21',
              transaction: 'Buy',
              value: '$1000',
            },
            {
              insider: 'John Doe Junior',
              date: 'Oct 23',
              transaction: 'Sell',
              value: '$54000',
            },
            {
              insider: 'John Doe',
              date: 'Nov 21',
              transaction: 'Sell',
              value: '$1000',
            },
            {
              insider: 'John Doe Junior',
              date: 'Oct 23',
              transaction: 'Sell',
              value: '$54000',
            },
          ]"
        />
      </ContentBox>
      <ContentBox>Debt to capital chart</ContentBox>
    </div>
    <div class="grid grid-cols-1">
      <ContentBox>Trading view big chart</ContentBox>
    </div>
  </div>
</template>
