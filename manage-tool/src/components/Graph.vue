<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-21 12:58:16
 * @LastEditTime: 2022-09-21 23:29:20
 * @FilePath: /wbmanageTool/manage-tool/src/components/Graph.vue
-->
<template>
  <div class="main" ref="graph"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "GraphCom",
  props: {
    graphData: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initEchart();
  },
  watch: {
    graphData: {
      handler(newVal) {
        console.log(newVal, 'newVal')
        if(newVal) {
          this.updateEchart(newVal);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      myChart: null,
      options: {},
    };
  },
  methods: {
    // echart
    initEchart() {
      const chartDom = this.$refs['graph']; // document.getElementById("main");
      const myChart = echarts.init(chartDom);
      let option = {
        title: {
          text: "",
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 40,
            roam: false,
            label: {
              show: true,
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20,
            },
            data: [],
            links: [],
            lineStyle: {
              opacity: 0.9,
              width: 1,
              curveness: 0,
            },
          },
        ],
      };
      this.options = option;
      this.myChart = myChart;
    },
    updateEchart(data = []) {
      let len = data.length;
      if (!len) {
        return;
      }
      data = this.handleData(data);
      const nodeData = [];
      let points = this.getAnyPolygonPoints(10, 100, len);
      let links = [];
      data.map((item, index) => {
        const signals = item.signals;
        signals.map((signal) => {
          let link = {};
          link.source = index;
          link.target = signal.index;
          let color = "rgb(150, 150, 150)";
          if (signal.intensity <= 0 && signal.intensity >= -68) {
            color = "rgb(0, 255, 0)";
          } else if (signal.intensity < -68 && signal.intensity >= -78) {
            color = "rgb(255, 255, 0)";
          } else if (signal.intensity < -78 && signal.intensity >= -88) {
            color = "rgb(255, 0, 0)";
          }
          link.lineStyle = {
            curveness: 0.05,
            color,
          };
          links.push(link);
        });
        nodeData.push({
          name: item.name,
          x: points[index].x,
          y: points[index].y,
        });
      });
      this.options.series[0].links = links;
      this.options.series[0].data = nodeData;
      this.myChart.setOption(this.options);
    },
    // 获取多边形的坐标点
    getAnyPolygonPoints(nRadius, size, n) {
      let res = [];
      let nOrignX = size / 2; // 原点
      let nOrignY = size / 2; // 原点
      let dblRadian = (2 * Math.PI) / n; //dblRadian弧度
      let dblStart = Math.PI / 2; // dblStart，开始角度，double
      for (let i = 0; i < n; i++) {
        let x = nOrignX - nRadius * Math.cos(dblStart + dblRadian * i);
        let y = nOrignY - nRadius * Math.sin(dblStart + dblRadian * i);
        res.push({ x, y });
      }
      return res;
    },
    handleData(data) {
      data.map((item) => {
        let signals = item.signals || [];
        signals.map((signal) => {
          let index = data.findIndex((t) => t.mac === signal.mac);
          signal.index = index;
        });
      });
      return data;
    },
  },
};
</script>
<style scoped>
.title {
  display: flex;
}
.main {
  width: 100%;
  min-height: 300px;
}
</style>