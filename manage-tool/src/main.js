/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 10:29:48
 * @LastEditTime: 2022-09-19 12:19:18
 * @FilePath: /wbmanageTool/manage-tool/src/main.js
 */
import Vue from 'vue';
import App from './App.vue';
import routes from './route';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
	router: routes,
  render: h => h(App)
}).$mount('#app');
