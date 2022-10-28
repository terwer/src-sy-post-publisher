import {getPage, getWidgetId} from "../lib/siyuanUtil";
import {getConf, setConf} from "../lib/config";
import {getApiParams} from "../lib/publish/publishUtil";
import {slugify} from 'transliteration';
import jsYaml from "js-yaml";
import {mdToPlanText} from "../lib/htmlUtil";

// const nodejieba = require("nodejieba");

/**
 * 获取本地缓存的思源笔记页面ID
 * @param force
 * true 强制调用查询不获取缓存
 * false 优先读取本地缓存，缓存不存在再去查询
 * @returns {Promise<*|string>}
 */
export async function getSiyuanPageId(force) {
    const page = await getSiyuanPage(force);
    if (!page) {
        return
    }

    const pageId = page.root_id || ""
    console.log("获取思源笔记页面ID=>", pageId)
    return pageId
}

/**
 * 获取本地缓存的思源笔记页面信息（不是实时的）
 * @param force true代表强制调用查询不获取缓存
 * @returns {Promise<any>}
 */
export async function getSiyuanPage(force) {
    const widgetId = await getWidgetId()
    console.log("获取挂件的widgetId=>", widgetId)
    // 默认读取缓存
    const pageObj = getConf(widgetId);
    if (!force && pageObj) {
        console.log("获取本地缓存的思源笔记页面信息（不是实时的）=>", pageObj)
        return pageObj;
    }

    // 如果本地不存在，或者需要强制读取，调用api查询
    const page = await getPage(widgetId);
    if (page) {
        await setConf(widgetId, page)
        console.warn("调用API设置查询思源页面信息并更新本地缓存", page)
    }
    return page;
}

/**
 * 根据平台类型获取发布状态
 * @param apiType 平台类型
 * @param meta 元数据
 */
export function getPublishStatus(apiType, meta) {
    const postidKey = getApiParams(apiType).postidKey;
    const postId = meta[postidKey] || "";
    console.log("平台=>", apiType)
    console.log("meta=>", meta)
    console.log("postidKey=>", postidKey)
    console.log("postidKey的值=>", postId)
    return postId !== "";
}

/**
 * 中文翻译成英文别名
 * @param q
 * @returns {Promise<unknown>}
 */
export async function zhSlugify(q) {
    // const v = await fetch('https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=en-US&q=' + q);
    const v = await fetch('https://api.terwer.space/api/translate?q=' + q);
    let json = await v.json()
    let res = json[0][0];
    res = res.replaceAll(/-/g, "");
    console.log("res=>", res)
    return slugify(res);
}

export function yaml2Obj(yaml) {
    let doc = "";
    // Get document, or throw exception on error
    try {
        yaml = yaml.replace("---\n", "")
        yaml = yaml.replace("---", "")
        doc = jsYaml.load(yaml);
        // console.log(doc);
    } catch (e) {
        console.error(e);
    }
    return doc;
}

export function obj2yaml(obj) {
    // https://npmmirror.com/package/js-yaml
    let res = jsYaml.dump(obj);
    res = "---\n" + res + "---"
    return res;
}

// function test() {
//     const obj = {
//         title: "把npm依赖转换为本地依赖",
//         date: "2022-07-09 15:16:00",
//         permalink: "/post/convert-npm-dependencies-to-local.html",
//         meta: [
//             {
//                 name: "keywords",
//                 content: "npm dependency"
//             },
//             {
//                 name: "description",
//                 content: "把npm依赖转换为本地依赖有的时候，当我们要使用额第三方库停止维护之后，我们想自己修改代码才能达到某个需求。但是npm默认是只读的，下次运行依赖管理会覆盖代码。缘由要在上面陈述的情况，我们可以把npm依赖库转换为本地依赖，这样就不再受包管理器约束，我们就可以自定义修改代码了方案先删除npm中依赖yarnremove@oaktreehouse/vuepresspluginencrypt森岛帆高"
//             }
//         ],
//         categories: [
//             "博文", "实用技巧"
//         ],
//         tags: [
//             "npm", "dependency"
//         ],
//         author: {
//             name: "terwer",
//             link: "https://github.com/terwer"
//         }
//     };
//     const yamlResult = obj2yaml(obj)
//     console.log("yamlResult=>")
//     console.log(yamlResult)
//
//     const objResult = yaml2Obj(yamlResult)
//     console.log("objResult=>")
//     console.log(objResult)
// }
//
// test()

// babel-node src/lib/util.js

/**
 * 给日期添加小时
 * @param date
 * @param numOfHours
 * @returns {*}
 */
const addHoursToDate = function (date, numOfHours) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
}

/**
 * 转换ISO日期为数字日期
 * @param str '2022-07-18T06:25:48.000Z
 * @param isAddTimeZone 是否增加时区（默认不增加）
 * @returns {string|*}
 */
export const formatIsoToNumDate = (str, isAddTimeZone) => {
    if (!str) {
        return "";
    }
    let newstr = str;

    // https://www.regextester.com/112232
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    const isoDateRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm;
    const matches = newstr.match(isoDateRegex);
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];

        let newmatch = match;
        if (isAddTimeZone) {
            console.warn("修复时区，ISO日期默认晚8小时")
            // ISO日期默认晚8小时
            console.log(addHoursToDate(new Date(match), 8))
            newmatch = addHoursToDate(new Date(match), 8).toISOString()
        }

        const dts = newmatch.split("T")
        const d = dts[0].replaceAll(/-/g, "")
        const t = dts[1].split(".")[0].replaceAll(/:/g, "")

        const result = d + t;

        newstr = newstr.replace(match, result)
        console.log("formatIsoDate match=>", match)
        console.log("formatIsoDate result=>", result)
    }

    return newstr;
}

/**
 * 转换ISO日期为中文日期
 * @param str '2022-07-18T06:25:48.000Z
 * @param isAddTimeZone 是否增加时区（默认不增加）
 * @returns {string|*}
 */
export const formatIsoToZhDate = (str, isAddTimeZone) => {
    if (!str) {
        return "";
    }
    let newstr = str;

    // https://www.regextester.com/112232
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    const isoDateRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(.\d{3})Z$/gm;
    const matches = newstr.match(isoDateRegex);
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];

        let newmatch = match;
        if (isAddTimeZone) {
            // ISO日期默认晚8小时
            console.log(addHoursToDate(new Date(match), 8))
            newmatch = addHoursToDate(new Date(match), 8).toISOString()
        }

        const dts = newmatch.split("T")
        const d = dts[0]
        const t = dts[1].split(".")[0]

        const result = d + " " + t;

        newstr = newstr.replace(match, result)
        console.log("formatZhDate match=>", match)
        console.log("formatZhDate result=>", result)
    }

    // console.log("formatZhDate=>", newstr)
    return newstr;
}

/**
 * 转换数字日期为中文日期
 * @param str '20220718142548'
 * @returns {string|*}
 */
export const formatNumToZhDate = (str) => {
    if (!str) {
        return "";
    }
    let newstr = str;

    const onlyNumbers = newstr.replace(/\D/g, "");
    // console.log("onlyNumbers=>", onlyNumbers)
    const year = onlyNumbers.slice(0, 4)
    const month = onlyNumbers.slice(4, 6)
    const day = onlyNumbers.slice(6, 8)
    const hour = onlyNumbers.slice(8, 10)
    const min = onlyNumbers.slice(10, 12)
    const sec = onlyNumbers.slice(12, 14)

    let datestr = year;
    if (!month) {
        datestr = year;
    } else if (!day) {
        datestr = year + "-" + month
    } else if (!hour) {
        datestr = year + "-" + month + "-" + day
    } else if (!min) {
        datestr = year + "-" + month + "-" + day + " " + hour
    } else if (!sec) {
        datestr = year + "-" + month + "-" + day + " " + hour + ":" + min
    } else {
        datestr = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
    }

    console.log("formatNumToZhDate str=>", str)
    console.log("formatNumToZhDate datestr=>", datestr)
    return datestr;
}

// get a Date object with the specified Time zone
function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
        return new Date(
            new Date(date).toLocaleString('zh-CN', {
                timeZone,
            }),
        );
    }

    return new Date(
        date.toLocaleString('zh-CN', {
            timeZone,
        }),
    );
}

/**
 * 字符转Date
 * @param dateString dateString should be in ISO format: "yyyy-mm-dd", "yyyy-mm" or "yyyy" or yyyymmddsss
 * @returns {Date}
 */
export function covertStringToDate(dateString) {
    const datestr = formatNumToZhDate(dateString);

    // console.log("datestr=>", datestr)
    return changeTimeZone(datestr, 'Asia/Shanghai')
}

// const date = covertStringToDate('20220718142548');
// // const timeZone = 'Asia/Shanghai'
// // const datestr = date.toLocaleString('zh-CN', {
// //     timeZone,
// // });
// console.log("date.toISOString=>")
// console.log(date.toISOString())
//
// const obj = {
//     title: "测试，这里有T，也有.000Z啊",
//     date: date
// }
// const yaml = obj2yaml(obj)
// console.log("yaml=>")
// console.log(yaml)
//
// const fmt = formatIsoToZhDate(yaml)
// console.log("fmt=>")
// console.log(fmt)
//
// const fmt2 = formatIsoToNumDate(yaml)
// console.log("fmt2=>")
// console.log(fmt2)

/**
 * 文本分词
 * @param words 文本
 */
export async function cutWords(words) {
    // https://github.com/yanyiwu/nodejieba
    words = mdToPlanText(words)
    console.log("准备开始分词，原文=>", words)
    // https://github.com/ddsol/speedtest.net/issues/112
    // 浏览器和webpack不支持，只有node能用
    // const result = nodejieba.cut(words);
    // https://api.terwer.space/api/jieba?q=test

    const v = await fetch('https://api.terwer.space/api/jieba?q=' + words);
    let json = await v.json()
    // const result = "浏览器和webpack不支持，只有node能用，作者仓库： https://github.com/yanyiwu/nodejieba ，在线版本：http://cppjieba-webdemo.herokuapp.com 。"
    // alert(result)
    console.log("分词完毕，结果=>", json.result);
    return json.result;
}

/**
 * 统计分词并按照次数排序
 * @param words 分词数组
 * @param len 长度
 * @returns {string[]}
 */
function countWords(words, len) {
    const unUseWords = ['页面']
    console.warn("文本清洗，统计，排序，去除无意义的单词unUseWords=>", unUseWords)

    // 统计
    let wordobj = words.reduce(function (count, word) {
        // 排除无意义的词
        if (word.length === 1 || unUseWords.includes(word)) {
            count[word] = 0;
            return count;
        }

        // 统计
        // eslint-disable-next-line no-prototype-builtins
        count[word] = count.hasOwnProperty(word) ? count[word] + 1 : 1;
        return count;
    }, {});

    // 排序
    const wordarr = Object.keys(wordobj).sort(function (a, b) {
        return wordobj[b] - wordobj[a];
    });
    console.warn("文本清洗结束wordarr=>", wordarr)

    if (!len || len === 0) {
        return wordarr
    }
    return wordarr.slice(0, len)
}

/**
 * 从分词中提取热门标签
 */
export function jiebaToHotWords(words, len) {
    // const words = ["文档", "协同", "开发", "2022/05/25", "需求", "评审", "1", "、", "后台", "配置", "，", "可", "选择", "wps", "或者", "石墨", "文档", "2022/05/31ui", "评审", "2022/06/10", "开发", "遇到", "的", "问题", "1", "、", "未", "开启", "文档", "中台", "时候", "的", "提示", "，", "以及", "其他", "页面", "的", "缺省", "样式", "。", "2022/6/24", "遗留问题", "1", "、", "分享", "发送", "待办", "-", "已", "完成", "2", "、", "团队", "文档", "发送", "待办", "-", "已", "完成", "3", "、", "权限", "-", "已", "完成", "4", "、", "团队", "文档", "传", "fdteamid", "，", "后台", "做", "权限", "判断", "，", "如果", "不是", "这个", "团队", "的人", "，", "提示", "无", "权限", "页面", "-", "已", "完成", "5", "、", "看看", "能", "不能", "隐藏", "默认", "标题", "-todo6", "、", "excel", "和", "ppt", "的", "知识", "助手", "不", "做", "-", "已", "完成", "2022/7/8", "遗留问题", "1", "、", "文档", "和", "模板", "的", "拷贝", "、", "打印", "2", "、", "收藏夹", "重复", "收藏", "2022/7/19", "遗留问题", "1", "、", "文档", "知识", "助手", "太长加", "滚动条", "2", "、", "附件", "的", "显示", "与", "预览", "3", "、", "收起", "4", "、", "自定义", "confirm", "弹窗", "5", "、", "缺省", "页面", "2022/7/19", "待转", "单", "问题", "1", "、", "搜索", "关键字", "去掉", "2", "、", "未", "选中", "的", "时候", "按钮", "变成", "全部", "3", "、", "右侧", "滚动条", "、", "分页", "4", "、", "带", "表格", "收藏", "2022/7/20", "待", "解决问题", "1", "、", "excel", "、", "ppt", "格式", "时", "，", "点", "不", "开", "右侧", "工具栏", "图标", "2", "、", "段落", "收藏", "不能", "用", "3", "、", "详情", "页面", "调整", "4", "、", "筛选", "项", "修复", "5", "、", "git", "无法访问", "1", "、", "摘要", "、", "正文", "（", "正文", "图片", "）", "、", "附件", "2", "、", "搜索", "结果", "，", "状态", "30", "，", "有", "可", "阅读", "权限", "（", "确认", "）", "3", "、", "链接", "只", "展示", "图标", "放在", "标题", "右侧", "1", "、", "插入", "图片", "、", "表格", "2", "、", "维基", "目录", "3", "、", "搜索", "结果", "只", "显示", "文档", "不", "显示", "附件", "4", "、", "知识", "助手", "切换", "tab", "触发", "数据", "更新"]
    // const len = 5

    const res = countWords(words, len);
    // console.log(res)
    return res;
}

// jiebaToHotWords()