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

import { CommonblogApiAdaptor } from "~/utils/platform/commonblog/commonblogApiAdaptor"
import { IApi } from "~/utils/api"
import { YuqueApi } from "~/utils/platform/commonblog/yuque/yuqueApi"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { UserBlog } from "~/utils/models/userBlog"
import { Logger } from "loglevel"
import { LogFactory } from "~/utils/logUtil"
import { Post } from "~/utils/models/post"
import { CategoryInfo } from "~/utils/models/categoryInfo"
import { pathJoin } from "~/utils/util"

/**
 * 语雀的API适配器
 */
export class YuqueApiAdaptor extends CommonblogApiAdaptor implements IApi {
  private readonly logger: Logger
  private readonly yuqueApi: YuqueApi

  constructor() {
    super(API_TYPE_CONSTANTS.API_TYPE_YUQUE)
    this.logger = LogFactory.getLogger(
      "utils/platform/commonblog/yuque/yuqueApiAdaptor.ts"
    )
    this.yuqueApi = new YuqueApi(
      this.cfg.apiUrl,
      this.cfg.blogid ?? "",
      this.cfg.username ?? "",
      this.cfg.token ?? ""
    )
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    const result: UserBlog[] = []

    const repos = await this.yuqueApi.repos()
    this.logger.debug("repos=>", repos)

    // 数据适配
    repos.forEach((item: any) => {
      const userblog: UserBlog = new UserBlog()
      userblog.blogid = item.namespace
      userblog.blogName = item.name
      userblog.url = item.namespace
      result.push(userblog)
    })

    return result
  }

  async deletePost(postid: string): Promise<boolean> {
    const yuquePostidKey = this.getYuquePostKey(postid)
    return await this.yuqueApi.delDoc(
      yuquePostidKey.docId,
      yuquePostidKey.docRepo
    )
  }

  async editPost(
    postid: string,
    post: Post,
    publish?: boolean
  ): Promise<boolean> {
    const yuquePostidKey = this.getYuquePostKey(postid)
    return await this.yuqueApi.updateDoc(
      yuquePostidKey.docId,
      post.title,
      post.wp_slug,
      post.description,
      yuquePostidKey.docRepo
    )
  }

  async newPost(post: Post, publish?: boolean): Promise<string> {
    if (post.cate_slugs != null && post.cate_slugs.length > 0) {
      const repo = post.cate_slugs[0]
      return await this.yuqueApi.addDoc(
        post.title,
        post.wp_slug,
        post.description,
        repo
      )
    } else {
      return await this.yuqueApi.addDoc(
        post.title,
        post.wp_slug,
        post.description
      )
    }
  }

  async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    const yuquePostidKey = this.getYuquePostKey(postid)

    const yuqueDoc = await this.yuqueApi.getDoc(
      yuquePostidKey.docId,
      yuquePostidKey.docRepo
    )
    this.logger.debug("yuqueDoc=>", yuqueDoc)

    const commonPost = new Post()
    commonPost.title = yuqueDoc.title
    commonPost.description = yuqueDoc.body

    const book = yuqueDoc.book
    const cats = []
    const catSlugs = []

    cats.push(book.name)
    commonPost.categories = cats

    catSlugs.push(book.namespace)
    commonPost.cate_slugs = catSlugs

    return commonPost
  }

  async getCategories(): Promise<CategoryInfo[]> {
    const cats = [] as CategoryInfo[]

    const repos: any[] = await this.yuqueApi.repos()
    this.logger.debug("yuque repos=>", repos)
    if (repos && repos.length > 0) {
      repos.forEach((repo) => {
        // 只获取文档库
        if (repo.type === "Book") {
          const cat = new CategoryInfo()
          cat.categoryId = repo.slug
          cat.categoryName = repo.name
          cat.description = repo.name
          cat.categoryDescription = repo.name
          cats.push(cat)
        }
      })
    }

    return cats
  }

  async getPreviewUrl(postid: string): Promise<string> {
    // 替换文章链接
    const purl = this.cfg.previewUrl ?? ""
    const yuquePostidKey = this.getYuquePostKey(postid)
    const docId = yuquePostidKey.docId
    const repo = yuquePostidKey.docRepo ?? this.cfg.blogid ?? ""
    const postUrl = purl.replace("[postid]", docId).replace("[notebook]", repo)
    // 路径组合
    return pathJoin(this.cfg.home ?? "", postUrl)
  }

  /**
   * 获取封装的postid
   * @param postid
   * @private postid
   */
  private getYuquePostKey(postid: string): any {
    let docId
    let docRepo
    if (postid.indexOf("_") > 0) {
      const idArr = postid.split("_")
      docId = idArr[0]
      docRepo = idArr[1]
      // docRepo就是book.namespace
    } else {
      docId = postid
    }

    return {
      docId,
      docRepo,
    }
  }
}
