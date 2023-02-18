<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";
import type { IInsider } from "@/components/interfaces/insider.interface";

defineProps<{
  insidersTrades: IInsider[];
}>();
</script>

<template>
  <div class="w-full">
    <HeaderH5>{{ $t("insidersTrades.title") }}</HeaderH5>

    <div class="relative overflow-x-auto max-h-[29rem] rounded">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase border-b-4 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-2 md:px-6 py-3">
              {{ $t("insidersTrades.table.insider") }}
            </th>
            <th scope="col" class="px-2 md:px-6 py-3">
              {{ $t("insidersTrades.table.date") }}
            </th>
            <th scope="col" class="px-2 md:px-6 py-3">
              {{ $t("insidersTrades.table.transaction") }}
            </th>
            <th scope="col" class="px-2 md:px-6 py-3">
              {{ $t("insidersTrades.table.value") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(trade, i) of insidersTrades"
            :key="i"
            class="border-b dark:border-gray-700"
            :class="{
              'bg-red-100': trade.transaction === 'Sale',
              'bg-green-100': trade.transaction === 'Buy',
            }"
          >
            <th
              scope="row"
              class="px-2 md:px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ trade.insiderTrading }}
            </th>
            <td class="px-2 md:px-6 py-4">{{ trade.date }}</td>
            <td class="px-2 md:px-6 py-4">{{ trade.transaction }}</td>
            <td class="px-2 md:px-6 py-4">{{ trade.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
