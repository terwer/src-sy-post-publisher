pwd
pnpm run build-siyuan
# 删除Chrome插件专属文件
rm ./dist/background.js
rm ./dist/manifest.json
# 删除Firefox的专属文件
rm -rf ./dist/mv2

rm -rf ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
mkdir ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher
cp -r ./dist/* ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
echo "发布完毕."