<template>
  <div id="#app">
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main>
        <slot/>
      </el-main>
      <el-footer>
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {ElContainer, ElHeader, ElMain, ElFooter} from "element-plus";
import Header from "~/components/common/Header.vue";
import Footer from "~/components/common/Footer.vue";
</script>