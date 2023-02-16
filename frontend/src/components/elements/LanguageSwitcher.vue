<script setup lang="ts">
import { useI18n } from "vue-i18n";
import tr from "@/i18n/translation";
const { t, locale } = useI18n();

const supportedLocales = tr.supportedLocales;
</script>
<template>
  <select
    @change="switchLanguage"
    class="inline-flex items-center justify-center px-4 py-4 text-sm text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white border-0"
  >
    <option
      v-for="sLocale in supportedLocales"
      :key="`locale-${sLocale}`"
      :value="sLocale"
      :selected="locale === sLocale"
    >
      {{ t(`locale.${sLocale}`) }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      locale: "",
    };
  },
  methods: {
    async switchLanguage(event: Event) {
      const newLocale = (event.target as HTMLSelectElement).value;
      await tr.switchLanguage(newLocale);
    },
  },
});
</script>
