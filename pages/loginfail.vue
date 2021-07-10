<template>
  <div>
    <v-row style="font-family: DFKai-sb;">
      <v-spacer></v-spacer>
      <v-col cols="6">
        <v-card img="/letter_bg.jpg" class="mt-10">
          <v-card-title
            >Dear&nbsp;
            <span
              ><u
                ><strong>{{ ($auth.$state.user)?$auth.$state.user.name:'username' }}</strong></u
              ></span
            >
            &nbsp;先生/女士 您好：</v-card-title
          >
          <v-card-text style="font-size:16pt;">
            您的帳號：<span style="color:red;">{{ ($auth.$state.user)?$auth.$state.user.email:'usermail' }}</span>，未授權登入。<br />
            可以使用以下2種方式解決
            <ol class="mx-5 my-2">
              <li>向主管提出申請</li>
              <li>以其他帳號登入</li>
            </ol>
            感謝您的協助。
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: "emptynologin"
};
</script>

<style scoped>
form {
  background: #f7f2ec url("/letter_bg.jpg");
  height: 200px;
  padding: 20px;
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  box-shadow: 10px 5px 5px grey;
  font-family: DFKai-sb;
}
.contenttxt {
  font: 16px normal normal uppercase helvetica, arial, serif;
  color: #7c7873;
  padding: 0px 10px;
  margin: 0 0 10px 0;
  border: 0px solid #f8f8f1;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-box-shadow: inset 0 0 1px #726959;
  -webkit-box-shadow: inset 0 0 1px #b3a895;
  box-shadow: inset 0 0 1px #b3a895;
}
</style>
