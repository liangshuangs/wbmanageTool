<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 11:46:59
 * @LastEditTime: 2022-10-15 23:30:43
 * @FilePath: /wbmanageTool/manage-tool/src/view/TuoPu/index.vue
-->
<template>
  <div class="wrapper" v-loading="loading">
    <div class="title">
      <el-button @click="showSettingModal = 1" plain>网络拓扑控制</el-button>
      <el-button @click="showSettingModal = 2" plain>节点设置</el-button>
      <el-button @click="showSettingModal = 3" plain>MESH设置</el-button>
      <el-button plain @click="handleFastStart(0)">系统快速启动</el-button>
      <el-button plain @click="handleFastStart(1)">系统完全启动</el-button>
    </div>
    <Graph :graphData="tableData" />
    <div class="table-wrapper">
      <el-table cell-class-name="tuopu-cel" size="small" :border="true" :data="tableData" style="width: 90%">
      <el-table-column prop="num" label="节点编号" width="180"> </el-table-column>
      <el-table-column prop="name" label="节点名称" width="180"> </el-table-column>
      <el-table-column prop="ip" label="节点IP" width="180"> </el-table-column>
      <el-table-column prop="mac" label="节点MAC"> </el-table-column>
      <el-table-column prop="latLon" label="节点经纬度"> </el-table-column>
    </el-table>
    <br />
    <el-table size="small" :border="true" :data="watchData" style="width: 80%">
      <el-table-column
        v-for="(item, index) in tableColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
    </el-table>
    </div>
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
      <el-form :model="setMeshtting" ref="setMeshRef">
        <el-form-item label="MESH工作频率-信道" label-width="145px" :prop="setMeshtting.channel">
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
        <el-form-item label="MESH工作频率-频宽" label-width="145px" :prop="setMeshtting.frequency">
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
        <el-form-item label="" :prop="setMeshtting.is_all">
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
  { label: "频点1", value: '1' },
  { label: "频点2", value: '2' },
  { label: "频点3", value: '3' },
  { label: "频点4", value: '4' },
  { label: "频点5", value: '5' },
  { label: "频点6", value: '6' },
  { label: "频点7", value: '7' },
  { label: "频点8", value: '8' },
  { label: "频点9", value: '9' },
  { label: "频点10", value: '10' },
  { label: "频点11", value: '11' },
];
const frequency = [
  { label: "5 MHz", value: '5' },
  { label: "10 MHz", value: '10' },
  { label: "20 MHz", value: '20' },
  { label: "40 MHz", value: '40' },
];
export default {
  name: "TuoPuCom",
  components: {
    Graph,
  },
  data() {
    return {
      loading: true,
      channel: "",
      frequency: "",
      tableData: [],
      tableColumns: [],
      watchData: [],
      timer: null,
      formLabelWidth: "120px",
      tuopuFrom: { num: "", name: "" },
      tuopuSetting: { num1: "", num2: "" },
      setMeshtting: { channel: '', frequency: '', is_all: '' },
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
    $route:{
      handler() {
        const type = this.$route.query.type;
        if (type) {
          this.getInitData(1);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getInitData(1);
    this.itmer = setInterval(() => {
      this.getInitData();
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    setMeshRef() {
      this.$refs['setMeshRef'] && this.$refs['setMeshRef'].resetFields();
    },
    // 获取mesh
    getMesh() {
      const query = this.$route.query || {};
      const params = {
        url: `${API.getMesh}/${query.type}`,
        params: {},
      };
      fetchService(params)
        .then((res) => {
          this.setMeshtting.channel = res.channel + '';
          this.setMeshtting.frequency = res.frequency + '';
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
          channel: +this.setMeshtting.channel,
          frequency: +this.setMeshtting.frequency,
          is_all: +this.setMeshtting.is_all,
        },
      };
      fetchService(params)
        .then((res) => {
          this.showSettingModal = "";
          this.setMeshtting = {
            channel: '',
            frequency: '',
            is_all: ''
          }
          this.$message.success(res.msg || "设置mesh成功");
        })
        .catch((err) => {
          this.setMeshtting = {
            channel: '',
            frequency: '',
            is_all: ''
          };
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
    getInitData(isFirst) {
      if (isFirst) {
        this.loading = true;
      }
      Promise.all([this.getTuoPu(), this.getGPS()]).then(res => {
        // setTimeout(() => {
        //   this.loading = false;
        // }, 1000)
        this.loading = false;
        this.handleTuoPudata(res)
      }).catch(e => {
        console.log(e);
        this.loading = false;
      })
    },
    // 获取拓扑
    getTuoPu() {
      const query = this.$route.query || {};
      const url = `${API.topologyList}/${query.type}`;
      const params = {};
      return fetchService({ url, params });
    },
    handleTuoPudata(res) {
      const tuoPuList = res[0].List || [];
      const gpsData = res[1].List || [];
      tuoPuList.map(t => {
        const result = gpsData.find(g => g.mac === t.mac);
        if (result) {
          t.latLon = `经度:${result.long},纬度:${result.lat}`;
        }
      });
        this.tableData = tuoPuList || [];
        let watchColumns = [{ label: "观察点", prop: "num" }]; // 列名
        let watchData = []; // 观察数据
        this.tableData.map((item) => {
          let watchColumn = { label: item.num + "", prop: item.mac }; // 处理列名
          item.latLon = '经纬度';
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
    },
    getGPS() {
      const query = this.$route.query || {};
      const url = `${API.getGps}/${query.type}`;
      const params = {};
      return fetchService({ url, params });
    },
  },
};
</script>
<style scoped>
  .wrapper {
    background-color: #fff;
  }
.title {
  display: flex;
  padding-top: 10px;
}
.setting-select {
  width: 100%;
}
.table-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<style>
  .cell {
  text-align: center;
}
</style>