<script setup lang="ts">
import HeaderH6 from "@/components/layout/typography/HeaderH6.vue";
import BasicButton from "@/components/elements/BasicButton.vue";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-col w-full md:max-w-[300px] mx-auto">
      <HeaderH6 id="support" class="text-center">
        {{ $t("footer.supportHeader") }}:
      </HeaderH6>
      <div class="flex flex-col my-4">
        <BasicButton
          v-if="locale === 'ru'"
          url="https://www.tinkoff.ru/rm/gozman.semen1/Ol0PS3882"
          text="Поддержать на Tinkoff"
          theme="yellow"
        />
        <BasicButton
          url="https://ko-fi.com/samgozman"
          text="ko-fi: Buy me a coffee"
          theme="pink"
        />
        <BasicButton
          url="https://paypal.me/sgozman"
          text="Support on PayPal"
          theme="blue"
        />
      </div>
    </div>
    <div class="flex flex-col my-auto text-center mx-auto">
      <p>
        {{ $t("footer.created") }}:
        <a
          href="https://github.com/samgozman"
          target="_blank"
          class="text-blue-500 hover:text-blue-600"
        >
          samgozman
        </a>
      </p>
      <p v-if="locale === 'ru'">
        Tinkoff pulse:
        <a
          href="https://www.tinkoff.ru/invest/social/profile/aqua_disco/"
          target="_blank"
          class="text-blue-500 hover:text-blue-600"
        >
          aqua_disco
        </a>
      </p>
    </div>
  </div>
</template>
