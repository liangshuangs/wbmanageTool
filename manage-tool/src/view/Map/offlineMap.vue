<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-10-11 11:50:18
 * @LastEditTime: 2022-10-11 20:33:54
 * @FilePath: /wbmanageTool/manage-tool/src/view/Map/offlineMap.vue
-->
<template>
  <div id="map_container"></div>
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
      gps: {
        longitude: 0,
        latitude: 0,
        resetCenter: true,
        converted: true,
      },
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
        offset: new window.BMapGL.Size(18, 36),
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
      let time = new Date();
      for (let baseStation of this.baseStationMap.values()) {
        if (baseStation.marker) {
          if (baseStation.longitude == 0 || baseStation.latitude == 0) {
            let pt = this.map.pixelToPoint(new window.BMapGL.Pixel(x, y));
            baseStation.marker.setPosition(pt);
            baseStation.customOverlay.setPosition(pt);
            x -= 80;
          }
          if (baseStation.time.getTime() + 30000 < time.getTime()) {
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
      window.BMapGL.Convertor.translate(
        [new window.BMapGL.Point(baseStation.longitude, baseStation.latitude)],
        1,
        5,
        function (data) {
          baseStation.marker.setPosition(data);
          baseStation.customOverlay.setPosition(data);
        }
      );
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
        let points = [new window.BMapGL.Point(longitude, latitude)];
        window.BMapGL.Convertor.translate(points, 1, 5, (data) => {
          if (data.status == 0) {
            this.map.setCenter(data);
          }
        });
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
              var point1 = baseStation1.marker.getPosition();
              var point2 = baseStation2.marker.getPosition();
              var pixel1 = this.map.pointToPixel(point1);
              var pixel2 = this.map.pointToPixel(point2);
              // var lngDiff = Math.abs(point1.lng - point2.lng) / 2;
              // var latDiff = Math.abs(point1.lat - point2.lat) / 2;
              var xDiff = Math.abs(pixel1.x - pixel2.x) / 2;
              var yDiff = Math.abs(pixel1.y - pixel2.y) / 2;
              // if (point1.lng < point2.lng) point2.lng = point1.lng + lngDiff;
              // else point2.lng = point1.lng - lngDiff;
              // if (point1.lat < point2.lat) point2.lat = point1.lat + latDiff;
              // else point2.lat = point1.lat - latDiff;
              var points = [point1, point2];
              var color = "#00FF00";
              if (signal.intensity <= 0 && signal.intensity >= -68)
                color = "#00FF00";
              else if (signal.intensity < -68 && signal.intensity >= -78)
                color = "#FFFF00";
              else if (signal.intensity < -78 && signal.intensity >= -88)
                color = "#FF0000";
              else color = "#969696";
              if (xDiff > 30 || yDiff > 30) {
                signal.topology = new window.BMapGL.Polyline(points, {
                  enableEditing: false,
                  enableClicking: true,
                  // icons: [new window.BMapGL.IconSequence(arrow, "20", "30")],
                  strokeWeight: "8",
                  strokeOpacity: 1.0,
                  strokeColor: color,
                });
              } else {
                signal.topology = new window.BMapGL.Polyline(points, {
                  enableEditing: false,
                  enableClicking: true,
                  strokeWeight: "8",
                  strokeOpacity: 1.0,
                  strokeColor: color,
                });
              }
              signal.topology.name = "topology";
              this.map.addOverlay(signal.topology);
            }
          }
        }
      }
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
      htmlText.push(
        `<li><div class='left' onclick="handleShowTrackDialog(baseStation)">轨迹</div></li>`
      );
      dynamicLoadScript(
        "//mapopen.bj.bcebos.com/github/BMapGLLib/InfoBox/src/InfoBox.js"
      ).then(() => {
        this.showInfoBox(baseStation, htmlText);
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
          minHeight: "50px",
          borderRadius: "10px",
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
ol li,
ul li {
  list-style: none;
}

.infoBoxContent {
  font-size: 12px;
  border-radius: 10px;
}

.infoBox img {
  display: none;
}

.infoBoxContent .list {
  min-width: 50px;
  border-top: none;
  background: #fff;
  min-height: 50px;
}

.infoBoxContent .list:hover {
  color: blue;
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