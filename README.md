# idwater

### 開發框架
- Vue 2(Nuxt.js)
- NodeJS開發版本(18.20.7)
### 使用者介面
- Vuetify.js：主要 UI 使用
- Element UI：部分 UI 使用

### 頁面功能路徑
| 功能名稱 | 前端路徑 | API/元件 |
|---|---|---|
| 首頁 | / | /api/user-access/authorization-items/、/pond-state、/ponds-data |
| 知識庫 | /kb | /api/suggestion/、/last-sampling-data、/breeding-configs |
| 操作面板 | /dashboard | v3/pond-dashboard |
| 歷史資料 | /historical-data | IndicatorEdit.vue、Calendar.vue、OberverV2.vue、bacteriaV2.vue、Report.vue |
| 近況更新 | /franchisee/recent | /client/recent-data |
| 歷史數據 | /franchisee/history | /client/historical-total-data、/client/historical-daily-data、/client/historical-fields |
| 養殖設定 | /set/breeding | seedlings.vue、feedTempSetting2.vue、species.vue、feedTable.vue |
| 帳號管理 | set/account | /user-access/account、/user-access/organization、/architecture、/user-access/personal-settings |
| 授權管理 | set/authorization | /user-access/role、/user-access/authorization-items、/user-access/role |
| 監測管理 | set/monitor | /data-col、/data-col-group、/col-data |
| 場域設定 | /set/factory | /user-access/account、/architecture、/pond-state、/map、/factory、/pond-area |
| 飼料設定 | set/feed | /manufacturer、/feed-category-and-items、/feed-ingredient-category、/feed-settings、/feed-ingredient、/parameter |
| 養殖循環 | /set/breeding-record | /breeding/v3/record2、/breeding/record-template2、/breeding/seedling、/manufacturer、/breeding/water-quality-record2、/reports/feed-report、/breeding/harvest-record2、/breeding/disease-testing-record、/breeding/water-quality-testing-record、/event、/breeding/template2、/pond-state、/breeding/species、/breeding/disease-testing-method、/breeding/disease、/user-access/authorization-items、/ponds-data |

### Plugin / 套件
| 套件 | 用途 |
| --- | --- |
| @easydarwin/easywasmplayer | EasyWasmPlayer WebAssembly 播放器，用於影音串流播放 |
| @nuxtjs/auth-next | Nuxt.js 使用者登入與驗證功能 |
| @nuxtjs/axios | Nuxt.js Axios HTTP 請求模組，用於 API 串接 |
| @nuxtjs/proxy | Nuxt.js Proxy 代理設定，用於 API 請求轉發 |
| @nuxtjs/recaptcha | Nuxt.js Google reCAPTCHA 驗證功能 |
| @nuxtjs/toast | Nuxt.js Toast 訊息提示功能 |
| @riophae/vue-treeselect | Vue 樹狀下拉選單元件 |
| ant-design-vue | Vue UI 元件庫，提供部分表單、按鈕、表格等元件 |
| chart.js | JavaScript 圖表繪製套件 |
| core-js | JavaScript 標準函式庫 Polyfill，提供瀏覽器相容性支援 |
| countup.js | 數字動畫效果，用於數值遞增呈現 |
| dayjs | 日期與時間計算 |
| docxtemplater | Word 文件範本產生與資料套用 |
| dplayer | Web 影音播放器 |
| echarts | 資料視覺化與圖表呈現 |
| echarts-liquidfill | ECharts 水球圖（Liquid Fill）元件 |
| element-ui | Vue UI 元件庫，提供表單、表格、對話框等元件 |
| file-saver | 瀏覽器檔案下載與儲存功能 |
| hls.js | HLS（HTTP Live Streaming）影音串流播放 |
| js-cookie | JavaScript Cookie 建立、讀取與管理 |
| jszip-utils | JSZip 輔助工具，用於 ZIP 檔案處理 |
| lodash | 物件複製及資料處理 |
| math-expression-evaluator | 數學運算式解析與計算 |
| md5 | MD5 雜湊值產生 |
| nerdamer | 套用公式進行數學計算與符號運算 |
| nuxt | Vue.js Nuxt.js 框架，用於建立前端應用程式 |
| photoswipe | 圖片燈箱與圖片瀏覽功能 |
| pizzip | ZIP 壓縮檔處理，常搭配 docxtemplater 使用 |
| v-charts | 使用於折線圖等圖表呈現 |
| v-charts-v2 | Vue 圖表元件，用於資料視覺化呈現 |
| v-img | Vue 圖片顯示元件 |
| vue-chartjs | Vue 與 Chart.js 整合，用於圖表呈現 |
| vue-cli-plugin-pug | Vue CLI 的 Pug 模板支援 |
| vue-countup-v2 | Vue 整合 CountUp.js，用於數字動畫呈現 |
| vue-json-excel | Vue JSON 資料匯出 Excel 功能 |
| xlsx | Excel 檔案讀取、寫入與資料匯出 |

## 建置設定
```bash
# 開發中測試
$ npm run dev

# build 正式站(使用 .env.production)
$ npm run generate

# build 測試站(使用.env.test)
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