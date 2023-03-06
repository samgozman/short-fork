import { ref } from "vue";

type Theme = "light" | "dark";

export const currentTheme = ref<Theme>("light");
