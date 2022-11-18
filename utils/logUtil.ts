export const LOG_CONSTANTS = {
    INFO: "info",
    WARN: "warn",
    ERROR: "error"
}

class LogFactory {
    private readonly loglevel: String;

    constructor(loglevel: String) {
        this.loglevel = loglevel;
    }

    /**
     * 信息日志
     * @param msg 信息
     * @param param 参数
     */
    public logInfo = (msg: any, param?: any) => {
        const LOG_INFO_ENABLED = this.loglevel == LOG_CONSTANTS.INFO
        if (LOG_INFO_ENABLED) {
            if (param) {
                console.log(msg, param)
            } else {
                console.log(msg)
            }
        }
    }
    /**
     * 警告日志
     * @param msg 警告信息
     * @param param 参数
     */
    public logWarn = (msg: any, param?: any) => {
        const LOG_WARN_ENABLED = (this.loglevel == LOG_CONSTANTS.INFO || this.loglevel == LOG_CONSTANTS.WARN)
        if (LOG_WARN_ENABLED) {
            if (param) {
                console.warn(msg, param)
            } else {
                console.warn(msg)
            }
        }
    }
    /**
     * 错误日志
     * @param msg 错误信息
     * @param param 参数
     */

    public logError = (msg: any, param?: any) => {
        const LOG_ERROR_ENABLED = (this.loglevel == LOG_CONSTANTS.INFO || this.loglevel == LOG_CONSTANTS.WARN || this.loglevel == LOG_CONSTANTS.ERROR)
        if (LOG_ERROR_ENABLED) {
            if (param) {
                console.error(msg, param)
            } else {
                console.error(msg)
            }
        }
    }
}


/**
 * 日志记录
 */
const logUtil = (loglevel: String): LogFactory => {
    return new LogFactory(loglevel)
}

/**
 * info日志记录（忽视配置，强制打印info日志，不建议）
 */
// const logInfoUtil = (): LogFactory => {
//     return logUtil(LOG_CONSTANTS.INFO)
// }

export default logUtil