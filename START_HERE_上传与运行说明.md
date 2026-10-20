# 拾知小镇：源码与上传说明

本包包含当前工作目录的最新代码（含尚未提交的修改）、全部场景素材、考试练习题库、测试和迭代文档。

## 本地运行

这是纯 HTML/CSS/JavaScript 项目，无需安装依赖或构建。
在解压目录运行 `python -m http.server 8000`，浏览器打开 http://localhost:8000/dist/ 。
也可尝试直接打开 dist/index.html；推荐通过本地服务运行。

## 手动上传 GitHub

1. 先解压本压缩包。
2. 打开 Abigale365/Knowledge_town 仓库，选择 Add file → Upload files。
3. 把解压后的内容（dist、tests、research、README.md 等）拖入上传区域，保留文件夹结构。不要只上传 ZIP。
4. 填写提交说明并点击 Commit changes。文件较多可分批上传。

本包 README.md 保留历次开发说明，最新考试版本见 research/v09_考试内容与画面迭代.md。
练习题为原创学习练习，不是官方考试真题。进度保存在各自浏览器，源码包不含个人浏览器存档。

## 开发与托管

入口 dist/index.html；静态托管根目录设为 dist。
使用 GitHub Pages 时，可将 dist 内容另行部署至 Pages 分支根目录，或配置 Actions 发布 dist。
源码放进仓库并不自动生成试玩网站。
