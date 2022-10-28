// https://github.com/lmaccherone/node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    global.localStorage = new LocalStorage('./scratch');
}

export function getConf(key) {
    console.warn("尝试从localStorage获取数据，key=>", key)

    const value = localStorage.getItem(key)
    if (!value) {
        console.log("未找到对应值，key=>", key)
        return null;
    }
    const valueObj = JSON.parse(value);
    console.log("从localStorage获取数据=>", valueObj)
    return valueObj;
}

export async function setConf(key, value) {
    console.warn("尝试保存数据到localStorage里key=>", key)
    const valueString = JSON.stringify(value)
    localStorage.setItem(key, valueString)
    console.log("保存数据到localStorage=>", value)
}