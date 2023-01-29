<script setup lang="ts">
import StockSuggestionBadge from "./StockSuggestionBadge.vue";
</script>

<template>
  <div class="w-full">
    <div class="flex justify-start w-full pb-2">
      <button
        class="bg-gray-800 text-white h-10 px-4 rounded-l"
        @click.prevent="submit"
      >
        Enter
      </button>
      <input
        placeholder="Ticker"
        class="w-full max-w-full h-10 px-4 line leading-7 rounded-r border border-gray-800 uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        v-model="stock"
        @keypress.enter.prevent="submit"
      />
    </div>

    <div class="flex w-full leading-6">
      <span class="mr-2">Example:</span>
      <div class="flex flex-wrap justify-between w-full">
        <StockSuggestionBadge
          v-for="ticker in ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA']"
          :key="ticker"
          :ticker="ticker"
          @click.prevent="stock = ticker"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      stock: "",
    };
  },
  methods: {
    submit() {
      this.$emit("submitStock", this.stock.toUpperCase());
    },
  },
});
</script>
