<template>
  <el-container>
    <el-aside width="45%">
      <el-form label-width="120px">
        <el-form-item :label="$t('main.slug')">
          <el-input v-model="formData.customSlug"/>
        </el-form-item>

        <el-form-item>
          <el-checkbox :label="$t('main.use.google.translate')" size="large"/> &nbsp;&nbsp;
          <el-button type="primary">{{ $t('main.auto.fetch.slug') }}</el-button>
        </el-form-item>

        <el-form-item :label="$t('main.desc')">
          <el-input type="textarea"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">{{ $t('main.auto.fetch.desc') }}</el-button>
        </el-form-item>

        <el-form-item :label="$t('main.create.time')">
          <el-date-picker
              type="datetime"
              :placeholder="$t('main.create.time.placeholder')"
          />
        </el-form-item>

        <el-form-item :label="$t('main.tag')">
          <el-tag closable>Tag 1</el-tag> &nbsp;&nbsp;
          <el-tag class="ml-2" type="success">Tag 2</el-tag> &nbsp;&nbsp;
          <el-tag class="ml-2" type="info">Tag 3</el-tag> &nbsp;&nbsp;
          <el-tag class="ml-2" type="warning">Tag 4</el-tag> &nbsp;&nbsp;
          <el-tag class="ml-2" type="danger">Tag 5</el-tag>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">{{ $t('main.auto.fetch.tag') }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveAttrToSiyuan">{{ $t('main.save.attr.to.siyuan') }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="publishPage">{{
              isPublished ? $t('main.update') : $t('main.publish')
            }}
          </el-button>
          <el-button>{{ $t('main.cancel') }}</el-button>
          <el-button type="danger" text>
            {{ isPublished ? $t('main.publish.status.published') : $t('main.publish.status.unpublish') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-aside>
    <el-main>
      <el-form label-width="120px">
        <el-form-item>
          {{ $t('main.yaml.formatter') }}
        </el-form-item>
        <el-form-item>
          <el-input :autosize="{ minRows: 12, maxRows: 15 }" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">{{ $t('main.siyuan.to.yaml') }}</el-button>
          <el-button type="primary">{{ $t('main.yaml.to.siyuan') }}</el-button>
          <el-button type="primary">{{ $t('main.copy') }}</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import {getPublishStatus, getSiyuanPageId} from "@/lib/util";
import {getBlockAttrs, setBlockAttrs} from "@/lib/siYuanApi";
import {publishMdContent} from "@/lib/publish/publish";
import {PUBLISH_TYPE_CONSTANTS} from "@/lib/publish/publishUtil";

export default {
  name: "CnblogsMain",
  data() {
    return {
      isPublished: false,
      formData: {
        customSlug: ""
      },
      siyuanData: {
        pageId: "",
        meta: {}
      }
    }
  },
  async created() {
    await this.initPage();
  },
  methods: {
    async initPage() {
      const pageId = await getSiyuanPageId(false);
      if (!pageId || pageId === "") {
        return
      }

      // 思源笔记数据
      this.siyuanData.pageId = pageId;
      this.siyuanData.meta = await getBlockAttrs(pageId)

      // 表单数据
      this.formData.customSlug = this.siyuanData.meta["custom-slug"];

      // 发布状态
      this.isPublished = getPublishStatus(PUBLISH_TYPE_CONSTANTS.API_TYPE_CNBLPGS, this.siyuanData.meta)

      console.log("CnblogsMain初始化页面,meta=>", this.siyuanData.meta);
    },
    async saveAttrToSiyuan() {
      const customAttr = {
        "custom-slug": this.formData.customSlug,
        "custom-vuepress-slug": this.formData.customSlug,
        // [postidKey]: "99999",
      };
      await setBlockAttrs(this.siyuanData.pageId, customAttr)
      console.log("CnblogsMain保存属性到思源笔记,meta=>", customAttr);

      // 刷新属性数据
      await this.initPage();

      alert(this.$t('main.opt.success'))
    },
    async publishPage() {
      await publishMdContent(this.siyuanData.pageId, PUBLISH_TYPE_CONSTANTS.API_TYPE_CNBLPGS, this.siyuanData.meta)
    }
  }
}
</script>

<style scoped>

</style>