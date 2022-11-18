import {createI18n} from 'vue-i18n'
import zh_CN from "~/locales/zh_CN";
import en_US from "~/locales/en_US";

export default defineNuxtPlugin(({vueApp}) => {
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: 'zh_CN', // 默认显示语言
        fallbackLocale: 'en_US', // 次要语言
        messages: {
            zh_CN,
            en_US
        },
    })

    vueApp.use(i18n)
})