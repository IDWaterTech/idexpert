<template>
    <div>
        <v-card class="bg-card img-error">
            <div class="content">
                <h1>
                    未授權無法進入此頁 !
                </h1>
                <h3>請管理人員開通權限</h3>
                <v-btn class="btn-primary" @click="toHomePage()" style="margin-top: 24px;">
                    返回首頁
                </v-btn>
            </div>
            
        </v-card>
    </div>
</template>

<script>
export default {
    layout: "emptynologin2",
    methods: {
        toHomePage() {
            window.location.href='/';
        }
    },
}
</script>

<style lang="scss" scoped>
.img-error {
    background-image: url('../assets/Error-bg.png');
    @include size(auto,100%);
    object-fit: cover;
    background-size: cover;
    background-position: 60% bottom;
}
.content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,calc(-50% - 64px));
    @include flexAlignCenter();
    flex-direction: column;
    width: 100%;
    h1,h3 {
        color: $color-dark;
        font-weight: bold;
    }
}
</style>