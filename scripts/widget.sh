#
# Copyright (c) 2022-2023, Terwer . All rights reserved.
# DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
#
# This code is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 2 only, as
# published by the Free Software Foundation.  Terwer designates this
# particular file as subject to the "Classpath" exception as provided
# by Terwer in the LICENSE file that accompanied this code.
#
# This code is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
# version 2 for more details (a copy is included in the LICENSE file that
# accompanied this code).
#
# You should have received a copy of the GNU General Public License version
# 2 along with this work; if not, write to the Free Software Foundation,
# Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
#
# Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
# or visit www.terwer.space if you need additional information or have any
# questions.
#

pwd
vue-tsc --noEmit && BUILD_TYPE=siyuan vite build
cp ./LICENSE ./dist/
cp ./README.md ./dist/
cp ./policy.md ./dist/
cp ./.gitignore ./dist/

# 删除Chrome插件专属文件
rm ./dist/background.js
rm ./dist/manifest*.json
# 删除Firefox的专属文件
rm -rf ./dist/mv2

# Picgo配置文件
rm ./dist/lib/picgo/picgo.cfg.dev.json
# cp ./dist/lib/picgo/picgo.cfg.json.example ./dist/lib/picgo/picgo.cfg.json

rm -rf ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
mkdir ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher
cp -r ./dist/* ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
echo "发布完毕."
