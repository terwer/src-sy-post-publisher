<template>
  <el-tabs type="border-card">
    <el-tab-pane :label="$t('setting.vuepress')">
      <vuepress-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.jvue')">
      <j-vue-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.conf')">Confluence</el-tab-pane>
    <el-tab-pane :label="$t('setting.cnblogs')">
      <cnblogs-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.wordpress')">
      <wordpress-setting/>
    </el-tab-pane>
    <el-tab-pane :label="$t('setting.other1')">
      <other-setting1/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import JVueSetting from "@/components/setting/JVueSetting";
import VuepressSetting from "@/components/setting/VuepressSetting";
import OtherSetting1 from "@/components/setting/OtherSetting1";
import CnblogsSetting from "@/components/setting/CnblogsSetting";
import WordpressSetting from "@/components/setting/WordpressSetting";

export default {
  name: "PlantformSetting",
  components: {WordpressSetting, CnblogsSetting, OtherSetting1, VuepressSetting, JVueSetting}
}
</script>

<style scoped>

</style>