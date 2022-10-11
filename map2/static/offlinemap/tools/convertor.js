/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-28 16:16:13
 * @LastEditTime: 2022-10-11 10:42:10
 * @FilePath: /wbmanageTool/map2/js/convertor.js
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
    function translate(point,from, to, callback){
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
        // var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from="+ type + "&to=5&x=" + point.lng + "&y=" + point.lat + "&callback=BMap.Convertor." + callbackName;
        // var xyUrl =  `http://api.map.baidu.com/ag/coord/convert?from=${from}&to=${to}&x=${point[0].lng}&y=${point[0].lat}&callback=window.BMapGL.Convertor.`+callbackName;
        var xyUrl = `https://api.map.baidu.com/geoconv/v1/?coords=${point[0].lng},${point[0].lat}&from=${from}&to=${to}&ak=ibLWiaQA3tf6QUsv6AGUO6GSccxMj2gn&callback=window.BMapGL.Convertor.`+ callbackName;
        //动态创建script标签
        load_script(xyUrl);
        window.BMapGL.Convertor[callbackName] = function(xyResult){
            delete window.BMapGL.Convertor[callbackName];    //调用完需要删除改函数
            var point = new window.BMapGL.Point(xyResult.result[0].x, xyResult.result[0].y);
            callback && callback(point);
        }
    }
    
    window.BMapGL = window.BMapGL || {};
    BMapGL.Convertor = {};
    BMapGL.Convertor.translate = translate;
    })();