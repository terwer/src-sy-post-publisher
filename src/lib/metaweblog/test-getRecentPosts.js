import metaweblogApiClient from "./metaweblog-api-client";
import {PUBLISH_TYPE_CONSTANTS} from "../publish/publishUtil";

const metaWeblogApi = metaweblogApiClient(PUBLISH_TYPE_CONSTANTS.API_TYPE_CNBLPGS);

export function testGetRecentPostsWithExampleData() {
    const result = metaWeblogApi.getRecentPosts(10);

    result.then(function (posts) {
        console.log("metaweblog get recent posts=>", posts);
    });
}