const showdown = require("showdown")
const converter = new showdown.Converter();

/**
 * 将Markdown转换为HTML
 * @param md Markdown
 * @returns {*} HTML
 */
export function mdToHtml(md) {
    let html = converter.makeHtml(md);
    return removeWidgetTag(html);
}

/**
 * 删除挂件的HTML
 * @param str 原字符
 * @returns {*|string} 删除后的字符
 */
export function removeWidgetTag(str) {
    const publisherRegex = /<iframe.*src="\/widgets\/publisher.*<\/iframe>/g;
    str = str.replaceAll(publisherRegex, "")

    const noteAttrRegex = /<iframe.*\/widgets\/Note*\sAttrs.*\/iframe>/g
    str = str.replaceAll(noteAttrRegex, "")
    return str
}

/**
 * 截取指定长度html
 * @param html html
 * @param length 长度
 * @param ignore 不要结尾省略号
 * @returns {string} 结果
 */
export function parseHtml(html, length, ignore) {
    let allText = filterHtml(html);
    if (allText.length < length) {
        return allText;
    }
    if (ignore) {
        return allText.substring(0, length);
    }
    return allText.substring(0, length) + "...";
}

/**
 * 去除html标签，残缺不全也可以
 * @param str
 * @returns {string} 转换后的结果
 */
function filterHtml(str) {
    /*
     * <.*?>为正则表达式，其中的.表示任意字符，*?表示出现0次或0次以上，此方法可以去掉双头标签(双头针对于残缺的标签)
     * "<.*?"表示<尖括号后的所有字符，此方法可以去掉残缺的标签，及后面的内容
     * " "，若有多种此种字符，可用同一方法去除
     */
    str = str.replace(/<style((.|\n|\r)*?)<\/style>/g, '')
    str = str.replace(/<script((.|\n|\r)*?)<\/script>/g, '')
    str = str.replace(/<[^>]*>/g, '');
    str = str.replace(/&.*;/g, '');
    str = str.replace(/(^\s*)|(\s*$)/g, "");
    str = str.replace(/</g, "").replace(/>/g, "")
    str = str.replace(/"/g, "").replace(/'/g, "")

    // 正则保留字符
    str = str.replace(/\*/g, "")
    str = str.replace(/\$/g, "")
    str = str.replace(/\./g, "")
    str = str.replace(/\+/g, "")

    // 下面是行内空格，不建议去除
    str = str.replace(/\s+/g, '');

    // 冒号分号替换成下划线
    str = str.replace(/[:|：]/g, "_")
    str = str.replace(/[;|；]/g, "_")

    // 需要排除的字符
    const excludeWords = ['\\d*/\\d/\\d*', '[、|\\\\]', '[，|,]', '\\d', '/', '-']
    for (let i = 0; i < excludeWords.length; i++) {
        const regex = new RegExp(excludeWords[i], "g");
        str = str.replaceAll(regex, "")
    }

    str = str.toLowerCase();
    return str;
}

/**
 * 将Markdown转换为纯文本
 * @param md
 * @returns {string}
 */
export function mdToPlanText(md) {
    let html = mdToHtml(md)
    html = removeWidgetTag(html)
    return filterHtml(html)
}