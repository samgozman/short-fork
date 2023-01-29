<script setup lang="ts">
import InputWithSubmit from "@/components/elements/InputWithSubmit.vue";
import KeyValueTag from "@/components/elements/KeyValueTag.vue";
</script>

<template>
  <div class="w-full">
    <InputWithSubmit @submitStock="submitStock" class="mb-4" />
    <div class="w-full">
      <p>Some general info</p>
    </div>
    <!-- Block with tags  -->
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
          key: "Key $1",
          value: "Value 1",
          theme: "gray",
          title: "Some title for tag 1",
          description: "some description for tag 1",
        },
        {
          key: "Ke/y 2",
          value: "Value 2",
          theme: "green",
          title: "Some title for tag 2",
          description: "some description for tag 2",
        },
        {
          key: "Key 3",
          value: "Value 3",
          theme: "red",
          title: "Some title for tag 3",
          description: "some description for tag 3",
        },
        {
          key: "Key 4",
          value: "Value 4",
          theme: "yellow",
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
