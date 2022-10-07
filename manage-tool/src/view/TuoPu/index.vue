<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 11:46:59
 * @LastEditTime: 2022-09-28 11:02:49
 * @FilePath: /wbmanageTool/manage-tool/src/view/TuoPu/index.vue
-->
<template>
  <div>
    <div class="title">
      <el-button @click="showSettingModal = 1" plain>网络拓扑控制</el-button>
      <el-button @click="showSettingModal = 2" plain>节点设置</el-button>
      <el-button @click="showSettingModal = 3" plain>MESH设置</el-button>
      <el-button plain @click="handleFastStart(0)">系统快速启动</el-button>
      <el-button plain @click="handleFastStart(1)">系统完全启动</el-button>
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
      <el-form :model="tuopuSetting">
        <el-form-item label="节点编号1" :label-width="formLabelWidth">
          <el-input v-model="tuopuSetting.num1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="节点编号2" :label-width="formLabelWidth">
          <el-input v-model="tuopuSetting.num2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="submit-wrapper">
          <el-button type="primary" @click="reconnection(1)">重连</el-button>
          <el-button @click="reconnection(0)">断开</el-button>
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
          <el-input v-model="tuopuFrom.num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="更改节点名称" :label-width="formLabelWidth">
          <el-input v-model="tuopuFrom.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="submit-wrapper">
          <el-button type="primary" @click="editPonit">应用</el-button>
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
      <el-form :model="setMeshtting">
        <el-form-item label="MESH工作频率-信道" label-width="145px">
          <el-select
            class="setting-select"
            v-model="setMeshtting.channel"
            placeholder="请选择信道"
          >
            <el-option
              v-for="(item, index) in CHANNEL"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="MESH工作频率-频宽" label-width="145px">
          <el-select
            class="setting-select"
            v-model="setMeshtting.frequency"
            placeholder="请选择频宽"
          >
            <el-option
              v-for="(item, index) in FREQUENCY"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-switch v-model="setMeshtting.is_all"  active-text="一键调频" active-value=1 inactive-value=0> </el-switch>
          <!-- <el-radio-group v-model="setMeshtting.is_all">
            <el-radio label="一键调频"></el-radio>
          </el-radio-group> -->
        </el-form-item>
        <el-form-item class="submit-wrapper">
          <el-button type="primary" @click="setMeshttingFn">应用</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
  <script>
import { fetchService } from "../../fetch";
import Graph from "../../components/Graph.vue";
import { API } from "../../api";
const channel = [
  { label: "1(1410 MHz)", value: 0 },
  { label: "2(1415 MHz)", value: 1 },
  { label: "3(1420 MHz)", value: 2 },
  { label: "4(1425 MHz)", value: 3 },
  { label: "5(1430 MHz)", value: 4 },
  { label: "6(1435 MHz)", value: 5 },
  { label: "7(1440 MHz)", value: 6 },
  { label: "8(1445 MHz)", value: 7 },
  { label: "9(1450 MHz)", value: 8 },
  { label: "10(1455 MHz)", value: 9 },
  { label: "11(1460 MHz)", value: 10 },
];
const frequency = [
  { label: "5 MHz", value: 0 },
  { label: "10 MHz", value: 1 },
  { label: "20 MHz", value: 2 },
  { label: "40 MHz", value: 3 },
];
export default {
  name: "TuoPuCom",
  components: {
    Graph,
  },
  data() {
    return {
      channel: "",
      frequency: "",
      tableData: [],
      tableColumns: [],
      watchData: [],
      timer: null,
      formLabelWidth: "120px",
      tuopuFrom: { num: "", name: "" },
      tuopuSetting: { num1: "", num2: "" },
      setMeshtting: { channel: "", frequency: "", is_all: 0 },
      CHANNEL: channel,
      FREQUENCY: frequency,
      showSettingModal: "", // 1-网络拓扑控制 2-节点设置 3-MESH设置
    };
  },
  watch: {
    showSettingModal(val) {
      if (val === 3) {
        this.getMesh();
      }
    },
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
    // 获取mesh
    getMesh() {
      const query = this.$route.query || {};
      const params = {
        url: `${API.getMesh}/${query.type}`,
        params: {},
      };
      fetchService(params)
        .then((res) => {
          this.setMeshtting.channel = res.channel;
          this.setMeshtting.frequency = res.frequency;
        })
        .catch((err) => {
          this.$message.error(err.msg || "获取mesh失败");
        });
    },
    // mesh 设置
    setMeshttingFn() {
      const query = this.$route.query || {};
      const params = {
        url: `${API.getMesh}/${query.type}`,
        method: "post",
        params: {
          channel: this.setMeshtting.channel,
          frequency: this.setMeshtting.frequency,
          is_all: +this.setMeshtting.is_all,
        },
      };
      fetchService(params)
        .then((res) => {
          this.showSettingModal = "";
          this.$message.success(res.msg || "设置mesh成功");
        })
        .catch((err) => {
          this.$message.error(err.msg || "设置mesh失败");
        });
    },
    // 设置节点
    editPonit() {
      const query = this.$route.query || {};
      const params = {
        url: `${API.setNode}/${query.type}`,
        method: "post",
        params: {
          num: +this.tuopuFrom.num,
          name: this.tuopuFrom.name,
        },
      };
      fetchService(params)
        .then((res) => {
          this.showSettingModal = "";
          this.$message.success(res.msg || "修改成功");
        })
        .catch((err) => {
          this.$message.error(err.msg || "修改失败");
        });
    },
    // 重连拓扑 0-断开 1-重连
    reconnection(type = 0) {
      const query = this.$route.query || {};
      const params = {
        method: "post",
        url: `${API.connectNode}/${query.type}`,
        params: {
          num1: +this.tuopuSetting.num1,
          num2: +this.tuopuSetting.num2,
          connected: +type,
        },
      };
      fetchService(params)
        .then((res) => {
          this.showSettingModal = "";
          this.$message.success(res.msg || "成功");
        })
        .catch((err) => {
          this.$message.error(err.msg || "失败");
        });
    },
    // 系统快速启动 or 系统完全启动
    handleFastStart(value = 0) {
      const query = this.$route.query || {};
      const params = {
        method: "post",
        url: `${API.reboot}/${query.type}`,
        params: {
          reboot: +value,
        },
      };
      fetchService(params)
        .then((res) => {
          this.$message.success(res.msg || "系统快速启动成功");
        })
        .catch((err) => {
          this.$message.error(err.msg || "失败");
        });
    },
    // 获取拓扑
    getTuoPu() {
      const query = this.$route.query || {};
      const url = `${API.topologyList}/${query.type}`;
      const params = {};
      fetchService({ url, params }).then((res) => {
        this.tableData = res.List || [];
        let watchColumns = [{ label: "观察点", prop: "num" }]; // 列名
        let watchData = []; // 观察数据
        this.tableData.map((item) => {
          let watchColumn = { label: item.num + "", prop: item.mac }; // 处理列名
          watchColumns.push(watchColumn);
          // 处理观察数据
          let watchDataItem = { num: item.num + "" }; // 观察数据
          const signals = item.signals || [];
          signals.map((signal) => {
            watchDataItem[signal.mac] = signal.intensity + "dBm";
            watchDataItem[item.mac] = "-";
          });
          watchData.push(watchDataItem);
        });
        this.tableColumns = watchColumns;
        this.watchData = watchData;
      }).catch(err => {
        console.log(err, 'err')
      });
    },
  },
};
</script>
<style scoped>
.title {
  display: flex;
}
.setting-select {
  width: 100%;
}
</style>