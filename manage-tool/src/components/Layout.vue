<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-09-19 15:43:13
 * @FilePath: /wbmanageTool/manage-tool/src/components/Layout.vue
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
            :router="true"
          >
            <el-menu-item index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>总览</span>
              </template>
            </el-menu-item>
            <el-submenu v-for="item in menus" :key="item.key" :index="item.key">
              <template slot="title">{{ item.name }}</template>
              <el-menu-item
                :route="{path: '/home/tuopu'}"
                :index="`${item.key}-1`">
                拓扑
              </el-menu-item>
              <el-menu-item
                :route="{path: '/home/map'}"
                :index="`${item.key}-2`">
                地图</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
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
        menus: [
          {
            name: "海淀支队",
            key: "haidian",
          },
          {
            name: "丰台支队",
            key: "fengtai",
          },
          {
            name: "朝阳支队",
            key: "chaoyang",
          },
        ],
      };
    },
    methods: {
      handleSelect(key) {
        this.activeIndex = key;
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
    justify-content: space-between;
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