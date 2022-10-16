<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 12:21:38
 * @LastEditTime: 2022-10-16 20:41:45
 * @FilePath: /wbmanageTool/manage-tool/src/view/Home/index.vue
-->
<template>
  <div class="box">
    <div class="box-main">
      <div class="wrapper">
        <div
          v-for="(item, index) in tuopuData"
          :key="index"
          :index="index"
          class="graph-item"
        >
          <div>{{ item.name }}</div>
          <Graph :graphData="item.data" />
          <el-table
            size="small"
            :border="true"
            :data="item.data"
            style="width: 95%"
          >
            <el-table-column prop="num" label="节点编号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="节点名称"> </el-table-column>
            <el-table-column prop="ip" label="节点IP"> </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="offline-point">
      <div class="offline-title">告警信息</div>
      <div class="info-wrapper">
        <div
          class="info-item"
          v-for="(item, index) in offlinePointArray"
          :key="index"
          :index="index"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchService } from "../../fetch";
import Graph from "../../components/Graph.vue";
import { API } from "../../api";
export default {
  name: "HomeIndex",
  components: {
    Graph,
  },
  data() {
    return {
      tuopuData: [],
      topologyMap: new Map(), // 拓扑map
      timer: null,
      offlinePointObj: {},
      offlinePointArray: [],
    };
  },
  mounted() {
    this.getMenus();
    this.tiemr = setInterval(() => {
      this.getMenus();
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    // 获取区域
    getMenus() {
      const params = {
        url: API.areaList,
      };
      fetchService(params).then((res) => {
        const list = res.list || [];
        if (
          this.tuopuData.length === 0 ||
          this.tuopuData.length !== list.length
        ) {
          this.tuopuData = new Array(list.length).fill().map(() => []);
        }
        list.map((item, index) => {
          this.$set(this.offlinePointObj, item.name, "");
          this.getTuoPu(item, index);
        });
      });
    },
    getTuoPu(item, index) {
      const url = `${API.topologyList}/${item.id}`;
      fetchService({ url, params: {} }).then((res) => {
        if (this.offlinePointObj && this.offlinePointObj[item.name]) {
          this.offlinePointObj[item.name] = "";
        }
        const newTopologyList = res.List || [];
        if (this.topologyMap.has(item.name)) {
          const oldTopologyList = this.topologyMap.get(item.name);
          // 循环旧的节点，看旧的节点是否都在新的节点里面，如果旧的节点不在新的节点里面，则说明这个节点离线了。
          oldTopologyList.map((oldItem) => {
            const isNewTopologyHas = newTopologyList.find(
              (i) => i.mac === oldItem.mac
            );
            if (!isNewTopologyHas) {
              let time = this.getNowFormatDate();
              this.offlinePointArray.unshift(
                `${item.name}-${oldItem.num}-${oldItem.name}设备离线;离线时间：${time}`
              );
            }
          });
        }
        this.topologyMap.set(item.name, newTopologyList);
        this.$set(this.tuopuData, index, { name: item.name, data: res.List });
      });
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      return currentdate;
    },
  },
};
</script>
<style scoped>
.box {
  width: 100%;
}
.box-main {
  width: 100%;
  background-color: #fff;
}
.wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background-color: #fff;
}
.graph-item {
  width: 350px;
  flex-flow: wrap;
  flex-direction: row;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
}
.offline-point {
  width: 100%;
  max-height: 150px;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: left;
  background-color: #fff;
  overflow: hidden;
}
.offline-title {
  text-align: left;
  font-weight: 500;
  width: 100%;
  font-size: 16px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  padding-left: 10px;
}
.info-wrapper {
  height: 100px;
  overflow-y: scroll;
}
.info-item {
  color: red;
  padding-left: 10px;
}
.info-item + .info-item {
  padding-top: 5px;
}
</style>