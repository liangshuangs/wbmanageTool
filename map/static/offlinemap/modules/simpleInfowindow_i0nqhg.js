/**/﻿_jsload&&_jsload('simpleInfowindow', '(function(i){var hJ=i.Utils;var T=hJ.format;var e={prefix:"BMap_simple_bubble",windowOffset:[0,0],contentStyle:"display:block",centerStyle:"z-index:3;position:relative;",popStyle:"position:absolute;display:none;cursor:default;;background-color:#fff",bottomStyle:"display:block;z-index:2;position:absolute;width:16px;",tailShadowUrl:eV.imgPath+"tail_shadow.png",tailShadowUrlSrcset:eV.imgPath+"tail_shadow2x.png 2x",tailShadowStyle:"width:16px;height:10px;position:absolute;",tailShadowWidth:16,tailShadowHeight:10};if(FeBrowser.ie<=8&&FeBrowser.ie>0){e.tailShadowUrl=eV.imgPath+"tail_noshadow.png"}e.simpleInfoWindowDomTemplate=T([\'<div class="{prefix}_pop" style="{popStyle}">\',\'<div class="{prefix}_center" style="{centerStyle}">\',\'<div class="{prefix}_content" style="{contentStyle}">\',"</div>","</div>",\'<div class="{prefix}_bottom" style="{bottomStyle}">\',\'<img src="{tailShadowUrl}" srcset="{tailShadowUrlSrcset}" style="{tailShadowStyle}">\',"</div>","</div>"],e);function hI(hN,hL){for(var hM=0,hK=hN.length;hM<hK;++hM){if(hN[hM].className===e.prefix+"_"+hL){return hN[hM]}}}C.extend(hy.prototype,{initialize:function(hL){var hM=this.map=hL.map;this.overlay=hL;this.render();this._bind();this.setContent();this.redraw(null,true);var hK=hM.simpleInfoWindowDoms;if(hK){if(hL.toString()==="Marker"){hK.marker=hL}else{hK.marker=null}}},render:function(){var hN=this.map;var hM=hN.simpleInfoWindowDoms;if(!hM){hM=hN.simpleInfoWindowDoms={};hN.simpleInfoWindow=hN.simpleInfoWindowDoms;var hL=e.simpleInfoWindowDomTemplate;dC(hN.platform,hL);if(hN.platform.lastChild.className===""){hN.platform.removeChild(hN.platform.lastChild)}hM.popDom=hN.platform.lastChild;var hK=hM.popDivs=hM.popDom.getElementsByTagName("DIV");hM.contentMain=hI(hK,"content");hM.contentDiv=hI(hK,"content");hM.centerDiv=hI(hK,"center");hM.bottomDiv=hI(hK,"bottom")}hM.hashCode=hM.popDom.hashCode=this.hashCode},_bind:function(){var hM=this;var hO=hM.map;var hN=hO.simpleInfoWindowDoms;var hK=hN.popDom;var hL=["mousedown","mouseout","mouseover","click","keydown","selectstart"];C.each(hL,function(hP){C.on(hK,hP,h)});C.on(hK,"dblclick",c5);C.on(hK,"contextmenu",c5);if(window.addEventListener){hK.addEventListener("DOMMouseScroll",h,false)}hK=hN=null},_setWinSize:function(hM,hK){var hL=this._config;hM=hM||hL.width;hK=hK||hL.height;if(hK<0){hK=0}this.pShowWidth=hM;this.pShowHeight=hK;this.setPosition()},setWidth:function(hK){hK=hK*1;if(!hK&&hK!==0||isNaN(hK)||hK<0){return}if(hK!==0){if(hK<50){hK=50}if(hK>730){hK=730}}this._config.width=hK;if(this._isMyDom()&&this.isOpen()){var hL=this;this.redraw(function(){hL.setPanToWithDelay()})}},setHeight:function(hK){hK=hK*1;if(!hK&&hK!==0||isNaN(hK)||hK<0){return}if(hK!==0){if(hK<50){hK=50}if(hK>650){hK=650}}this._config.height=hK;var hM=this.map;if(this._isMyDom()&&this.isOpen()){if(this._config.width!==0){hM.simpleInfoWindowDoms.contentDiv.style.width=this._config.width+"px"}var hL=this;this.redraw(function(){hL.setPanToWithDelay()})}},setContent:function(hL){hL=hL||this.content;var hM=this.map;this.content=hL;if(!this._isMyDom()){return}var hK=hM.simpleInfoWindowDoms.contentDiv;hK.innerHTML=hL;if(this._config.width!==0){hK.style.width=this._config.width+"px"}hK.style.display="block"},redraw:function(hR,hP){if(!this._isMyDom()){return}if(!hP&&!this.isOpen()){return}hR=hR||function(){};var hM=this;var hO=100;var hN=hM.map.simpleInfoWindow;var hT=hN.contentDiv.style;var hK=hN.contentMain.style;hT.width=hK.width="auto";hT.height=hK.height="auto";hT.whiteSpace="nowrap";if(hN.popDom.style.display==="none"){hN.popDom.style.visibility="hidden";this.show()}var hQ=hN.contentMain.scrollWidth||0;hQ=hM._config.width===0?hQ:hM._config.width;hQ=hQ<50?50:hQ;hQ=hQ>600?600:hQ;hK.width=hQ+"px";var hL;hL=hN.contentMain.scrollHeight||0;hL=hM._config.height===0?hL:hM._config.height;hM._setWinSize(hQ,hL);if(this.isOpen()){hS()}else{setTimeout(hS,hO)}function hS(){hT.whiteSpace="";hK.overflowX=(hM._config.width===0)?"hidden":"auto";hK.overflowY=(hM._config.height===0)?"hidden":"auto";hL=hN.contentMain.scrollHeight||0;hL=hM._config.height===0?hL:hM._config.height;hL=hL<50?50:hL;hL=hL>440?440:hL;hM._setWinSize(hQ,hL);hN.popDom.style.visibility="";hK.height=hL+"px";hN.centerDiv.style.height=hL+"px";hN.bottomDiv.style.width=hQ+"px";hN.centerDiv.style.width=hQ+"px";hN.popDom.style.width=hQ+"px";hM.dispatchEvent(new a6("onresize"));hM.setPanToWithDelay();hR()}},setPosition:function(hO,hP){if(!this._isMyDom()){return}var hK=this.map.simpleInfoWindowDoms;var hL=this.overlay;var hN=this.map.pointToOverlayPixelIn(hL.getPoint(),{zoom:hP,center:hO});var hM=hL.getIcon();if(hN.onBack||hN.outOfFrustum){C.hide(hK.popDom);return}if(this._visible===true){C.show(hK.popDom)}var hQ=new eb(hN.x-hM.offset.width+hM.infoWindowOffset.width+hL.getOffset().width+this._config.offset.width,hN.y-hM.offset.height+hM.infoWindowOffset.height+hL.getOffset().height+this._config.offset.height);hK.popDom.style.left=-this.pShowWidth/2+hQ.x+e.windowOffset[0]+"px";hK.popDom.style.top=-this.pShowHeight+hQ.y-e.tailShadowHeight+e.windowOffset[1]+"px";hK.bottomDiv.style.left=this.pShowWidth/2-e.tailShadowWidth/2+"px"},setPanToWithDelay:function(hK){var hL=this;setTimeout(function(){hL.setPanTo()},hK||200)},setPanTo:function(){if(!this.overlay||!this.overlay.getPoint()||!this._config.enableAutoPan||!this._isMyDom()){return}var h1=this.map;var hS=h1.simpleInfoWindowDoms;var hM=hS.popDivs;var h2=hS.popDom;if(!hM||!h2){return}var hU;var hN=parseInt(hI(hM,"content").style.width,10)+2;var hY=parseInt(C.Dom.getComputedStyle(hI(hM,"center"),"height"))+parseInt(C.Dom.getComputedStyle(hI(hM,"bottom"),"height"));var hW=parseFloat(h2.style.left,10);var hP=parseFloat(h2.style.top,10);if(this.map._renderType==="webgl"){hW+=parseInt(this.map.platform.style.left,10);hP+=parseInt(this.map.platform.style.top,10)}else{hW+=this.map.offsetX;hP+=this.map.offsetY}var hR=new eb(hW,hP);var hQ=new eb(hN+hW,hY+hP);var hZ,hX;if(this._config.height!==0&&document.all){if(!h1.temp.infoKey){h1.temp.infoKey=-1}hZ=-h1.temp.infoKey;h1.temp.infoKey=-h1.temp.infoKey}hZ=0;hX=0;var hK=10;var hL=this._config.margin[0];var hO=this._config.margin[1];var h0=this._config.margin[2];var hT=this._config.margin[3];if(hR.x<hT){hZ=-hR.x+hT}if(hR.y<hL){hX=-hR.y+hL}if(hQ.x>h1.width-hO){hZ=h1.width-hQ.x-hO}if(hQ.y>h1.height-h0){hX=h1.height-hQ.y-h0}this._loadCollisions();var hV=this._config.collisions;if(hR.x<hV[0][0]&&hR.y<hV[0][1]){if(Math.abs(-hR.x+hV[0][0])<Math.abs(-hR.y+hV[0][1])){hZ=-hR.x+hV[0][0]}else{if(h1.height-hV[0][1]-hV[3][1]<hY){hZ=-hR.x+hV[0][0]}else{hX=-hR.y+hV[0][1]}}if(h1.width-hV[0][0]-hV[1][0]<hN&&hR.y<hV[1][1]){hX=-hR.y+hV[1][1]}}if(hQ.x>h1.width-hV[1][0]&&hR.y<hV[1][1]){if(Math.abs(-hQ.x+h1.width-hV[1][0])<Math.abs(-hR.y+hV[1][1])&&h1.width-hV[0][0]-hV[1][0]>=hN){hZ=-hQ.x+h1.width-hV[1][0]}else{hX=-hR.y+hV[1][1];if(h1.width-hV[0][0]-hV[1][0]<hN&&h1.width-hV[0][0]<hN){hZ=-hR.x+hV[0][0]}}}if(hR.x<hV[3][0]&&hQ.y>h1.height-hV[3][1]){if(Math.abs(-hR.x+hV[3][0])<Math.abs(-hQ.y+h1.height-hV[3][1])&&(Math.abs(-hR.x+hV[3][0])<Math.abs(hX)&&hX!==0||hX===0)&&h1.width-hV[3][0]>=hN){hZ=-hR.x+hV[3][0]}else{hX=-hQ.y+h1.height-hV[3][1]}if(h1.height-hV[0][1]-hV[3][1]<hY&&hR.x<hV[0][0]){hZ=-hR.x+hV[0][0]}}if(hQ.x>h1.width-hV[2][0]&&hQ.y>h1.height-hV[2][1]){if(Math.abs(-hQ.x+h1.width-hV[2][0])<Math.abs(-hQ.y+h1.height-hV[2][1])&&(Math.abs(-hQ.x+h1.width-hV[2][0])<Math.abs(hX)&&hX!==0||hX===0)&&h1.width-hV[0][0]-hV[1][0]>=hN){hZ=-hQ.x+h1.width-hV[2][0]}else{if(h1.height-hV[1][1]-hV[2][1]>=hY){hX=-hQ.y+h1.height-hV[2][1]}else{hX=-hR.y+hV[1][1]}if(h1.width-hV[0][0]-hV[2][0]<hN){hZ=-hR.x+hV[0][0]}}}if(hZ!==0||hX!==0){h1.panBy(hZ,hX,{point:this.getPoint()})}},_loadCollisions:function(){if(!this.map){return}var hL=this.map;this._config.collisions=[[10,10],[10,10],[10,10],[10,10]];var hU=this.map.container;for(var hS=0,hM=hU.children.length;hS<hM;hS++){var hP,hV,hY=!!(typeof hU.children[hS]._anchor!="undefined"&&hU.children[hS]._offset);if(hU.children[hS]._jsobj&&hU.children[hS]._jsobj instanceof a2&&hU.children[hS]._jsobj.blockInfoWindow===true){hP=hU.children[hS]}else{if(hY){hP=hU.children[hS]}else{continue}}var hW=hP.offsetWidth,hT=hP.offsetHeight,hK=hP._jsobj,hO,hR;if(!hK||hY){if(typeof hP._anchor!="undefined"&&hP._offset&&fQ(hP).display!="none"&&fQ(hP).visibility!="hidden"){hO=hP._offset;hR=hP._anchor}else{continue}}else{if(hK.isVisible()===false){continue}hO=hK.getOffset();hR=hK.getAnchor()}switch(hR){case BMAP_ANCHOR_TOP_LEFT:hV=0;break;case BMAP_ANCHOR_TOP_RIGHT:hV=1;break;case BMAP_ANCHOR_BOTTOM_LEFT:hV=3;break;case BMAP_ANCHOR_BOTTOM_RIGHT:hV=2;break;default:break}var hQ=hW+hO.width+10,hN=hT+hO.height+10,hX=this._config.collisions[hV];this._config.collisions[hV]=[hQ>hX[0]?hQ:hX[0],hN>hX[1]?hN:hX[1]]}},show:function(){this._visible=true;if(!this._isMyDom()){return}var hL=this.map.simpleInfoWindowDoms;if(hL.popDom.style.display!="none"){return}C.show(hL.popDom);var hK=new a6("onopen");hK.point=this.getPoint();this.dispatchEvent(hK);this.redraw()},hide:function(){this._visible=false;if(!this._isMyDom()){return false}var hL=this.map.simpleInfoWindowDoms;if(hL.popDom.style.display=="none"){return false}if(this._config.onClosing()===false){return false}C.hide(hL.popDom);var hK=new a6("onclose");hK.point=this.getPoint();this.dispatchEvent(hK);this.map.removeEventListener("click",this.map.temp._clickCloseHandler);this.map.temp._clickCloseBinded=false;this.decontrol();return true},isOpen:function(){if(!this.map){return false}var hK=this.map.temp.infoWin;if(!hK){return false}if(!this._isMyDom()){return false}if(hK&&hK.overlay===this.overlay&&this.map.simpleInfoWindowDoms&&this.map.simpleInfoWindowDoms.popDom.style.display=="none"){return false}else{return true}},_revert:function(){if(!this._isMyDom()){return}var hK=this.map.simpleInfoWindowDoms;hK.contentDiv.innerHTML="";hK.maxContentDiv.innerHTML=""},_setOverflow:function(){var hM=this.map;if(!this._isMyDom()){return}var hL=hM.simpleInfoWindowDoms,hK=hL.contentMain.style;hL._overflowX=hK.overflowX;hL._overflowY=hK.overflowY;hK.overflowX="hidden";hK.overflowY="hidden"},_resetOverflow:function(){var hM=this.map;if(!this._isMyDom()||!hM.simpleInfoWindowDoms._overflowX||!hM.simpleInfoWindowDoms._overflowY){return}var hL=hM.simpleInfoWindowDoms,hK=hL.contentMain.style;hK.overflowX=hL._overflowX;hK.overflowY=hL._overflowY;delete hL._overflowX;delete hL._overflowY},_draw:function(){if(this._visible===true&&this.overlay){this.overlay.openSimpleInfoWindow(this)}},_isMyDom:function(){return(this.map&&this.map.simpleInfoWindowDoms&&this.map.simpleInfoWindowDoms.hashCode==this.hashCode)}});cP.prototype.openSimpleInfoWindow=function(hN){if(this.map&&this.map.temp&&this.map.temp.infoWin instanceof i.InfoWindow){this.map.closeInfoWindow()}var hM=this.map;if(!hN||!this.map||!this.domElement||this.isVisible()===false||hN.toString()!=="SimpleInfoWindow"){return}var hL=hM.temp;if(hL.infoWin&&hL.infoWin.overlay&&hL.infoWin.overlay._fromMap){hM.closeSimpleInfoWindow()}if(hL.infoWin===hN&&hL.infoWin.isOpen()&&hL.infoWin.overlay===this){hN.setPanToWithDelay();return}hM.closeSimpleInfoWindow();this.simpleInfoWindow=hN;if(hL.infoWin===null||hL.infoWin!==hN){hL.infoWin=hN;hN.initialize(this)}else{hN.redraw(null,true)}C.BaseClass.call(hN,hN.hashCode);if(!hL._clickCloseHandler){hL._clickCloseHandler=function(hO){if(hO.overlay||(hO.spots&&hO.spots.length>0)){return}if(hM.temp.infoWin&&hM.temp.infoWin._config.enableCloseOnClick){hM.closeSimpleInfoWindow();hM.removeEventListener("spotclick",hL._clickCloseHandler);hL._clickCloseBinded=false}}}if(!hL._clickCloseBinded){setTimeout(function(){hM.addEventListener("spotclick",hL._clickCloseHandler);hL._clickCloseBinded=true},200)}if(hL._infoWin){delete hL._infoWin}hN.overlay=this;var hK=hM.simpleInfoWindowDoms;this.map.getPanes().floatPane.appendChild(hK.popDom);hN.setPanToWithDelay();this.dispatchEvent(new a6("oninfowindowopen"))};cP.prototype.closeSimpleInfoWindow=function(){if(!this.map||!this.map.simpleInfoWindowDoms){return}var hL=this;if(hL.simpleInfoWindow&&hL.simpleInfoWindow.hashCode===hL.map.simpleInfoWindowDoms.hashCode){try{if(hL.simpleInfoWindow.hide()===true){hL.dispatchEvent(new a6("oninfowindowclose"));hL.map.temp.infoWin=hL.simpleInfoWindow=null}}catch(hK){}}}})(BMapGL);');
