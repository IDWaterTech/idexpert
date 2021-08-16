<template>
  <v-list>
    <div v-for="item in myitem" :key="item.id">
      <!-- {{item.hasOwnProperty('children')}} -->
      <v-list-group
        v-if="item.hasOwnProperty('children')"
        :to="item[urlName]"
        v-model="item[active]"
        v-show="item[isShow] || item.hasOwnProperty(isShow)==false"
      >
        <template v-slot:activator>
          <v-list-item-icon
            ><v-icon>{{ item[iconName] }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item[titleName] }}</v-list-item-title>
        </template>
        <sidelist :myitem="item.children"  :titleName="urlName" :urlName="urlName" :active="active" :isShow="isShow"></sidelist>
      </v-list-group>
      <v-list-item :to="item[urlName]" v-else v-show="item[isShow] || item.hasOwnProperty(isShow)==false">
        <v-list-item-icon
          ><v-icon>{{
            item[iconName] != undefined
              ? item[iconName]
              : "mdi-help-circle-outline"
          }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item[titleName] }}</v-list-item-title>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
export default {
  props: {
    myitem: {
      type: Array,
      default: function() {
        return [
          {
            id: 1,
            name: "首頁",
            url: "/",
            icon: "mdi-apps",
            active: true,
            children: [
              {
                id: 2,
                name: "監測數據",
                icon: "mdi-chart-bell-curve",
                url: "/basic"
              },
              {
                id: 3,
                name: "重要紀事",
                icon: "mdi-calendar-star",
                url: "/calendar"
              },
              {
                id: 4,
                name: "指標資料修改",
                icon: "mdi-file-edit",
                url: "/Indicator/edit"
              },
              {
                id: 5,
                name: "養殖池況",
                icon: "mdi-map-outline",
                url: "/map/"
              }
            ]
          },
          {
            id: 8,
            name: "管理",
            url: "/set",
            icon: "mdi-cog-outline",
            children: [
              //   {
              //     id: 9,
              //     name: "帳號管理",
              //     url: "/set/account"
              //   },
              //   {
              //     id: 10,
              //     name: "授權管理",
              //     url: "/set/authorization"
              //   }
            ]
          }
        ];
      }
    },
    iconName: { type: String, default: "icon" },
    titleName: { type: String, default: "name" },
    urlName: { type: String, default: "url" },
    active:{type: String, default: "active"},//是否預設展開下拉的節點
    isShow:{type: String, default: "isShow"},
  },
  name: "sidelist"
};
</script>

<style scoped></style>
