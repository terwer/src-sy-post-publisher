import {exportMdContent} from "@/lib/siYuanApi";
import {getApiParams, PUBLISH_TYPE_CONSTANTS} from "@/lib/publish/publishUtil";
import metaweblogApiClient from "@/lib/metaweblog/metaweblog-api-client";
import wordpressApiClient from "@/lib/wordpress/wordpress-api-client";

async function doPublish(id, type, meta, content) {
    console.log("doPublish params=>", {id, type, meta, content});
    const apiParams = getApiParams(type);
    console.log("doPublish apiParams=>", {
        "API_URL": apiParams.API_URL,
        "appKey": apiParams.appKey,
        "username": apiParams.username,
        "apiParams.postidKey": apiParams.postidKey
    });

    // 设置自定义属性
    const postidKey = apiParams.postidKey;
    const customAttr = {
        "custom-slug": meta["custom-slug"],
        [postidKey]: meta[postidKey],
    };

    console.log("设置自定义属性customAttr=>", customAttr);

    return new Promise((resolve, reject) => {
        if (PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS === type) {
            // Wordpress调用Wordpress的API
            console.log("Wordpress调用Wordpress的API");
            const wordpressApi = wordpressApiClient(type);
            const result = wordpressApi.getPosts(10);
            result.then(function (res, rej) {
                if (res) {
                    console.log("wordpress getPosts reject=>", res);
                    resolve(res)
                } else {
                    console.log("wordpress getPosts=>", rej);
                    reject(rej)
                }
            });
        } else {
            // 其他平台调用metaweblogApi的适配器
            console.log("其他平台调用metaweblogApi的适配器");
            const metaWeblogApi = metaweblogApiClient(type);
            const result = metaWeblogApi.getRecentPosts(10);
            result.then(function (posts) {
                console.log("metaweblog get recent posts=>", posts);
                resolve(posts)
            }).catch(function (e) {
                console.error(e);
                reject(e)
            });
        }

        // fetchPost("/api/attr/setBlockAttrs", {
        //     "id": id,
        //     "attrs": customAttr
        // }, (response) => {
        //     const newmeta = response;
        //     console.log("doPublish customAttr=>", customAttr);
        //     // console.log("doPublish content=>", content);
        // });
    });
}

/**
 * 发布Markdown格式的文档
 * @param id 文档ID
 * @param type 文档类型
 * @param meta 文档属性
 * @returns {Promise<void>}
 */
export async function publishMdContent(id, type, meta) {
    const data = await exportMdContent(id);

    const content = data.content;

    console.log("发布Markdown格式的文档")
    return await doPublish(id, type, meta, content);
}

/**
 * 发布HTML格式的文档
 * @param id 文档ID
 * @param type 文档类型
 * @param meta 文档属性
 * @returns {Promise<void>}
 */
export async function publishHTMLContent(id, type, meta) {
    const data = await exportMdContent(id);

    const content = data.content;
    const html = content;

    console.log("发布HTML格式的文档")
    return await doPublish(id, type, meta, html);
}