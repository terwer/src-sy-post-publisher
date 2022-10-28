yarn build

rm -rf ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
mkdir ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher
cp -r ./dist/* ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
echo "发布完毕."