<template>
  <el-container>
    <el-aside width="45%">
      <el-form label-width="120px">
        <el-form-item :label="$t('main.slug')">
          <el-input v-model="formData.customSlug"/>
        </el-form-item>

        <el-form-item>
          <el-checkbox-group v-model="formData.checkList">
            <el-checkbox label="1">{{ $t('main.use.google.translate') }}</el-checkbox>
          </el-checkbox-group>
          <el-button type="primary" @click="makeSlug">{{ $t('main.auto.fetch.slug') }}</el-button>
        </el-form-item>

        <el-form-item :label="$t('main.desc')">
          <el-input type="textarea" v-model="formData.desc"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="makeDesc">{{ $t('main.auto.fetch.desc') }}</el-button>
        </el-form-item>

        <el-form-item :label="$t('main.create.time')">
          <el-date-picker
              type="datetime"
              v-model="formData.created"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="createTimeChanged"
              :placeholder="$t('main.create.time.placeholder')"
          />
        </el-form-item>

        <el-form-item :label="$t('main.tag')">
          <el-tag
              v-for="tag in formData.tag.dynamicTags"
              :key="tag"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="tagHandleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
              v-if="formData.tag.inputVisible"
              ref="tagRefInput"
              v-model="formData.tag.inputValue"
              class="ml-1 w-20"
              size="small"
              @keyup.enter="tagHandleInputConfirm"
              @blur="tagHandleInputConfirm"
          />
          <el-button v-else class="button-new-tag ml-1 el-tag" size="small" @click="tagShowInput">
            {{ $t('main.tag.new') }}
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fetchTag">{{ $t('main.auto.fetch.tag') }}</el-button>
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
          <el-input v-model="vuepressData.vuepressFullContent" :autosize="{ minRows: 12, maxRows: 15 }"
                    v-on:focus="$event.target.select()" ref="fmtRefInput"
                    type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="convertAttrToYAML">{{ $t('main.siyuan.to.yaml') }}</el-button>
          <el-button type="primary" @click="convertYAMLToAttr">{{ $t('main.yaml.to.siyuan') }}</el-button>
          <el-button type="primary" @click="copyToClipboard">{{ $t('main.copy') }}</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>

import {
  covertStringToDate, cutWords,
  formatIsoToZhDate, formatNumToZhDate, getPublishStatus,
  getSiyuanPageId, jiebaToHotWords,
  obj2yaml,
  yaml2Obj,
  zhSlugify
} from "@/lib/util";
import {exportMdContent, getBlockAttrs, setBlockAttrs} from "@/lib/siYuanApi";
import {PUBLISH_POSTID_KEY_CONSTANTS, PUBLISH_TYPE_CONSTANTS} from "@/lib/publish/publishUtil";
import {slugify} from 'transliteration';
import {getPage} from "@/lib/siyuanUtil";
import {mdToHtml, parseHtml, removeWidgetTag} from "@/lib/htmlUtil";
import {CONSTANTS} from "@/lib/constants";
import copy from 'copy-to-clipboard';

export default {
  name: "VuepressMain",
  data() {
    return {
      isPublished: false,
      formData: {
        title: "",
        customSlug: "",
        desc: "",
        created: new Date(),
        checkList: [],
        tag: {
          inputValue: "",
          dynamicTags: [],
          inputVisible: false
        },
        categories: ["默认分类"]
      },
      siyuanData: {
        pageId: "",
        meta: {}
      },
      vuepressData: {
        yamlObj: {
          title: "",
          date: new Date(),
          permalink: "/post/convert-npm-dependencies-to-local.html",
          meta: [
            {
              name: "keywords",
              content: ""
            },
            {
              name: "description",
              content: ""
            }
          ],
          categories: [],
          tags: [],
          author: {
            name: "terwer",
            link: "https://github.com/terwer"
          }
        },
        formatter: "",
        vuepressContent: "",
        vuepressFullContent: ""
      }
    }
  },
  async created() {
    await this.initPage();
  },
  async mounted() {
  },
  methods: {
    async initPage() {
      const pageId = await getSiyuanPageId(false);
      if (!pageId || pageId === "") {
        return
      }
      const page = await getPage(pageId)
      console.log("VuepressMain获取主文档", page)

      // 思源笔记数据
      this.siyuanData.pageId = pageId;
      this.siyuanData.meta = await getBlockAttrs(pageId)

      // 表单数据
      this.formData.title = page.content;
      this.formData.customSlug = this.siyuanData.meta["custom-slug"];
      this.formData.desc = this.siyuanData.meta["custom-desc"];
      this.formData.tag.dynamicTags = [];
      const tagstr = this.siyuanData.meta.tags || ""
      const tgarr = tagstr.split(",")
      for (let i = 0; i < tgarr.length; i++) {
        this.formData.tag.dynamicTags.push(tgarr[i])
      }
      this.formData.created = formatNumToZhDate(page.created)
      console.log("VuepressMain初始化页面,meta=>", this.siyuanData.meta);

      // 表单属性转换为HTML
      this.convertAttrToYAML()

      // 发布状态
      this.isPublished = getPublishStatus(PUBLISH_TYPE_CONSTANTS.API_TYPE_VUEPRESS, this.siyuanData.meta)
    },
    async makeSlug() {
      // 获取最新属性
      this.siyuanData.meta = await getBlockAttrs(this.siyuanData.pageId)
      // 获取标题
      const title = this.siyuanData.meta.title;
      if (this.formData.checkList.length > 0) {
        // 调用Google翻译API
        const result = await zhSlugify(title);
        console.log("result=>", result)
        if (result) {
          this.formData.customSlug = result
        } else {
          alert(this.$t('main.opt.failure'))
        }
      } else {
        this.formData.customSlug = slugify(title);
      }
    },
    async makeDesc() {
      const data = await exportMdContent(this.siyuanData.pageId);

      const md = data.content
      let html = mdToHtml(md)
      // this.formData.desc = html;
      this.formData.desc = parseHtml(html, CONSTANTS.MAX_PREVIEW_LENGTH, true)
    },
    createTimeChanged(val) {
      console.log("createTimeChanged=>", val)
    },
    tagHandleClose(tag) {
      this.formData.tag.dynamicTags.splice(this.formData.tag.dynamicTags.indexOf(tag), 1)
    },
    tagShowInput() {
      this.formData.tag.inputVisible = true
      this.$nextTick(function () {
        this.$refs.tagRefInput.focus()
      })
    },
    tagHandleInputConfirm() {
      if (this.formData.tag.inputValue) {
        this.formData.tag.dynamicTags.push(this.formData.tag.inputValue)
      }
      this.formData.tag.inputVisible = false
      this.formData.tag.inputValue = ''
    },
    async fetchTag() {
      const data = await exportMdContent(this.siyuanData.pageId);

      const md = data.content
      const genTags = await cutWords(md)
      console.log("genTags=>", genTags)

      const hotTags = jiebaToHotWords(genTags, 5)
      console.log("hotTags=>", hotTags)

      // 如果标签不存在，保存新标签到表单
      for (let i = 0; i < hotTags.length; i++) {
        if (!this.formData.tag.dynamicTags.includes(hotTags[i])) {
          this.formData.tag.dynamicTags.push(hotTags[i])
        }
      }
    },
    async saveAttrToSiyuan() {
      const customAttr = {
        "custom-slug": this.formData.customSlug,
        [PUBLISH_POSTID_KEY_CONSTANTS.VUEPRESS_POSTID_KEY]: this.formData.customSlug,
        "custom-desc": this.formData.desc,
        tags: this.formData.tag.dynamicTags.join(",")
      };
      await setBlockAttrs(this.siyuanData.pageId, customAttr)
      console.log("VuepressMain保存属性到思源笔记,meta=>", customAttr);

      // 刷新属性数据
      await this.initPage();

      alert(this.$t('main.opt.success'))
    },
    convertAttrToYAML() {
      console.log("convertAttrToYAML")
      // 表单属性转yamlObj
      console.log("convertAttrToYAML,formData=>", this.formData)
      this.vuepressData.yamlObj.title = this.formData.title;
      this.vuepressData.yamlObj.permalink = "/post/" + this.formData.customSlug + ".html";
      this.vuepressData.yamlObj.date = covertStringToDate(this.formData.created)
      const meta = [
        {
          name: "keywords",
          content: this.formData.tag.dynamicTags.join(" ")
        },
        {
          name: "description",
          content: this.formData.desc
        }
      ];
      this.vuepressData.yamlObj.meta = meta;
      this.vuepressData.yamlObj.tags = this.formData.tag.dynamicTags;
      this.vuepressData.yamlObj.categories = this.formData.categories;

      // formatter
      let yaml = obj2yaml(this.vuepressData.yamlObj);
      // 修复yaml的ISO日期格式（js-yaml转换的才需要）
      yaml = formatIsoToZhDate(yaml, true)
      this.vuepressData.formatter = yaml
      this.vuepressData.vuepressFullContent = this.vuepressData.formatter;
    },
    async convertYAMLToAttr() {
      console.log("convertYAMLToAttr")
      this.vuepressData.formatter = this.vuepressData.vuepressFullContent
      this.vuepressData.yamlObj = yaml2Obj(this.vuepressData.formatter)

      // yamlObj转表单属性
      console.log("convertYAMLToAttr,yamlObj=>", this.vuepressData.yamlObj)
      this.formData.title = this.vuepressData.yamlObj.title
      this.formData.customSlug = this.vuepressData.yamlObj.permalink.replace("/pages/", "")
          .replace("/post/", "").replace(".html", "")
          .replace("/", "")
      this.formData.created = formatIsoToZhDate(this.vuepressData.yamlObj.date.toISOString(), false)

      const yamlMeta = this.vuepressData.yamlObj.meta
      for (let i = 0; i < yamlMeta.length; i++) {
        const m = yamlMeta[i]
        if (m.name === "description") {
          this.formData.desc = m.content
          break
        }
      }

      for (let j = 0; j < this.vuepressData.yamlObj.tags.length; j++) {
        const tag = this.vuepressData.yamlObj.tags[j]
        if (!this.formData.tag.dynamicTags.includes(tag)) {
          this.formData.tag.dynamicTags.push(tag)
        }
      }

      this.formData.categories = this.vuepressData.yamlObj.categories
    },
    copyToClipboard() {
      this.$refs.fmtRefInput.focus();
      // document.execCommand('copy');
      copy(this.vuepressData.vuepressFullContent)

      alert(this.$t('main.opt.success'))
    },
    async publishPage() {
      const data = await exportMdContent(this.siyuanData.pageId);
      const md = removeWidgetTag(data.content)

      this.vuepressData.vuepressContent = md;
      this.vuepressData.vuepressFullContent = this.vuepressData.formatter + "\n" + this.vuepressData.vuepressContent;

      alert(this.$t('main.opt.success'))
    }
  }
}
</script>

<style scoped>
</style>