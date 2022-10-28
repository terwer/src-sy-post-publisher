pwd
yarn build

Remove-Item ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher -Recurse -Force -Confirm:$false
mkdir ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher
cp -r ./dist/* ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
echo "发布完毕."