/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-09-23 10:56:31
 * @FilePath: /wbmanageTool/manage-tool/vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  // devServer: {
  //   port: 8082, // 端口号
  //   https: false, // https:{type:Boolean}
  //   proxy: {
  //     "/web": {
  //       target: "http://127.0.0.1:3000",
  //       changeOrigin: true
  //     }
  //   }
  // }
})