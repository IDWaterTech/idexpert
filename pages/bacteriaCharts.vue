<template>
    <div>
      <v-card elevation="0">
        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn class="btn-primary" elevation="0" @click="getData()">查詢</v-btn>
          </v-col>
          
          <v-col cols="12" md="6" v-for="item in chartDatas" :key="item.id">
            <div><h1>{{ item.name }}</h1></div>
            <ve-line :data="item" :extend="chartExtend"></ve-line>
          </v-col>
          <v-col v-if="chartDatas.length==0" class="my-4 pa-4">
            <div class="text-center" style="font-size: 1.2em;">查無資料</div>
          </v-col>
        </v-row>
      </v-card>
    </div>
</template>
<script>
export default {
  layout: "emptynologin2",
  props: {
    startDate: {
      type: String,
      default: "2026-08-01"
    },
    endDate: {
      type: String,
      default: "2026-08-31"
    },
    data_group: {
      type: String,
      default: "bacteria"
    },
    pond_area_id: {
      type: String,
      default: "19"
    }

  },
  data() {
    return {
      set: {
        legendAlias: {},
        stack: {},
      },
      chartExtend: {
        series(v) {
          if (Array.isArray(v)) {
            v.forEach(i => {
              i.connectNulls = true;
            });
          }
          return v;
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            return params
              .filter(item => {
                const value = Array.isArray(item.value) ? item.value[1] : item.value;
                return value != null;//&& value >= 0
              })
              .map(item => {
                const value = Array.isArray(item.value) ? item.value[1] : item.value;
                return `${item.seriesName}：${value}`;
              })
              .join('<br/>');
          }
        }
      },
      chartDatas:[
        {
          // columns: [],
          // rows:[]
        }
      ]
    }
  },
  methods: {
    getData: async function () {
      let url = `${this.$store.state.mydata.gobal_api.apiUrl}`;
      let params = {
        started_date: this.startDate,
        ended_date: this.endDate,
        data_group: this.data_group,
        pond_area_id: this.pond_area_id,
      }
      this.$axios.get(`${url}/all-data/`, { params: params }).then(res => {
        // console.log("bacteriaCharts.vue  :", res.data[0].items);
        if (Array.isArray(res.data) && res.data.length <0) {
          this.chartDatas = [];
          return;
        }
        this.chartDatas = res.data.map(group => {
          const items = group.items || [];
          // 動態抓取第一筆資料的所有 key 作為 columns（如果沒有資料則給空陣列）
          const columns = items.length > 0 ? Object.keys(items[0]) : [];
          return {
            id: group.id,
            name: group.name,
            columns: columns,
            rows: items
          };
        });

      }).catch(err => {
        console.error("getData:",err);
      });
    }
  },
  async mounted() {
    await this.getData();
  }
};
</script>