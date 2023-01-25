<template>
  <div class="flex justify-start w-full">
    <button
      class="bg-gray-800 text-white h-8 px-4 rounded-l-sm"
      @click.prevent="submit"
    >
      Enter
    </button>
    <input
      placeholder="Ticker"
      class="w-full max-w-full h-8 px-4 line leading-6 rounded-r-sm border border-gray-800 uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      v-model="stock"
      @keypress.enter.prevent="submit"
    />
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
