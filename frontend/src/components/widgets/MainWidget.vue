<script setup lang="ts">
import InputWithSubmit from "@/components/elements/InputWithSubmit.vue";
import KeyValueTag from "@/components/elements/KeyValueTag.vue";
</script>

<template>
  <div class="w-full">
    <InputWithSubmit
      @submitStock="submitStock"
      @getFinviz="getFinviz"
      @getShortsqueeze="getShortsqueeze"
      class="mb-4"
    />
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
import type { ITagElement } from "@/components/interfaces/TagElement.interface";
import type { IMainTags } from "@/components/interfaces/MainTags.interface";
import { TagThemes } from "@/components/enums/TagThemes.enum";
import { getTagColor } from "@/components/utils/getTagColor";
import { FetchData } from "@/components/utils/FetchData";

interface Data {
  /** To store key:value data from API */
  tagsValues: IMainTags;
  /** To store tags for rendering */
  tags: ITagElement[];
}

export default defineComponent({
  data(): Data {
    return {
      tagsValues: {} as IMainTags,
      tags: [],
    };
  },
  methods: {
    submitStock(stock: string) {
      this.$emit("getBarchart", stock);
    },
    async getFinviz(stock: string) {
      const finviz = await FetchData.getFinviz(stock);
      this.tagsValues = Object.assign(this.tagsValues, {
        name: finviz.name,
        exchange: finviz.exchange,
        country: finviz.country,
        price: finviz.price,
        pe: finviz.pe,
        forwardPe: finviz.forwardPe,
        ps: finviz.ps,
        pb: finviz.pb,
        roe: finviz.roe,
        roa: finviz.roa,
        debtEq: finviz.debtEq,
        shortFloat: finviz.shortFloat,
        targetPercent: finviz.targetPrice
          ? ((finviz.targetPrice / finviz.price - 1) * 100).toFixed(1)
          : null,
        rsi: finviz.rsi,
        recommendation: finviz.recommendation,
        site: finviz.site,
        peg: finviz.peg,
        dividendPercent: finviz.dividendPercent,
        instOwn: finviz.instOwn,
        insiderOwn: finviz.insiderOwn,
        beta: finviz.beta,
        shortRatio: finviz.shortRatio,
      });
      this.prepareTags();

      this.$emit("getInsiders", finviz.insidersDeals);
      this.$emit("stockWithExchange", stock, finviz.exchange);
      this.$emit("setEarnings", finviz.earnings);
    },
    async getShortsqueeze(stock: string) {
      const shortsqueeze = await FetchData.getShortsqueeze(stock);
      this.tagsValues.shortsqueezeShortFloat = shortsqueeze.shortFlow;
      this.prepareTags();
    },
    prepareTags() {
      this.tags = [
        {
          key: "P/E",
          value: this.tagsValues.pe ?? "",
          theme: getTagColor(this.tagsValues.pe, {
            best: [0, 15],
            worst: [25, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Price",
          value: this.tagsValues.price ?? "",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Forward P/E",
          value: this.tagsValues.forwardPe ?? "",
          theme: getTagColor(this.tagsValues.forwardPe, {
            best: [0, 15],
            worst: [25, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Dividend",
          value: (this.tagsValues.dividendPercent ?? "") + "%",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "P/S",
          value: this.tagsValues.ps ?? "",
          theme: getTagColor(this.tagsValues.ps, {
            best: [0, 1],
            worst: [3, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Beta",
          value: this.tagsValues.beta ?? "",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "P/B",
          value: this.tagsValues.pb ?? "",
          theme: getTagColor(this.tagsValues.pb, {
            best: [0, 1],
            worst: [4, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "SV for 24h",
          value: this.tagsValues.tightShortsShortVol ?? "",
          theme: getTagColor(this.tagsValues.tightShortsShortVol, {
            best: [0, 30],
            worst: [70, 100],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "PEG",
          value: this.tagsValues.peg ?? "",
          theme: getTagColor(this.tagsValues.peg, {
            best: [0, 1],
            worst: [3, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Short Float S",
          value: (this.tagsValues.shortsqueezeShortFloat ?? "") + "%",
          theme: getTagColor(this.tagsValues.shortsqueezeShortFloat, {
            best: [0, 3],
            worst: [20, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "ROE",
          value: (this.tagsValues.roe ?? "") + "%",
          theme: getTagColor(this.tagsValues.roe, {
            best: [0, 40],
            worst: [-Infinity, 0],
            normal: [40, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Short Float F",
          value: (this.tagsValues.shortFloat ?? "") + "%",
          theme: getTagColor(this.tagsValues.shortFloat, {
            best: [0, 3],
            worst: [20, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "ROA",
          value: (this.tagsValues.roa ?? "") + "%",
          theme: getTagColor(this.tagsValues.roa, {
            best: [0, 100],
            worst: [-Infinity, 0],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Short Ratio",
          value: this.tagsValues.shortRatio ?? "",
          theme: getTagColor(this.tagsValues.shortRatio, {
            best: [0, 4],
            worst: [10, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Debt/Equity",
          value: this.tagsValues.debtEq ?? "",
          theme: getTagColor(this.tagsValues.debtEq, {
            best: [0, 0.4],
            worst: [1, Infinity],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Country",
          value: this.tagsValues.country ?? "",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Inst Own",
          value: (this.tagsValues.instOwn ?? "") + "%",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Target Price",
          value:
            this.tagsValues.targetPercent && this.tagsValues.targetPercent > 0
              ? "+" + this.tagsValues.targetPercent + "%"
              : this.tagsValues.targetPercent ?? "" + "%",
          theme: getTagColor(this.tagsValues.targetPercent, {
            best: [0, Infinity],
            worst: [-Infinity, 0],
          }),
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "Insider Own",
          value: (this.tagsValues.insiderOwn ?? "") + "%",
          theme: TagThemes.Gray,
          title: "Some title for tag 4",
          description: "some description for tag 4",
        },
        {
          key: "RSI",
          value: this.tagsValues.rsi ?? "",
          theme: getTagColor(this.tagsValues.rsi, {
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
