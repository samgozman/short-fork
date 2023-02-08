<script setup lang="ts">
defineProps<{
  link: string;
}>();
</script>

<template>
  <a
    :href="link"
    target="_blank"
    rel="nofollow"
    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
  >
    <slot></slot>
  </a>
</template>
