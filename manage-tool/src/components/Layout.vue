<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-09-23 15:58:18
 * @FilePath: /wbmanageTool/manage-tool/src/components/Layout.vue
-->
<template>
    <el-container>
      <el-header>
        <div class="header-title">迈实科技</div>
        <div @click="this.handleSetting" class="header-set"><Button>设置</Button></div>
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
            <el-menu-item index="zonglan"  :route="{path: '/index/index'}">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>总览</span>
              </template>
            </el-menu-item>
            <el-submenu v-for="item in menus" :key="item.name" :index="item.name">
              <template slot="title">{{ item.name }}</template>
              <el-menu-item
                :route="{path: '/home/tuopu', query: {type: item.id}}"
                :index="`${item.name}-1`">
                拓扑
              </el-menu-item>
              <el-menu-item
                :route="{path: '/home/map', query: {type: item.id}}"
                :index="`${item.name}-2`">
                地图</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
      <Setting :visible="showSettingModal"  @closeModal="handleCloseModal" />
    </el-container>
  </template>
  <script>
  import { Button } from "element-ui";
  import Setting from './Setting.vue';
  import {fetchService} from '../fetch';
  export default {
    name: "HomeCom",
    props: {
      msg: String,
    },
    components: {
      Button,
      Setting
    },
    data() {
      return {
        showSettingModal: false,
        activeIndex: "1",
        menus: [],
      };
    },
    mounted() {
      this.getMenus();
    },
    methods: {
      // 获取区域
      getMenus() {
        const params = {
          url: '/web/area_list'
        }
        fetchService(params).then(res => {
          const list = res.list || [];
          this.menus = list;
        })
      },
      handleSelect(key) {
        this.activeIndex = key;
      },
      // 设置
      handleSetting() {
        this.showSettingModal = true;
      },
      handleCloseModal() {
        this.showSettingModal = false;
      } 
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
    padding: 0 !important;
  }
  </style>