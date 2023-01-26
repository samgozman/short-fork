<script setup lang="ts">
enum TagThemes {
  Gray = "gray",
  Red = "red",
  Green = "green",
  Yellow = "yellow",
}

defineProps<{
  /** Values: 'gray', 'red', 'green', 'yellow' */
  theme: string;
}>();
</script>

<template>
  <div class="w-full flex h-6">
    <span
      class="bg-gray-700 text-gray-100 dark:bg-gray-700 dark:text-gray-100 text-xs font-medium rounded-l w-full leading-6 pl-2"
    >
      <slot name="key"></slot>
    </span>
    <span
      class="text-xs font-medium rounded-r w-full leading-6 text-center"
      :class="{
        'bg-red-500 text-red-100 dark:bg-red-600 dark:text-red-100':
          theme === TagThemes.Red,
        'bg-green-500 text-green-100 dark:bg-green-600 dark:text-green-200':
          theme === TagThemes.Green,
        'bg-yellow-400 text-gray-800 dark:bg-yellow-500 dark:text-gray-700':
          theme === TagThemes.Yellow,
        'bg-gray-200 text-gray-700 dark:bg-gray-200 dark:text-gray-700':
          theme === TagThemes.Gray,
      }"
    >
      <slot name="value"></slot>
    </span>
  </div>
</template>
