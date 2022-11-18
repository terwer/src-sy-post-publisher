<template>
  <div>BlogIndex auto</div>
</template>

<script lang="ts" setup>
const env = useRuntimeConfig()
logUtil(env.logLevel).logInfo("测试日志写入")
</script>

<style scoped>

</style>