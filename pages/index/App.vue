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
  <AppLayout>
    <div>
      <div v-if="isPublish">
        <PublishIndex />
      </div>
      <div v-else>
        <BlogIndex />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppLayout from "~/layouts/AppLayout.vue"
import BlogIndex from "~/components/blog/BlogIndex.vue"
import PublishIndex from "~/components/publish/PublishIndex.vue"
import { onMounted, ref } from "vue"
import { LogFactory } from "~/utils/logUtil"
import { getPageId, getWidgetId } from "~/utils/platform/siyuan/siyuanUtil"
import { SiYuanApiAdaptor } from "~/utils/platform/siyuan/siYuanApiAdaptor"
import { isInChromeExtension } from "~/utils/otherlib/ChromeUtil"
import {
  getSiyuanNewWinPageId,
  isInSiyuanNewWinBrowser,
} from "~/utils/otherlib/siyuanBrowserUtil"

const logger = LogFactory.getLogger("pages/index/App.vue")

const isPublish = ref(false)

const init = async () => {
  logger.warn("MODE=>", import.meta.env.MODE)

  const widgetResult = getWidgetId()
  if (widgetResult.isInSiyuan || isInSiyuanNewWinBrowser()) {
    let postid
    if (isInSiyuanNewWinBrowser()) {
      const newWinPageId = getSiyuanNewWinPageId()
      if (newWinPageId) {
        postid = newWinPageId
      }
      logger.warn("????????????????????????postid???=>", postid)
    } else {
      postid = await getPageId()
    }
    logger.warn("????????????ID???=>", postid)

    const api = new SiYuanApiAdaptor()
    const result = await api.getSubPostCount(postid)
    logger.debug("???????????????", result)

    if (result > 1) {
      isPublish.value = false
      logger.warn("????????????????????????????????????????????????")
    } else {
      isPublish.value = true
      logger.warn("?????????????????????????????????")
    }
  } else if (isInChromeExtension()) {
    logger.warn("????????????Chrome????????????????????????fetch??????CORS????????????")
  } else {
    logger.warn("?????????????????????????????????????????????????????????CORS????????????")
  }
}

// =====================
// life cycle
// =====================
onMounted(async () => {
  await init()
})
</script>
