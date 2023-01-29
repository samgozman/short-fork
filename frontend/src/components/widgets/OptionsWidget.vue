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
import type { ITagElement } from "@/components/interfaces/TagElement.interface";
import type { IOptionsTags } from "@/components/interfaces/OptionsTags.interface";
import { TagThemes } from "@/components/enums/TagThemes.enum";
import { getTagColor } from "@/components/utils/getTagColor";

interface Data {
  /** To store key:value data from API */
  tagsValues: IOptionsTags;
  /** To store tags for rendering */
  tags: ITagElement[];
}

export default defineComponent({
  data(): Data {
    return {
      tagsValues: {} as IOptionsTags,
      tags: [],
    };
  },
  methods: {
    submitStock(stock: string) {
      console.log(stock);
    },
    prepareTags() {
      this.tags = [
        {
          key: "IV",
          value: (this.tagsValues.impliedVolatility ?? "") + "%",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Volat Avg",
          value: (this.tagsValues.historicalVolatility ?? "") + "%",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Tod Vol",
          value: this.tagsValues.todaysVolume ?? "",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Vol Avg",
          value: this.tagsValues.volumeAvg30Day ?? "",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "TOD OI",
          value: this.tagsValues.todaysOpenInterest ?? "",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "OI Avg",
          value: this.tagsValues.openInt30Day ?? "",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "PCR",
          value: this.tagsValues.putCallVolRatio ?? "",
          theme: getTagColor(this.tagsValues.putCallVolRatio, {
            best: [0, 0.7],
            worst: [1, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "PCR (OI)",
          value: this.tagsValues.putCallOiRatio ?? "",
          theme: getTagColor(this.tagsValues.putCallOiRatio, {
            best: [0, 0.7],
            worst: [1, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "IV Rank",
          value: (this.tagsValues.ivRank ?? "") + "%",
          theme: getTagColor(this.tagsValues.ivRank, {
            best: [0, 30],
            worst: [70, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "IV PC",
          value: (this.tagsValues.ivPercentile ?? "") + "%",
          theme: getTagColor(this.tagsValues.ivPercentile, {
            best: [0, 30],
            worst: [70, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
      ];
    },
  },
  mounted() {
    this.prepareTags();
  },
});
</script>
