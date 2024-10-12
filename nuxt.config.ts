import Aura from "@primevue/themes/aura";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module"],
  plugins: [require('tailwindcss-primeui')],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  }
});
