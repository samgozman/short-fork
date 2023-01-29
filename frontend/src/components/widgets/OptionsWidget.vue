<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import KeyValueTag from "@/components/elements/KeyValueTag.vue";

defineProps<{
  ticker: string;
}>();
</script>

<template>
  <div class="w-full">
    <HeaderH5>Options</HeaderH5>
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
