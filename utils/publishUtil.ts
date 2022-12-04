/*
 * Copyright (c) 2022, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import {
  getDynamicJsonCfg,
  getDynSwitchKey,
} from "~/utils/platform/dynamicConfig"
import { getBooleanConf, getJSONConf } from "~/utils/configUtil"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { IMetaweblogCfg } from "~/utils/platform/metaweblog/IMetaweblogCfg"
import { ICommonblogCfg } from "~/utils/platform/commonblog/commonblogCfg"
import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger("utils/publishUtil.ts")

/**
 * 新版获取apiParams参数的方法，使用ts泛型
 * @param apiType 参数类型
 */
export function getApiParams<T>(apiType: string): T {
  return getJSONConf<T>(apiType)
}

/**
 * 根据平台类型获取发布状态
 * @param apiType 平台类型
 * @param meta 元数据
 */
export const getPublishStatus = (apiType: string, meta: any): boolean => {
  const githubTypeArray = [
    API_TYPE_CONSTANTS.API_TYPE_VUEPRESS,
    API_TYPE_CONSTANTS.API_TYPE_HUGO,
    API_TYPE_CONSTANTS.API_TYPE_HEXO,
    API_TYPE_CONSTANTS.API_TYPE_JEKYLL,
  ]

  // 固定的平台
  const metaweblogTypeArray = [
    API_TYPE_CONSTANTS.API_TYPE_JVUE,
    API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE,
    API_TYPE_CONSTANTS.API_TYPE_CNBLOGS,
    API_TYPE_CONSTANTS.API_TYPE_WORDPRESS,
  ]

  // 通用自定义平台
  const commonblogTypeArray = [
    API_TYPE_CONSTANTS.API_TYPE_LIANDI,
    API_TYPE_CONSTANTS.API_TYPE_YUQUE,
    API_TYPE_CONSTANTS.API_TYPE_KMS,
  ]

  // 读取动态类型
  const dynamicJsonCfg = getDynamicJsonCfg()
  // const dynamicConfigArray = dynamicJsonCfg.totalCfg || []
  const githubArray = dynamicJsonCfg.githubCfg || []
  const metaweblogArray = dynamicJsonCfg.metaweblogCfg || []
  const wordpressArray = dynamicJsonCfg.wordpressCfg || []
  // github
  githubArray.forEach((item) => {
    const apiType = item.platformKey
    const switchKey = getDynSwitchKey(item.platformKey)
    const switchValue = getBooleanConf(switchKey)
    if (switchValue) {
      githubTypeArray.push(apiType)
    }
  })
  // metaweblog
  metaweblogArray.forEach((item) => {
    const apiType = item.platformKey
    const switchKey = getDynSwitchKey(item.platformKey)
    const switchValue = getBooleanConf(switchKey)
    if (switchValue) {
      metaweblogTypeArray.push(apiType)
    }
  })
  // WordPress
  wordpressArray.forEach((item) => {
    const apiType = item.platformKey
    const switchKey = getDynSwitchKey(item.platformKey)
    const switchValue = getBooleanConf(switchKey)
    if (switchValue) {
      metaweblogTypeArray.push(apiType)
    }
  })

  if (githubTypeArray.includes(apiType)) {
    const postidKey = getApiParams<IGithubCfg>(apiType).posidKey
    const postId = meta[postidKey] || ""
    logger.debug("平台=>", apiType)
    logger.debug("meta=>", meta)
    logger.debug("postidKey=>", postidKey)
    logger.debug("postidKey的值=>", postId)
    return postId !== ""
  } else if (metaweblogTypeArray.includes(apiType)) {
    const postidKey = getApiParams<IMetaweblogCfg>(apiType).posidKey
    const postId = meta[postidKey] || ""
    logger.debug("平台=>", apiType)
    logger.debug("meta=>", meta)
    logger.debug("postidKey=>", postidKey)
    logger.debug("postidKey的值=>", postId)
    return postId !== ""
  } else if (commonblogTypeArray.includes(apiType)) {
    const postidKey = getApiParams<ICommonblogCfg>(apiType).posidKey
    const postId = meta[postidKey ?? ""] || ""
    logger.debug("平台=>", apiType)
    logger.debug("meta=>", meta)
    logger.debug("postidKey=>", postidKey)
    logger.debug("postidKey的值=>", postId)
    return postId !== ""
  }

  return false
}