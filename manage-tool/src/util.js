/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-23 15:37:34
 * @LastEditTime: 2022-09-28 15:46:19
 * @FilePath: /wbmanageTool/manage-tool/src/util.js
 */
import CryptoJS from "crypto-js";
export const setCookie = (name, value) => {
  const date = new Date();
  date.setTime(date.getTime() + 2 * 24 * 3600 * 1000);
  document.cookie = `${name}=` + value + ';expires=' + date.toGMTString() + ';path=/';
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
  return getCookies()[name];
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
// 自定义控件
export class MapInitControl extends window.BMapGL.Control {
  constructor(option) {
    super();
    // 默认停靠位置和偏移量
    // 也能够由传入的参数控制
    this.defaultAnchor = option.anchor || window.BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = option.offset || new window.BMapGL.Size(10, 10);
    this.text = option.text || { text1: '初始位置', text2: '初始位置' };
    this.fn = option.fn;
  }
  initialize(map) {
    const div = document.createElement('div');
    let textVal = document.createTextNode(this.text.text1);
    div.appendChild(textVal);
    // 设置样式
    div.style.cursor = "pointer";
    div.style.padding = "7px 10px";
    div.style.boxShadow = "0 2px 6px 0 rgba(27, 142, 236, 0.5)";
    div.style.borderRadius = "5px";
    div.style.backgroundColor = "white";
    // 绑定事件
    div.onclick = () => {
      textVal.nodeValue = textVal.nodeValue === this.text.text2 ? this.text.text1 : this.text.text2;
      this.fn(textVal.nodeValue);
    };
    // 添加DOM元素到地图中
    map.getContainer().appendChild(div);
    // 将DOM元素返回
    return div;
  }
}
// 自定义覆盖物
export class RadarOverlay extends window.BMapGL.Overlay {
  constructor(option) {
    super();
    console.log(option, 'option')
    this.lat = option.lat;
    this.point = option.point;
    console.log(this.point, 'this.point')
    this.text = option.text;
  }
  initialize(map) {
    this.map = map;
    const div = document.createElement("div");
    this.div = div;
    div.style.position = "absolute";
    div.style.zIndex = window.BMapGL.Overlay.getZIndex(this.lat);
    div.style.color = "white";
    div.style.height = "40px";
    div.style.width = "40px";
    div.style.lineHeight = "40px";
    div.style.whiteSpace = "nowrap";
    div.style.fontSize = "16px";
    div.style.fontWeight = "900";
    div.style.textAlign = 'center';
    div.style.borderRadius = '50%';
    div.style.backgroundColor = 'red';
    let span = document.createElement("span");
    div.appendChild(span);
    span.appendChild(document.createTextNode(this.text));
    map.getPanes().labelPane.appendChild(div);
    return div;
  }
  draw() {
    let map = this.map;
    var pixel = map.pointToOverlayPixel(this.point);
    this.div.style.left = pixel.x + "px";
    this.div.style.top = pixel.y + "px";
  }
  setPosition() {
    var map = this.map;
    var pixel = map.pointToOverlayPixel(this.point);
    this.div.style.left = pixel.x + "px";
    this.div.style.top = pixel.y - 8 + "px";
    this.div.style.transform = "translateX(-50%)";
  }

}