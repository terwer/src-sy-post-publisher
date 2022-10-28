<template>
  <el-form label-width="120px">
    <el-form-item :label="$t('setting.blog.url')">
      <el-input v-model="home"/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.username')">
      <el-input v-model="username"/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.password')">
      <el-input type="password" v-model="password" show-password/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.apiurl')">
      <el-input v-model="apiUrl"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">{{ $t('setting.blog.validate') }}</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveConf">{{ $t('setting.blog.save') }}</el-button>
      <el-button>{{ $t('setting.blog.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getConf, setConf} from "@/lib/config";
import {
  PUBLISH_API_URL_KEY_CONSTANTS,
  PUBLISH_HOME_KEY_CONSTANTS, PUBLISH_PASSWORD_KEY_CONSTANTS,
  PUBLISH_TYPE_CONSTANTS, PUBLISH_USERNAME_KEY_CONSTANTS
} from "@/lib/publish/publishUtil";

export default {
  name: "WordpressSetting",
  data() {
    return {
      home: "",
      apiUrl: "",
      username: "",
      password: ""
    }
  },
  async created() {
    await this.initConf()
  },
  methods: {
    initConf() {
      const conf = getConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS)
      if (conf) {
        console.log("wordpress conf=>", conf)

        this.home = conf[PUBLISH_HOME_KEY_CONSTANTS.WORDPRESS_HOME_KEY]
        this.apiUrl = conf[PUBLISH_API_URL_KEY_CONSTANTS.WORDPRESS_API_URL_KEY]
        this.username = conf[PUBLISH_USERNAME_KEY_CONSTANTS.WORDPRESS_USERNAME_KEY]
        this.password = conf[PUBLISH_PASSWORD_KEY_CONSTANTS.WORDPRESS_PASSWORD_KEY]
      }
    },
    async saveConf() {
      await setConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS,
          {
            [PUBLISH_HOME_KEY_CONSTANTS.WORDPRESS_HOME_KEY]: this.home,
            [PUBLISH_API_URL_KEY_CONSTANTS.WORDPRESS_API_URL_KEY]: this.apiUrl,
            [PUBLISH_USERNAME_KEY_CONSTANTS.WORDPRESS_USERNAME_KEY]: this.username,
            [PUBLISH_PASSWORD_KEY_CONSTANTS.WORDPRESS_PASSWORD_KEY]: this.password
          }
      )
    }
  }
}
</script>

<style scoped>

</style>