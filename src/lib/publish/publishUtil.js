import {getConf} from "../config";

const API_TYPE_CNBLPGS = "cnblogs";
const API_TYPE_WORDPRESS = "wordpress";
const API_TYPE_CONFLUENCE = "confluence";
const API_TYPE_JVUE = "jvue";
const API_TYPE_YUQUE = "yuque";
const API_TYPE_WECHAT = "wechat";
const API_TYPE_LIANDI = "liandi";
const API_TYPE_VUEPRESS = "vuepress";

const CNBLOGS_HOME_KEY = "cnblogs-home";
const WORDPRESS_HOME_KEY = "wordpress-home";
const CONFLUENCE_HOME_KEY = "conf-home";
const JVUE_HOME_KEY = "jvue-home";
const YUQUE_HOME_KEY = "yuque-home";
const WECHAT_HOME_KEY = "wechat-home";
const LIANDI_HOME_KEY = "liandi-home";
const VUEPRESS_HOME_KEY = "vuepress-home";

const CNBLOGS_API_URL_KEY = "cnblogs-api-url";
const WORDPRESS_API_URL_KEY = "wordpress-api-url";
const CONFLUENCE_API_URL_KEY = "conf-api-url";
const JVUE_API_URL_KEY = "jvue-api-url";
const YUQUE_API_URL_KEY = "yuque-api-url";
const WECHAT_API_URL_KEY = "wechat-api-url";
const LIANDI_API_URL_KEY = "liandi-api-url";
const VUEPRESS_API_URL_KEY = "vuepress-api-url";

const CNBLOGS_API_URL = "https://rpc.cnblogs.com/metaweblog/tangyouwei";
const WORDPRESS_API_URL = "http://localhost:8000/xmlrpc.php";
const CONFLUENCE_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc?t=conf";
const JVUE_API_URL = "https://v4.terwergreen.com:8002/xmlrpc";
const YUQUE_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc?t=yuque";
const WECHAT_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc?t=wechat";
const LIANDI_API_URL = "https://xmlrpc.terwergreen.com/api/xmlrpc?t=liandi";
const VUEPRESS_API_URL = "https://github.com/terwer/src.terwer.github.io";

const CNBLOGS_POSTID_KEY = "custom-cnblogs-post-id";
const WORDPRESS_POSTID_KEY = "custom-wordpress-post-id";
const CONFLUENCE_POSTID_KEY = "custom-conf-post-id";
const JVUE_POSTID_KEY = "custom-jvue-post-id";
const YUQUE_POSTID_KEY = "custom-yuque-post-id";
const WECHAT_POSTID_KEY = "custom-wechat-post-id";
const LIANDI_POSTID_KEY = "custom-liandi-post-id";
const VUEPRESS_POSTID_KEY = "custom-vuepress-slug";

const CNBLOGS_USERNAME_KEY = "cnblogs-publish-username";
const WORDPRESS_USERNAME_KEY = "wordpress-publish-username";
const CONFLUENCE_USERNAME_KEY = "conf-publish-username";
const JVUE_USERNAME_KEY = "jvue-publish-username";
const YUQUE_USERNAME_KEY = "yuque-publish-username";
const WECHAT_USERNAME_KEY = "wechat-publish-username";
const LIANDI_USERNAME_KEY = "liandi-publish-username";
const VUEPRESS_USERNAME_KEY = "vuepress-publish-username";

const CNBLOGS_PASSWORD_KEY = "cnblogs-publish-password";
const WORDPRESS_PASSWORD_KEY = "wordpress-publish-password";
const CONFLUENCE_PASSWORD_KEY = "conf-publish-password";
const JVUE_PASSWORD_KEY = "jvue-publish-password";
const YUQUE_PASSWORD_KEY = "yuque-publish-password";
const WECHAT_PASSWORD_KEY = "wechat-publish-password";
const LIANDI_PASSWORD_KEY = "liandi-publish-password";
const VUEPRESS_PASSWORD_KEY = "vuepress-publish-password";

/**
 * 平台类型
 */
export const PUBLISH_TYPE_CONSTANTS = {
    API_TYPE_CNBLPGS,
    API_TYPE_WORDPRESS,
    API_TYPE_CONFLUENCE,
    API_TYPE_JVUE,
    API_TYPE_YUQUE,
    API_TYPE_WECHAT,
    API_TYPE_LIANDI,
    API_TYPE_VUEPRESS
};

/**
 * 平台主页
 */
export const PUBLISH_HOME_KEY_CONSTANTS = {
    CNBLOGS_HOME_KEY,
    WORDPRESS_HOME_KEY,
    CONFLUENCE_HOME_KEY,
    JVUE_HOME_KEY,
    YUQUE_HOME_KEY,
    WECHAT_HOME_KEY,
    LIANDI_HOME_KEY,
    VUEPRESS_HOME_KEY
}

/**
 * API地址
 */
export const PUBLISH_API_URL_KEY_CONSTANTS = {
    CNBLOGS_API_URL_KEY,
    WORDPRESS_API_URL_KEY,
    CONFLUENCE_API_URL_KEY,
    JVUE_API_URL_KEY,
    YUQUE_API_URL_KEY,
    WECHAT_API_URL_KEY,
    LIANDI_API_URL_KEY,
    VUEPRESS_API_URL_KEY
}

/**
 * 账号
 */
export const PUBLISH_USERNAME_KEY_CONSTANTS = {
    CNBLOGS_USERNAME_KEY,
    WORDPRESS_USERNAME_KEY,
    CONFLUENCE_USERNAME_KEY,
    JVUE_USERNAME_KEY,
    YUQUE_USERNAME_KEY,
    WECHAT_USERNAME_KEY,
    LIANDI_USERNAME_KEY,
    VUEPRESS_USERNAME_KEY
}

/**
 * 密码
 */
export const PUBLISH_PASSWORD_KEY_CONSTANTS = {
    CNBLOGS_PASSWORD_KEY,
    WORDPRESS_PASSWORD_KEY,
    CONFLUENCE_PASSWORD_KEY,
    JVUE_PASSWORD_KEY,
    YUQUE_PASSWORD_KEY,
    WECHAT_PASSWORD_KEY,
    LIANDI_PASSWORD_KEY,
    VUEPRESS_PASSWORD_KEY
}

/**
 * 文档ID
 */
export const PUBLISH_POSTID_KEY_CONSTANTS = {
    CNBLOGS_POSTID_KEY,
    WORDPRESS_POSTID_KEY,
    CONFLUENCE_POSTID_KEY,
    JVUE_POSTID_KEY,
    YUQUE_POSTID_KEY,
    WECHAT_POSTID_KEY,
    LIANDI_POSTID_KEY,
    VUEPRESS_POSTID_KEY
}

export function getApiParams(apiType) {
    // ==================
    // 修改这个切换api
    // ==================
    // cnblogs
    let conf = getConf(API_TYPE_CNBLPGS) || {}
    let appKey = API_TYPE_CNBLPGS;
    let home = conf[CNBLOGS_HOME_KEY] || ""
    let apiUrl = conf[CNBLOGS_API_URL_KEY] || CNBLOGS_API_URL;
    let username = conf[CNBLOGS_USERNAME_KEY] || "";
    let password = conf[CNBLOGS_PASSWORD_KEY] || "";
    let postidKey = CNBLOGS_POSTID_KEY;

    // wordpress
    if (API_TYPE_WORDPRESS === apiType) {
        conf = getConf(API_TYPE_WORDPRESS) || {}
        appKey = API_TYPE_WORDPRESS;
        home = conf[WORDPRESS_HOME_KEY] || ""
        apiUrl = conf[WORDPRESS_API_URL_KEY] || WORDPRESS_API_URL;
        username = conf[WORDPRESS_USERNAME_KEY] || "terwer";
        password = conf[WORDPRESS_PASSWORD_KEY] || "123456";
        postidKey = WORDPRESS_POSTID_KEY;
    }

    // confluence
    if (API_TYPE_CONFLUENCE === apiType) {
        conf = getConf(API_TYPE_CONFLUENCE) || {}
        appKey = API_TYPE_CONFLUENCE;
        home = conf[CONFLUENCE_HOME_KEY] || ""
        apiUrl = conf[CONFLUENCE_API_URL_KEY] || CONFLUENCE_API_URL;
        username = conf[CONFLUENCE_USERNAME_KEY] || "";
        password = conf[CONFLUENCE_PASSWORD_KEY] || "";
        postidKey = CONFLUENCE_POSTID_KEY;
    }

    // jvue
    if (API_TYPE_JVUE === apiType) {
        conf = getConf(API_TYPE_JVUE) || {}
        appKey = API_TYPE_JVUE;
        home = conf[JVUE_HOME_KEY] || ""
        apiUrl = conf[JVUE_API_URL_KEY] || JVUE_API_URL;
        username = conf[JVUE_USERNAME_KEY] || "";
        password = conf[JVUE_PASSWORD_KEY] || "";
        postidKey = JVUE_POSTID_KEY;
    }

    // yuque
    if (API_TYPE_YUQUE === apiType) {
        conf = getConf(API_TYPE_YUQUE) || {}
        appKey = API_TYPE_YUQUE;
        home = conf[YUQUE_HOME_KEY] || ""
        apiUrl = conf[YUQUE_API_URL_KEY] || YUQUE_API_URL;
        username = conf[YUQUE_USERNAME_KEY] || "";
        password = conf[YUQUE_PASSWORD_KEY] || "";
        postidKey = YUQUE_POSTID_KEY;
    }

    // wechat
    if (API_TYPE_WECHAT === apiType) {
        conf = getConf(API_TYPE_WECHAT) || {}
        appKey = API_TYPE_WECHAT;
        home = conf[WECHAT_HOME_KEY] || ""
        apiUrl = conf[WECHAT_API_URL] || WECHAT_API_URL;
        username = conf[WECHAT_USERNAME_KEY] || "";
        password = conf[WECHAT_PASSWORD_KEY] || "";
        postidKey = WECHAT_POSTID_KEY;
    }

    // liandi
    if (API_TYPE_LIANDI === apiType) {
        conf = getConf(API_TYPE_LIANDI) || {}
        appKey = API_TYPE_LIANDI;
        home = conf[LIANDI_HOME_KEY] || ""
        apiUrl = conf[LIANDI_API_URL] || LIANDI_API_URL;
        username = conf[LIANDI_USERNAME_KEY] || "";
        password = conf[LIANDI_PASSWORD_KEY] || "";
        postidKey = LIANDI_POSTID_KEY;
    }

    // vuepress
    if (API_TYPE_VUEPRESS === apiType) {
        conf = getConf(API_TYPE_VUEPRESS) || {}
        appKey = API_TYPE_VUEPRESS;
        home = conf[VUEPRESS_HOME_KEY] || ""
        apiUrl = conf[VUEPRESS_API_URL_KEY] || VUEPRESS_API_URL;
        username = conf[VUEPRESS_USERNAME_KEY] || "";
        password = conf[VUEPRESS_PASSWORD_KEY] || "";
        postidKey = VUEPRESS_POSTID_KEY;
    }

    const apiParams = {
        home,
        apiUrl,
        appKey,
        username,
        password,
        postidKey
    }

    console.log("获取最新apiParams=>", {
        home,
        apiUrl,
        appKey,
        username,
        postidKey
    })

    return apiParams;
}