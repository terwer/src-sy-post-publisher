<template>
  <div class="footer">
    <div>
      <span class="text"> &copy;2011-2022 </span>
      <span class="s-dark" @click="goGithub()"> sy-post-publisher </span>
      <span class="text"> v0.0.3. </span>
      <span class="text s-dark" @click="toggleDark()">{{
          isDark ? $t('theme.mode.light') : $t('theme.mode.dark')
        }}</span>
      <span class="text">.</span> <span class="text s-dark" @click="newWin()"> 新窗口打开 </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useDark, useToggle} from "@vueuse/core";
import {goToPage} from "~/utils/browser/ChromeUtil";

const isDark = useDark()
const toggleDark = useToggle(isDark)

const goGithub = () => {
  window.open("https://github.com/terwer/src-sy-post-publisher")
}
const newWin = () => {
  goToPage("/blog/index.html")
}
</script>

<style scoped>
.footer {
  font-size: 12px;
  color: #bbb;
  text-align: center;
}

.footer .text {
  vertical-align: middle;
}

.s-dark {
  color: var(--el-color-primary);
  cursor: pointer;
}
</style>