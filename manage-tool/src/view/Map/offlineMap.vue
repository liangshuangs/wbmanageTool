<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-10-11 11:50:18
 * @LastEditTime: 2022-10-15 16:12:19
 * @FilePath: /wbmanageTool/manage-tool/src/view/Map/offlineMap.vue
-->
<template>
  <div>
    <div id="map_container"></div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-date-picker
        v-model="dateValue"
        type="datetimerange"
        value-format="yyyy-MM-ddThh:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleGetTrack">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { dynamicLoadScript } from "../../util";
import { fetchService } from "../../fetch";
import { API } from "../../api";
export default {
  name: "OnlineMap",
  props: {
    showTuoPu: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      map: null,
      timer: null,
      dialogVisible: false,
      dialogTitle: "",
      dateValue: "",
      dialogMac: "",
      gps: {
        longitude: 0,
        latitude: 0,
        resetCenter: true,
        converted: true,
      },
      trackPolyline: new Map(),
      baseStationMap: new Map(), // 基站信息
    };
  },
  watch: {
    showTuoPu(newVal) {
      if (newVal) {
        this.showTopology();
      } else {
        this.clearTopology();
      }
    },
  },
  created() {},
  mounted() {
    dynamicLoadScript("./offlinemap/map_load.js").then(() => {
      dynamicLoadScript("./offlinemap/bmapgl.min.js").then(() => {
        dynamicLoadScript("./offlinemap/tools/convertor.js");
        this.initialize();
        this.updateBaseStationMap();
        this.getGPS();
        this.timer = setInterval(() => {
          for (let baseStation of this.baseStationMap.values()) {
            if (
              baseStation.marker &&
              baseStation.longitude != 0 &&
              baseStation.latitude != 0
            ) {
              var point = baseStation.marker.getPosition();
              baseStation.customOverlay.setPosition(point);
            }
          }
          this.getGPS();
          this.updateBaseStationSignal();
          this.updateBaseStationStatus();
        }, 3000);
        window.handleShowTrackDialog = this.handleShowTrackDialog;
      });
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    initialize() {
      let map = new window.BMapGL.Map("map_container"); // 创建Map实例
      this.map = map;
      //初始化地图,设置中心点坐标和地图级别
      this.map.centerAndZoom(
        new window.BMapGL.Point(116.41000000022, 39.96030079556),
        12
      );
      //开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true);
      const scaleCtrl = new window.BMapGL.ScaleControl(); // 添加比例尺控件
      this.map.addControl(scaleCtrl);
      const zoomCtrl = new window.BMapGL.ZoomControl(); // 添加缩放控件
      this.map.addControl(zoomCtrl);
      const navi3DCtrl = new window.BMapGL.NavigationControl3D();
      this.map.addControl(navi3DCtrl);
      this.map.addEventListener("moveend", () => {
        for (let baseStation of this.baseStationMap.values()) {
          if (baseStation.infoBox) {
            baseStation.infoBox.close();
          }
          if (
            baseStation.marker &&
            baseStation.longitude != 0 &&
            baseStation.latitude != 0
          ) {
            var point = baseStation.marker.getPosition();
            baseStation.customOverlay &&
              baseStation.customOverlay.setPosition &&
              baseStation.customOverlay.setPosition(point);
          }
        }
        this.updateBaseStationStatus();
      });

      this.map.addEventListener("zoomend", () => {
        for (let baseStation of this.baseStationMap.values()) {
          if (baseStation.infoBox) {
            baseStation.infoBox.close();
          }
          if (
            baseStation.marker &&
            baseStation.longitude != 0 &&
            baseStation.latitude != 0
          ) {
            var point = baseStation.marker.getPosition();
            baseStation.customOverlay.setPosition(point);
          }
        }
        this.updateBaseStationStatus();
      });

      this.map.addEventListener("mousedown", (e) => {
        if (!e.overlay) {
          this.closeInfoBox();
        }
      });
    },
    // 更新基站
    updateBaseStationMap() {
      const query = this.$route.query || {};
      const url = `${API.topologyList}/${query.type}`;
      const params = {};
      fetchService({ url, params }).then((res) => {
        const newBaseStationMap = new Map();
        let newBaseStationArray = res.List || [];
        for (let i = 0; i < newBaseStationArray.length; i++) {
          let newBaseStation = newBaseStationArray[i];
          if (this.baseStationMap.has(newBaseStation.mac) == true) {
            let baseStation = this.baseStationMap.get(newBaseStation.mac);
            this.baseStationMap.delete(newBaseStation.mac);
            baseStation.num = newBaseStation.num;
            baseStation.name = newBaseStation.name;
            baseStation.ip = newBaseStation.ip;
            baseStation.mac = newBaseStation.mac;
            newBaseStationMap.set(baseStation.mac, baseStation);
          } else {
            newBaseStation.longitude = 0.0;
            newBaseStation.latitude = 0.0;
            newBaseStation.time = new Date();
            newBaseStation.signalMap = new Map();
            newBaseStation.marker = null;
            newBaseStationMap.set(newBaseStation.mac, newBaseStation);
            this.addBaseStationToMap(newBaseStation);
          }
        }
        newBaseStationArray = null;
        for (let baseStation of this.baseStationMap.values()) {
          this.removeBaseStation(baseStation);
        }
        this.baseStationMap.clear();
        this.baseStationMap = null;
        this.baseStationMap = newBaseStationMap;
      }).catch(err => {
        console.log(err)
      });
    },
    // 添加基站到地图
    addBaseStationToMap(baseStation) {
      if (baseStation == null) {
        return;
      }
      if (baseStation.marker != null) {
        return;
      }
      var icon = new window.BMapGL.Icon(
        "assets/base_station_red.png",
        new window.BMapGL.Size(36, 36)
      );
      var marker = new window.BMapGL.Marker(new window.BMapGL.Point(0, 0), {
        icon: icon,
        enableDragging: true,
      });
      marker.setZIndex(100);
      var name = baseStation.name;
      if (name == null || name == "") {
        name = baseStation.ip;
      }
      var label = new window.BMapGL.Label(name, {
        offset: new window.BMapGL.Size(0, 20),
      });
      label.setStyle({
        transform: "translateX(-50%)",
        color: "black",
        fontSize: "12px",
        border: "0",
        backgroundColor: "rgba(255,255,255,1)",
        textShadow: "-2px 0 white,0 2px white,2px 0 white,0 -2px white",
      });
      marker.setLabel(label);
      this.map.addOverlay(marker);
      baseStation.marker = marker;
      import("../../mapUtil").then((module) => {
        const customOverlay = new module.RadarOverlay({
          lat: 0,
          point: new window.BMapGL.Point(0, 0),
          text: baseStation.num,
        });
        this.map.addOverlay(customOverlay);
        baseStation.customOverlay = customOverlay;
        marker.addEventListener("dragging", (e) => {
          baseStation.longitude = e.point.lng;
          baseStation.latitude = e.point.lat;
          baseStation.customOverlay.setPosition(e.point);
        });
        marker.addEventListener("dragend", (e) => {
          this.gps.longitude = e.point.lng;
          this.gps.latitude = e.point.lat;
          this.gps.converted = false;
        });
        marker.addEventListener("rightclick", () => {
          this.setContextMenu(baseStation);
        });
      });
    },
    removeBaseStation(baseStation) {
      this.baseStationMap.delete(baseStation.mac);
      this.removeBaseStationFromMap(baseStation);
      baseStation = null;
    },
    // 从地图删除基站
    removeBaseStationFromMap(baseStation) {
      if (baseStation.marker == null) {
        return;
      }
      if (baseStation.infoBox) {
        baseStation.infoBox.close();
        baseStation.menu = null;
      }
      this.map.removeOverlay(baseStation.marker);
      baseStation.marker = null;
      this.map.removeOverlay(baseStation.customOverlay);
      baseStation.customOverlay = null;
      for (let signal of baseStation.signalMap.values()) {
        signal.topology = null;
      }
    },
    updateBaseStationStatus() {
      let size = this.map.getSize();
      let x = size.width - 480;
      let y = 30;
      for (let baseStation of this.baseStationMap.values()) {
        if (baseStation.marker) {
          if (baseStation.longitude == 0 || baseStation.latitude == 0) {
            let pt = this.map.pixelToPoint(new window.BMapGL.Pixel(x, y));
            baseStation.marker.setPosition(pt);
            baseStation.customOverlay.setPosition(pt);
            x -= 80;
          }
          if (!baseStation.latitude || !baseStation.longitude) {
            let icon = new window.BMapGL.Icon(
              "assets/base_station_red.png",
              new window.BMapGL.Size(35, 35)
            );
            baseStation.marker.setIcon(icon);
          } else {
            let icon = new window.BMapGL.Icon(
              "assets/base_station_green.png",
              new window.BMapGL.Size(35, 35)
            );
            baseStation.marker.setIcon(icon);
          }
        }
      }
    },
    updateBaseStationSignal() {
      const query = this.$route.query || {};
      const url = `${API.topologyList}/${query.type}`;
      const params = {};
      fetchService({ url, params }).then((res) => {
        let baseStationSignalArray = res.List || [];
        for (let i = 0; i < baseStationSignalArray.length; i++) {
          var baseStationSignal = baseStationSignalArray[i];
          if (this.baseStationMap.has(baseStationSignal.mac) == false) continue;
          let baseStation = this.baseStationMap.get(baseStationSignal.mac);
          if (baseStation.name != baseStationSignal.name) {
            var name = baseStationSignal.name;
            if (name == null || name == "") {
              name = baseStationSignal.ip;
            }
            if (baseStation.marker) {
              baseStation.marker.getLabel().setContent(name);
            }
          }
          baseStation.num = baseStationSignal.num;
          baseStation.name = baseStationSignal.name;
          baseStation.ip = baseStationSignal.ip;
          baseStation.mac = baseStationSignal.mac;
          let newSignalMap = new Map();
          let signalArray = baseStationSignal.signals || [];
          for (let j = 0; j < signalArray.length; j++) {
            let signal = signalArray[j];
            if (signal.mac == null || signal.mac == "") continue;
            newSignalMap.set(signal.mac, signal);
          }
          for (let signal of baseStation.signalMap.values()) {
            signal.topology = null;
          }
          baseStation.signalMap.clear();
          baseStation.signalMap = null;
          baseStation.signalMap = newSignalMap;
        }
        baseStationSignalArray = null;
      }).catch(err => {
        console.log(err)
      });
    },
    getGPS() {
      const query = this.$route.query || {};
      const url = `${API.getGps}/${query.type}`;
      const params = {};
      fetchService({ url, params }).then((res) => {
        const GPSArray = res.List || [];
        for (let i = 0; i < GPSArray.length; i++) {
          const gps = GPSArray[i];
          this.UpdateBaseStationPos(gps.mac, gps.long, gps.lat);
        }
      }).catch(err => {
        console.log(err)
      });
    },
    // 更新基站位置
    UpdateBaseStationPos(mac, longitude, latitude) {
      if (longitude == 0 || latitude == 0) {
        return;
      }
      if (this.baseStationMap.has(mac) == false) {
        return;
      }
      let baseStation = this.baseStationMap.get(mac);
      baseStation.longitude = longitude;
      baseStation.latitude = latitude;
      baseStation.time = new Date();
      this.moveBaseStation(baseStation);
      if (this.gps.resetCenter) {
        this.gps.resetCenter = false;
        this.setCenter(longitude, latitude, this.gps.converted);
      }
      this.gps.longitude = longitude;
      this.gps.latitude = latitude;
      this.gps.converted = true;
    },
    moveBaseStation(baseStation) {
      let point = window.BMapGL.Convertor.translate(
        baseStation.latitude,
        baseStation.longitude
      );
      baseStation.marker.setPosition(point);
      baseStation.customOverlay &&
        baseStation.customOverlay.setPosition &&
        baseStation.customOverlay.setPosition(point);
    },
    // 复位
    resetCenter() {
      this.gps.resetCenter = true;
    },
    // 设置中心位置
    setCenter(longitude, latitude, converted) {
      if (longitude == 0 || latitude == 0) {
        return;
      }
      if (converted == true) {
        let newPoint = window.BMapGL.Convertor.translate(latitude, longitude);
        this.map.setCenter(newPoint);
      } else {
        this.map.setCenter(new window.BMapGL.Point(longitude, latitude));
      }
    },
    // 显示拓扑信息
    showTopology() {
      this.clearTopology();
      for (let baseStation1 of this.baseStationMap.values()) {
        for (let signal of baseStation1.signalMap.values()) {
          for (let baseStation2 of this.baseStationMap.values()) {
            if (signal.mac == baseStation2.mac) {
              if (baseStation1.marker == null || baseStation2.marker == null) {
                break;
              }
              let point1 = baseStation1.marker.getPosition();
              let point2 = baseStation2.marker.getPosition();
              let centerPoint = this.getcenterpoiont(point1, point2);
              var points = [point1, centerPoint];
              let imgurl = "/assets/icon1.png";
              var color = "#00FF00";
              if (signal.intensity <= 0 && signal.intensity >= -68) {
                color = "#00FF00";
                imgurl = "/assets/icon1.png";
              } else if (signal.intensity < -68 && signal.intensity >= -78) {
                color = "#FFFF00";
                imgurl = "/assets/icon2.png";
              } else if (signal.intensity < -78 && signal.intensity >= -88) {
                color = "#FF0000";
                imgurl = "/assets/icon3.png";
              } else {
                color = "#969696";
                imgurl = "/assets/icon4.png";
              }
              signal.topology = new window.BMapGL.Polyline(points, {
                strokeTexture: {
                  url: imgurl,
                  width: 16,
                  height: 64,
                },
                enableEditing: false,
                enableClicking: true,
                strokeWeight: 8,
                strokeOpacity: 1,
                strokeColor: color,
              });
              signal.topology.name = "topology";
              this.map.addOverlay(signal.topology);
            }
          }
        }
      }
    },
    getcenterpoiont(point1, point2) {
      let lng1 = point1.lng;
      let lat1 = point1.lat;
      let lng2 = point2.lng;
      let lat2 = point2.lat;
      let lngca = (Math.max(lng1, lng2) - Math.min(lng1, lng2)) / 2;
      let latca = (Math.max(lat1, lat2) - Math.min(lat1, lat2)) / 2;
      let lngcenter = Math.min(lng1, lng2) + lngca;
      let latcenter = Math.min(lat1, lat2) + latca;
      let pointcenter = new window.BMapGL.Point(lngcenter, latcenter);
      return pointcenter;
    },
    clearTopology() {
      let allOverlay = this.map.getOverlays() || [];
      for (let i = 0; i < allOverlay.length; i++) {
        if (allOverlay[i].name != null && allOverlay[i].name == "topology") {
          this.map.removeOverlay(allOverlay[i]);
          allOverlay[i] = null;
        } else if (typeof allOverlay[i].getIcon == "function") {
          if (
            allOverlay[i].getIcon() != null &&
            allOverlay[i].getIcon().name == "topology"
          ) {
            this.map.removeOverlay(allOverlay[i]);
            allOverlay[i] = null;
          }
        }
      }
      for (let baseStation1 of this.baseStationMap.values()) {
        for (let signal of baseStation1.signalMap.values()) {
          signal.topology = null;
        }
      }
    },
    setContextMenu(baseStation) {
      this.closeInfoBox();
      let htmlText = [];
      let ref = baseStation.mac;
      htmlText.push(
        `<li><div class='left' onclick=handleShowTrackDialog("${ref}")>轨迹</div></li>`
      );
      dynamicLoadScript(
        "/offlinemap/tools/infoBox.js"
      ).then(() => {
        this.showInfoBox(baseStation, htmlText);
      });
    },
    handleShowTrackDialog(mac) {
      this.dialogVisible = true;
      for (let baseStation of this.baseStationMap.values()) {
        if (baseStation.mac === mac) {
          this.dialogMac = mac;
          this.dialogTitle = `显示${baseStation.name}的轨迹`;
        }
      }
    },
    handleGetTrack() {
      if (!this.dateValue || this.dateValue.length < 1) {
        return;
      }
      let begin_time = this.dateValue[0];
      let end_time = this.dateValue[1];
      const query = this.$route.query || {};
      const url = `${API.getTrack}/${query.type}/${this.dialogMac}/${begin_time}/${end_time}`;
      const params = {};
      fetchService({ url, params })
        .then((res) => {
          const gpsList = res.List || [];
          this.dialogVisible = false;
          this.closeInfoBox();
          this.showTrack(gpsList, this.dialogMac);
        })
        .catch(() => {
          this.dialogVisible = false;
          this.closeInfoBox();
        });
    },
    clearTrack() {
      for (let trackLine of this.trackPolyline.values()) {
        this.map.removeOverlay(trackLine);
        this.trackPolyline = null;
        this.trackPolyline = new Map();
      }
    },
    showTrack(gpsList, mac) {
      let points = [];
      gpsList.map((item) => {
        let newPoint = window.BMapGL.Convertor.translate(item.lat, item.long);
        points.push(newPoint);
        if (points.length === gpsList.length) {
          for (let trackLine of this.trackPolyline.values()) {
            if (trackLine.mac === mac) {
              this.map.removeOverlay(trackLine);
              this.trackPolyline.delete(mac);
            }
          }
          const trackPolyline = new window.BMapGL.Polyline(points, {
            enableEditing: false,
            enableClicking: true,
            strokeWeight: "8",
            strokeOpacity: 0.8,
            strokeColor: "#18a45b",
          });
          this.trackPolyline.set(mac, trackPolyline);
          this.map.addOverlay(trackPolyline);
        }
      });
    },
    closeInfoBox() {
      for (let baseStation of this.baseStationMap.values()) {
        if (baseStation.infoBox) {
          baseStation.infoBox.close();
        }
      }
    },
    showInfoBox(baseStation, htmlText) {
      let html = ["<div class='infoBoxContent'><div class='list'><ul>"];
      html = html.concat(htmlText);
      html.push("</ul></div>", "</div>");
      const infoBox = new window.BMapGLLib.InfoBox(this.map, html.join(""), {
        boxStyle: {
          background: "#fff",
          minWidth: "50px",
        },
        align: window.INFOBOX_AT_BOTTOM,
        offset: new window.BMapGL.Size(30, 30),
      });
      baseStation.infoBox = infoBox;
      infoBox.open(baseStation.marker);
    },
  },
};
</script>
<style>
.el-dialog__header {
  text-align: left;
}
ol li,
ul li {
  list-style: none;
}

.infoBoxContent {
  font-size: 12px;
}

.infoBox img {
  display: none;
}

.infoBoxContent .list {
  min-width: 100px;
  border-top: none;
  background: #fff;
}
.infoBoxContent li + .infoBoxContent li {
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
}

.infoBoxContent .list:hover {
  color: rgba(27, 142, 236, 1);
}

.infoBoxContent .list ul {
  margin: 0;
  padding: 2px;
  display: flex;
  flex-direction: column;
}

.infoBoxContent .list ul li {
  padding: 2px;
}

.infoBoxContent .list ul .last {
  border: none;
}
</style>
<style scoped>
#map_container {
  height: calc(100vh - 60px);
  width: 100%;
}
</style>