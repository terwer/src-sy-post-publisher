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

import { UserBlog } from "~/utils/models/userBlog"
import { Post } from "~/utils/models/post"
import { CategoryInfo } from "~/utils/models/categoryInfo"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { SiYuanApiAdaptor } from "~/utils/platform/siyuan/siYuanApiAdaptor"
import { PlatformType } from "~/utils/platform/dynamicConfig"
import { GithubApiAdaptor } from "~/utils/platform/github/githubApiAdaptor"
import { MetaWeblogApiAdaptor } from "~/utils/platform/metaweblog/metaWeblogApiAdaptor"
import { VuepressApiAdaptor } from "~/utils/platform/github/vuepress/vuepressApiAdaptor"
import { HugoApiAdaptor } from "~/utils/platform/github/hugo/hugoApiAdaptor"
import { HexoApiAdaptor } from "~/utils/platform/github/hexo/hexoApiAdaptor"
import { JekyllApiAdaptor } from "~/utils/platform/github/jekyll/jekyllApiAdaptor"
import { JVueApiAdaptor } from "~/utils/platform/metaweblog/jvue/jvueApiAdaptor"
import { ConfApiAdaptor } from "~/utils/platform/metaweblog/conf/confApiAdaptor"
import { CnblogsApiAdaptor } from "~/utils/platform/metaweblog/cnblogs/cnblogsApiAdaptor"
import { WordpressApiAdaptor } from "~/utils/platform/wordpress/wordpressApiAdaptor"
import { LiandiApiAdaptor } from "~/utils/platform/commonblog/liandi/liandiApiAdaptor"
import { YuqueApiAdaptor } from "~/utils/platform/commonblog/yuque/yuqueApiAdaptor"
import { KmsApiAdaptor } from "~/utils/platform/commonblog/kms/kmsApiAdaptor"

/**
 * @description ??????????????????API??????
 * @author terwer
 * @version 0.1.0
 * @since 0.0.1
 */
export interface IApi {
  /**
   * @description ????????????????????????
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getUsersBlogs getUsersBlogs}
   * @returns {Promise<Array<UserBlog>>}
   */
  getUsersBlogs: () => Promise<UserBlog[]>

  /**
   * @description ??????????????????
   * @param keyword ???????????????????????????????????????????????????
   * @returns {Promise<number>}
   */
  getRecentPostsCount: (keyword?: string) => Promise<number>

  /**
   * @description ????????????
   * @param numOfPosts ????????????
   * @param page ????????????????????????????????????????????????
   * @param keyword ???????????????????????????????????????????????????
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts getRecentPosts}
   * @returns {Promise<Array<Post>>}
   */
  getRecentPosts: (
    numOfPosts: number,
    page?: number,
    keyword?: string
  ) => Promise<Post[]>

  /**
   * @description ????????????
   * @param postid ??????ID
   * @param useSlug ????????????????????????????????????????????????????????????
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getPost getPost}
   * @returns {Promise<Post>}
   */
  getPost: (postid: string, useSlug?: boolean) => Promise<Post>

  /**
   * @description ????????????
   * @param post ??????
   * @param publish ?????????????????????
   *
   * ```ts
   *    const post = {
   *         description: "???????????????????????????",
   *         title: "???????????????????????????",
   *         categories: ["??????1","??????2"],
   *         // dateCreated: new Date(),
   *         // link: "",
   *         // permalink: "",
   *         // postid: "",
   *         // source: {
   *         //  name: "",
   *         //  url: ""
   *         // };
   *         // userid: ""
   *    }
   *
   *    const result = newPost(post, false)
   * ```
   * @see {@link  https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.newPost newPost}
   * @returns {Promise<string>}
   */
  newPost: (post: Post, publish?: boolean) => Promise<string>

  /**
   * @description ????????????
   * @param postid ??????id
   * @param post ??????
   * @param publish ?????????????????????
   *
   * ```ts
   *     // wordpress
   *     // const postid = 4115
   *     // conf
   *     // const postid = 1540103
   *     const postid = "2490384_1"
   *     const post = {
   *         description: "???????????????????????????????????????2",
   *         title: "???????????????????????????????????????2",
   *         categories: ["??????1", "??????2"],
   *         // dateCreated: new Date(),
   *         // link: "",
   *         // permalink: "",
   *         // postid: postid,
   *         // source: {
   *         //  name: "",
   *         //  url: ""
   *         // };
   *         // userid: ""
   *     }
   *
   *     const result = editPost(postid, post, false)
   * ```
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.editPost editPost}
   * @returns {Promise<boolean>}
   */
  editPost: (postid: string, post: Post, publish?: boolean) => Promise<boolean>

  /**
   * @description ????????????
   * @param postid ??????ID
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.deletePost deletePost}
   * @returns {Promise<boolean>}
   */
  deletePost: (postid: string) => Promise<boolean>

  /**
   * @description ??????????????????
   * @see {@link https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getCategories getCategories}
   * @returns {Promise<CategoryInfo[]>}
   */
  getCategories: () => Promise<CategoryInfo[]>

  /**
   * @description ??????????????????
   * @param postid ??????ID
   * @returns {Promise<string>}
   */
  getPreviewUrl: (postid: string) => Promise<string>
}

/**
 * @description ??????API??????????????????
 * @author terwer
 * @version 0.1.0
 * @since 0.0.1
 */
export class API implements IApi {
  private readonly type: string
  private readonly apiAdaptor: IApi

  constructor(type: string) {
    this.type = type

    // ????????????key????????????-?????????????????????????????????
    if (type.includes("-")) {
      const typeArr = type.split("-")
      if (typeArr.length > 0) {
        const ptype = typeArr[0].toLowerCase()
        if (ptype.includes(PlatformType.Github.toLowerCase())) {
          // Github
          this.apiAdaptor = new GithubApiAdaptor(type)
          return
        } else if (ptype === PlatformType.Metaweblog.toLowerCase()) {
          // Metaweblog
          this.apiAdaptor = new MetaWeblogApiAdaptor(type)
          return
        } else if (ptype === PlatformType.Wordpress.toLowerCase()) {
          // WordPress
          this.apiAdaptor = new MetaWeblogApiAdaptor(type)
          return
        }
      }
    }

    // ?????????????????????
    switch (this.type) {
      case API_TYPE_CONSTANTS.API_TYPE_SIYUAN:
        this.apiAdaptor = new SiYuanApiAdaptor()
        break

      // Github
      case API_TYPE_CONSTANTS.API_TYPE_VUEPRESS:
        this.apiAdaptor = new VuepressApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_HUGO:
        this.apiAdaptor = new HugoApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_HEXO:
        this.apiAdaptor = new HexoApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_JEKYLL:
        this.apiAdaptor = new JekyllApiAdaptor()
        break

      // Metaweblog API
      case API_TYPE_CONSTANTS.API_TYPE_JVUE:
        this.apiAdaptor = new JVueApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE:
        this.apiAdaptor = new ConfApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_CNBLOGS:
        this.apiAdaptor = new CnblogsApiAdaptor()
        break

      // Wordpress
      case API_TYPE_CONSTANTS.API_TYPE_WORDPRESS:
        this.apiAdaptor = new WordpressApiAdaptor()
        break

      // Common
      case API_TYPE_CONSTANTS.API_TYPE_LIANDI:
        this.apiAdaptor = new LiandiApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_YUQUE:
        this.apiAdaptor = new YuqueApiAdaptor()
        break
      case API_TYPE_CONSTANTS.API_TYPE_KMS:
        this.apiAdaptor = new KmsApiAdaptor()
        break
      default:
        throw new Error("??????????????????????????????????????????")
    }
  }

  public async getRecentPostsCount(keyword?: string): Promise<number> {
    return await this.apiAdaptor.getRecentPostsCount(keyword)
  }

  public async getRecentPosts(
    numOfPosts: number,
    page?: number,
    keyword?: string
  ): Promise<Post[]> {
    return await this.apiAdaptor.getRecentPosts(numOfPosts, page, keyword)
  }

  public async getUsersBlogs(): Promise<UserBlog[]> {
    return await this.apiAdaptor.getUsersBlogs()
  }

  public async getPost(postid: string, useSlug?: boolean): Promise<Post> {
    return await this.apiAdaptor.getPost(postid, useSlug)
  }

  public async editPost(
    postid: string,
    post: Post,
    publish?: boolean
  ): Promise<boolean> {
    return await this.apiAdaptor.editPost(postid, post, publish)
  }

  public async newPost(post: Post, publish?: boolean): Promise<string> {
    return await this.apiAdaptor.newPost(post, publish)
  }

  public async deletePost(postid: string): Promise<boolean> {
    return await this.apiAdaptor.deletePost(postid)
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    return await this.apiAdaptor.getCategories()
  }

  public async getPreviewUrl(postid: string): Promise<string> {
    return await this.apiAdaptor.getPreviewUrl(postid)
  }
}
