/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 11:46:31
 * @LastEditTime: 2022-09-23 16:25:12
 * @FilePath: /wbmanageTool/manage-tool/src/route.js
 */
import Vue from 'vue';
import Router from 'vue-router';
import Home from './view/Home';
import TuoPu from './view/TuoPu/index';
import Map from './view/Map/index';
import Login from './view/Login/index';
Vue.use(Router);
const routes = [
    {
        path: '/tuopu',
        name: 'TuoPu',
       component: TuoPu
    },
    {
        path: '/map',
        component: Map
     },
     {
        path: '/index',
        name: 'Home',
        component: Home
     },
     {
        path: '/',
        name: 'Home',
        component: Home
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
