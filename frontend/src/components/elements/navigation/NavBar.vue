<script setup lang="ts">
import LanguageSwitcher from "@/components/elements/languageSwitcher/LanguageSwitcher.vue";
import ThemeSwitcher from "@/components/elements/themeSwitcher/ThemeSwitcher.vue";
</script>

<template>
  <nav
    class="bg-white border-gray-200 px-2 sm:px-4 py-2 rounded-b dark:bg-slate-700 shadow-sm"
  >
    <!-- <div class="container flex flex-wrap items-center justify-between mx-auto">
      <p class="w-full text-center dark:text-white font-medium">
        <span class="font-bold">{{ $t("nav.attention.title") }}</span>
        {{ $t("nav.attention.messageOne") }}
        <a
          href="https://short-fork.extr.app"
          class="text-blue-500 hover:text-blue-600"
          >https://short-fork.extr.app</a
        >. {{ $t("nav.attention.messageTwo") }}
      </p>
    </div> -->
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <a href="#" class="flex items-center md:w-[160px]">
        <span
          class="self-center text-xl font-semibold whitespace-nowrap dark:text-white px-4"
          >Short-fork</span
        >
      </a>
      <div
        class="flex justify-between md:justify-end items-center md:order-2 md:w-[160px]"
      >
        <ThemeSwitcher class="mr-4" />
        <LanguageSwitcher />

        <button
          data-collapse-toggle="mobile-menu-language-select"
          type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu-language-select"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            fill="currentColor"
            aria-hidden="true"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="mobile-menu-language-select"
      >
        <ul
          class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-slate-700 dark:border-slate-700"
        >
          <li>
            <a
              href="#support"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-300 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >{{ $t("nav.support") }}</a
            >
          </li>
          <li>
            <a
              href="https://github.com/samgozman/short-fork"
              target="_blank"
              rel="nofollow noopener noreferrer"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-300 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >{{ $t("nav.code") }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
