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

import {
  IYamlConvertAdaptor,
  YamlConvertAdaptor,
} from "~/utils/platform/yamlConvertAdaptor"
import { PostForm } from "~/utils/models/postForm"
import { IGithubCfg } from "~/utils/platform/github/githubCfg"
import { YamlFormatObj } from "~/utils/models/yamlFormatObj"
import { LogFactory } from "~/utils/logUtil"
import { obj2Yaml } from "~/utils/yamlUtil"
import { formatIsoToZhDate } from "~/utils/dateUtil"
import { isEmptyString } from "~/utils/util"

/**
 * Hugo平台的YAMl解析器
 * @see https://gohugo.io/content-management/front-matter/
 */
export class HugoYamlConverterAdaptor
  extends YamlConvertAdaptor
  implements IYamlConvertAdaptor
{
  private readonly logger = LogFactory.getLogger(
    "utils/platform/github/hugo/HugoYamlConverterAdaptor.ts"
  )

  convertToYaml(postForm: PostForm, githubCfg?: IGithubCfg): YamlFormatObj {
    let yamlFormatObj: YamlFormatObj = new YamlFormatObj()
    this.logger.debug("您正在使用 Hugo Yaml Converter", postForm)

    // title
    yamlFormatObj.yamlObj.title = postForm.formData.title

    // slug
    yamlFormatObj.yamlObj.slug = postForm.formData.customSlug

    // 固定连接开关
    if (postForm.formData.usePermalink) {
      // url
      yamlFormatObj.yamlObj.url =
        "/post/" + postForm.formData.customSlug + ".html"
    }

    // 日期开关
    if (postForm.formData.useDate) {
      // date
      yamlFormatObj.yamlObj.date = postForm.formData.created
    }

    // tags
    yamlFormatObj.yamlObj.tags = postForm.formData.tag.dynamicTags

    // categories
    yamlFormatObj.yamlObj.categories = postForm.formData.categories

    // lastmod
    yamlFormatObj.yamlObj.lastmod = formatIsoToZhDate(
      new Date().toISOString(),
      true
    )

    // toc
    yamlFormatObj.yamlObj.toc = true

    // seo
    yamlFormatObj.yamlObj.keywords = postForm.formData.tag.dynamicTags.join(",")
    yamlFormatObj.yamlObj.description = postForm.formData.desc

    // isCJKLanguage
    yamlFormatObj.yamlObj.isCJKLanguage = true

    // linkTitle
    const linkTitle = postForm.formData.linkTitle
    // weight
    const weight = parseInt(postForm.formData.weight.toString())
    if (weight > 0) {
      yamlFormatObj.yamlObj.weight = weight
    }
    if (!isEmptyString(linkTitle)) {
      yamlFormatObj.yamlObj.linkTitle = linkTitle
      if (weight > 0) {
        yamlFormatObj.yamlObj.menu = {
          main: {
            weight: weight,
          },
        }
      }
    }

    // formatter
    let yaml = obj2Yaml(yamlFormatObj.yamlObj)
    // 修复yaml的ISO日期格式（js-yaml转换的才需要）
    yaml = formatIsoToZhDate(yaml, true)
    // this.logger.debug("yaml=>", yaml)

    yamlFormatObj.formatter = yaml
    yamlFormatObj.mdContent = postForm.formData.mdContent
    yamlFormatObj.mdFullContent =
      yamlFormatObj.formatter + "\n\n" + yamlFormatObj.mdContent
    yamlFormatObj.htmlContent = postForm.formData.htmlContent

    return yamlFormatObj
  }

  convertToAttr(
    yamlFormatObj: YamlFormatObj,
    githubCfg?: IGithubCfg
  ): PostForm {
    return super.convertToAttr(yamlFormatObj, githubCfg)
  }
}
