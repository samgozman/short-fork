<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import KeyValueTag from "@/components/elements/KeyValueTag.vue";
import type { IBarchartOptions } from "@/components/interfaces/options.interafce";
import HiddenParagraph from "@/components/layout/typography/HiddenParagraph.vue";

defineProps<{
  options: IBarchartOptions;
  currentLocale: string;
}>();
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <HeaderH5>{{ $t("options.title") }}</HeaderH5>
    <div class="grow">
      <div class="grid grid-cols-2 gap-2 mb-4">
        <KeyValueTag v-for="tag in tags" :key="tag.key" :element="tag" />
      </div>
    </div>
    <HiddenParagraph>
      {{ $t("options.disclaimer") }}
    </HiddenParagraph>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ITagElement } from "@/components/interfaces/TagElement.interface";
import { TagThemes } from "@/components/enums/TagThemes.enum";
import { getTagColor } from "@/components/utils/getTagColor";

interface Data {
  /** To store key:value data from API */
  tagsValues: IBarchartOptions;
  /** To store tags for rendering */
  tags: ITagElement[];
}

export default defineComponent({
  data(): Data {
    return {
      tagsValues: {} as IBarchartOptions,
      tags: [],
    };
  },
  methods: {
    prepareTags() {
      this.tags = [
        {
          key: this.$t("tags.options.iv.short"),
          value: (this.tagsValues.impliedVolatility ?? "") + "%",
          theme: TagThemes.Gray,
          title: this.$t("tags.options.iv.full"),
          description: this.$t("tags.options.iv.description"),
        },
        {
          key: this.$t("tags.options.volatAvg.short"),
          value: (this.tagsValues.historicalVolatility ?? "") + "%",
          theme: TagThemes.Gray,
          title: this.$t("tags.options.volatAvg.full"),
          description: this.$t("tags.options.volatAvg.description"),
        },
        {
          key: this.$t("tags.options.todVol.short"),
          value: this.tagsValues.todaysVolume ?? "",
          theme: TagThemes.Gray,
          title: this.$t("tags.options.todVol.full"),
          description: this.$t("tags.options.todVol.description"),
        },
        {
          key: this.$t("tags.options.volAvg.short"),
          value: this.tagsValues.volumeAvg30Day ?? "",
          theme: TagThemes.Gray,
          title: this.$t("tags.options.volAvg.full"),
          description: this.$t("tags.options.volAvg.description"),
        },
        {
          key: this.$t("tags.options.todOi.short"),
          value: this.tagsValues.todaysOpenInterest ?? "",
          theme: TagThemes.Gray,
          title: this.$t("tags.options.todOi.full"),
          description: this.$t("tags.options.todOi.description"),
        },
        {
          key: this.$t("tags.options.oiAvg.short"),
          value: this.tagsValues.openInt30Day ?? "",
          theme: TagThemes.Gray,
          title: this.$t("tags.options.oiAvg.full"),
          description: this.$t("tags.options.oiAvg.description"),
        },
        {
          key: this.$t("tags.options.pcr.short"),
          value: this.tagsValues.putCallVolRatio ?? "",
          theme: getTagColor(this.tagsValues.putCallVolRatio, {
            best: [0, 0.7],
            worst: [1, Infinity],
          }),
          title: this.$t("tags.options.pcr.full"),
          description: this.$t("tags.options.pcr.description"),
        },
        {
          key: this.$t("tags.options.pcrOi.short"),
          value: this.tagsValues.putCallOiRatio ?? "",
          theme: getTagColor(this.tagsValues.putCallOiRatio, {
            best: [0, 0.7],
            worst: [1, Infinity],
          }),
          title: this.$t("tags.options.pcrOi.full"),
          description: this.$t("tags.options.pcrOi.description"),
        },
        {
          key: this.$t("tags.options.ivRank.short"),
          value: (this.tagsValues.ivRank ?? "") + "%",
          theme: getTagColor(this.tagsValues.ivRank, {
            best: [0, 30],
            worst: [70, Infinity],
          }),
          title: this.$t("tags.options.ivRank.full"),
          description: this.$t("tags.options.ivRank.description"),
        },
        {
          key: this.$t("tags.options.ivPc.short"),
          value: (this.tagsValues.ivPercentile ?? "") + "%",
          theme: getTagColor(this.tagsValues.ivPercentile, {
            best: [0, 30],
            worst: [70, Infinity],
          }),
          title: this.$t("tags.options.ivPc.full"),
          description: this.$t("tags.options.ivPc.description"),
        },
      ];
    },
  },
  mounted() {
    if (this.options) {
      this.tagsValues = this.options;
    }
    this.prepareTags();
  },
});
</script>
