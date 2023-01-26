<script setup lang="ts">
import InputWithSubmit from "@/components/elements/InputWithSubmit.vue";
import KeyValueTag from "@/components/elements/KeyValueTag.vue";
</script>

<template>
  <div class="w-full">
    <InputWithSubmit @submitStock="submitStock" />
    <div class="w-full">
      <p>Some general info</p>
    </div>
    <!-- Block with tags  -->
    <div class="grid grid-cols-2 gap-2">
      <KeyValueTag theme="gray">
        <template #key>Key 1</template>
        <template #value>Value 1</template>
      </KeyValueTag>
      <KeyValueTag theme="green">
        <template #key>Key2</template>
        <template #value>Value 2</template>
      </KeyValueTag>
      <KeyValueTag theme="red">
        <template #key>Key2</template>
        <template #value>Value 2</template>
      </KeyValueTag>
      <KeyValueTag theme="yellow">
        <template #key>Key2</template>
        <template #value>Value 2</template>
      </KeyValueTag>
    </div>
  </div>
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
