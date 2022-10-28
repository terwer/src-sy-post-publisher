<template>
  <el-form label-width="120px">
    <el-form-item :label="$t('service.switch.vuepress')">
      <el-switch v-model="vuepressEnabled" :before-change="beforeChange" @change="onChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.jvue')">
      <el-switch v-model="jvueEnabled" @change="onChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.conf')">
      <el-switch v-model="confEnabled" @change="onChange"/>
    </el-form-item>

    <el-form-item :label="$t('service.switch.cnblogs')">
      <el-switch v-model="cnblogsEnabled" @change="onChange"/>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  name: "ServiceSwitch",
  data() {
    return {
      selectCount: 1,
      vuepressEnabled: true,
      jvueEnabled: false,
      confEnabled: false,
      cnblogsEnabled: false
    }
  },
  methods: {
    onChange(val) {
      if (val) {
        ++this.selectCount;
      } else {
        --this.selectCount
      }
      this.$message.success('this is a message.')
      console.log("当前选中数目=>", this.selectCount)
    },
    beforeChange() {
      return new Promise((resolve, reject) => {
        if (this.selectCount === 1) {
          alert("you must select at least one")
          return reject(new Error("you must select at least one"))
        }

        return resolve(true)
      })
    }
  }
}
</script>

<style scoped>

</style>