/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 11:46:31
 * @LastEditTime: 2022-10-13 12:16:49
 * @FilePath: /wbmanageTool/manage-tool/src/route.js
 */
import Vue from 'vue';
import Router from 'vue-router';
import Home from './view/Home';
import TuoPu from './view/TuoPu/index';
import Map from './view/Map/index';
import Login from './view/Login/index';
import Layout from './components/Layout.vue';
Vue.use(Router);
const routes = [
    {
        path: '/tuopu',
        name: 'TuoPu',
       component: Layout,
       children: [
         {path: '/tuopu',component: TuoPu}
        ]
    },
    {
        path: '/map',
        component: Layout,
        children: [
         {path: '/map',component: Map}
        ]
     },
     {
        path: '/index',
        name: 'Home',
        component: Layout,
        children: [
         {path: '/index',component: Home}
        ]
     },
     {
        path: '/',
        name: 'Home',
        component: Layout,
        children: [
         {path: '/',component: Home}
        ]
     },
     {
        path: '/login',
        name: 'Login',
        component: Login,
     }
];
const router = new Router({
    routes,
    mode: 'hash'
  })
export default router;
