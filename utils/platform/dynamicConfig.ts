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

import { CONSTANTS } from "~/utils/constants/constants"
import { getJSONConf, setJSONConf } from "~/utils/configUtil"
import { isEmptyString } from "~/utils/util"
import { newID } from "~/utils/idUtil"
import { appendStr, upperFirst } from "~/utils/strUtil"
import { YamlConvertAdaptor } from "~/utils/platform/yamlConvertAdaptor"
import { LogFactory } from "~/utils/logUtil"
import { VuepressYamlConvertAdaptor } from "~/utils/platform/github/vuepress/VuepressYamlConvertAdaptor"
import { JekyllYamlConverterAdaptor } from "~/utils/platform/github/jekyll/JekyllYamlConverterAdaptor"
import { HugoYamlConverterAdaptor } from "~/utils/platform/github/hugo/HugoYamlConverterAdaptor"
import { HexoYamlConverterAdaptor } from "~/utils/platform/github/hexo/hexoYamlConverterAdaptor"
import { VitepressYamlConverterAdaptor } from "~/utils/platform/github/other/VitepressYamlConverterAdaptor"
import { NuxtYamlConverterAdaptor } from "~/utils/platform/github/other/NuxtYamlConverterAdaptor"
import { NextYamlConvertAdaptor } from "~/utils/platform/github/other/NextYamlConvertAdaptor"

const logger = LogFactory.getLogger("utils/platform/dynamicConfig.ts")

export class DynamicConfig {
  /**
   * ?????????????????????????????????
   */
  posid?: any
  /**
   * ?????????????????????????????????
   */
  modelValue?: any
  /**
   * ??????????????????(????????????)
   */
  platformType: PlatformType
  /**
   * ???????????????(???????????????)
   * @since 0.1.0+
   */
  subPlatformType?: SubPlatformType
  /**
   * ??????Key
   */
  platformKey: string
  /**
   * ????????????
   */
  platformName: string
  /**
   * YAML?????????
   */
  yamlConverter?: YamlConvertAdaptor

  constructor(
    platformType: PlatformType,
    platformKey: string,
    platformName: string
  ) {
    this.platformType = platformType
    this.platformKey = platformKey
    this.platformName = platformName
  }
}

/**
 * ????????????????????????
 */
export enum PlatformType {
  /**
   * Metaweblog
   */
  Metaweblog = "Metaweblog",
  /**
   * WordPress
   */
  Wordpress = "Wordpress",
  /**
   * GitHub(Hugo???Hexo???Jekyll???Vuepress???Vitepress???Nuxt content???Next.js)
   */
  Github = "Github",
  /**
   * ?????????
   */
  Custom = "Custom",
}

/**
 * ???????????????
 * @since 0.1.0+
 * @author terwer
 */
export enum SubPlatformType {
  Github_Hugo = "Hugo",
  Github_Hexo = "Hexo",
  Github_Jekyll = "Jekyll",
  // Github_giteePages = "giteePages",
  // Github_codingPages = "codingPages",
  Github_Vuepress = "Vuepress",
  Github_Vitepress = "Vitepress",
  Github_Nuxt = "Nuxt",
  Github_Next = "Next",
  NONE = "none",
}

/**
 * ????????????????????????
 */
export interface DynamicJsonCfg {
  totalCfg: DynamicConfig[]
  githubCfg: DynamicConfig[]
  metaweblogCfg: DynamicConfig[]
  wordpressCfg: DynamicConfig[]
}

/**
 * ?????????????????????
 */
export function getSubtypeList(ptype: PlatformType): SubPlatformType[] {
  const subtypeList: SubPlatformType[] = []

  switch (ptype) {
    case PlatformType.Github:
      subtypeList.push(SubPlatformType.Github_Hugo)
      subtypeList.push(SubPlatformType.Github_Hexo)
      subtypeList.push(SubPlatformType.Github_Jekyll)
      // subtypeList.push(SubPlatformType.Github_giteePages)
      // subtypeList.push(SubPlatformType.Github_codingPages)
      subtypeList.push(SubPlatformType.Github_Vuepress)
      subtypeList.push(SubPlatformType.Github_Vitepress)
      subtypeList.push(SubPlatformType.Github_Nuxt)
      subtypeList.push(SubPlatformType.Github_Next)
      break
    default:
      break
  }

  return subtypeList
}

/**
 * ??????????????????JSON??????
 */
export function getDynamicJsonCfg(): DynamicJsonCfg {
  return getJSONConf<DynamicJsonCfg>(CONSTANTS.DYNAMIC_CONFIG_KEY)
}

/**
 * ??????????????????JSON??????
 * @param dynamicConfigArray
 */
export function setDynamicJsonCfg(dynamicConfigArray: DynamicConfig[]): void {
  const totalCfg: DynamicConfig[] = dynamicConfigArray
  const githubCfg: DynamicConfig[] = []
  const metaweblogCfg: DynamicConfig[] = []
  const wordpressCfg: DynamicConfig[] = []

  // ??????????????????????????????????????????
  totalCfg.forEach((item) => {
    switch (item.platformType) {
      case PlatformType.Github:
        githubCfg.push(item)
        break
      case PlatformType.Metaweblog:
        metaweblogCfg.push(item)
        break
      case PlatformType.Wordpress:
        wordpressCfg.push(item)
        break
      default:
        break
    }
  })

  const dynamicJsonCfg: DynamicJsonCfg = {
    totalCfg,
    githubCfg,
    metaweblogCfg,
    wordpressCfg,
  }

  setJSONConf<DynamicJsonCfg>(CONSTANTS.DYNAMIC_CONFIG_KEY, dynamicJsonCfg)
}

// =====================
// ????????????key??????
// =====================
/**
 * ??????????????????key
 * ?????????ID?????????-??????
 * ???????????????????????????_??????
 * @param ptype ????????????
 * @param subtype ???????????????
 */
export function getNewPlatformKey(
  ptype: PlatformType,
  subtype: SubPlatformType
): string {
  let ret
  const newId = newID()
  ret = ptype.toLowerCase()

  if (!isEmptyString(subtype) && SubPlatformType.NONE !== subtype) {
    ret = appendStr(ret, upperFirst(subtype))
  }
  return appendStr(ret, "-", newId)
}

/**
 * ??????????????????key????????????
 */
export function isDynamicKeyExists(
  dynamicConfigArray: DynamicConfig[],
  key: string
): boolean {
  let flag = false
  // logUtil.logInfo("isDynamicKeyExists,dynamicConfigArray=>")
  // logUtil.logInfo(dynamicConfigArray)
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    if (dynamicConfigArray[i].platformKey === key) {
      flag = true
      break
    }
  }
  return flag
}

/**
 * ????????????????????????
 * @param ptype ??????
 * @param subtype ?????????
 * @param isShowSubtype ?????????????????????
 */
export function getDefaultPlatformName(
  ptype: PlatformType,
  subtype: SubPlatformType,
  isShowSubtype: boolean
): string {
  if (PlatformType.Github === ptype && SubPlatformType.NONE === subtype) {
    return ""
  }

  let pname: string = ptype
  if (isShowSubtype) {
    pname = subtype
  }
  pname = pname + "-1"
  return pname
}

// =====================
// ??????????????????key??????
// =====================
interface SwitchItem {
  switchKey: string
  switchValue: boolean
}

export function getDynSwitchKey(platformKey: string): string {
  return "switch-" + platformKey
}

/**
 * ???????????????????????????
 * @param platformKey
 */
export function getDynSwitchActive(platformKey: string): string {
  return platformKey + "_true"
}

/**
 * ???????????????????????????
 * @param platformKey
 */
export function getDynSwitchInactive(platformKey: string): string {
  return platformKey + "_false"
}

/**
 * ??????Switch?????????
 * @param switchItem ??????
 */
export function getDynSwitchModelValue(switchItem: SwitchItem): string {
  return switchItem.switchKey + "_" + switchItem.switchValue.toString()
}

/**
 * ???????????????
 * @param selectedText ????????????
 */
export function getSwitchItem(selectedText: string): SwitchItem {
  const valArr = selectedText.split("_")
  const switchKey = getDynSwitchKey(valArr[0])
  const switchStatus = valArr[1] === "true"

  return {
    switchKey,
    switchValue: switchStatus,
  }
}

// =====================
// ??????????????????ID??????
// =====================
/**
 * ??????????????????ID???key
 * @param platformKey
 */
export function getDynPostidKey(platformKey: string): string {
  return "custom-" + platformKey + "-post-id"
}

// ======================
// ????????????Object???????????????
// ======================
/**
 * ????????????key??????YAML?????????
 * @param platformKey
 */
export const getDynYamlConverterAdaptor = (
  platformKey: string
): YamlConvertAdaptor => {
  let yamlConverter = new YamlConvertAdaptor()
  if (platformKey.includes("-")) {
    const typeArr = platformKey.split("-")
    if (typeArr.length > 0) {
      const ptype = typeArr[0].toLowerCase()

      if (ptype.includes(SubPlatformType.Github_Vuepress.toLowerCase())) {
        yamlConverter = new VuepressYamlConvertAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Hugo.toLowerCase())) {
        yamlConverter = new HugoYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Hexo.toLowerCase())) {
        yamlConverter = new HexoYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Jekyll.toLowerCase())) {
        yamlConverter = new JekyllYamlConverterAdaptor()
      } else if (
        ptype.includes(SubPlatformType.Github_Vitepress.toLowerCase())
      ) {
        yamlConverter = new VitepressYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Nuxt.toLowerCase())) {
        yamlConverter = new NuxtYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Next.toLowerCase())) {
        yamlConverter = new NextYamlConvertAdaptor()
      }
    }
  }

  return yamlConverter
}
