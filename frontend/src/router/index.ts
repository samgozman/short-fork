import { createRouter, createWebHistory, RouterView } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import tr from "@/i18n/translation";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:locale?",
      component: RouterView,
      /** Middleware to control locale change */
      beforeEnter: async (to, _from, next) => {
        const paramLocale = to.params.locale;
        if (
          !paramLocale ||
          typeof paramLocale !== "string" ||
          paramLocale === ""
        ) {
          return next(tr.guessDefaultLocale());
        }

        if (!tr.isLocaleSupported(paramLocale)) {
          return next(tr.guessDefaultLocale());
        }
        await tr.switchLanguage(paramLocale);
        return next();
      },
      children: [
        {
          path: ":ticker?",
          name: "home",
          component: HomeView,
        },
      ],
    },
  ],
});

export default router;
