<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <main class="h-full bg-slate-50">
    <header class="container mx-auto">
      <h1>Header</h1>
    </header>
    <div class="container mx-auto">
      <RouterView />
    </div>
  </main>
</template>
