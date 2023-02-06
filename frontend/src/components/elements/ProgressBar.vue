<script setup lang="ts">
defineProps<{
  label: string;
  // 0-5
  value: number;
}>();
const maxValue = 5;
</script>

<template>
  <div class="w-full">
    <div class="mb-1 text-base font-medium dark:text-white">
      {{ label }}
    </div>
    <div class="w-full bg-gray-200 rounded-full h-4 mb-4 dark:bg-gray-700">
      <div
        class="h-4 text-xs font-medium rounded-full text-center p-0.5 leading-none"
        :class="{
          'bg-gray-600 dark:bg-gray-300 text-gray-100': !value || value === 0,
          'bg-red-600 dark:bg-red-500 text-red-100': value <= 2.5,
          'bg-yellow-300 dark:bg-yellow-400 text-gray-700':
            value > 2.5 && value < 4,
          'bg-green-400 dark:bg-green-400 text-green-100': value >= 4,
        }"
        :style="{ width: `${(value / maxValue) * 100}%` }"
      >
        {{ value.toFixed(2) }}
      </div>
    </div>
  </div>
</template>
