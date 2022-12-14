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

import { describe, expect } from "vitest"
import pageUtil from "~/utils/pageUtil"
import index from "~/pages/index/App.vue"
import { shallowMount } from "@vue/test-utils"
import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger()

describe("pageUtil test", () => {
  it("createPage test", async () => {
    // 创建统一的Vue实例
    const app = pageUtil.createPage(index)
    expect(app).toBeTruthy()

    // 挂载Vue
    // const wrapper = await mount(index, {})
    const wrapper = await shallowMount(index, {})
    const result = wrapper.html()
    logger.info("首页HTML=>", result)
    expect(result).toContain("app-layout")
  })
})
