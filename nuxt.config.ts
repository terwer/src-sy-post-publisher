// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // nitro
    nitro: {
        preset: "vercel",
    },

    // css
    css: [
        '~/assets/style.scss',
        '~/assets/style.dark.scss',
    ],
})
