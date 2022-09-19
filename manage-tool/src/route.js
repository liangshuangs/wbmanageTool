/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 11:46:31
 * @LastEditTime: 2022-09-19 15:46:19
 * @FilePath: /wbmanageTool/manage-tool/src/route.js
 */
import Vue from 'vue';
import Router from 'vue-router';
import TuoPu from './view/TuoPu/index';
import Map from './view/Map/index';
import Layout from './components/Layout'
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
    }
];
const router = new Router({
    routes,
    mode: 'hash'
  })
export default router;
