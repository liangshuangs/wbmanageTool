/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-23 15:37:34
 * @LastEditTime: 2022-10-15 14:17:45
 * @FilePath: /wbmanageTool/manage-tool/src/util.js
 */
import CryptoJS from "crypto-js";
export const setCookie = (name, value) => {
  sessionStorage.setItem(name, value);
};
export const getCookies = () => {
  try {
    const cookie = document.cookie || '';
    if (!cookie) {
      return {};
    }
    return cookie.split(';').reduce((total, current) => {
      const cookieItem = current.split('=');
      return {
        ...total,
        [cookieItem[0].trim()]: cookieItem[1].trim()
      };
    }, {});
  }
  catch (e) {
    return {};
  }
};

export const getCookie = name => {
  return sessionStorage.getItem(name);
};
// 获取随机数
export const getRandomString = (len = 24) => {
  const string = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz@#$%&";
  const maxPos = string.length;
  let randomString = "";
  for (let i = 0; i < len; i++) {
    randomString += string.charAt(Math.floor(Math.random() * maxPos));
  }
  return randomString;
};
// 3des加密
export const encryptByDES = (message, key) => {
  let keyHex = CryptoJS.enc.Utf8.parse(key);
  let ivHex = message;
  let encrypted = CryptoJS.TripleDES.encrypt(ivHex, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};
export const getKey = (key = "", len) => {
  if (key.length < len) {
    let diffLen = len - key.length;
    for (let i = 0; i < diffLen; i++) {
      key += 0;
    }
  }
  return key;
};
// 动态加载js
export function dynamicLoadScript(url) {
  return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;

      script.onload = function () {
          resolve(url);
      };
      script.onerror = function () {
          reject(new Error('Failed to load ' + url), script);
      };
      document.body.appendChild(script);
  });
}