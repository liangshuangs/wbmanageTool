<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 12:21:38
 * @LastEditTime: 2022-09-22 19:12:53
 * @FilePath: /wbmanageTool/manage-tool/src/view/Home/index.vue
-->
<template>
  <div class="wrapper">
    <div
      v-for="(item, index) in tuopuData"
      :key="index"
      :index="index"
      class="graph-item"
    >
        <div>{{item.name}}</div>
      <Graph :graphData="item.data" />
      <el-table size="small" :border="true" :data="item.data" style="width: 95%">
      <el-table-column prop="num" label="编号"> </el-table-column>
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="ip" label="ip"> </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
import { fetchService } from "../../fetch";
import Graph from "../../components/Graph.vue";
export default {
  name: "HomeIndex",
  components: {
    Graph,
  },
  data() {
    return {
      tuopuData: [],
    };
  },
  mounted() {
    this.getMenus();
  },
  methods: {
    // 获取区域
    getMenus() {
      const params = {
        url: "/web/area_list",
      };
      fetchService(params).then((res) => {
        const list = res.list || [];
        this.tuopuData = new Array(list.length).fill().map(() => [])
        list.map((item, index) => {
          this.getTuoPu(item, index);
        });
        this.getTuoPu({ id: "1", name: "海淀" });
      });
    },
    getTuoPu(item, index) {
      const url = "/web/topology_list";
      const params = {
        area: item.id,
      };
      fetchService({ url, params }).then((res) => {
        this.$set(this.tuopuData, index, {name: item.name, data: res.list});
      });
    },
  },
};
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.graph-item {
  width: calc(100% / 3);
  flex-direction: row;
  margin-top: 10px;
}
</style>