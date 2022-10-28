import {testGetRecentPostsWithExampleData} from "./test-getRecentPosts";
import {getConf, setConf} from "../../lib/config";
import {
    // getApiParams,
    PUBLISH_API_URL_KEY_CONSTANTS,
    PUBLISH_HOME_KEY_CONSTANTS, PUBLISH_PASSWORD_KEY_CONSTANTS,
    PUBLISH_TYPE_CONSTANTS, PUBLISH_USERNAME_KEY_CONSTANTS
} from "../../lib/publish/publishUtil";

// 模拟设置属性
async function main() {
    const conf = getConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_CNBLPGS)
    console.log("cnblogs conf=>", conf)
    if (!conf) {
        await setConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_CNBLPGS,
            {
                [PUBLISH_HOME_KEY_CONSTANTS.CNBLOGS_HOME_KEY]: "https://cnblogs.com/tangyouwei",
                [PUBLISH_API_URL_KEY_CONSTANTS.CNBLOGS_API_URL_KEY]: "https://rpc.cnblogs.com/metaweblog/tangyouwei",
                [PUBLISH_USERNAME_KEY_CONSTANTS.CNBLOGS_USERNAME_KEY]: "test",
                [PUBLISH_PASSWORD_KEY_CONSTANTS.CNBLOGS_PASSWORD_KEY]: "123456"
            }
        )
    }

    // const apiParams = getApiParams(PUBLISH_TYPE_CONSTANTS.API_TYPE_CNBLPGS);
    // console.log("test apiParams=>", apiParams)

    // 开始测试
    testGetRecentPostsWithExampleData();
}

main()