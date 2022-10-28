<template>
  <div>Vuepress</div>
</template>

<script>
import {getConf, setConf} from "@/lib/config";
import {
  PUBLISH_API_URL_KEY_CONSTANTS,
  PUBLISH_HOME_KEY_CONSTANTS, PUBLISH_PASSWORD_KEY_CONSTANTS,
  PUBLISH_TYPE_CONSTANTS, PUBLISH_USERNAME_KEY_CONSTANTS
} from "@/lib/publish/publishUtil";

export default {
  name: "VuepressSetting",
  async created() {
    await this.initConf();
  },
  methods: {
    async initConf() {
      const conf = getConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_VUEPRESS)
      if (conf) {
        console.log("vuepress conf=>", conf)
      } else {
        await this.saveConf()
        console.log("vuepress自动配置完成")
      }
    },
    async saveConf() {
      await setConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_VUEPRESS,
          {
            [PUBLISH_HOME_KEY_CONSTANTS.VUEPRESS_HOME_KEY]: "",
            [PUBLISH_API_URL_KEY_CONSTANTS.VUEPRESS_API_URL_KEY]: "",
            [PUBLISH_USERNAME_KEY_CONSTANTS.VUEPRESS_USERNAME_KEY]: "terwer",
            [PUBLISH_PASSWORD_KEY_CONSTANTS.VUEPRESS_PASSWORD_KEY]: "123456"
          }
      )
    }
  }
}
</script>

<style scoped>

</style>