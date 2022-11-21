/**
 * 在chrome插件打开网页
 *
 * 注意：非chrome环境，pageUrl：/index.html，split：/，实际url为：//index.html
 * @param pageUrl 例如：/index.html
 * @param splt 例如：/，但部分情况下无需传递此参数
 *
 */
import {isInFirefoxExtension} from "./FirefoxUtil";
import {inSiyuan} from "../platform/siyuan/siyuanUtil";
import {getQueryString, inBrowser, setUrlParameter} from "../util";
import logUtil from "../logUtil";

function getPageUrl(pageUrl: string, split?: string) {
    // While we could have used `let url = "index.html"`, using runtime.getURL is a bit more robust as
    // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
    // runtime.
    // let url = chrome.runtime.getURL("index/index.html");
    let url = pageUrl;
    // @ts-ignore
    if (typeof chrome.runtime != "undefined") {
        // @ts-ignore
        url = chrome.runtime.getURL(url);
    } else {
        const from = getQueryString("from")
        if (inSiyuan() || from == "siyuan") {
            if (split && split != "") {
                url = "widgets/sy-post-publisher" + url;
            } else {
                url = "/widgets/sy-post-publisher" + url;
            }

            url = setUrlParameter(url, "from", "siyuan")
        }

        if (split && split != "") {
            url = window.location.protocol + "//" + window.location.host + split + url;
        } else {
            url = window.location.protocol + "//" + window.location.host + url;
        }
    }

    logUtil.logWarn("将要打开页面=>", url)
    return url;
}

export function goToPage(pageUrl: string, split?: string) {
    let url = getPageUrl(pageUrl, split);
    window.open(url)
}

export function goToPageWithTarget(pageUrl: string, target?: string, split?: string) {
    const url = getPageUrl(pageUrl, split);
    if (target == "_self") {
        window.location.href = url;
    } else {
        window.open(url)
    }
}

/**
 * 检测是否运行在Chrome插件中
 */
export function isInChromeExtension() {
    if (!inBrowser()) {
        return false;
    }
    if (isInFirefoxExtension()) {
        return false;
    }
    // @ts-ignore
    return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
}

/**
 * 向Chrome发送消息
 * @param message 消息
 */
export function sendChromeMessage(message: any) {
    return new Promise((resolve) => {
        // Firefox处理
        // if (isInFirefoxExtension()) {
        //     logUtil.logWarn("Firefox发送消息", message)
        //     // @ts-ignore
        //     // browser.runtime.sendMessage(message, resolve)
        //
        //     if (message.type == "fetchChromeXmlrpc") {
        //         try {
        //             firefoxXmlHttpRequest({url: message.apiUrl}).then(function (r) {
        //                 resolve(r)
        //             })
        //         } catch (e) {
        //             logUtil.logError("Firefox request error")
        //             resolve("error")
        //         }
        //
        //     }
        // }

        // @ts-ignore
        chrome.runtime.sendMessage(message, resolve)
    })
}