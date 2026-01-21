# idwater

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
# 開發測試(使用 .env)
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
# build 正式站(使用 .env.production)
$ npm run generate

### build 測試站(使用.env.test)
$ npm run generate:test  
```
★遠端-進入遠端資料夾：`cd /var/web/site/frontend/`

遠端-刪除dist.tar：`rm dist.tar`

本機-壓縮tar：`7z a -ttar dist.tar dist`

本機-上傳dist.tar(mobaXterm上傳)

★遠端-原資料夾改名+日期時間(例：dist20250101)：`mv dist dist2026`  

★遠端-解壓+重啟：`tar xvf dist.tar && docker restart webnginx`  
>★遠端-解壓：`tar xvf dist.tar`  
>★遠端-重啟：`docker restart webnginx`  

本機-刪除tar：`Remove-Item dist.tar`