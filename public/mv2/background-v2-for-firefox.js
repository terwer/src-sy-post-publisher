// https://github.com/mdn/webextensions-examples/blob/master/page-to-extension-messaging/content-script.js
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/externally_connectable
// https://developer.chrome.com/docs/extensions/mv3/mv3-migration/
// https://blog.csdn.net/chirpmonster/article/details/124611556

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/externally_connectable
// Firefox不支持
// import logUtil from "../src/lib/logUtil.js";
//
// browser.runtime.onMessage.addListener(
//     (request, sender) => {
//         logUtil.logWarn("Firefox接受消息", request.type)
//         if (request.type == "fetchChromeXmlrpc") {
//             let resText
//             try {
//                 const response = await fetch(request.apiUrl, request.fetchCORSParams);
//                 resText = await response.text()
//                 // console.log("chrome.runtime.onMessage.addListener fetchChromeXmlrpc response:", resText)
//             } catch (e) {
//                 console.error("firefox fetchChromeXmlrpc request error", e)
//             }
//             return resText;
//         } else if (request.type == "fetchChromeJson") {
//             let resJson
//             try {
//                 const fetchCORSOptions = request.fetchCORSOptions
//                 const formJsonText = request.formJson
//                 // console.log("formJsonText=>", formJsonText)
//                 if (formJsonText) {
//                     const formJson = JSON.parse(formJsonText)
//                     // 将formJson转换为formData
//                     const form = new URLSearchParams();
//                     formJson.forEach(function (item) {
//                         form.append(item.key, item.value)
//                     })
//                     fetchCORSOptions.body = form
//                     // console.log("fetchCORSOptions.body=>", form)
//                 }
//                 // console.log("chrome.runtime fetchChromeJson apiUrl", request.apiUrl)
//                 // console.log("chrome.runtime fetchChromeJson reqOps", fetchCORSOptions)
//                 const response = await fetch(request.apiUrl, fetchCORSOptions);
//                 resJson = await response.json()
//                 // console.log("chrome.runtime.onMessage.addListener fetchChromeJson response:", resJson)
//             } catch (e) {
//                 console.error("firefox fetchChromeJson request error", e)
//             }
//             return resJson;
//         }
//
//         return false;
//     }
// );