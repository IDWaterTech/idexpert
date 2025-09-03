<template>
    <div>
        <v-overlay :value="!isLoading" :absolute="true">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-card class="bg-card">
            <div class="content pt-3">
                <span>
                    <h2>{{ this.$options.head().title }}</h2>
                </span>
                <div class="search mb-3">
                    <v-row class="mb-0">
                        <v-col cols="12" md="3" sm="12" style="position: relative;">
                            <locate-select :dataScope="'pool'" :isMulti="false" @scopeSel_data="get_scopeData($event)"
                                class="select-template"></locate-select>
                        </v-col>
                    </v-row>
                </div>
                <div class="result">
                    <v-row class="mb-0 full-width">
                        <v-col cols="12">
                            <v-card class="result-card pa-6 pb-2">
                                <v-file-input v-model="imgFile" accept="image/png, image/jpeg, image/bmp" show-size
                                    placeholder="選擇圖片(png、jpeg、jpg...)" prepend-icon="mdi-camera"
                                    @change="imgFileChange"
                                    label="選擇圖片"></v-file-input>
                                <img :src="previewImgUrl" alt="Current Image" style="max-width: 200px; max-height: 200px; margin-bottom: 10px; cursor: pointer;"
                                    v-if="previewImgUrl" />
                                缩放率: {{ (Math.round(scale * 100) / 100).toFixed(2) }}
                                <div ref="wrapper" class="left-top">
                                    <canvas ref="canvas" model="canvas" @mousedown="handleMouseDown"
                                        @mouseup="handleMouseUp" @mousemove="handleMouseMove"></canvas>
                                </div>
                                <!-- 工具 -->
                                <div>
                                    <v-btn @click="handleImageSwitch(currentImageIndex - 1)">上一張</v-btn>
                                    <v-btn @click="handleImageSwitch(currentImageIndex + 1)">下一張</v-btn>
                                    <v-btn @click="creating = !creating" :disabled="creating">新增標記</v-btn>
                                    <v-btn @click="handleSaveLabel">儲存標記</v-btn>
                                    <v-btn @click="handleDeleteLabel" :disabled="selectedRectIndex === -1">刪除標記</v-btn>
                                    <v-btn @click="zoom(scale + scaleStep)"
                                        :disabled="this.scale >= this.maxScale">放大</v-btn>
                                    <v-btn @click="zoom(scale - scaleStep)"
                                        :disabled="this.scale <= this.minScale">縮小</v-btn>
                                    <v-btn @click="zoom(adaptiveScale)">還原縮放</v-btn>
                                </div>
                                <!-- 標記對話框 -->
                                <v-dialog v-model="showNameInput" max-width="300px">
                                    <v-card>
                                        <v-card-title>標記命名</v-card-title>
                                        <v-form class="mx-3">
                                            標記名稱:{{ labelName }}
                                            <v-combobox solo v-model="labelName" placeholder="請輸入或選擇標記"
                                                :items="[...uniqueName]" no-data-text="目前無任何標籤" clearable
                                                @keydown.space="(e)=>{e.preventDefault()}">
                                            </v-combobox>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn text @click="handleCancelInput">取消</v-btn>
                                                <v-btn text @click="handleInputLabel">確定</v-btn>
                                            </v-card-actions>
                                        </v-form>
                                    </v-card>
                                </v-dialog>
                                <!-- 清單 -->
                                <div>
                                    {{ rects }}
                                    <hr />
                                    selectedRectIndex:{{ selectedRectIndex }}
                                    <v-list dense>
                                        <v-subheader>標記清單</v-subheader>
                                        <v-list-item-group v-model="selectedRectIndex" color="red">
                                            <v-list-item v-for="(rect, rowIndex) in rects" :key="rowIndex"
                                                :class="rectCellClass(rect, rowIndex)"
                                                @click="rectCellClick(rect, rowIndex)" class="cursor-pointer">
                                                <v-list-item-content>
                                                    <v-list-item-title>
                                                        <span class="mr-5">({{ rowIndex }})</span>{{ rect.name }}
                                                    </v-list-item-title>
                                                </v-list-item-content>


                                                <v-list-item-action class="d-flex align-center">
                                                    <span>時間：{{ formatTimestamp(rect.timestamp) }}<v-btn icon small
                                                            @click.stop="handleDeleteLabel(rect)">
                                                            <v-icon>mdi-delete</v-icon>
                                                        </v-btn></span>

                                                </v-list-item-action>

                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>


                                </div>







                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-card>

        <el-image-viewer v-if="isOriginImg" :on-close="() => { isOriginImg = false }" :url-list="srcList" />
    </div>
</template>

<script>
import "element-ui/lib/theme-chalk/index.css";
import Rect from '@/utils/Rect.js';
export default {
    layout: "emptynologin2",
    middleware: "auth",
    components: {
        "el-image-viewer": () => import("element-ui/packages/image/src/image-viewer"),
    },
    head() {
        return {
            title: 'Canvas'
        };
    },
    data() {
        return {
            poolid: '',
            isLoading: false,
            isOriginImg: false,
            srcList: [],
            nowPool: '',
            canvas: null,
            wrapper: null,
            imgFile: null,
            images: [
                {
                id: 1,
                url: require('../assets/Error-bg.png'),
                },
                {
                id: 2,
                url: require('@/assets/logo.jpg'),
                },
            ],
            image_width: 0,
            image_height: 0,
            /* 状态变量 */
            creating: false,
            canvasChanged: false,
            showNameInput: false,
            showSaveAlert: false,
            /* 缩放相关 */
            dpr: 1,
            scale: 0,
            maxScale: 3.0,
            minScale: 0.1,
            adaptiveScale: 0,
            scaleStep: 0.1,
            /* 鼠标上一刻所在位置 */
            prevX: 0,
            prevY: 0,
            /* 鼠标实时位置 */
            currentX: 0,
            currentY: 0,
            /* 缓存 */
            currentImage: null,
            currentImageIndex: 0,
            targetImageIndex: -1,
            wrapper: null,
            canvas: null,
            bufferCanvas: null,
            currentRect: null,
            selectedRect: null,
            selectedRectIndex: -1,
            labelName: "", // 矩形标签
            rects: [], // 保存当前图片的矩形
        };
    },
    methods: {
        //------------------------------------------------------
        //------------------------------------------------------
        init() {
            // 设置分辨率
            this.dpr = window.devicePixelRatio || 1;
            // 获取画布及其所在容器元素
            this.canvas = this.$refs.canvas;
            this.wrapper = this.$refs.wrapper;
            // 创建离屏画布
            this.bufferCanvas = document.createElement('canvas');
            this.loadRects();
            this.loadImage();
        },
        // 加载已保存矩形标签
        loadRects() {
            // 从 session 中获取保存的信息
            const storedRects = JSON.parse(sessionStorage.getItem(this.images[this.currentImageIndex].id));
            if (storedRects !== null) {
                const bufferCtx = this.bufferCanvas.getContext('2d');
                storedRects.forEach(item => {
                    let rect = new Rect(bufferCtx, item.dpr, item.minX, item.minY, item.scale);
                    rect.changed = false;
                    rect.name = item.name;
                    rect.maxX = item.maxX;
                    rect.maxY = item.maxY;
                    rect.timestamp = item.timestamp;
                    rect.realScale = item.realScale;
                    this.rects.push(rect);
                });
            }
        },
        // 加载当前图片
        loadImage() {
            this.currentImage = new Image();
            this.currentImage.src = this.imagePath;
            this.currentImage.onload = () => {
                this.currentImage.width *= this.dpr;
                this.currentImage.height *= this.dpr;
                this.image_width = this.currentImage.naturalWidth;
                this.image_height = this.currentImage.naturalHeight;
                // console.log("圖片寬高:", this.image_width, this.image_height);
                this.setSize();
                this.drawCanvas();
            };
        },
        // 设置画布大小
        setSize() {
            // 未设置缩放倍率
            if (this.scale === 0) {
                // 获取所在容器宽高
                const width = this.wrapper.clientWidth * this.dpr;
                const height = this.wrapper.clientHeight * this.dpr;
                // 计算缩放比例
                const scaleX = width / this.currentImage.width;
                const scaleY = height / this.currentImage.height;
                this.scale = Math.min(scaleX, scaleY);
                this.adaptiveScale = this.scale;
            }
            // 计算缩放后的图片尺寸
            const scaledWidth = this.currentImage.width * this.scale;
            const scaledHeight = this.currentImage.height * this.scale;
            // 设置画布宽高
            this.canvas.width = scaledWidth;
            this.canvas.height = scaledHeight;
            this.canvas.style.width = `${scaledWidth / this.dpr}px`;
            this.canvas.style.height = `${scaledHeight / this.dpr}px`;
            // 设置离屏画布宽高
            this.bufferCanvas.width = scaledWidth;
            this.bufferCanvas.height = scaledHeight;
            this.bufferCanvas.style.width = `${scaledWidth / this.dpr}px`;
            this.bufferCanvas.style.height = `${scaledHeight / this.dpr}px`;
            // 设置居中
            this.$nextTick(() => {
                // 设置垂直居中
                if (this.wrapper.clientHeight <= scaledHeight / this.dpr) {
                    // 画布高度超过父元素视窗高度时，取消居中设置
                    this.wrapper.style.justifyContent = '';
                } else {
                    // 画布高度未超过父元素视窗高度时，重新居中设置
                    this.wrapper.style.justifyContent = 'center';
                }
                // 设置水平居中
                if (this.wrapper.clientWidth <= scaledWidth / this.dpr) {
                    // 画布宽度超过父元素视窗宽度时，取消居中设置
                    this.wrapper.style.alignItems = '';
                } else {
                    // 画布宽度未超过父元素视窗宽度时，重新居中设置
                    this.wrapper.style.alignItems = 'center';
                }
            });
        },
        // 绘制画布
        drawCanvas() {
            const ctx = this.canvas.getContext('2d');
            const bufferCtx = this.bufferCanvas.getContext('2d');
            const width = this.canvas.width;
            const height = this.canvas.height;
            // 绘制缩放后的图片到离屏画布
            bufferCtx.clearRect(0, 0, width, height);
            bufferCtx.drawImage(this.currentImage, 0, 0, width, height);
            // 绘制已创建矩形
            if (this.currentRect) {
                this.currentRect.draw(this.scale);
            }
            for (const rect of this.rects) {
                if (rect === this.selectedRect) {
                    rect.color = 'rgba(255, 0, 0, 0.3)';
                } else {
                    rect.color = 'rgba(0, 0, 255, 0.3)';
                }
                rect.draw(this.scale);
            }
            // 将缩放后的图片绘制到主画布
            ctx.drawImage(this.bufferCanvas, 0, 0, width, height);
        },
        // 鼠标按下
        handleMouseDown(e) {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            this.prevX = mouseX;
            this.prevY = mouseY;
            // 找出被选中的矩形
            this.selectedRect = null;
            this.selectedRectIndex = -1;
            for (let i = this.rects.length - 1; i > -1; i--) {
                const rect = this.rects[i];
                if (rect.isSelected(mouseX, mouseY)) {
                    this.selectedRect = rect;
                    this.selectedRectIndex = i;
                    break;
                }
            }
            if (this.creating) {
                // 新建
                const bufferCtx = this.bufferCanvas.getContext('2d');
                this.currentRect = new Rect(bufferCtx, this.dpr, mouseX, mouseY, this.scale);
            } else if (this.selectedRect) {
                // 拖动或缩放
                this.selectedRect.mouseDown(mouseX, mouseY);
            }
        },
        // 鼠标移动
        handleMouseMove(e) {
            // 获取鼠标在Canvas中的坐标
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            this.currentX = mouseX;
            this.currentY = mouseY;
            const ctx = this.canvas.getContext('2d');
            if (this.creating) {
                // 新建
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(this.bufferCanvas, 0, 0);
                // 绘制交叉辅助线
                ctx.beginPath();
                ctx.moveTo(mouseX * this.dpr, 0);
                ctx.lineTo(mouseX * this.dpr, this.canvas.height);
                ctx.moveTo(0, mouseY * this.dpr);
                ctx.lineTo(this.canvas.width, mouseY * this.dpr);
                ctx.strokeStyle = 'red'; // 设置线条颜色
                ctx.stroke();
                if (!this.currentRect) return;
                this.currentRect.maxX = mouseX;
                this.currentRect.maxY = mouseY;
            } else if (this.selectedRect) {
                // 拖动或缩放
                this.selectedRect.mouseMove(e, this);
                this.selectedRect.yolo = this.getYoloFormat(this.selectedRect, this.image_width, this.image_height);
            }
            // 画布状态发生变化重新渲染
            if (this.creating || this.selectedRect) {
                this.drawCanvas(); // 绘制背景和已有矩形
            }
        },
        // 鼠标抬起
        handleMouseUp(e) {
            if (this.creating) {
                // 新建
                this.currentRect.maxX = e.offsetX;
                this.currentRect.maxY = e.offsetY;
                this.creating = false;
                // 矩形形状合法，加入到矩形集合
                if (this.currentRect.minX !== this.currentRect.maxX
                    && this.currentRect.minY !== this.currentRect.maxY) {
                    this.showNameInput = true;
                }
            } else if (this.selectedRect) {
                // 拖动或缩放
                this.selectedRect.mouseUp(this.currentImage.width, this.currentImage.height);
            }
            this.drawCanvas();
        },
        // 输入标签
        handleInputLabel() {
            console.log("輸入標籤", this.labelName);
            if (this.labelName) {
                // console.log("輸入標籤", this.labelName);
                this.$message({
                    showClose: true,
                    message: '创建成功',
                    type: 'success'
                });
                this.currentRect.name = this.labelName;
                this.currentRect.yolo = this.getYoloFormat(this.currentRect, this.image_width, this.image_width);
                this.rects.push(this.currentRect);
                this.canvasChanged = true;
            } else {
                this.$message({
                    showClose: true,
                    message: '名稱不得為空白',
                    type: 'error'
                });
                return;// 不關閉輸入框
            }
            this.currentRect = null;
            this.showNameInput = false;
            this.drawCanvas();
        },
        // 取消输入
        handleCancelInput() {
            this.currentRect = null;
            this.showNameInput = false;
            this.drawCanvas();
        },
        // 保存标签
        handleSaveLabel() {
            // 畫布有無改變
            if (this.canvasChanged) {
                this.rects.forEach(item => {
                    if (item.changed) {
                        item.changed = false;
                        const { x, y, w, h } = item.normalize(this.currentImage.width, this.currentImage.height);
                        // TODO 可以发送请求对归一化后的标签进行保存
                        console.log("归一化后的参数：", `x: ${x}, y: ${y}, h: ${w}, h: ${h}`);
                    }
                });
                this.canvasChanged = false;
            }
            sessionStorage.setItem(this.images[this.currentImageIndex].id, JSON.stringify(this.rects));
            this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
            });
        },
        // 删除选中标签
        handleDeleteLabel(row) {
            for (let i = 0; i < this.rects.length; i++) {
                if (row.timestamp === this.rects[i].timestamp) {
                    this.selectedRectIndex = i;
                    break;
                }
            }
            this.rects.splice(this.selectedRectIndex, 1);
            this.canvasChanged = true;
            this.selectedRectIndex = -1;
            this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
            });
            this.drawCanvas();
        },
        // 标签发生变化
        handleSaveChange(flag) {
            this.showSaveAlert = false;
            if (flag) {
                // 存入session
                sessionStorage.setItem(this.images[this.currentImageIndex].id, JSON.stringify(this.rects));
                this.handleSaveLabel();
            }
            this.executeSwitch();
        },
        // 图片缩放
        zoom(scale) {
            this.scale = scale;
            // 过大
            if (this.scale > this.maxScale) {
                this.scale = this.maxScale;
            }
            // 过小
            if (this.scale < this.minScale) {
                this.scale = this.minScale;
            }
            this.loadImage();
        },
        // 图片切换
        handleImageSwitch(index) {
            const length = this.images.length;
            this.checkChanged();
            this.targetImageIndex = (index + length) % length;
            if (this.canvasChanged) {
                // 框有被改變，提示是否保存☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆←
                // this.$confirm("畫布有改變，是否儲存？", "提示", {
                //     confirmButtonText: "儲存",
                //     cancelButtonText: "不儲存",
                //     type: "warning"
                // }).then(() => {
                //     this.handleSaveChange(true);
                // }).catch(() => {
                //     this.handleSaveChange(false);
                // });
                if (confirm("畫布有改變，是否儲存？")) {
                    this.handleSaveChange(true);   // 使用者按「確定」
                } else {
                    this.handleSaveChange(false);  // 使用者按「取消」
                }
                // this.showSaveAlert = true;
                
            } else {
                this.executeSwitch();
            }
        },
        // 执行切换
        executeSwitch() {
            console.log("執行切換圖片:", this.targetImageIndex);
            this.canvasChanged = false;
            this.currentImageIndex = this.targetImageIndex;
            this.rects = [];
            this.scale = 0;
            this.loadRects();
            this.loadImage();
        },
        // 判断画布状态是否发生变化
        checkChanged() {
            console.log("判断画布状态是否发生变化 checkChanged:", this.rects);
            
            for (let i = 0; i < this.rects.length; i++) {
                if (this.rects[i].changed) {
                    this.canvasChanged = true;
                    console.log("畫布有發生改變");
                    
                    break;
                }
            }
        },
        // 标签所在行单元格样式
        rectCellClass(row, rowIndex) {
            if (!row) return ''
            return this.selectedRectIndex === rowIndex ? 'cell-clicked' : ''
        },
        // 点击标签所在行
        rectCellClick(row, rowIndex) {
            console.log("rectCellClick:", row);
            this.selectedRectIndex = rowIndex;
            this.selectedRect = this.rects[rowIndex];
            this.drawCanvas();
        },
        // 图片路径单元格格样式
        imageCellClass({ row, column, rowIndex, columnIndex }) {
            //利用单元格的样式的回调方法，给行列索引赋值
            row.index = rowIndex;
            column.index = columnIndex;
            if (this.currentImageIndex === rowIndex) {
                return 'cell-clicked';
            }
            return '';
        },
        // 点击图片路径单元格
        imageCellClick(row, column, cell, event) {
            this.handleImageSwitch(row.index);
        },
        //------------------------------------------------------
        //------------------------------------------------------
        imgFileChange:function(){
            this.images[0].url = this.previewImgUrl;
            this.init();
            },  
        //timestamp 轉換成 YYYY-MM-DD HH:MM:SS
        formatTimestamp: function (timestamp) {
            const date = new Date(timestamp);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            return `${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        // 轉換成 yolo 格式
        getYoloFormat: function (currentRect, image_width, image_height) {
            // 假設圖片大小
            // const image_width = this.image_width;
            // const image_height = this.image_height;

            // === 還原到原圖座標 ===
            const real_minX = currentRect.minX / currentRect.scale;
            const real_maxX = currentRect.maxX / currentRect.scale;
            const real_minY = currentRect.minY / currentRect.scale;
            const real_maxY = currentRect.maxY / currentRect.scale;

            // === 計算中心與寬高 ===
            const x_center_px = (real_minX + real_maxX) / 2;
            const y_center_px = (real_minY + real_maxY) / 2;
            const width_px = real_maxX - real_minX;
            const height_px = real_maxY - real_minY;

            // === 轉換成 YOLO 格式 (0~1) ===
            const x_center = x_center_px / image_width;
            const y_center = y_center_px / image_height;
            const width = width_px / image_width;
            const height = height_px / image_height;

            // === 加入到 currentRect ===
            var yolo = {
                // class_id: 0, // 你可以依需求換類別 ID
                // x_center: Number(x_center.toFixed(6)),
                // y_center: Number(y_center.toFixed(6)),
                // width: Number(width.toFixed(6)),
                // height: Number(height.toFixed(6)),
                format: `0 ${x_center.toFixed(6)} ${y_center.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`
            };
            return yolo;
        },
        async getAllUser() {
            let getuserData = await this.getUserList();
            this.userData = typeof getuserData === 'string' ? [] : getuserData.filter(x => x.is_active);
            this.isLoading = true;
        },
        get_scopeData(evt) {
            this.poolid = evt;
        }
    },
    computed: {
        imagePath() {
            return this.images[this.currentImageIndex].url;
        },
        uniqueName() {
            // 去重后的标签名集合
            let names = new Set();
            this.rects.forEach(item => {
                names.add(item.name);
            });
            return names;
        },
        //----------
        previewImgUrl() {
            var file = this.imgFile;
            return file ? URL.createObjectURL(file) : null;
        }
    },
    async mounted() {
        this.init();
        await this.getAllUser();
        window.addEventListener('resize', () => {
            this.tableHeight = window.innerHeight - 208;
            this.innerWidth = window.innerWidth;
            this.loadImage();
        });
    }
};
</script>

<style lang="scss" scoped>
.v-application.v-application--is-ltr {
    .v-card.bg-card {
        * {
            color: $color-dark;
        }

        .v-card.result-card {
            background-color: $color-lighten;
            box-shadow: 0 0 10px $color-black-10;
        }
    }
}
.left-top {
  flex: 90%;//子元素會佔父容器的 90%
  height: 94vh;//高度是視窗高度（viewport height）的 94%。
  margin-top: 3vh;//元素距離上方留 3% 的視窗高度空白。
  display: flex;
  flex-direction: column;//子元素會垂直排列（從上到下）
  overflow: auto;//超出這個容器的大小時，會自動產生捲軸（垂直或水平）
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);//設定陰影效果，讓容器有浮起來的感覺
}
</style>