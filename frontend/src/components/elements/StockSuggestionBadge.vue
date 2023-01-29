<script setup lang="ts">
defineProps<{
  ticker: string;
}>();
</script>

<template>
  <span
    class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 my-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 uppercase cursor-pointer"
  >
    {{ ticker }}
  </span>
</template>
