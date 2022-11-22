import {IMetaweblogCfg} from "./IMetaweblogCfg";
import {getJSONConf} from "../../config";
import {XmlrpcClient} from "./xmlrpc";
import {UserBlog} from "../../common/userBlog";
import {Post} from "../../common/post";
import logUtil from "../../logUtil";
import {METAWEBLOG_METHOD_CONSTANTS} from "../../constants/metaweblogMethodConstants";
import {POST_STATUS_CONSTANTS} from "../../constants/postStatusConstants";
import {inBrowser, isEmptyString} from "../../util";
import {CategoryInfo} from "../../common/categoryInfo";

export class MetaWeblogApi {
    private readonly apiType: string
    private readonly cfg: IMetaweblogCfg
    private readonly xmlrpcClient: any

    constructor(apiType: string) {
        this.apiType = apiType
        this.cfg = getJSONConf<IMetaweblogCfg>(apiType)
        this.xmlrpcClient = new XmlrpcClient(this.apiType, this.cfg.apiUrl, this.cfg.username, this.cfg.password)
    }

    public async getUsersBlogs(appkey: string, username: string, password: string): Promise<Array<UserBlog>> {
        const usersBlogs: Array<UserBlog> = []
        let ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.GET_USERS_BLOGS,
            [this.apiType, username, password])
        logUtil.logInfo("ret=>")
        logUtil.logInfo(ret)

        // JSON格式规范化
        // if (typeof ret == "string") {
        // }

        // 错误处理
        const dataObj = JSON.parse(ret) || []
        if (dataObj.faultCode) {
            throw new Error(dataObj.faultString)
        }

        // 数据适配
        const dataArr = JSON.parse(ret) || []
        for (let i = 0; i < dataArr.length; i++) {
            const userBlog = new UserBlog()
            const item = dataArr[i]

            userBlog.blogid = item.blogid || ""
            userBlog.url = item.url
            userBlog.blogName = item.blogName

            usersBlogs.push(userBlog)
        }

        return usersBlogs
    }

    public async getRecentPosts(appkey: string, username: string, password: string, numOfPosts: number): Promise<Array<Post>> {
        return Promise.resolve([])
    }

    public async getPost(postid: string, username: string, password: string): Promise<Post> {
        let result:Post = new Post()

        try {
            let ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.GET_POST,
                [postid, username, password])
            logUtil.logInfo("getCategories ret=>", ret)

            const dataObj = JSON.parse(ret) || []
            if (dataObj.faultCode) {
                logUtil.logError("请求分类异常，错误信息如下：",dataObj.faultString)
            }

            // 数据适配
            logUtil.logInfo("获取的文章信息，dataObj=>", dataObj)
            // 暂时只用到了分类，其他属性先不适配
            result.categories = dataObj.categories
        }catch (e) {
            logUtil.logError("文章信息获取失败", e)
        }

        return result
    }

    /**
     * 新建文章
     * @param blogid
     * @param username
     * @param password
     * @param post
     * @param publish
     */
    public async newPost(blogid: string, username: string, password: string, post: Post, publish: boolean): Promise<string> {
        // 草稿
        if (!publish) {
            post.post_status = POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
        }

        const postStruct = this.createPostStruct(post)
        logUtil.logInfo("postStruct=>")
        logUtil.logInfo(postStruct)
        let ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.NEW_POST,
            [this.apiType, username, password, postStruct, publish])
        ret = ret.replace(/"/g, "")
        logUtil.logInfo("ret=>")
        logUtil.logInfo(ret)

        return ret;
    }

    public async editPost(postid: string, username: string, password: string, post: Post, publish: boolean): Promise<boolean> {
        // 草稿
        if (!publish) {
            post.post_status = POST_STATUS_CONSTANTS.POST_TYPE_DRAFT
        }

        const postStruct = this.createPostStruct(post)
        logUtil.logInfo("postStruct=>")
        logUtil.logInfo(postStruct)
        const ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.EDIT_POST,
            [postid, username, password, postStruct, publish])
        logUtil.logInfo("ret=>")
        logUtil.logInfo(ret)

        return ret;
    }

    public async deletePost(appKey: string, postid: string, username: string, password: string, publish: boolean) {
        const ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.DELETE_POST,
            [appKey, postid, username, password, publish])
        logUtil.logInfo("ret=>")
        logUtil.logInfo(ret)

        return ret;
    };

    /**
     * 适配文章字段
     * @param post 原始文章
     * @private
     */
    private createPostStruct(post: Post): object {
        let postObj = {}

        if (!isEmptyString(post.title)) {
            Object.assign(postObj, {
                title: post.title
            })
        }

        if (!isEmptyString(post.mt_keywords)) {
            Object.assign(postObj, {
                mt_keywords: post.mt_keywords
            })
        }

        if (!isEmptyString(post.description)) {
            Object.assign(postObj, {
                description: post.description
            })
        }

        if (!isEmptyString(post.wp_slug)) {
            Object.assign(postObj, {
                wp_slug: post.wp_slug
            })
        }

        // 浏览器端的date转换有问题
        if (!inBrowser()) {
            Object.assign(postObj, {
                // 这里要注意时间格式
                // http://www.ab-weblog.com/en/create-new-posts-with-publishing-date-in-wordpress-using-xml-rpc-and-php/
                // dateCreated: post.dateCreated.toISOString() || new Date().toISOString()
                dateCreated: post.dateCreated || new Date()
            })
        }

        Object.assign(postObj, {
            categories: post.categories || [],
        })

        Object.assign(postObj, {
            post_status: post.post_status || POST_STATUS_CONSTANTS.POST_STATUS_PUBLISH,
        })

        if (!isEmptyString(post.wp_password)) {
            Object.assign(postObj, {
                wp_password: post.wp_password
            })
        }

        return postObj;
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

    public async getCategories(blogid: string, username: string, password: string,): Promise<CategoryInfo[]> {
        let result = <Array<CategoryInfo>>[]

        try {
            let ret = await this.xmlrpcClient.methodCallEntry(METAWEBLOG_METHOD_CONSTANTS.GET_CATEGORIES,
                [this.apiType, username, password])
            logUtil.logInfo("getCategories ret=>", ret)

            // 错误处理
            const dataObj = JSON.parse(ret) || []
            if (dataObj.faultCode) {
               logUtil.logError("请求分类异常，错误信息如下：",dataObj.faultString)
            }

            // 数据适配
            const dataArr = JSON.parse(ret) || []
            logUtil.logInfo("获取的分类信息，dataArr=>", dataArr)

            dataArr.forEach((item: any) => {
                const cat = new CategoryInfo()
                cat.description = item.description
                cat.categoryId = item.categoryId
                result.push(cat)
            })
        }catch (e) {
            logUtil.logError("分类获取失败", e)
        }

        return result
    }
}