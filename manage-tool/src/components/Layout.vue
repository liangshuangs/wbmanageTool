<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-10-15 19:28:59
 * @FilePath: /wbmanageTool/manage-tool/src/components/Layout.vue
-->
<template>
    <el-container>
      <el-header>
        <div class="header-title">迈实技术</div>
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
            <el-menu-item index="zonglan"  :route="{path: '/'}">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>总览</span>
              </template>
            </el-menu-item>
            <el-submenu v-for="item in menus" :key="item.name" :index="item.name">
              <template slot="title">
                <i class="el-icon-s-home"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item
                :route="{path: '/tuopu', query: {type: item.id}}"
                :index="`${item.name}-1`">
                网络拓扑
              </el-menu-item>
              <el-menu-item
                :route="{path: '/map', query: {type: item.id}}"
                :index="`${item.name}-2`">
                分组地图</el-menu-item>
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
  import {API} from '../api';
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
          url: API.areaList
        }
        fetchService(params).then(res => {
          const list = res.list || [];
          this.menus = list;
        }).catch(err => {
          console.log(err)
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
  <style>
    .el-menu-vertical-demo {
      text-align: left;
      font-size: 16px !important;
    }
    .el-submenu__title {
      font-size: 16px !important;
    }
    .el-menu-item, .el-submenu {
      text-align: left;
      font-size: 16px !important;
    }
  </style>
  <style scoped>
  .el-header {
    background-color: rgb(75,128,191);
    color: #fff;
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
  }
  .el-aside {
    background-color: rgb(75,128,191);
    color: #333;
    text-align: center;
    height: calc(100vh - 60px);
    width: 250px !important;
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    height: calc(100vh - 60px);
    padding: 0 !important;
  }
  .header-title {
    font-weight: 500;
    font-size: 30px;
    padding-left: 40px;
  }
  .el-submenu .el-menu-item {
    text-align: center;
    font-size: 14px !important;
  }
  </style>