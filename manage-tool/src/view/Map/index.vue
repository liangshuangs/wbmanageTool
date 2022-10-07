<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 14:48:41
 * @LastEditTime: 2022-09-28 17:49:35
 * @FilePath: /wbmanageTool/manage-tool/src/view/Map/index.vue
-->
<template>
  <div id="map_container" style="width: 100%; height: 100%"></div>
</template>
<script>
import { MapInitControl, RadarOverlay } from "../../util";
import { fetchService } from "../../fetch";
// import Graph from "../../components/Graph.vue";
import { API } from "../../api";
export default {
  name: "MapCom",
  data() {
    return {
      map: null,
      nodeList: []
    };
  },
  mounted() {
    this.drawMap();
    this.getGPS();
  },
  methods: {
    drawMap() {
      let map = new window.BMapGL.Map("map_container"); // 创建Map实例
      this.map = map;
      //初始化地图,设置中心点坐标和地图级别
      this.map.centerAndZoom(
        new window.BMapGL.Point(116.3511037513259, 39.962781220202125),
        17
      );
      //开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true);
      var scaleCtrl = new window.BMapGL.ScaleControl(); // 添加比例尺控件
      this.map.addControl(scaleCtrl);
      var zoomCtrl = new window.BMapGL.ZoomControl(); // 添加缩放控件
      this.map.addControl(zoomCtrl);
      this.addMapInitControl(
        10,
        10,
        { text1: "离线", text2: "在线" },
        this.handle3D
      );
      this.addMapInitControl(
        70,
        10,
        { text1: "2D地图", text2: "3D地图" },
        this.handle3D
      );
      this.addMapInitControl(
        150,
        10,
        { text1: "轨迹回放", text2: "轨迹回放" },
        this.handle3D
      );
      this.addMapInitControl(
        240,
        10,
        { text1: "获取拓扑", text2: "隐藏拓扑" },
        this.getTouPu
      );
    },
    addMapInitControl(x, y, textObj, fn) {
      let myMapInitControl = new MapInitControl({
        anchor: window.BMAP_ANCHOR_TOP_RIGHT,
        offset: new window.BMapGL.Size(x, y),
        text: textObj,
        fn,
      });
      this.map.addControl(myMapInitControl);
    },
    addRadarOverlay(lat, point, text) {
      let radarOverlay = new RadarOverlay({lat, point, text});
      this.map.addOverlay(radarOverlay);
    },
    handle3D(val) {
      if (val === "3D地图") {
        this.map.setTilt(70);
      } else {
        this.map.setTilt(0);
      }
    },
    // 获取拓扑
    getTouPu(val) {
      if (val === "获取拓扑") {
        this.getTuoPuData();
      } else {
        // this.map.setTilt(0);
      }
    },
    getTuoPuData() {
      const query = this.$route.query || {};
      const url = `${API.topologyList}/${query.type}`;
      const params = {};
      fetchService({ url, params }).then((res) => {
        console.log(res, "res");
      });
    },
    getGPS() {
      const query = this.$route.query || {};
      const url = `${API.getGps}/${query.type}`;
      const params = {};
      fetchService({ url, params }).then((res) => {
        this.nodeList = res.List || [];
       
        // dconsole.log(window.BMapGLLib, 'window.BMapGL.Convertor')
        // const convertor = new window.BMap.Convertor();
        console.log('dddd')
        // var marker = new window.BMapGL.Marker(new window.BMapGL.Point(116.22432559131525, 40.052802986650676)); // 创建点
        // this.map.addOverlay(marker);
        this.nodeList.map((node,index) => {
          window.BMapGL.Convertor.translate({lng: node.long,lat: node.lat}, 1, (data) => {
            console.log(data,index, 'datda')
            // this.addRadarOverlay(39.79, new window.BMapGL.Point(116.4126336237026, 39.907738095150389), 'node');
            // this.addRadarOverlay(39.907738095150389, new window.BMapGL.Point(116.4126336237026, 39.907738095150389), 'node');
            this.addRadarOverlay(data.lat, data, 'node' + (index + 1));
            
          })
  //         window.BMapGL.Convertor.translate({lng: node.long,lat: node.lat}, 1, 5, function(data) {
  //   if (data.status == 0) {
  //     console.log(data)
  //     // baseStation.marker.setPosition(data.points[0]);
  //     // baseStation.customOverlay.setPosition(data.points[0]);
  //   }
  // });
          // console.log(node, index, 'node');
          // node.lat = 29.81 + index / 100;
          // node.long = 121.56 - index / 100;
          // this.addRadarOverlay(node.lat, new window.BMapGL.Point(node.long, node.lat), 'node' + (index + 1));
          // this.addRadarOverlay(29.8100979777, new window.BMapGL.Point(121.56847909, 29.8100979777), 'node');
         //  this.addRadarOverlay(29.79, new window.BMapGL.Point(121.39, 29.79), 'node');
        })
        console.log(this.nodeList, "res");
      }).catch(err => {
        console.log(err,'err')
      });
    }
  },
};
</script>
<style scoped>
</style>