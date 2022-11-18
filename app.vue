<template>
  <NuxtLayout>
    <div :key="$route.fullPath">
      <NuxtPage/>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
  link: [
    {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
  ]
})
</script>