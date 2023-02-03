import { createApp } from "vue";
import VueApexCharts from "vue3-apexcharts";
import ApexCharts from "apexcharts";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(router);

app.use(VueApexCharts);
app.config.globalProperties.$apexcharts = ApexCharts;
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $apexcharts: typeof ApexCharts;
  }
}

app.mount("#app");
