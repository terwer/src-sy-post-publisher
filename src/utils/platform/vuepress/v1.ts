import {IVuepressCfg} from "./IVuepressCfg";
import {Octokit} from "@octokit/core";
import {Base64} from 'js-base64';
import logUtil from "../../logUtil";

/**
 * Vuepress V1 API
 */
class VuepressApiV1 {
    // 读取配置
    vuepressCfg: IVuepressCfg = <IVuepressCfg>{}

    // Octokit.js
    // https://github.com/octokit/core.js#readme
    octokit: Octokit = <Octokit>{}

    constructor(vuepressCfg: IVuepressCfg, octokit: Octokit) {
        this.vuepressCfg = vuepressCfg;
        this.octokit = octokit;
    }

    /**
     * 获取Github文件的sha，如果文件不存在返回undefined，存在返回sha
     * @param docPath 完整文件路径，例如：docs/_posts/测试.md
     */
    async getPageSha(docPath: string): Promise<string> {
        let sha

        const data = await this.getPageData(docPath)
        if (data) {
            sha = data.sha
        }
        return sha;
    }

    /**
     * 获取Github文件的sha，如果文件不存在返回undefined，存在返回sha
     * @param docPath 完整文件路径，例如：docs/_posts/测试.md
     */
    async getPageData(docPath: string): Promise<any> {
        let data

        let res
        try {
            const route = 'GET /repos/' + this.vuepressCfg.githubUser + '/' + this.vuepressCfg.githubRepo + '/contents/' + docPath;
            logUtil.logInfo("getPage route=>", route)
            res = await this.octokit.request(route, {
                owner: this.vuepressCfg.githubUser,
                repo: this.vuepressCfg.githubRepo,
                path: docPath
            })
            logUtil.logInfo("getPage res=>", res)
        } catch (e) {
            logUtil.logError("getPage error=>", e)
        }

        if (res) {
            data = res.data
        }
        return data;
    }

    /**
     * 创建或更新页面
     * @param docPath 页面路径，相对于根仓库的完整路径
     * @param mdContent Markdown文本
     * @param sha 文件的sha，undefined表示新建，更新需要传sha字符串
     */
    async createOrUpdatePage(docPath: string, mdContent: string, sha: any) {
        let res
        try {
            // const base64 = Buffer.from(mdContent).toString('base64');
            const base64 = Base64.toBase64(mdContent)
            const route = 'PUT /repos/' + this.vuepressCfg.githubUser + '/' + this.vuepressCfg.githubRepo + '/contents/' + docPath;
            let options = {
                owner: this.vuepressCfg.githubUser,
                repo: this.vuepressCfg.githubRepo,
                path: docPath,
                message: this.vuepressCfg.defaultMsg,
                committer: {
                    name: this.vuepressCfg.author,
                    email: this.vuepressCfg.email
                },
                content: base64
            }
            if (sha) {
                Object.assign(options, {
                    sha: sha
                })
            }

            res = await this.octokit.request(route, options)
            logUtil.logInfo("createOrUpdatePage res=>", res)
        } catch (e) {
            logUtil.logError("createOrUpdatePage error=>", e)
        }
        return res
    }

    /**
     * 删除页面
     * @param docPath 页面路径，相对于根仓库的完整路径
     * @param sha 文件的sha，undefined表示新建，更新需要传sha字符串
     */
    async deletePage(docPath: string, sha: any) {
        let res
        try {
            const route = 'DELETE /repos/' + this.vuepressCfg.githubUser + '/' + this.vuepressCfg.githubRepo + '/contents/' + docPath;
            let options = {
                owner: this.vuepressCfg.githubUser,
                repo: this.vuepressCfg.githubRepo,
                path: docPath,
                message: this.vuepressCfg.defaultMsg,
                committer: {
                    name: this.vuepressCfg.author,
                    email: this.vuepressCfg.email
                },
                sha: sha
            }

            res = await this.octokit.request(route, options)
            logUtil.logInfo("deletePage res=>", res)
        } catch (e) {
            logUtil.logError("deletePage error=>", e)
        }
        return res
    }
}

/**
 * 发布文章到Vuepress V1
 * @param vuepressCfg Vuepress发布配置
 * @param docPath 相对于根仓库的完整路径，包括文件名和扩展名
 * @param mdContent Markdown文本
 */
export async function publishPage(vuepressCfg: IVuepressCfg, docPath: string, mdContent: string): Promise<any> {
    const octokit = new Octokit({
        auth: vuepressCfg.githubToken
    })
    const v1 = new VuepressApiV1(vuepressCfg, octokit);
    // 因为是删除，所以这里始终新建，避免路径错误
    // https://github.com/terwer/src-sy-post-publisher/issues/21
    const sha = undefined // await v1.getPageSha(docPath)

    let res
    res = await v1.createOrUpdatePage(docPath, mdContent, sha)
    logUtil.logInfo("Vuepress V1 publishPage,res=>", res)
    return res;
}

/**
 * 删除Vuepress V1发布的文章
 * @param vuepressCfg Vuepress发布配置
 * @param docPath 对于根仓库的完整路径，包括文件名和扩展名
 */
export async function deletePage(vuepressCfg: IVuepressCfg, docPath: string) {
    const octokit = new Octokit({
        auth: vuepressCfg.githubToken
    })
    const v1 = new VuepressApiV1(vuepressCfg, octokit);
    const sha = await v1.getPageSha(docPath)

    let res
    res = await v1.deletePage(docPath, sha)
    logUtil.logInfo("Vuepress V1 deletePage,res=>", res)
    return res;
}

/**
 * 获取Github文件的sha，如果文件不存在返回undefined，存在返回sha
 * @param vuepressCfg Vuepress配置
 * @param docPath 完整文件路径，例如：docs/_posts/测试.md
 */
export async function getPageTreeNode(vuepressCfg: IVuepressCfg, docPath: string): Promise<Array<any>> {
    const octokit = new Octokit({
        auth: vuepressCfg.githubToken
    })
    const v1 = new VuepressApiV1(vuepressCfg, octokit);
    const data = await v1.getPageData(docPath)

    let treeNode = <Array<any>>[]

    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            if (item.name.indexOf(".vuepress") > -1) {
                continue;
            }
            if (item.name.indexOf("@pages") > -1) {
                continue;
            }
            if (item.name.indexOf("_posts") > -1) {
                continue;
            }
            let node = {
                value: item.path,
                label: item.name,
                isLeaf: item.name.indexOf(".md") > -1
            }
            treeNode.push(node)
        }
        logUtil.logInfo("getPageTreeNode,data=>", data)
    }

    return treeNode
}