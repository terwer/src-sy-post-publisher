pwd
rm -rf ./dist
pnpm run generate
# 删除siyuan挂件专属文件
rm ./dist/widget.json

# 火狐配置
mv ./dist/mv2/manifest-v2-for-firefox.json ./dist/manifest.json
mv ./dist/mv2/background-v2-for-firefox.js ./dist/background.js
rm -rf ./dist/mv2

rm -rf ./extension/firefox/*
mkdir -p extension/firefox
cp -r ./dist/* ./extension/firefox
echo "Firefox V2插件发布完毕."