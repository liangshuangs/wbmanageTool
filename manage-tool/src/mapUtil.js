/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-10-11 16:17:08
 * @LastEditTime: 2022-10-11 16:17:21
 * @FilePath: /wbmanageTool/manage-tool/src/mapUtil.js
 */
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
    this.lat = option.lat;
    this.point = option.point;
    this.text = option.text;
  }
  initialize(map) {
    this.map = map;
    const div = document.createElement("div");
    this.div = div;
    div.style.position = "absolute";
    div.style.zIndex = window.BMapGL.Overlay.getZIndex(this.point.lat);
    div.style.color = "white";
    div.style.height = "18px";
    div.style.lineHeight = "18px";
    div.style.whiteSpace = "nowrap";
    div.style.fontSize = "12px"
    div.style.fontWeight = "900"
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
    this.div.style.top = pixel.y - 7 + "px";
  }
  setPosition(point) {
    var map = this.map;
    this.point = point;
    var pixel = map.pointToOverlayPixel(this.point);
    this.div.style.left = pixel.x + "px";
    this.div.style.top = pixel.y - 7 + "px";
    this.div.style.transform = "translateX(-50%)";
  }
}