/*
 * Copyright (c) 2022, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { defineConfig, loadEnv, normalizePath } from "vite"
import vue from "@vitejs/plugin-vue"
import path, { dirname, resolve } from "path"
import vueI18n from "@intlify/vite-plugin-vue-i18n"
import { createMpaPlugin } from "vite-plugin-virtual-mpa"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { fileURLToPath } from "url"
import vitePluginRequireTransform from "vite-plugin-require-transform"
import rollupNodePolyFill from "rollup-plugin-node-polyfills"
import NodeModulesPolyfillPlugin from "@esbuild-plugins/node-modules-polyfill"
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill"

const isTest = process.env.TEST === "true"
console.log("isTest=>", isTest)

const isProd = process.env.NODE_ENV === "production"
console.log("isProd=>", isProd)

const isSiyuanBuild = process.env.BUILD_TYPE === "siyuan"
console.log("isSiyuanBuild=>", isSiyuanBuild)

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd())
  const processEnvValues = {
    "process.env": Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      }
    }, {}),
  }

  const logInfoEnabled = env.VITE_LOG_INFO_ENABLED
  console.log("logInfoEnabled=>", logInfoEnabled)

  return {
    plugins: [
      vue(),
      // https://blog.csdn.net/pzy_666/article/details/123017630
      // PkgConfig(),
      // OptimizationPersist(),
      // https://github.com/emosheeep/vite-plugin-virtual-mpa
      createMpaPlugin({
        pages: [
          {
            name: "index",
            /**
             * filename is optional, default is `${name}.html`, which is the relative path of `build.outDir`.
             * output into index.html at build time.
             */
            filename: "index.html",
            entry: "/pages/index/main.ts",
            data: {
              title: "??????",
            },
          },
          {
            name: "blog",
            filename: "blog/index.html",
            entry: "/pages/blog/main.ts",
            data: {
              title: "??????????????????",
            },
          },
          {
            name: "detail",
            filename: "detail/index.html",
            entry: "/pages/detail/main.ts",
            data: {
              title: "??????????????????",
            },
          },
          {
            name: "publish",
            filename: "publish/index.html",
            entry: "/pages/publish/main.ts",
            data: {
              title: "?????????????????????",
            },
          },
          {
            name: "anki",
            filename: "anki/index.html",
            entry: "/pages/anki/main.ts",
            data: {
              title: "Anki????????????",
            },
          },
          {
            name: "picgo",
            filename: "picgo/index.html",
            entry: "/pages/picgo/main.ts",
            data: {
              title: "Picgo??????",
            },
          },
        ],
        /**
         * ??????????????? rewrites ????????? history fallback rewrite rules
         * ??????????????????????????????????????????????????????????????????????????????????????????
         * ????????????????????????????????????????????????????????????????????????????????????
         */
        rewrites: [
          {
            from: new RegExp(normalizePath(`/(blog|publish)`)),
            to: (ctx) => normalizePath(`/${ctx.match[1]}/index.html`),
          },
        ],
      }),
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,
        // you need to set i18n resource including paths !
        include: resolve(
          dirname(fileURLToPath(import.meta.url)),
          "locales/index.ts"
        ),
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass",
          }),
        ],
      }),
      // https://github.com/WarrenJones/vite-plugin-require-transform/issues/10
      vitePluginRequireTransform({}),
    ],
    // ???????????????
    root: "./",
    // ???????????????????????????
    base: isSiyuanBuild ? "/widgets/sy-post-publisher/" : "/",
    // ???????????????????????????
    publicDir: "public",
    // https://github.com/vitejs/vite/issues/1930
    // https://vitejs.dev/guide/env-and-mode.html#env-files
    // ????????????????????????
    define: Object.assign(processEnvValues, {}),
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./"),
        "node-fetch": "cross-fetch",
        // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
        // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
        // process and buffer are excluded because already managed
        // by node-globals-polyfill
        util: "rollup-plugin-node-polyfills/polyfills/util",
        sys: "util",
        events: "rollup-plugin-node-polyfills/polyfills/events",
        stream: "rollup-plugin-node-polyfills/polyfills/stream",
        path: "rollup-plugin-node-polyfills/polyfills/path",
        querystring: "rollup-plugin-node-polyfills/polyfills/qs",
        punycode: "rollup-plugin-node-polyfills/polyfills/punycode",
        url: "rollup-plugin-node-polyfills/polyfills/url",
        string_decoder: "rollup-plugin-node-polyfills/polyfills/string-decoder",
        http: "rollup-plugin-node-polyfills/polyfills/http",
        https: "rollup-plugin-node-polyfills/polyfills/http",
        os: "rollup-plugin-node-polyfills/polyfills/os",
        assert: "rollup-plugin-node-polyfills/polyfills/assert",
        constants: "rollup-plugin-node-polyfills/polyfills/constants",
        _stream_duplex:
          "rollup-plugin-node-polyfills/polyfills/readable-stream/duplex",
        _stream_passthrough:
          "rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough",
        _stream_readable:
          "rollup-plugin-node-polyfills/polyfills/readable-stream/readable",
        _stream_writable:
          "rollup-plugin-node-polyfills/polyfills/readable-stream/writable",
        _stream_transform:
          "rollup-plugin-node-polyfills/polyfills/readable-stream/transform",
        timers: "rollup-plugin-node-polyfills/polyfills/timers",
        console: "rollup-plugin-node-polyfills/polyfills/console",
        vm: "rollup-plugin-node-polyfills/polyfills/vm",
        zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
        tty: "rollup-plugin-node-polyfills/polyfills/tty",
        domain: "rollup-plugin-node-polyfills/polyfills/domain",
        buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
        process: "rollup-plugin-node-polyfills/polyfills/process-es6",
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    build: {
      // ?????????????????? ???esnext??? | 'modules'
      target: "modules",
      // ????????????
      outDir: "./dist",
      // ?????????????????????????????????
      assetsDir: "./assets",
      // ??????????????????????????????????????????????????? base64 ????????? ??????????????????http????????? ????????? 0, ???????????????????????????
      assetsInlineLimit: 4096,
      // ?????? / ?????? CSS ????????????
      cssCodeSplit: true,
      // ????????????????????? source map ??????
      sourcemap: false,

      // ????????? false ???????????????????????????
      // ??????????????????????????????????????????
      // boolean | 'terser' | 'esbuild'
      // minify: 'terser',
      // ????????????????????????
      // minify: isProd,
      minify: false,

      rollupOptions: {
        external: [
          "stat",
          "readFile",
          "fs",
          "@electron/remote",
          "/lib/siyuanhook.js",
        ],
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              let arr = id.toString().split("node_modules/")[1].split("/")
              // pnpm????????????
              if (id.includes(".pnpm")) {
                arr = id.toString().split(".pnpm/")[1].split("/")
              }
              const dep = arr[0].split("@")[0].replace(/\./g, "-")
              // console.log("id=>", id)
              // console.log("dep=>", dep)
              if (dep !== "") {
                return "vendor_" + dep
              }
              return "vendor"
            }
          },
        },
        plugins: [
          // Enable rollup polyfills plugin, used during production bundling
          rollupNodePolyFill(),
        ],
      },
    },
    test: {
      globals: true,
      environment: "node",
      // environment: "happy-dom",
      setupFiles: ["./test/setup.ts"],
      deps: {
        // inline: ["element-plus"],
      },
    },
  }
})
