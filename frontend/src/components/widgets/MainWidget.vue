<script setup lang="ts">
import InputWithSubmit from "@/components/elements/InputWithSubmit.vue";
import KeyValueTag from "@/components/elements/KeyValueTag.vue";
import ErrorText from "@/components/layout/typography/ErrorText.vue";
import ExternalLink from "@/components/elements/ExternalLink.vue";
import HiddenParagraph from "@/components/layout/typography/HiddenParagraph.vue";
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <InputWithSubmit
      @submitStock="submitStock"
      @getFinviz="getFinviz"
      @getShortsqueeze="getShortsqueeze"
      @getTightshorts="getTightshorts"
      class="mb-4"
    />
    <div class="grow w-full mb-4">
      <strong>{{ $t("mainWidget.website") }}: </strong>
      <ExternalLink :link="generalInfo.site ?? ''">{{
        generalInfo.site
      }}</ExternalLink>
      <br />
      <strong> {{ $t("mainWidget.company") }}: </strong>
      <span>{{ generalInfo.name }}</span>
      (<span>{{ generalInfo.country }}</span
      >)
      <br />
      <strong>{{ $t("mainWidget.closestEarnings") }}: </strong>
      <span>{{ generalInfo.earningsDate }}</span> <br />
      <strong>{{ $t("mainWidget.reports") }}: </strong
      ><span>
        <ExternalLink
          :link="`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&amp;CIK=${stock}&amp;type=10-K&amp;dateb=&amp;owner=exclude&amp;count=40`"
        >
          10-K
        </ExternalLink>
        /
        <ExternalLink
          :link="`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&amp;CIK=${stock}&amp;type=10-Q&amp;dateb=&amp;owner=exclude&amp;count=40`"
        >
          10-Q
        </ExternalLink>
        /
        <ExternalLink
          :link="`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&amp;CIK=${stock}&amp;type=8-K&amp;dateb=&amp;owner=exclude&amp;count=40`"
        >
          8-K
        </ExternalLink>
      </span>
      <br />
      <strong>{{ $t("mainWidget.equityResearch") }}: </strong>
      <ExternalLink
        :link="`https://www.google.com/search?q=${stock}+equity+research+filetype%3Apdf`"
      >
        {{ $t("mainWidget.findResearch") }}
      </ExternalLink>
    </div>
    <!-- Block with tags  -->
    <div class="grid grid-cols-2 gap-2 mb-4">
      <KeyValueTag v-for="tag in tags" :key="tag.key" :element="tag" />
    </div>
    <ErrorText v-if="ifStockNotFound">{{ $t("mainWidget.error") }}</ErrorText>
    <HiddenParagraph>
      {{ $t("mainWidget.disclaimer") }}
    </HiddenParagraph>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ITagElement } from "@/components/interfaces/TagElement.interface";
import type { IMainTags } from "@/components/interfaces/MainTags.interface";
import { TagThemes } from "@/components/enums/TagThemes.enum";
import { getTagColor } from "@/components/utils/getTagColor";
import { FetchData } from "@/components/utils/FetchData";
import tr from "@/i18n/translation";

interface GeneralInfo {
  site?: string;
  name: string;
  earningsDate: number | null;
  country: string;
}

interface Data {
  /** To store key:value data from API */
  tagsValues: IMainTags;
  /** To store tags for rendering */
  tags: ITagElement[];
  ifStockNotFound: boolean;
  generalInfo: GeneralInfo;
  stock: string;
}

export default defineComponent({
  data(): Data {
    return {
      tagsValues: {} as IMainTags,
      tags: [],
      ifStockNotFound: false,
      generalInfo: {
        site: undefined,
        name: "",
        earningsDate: null,
        country: "",
      },
      stock: "",
    };
  },
  methods: {
    submitStock(stock: string) {
      this.stock = stock;
      this.$emit("getBarchartOverview", stock);
      this.$emit("getBarchartFinancials", stock);
      this.$router.push(
        tr.i18nRoute({ name: "home", params: { ticker: stock } })
      );
    },
    async getFinviz(stock: string) {
      const finviz = await FetchData.getFinviz(stock);

      if (!finviz) {
        this.ifStockNotFound = true;
        return;
      }

      this.generalInfo = {
        site: finviz.site ?? undefined,
        name: finviz.name,
        earningsDate: finviz.earnings.date,
        country: finviz.country,
      };

      this.tagsValues = Object.assign(this.tagsValues, {
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
      this.$emit(
        "setFinvizRating",
        finviz.recommendation ? 6 - finviz.recommendation : null
      );
      this.ifStockNotFound = false;
    },
    async getShortsqueeze(stock: string) {
      const shortsqueeze = await FetchData.getShortsqueeze(stock);
      this.tagsValues.shortsqueezeShortFloat = shortsqueeze
        ? shortsqueeze.shortFlow
        : null;
      this.prepareTags();
    },
    async getTightshorts(stock: string) {
      const tightshorts = await FetchData.getTightshorts(stock);
      if (tightshorts) {
        this.tagsValues.tightShortsShortVol = Number(
          tightshorts.currentShortVolume
        );
        this.$emit("setTightshortsChart", tightshorts.chart);
        this.prepareTags();
      }
    },
    prepareTags() {
      this.tags = [
        {
          key: this.$t("tags.main.pe.short"),
          value: this.tagsValues.pe ?? "",
          theme: getTagColor(this.tagsValues.pe, {
            best: [0, 15],
            worst: [25, Infinity],
          }),
          title: this.$t("tags.main.pe.full"),
          description: this.$t("tags.main.pe.description"),
        },
        {
          key: this.$t("tags.main.price.short"),
          value: "$" + (this.tagsValues.price ?? ""),
          theme: TagThemes.Gray,
          title: this.$t("tags.main.price.full"),
          description: this.$t("tags.main.price.description"),
        },
        {
          key: this.$t("tags.main.fpe.short"),
          value: this.tagsValues.forwardPe ?? "",
          theme: getTagColor(this.tagsValues.forwardPe, {
            best: [0, 15],
            worst: [25, Infinity],
          }),
          title: this.$t("tags.main.fpe.full"),
          description: this.$t("tags.main.fpe.description"),
        },
        {
          key: this.$t("tags.main.dividend.short"),
          value: (this.tagsValues.dividendPercent ?? "") + "%",
          theme: TagThemes.Gray,
          title: this.$t("tags.main.dividend.full"),
          description: this.$t("tags.main.dividend.description"),
        },
        {
          key: this.$t("tags.main.ps.short"),
          value: this.tagsValues.ps ?? "",
          theme: getTagColor(this.tagsValues.ps, {
            best: [0, 1],
            worst: [3, Infinity],
          }),
          title: this.$t("tags.main.ps.full"),
          description: this.$t("tags.main.ps.description"),
        },
        {
          key: this.$t("tags.main.beta.short"),
          value: this.tagsValues.beta ?? "",
          theme: TagThemes.Gray,
          title: this.$t("tags.main.beta.full"),
          description: this.$t("tags.main.beta.description"),
        },
        {
          key: this.$t("tags.main.pb.short"),
          value: this.tagsValues.pb ?? "",
          theme: getTagColor(this.tagsValues.pb, {
            best: [0, 1],
            worst: [4, Infinity],
          }),
          title: this.$t("tags.main.pb.full"),
          description: this.$t("tags.main.pb.description"),
        },
        {
          key: this.$t("tags.main.sv.short"),
          value: (this.tagsValues.tightShortsShortVol ?? "") + "%",
          theme: getTagColor(this.tagsValues.tightShortsShortVol, {
            best: [0, 30],
            worst: [70, 100],
          }),
          title: this.$t("tags.main.sv.full"),
          description: this.$t("tags.main.sv.description"),
        },
        {
          key: this.$t("tags.main.peg.short"),
          value: this.tagsValues.peg ?? "",
          theme: getTagColor(this.tagsValues.peg, {
            best: [0, 1],
            worst: [3, Infinity],
          }),
          title: this.$t("tags.main.peg.full"),
          description: this.$t("tags.main.peg.description"),
        },
        {
          key: this.$t("tags.main.sfs.short"),
          value: (this.tagsValues.shortsqueezeShortFloat ?? "") + "%",
          theme: getTagColor(this.tagsValues.shortsqueezeShortFloat, {
            best: [0, 3],
            worst: [20, Infinity],
          }),
          title: this.$t("tags.main.sfs.full"),
          description: this.$t("tags.main.sfs.description"),
        },
        {
          key: this.$t("tags.main.roe.short"),
          value: (this.tagsValues.roe ?? "") + "%",
          theme: getTagColor(this.tagsValues.roe, {
            best: [0, 40],
            worst: [-Infinity, 0],
            normal: [40, Infinity],
          }),
          title: this.$t("tags.main.roe.full"),
          description: this.$t("tags.main.roe.description"),
        },
        {
          key: this.$t("tags.main.sff.short"),
          value: (this.tagsValues.shortFloat ?? "") + "%",
          theme: getTagColor(this.tagsValues.shortFloat, {
            best: [0, 3],
            worst: [20, Infinity],
          }),
          title: this.$t("tags.main.sff.full"),
          description: this.$t("tags.main.sff.description"),
        },
        {
          key: this.$t("tags.main.roa.short"),
          value: (this.tagsValues.roa ?? "") + "%",
          theme: getTagColor(this.tagsValues.roa, {
            best: [0, 100],
            worst: [-Infinity, 0],
          }),
          title: this.$t("tags.main.roa.full"),
          description: this.$t("tags.main.roa.description"),
        },
        {
          key: this.$t("tags.main.sr.short"),
          value: this.tagsValues.shortRatio ?? "",
          theme: getTagColor(this.tagsValues.shortRatio, {
            best: [0, 4],
            worst: [10, Infinity],
          }),
          title: this.$t("tags.main.sr.full"),
          description: this.$t("tags.main.sr.description"),
        },
        {
          key: this.$t("tags.main.de.short"),
          value: this.tagsValues.debtEq ?? "",
          theme: getTagColor(this.tagsValues.debtEq, {
            best: [0, 0.4],
            worst: [1, Infinity],
          }),
          title: this.$t("tags.main.de.full"),
          description: this.$t("tags.main.de.description"),
        },
        {
          key: this.$t("tags.main.country.short"),
          value: this.tagsValues.country ?? "",
          theme: TagThemes.Gray,
          title: this.$t("tags.main.country.full"),
          description: this.$t("tags.main.country.description"),
        },
        {
          key: this.$t("tags.main.instOwn.short"),
          value: (this.tagsValues.instOwn ?? "") + "%",
          theme: TagThemes.Gray,
          title: this.$t("tags.main.instOwn.full"),
          description: this.$t("tags.main.instOwn.description"),
        },
        {
          key: this.$t("tags.main.targetPrice.short"),
          value:
            this.tagsValues.targetPercent && this.tagsValues.targetPercent > 0
              ? "+" + this.tagsValues.targetPercent + "%"
              : this.tagsValues.targetPercent ?? "" + "%",
          theme: getTagColor(this.tagsValues.targetPercent, {
            best: [0, Infinity],
            worst: [-Infinity, 0],
          }),
          title: this.$t("tags.main.targetPrice.full"),
          description: this.$t("tags.main.targetPrice.description"),
        },
        {
          key: this.$t("tags.main.insiderOwn.short"),
          value: (this.tagsValues.insiderOwn ?? "") + "%",
          theme: TagThemes.Gray,
          title: this.$t("tags.main.insiderOwn.full"),
          description: this.$t("tags.main.insiderOwn.description"),
        },
        {
          key: this.$t("tags.main.rsi.short"),
          value: this.tagsValues.rsi ?? "",
          theme: getTagColor(this.tagsValues.rsi, {
            best: [0, 30],
            worst: [70, Infinity],
          }),
          title: this.$t("tags.main.rsi.full"),
          description: this.$t("tags.main.rsi.description"),
        },
      ];
    },
  },
  async beforeMount() {
    const ticker = this.$route.params.ticker;
    if (ticker && ticker !== "" && typeof ticker === "string") {
      this.submitStock(ticker);
      await Promise.all([
        this.getFinviz(ticker),
        this.getShortsqueeze(ticker),
        this.getTightshorts(ticker),
      ]);
    }
  },
  mounted() {
    this.prepareTags();
  },
});
</script>
