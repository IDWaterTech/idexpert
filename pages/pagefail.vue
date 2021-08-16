<template>
    <div>
        
        <v-row class="text-center mt-10">
            
            <v-col></v-col>
            <v-col cols="6">
                <v-card elevation="2" outlined shaped>
                    <v-card-title class="text-center">
                         <v-icon large>mdi-lock-outline</v-icon>無法進入頁面
                    </v-card-title>
                    <v-divider></v-divider>
                     <v-card-text class="my-15">
                        <h2>您未被授權存取頁面</h2>
                        <v-btn class="mt-3 title" text color="primary" to="/">返回系統主頁面</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col></v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        layout: "emptynologin"
    }
</script>

<style scoped>

</style>