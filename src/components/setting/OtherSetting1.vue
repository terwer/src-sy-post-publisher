<template>
  <el-form label-width="120px">
    <el-form-item :label="$t('setting.blog.type')">
      <el-select :placeholder="$t('setting.blog.type.placeholder')">
        <el-option :label="$t('setting.blog.type.wordpress.label')" :value="$t('setting.blog.type.wordpress.value')"/>
        <el-option :label="$t('setting.blog.type.metaweblog.label')" :value="$t('setting.blog.type.metaweblog.value')"/>
        <el-option :label="$t('setting.blog.type.vuepress.value')" :value="$t('setting.blog.type.vuepress.value')"/>
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.url')">
      <el-input/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.username')">
      <el-input/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.password')">
      <el-input/>
    </el-form-item>

    <el-form-item :label="$t('setting.blog.apiurl')">
      <el-input/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">{{ $t('setting.blog.validate') }}</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">{{ $t('setting.blog.save') }}</el-button>
      <el-button>{{ $t('setting.blog.cancel') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "OtherSetting1"
}
</script>

<style scoped>

</style>