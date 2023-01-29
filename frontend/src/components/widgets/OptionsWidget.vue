<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import KeyValueTag from "@/components/elements/KeyValueTag.vue";

defineProps<{
  ticker: string;
}>();
</script>

<template>
  <div class="w-full">
    <HeaderH5>Options</HeaderH5>
    <div class="grid grid-cols-2 gap-2">
      <KeyValueTag v-for="tag in tags" :key="tag.key" :element="tag" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { TagElement } from "@/components/elements/interfaces/TagElement.interface";

export default defineComponent({
  data() {
    return {
      tags: [
        {
          key: "Key 5",
          value: "Value 1",
          theme: "gray",
          title: "Some title for tag 1",
          description: "some description for tag 1",
        },
        {
          key: "Key 6",
          value: "Value 2",
          theme: "green",
          title: "Some title for tag 2",
          description: "some description for tag 2",
        },
        {
          key: "Key 7",
          value: "Value 3",
          theme: "gray",
          title: "Some title for tag 3",
          description: "some description for tag 3",
        },
        {
          key: "Key 8",
          value: "Value 4",
          theme: "gray",
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
      ] as TagElement[],
    };
  },
  methods: {
    submitStock(stock: string) {
      console.log(stock);
    },
  },
});
</script>
