<script setup lang="ts">
import StockSuggestionBadge from "./StockSuggestionBadge.vue";
defineProps<{
  isLoading: boolean;
}>();
</script>

<template>
  <div class="w-full">
    <div class="flex justify-start w-full pb-2">
      <button
        class="bg-gray-800 dark:bg-slate-700 text-white h-10 px-4 rounded-l"
        @click.prevent="submit"
      >
        <span v-if="!isLoading">Enter</span>
        <svg
          v-else
          aria-hidden="true"
          class="w-6 h-6 mx-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </button>
      <input
        :placeholder="$t('mainWidget.tickerPlaceholder')"
        class="w-full max-w-full h-10 px-4 line leading-7 rounded-r border border-gray-800 uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-500 dark:border-slate-700"
        v-model="stock"
        @keypress.enter.prevent="submit"
      />
    </div>

    <div class="flex flex-wrap 2xl:flex-nowrap w-full leading-6">
      <span class="mr-2">{{ $t("mainWidget.example") }}:</span>
      <div class="flex flex-wrap justify-around w-full">
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
      const stock = this.stock.toUpperCase();
      this.$emit("submitStock", stock);
      this.$emit("getFinviz", stock);
      this.$emit("getShortsqueeze", stock);
      this.$emit("getTightshorts", stock);
    },
  },
  beforeMount() {
    const ticker = this.$route.params.ticker;
    if (ticker && ticker !== "" && typeof ticker === "string") {
      this.stock = ticker;
    }
  },
});
</script>
