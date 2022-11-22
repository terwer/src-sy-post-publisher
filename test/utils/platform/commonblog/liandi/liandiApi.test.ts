import {describe} from "vitest";
import logUtil from "../../../../../src/utils/logUtil";
import {LiandiApiAdaptor} from "../../../../../src/utils/platform/commonblog/liandi/liandiApiAdaptor";
import {CommonblogApiAdaptor} from "../../../../../src/utils/platform/commonblog/commonblogApiAdaptor";
import {setJSONConf} from "../../../../../src/utils/config";
import {LiandiCfg} from "../../../../../src/utils/platform/commonblog/liandi/liandiCfg";
import {API_TYPE_CONSTANTS} from "../../../../../src/utils/constants/apiTypeConstants";
import {getEnv} from "../../../../../src/utils/envUtil";

describe("liandiApi", async () => {

    // 这个执行一次即可，后面就不用了
    // it("init", async () => {
    //     const cfg = new LiandiCfg()
    //     cfg.home = "https://ld246.com/"
    //     cfg.username = "terwergreen"
    //     cfg.token = getEnv("VITE_TEST_LIANDI_TOKEN")
    //     cfg.apiUrl = "https://ld246.com/api/v2"
    //     cfg.apiStatus = true
    //     cfg.blogName = "链滴"
    //
    //     setJSONConf(API_TYPE_CONSTANTS.API_TYPE_LIANDI, cfg)
    // })

    it("getUser", async () => {
        const apiAdaptor: CommonblogApiAdaptor = new LiandiApiAdaptor()
        const result = await apiAdaptor.getUsersBlogs()
        logUtil.logInfo(result)
    })

    // it("addArticle", async () => {
    //     const apiAdaptor: CommonblogApiAdaptor = new LiandiApiAdaptor()
    //     const post = new Post()
    //     post.title = "测试帖子"
    //     post.description = "测试帖子内容1"
    //     post.mt_keywords = "测试,API,调试"
    //     const result = await apiAdaptor.newPost(post)
    //     logUtil.logInfo(result)
    // }, 60000)

    // it("getFirstArticleId", async () => {
    //     const apiAdaptor: CommonblogApiAdaptor = new LiandiApiAdaptor()
    //     const result = undefined
    //     logUtil.logInfo(result)
    // }, 60000)

    // it("updateArticle", async () => {
    //     const apiAdaptor: CommonblogApiAdaptor = new LiandiApiAdaptor()
    //     const postid = ""
    //     const post = new Post()
    //     post.title = "测试帖子"
    //     post.description = "测试帖子内容1"
    //     post.mt_keywords = "测试,API,调试"
    //     const result = await apiAdaptor.editPost(postid, post)
    //     logUtil.logInfo(result)
    // })
})