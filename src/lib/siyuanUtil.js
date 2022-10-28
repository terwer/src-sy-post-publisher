import {getBlockByID} from './siYuanApi.js';

/**
 * 获取挂件所在的块ID
 * @returns {Promise<string>}
 */
export async function getWidgetId() {
    const self = window.frameElement.parentElement.parentElement;
    return self.getAttribute('data-node-id');
}

/**
 * 发送请求获取当前文档
 * @returns {Promise<*>}
 */
export async function getPage(pageId) {
    return await getBlockByID(pageId);
}