<template>
  <NuxtLayout>
    <div :key="$route.fullPath">
      <NuxtPage/>
    </div>
  </NuxtLayout>
</template>