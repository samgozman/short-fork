<script setup lang="ts">
import type { IEarnings } from "@/components/interfaces/earnings.interface";

defineProps<{
  earnings: IEarnings | undefined;
}>();
</script>

<template>
  <p>
    <strong>🎰 {{ $t("reportsWarning.waring") }}!</strong>
    {{ $t("reportsWarning.message") }}:
    {{ new Date(earnings?.date || "").toLocaleDateString("uk-UK") }}
    {{
      earnings?.marketTime === "AMC"
        ? $t("reportsWarning.amc")
        : $t("reportsWarning.bmc")
    }}
  </p>
</template>
