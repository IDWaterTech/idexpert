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
進入資料夾：/var/web/site/frontend/  
上傳dist.tar
原資料夾改名：mv dist dist20250210
解壓：tar xvf dist.tar

重啟：docker restart webnginx
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
