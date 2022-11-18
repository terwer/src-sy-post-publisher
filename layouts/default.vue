<template>
  <div>
    <Header/>
    <slot/>
    <Footer/>
  </div>
</template>

<script lang="ts" setup>
import Header from "~/components/common/Header.vue";
import Footer from "~/components/common/Footer.vue";
</script>