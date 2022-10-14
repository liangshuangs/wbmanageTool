/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-28 16:16:13
 * @LastEditTime: 2022-10-14 17:53:54
 * @FilePath: /wbmanageTool/manage-tool/public/offlinemap/tools/convertor.js
 */
//2011-7-25
(function(){        //闭包
    function load_script(xyUrl, callback){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = xyUrl;
        //借鉴了jQuery的script跨域方法
        script.onload = script.onreadystatechange = function(){
            if((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")){
                callback && callback();
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if ( head && script.parentNode ) {
                    head.removeChild( script );
                }
            }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        head.insertBefore( script, head.firstChild );
    }
//     pi: 圆周率。 a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
// ee: 椭球的偏心率。
// x_pi: 圆周率转换量
    let pi = 3.14159265358979324;
    let a = 6378245.0;
   let ee = 0.00669342162296594323;
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    function wgs2gcj (lat, lon) {
        var dLat = transformLat(lon - 105.0, lat - 35.0);
        var dLon = transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * pi;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
       dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
       dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
       let mgLat = lat + dLat;
       let mgLon = lon + dLon;
       let point = new window.BMapGL.Point(mgLon, mgLat)
       return point;
    }
    function transformLat(lat, lon) {
        let ret = -100.0 + 2.0 * lat + 3.0 * lon + 0.2 * lon * lon + 0.1 * lat * lon + 0.2 * Math.sqrt(Math.abs(lat));
       ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) * 2.0 / 3.0;
       ret += (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) * 2.0 / 3.0;
       ret += (160.0 * Math.sin(lon / 12.0 * pi) + 320 * Math.sin(lon * pi  / 30.0)) * 2.0 / 3.0;
       return ret;
    }
    function transformLon(lat, lon) {
        let ret = 300.0 + lat + 2.0 * lon + 0.1 * lat * lat + 0.1 * lat * lon + 0.1 * Math.sqrt(Math.abs(lat));
       ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) * 2.0 / 3.0;
       ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0;
       ret += (150.0 * Math.sin(lat / 12.0 * pi) + 300.0 * Math.sin(lat / 30.0 * pi)) * 2.0 / 3.0;
       return ret;
    }
    window.BMapGL = window.BMapGL || {};
    BMapGL.Convertor = {};
    BMapGL.Convertor.translate = wgs2gcj;
    })();