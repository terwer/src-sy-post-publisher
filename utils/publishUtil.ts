/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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
import { PublishPreference } from "~/utils/models/publishPreference"
import { CONSTANTS } from "~/utils/constants/constants"
import { isEmptyObject, isEmptyString, parseBoolean } from "~/utils/util"
import { PageEditMode } from "~/utils/common/pageEditMode"
import { SourceContentShowType } from "~/utils/common/sourceContentShowType"

const logger = LogFactory.getLogger("utils/publishUtil.ts")

/**
 * ????????????apiParams????????????????????????ts??????
 * @param apiType ????????????
 */
export function getApiParams<T>(apiType: string): T {
  return getJSONConf<T>(apiType)
}

/**
 * ????????????????????????????????????
 * @param apiType ????????????
 * @param meta ?????????
 */
export const getPublishStatus = (apiType: string, meta: any): boolean => {
  logger.info("???????????????????????????????????????apiType=>", apiType)
  const githubTypeArray = [
    API_TYPE_CONSTANTS.API_TYPE_VUEPRESS,
    API_TYPE_CONSTANTS.API_TYPE_HUGO,
    API_TYPE_CONSTANTS.API_TYPE_HEXO,
    API_TYPE_CONSTANTS.API_TYPE_JEKYLL,
  ]

  // ???????????????
  const metaweblogTypeArray = [
    API_TYPE_CONSTANTS.API_TYPE_JVUE,
    API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE,
    API_TYPE_CONSTANTS.API_TYPE_CNBLOGS,
    API_TYPE_CONSTANTS.API_TYPE_WORDPRESS,
  ]

  // ?????????????????????
  const commonblogTypeArray = [
    API_TYPE_CONSTANTS.API_TYPE_LIANDI,
    API_TYPE_CONSTANTS.API_TYPE_YUQUE,
    API_TYPE_CONSTANTS.API_TYPE_KMS,
  ]

  // ??????????????????
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

  // ??????
  let postId
  if (githubTypeArray.includes(apiType)) {
    const postidKey = getApiParams<IGithubCfg>(apiType).posidKey
    postId = meta[postidKey] || ""
    logger.debug("??????=>", apiType)
    logger.debug("meta=>", meta)
    logger.debug("postidKey=>", postidKey)
    logger.debug("postidKey??????=>", postId)
  } else if (metaweblogTypeArray.includes(apiType)) {
    const postidKey = getApiParams<IMetaweblogCfg>(apiType).posidKey
    postId = meta[postidKey] || ""
    logger.debug("??????=>", apiType)
    logger.debug("meta=>", meta)
    logger.debug("postidKey=>", postidKey)
    logger.debug("postidKey??????=>", postId)
  } else if (commonblogTypeArray.includes(apiType)) {
    const postidKey = getApiParams<ICommonblogCfg>(apiType).posidKey
    postId = meta[postidKey ?? ""] || ""
    logger.debug("??????=>", apiType)
    logger.debug("meta=>", meta)
    logger.debug("postidKey=>", postidKey)
    logger.debug("postidKey??????=>", postId)
  }

  return !isEmptyString(postId)
}

/**
 * ????????????????????????
 */
export const getPublishCfg = (): PublishPreference => {
  let publishCfg = getJSONConf<PublishPreference>(
    CONSTANTS.PUBLISH_PREFERENCE_CONFIG_KEY
  )
  if (isEmptyObject(publishCfg)) {
    publishCfg = new PublishPreference()
    publishCfg.fixTitle = false
    // TODO ???Github???????????????
    publishCfg.useGoogleTranslate = true
    // TODO ???Github???????????????
    publishCfg.editMode = PageEditMode.EditMode_simple
    // TODO ???Github???????????????
    publishCfg.contentShowType = SourceContentShowType.YAML_CONTENT
    publishCfg.removeH1 = false
    // TODO ???Github???????????????
    publishCfg.autoTag = false
    // TODO ???Github???????????????
    publishCfg.renderSiyuanVirtualLink = true
    // TODO ???Github???????????????
    publishCfg.makeAttrOnFirstLoad = false
    publishCfg.newWin = false
    publishCfg.showCloseBtn = false
  } else {
    publishCfg.fixTitle = parseBoolean(publishCfg.fixTitle)
    publishCfg.removeH1 = parseBoolean(publishCfg.removeH1)
    publishCfg.newWin = parseBoolean(publishCfg.newWin)
    publishCfg.autoTag = parseBoolean(publishCfg.autoTag)
    publishCfg.showCloseBtn = parseBoolean(publishCfg.showCloseBtn)
  }

  // =====================================================
  // ???????????????????????????
  // =====================================================
  // if (!isProd) {
  //   publishCfg.fixTitle = true
  //   publishCfg.useGoogleTranslate = true
  //   publishCfg.editMode = PageEditMode.EditMode_simple
  //   publishCfg.contentShowType = SourceContentShowType.YAML
  //   publishCfg.removeH1 = true
  //   publishCfg.autoTag = true
  //   publishCfg.renderSiyuanVirtualLink = true
  //   publishCfg.makeAttrOnFirstLoad = true
  // }
  // =====================================================
  // ???????????????????????????
  // =====================================================

  return publishCfg
}
