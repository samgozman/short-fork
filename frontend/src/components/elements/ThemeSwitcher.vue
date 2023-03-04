<template>
  <div class="flex flex-col">
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        v-model="checked"
        :true-value="true"
        :false-value="false"
        class="sr-only peer"
        @change="switchTheme"
      />
      <div
        :class="[
          'w-11',
          'h-6',
          'bg-gray-200',
          'rounded-full',
          'peer',
          'peer-focus:ring-4',
          'peer-focus:ring-blue-300',
          'dark:peer-focus:ring-blue-800',
          'dark:bg-gray-700',
          'peer-checked:after:translate-x-full',
          'peer-checked:after:border-white',
          'after:content-[\'\']',
          'after:absolute',
          'after:top-0.5',
          'after:left-[2px]',
          'after:bg-white',
          'after:border-gray-300',
          'after:border',
          'after:rounded-full',
          'after:h-5',
          'after:w-5',
          'after:transition-all',
          'dark:border-gray-600',
          'peer-checked:bg-blue-600',
        ]"
      ></div>
    </label>
    <span class="text-xs text-center leading-relaxed">
      {{ $t("nav.theme.light") }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    switchTheme() {
      if (this.checked) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("user-theme", "dark");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        localStorage.setItem("user-theme", "light");
      }
    },
  },
  mounted() {
    const stored = localStorage.getItem("user-theme");
    this.checked =
      stored === "dark" ||
      (stored === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    this.switchTheme();
  },
});
</script>
