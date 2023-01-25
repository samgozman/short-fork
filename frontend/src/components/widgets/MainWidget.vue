<script setup lang="ts">
import InputWithSubmit from "../elements/InputWithSubmit.vue";
</script>

<template>
  <InputWithSubmit @submitStock="submitStock" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  methods: {
    submitStock(stock: string) {
      console.log(stock);
    },
  },
});
</script>
