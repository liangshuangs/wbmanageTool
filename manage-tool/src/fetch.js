/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 20:17:58
 * @LastEditTime: 2022-10-15 14:14:07
 * @FilePath: /wbmanageTool/manage-tool/src/fetch.js
 */
import axios from 'axios';
import { getCookie } from './util';
export function fetchService(params) {
  const url = window.myHost + params.url;
  const data = params.params || {};
  const method = params.method || 'get';
  const token = getCookie('TOKEN');
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  if (['post','DELETE', 'put'].includes(method)) {
    return axios({
      method,
      headers: {
        token
      },
      url,
      data: data
    }).then((res) => {
      if (res && +res.status === 200) {
        if (res.data && +res.data.code === 0) {
          return Promise.resolve(res.data);
        } else if (res.data && +res.data.code === 4) {
          window.location.href = './#/login';
          return;
        }
      }
      return Promise.reject(res.data);
    }).catch(err => {
      return Promise.reject(err);
    })
  } else {
    return axios({
      method,
      url,
      headers: {
        token
      },
      params: data
    }).then((res) => {
      if (res && +res.status === 200) {
        if (res.data && +res.data.code === 0) {
          return Promise.resolve(res.data);
        } else if (res.data && +res.data.code === 4) {
          window.location.href = './#/login';
          return;
        }
      }
      return Promise.reject(res.data);
    }).catch(err => {
      return Promise.reject(err);
    })
  }

}