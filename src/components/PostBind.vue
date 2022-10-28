<template>
  <el-form label-width="120px">
    <el-form-item :label="$t('main.slug')">
      <el-input/>
    </el-form-item>

    <el-form-item>
      <el-checkbox :label="$t('main.use.google.translate')" size="large"/> &nbsp;&nbsp;
      <el-button type="primary">{{ $t('main.auto.fetch.slug') }}</el-button>
    </el-form-item>

    <el-form-item :label="$t('post.bind.vuepress.slug')">
      <el-input/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.cnblogs.postid')">
      <el-input/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.jvue.postid')">
      <el-input/>
    </el-form-item>

    <el-form-item :label="$t('post.bind.conf.postid')">
      <el-input/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">{{ $t('post.bind.conf.save') }}</el-button>
      <el-button>{{ $t('post.bind.conf.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "PostBind"
}
</script>

<style scoped>

</style>