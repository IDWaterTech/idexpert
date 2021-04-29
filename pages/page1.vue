<template>
 <v-row justify="center" align="center">
    <v-col cols="12">
    <div class="text-center">
        <h1>page1</h1>
        <v-btn class="primary" to="/intro">go intro</v-btn>
    </div>
    </v-col>
 </v-row>
</template>
<script>
export default {
    layout:'empty',
    //auth:'guest',
    //middleware: 'auth'
}
</script>
