<template>
  <Publish/>
</template>

<script>
import Publish from '@/components/PublishService'

export default {
  name: 'App',
  components: {
    Publish
  },
  async created() {
    this.devMock();
    // const pageId = await getSiyuanPageId(false);
    // if (!pageId || pageId === "") {
    //   alert("Server error")
    //   return
    // }
  },
  async mounted() {
  },
  methods: {
    devMock() {
      if (process.env.NODE_ENV === "development") {
        console.log("开发模式")
      }
    }
  }
}
</script>

<style>
#app {
  font-family: "-apple-system", "Wenquanyi Micro Hei", "Wenquanyi Micro Hei Mono", "Microsoft YaHei", "LXGW WenKai", "PT Sans", "Liberation Mono", monospace, dejavu sans mono, Fira Code, Microsoft Yahei, Consolas, Courier New, monospace, Menlo, Monaco !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
