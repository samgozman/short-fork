<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/elements/navigation/NavBar.vue";
import OctoCat from "@/components/elements/OctoCat.vue";
</script>

<template>
  <main class="h-full bg-slate-50 dark:bg-zinc-900">
    <header class="container mx-auto px-2 pb-1.5">
      <NavBar @localeChanged="localeChanged" />
    </header>
    <div class="container mx-auto">
      <RouterView :currentLocale="locale" />
    </div>
    <OctoCat />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import tr from "@/i18n/translation";

export default defineComponent({
  data() {
    return {
      locale: tr.guessDefaultLocale(),
    };
  },
  methods: {
    async localeChanged() {
      this.locale = tr.guessDefaultLocale();
    },
  },
});
</script>
