<template>
  <div class="demo-collapse">
    <el-collapse model-value="1" accordion>
      <el-collapse-item :title="$t('main.publish.to.vuepress')" name="1">
        <vuepress-main/>
      </el-collapse-item>
      <el-collapse-item :title="$t('main.publish.to.jvue')" name="2">
        <j-vue-main/>
      </el-collapse-item>
      <el-collapse-item :title="$t('main.publish.to.conf')" name="3">
        Confluence
      </el-collapse-item>
      <el-collapse-item :title="$t('main.publish.to.cnblogs')" name="4">
        <cnblogs-main/>
      </el-collapse-item>
      <el-collapse-item :title="$t('main.publish.to.wordpress')" name="5">
        <wordpress-main/>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

import VuepressMain from "@/components/main/VuepressMain";
import JVueMain from "@/components/main/JVueMain";
import CnblogsMain from "@/components/main/CnblogsMain";
import WordpressMain from "@/components/main/WordpressMain";

export default {
  name: "PlantformMain",
  components: {WordpressMain, CnblogsMain, JVueMain, VuepressMain},
  data(){
    return {

    }
  }
}
</script>

<style scoped>

</style>