import {getApiParams} from "../publish/publishUtil";
const MetaWeblog = require("metaweblog-api");

const metaweblogApiClient = (type) => {
    const apiParams = getApiParams(type);
    const metaWeblog = new MetaWeblog(apiParams.apiUrl);

    /**
     * getRecentPosts
     * https://codex.wordpress.org/XML-RPC_MetaWeblog_API#metaWeblog.getRecentPosts
     *
     * @returns {Promise<MetaWeblog.Post[]>}
     */
    async function getRecentPosts(numberOfPosts) {
        const data = await metaWeblog.getRecentPosts(apiParams.appKey, apiParams.username, apiParams.password, numberOfPosts);
        return data;
    }

    return {
        getRecentPosts
    };
};

export default metaweblogApiClient;