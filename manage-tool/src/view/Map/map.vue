<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 14:48:41
 * @LastEditTime: 2022-09-19 18:46:46
 * @FilePath: /wbmanageTool/manage-tool/src/view/Map/map.vue
-->
<template>
    <div id="map_container" style="width: 100%; height: 100%">
    </div>
  </template>
  <script>
  export default {
    name: "MapCom",
    mounted() {
      this.$nextTick(() => {
        this.drawMap();
      });
    },
    methods: {
      drawMap() {
        var map = new window.BMapGL.Map("map_container"); // 创建Map实例
        //初始化地图,设置中心点坐标和地图级别
        map.centerAndZoom(new window.BMapGL.Point(121.56847909, 29.8100979777), 17);
        //开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true);
  
        var navi3DCtrl = new window.BMapGL.NavigationControl3D(); // 添加3D控件
        map.addControl(navi3DCtrl);
  
        var scaleCtrl = new window.BMapGL.ScaleControl(); // 添加比例尺控件
        map.addControl(scaleCtrl);
  
        var zoomCtrl = new window.BMapGL.ZoomControl(); // 添加缩放控件
        map.addControl(zoomCtrl);
        // map.setMapStyleV2({ styleJson: window.stylejson });
      },
      // 创建自定义矿建
      ComplexCustomOverlay() {

      }
    },
  };
  </script>
  <style scoped>
  </style>