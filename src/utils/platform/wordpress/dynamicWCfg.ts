import {MetaweblogCfg} from "../metaweblog/MetaweblogCfg";
import {PageType} from "../metaweblog/IMetaweblogCfg";

/**
 * 动态Wordpress配置类
 */
export class DynamicWCfg extends MetaweblogCfg {
    constructor(postidKey: string) {
        super("http://localhost:8000", "http://localhost:8000/xmlrpc.php", "", "");
        this.posidKey = postidKey
        this.previewUrl = "/?p=[postid]"
        this.pageType = PageType.Html
    }
}