pwd
rm -rf ./dist
pnpm run generate

# 删除siyuan挂件专属文件
rm ./dist/widget.json
# 删除火狐配置
rm -rf ./dist/mv2

rm -rf ./extension/chrome/*
mkdir -p extension/chrome
cp -r ./dist/* ./extension/chrome
echo "Chrome插件发布完毕."