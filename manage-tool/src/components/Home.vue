<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-09-19 14:22:12
 * @FilePath: /wbmanageTool/manage-tool/src/components/home.vue
-->
<template>
  <el-container>
    <el-header>
      <div class="header-title">迈实科技</div>
      <div class="header-set"><Button>设置</Button></div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="activeIndex"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>总览</span>
            </template>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">海淀支队</template>
            <el-menu-item index="2-1">拓扑</el-menu-item>
            <el-menu-item index="2-2">地图</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">丰台支队</template>
            <el-menu-item index="3-1">拓扑</el-menu-item>
            <el-menu-item index="3-2">地图</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">朝阳支队</template>
            <el-menu-item index="4-1">拓扑</el-menu-item>
            <el-menu-item index="4-2">地图</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
		<router-view/>
	</el-main>
    </el-container>
  </el-container>
</template>
<script>
import { Button } from "element-ui";
export default {
  name: "HomeCom",
  props: {
    msg: String,
  },
  components: {
    Button,
  },
  data() {
    return {
      activeIndex: "1",
    };
  },
  methods: {
    handleSelect(key) {
		console.log(key,'ppp')
      this.activeIndex = key;
	  console.log(key)
	  this.$router.push('/dashboard');
	 
    },
  },
};
</script>
<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  height: 60px;
  line-height: 60px;
  display: flex;
  justify-content: space-around;
  text-align: left;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  height: calc(100vh - 60px);
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  height: calc(100vh - 60px);
}
</style>