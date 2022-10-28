<template>
  <div class="locale-changer">
    <el-form label-width="120px">
      <el-form-item :label="$t('lang.choose')">
        <el-select :placeholder="$t('lang.choose.placeholder')" v-model="$i18n.locale" @change="langChanged">
          <el-option :key="i" v-for="(lang, i) in langs" :label="lang.label" :value="lang.value"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'locale-changer',
  data() {
    return {
      langs: [
        {
          value: 'zh_CN',
          label: "简体中文"
        },
        {
          value: 'en_US',
          label: "English"
        }
      ]
    }
  },
  methods: {
    langChanged(lang) {
      console.log("langChanged=>", lang);
      localStorage.Lang = lang;
    }
  },
  mounted() {
    if (localStorage.Lang != null) this.$i18n.locale = localStorage.Lang;
  }
}
</script>