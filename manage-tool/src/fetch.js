/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 20:17:58
 * @LastEditTime: 2022-09-22 19:08:34
 * @FilePath: /wbmanageTool/manage-tool/src/fetch.js
 */
import axios from 'axios';
export function fetchService(params) {
  //  const url = 'http://123.60.52.23:3001' + params.url;
   const url = params.url;
    const data = params.params || {};
    return axios({
        method: 'get',
        url,
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
      }).catch(err => {
        return Promise.resolve(err);
      })
}