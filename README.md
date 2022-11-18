# sy-post-publisher

将思源笔记的文章发布到支持的开放平台的**思源笔记挂件**

目前支持 `Vuepress` 、 以及 2 种博客平台标准、`metaweblog api` 和基于 `Wordpress` 的 `xmlrpc` 远程调用 api

同时提供了一个 [统一通用的API适配器](https://github.com/terwer/src-sy-post-publisher/blob/main/src/lib/api.ts)
，让适配任何平台成为可能。

![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/project/sy-post-publisher/preview.png)

![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/project/sy-post-publisher/preview-light.png)

[点击查看帮助文档](https://mp.terwer.space/post/readme-1j4ltp.html)

[点击查看配置视频教程](https://mp.terwer.space/post/configure-entry-video-brpm9.html)

## 最近更新

[历史更新日志](Changelog.md)

## 支持平台

* [X] Vuepress
* [X] 博客园
* [X] 链滴社区
* [X] 语雀
* [X] Wordpress
* [X] Metaweblog API

## 推荐开发工具

* [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
* [WebStorm](https://www.jetbrains.com/webstorm/)

## 依赖版本

| 工具     | 版本       |
|--------|----------|
| node   | v16.16.0 |
| pnpm   | 7.16.1   |
| vercel | 28.0.1   |
| pm2    | 5.2.0    |

## 环境变量

**设置环境变量**

复制 `.env.example` 文件到 `.env` (会被 git 忽略):

```bash
cp .env.example .env
```

打开 `.env` 并且设置 NUXT_SIYUAN_API_URL 。例如：http://127.0.0.1:6806。

你的 `.env` 文件大概像下面这样：

```properties
# 日志基级别，info | warn | error，建议生产环境设置为info
NUXT_LOG_LEVEL=info
# 思源笔记授权api
NUXT_SIYUAN_API_URL=http://127.0.0.1:6806
# 思源笔记授权token
NUXT_SIYUAN_CONFIG_TOKEN=
# 非挂件模式需要中间服务器实现跨域，生产环境可不设置，使用本项目
# NUXT_MIDDLEWARE_URL=https://publish.terwer.space/api/middleware
NUXT_MIDDLEWARE_URL=/api/middleware
```

[Nuxt3环境变量配置](https://nuxt.com/docs/api/composables/use-runtime-config)

## 开发

安装依赖:

```bash
pnpm install --shamefully-hoist
```

如果在 `.npmrc` 文件设置`--shamefully-hoist=true` , 可以简单使用下面的命令安装依赖：

```bash
pnpm install
```

## 开发阶段运行

```bash
pnpm run dev
```

浏览器入口链接是 http://localhost:3000

## 构建

打包到生产环境:

```bash
pnpm run build
```

打包成静态部署

```bash
pnpm run generate
```

本地预览:

```bash
pnpm run preview
```

## 部署

从 `0.0.3+` 版本开始，思源笔记发布辅助工具提供 3 种部署方式。

### 方式 1、部署到思源笔记挂件

```bash
pnpm run wighet
```

压缩 `dist` 文件夹为 `.zip`, 上架思源笔记挂件集市。

### 方式 2、部署到 Google Chrome 浏览器插件

```bash
pnpm run extension
```

将密钥文件更名为 `key.pem` 复制到压缩 `extension/chrome`， 将`extension/chrome` 文件夹打包为 `zip`, 上架 Google Chrome
应用商店。

### 方式 3、部署到服务器后台服务

准备

```bash
pnpm install -g vercel
pnpm install -g pm2
```

启动

```bash
pm2 start pm2.json
```

停止

```bash
pm2 stop pm2.json
```

查看

```bash
pm2 ls
```

其他配置请参阅 [Nuxt3 开发文档](https://nuxt.com/docs/getting-started/deployment) 了解更多信息。
