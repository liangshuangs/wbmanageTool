<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-10-15 19:48:17
 * @FilePath: /wbmanageTool/manage-tool/src/App.vue
-->
<template>
  <div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "HomeCom",
  props: {
    msg: String,
  }
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>