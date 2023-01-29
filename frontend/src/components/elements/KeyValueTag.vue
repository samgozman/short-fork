<script setup lang="ts">
import type { TagElement } from "@/components/elements/interfaces/TagElement.interface";
import { TagThemes } from "@/components/elements/interfaces/TagElement.interface";

const props = defineProps<{
  element: TagElement;
}>();
const modalId = "modal_" + props.element.key.replace(/\W+/g, "_");
</script>

<template>
  <div class="w-full flex h-6">
    <button
      class="bg-gray-700 text-gray-100 dark:bg-gray-700 dark:text-gray-100 text-xs font-medium rounded-l w-full leading-6 pl-2"
      :data-modal-target="modalId"
      :data-modal-toggle="modalId"
    >
      {{ element.key }}
    </button>
    <span
      class="text-xs font-medium rounded-r w-full leading-6 text-center"
      :class="{
        'bg-red-500 text-red-100 dark:bg-red-600 dark:text-red-100':
          element.theme === TagThemes.Red,
        'bg-green-500 text-green-100 dark:bg-green-600 dark:text-green-200':
          element.theme === TagThemes.Green,
        'bg-yellow-400 text-gray-800 dark:bg-yellow-500 dark:text-gray-700':
          element.theme === TagThemes.Yellow,
        'bg-gray-200 text-gray-700 dark:bg-gray-200 dark:text-gray-700':
          element.theme === TagThemes.Gray,
      }"
    >
      {{ element.value }}
    </span>

    <!-- Main modal -->
    <div
      :id="modalId"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
    >
      <div class="relative w-full h-full max-w-2xl md:h-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ element.title }}
            </h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              :data-modal-hide="modalId"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
              <strong>{{ element.title }}</strong> - {{ element.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { initModals } from "flowbite";

export default defineComponent({
  mounted() {
    initModals();
  },
});
</script>
