<script setup lang="ts">
import ContentBox from "@/components/layout/ContentBox.vue";
import MainWidget from "@/components/widgets/MainWidget.vue";
</script>

<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox><MainWidget /></ContentBox>
      <ContentBox>Trading view widget</ContentBox>
      <ContentBox>Tightshorts</ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox class="lg:row-start-1 lg:row-end-2">Options</ContentBox>
      <ContentBox class="lg:row-start-2 lg:row-end-3">Links</ContentBox>
      <ContentBox class="lg:row-start-1 lg:row-end-3">Analyst</ContentBox>
      <ContentBox class="lg:row-start-1 lg:row-end-3">Income chart</ContentBox>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <ContentBox class="col-span-1 lg:col-span-2">Insider deals</ContentBox>
      <ContentBox>Debt to capital chart</ContentBox>
    </div>
    <div class="grid grid-cols-1">
      <ContentBox>Trading view big chart</ContentBox>
    </div>
  </div>
</template>
