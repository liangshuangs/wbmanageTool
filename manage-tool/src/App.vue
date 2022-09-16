<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-15 15:03:38
 * @LastEditTime: 2022-09-15 15:15:27
 * @FilePath: /wbmanageTool/manage-tool/src/App.vue
-->
<template>
  <div id="app">y
    <HomeComponent />
  </div>
</template>

<script>
import HomeComponent from './components/home.vue'

export default {
  name: 'App',
  components: {
    HomeComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
