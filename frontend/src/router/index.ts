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
          paramLocale === "" ||
          !tr.isLocaleSupported(paramLocale)
        ) {
          return next({
            path: tr.guessDefaultLocale(),
            query: to.query,
          });
        }

        await tr.switchLanguage(paramLocale);
        return next();
      },
      children: [
        {
          path: ":ticker?",
          name: "home",
          component: HomeView,
          /** Redirect from previous short-fork path `/?stock=` */
          beforeEnter: (to, _from, next) => {
            const queryTicker = to.query.stock;
            if (
              queryTicker &&
              typeof queryTicker === "string" &&
              queryTicker !== ""
            ) {
              return next(
                tr.i18nRoute({
                  name: "home",
                  params: { ticker: queryTicker },
                })
              );
            }

            return next();
          },
        },
      ],
    },
  ],
});

export default router;
