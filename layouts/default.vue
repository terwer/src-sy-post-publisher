<template>
  <div>
    <Header/>
    <slot />
    <Footer/>
  </div>
</template>

<script lang="ts">
import Header from "~/components/default/Header.vue";
import Footer from "~/components/default/Footer.vue";

export default {
  components: {Footer, Header}
}
</script>