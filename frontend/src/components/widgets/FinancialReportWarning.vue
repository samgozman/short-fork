<script setup lang="ts">
import type { IEarnings } from "@/components/interfaces/earnings.interface";

defineProps<{
  earnings: IEarnings | undefined;
}>();
</script>

<template>
  <p>
    <strong>🎰 Warning!</strong> Earnings report is close:
    {{ new Date(earnings?.date || "").toLocaleDateString("uk-UK") }}
    {{
      earnings?.marketTime === "AMC"
        ? "after market close"
        : "before market close"
    }}
  </p>
</template>
