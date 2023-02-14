<template>
  <nav
    class="bg-white border-gray-200 px-2 sm:px-4 py-2 rounded-b dark:bg-gray-900 shadow-sm"
  >
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
        <div class="flex flex-col">
          <label class="relative inline-flex items-center cursor-pointer mr-1">
            <input type="checkbox" value="" class="sr-only peer" checked />
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

        <button
          type="button"
          data-dropdown-toggle="language-dropdown-menu"
          class="inline-flex items-center justify-center px-4 py-4 text-sm text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          🇬🇧 English
        </button>
        <!-- Dropdown -->
        <div
          class="z-50 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
          id="language-dropdown-menu"
        >
          <ul class="py-2" role="none">
            <li>
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
              >
                <div class="inline-flex items-center">🇬🇧 English</div>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
              >
                <div class="inline-flex items-center">🇷🇺 Russian</div>
              </a>
            </li>
          </ul>
        </div>
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
          class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <a
              href="#"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >{{ $t("nav.projects") }}</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >{{ $t("nav.support") }}</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >{{ $t("nav.code") }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
