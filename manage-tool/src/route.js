/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 11:46:31
 * @LastEditTime: 2022-09-22 15:35:49
 * @FilePath: /wbmanageTool/manage-tool/src/route.js
 */
import Vue from 'vue';
import Router from 'vue-router';
import Home from './view/Home';
import TuoPu from './view/TuoPu/index';
import Map from './view/Map/index';
import Layout from './components/Layout';
import Login from './view/Login/index';
Vue.use(Router);
const routes = [
    {
        path: '/home',
        name: '_home',
       component: Layout,
       children: [
        {
            path: 'tuopu',
            name: 'TuoPu',
            component: TuoPu
        },
        {
            path: 'map',
            name: 'Map',
            component: Map
        }
       ]
    },
     {
        path: '/index',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'Index',
                component: Home
            }
           ]
     },
     {
        path: '/login',
        component: Login,
     }
];
const router = new Router({
    routes,
    mode: 'hash'
  })
export default router;
