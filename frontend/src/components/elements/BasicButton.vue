<script setup lang="ts">
defineProps<{
  url: string;
  text: string;
  theme: "blue" | "yellow" | "pink";
}>();
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="border focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
    :class="{
      'text-yellow-400 hover:text-white border-yellow-300 hover:bg-yellow-300 focus:ring-yellow-300 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900':
        theme === 'yellow',
      'text-pink-400 hover:text-white border-pink-400 hover:bg-pink-500 focus:ring-pink-300 dark:border-pink-300 dark:text-pink-300 dark:hover:text-white dark:hover:bg-pink-400 dark:focus:ring-pink-900':
        theme === 'pink',
      'text-blue-700 hover:text-white border-blue-700 hover:bg-blue-800  focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800':
        theme === 'blue',
    }"
  >
    {{ text }}
  </a>
</template>
