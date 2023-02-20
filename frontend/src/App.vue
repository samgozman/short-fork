<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/elements/navigation/NavBar.vue";
import OctoCat from "@/components/elements/OctoCat.vue";
</script>

<template>
  <main class="h-full bg-slate-50">
    <header class="container mx-auto px-2 pb-1.5">
      <NavBar />
    </header>
    <div class="container mx-auto">
      <RouterView />
    </div>
    <OctoCat />
  </main>
</template>
