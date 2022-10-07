<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-09-23 16:20:00
 * @FilePath: /wbmanageTool/manage-tool/src/App.vue
-->
<template>
  <div>
    <!-- <router-view /> -->
    <Layout />
  </div>
</template>
<script>
  import Layout from './components/Layout.vue';
export default {
  name: "HomeCom",
  components: {
    Layout
  },
  props: {
    msg: String,
  }
};
</script>