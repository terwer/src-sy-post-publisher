<template>
  <div>
    <client-only>
      <a @click="toggleDark()" class="footer-mode">
        {{ isDark ? $t('theme.mode.light') : $t('theme.mode.dark') }}
      </a>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import {useDark, useToggle} from "@vueuse/core";

// 模式
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped>
</style>