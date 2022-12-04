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

import { XmlrpcClient } from "~/utils/platform/metaweblog/xmlrpc"
import { appandStr } from "~/utils/strUtil"
import { UserBlog } from "~/utils/common/userBlog"
import { METAWEBLOG_METHOD_CONSTANTS } from "~/utils/constants/metaweblogMethodConstants"
import { Logger } from "loglevel"
import { LogFactory } from "~/utils/logUtil"
import { Post } from "~/utils/common/post"
import { POST_STATUS_CONSTANTS } from "~/utils/constants/postStatusConstants"
import { isEmptyString } from "~/utils/util"
import { isBrowser } from "~/utils/browserUtil"
import { CategoryInfo } from "~/utils/common/categoryInfo"

export class CustomMetaWeblogApi {
  private readonly logger: Logger
  private readonly apiType: string
  private readonly apiUrl: string
  private readonly username: string
  private readonly password: string

  private readonly xmlrpcClient: any

  constructor(
    apiType: string,
    apiUrl: string,
    username: string,
    password: string
  ) {
    this.logger = LogFactory.getLogger(
      "utils/platform/metaweblog/CustomMetaweblogApi.ts"
    )
    this.apiType = apiType
    this.apiUrl = apiUrl
    this.username = username
    this.password = password

    this.xmlrpcClient = new XmlrpcClient(
      this.apiType,
      this.apiUrl,
      this.username,
      this.password
    )
  }

  /**
   * 错误处理
   * @param ret
   * @private
   */
  private doFault(ret: any): void {
    const faultObj = ret.fault
    if (faultObj) {
      const fault = faultObj.value.struct.member
      const faultCode = this.parseFieldValue(fault, "faultCode")
      const faultString = this.parseFieldValue(fault, "faultString")
      throw new Error(
        appandStr("发生异常，错误码=>", faultCode, "，错误信息=>", faultString)
      )
    }

    if (!ret?.params) {
      throw new Error("发生异常=>数据为空")
    }
  }

  public async getUsersBlogs(
    appkey: string,
    username: string,
    password: string
  ): Promise<UserBlog[]> {
    const usersBlogs: UserBlog[] = []
    const ret = await this.xmlrpcClient.methodCallEntry(
      METAWEBLOG_METHOD_CONSTANTS.GET_USERS_BLOGS,
      [this.apiType, username, password]
    )
    this.logger.debug("getUsersBlogs ret=>", ret)

    // 错误处理
    this.doFault(ret)

    // 数据适配
    const dataArr = ret.params.param.value.array.data.value.struct.member || []

    const userBlog = new UserBlog()
    userBlog.blogid = this.parseFieldValue(dataArr, "blogid")
    userBlog.url = this.parseFieldValue(dataArr, "url")
    userBlog.blogName = this.parseFieldValue(dataArr, "blogName")

    usersBlogs.push(userBlog)

    return usersBlogs
  }

  /**
   * 解析字段
   * @param dataArr
   * @param key
   * @private
   */
  private parseFieldValue(dataArr: [], key: string): any {
    let val

    for (let i = 0; i < dataArr.length; i++) {
      const obj: any = dataArr[i]

      if (obj.name === key) {
        if (typeof obj.value === "string") {
          val = obj.value
          break
        } else {
          val = obj.value.string || obj.value.int || obj.value.i4 || obj.value
          break
        }
      }
    }

    return val
  }

  public async getRecentPosts(
    appkey: string,
    username: string,
    password: string,
    numOfPosts: number,
    page?: number,
    keyword?: string
  ): Promise<Post[]> {
    const result = [] as Post[]

    const reqParams = [this.apiType, username, password, numOfPosts]
    if (page ?? keyword) {
      const pg = page ?? 1
      const k = keyword ?? ""
      reqParams.push(pg)
      reqParams.push(k)
    }

    const ret = await this.xmlrpcClient.methodCallEntry(
      METAWEBLOG_METHOD_CONSTANTS.GET_RECENT_POSTS,
      reqParams
    )
    this.logger.debug("getRecentPosts ret=>", ret)

    // 错误处理
    this.doFault(ret)

    const postArray = ret.params.param.value.array.data.value || []
    if (ret.params.param.value.array.data.value instanceof Array) {
      postArray.forEach((item: any) => {
        const post = this.parsePost(item)
        result.push(post)
      })
    } else {
      const onePost = ret.params.param.value.array.data.value
      if (onePost) {
        const post = this.parsePost(onePost)
        result.push(post)
      }
    }

    this.logger.debug("result=>", result)
    return result
  }

  private parsePost(postStruct: any): Post {
    const post = new Post()
    const postObj = postStruct.struct.member
    post.mt_keywords = this.parseFieldValue(postObj, "mt_keywords")
    post.title = this.parseFieldValue(postObj, "title")
    post.link = this.parseFieldValue(postObj, "link")
    post.permalink = this.parseFieldValue(postObj, "permalink")
    post.postid = this.parseFieldValue(postObj, "postid")
    post.description = this.parseFieldValue(postObj, "description")
    post.mt_excerpt = this.parseFieldValue(postObj, "mt_excerpt")
    post.wp_slug = this.parseFieldValue(postObj, "wp_slug")
    post.dateCreated = this.parseFieldValue(postObj, "dateCreated")

    const pcats = [] as any[]
    const cats =
      this.parseFieldValue(postObj, "categories")?.array?.data?.value || []
    const catstr = cats?.string || cats
    if (typeof catstr === "string") {
      pcats.push(catstr)
    } else {
      // logger.debug("cats=>", cats)
      if (cats && cats.length > 0) {
        cats.forEach((cat: any) => {
          const item = cat.string
          pcats.push(item)
        })
      }
    }
    // logger.debug("pcats=>", pcats)
    post.categories = pcats

    post.mt_text_more = this.parseFieldValue(postObj, "mt_text_more")

    return post
  }

  public async getPost(
    postid: string,
    username: string,
    password: string
  ): Promise<Post> {
    const ret = await this.xmlrpcClient.methodCallEntry(
      METAWEBLOG_METHOD_CONSTANTS.GET_POST,
      [postid, username, password]
    )
    this.logger.debug("getPost ret=>", ret)

    // 错误处理
    this.doFault(ret)

    const postStruct = ret.params.param.value || []
    const post = this.parsePost(postStruct)

    // 这里原样返回，到适配器再去自己处理
    // post.description = render(post.description)

    this.logger.debug("getPost post=>", post)
    return post
  }

  /**
   * 新建文章
   * @param blogid
   * @param username
   * @param password
   * @param post
   * @param publish
   */
  public async newPost(
    blogid: string,
    username: string,
    password: string,
    post: Post,
    publish: boolean
  ): Promise<string> {
    // 草稿
    if (!publish) {
      post.post_status = POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
    }

    const postStruct = this.createPostStruct(post)
    this.logger.debug("postStruct=>", postStruct)

    const ret = await this.xmlrpcClient.methodCallEntry(
      METAWEBLOG_METHOD_CONSTANTS.NEW_POST,
      [this.apiType, username, password, postStruct, publish]
    )
    this.logger.debug("newPost ret=>", ret)

    // 错误处理
    this.doFault(ret)

    const retStr = ret.params.param.value.string || ret.params.param.value || ""
    this.logger.debug("newPost retStr=>", retStr.toString())

    return retStr.toString()
  }

  public async editPost(
    postid: string,
    username: string,
    password: string,
    post: Post,
    publish: boolean
  ): Promise<boolean> {
    // 草稿
    if (!publish) {
      post.post_status = POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
    }

    const postStruct = this.createPostStruct(post)
    this.logger.debug("postStruct=>", postStruct)
    const ret = await this.xmlrpcClient.methodCallEntry(
      METAWEBLOG_METHOD_CONSTANTS.EDIT_POST,
      [postid, username, password, postStruct, publish]
    )

    // 错误处理
    this.doFault(ret)

    const retBool =
      ret.params.param.value.boolean || ret.params.param.value || 0
    this.logger.debug("editPost retBool=>", retBool)

    return retBool
  }

  public async deletePost(
    appKey: string,
    postid: string,
    username: string,
    password: string,
    publish: boolean
  ): Promise<boolean> {
    const ret = await this.xmlrpcClient.methodCallEntry(
      METAWEBLOG_METHOD_CONSTANTS.DELETE_POST,
      [appKey, postid, username, password, publish]
    )

    // 错误处理
    this.doFault(ret)

    const retBool =
      ret.params.param.value.boolean || ret.params.param.value || 0
    this.logger.debug("deletePost retBool=>", retBool)

    return retBool
  }

  /**
   * 适配文章字段
   * @param post 原始文章
   * @private
   */
  private createPostStruct(post: Post): object {
    const postObj = {}

    if (!isEmptyString(post.title)) {
      Object.assign(postObj, {
        title: post.title,
      })
    }

    if (!isEmptyString(post.mt_keywords)) {
      Object.assign(postObj, {
        mt_keywords: post.mt_keywords,
      })
    }

    if (!isEmptyString(post.description)) {
      Object.assign(postObj, {
        description: post.description,
      })
    }

    if (!isEmptyString(post.wp_slug)) {
      Object.assign(postObj, {
        wp_slug: post.wp_slug,
      })
    }

    // 浏览器端的date转换有问题
    if (!isBrowser()) {
      Object.assign(postObj, {
        // 这里要注意时间格式
        // http://www.ab-weblog.com/en/create-new-posts-with-publishing-date-in-wordpress-using-xml-rpc-and-php/
        // dateCreated: post.dateCreated.toISOString() || new Date().toISOString()
        dateCreated: post.dateCreated || new Date(),
      })
    }

    Object.assign(postObj, {
      categories: post.categories || [],
    })

    Object.assign(postObj, {
      post_status:
        post.post_status ?? POST_STATUS_CONSTANTS.POST_STATUS_PUBLISH,
    })

    if (!isEmptyString(post.wp_password)) {
      Object.assign(postObj, {
        wp_password: post.wp_password,
      })
    }

    return postObj
    // return {
    //     title: post.title || '',
    //     mt_keywords: post.mt_keywords || '',
    //     description: post.description || '',
    //     wp_slug: post.wp_slug || '',
    //     dateCreated: post.dateCreated.toISOString() || new Date().toISOString(),
    //     categories: post.categories || [],
    //     post_status: post.post_status || POST_STATUS_CONSTANTS.POST_STATUS_PUBLISH,
    //     wp_password: post.wp_password || ''
    // }
  }

  public async getCategories(
    blogid: string,
    username: string,
    password: string
  ): Promise<CategoryInfo[]> {
    const result = [] as CategoryInfo[]

    const ret = await this.xmlrpcClient.methodCallEntry(
      METAWEBLOG_METHOD_CONSTANTS.GET_CATEGORIES,
      [this.apiType, username, password]
    )
    this.logger.debug("getCategories ret=>", ret)

    // 错误处理
    this.doFault(ret)

    const catArray = ret.params.param.value.array.data.value || []
    catArray.forEach((item: any) => {
      const cat = this.parseCat(item)
      result.push(cat)
    })

    this.logger.debug("getCategories result=>", result)
    return result
  }

  private parseCat(catStruct: any): CategoryInfo {
    const cat = new CategoryInfo()
    const catObj = catStruct.struct.member
    cat.categoryId = this.parseFieldValue(catObj, "categoryId")
    cat.parentId = this.parseFieldValue(catObj, "parentId")
    cat.description = this.parseFieldValue(catObj, "description")
    cat.categoryDescription = this.parseFieldValue(
      catObj,
      "categoryDescription"
    )
    cat.categoryName = this.parseFieldValue(catObj, "categoryName")
    cat.htmlUrl = this.parseFieldValue(catObj, "htmlUrl")
    cat.rssUrl = this.parseFieldValue(catObj, "rssUrl")

    return cat
  }
}