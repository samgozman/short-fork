<script setup lang="ts">
import HeaderH5 from "@/components/layout/typography/HeaderH5.vue";

interface InsiderTrade {
  insider: string;
  date: string;
  transaction: "Buy" | "Sell";
  value: string;
}

defineProps<{
  insidersTrades: InsiderTrade[];
}>();
</script>

<template>
  <div class="w-full">
    <HeaderH5>Insiders trades</HeaderH5>

    <div class="relative overflow-x-auto max-h-96 rounded">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase border-b-4 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Insider</th>
            <th scope="col" class="px-6 py-3">Date</th>
            <th scope="col" class="px-6 py-3">Transaction</th>
            <th scope="col" class="px-6 py-3">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="trade in insidersTrades"
            :key="trade.date"
            class="border-b dark:border-gray-700"
            :class="{
              'bg-green-100': trade.transaction === 'Buy',
              'bg-red-100': trade.transaction === 'Sell',
            }"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ trade.insider }}
            </th>
            <td class="px-6 py-4">{{ trade.date }}</td>
            <td class="px-6 py-4">{{ trade.transaction }}</td>
            <td class="px-6 py-4">{{ trade.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
