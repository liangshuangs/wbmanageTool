<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-10-11 11:34:47
 * @LastEditTime: 2022-10-14 23:53:42
 * @FilePath: /wbmanageTool/manage-tool/src/view/Map/index.vue
-->
<template>
  <div>
    <div class="info">
      <div class="info-item" @click="handleClearGuiji">清除轨迹</div>
      <div class="info-item" @click="handleTuoPu">{{ showTuoPu ? '隐藏拓扑': '显示拓扑' }}</div>
      <div class="info-item" @click="handleMapType">{{mapOnlineType ? '在线': '离线'  }}</div>
    </div>
    <online-map ref="online" :showTuoPu="showTuoPu" v-if="mapOnlineType"></online-map>
    <offline-map ref="offline" :showTuoPu="showTuoPu" v-else></offline-map>
  </div>
</template>
<script>
import OnlineMap from "./onlineMap.vue";
import offlineMap from "./offlineMap.vue";
export default {
  name: "MapCom",
  data() {
    return {
      map: null,
      gps: {
        longitude: 0,
        latitude: 0,
        resetCenter: true,
        converted: true,
      },
      showGuiji: false, // 显示轨迹
      showTuoPu: false, // 显示拓扑
      mapOnlineType: true,
      monitorMap: new Map(),
      baseStationMap: new Map(), // 基站信息
    };
  },
  components: {
    offlineMap,
    OnlineMap
  },
  mounted() {},
  methods: {
    // 设置地图离线在线模式
    handleMapType() {
        window.BMapGL = null;
        this.mapOnlineType = !this.mapOnlineType;
    },
    handleClearGuiji() {
        const onlineRefs = this.$refs['online'];
        const offlineRefs = this.$refs['offline'];
        if (offlineRefs) {
          offlineRefs.clearTrack();
        }
        if (onlineRefs) {
          onlineRefs.clearTrack();
        }
    },
    handleTuoPu() {
        this.showTuoPu = !this.showTuoPu;
        
    }
  },
};
</script>
<style scoped>
.info {
  z-index: 999;
  margin-left: 10px;
  position: fixed;
  top: 70px;
  right: 10px;
  display: flex;
}
.info-item {
  background-color: #fff;
  border-radius: 0.25rem;
  font-size: 14px;
  color: #666;
  padding: 7px 10px;
  margin-right: 10px;
  cursor: pointer;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
.info-item:hover {
    color: rgba(27, 142, 236, 1);
}
#map_container {
  height: calc(100vh - 60px);
  width: 100%;
}
</style>