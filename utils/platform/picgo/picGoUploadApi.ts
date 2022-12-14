import { CommonblogApi } from "~/utils/platform/commonblog/commonblogApi"
import { isEmptyObject } from "~/utils/util"

/**
 * PicGO上传Api
 * @since 0.6.0
 * @author terwer
 */
export class PicGoUploadApi extends CommonblogApi {
  /**
   * 上传图片到PicGO
   * @param input 路径数组，可为空，为空上传剪贴板
   */
  public async upload(input?: any[]): Promise<string> {
    let ret = JSON.stringify([])

    const apiUrl = "http://127.0.0.1:36677/upload"

    const fetchOps = {
      method: "POST",
    }

    let data
    // 传递了路径，上传具体图片，否则上传剪贴板
    if (input) {
      data = { list: input }
    }

    // 数据不为空才传递
    if (!isEmptyObject(data)) {
      Object.assign(fetchOps, {
        body: JSON.stringify(data),
      })
    }

    Object.assign(fetchOps, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Terwer/0.1.0",
      },
    })

    // 发送请求
    this.logger.debug("调用HTTP请求上传图片到PicGO，apiUrl=>", apiUrl)
    this.logger.debug("调用HTTP请求上传图片到PicGO，fetchOps=>", fetchOps)

    // 使用兼容的fetch调用并返回统一的JSON数据
    const resJson = await this.doFetch(apiUrl, fetchOps)
    this.logger.debug("resJson=>", JSON.stringify(resJson))
    // this.logger.debug("resJson", resJson)

    if (resJson.success) {
      const rtnArray = []
      if (resJson.result && resJson.result.length > 0) {
        resJson.result.forEach((img) => {
          const rtnItem = {
            fileName: img.substring(img.lastIndexOf("/") + 1),
            imgUrl: img,
          }
          rtnArray.push(rtnItem)
        })
      }

      ret = JSON.stringify(rtnArray)
    } else {
      throw new Error("调用HTTP上传到PicGO失败，请检查配置=>" + resJson.message)
    }

    return Promise.resolve(ret)
  }
}
