<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-09-19 15:41:42
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