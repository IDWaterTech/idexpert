<template>
    <div>
        <v-icon dark @click="dlg_kb = true">mdi-brain</v-icon>
        <v-dialog v-model="dlg_kb" fullscreen scrollable transition="dialog-bottom-transition">
            <v-card tile>
                <v-toolbar flat dark color="cardtitle" dense style="flex:none">
                    <v-btn icon dark @click="dlg_kb = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>知識庫</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text class="primary">
                    <kb></kb>
                </v-card-text>

                <!-- <div style="flex: 1 1 auto;"></div> -->
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import kb from '../pages/kb.vue'
export default {
    components: {
        kb
    },
    data() {
        return {
            dlg_kb: false
        }
    },
}
</script>
