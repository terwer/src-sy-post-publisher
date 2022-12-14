<!--
  - Copyright (c) 2022, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<template>
  <el-tabs type="border-card" v-if="tabCountStore.tabCount > 0">
    <!-- Github -->
    <el-tab-pane
      :label="$t('setting.vuepress') + $t('setting.blog.setting')"
      v-if="vuepressEnabled"
    >
      <vuepress-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.hugo') + $t('setting.blog.setting')"
      v-if="hugoEnabled"
    >
      <hugo-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.hexo') + $t('setting.blog.setting')"
      v-if="hexoEnabled"
    >
      <hexo-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.jekyll') + $t('setting.blog.setting')"
      v-if="jekyllEnabled"
    >
      <jekyll-setting />
    </el-tab-pane>

    <!-- Metaweblog API -->
    <el-tab-pane
      :label="$t('setting.jvue') + $t('setting.blog.setting')"
      v-if="jvueEnabled"
    >
      <j-vue-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.conf') + $t('setting.blog.setting')"
      v-if="confEnabled"
    >
      <confluence-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.cnblogs') + $t('setting.blog.setting')"
      v-if="cnblogsEnabled"
    >
      <cnblogs-setting />
    </el-tab-pane>

    <!-- WordPress -->
    <el-tab-pane
      :label="$t('setting.wordpress') + $t('setting.blog.setting')"
      v-if="wordpressEnabled"
    >
      <wordpress-setting />
    </el-tab-pane>

    <!-- Common API -->
    <el-tab-pane
      :label="$t('setting.liandi') + $t('setting.blog.setting')"
      v-if="liandiEnabled"
    >
      <liandi-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.yuque') + $t('setting.blog.setting')"
      v-if="yuqueEnabled"
    >
      <yuque-setting />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('setting.kms') + $t('setting.blog.setting')"
      v-if="kmsEnabled"
    >
      <kms-setting />
    </el-tab-pane>

    <!-- ???????????????????????? -->
    <el-tab-pane
      v-for="gcfg in formData.githubArray"
      :key="gcfg.platformKey"
      :label="gcfg.platformName + $t('setting.blog.setting')"
    >
      <github-setting :api-type="gcfg.platformKey" :cfg="createGCfg(gcfg)" />
    </el-tab-pane>
    <el-tab-pane
      v-for="mcfg in formData.metaweblogArray"
      :key="mcfg.platformKey"
      :label="mcfg.platformName + $t('setting.blog.setting')"
    >
      <metaweblog-setting
        :api-type="mcfg.platformKey"
        :cfg="createMCfg(mcfg)"
      />
    </el-tab-pane>
    <el-tab-pane
      v-for="wcfg in formData.wordpressArray"
      :key="wcfg.platformKey"
      :label="wcfg.platformName + $t('setting.blog.setting')"
    >
      <wordpress-setting :api-type="wcfg.platformKey" :cfg="createWCfg(wcfg)" />
    </el-tab-pane>
  </el-tabs>
  <div v-else>
    <el-alert
      class="top-version-tip"
      :title="$t('config.platform.none')"
      type="error"
      :closable="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { useTabCount } from "~/composables/publish/tabCountCom"
import { DynamicGCfg } from "~/utils/platform/github/DynamicGCfg"
import { DynamicMCfg } from "~/utils/platform/metaweblog/dynamicMCfg"
import {
  DynamicConfig,
  getDynamicJsonCfg,
  getDynPostidKey,
  getDynSwitchKey,
} from "~/utils/platform/dynamicConfig"
import { DynamicWCfg } from "~/utils/platform/wordpress/dynamicWCfg"
import { getBooleanConf } from "~/utils/configUtil"
import { LogFactory } from "~/utils/logUtil"
import VuepressSetting from "~/components/publish/tab/setting/github/VuepressSetting.vue"
import HugoSetting from "~/components/publish/tab/setting/github/HugoSetting.vue"
import HexoSetting from "~/components/publish/tab/setting/github/HexoSetting.vue"
import JekyllSetting from "~/components/publish/tab/setting/github/JekyllSetting.vue"
import JVueSetting from "~/components/publish/tab/setting/metaweblog/JVueSetting.vue"
import ConfluenceSetting from "~/components/publish/tab/setting/metaweblog/ConfluenceSetting.vue"
import CnblogsSetting from "~/components/publish/tab/setting/metaweblog/CnblogsSetting.vue"
import WordpressSetting from "~/components/publish/tab/setting/metaweblog/WordpressSetting.vue"
import LiandiSetting from "~/components/publish/tab/setting/common/LiandiSetting.vue"
import YuqueSetting from "~/components/publish/tab/setting/common/YuqueSetting.vue"
import KmsSetting from "~/components/publish/tab/setting/common/KmsSetting.vue"
import GithubSetting from "~/components/publish/tab/setting/GithubSetting.vue"
import MetaweblogSetting from "~/components/publish/tab/setting/MetaweblogSetting.vue"

const logger = LogFactory.getLogger(
  "components/publish/tab/PlatformSetting.vue"
)

// use
const {
  tabCountStore,
  vuepressEnabled,
  hugoEnabled,
  hexoEnabled,
  jekyllEnabled,
  jvueEnabled,
  confEnabled,
  cnblogsEnabled,
  wordpressEnabled,
  liandiEnabled,
  yuqueEnabled,
  kmsEnabled,
  doCount,
} = useTabCount()

const formData = reactive({
  dynamicConfigArray: [],
  githubArray: [],
  metaweblogArray: [],
  wordpressArray: [],
})

const createGCfg = ref((gcfg) => {
  return new DynamicGCfg(gcfg)
})
const createMCfg = ref((mcfg) => {
  return new DynamicMCfg(getDynPostidKey(mcfg.platformKey))
})
const createWCfg = ref((wcfg) => {
  return new DynamicWCfg(getDynPostidKey(wcfg.platformKey))
})
const initDynCfg = (dynCfg: any[]) => {
  const newCfg = []

  dynCfg.forEach((item) => {
    const newItem = new DynamicConfig(
      item.platformType,
      item.platformKey,
      item.platformName
    )
    newItem.subPlatformType = item.subPlatformType

    const switchKey = getDynSwitchKey(item.platformKey)
    const switchValue = getBooleanConf(switchKey)
    newItem.modelValue = switchValue
    if (switchValue) {
      newCfg.push(newItem)
    }
  })

  return newCfg
}

const initConf = () => {
  doCount()

  const dynamicJsonCfg = getDynamicJsonCfg()
  formData.dynamicConfigArray = initDynCfg(dynamicJsonCfg.totalCfg || [])
  formData.githubArray = initDynCfg(dynamicJsonCfg.githubCfg || [])
  formData.metaweblogArray = initDynCfg(dynamicJsonCfg.metaweblogCfg || [])
  formData.wordpressArray = initDynCfg(dynamicJsonCfg.wordpressCfg || [])

  logger.debug("dynamicJsonCfg=>", JSON.stringify(dynamicJsonCfg))
}

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false,
  },
})

/* ??????props */
watch(
  () => props.isReload,
  (oldValue, newValue) => {
    // Here you can add your functionality
    // as described in the name you will get old and new value of watched property
    initConf()
    logger.debug("platform-setting?????????")
  }
)

onMounted(() => {
  initConf()
})
</script>
