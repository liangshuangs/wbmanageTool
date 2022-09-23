<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 11:46:59
 * @LastEditTime: 2022-09-22 15:06:35
 * @FilePath: /wbmanageTool/manage-tool/src/view/TuoPu/index.vue
-->
<template>
  <div>
    <div class="title">
      <el-button @click="showSettingModal = 1" plain>网络拓扑控制</el-button>
      <el-button @click="showSettingModal = 2" plain>节点设置</el-button>
      <el-button @click="showSettingModal = 3" plain>MESH设置</el-button>
      <el-button plain @click="handleFastStart">系统快速启动</el-button>
      <el-button plain @click="handleReboot">系统完全启动</el-button>
    </div>
    <Graph :graphData="tableData" />
    <el-table size="small" :border="true" :data="tableData" style="width: 100%">
      <el-table-column prop="num" label="编号" width="180"> </el-table-column>
      <el-table-column prop="name" label="名称" width="180"> </el-table-column>
      <el-table-column prop="ip" label="ip"> </el-table-column>
      <el-table-column prop="mac" label="mac"> </el-table-column>
    </el-table>
    <br />
    <el-table size="small" :border="true" :data="watchData" style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
    </el-table>
    <!-- 网络拓扑控制 -->
    <el-dialog
      width="40%"
      title="网络拓扑控制"
      :visible="+showSettingModal === 1"
      @close="showSettingModal = ''"
    >
      <el-form :model="tuopuFrom">
        <el-form-item label="节点编号1" :label-width="formLabelWidth">
          <el-input v-model="tuopuFrom.num1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="节点编号2" :label-width="formLabelWidth">
          <el-input v-model="tuopuFrom.num2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="submit-wrapper">
          <el-button type="primary" @click="reconnection"
            >重连</el-button
          >
          <el-button @click="disconnect">断开</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 节点设置 -->
    <el-dialog
      width="40%"
      title="节点设置"
      :visible="+showSettingModal === 2"
      @close="showSettingModal = ''"
    >
      <el-form :model="tuopuFrom">
        <el-form-item label="更改节点编号" :label-width="formLabelWidth">
          <el-input v-model="tuopuFrom.ponitNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="更改节点名称" :label-width="formLabelWidth">
          <el-input v-model="tuopuFrom.ponitName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="submit-wrapper">
          <el-button type="primary" @click="editPonit"
            >应用</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- MESH设置 -->
    <el-dialog
      width="40%"
      title="MESH设置"
      :visible="+showSettingModal === 3"
      @close="showSettingModal = ''"
    >
      <el-form :model="tuopuFrom">
        <el-form-item label="MESH网络状态" :label-width="formLabelWidth">
          <!-- <div v-model="tuopuFrom.ponitNum"></div> -->
        </el-form-item>
        <el-form-item label="更改节点编号" :label-width="formLabelWidth">
          <el-input v-model="tuopuFrom.ponitNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="更改节点名称" :label-width="formLabelWidth">
          <el-input v-model="tuopuFrom.ponitName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="submit-wrapper">
          <el-button type="primary" @click="editPonit"
            >应用</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
  <script>
import { fetchService } from "../../fetch";
import Graph from "../../components/Graph.vue";
export default {
  name: "TuoPuCom",
  components: {
    Graph,
  },
  data() {
    return {
      tableData: [],
      tableColumns: [],
      watchData: [],
      timer: null,
      formLabelWidth: "120px",
      tuopuFrom: {num1: '', num2: ''},
      showSettingModal: "", // 1-网络拓扑控制 2-节点设置 3-MESH设置
    };
  },
  mounted() {
    this.getTuoPu();
    this.itmer = setInterval(() => {
      this.getTuoPu();
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    // 修改节点 TODO 接口和入参需要修改
    editPonit() {
      const params = {
        url: '/web/reconnect',
        params: {
          num1: this.tuopuFrom.num1,
          num2: this.tuopuFrom.num2
        }
      };
      fetchService(params).then((res) => {
        this.showSettingModal = '';
        this.$message({
          message: res.msg || "修改成功",
          type: "success",
        });
      });
    },
    // 重连拓扑
    reconnection() {
      const params = {
        url: '/web/reconnect',
        params: {
          num1: this.tuopuFrom.num1,
          num2: this.tuopuFrom.num2
        }
      };
      fetchService(params).then((res) => {
        this.showSettingModal = '';
        this.$message({
          message: res.msg || "重连成功",
          type: "success",
        });
      });
    },
    // 断开拓扑
    disconnect() {
      const params = {
        url: '/web/disconnect',
        params: {
          num1: this.tuopuFrom.num1,
          num2: this.tuopuFrom.num2
        }
      };
      fetchService(params).then((res) => {
        this.showSettingModal = '';
        this.$message({
          message: res.msg || "断开成功",
          type: "success",
        });
      });
    },
    // 系统完全启动
    handleReboot() {
      const params = {
        url: "/web/reboot",
      };
      fetchService(params).then((res) => {
        this.$message({
          message: res.msg || "系统完全启动成功",
          type: "success",
        });
      });
    },
    // 系统快速启动
    handleFastStart() {
      const params = {
        url: "/web/fast_reboot",
      };
      fetchService(params).then((res) => {
        this.$message({
          message: res.msg || "系统快速启动成功",
          type: "success",
        });
      });
    },
    // 获取拓扑
    getTuoPu() {
      const query = this.$route.query || {};
      const url = "/web/topology_list";
      const params = {
        area: query.type,
      };
      fetchService({ url, params }).then((res) => {
        this.tableData = res.list || [];
        let watchColumns = [{ label: "观察点", prop: "num" }]; // 列名
        let watchData = []; // 观察数据
        this.tableData.map((item) => {
          let watchColumn = { label: item.num, prop: item.mac }; // 处理列名
          watchColumns.push(watchColumn);
          // 处理观察数据
          let watchDataItem = { num: item.num }; // 观察数据
          const signals = item.signals || [];
          signals.map((signal) => {
            watchDataItem[signal.mac] = signal.intensity + "dBm";
            watchDataItem[item.mac] = "-";
          });
          watchData.push(watchDataItem);
        });
        this.tableColumns = watchColumns;
        this.watchData = watchData;
      });
    },
  },
};
</script>
<style scoped>
.title {
  display: flex;
}
</style>