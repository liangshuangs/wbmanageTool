<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 14:48:41
 * @LastEditTime: 2022-10-08 13:21:20
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
let arrow = {
  scale: 0.6,
  strokeColor: "#fff",
  strokeWeight: "2",
};
arrow.name = "topology";
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
      monitorMap: new Map(),
      baseStationMap: new Map(), // 基站信息
    };
  },
  mounted() {
    this.drawMap();
    this.updateBaseStationMap();
    this.UpdateBaseStationPos();
    setTimeout(() => {
      this.updateBaseStationMap();
      this.UpdateBaseStationPos();
      this.updateBaseStationStatus();
      this.showTopology();
    }, 3000);
  },
  methods: {
    drawMap() {
      let map = new window.BMapGL.Map("map_container"); // 创建Map实例
      this.map = map;
      //初始化地图,设置中心点坐标和地图级别
      this.map.centerAndZoom(
        new window.BMapGL.Point(116.41000000022, 39.96030079556),
        12
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
        { text1: "3D地图", text2: "2D地图" },
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
    // 添加自定义控件
    addMapInitControl(x, y, textObj, fn) {
      let myMapInitControl = new MapInitControl({
        anchor: window.BMAP_ANCHOR_TOP_RIGHT,
        offset: new window.BMapGL.Size(x, y),
        text: textObj,
        fn,
      });
      this.map.addControl(myMapInitControl);
    },
    // 添加覆盖物
    addRadarOverlay(node) {
      let radarOverlay = new RadarOverlay({
        lat: node.lat,
        point: node.point,
        text: node.name,
      });
      this.map.addOverlay(radarOverlay);
    },
    handle3D(val) {
      if (val === "2D地图") {
        this.map.setTilt(70);
      } else {
        this.map.setTilt(0);
      }
    },
    // 获取基站拓扑信息
    getTouPu(val) {
      if (val === "获取拓扑") {
        // this.getTuoPuData();
      } else {
        // this.map.setTilt(0);
      }
    },
    // 更新基站状态
    updateBaseStationStatus() {
      var size = this.map.getSize();
    var x = size.width - 480;
    var y = 30;
    var time = new Date();
    for (let baseStation of this.baseStationMap.values()) {
      if (baseStation.marker) {
        if (baseStation.longitude == 0 || baseStation.latitude == 0) {
          var pt = this.map.pixelToPoint(new window.BMapGL.Pixel(x, y));
          baseStation.marker.setPosition(pt);
          baseStation.customOverlay.setPosition(pt);
          x -= 80;
        }
        let img = "assets/base_station_green.png";
        if (baseStation.time.getTime() + 30000 < time.getTime()) {
          img = "assets/base_station_red.png";
        }
        var icon = new window.BMapGL.Icon(img, new window.BMapGL.Size(35, 35));
        baseStation.marker.setIcon(icon);
      }
    }
    },
    // 更新基站
    updateBaseStationMap() {
      const query = this.$route.query || {};
      const url = `${API.topologyList}/${query.type}`;
      const params = {};
      fetchService({ url, params }).then((res) => {
        const newBaseStationMap = new Map();
        const newBaseStationArray = res.List || [];
        for (let i = 0; i < newBaseStationArray.length; i++) {
          const newBaseStation = newBaseStationArray[i];
          const signalArray = newBaseStation.signals || [];
            let newSignalMap = new Map();
            signalArray.map(signal => {
              newSignalMap.set(signal.mac, signal);
            });
          if (this.baseStationMap.has(newBaseStation.mac) === true) {
            const baseStation = this.baseStationMap.get(newBaseStation.mac);
            this.baseStationMap.delete(newBaseStation.mac);
            baseStation.num = newBaseStation.num;
            baseStation.name = newBaseStation.name;
            baseStation.ip = newBaseStation.ip;
            baseStation.mac = newBaseStation.mac;
            baseStation.signalMap = newSignalMap;
            newBaseStationMap.set(baseStation.mac, baseStation);
          } else {
            newBaseStation.longitude = 0.0;
            newBaseStation.latitude = 0.0;
            newBaseStation.time = new Date();
            newBaseStation.signalMap = new Map();
            newBaseStation.marker = null;
            newBaseStation.menu = null;
            newBaseStationMap.set(newBaseStation.mac, newBaseStation);
            newBaseStation.signalMap = newSignalMap;
            this.addBaseStationToMap(newBaseStation);
          }
        }
        this.baseStationMap = newBaseStationMap;
      });
    },
    // 更新基站信号
    updateBaseStationSignal(baseStationSignalArray) {
      console.log(baseStationSignalArray, 'baseStationSignalArray')
      for (var i = 0; i < baseStationSignalArray.length; i++) {
        var baseStationSignal = baseStationSignalArray[i];
        if (this.baseStationMap.has(baseStationSignal.mac) === false) {
          continue;
        } else {
          let newSignalMap = new Map();
          let baseStation = this.baseStationMap.get(baseStationSignal.mac);
          console.log(baseStation, 'baseStation')
          let signalArray = baseStationSignal.signal;
          for (var j = 0; j < signalArray.length; j++) {
            var signal = signalArray[j];
            if (signal.mac == null || signal.mac == "") continue;
            newSignalMap.set(signal.mac, signal);
          }
          for (signal of this.baseStation.signalMap.values()) {
            signal.topology = null;
          }
          baseStation.signalMap.clear();
          baseStation.signalMap = null;
          baseStation.signalMap = newSignalMap;
        }
      }
    },
    // 更新gps
    UpdateBaseStationPos() {
      const query = this.$route.query || {};
      const url = `${API.getGps}/${query.type}`;
      const params = {};
      fetchService({ url, params }).then((res) => {
        const baseStationPosArray = res.List || [];
        baseStationPosArray.map((pos) => {
          const baseStation = this.baseStationMap.get(pos.mac);
          if (baseStation) {
            baseStation.longitude = pos.long;
            baseStation.latitude = pos.lat;
            baseStation.time = new Date();
            this.moveBaseStation(baseStation);
            if (this.gps.resetCenter) {
              this.gps.resetCenter = false;
              this.setCenter(pos.long, pos.lat, this.gps.converted);
            }
            this.gps.longitude = pos.long;
            this.gps.latitude = pos.lat;
            this.gps.converted = true;
          }
        });
      });
    },
    // 移动基站
    moveBaseStation(baseStation) {
      const translate = window.BMapGL.Convertor.translate;
      translate(
        { lng: baseStation.longitude, lat: baseStation.latitude },
        1,
        function (data) {
          baseStation.marker.setPosition(data);
          baseStation.customOverlay.setPosition(data);
        }
      );
    },
    // 添加基站到地图
    addBaseStationToMap(baseStation = {}) {
      if (baseStation.marker !== null) {
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
      var label = new window.BMapGL.Label(baseStation.name, {
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

      // 添加自定义覆盖物
      const customOverlay = new RadarOverlay({
        lat: 0,
        point: new window.BMapGL.Point(0, 0),
        text: baseStation.num,
      });
      this.map.addOverlay(customOverlay);
      baseStation.customOverlay = customOverlay;
      baseStation.marker = marker;
      marker.addEventListener("dragging", function (e) {
        baseStation.longitude = e.point.lng;
        baseStation.latitude = e.point.lat;
        baseStation.customOverlay.setPosition(e.point);
      });
      marker.addEventListener("dragend", function (e) {
        console.log(e, "e");
        // gps.longitude = e.point.lng;
        // gps.latitude = e.point.lat;
        // gps.converted = false;
      });
      marker.addEventListener("mousedown", function () {
        // setContextMenu(baseStation);
      });
    },
    // 显示拓扑信息
    showTopology() {
      for (let baseStation1 of this.baseStationMap.values()) {
        console.log()
        for (let signal of baseStation1.signalMap.values()) {
          for (let baseStation2 of this.baseStationMap.values()) {
            if (signal.mac == baseStation2.mac) {
              if (baseStation1.marker == null || baseStation2.marker == null) {
                console.log('344')
                break;
              }
              console.log(baseStation1, 'baseStation1')
              console.log(baseStation2, 'baseStation2')
              var point1 = baseStation1.marker.getPosition();
              var point2 = baseStation2.marker.getPosition();
              var pixel1 = this.map.pointToPixel(point1);
              var pixel2 = this.map.pointToPixel(point2);
              var lngDiff = Math.abs(point1.lng - point2.lng) / 2;
              var latDiff = Math.abs(point1.lat - point2.lat) / 2;
              var xDiff = Math.abs(pixel1.x - pixel2.x) / 2;
              var yDiff = Math.abs(pixel1.y - pixel2.y) / 2;
              if (point1.lng < point2.lng) point2.lng = point1.lng + lngDiff;
              else point2.lng = point1.lng - lngDiff;
              if (point1.lat < point2.lat) point2.lat = point1.lat + latDiff;
              else point2.lat = point1.lat - latDiff;
              var points = [point1, point2];
              console.log(point1, 'point1')
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
    // 设置中心位置
    setCenter(longitude, latitude, converted) {
      if (longitude == 0 || latitude == 0) {
        return;
      }
      if (converted == true) {
        const _this = this;
        const translate = window.BMapGL.Convertor.translate;
        translate({ lng: longitude, lat: latitude }, 1, function (data) {
          _this.map.setCenter(data);
        });
      } else {
        this.map.setCenter(new window.BMapGL.Point(longitude, latitude));
      }
    },
  },
};
</script>
<style scoped>
</style>