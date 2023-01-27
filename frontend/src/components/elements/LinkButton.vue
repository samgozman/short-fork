<script setup lang="ts">
defineProps<{
  url: string;
  text: string;
}>();
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="relative w-full inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
  >
    <span
      class="relative w-full text-center px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-sm group-hover:bg-opacity-0"
    >
      {{ text }}
    </span>
  </a>
</template>
