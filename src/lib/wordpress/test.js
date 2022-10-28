// See doc
// https://codex.wordpress.org/XML-RPC_WordPress_API
// https://developer.wordpress.org/apis/handbook/xml-rpc/

// See also
// https://codex.wordpress.org/WordPress_APIs

import {
    PUBLISH_API_URL_KEY_CONSTANTS,
    PUBLISH_HOME_KEY_CONSTANTS, PUBLISH_PASSWORD_KEY_CONSTANTS,
    PUBLISH_TYPE_CONSTANTS, PUBLISH_USERNAME_KEY_CONSTANTS
} from "../publish/publishUtil";
import wordpressApiClient from "./wordpress-api-client";
import {getConf, setConf} from "../config";

async function main() {
    const conf = getConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS)
    console.log("wordpress conf=>", conf)
    if (!conf) {
        await setConf(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS,
            {
                [PUBLISH_HOME_KEY_CONSTANTS.WORDPRESS_HOME_KEY]: "http://localhost:8000",
                [PUBLISH_API_URL_KEY_CONSTANTS.WORDPRESS_API_URL_KEY]: "http://localhost:8000/xmlrpc.php",
                [PUBLISH_USERNAME_KEY_CONSTANTS.WORDPRESS_USERNAME_KEY]: "test",
                [PUBLISH_PASSWORD_KEY_CONSTANTS.WORDPRESS_PASSWORD_KEY]: "123456"
            }
        )
    }

    const wordpressApi = wordpressApiClient(PUBLISH_TYPE_CONSTANTS.API_TYPE_WORDPRESS);
    const result2 = wordpressApi.getPosts(10);
    result2.then(function (resolve, reject) {
        if (reject) {
            console.log("wordpress getPosts error=>", reject);
            return;
        }
        console.log("wordpress getPosts=>", resolve);
    });
}

main()