/**/﻿_jsload&&_jsload('marker', 'C.extend(cP.prototype,{initialize:function(e){this.map=e;this._addDom();this._bind();if(this.domElement){this.domElement.hashCode=this.hashCode}C.BaseClass.call(this,this.hashCode);if(!this._visible){C.hide(this.domElement)}this.dispatchEvent(new a6("ondomready"));return this.domElement},_bind:function(){if(!this.domElement){return}var e=this;var T=this.map;function i(hL,hK){var hJ=hL.srcElement||hL.target;var hI=hL.clientX||hL.pageX;var hN=hL.clientY||hL.pageY;if(hL&&hK&&hI&&hN&&hJ){var hM=C.Dom.getOffset(T.container);hK.pixel=new eb(hI-hM.left,hN-hM.top);hK.point=T.pixelToPointIn(hK.pixel);hK.latLng=T.pixelToPoint(hK.pixel);return hK}else{return hK}}C.on(this.domElement,"mouseover",function(hI){if(!e._dragstarted){e.dispatchEvent(i(hI,new a6("onmouseover").inherit(hI)))}});C.on(this.domElement,"mouseout",function(hI){if(!e._dragstarted){e.dispatchEvent(i(hI,new a6("onmouseout").inherit(hI)))}});if(fW()){C.on(this.domElement,"touchstart",function(hI){e._bind._touchStartPos=new eb(hI.changedTouches[0].clientX,hI.changedTouches[0].clientY)});C.on(this.domElement,"touchend",function(hK){var hJ=new Date().getTime();var hI=new eb(hK.changedTouches[0].clientX,hK.changedTouches[0].clientY);if(Math.abs(hI.x-e._bind._touchStartPos.x)>10||Math.abs(hI.y-e._bind._touchStartPos.y)>10){e._bind._touchStartPos=null;return}e.dispatchEvent(i(hK,new a6("onclick").inherit(hK)));if(e._config&&typeof e._config.click==="function"){e._config.click()}if(e.map&&hJ-e._dblclickTime<e.map.config.clickInterval){e.dispatchEvent(i(hK,new a6("ondblclick").inherit(hK)))}e._dblclickTime=hJ})}C.on(this.domElement,"click",function(hJ){if(window.TouchEvent&&fW()){return}var hI=hJ.srcElement||hJ.target;while(hI){if(hI===e.domElement){if(e.toString()!=="Marker"||e.toString()==="Marker"&&(!e._lastPt||e._lastPt&&e.getPoint().equals(e._lastPt))){if(e.addStat&&typeof e.addStat==="function"){e.addStat()}e.dispatchEvent(i(hJ,new a6("onclick").inherit(hJ)))}break}else{if(e.map&&e.map.infoWindowDoms&&hI===e.map.infoWindowDoms.popDom){break}}hI=hI.parentNode}});C.on(this.domElement,"mousedown",function(hI){if(e.toString()==="Marker"){e._lastPt=e.getPoint()}e.dispatchEvent(i(hI,new a6("onmousedown").inherit(hI)))});C.on(this.domElement,"mouseup",function(hI){e.dispatchEvent(i(hI,new a6("onmouseup").inherit(hI)))});C.on(this.domElement,"dblclick",function(hJ){e.dispatchEvent(i(hJ,new a6("ondblclick").inherit(hJ)));var hI=hJ.target||hJ.srcElement||{};if(hI.tagName!=="circle"&&hI.tagName!=="oval"){c5(hJ)}});C.on(this.domElement,"contextmenu",function(hI){e.dispatchEvent(i(hI,new a6("onrightclick").inherit(hI)))})},hide:function(){if(this._visible===false){return false}this._visible=false;C.hide(this.domElement);if(this.infoWindow&&this.infoWindow.overlay&&this.infoWindow.overlay===this){this.closeInfoWindow();this.closeSimpleInfoWindow()}return true},show:function(){if(this._visible===true){return false}this._visible=true;if(this._visibleInternal){C.show(this.domElement);return true}else{return false}},setStyle:function(e){if(!this.domElement){return}if(this.siblingElement){this.siblingElement.style.cssText=this.siblingElement.style.cssText+";"+e}else{this.domElement.style.cssText=this.domElement.style.cssText+";"+e}},getPoint:function(T,hI){if(!T){return this.point}else{var e=hI?hI.width:0;var hJ=hI?hI.height:0;if(this.map){var i=this.map.pointToPixelIn(this.point);if(this._config&&this._config.offset){i.x=i.x+this._config.offset.width+e;i.y=i.y+this._config.offset.height+hJ}else{i.x=i.x+e;i.y=i.y+hJ}return this.map.pixelToPointIn(i)}}},setZIndex:function(e){var i=this;i.zIndex=e;i._updateDomZIndex()},_updateDomZIndex:function(){var i=this;var e;if(typeof i.zIndex!=="undefined"){e=i.zIndex}else{e=0;if(i.map&&i.getPoint()){var T=i.getPoint()?i.getPoint().lat:0;e=bf.getZIndex(T,i.map.config.coordType)+(i._config.baseZIndex||0)}}if(i.domElement){i.domElement.style.zIndex=e}},isVisible:function(){if(!this.map){return false}if(this.map._renderType!=="webgl"&&!this.domElement){return false}return !!this._visible},showInternal:function(){if(this._visibleInternal===true){return false}if(this.collisionDetectionFailed===true){return false}this._visibleInternal=true;if(this._visible===true){C.show(this.domElement)}return true},hideInternal:function(e){if(this._visibleInternal===false){return false}this._hideInternalReason=e;this._visibleInternal=false;C.hide(this.domElement);if(this.infoWindow&&this.infoWindow.overlay&&this.infoWindow.overlay===this){this.closeInfoWindow();this.closeSimpleInfoWindow()}return true}});dk.TOP_ZINDEX=bf.getZIndex(-90)+1000000;dk.DRAG_ZINDEX=dk.TOP_ZINDEX+1000000;window.BMAP_ANIMATION_RAISEUP=3;window.BMAP_ANIMATION_DROPDOWN=4;dk._addDragCrossImg=function(T,e){if(!dk._dragCrossImg){dk._dragCrossImg=S("img",{src:eV.imgPath+"drag_cross.png",width:13,height:9});dk._dragCrossImg.style.position="absolute";if(C.Browser.ie===6){delete dk._dragCrossImg;var hI=dk._dragCrossImg=S("div");var i=hI.style;i.position="absolute";i.width="13px";i.height="9px";i.filter=\'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image,src="\'+eV.imgPath+\'drag_cross.png")\'}}var i=dk._dragCrossImg.style;i.left=T.width-6+"px";i.top=T.height-5+"px";e.appendChild(dk._dragCrossImg)};dk._removeDragCrossImg=function(){if(dk._dragCrossImg&&dk._dragCrossImg.parentNode){dk._dragCrossImg.parentNode.removeChild(dk._dragCrossImg)}};C.extend(dk.prototype,{initialize:function(e){cP.prototype.initialize.call(this,e);if(!this._visible){if(this.siblingElement){C.hide(this.siblingElement)}}this.setPoint(this.point);this.setIcon(this._config.icon,this._config.startAnimation);this.setLabel(this._config.label);this.setTitle(this._config.title);if(this._rotation!==0){this.setRotation(this._rotation)}this._initDrag();return this.domElement},_addDom:function(){var e=this.map;if(this.domElement&&this.domElement.parentNode){this.domElement.parentNode.removeChild(this.domElement);this.domElement=null}this.domElement=dC(e.getPanes().markerMouseTarget,this._msTargetRender());if(e.getMapType()==="B_EARTH_MAP"||e._renderType==="webgl"){return}this.siblingElement=dC(e.getPanes().markerPane,this._markerRender());this.siblingElement.hashCode=this.getHashCode()},_msTargetRender:function(){var e=[\'<div class="BMap_Marker BMap_noprint" unselectable="on" \'];e.push(this._config.title?\'title="\'+this._config.title+\'"\':\'""\');e.push(\' style="position:absolute;padding:0;margin:0;border:0;width:0;height:0;-moz-user-select:none;\');e.push(this._config.clickable?"cursor:pointer;":"");e.push("width:"+this._config.icon.size.width+"px;");e.push("height:"+this._config.icon.size.height+"px;");e.push(\'"></div>\');return e.join("")},_markerRender:function(){var e=[\'<div class="BMap_Marker" unselectable="on" \'];e.push(\'style="position:absolute;padding:0;margin:0;border:0;\');e.push(\'width:0;height:0;-moz-user-select:none"></div>\');return e.join("")},draw:function(T){if(!this.domElement){return}T=T||{};var i=this._getPixPos(T.zoom,T.center);if(i.onBack||i.outOfFrustum){this.hideInternal("out-of-view");return}this.showInternal();this.domElement.style.left=i.x+"px";this.domElement.style.top=i.y+"px";if(this.siblingElement){this.siblingElement.style.left=i.x+"px";this.siblingElement.style.top=i.y+"px"}else{if(this.map.getMapType()!=="B_EARTH_MAP"&&this.map._renderType!=="webgl"){this.initialize(this.map)}}if(this.infoWindow!==null&&this.infoWindow.isOpen()){this.infoWindow.setPosition(T.center,T.zoom)}},_getPixPos:function(T,e){var hJ=this._config.offset||new d1(0,0);var hI=this._config.icon.offset||new d1(0,0);var i=this.map.pointToOverlayPixelIn(this.getPoint(),{zoom:T,center:e,fixPosition:true});i.x+=hJ.width-hI.width;i.y+=hJ.height-hI.height;return i},_draw:function(){if(this.map){this.domElement=this.initialize(this.map)}},remove:function(){if(this.siblingElement&&this.siblingElement.parentNode){this.siblingElement.parentNode.removeChild(this.siblingElement)}if(this.infoWindow&&this.infoWindow.overlay&&this.infoWindow.overlay===this){this.closeInfoWindow();this.closeSimpleInfoWindow();this.infoWindow=null}this.siblingElement=null;this.iconDom=null;if(this._config.label){var i=this._config.label;i.setMarker(null);this.map.removeOverlay(i);this._config.label=null}cP.prototype.remove.call(this);var e=new a6("onstatus_change");e.action="remove";e.overlay=this;this.fire(e)},hide:function(){if(cP.prototype.hide.call(this)===false){return false}if(this.siblingElement){C.hide(this.siblingElement)}if(this._config.label){C.hide(this._config.label.domElement)}var e=new a6("onstatus_change");e.overlay=this;e.action="hide";this.fire(e);return true},show:function(){if(cP.prototype.show.call(this)===false){if(this._hideInternalReason==="out-of-view"){var e=new a6("onstatus_change");e.overlay=this;e.action="show";this.fire(e)}return false}this.draw();if(this.siblingElement){C.show(this.siblingElement)}if(this._config.label){C.show(this._config.label.domElement)}var e=new a6("onstatus_change");e.overlay=this;e.action="show";this.fire(e);return true},showInternal:function(){if(cP.prototype.showInternal.call(this)===false){return false}if(!this._visible){return false}if(this.siblingElement){C.show(this.siblingElement)}if(this._config.label){this._config.label.showInternal()}return true},hideInternal:function(e){if(cP.prototype.hideInternal.call(this,e)===false){return false}if(this.siblingElement){C.hide(this.siblingElement)}if(this._config.label){this._config.label.hideInternal(e)}return true},setIcon:function(hL,hJ){if(!hL){return}var hM=this._config.icon.getCurrentImageUrl();var hI=hL.getCurrentImageUrl()!==hM;this._config.icon=hL;if(!this.map||!this.domElement){return}var i=this.map;if(this.iconDom&&this.siblingElement){this.siblingElement.removeChild(this.iconDom);this.iconDom=null}if(this.domElement){var hK=this.domElement.style;hK.width=hL.size.width+"px";hK.height=hL.size.height+"px";hK.transformOrigin=hL.anchor.width+"px "+hL.anchor.height+"px"}if(this.siblingElement){var T=this.iconDom=S("div",{"class":hJ||""});var hN=T.style;hN.position="absolute";hN.padding=hN.margin="0";hN.width=hL.size.width+"px";hN.height=hL.size.height+"px";hN.overflow="hidden";if(hL.imageUrl){T.innerHTML=hL.getHTML()}else{if(hL.imageDom){T.appendChild(hL.imageDom);if(hL.imageSize){hL.imageDom.style.width=hL.imageSize.width+"px";hL.imageDom.style.height=hL.imageSize.height+"px"}}}T.galleryImg=false;this.siblingElement.style.transformOrigin=hL.anchor.width+"px "+hL.anchor.height+"px";this.siblingElement.appendChild(this.iconDom)}this.textureCoord=this.textureCoordGLMap=null;this.draw();var e=new a6("onstatus_change");e.overlay=this;e.action="setIcon";e.imageUrlChanged=hI;this.fire(e)},setRotation:function(i){while(i<0){i+=360}this._rotation=i%360;var e=new a6("onstatus_change");e.overlay=this;e.action="setRotation";this.fire(e);if(!this.map||!this.domElement){return}this.domElement.style.transform="rotate("+i+"deg)";if(this.siblingElement){this.siblingElement.style.transform="rotate("+i+"deg)"}},setLabel:function(e){if(!(e instanceof aI)){return}e._config.enableMassClear=this._config.enableMassClear;this._config.label=e;var i=this;if(!this._config.label._binded){this._config.label._binded=true;this._config.label.addEventListener("remove",function(){i._config.label=null})}if(!this.map){return}e.setPoint(this.point);this.map.addOverlay(e);e.setMarker(this)},_initDrag:function(){if(!this.domElement||this.domElement._binded){return}this.domElement._binded=true;var T=this.map;var hM=this;var hK=0;var hJ=0;var hI=0;var hN={x:0,y:0};function hL(hP,hO){hO.pixel=hP.pixel;hO.point=hP.point;hO.latLng=hP.latLng;return hO}function i(hQ){var hP=hQ.clientX;var hO=hQ.clientY;if(hQ.changedTouches){hP=hQ.changedTouches[0].clientX;hO=hQ.changedTouches[0].clientY}return new eb(hP,hO)}var e=new eb(0,0);this.dragStart=function(hQ){e=i(hQ);if(!hM._config.enableDragging){return}hM._isDragging=true;var hP=T.pointToPixelIn(hM.point);var hO=i(hQ);hK=hO.x-hP.x;hJ=hO.y-hP.y;hI=new Date().getTime();if(hM.map){hM.map.temp._draggingMarker=hM}C.on(document,"mousemove",hM.dragIng);C.on(document,"mouseup",hM.dragEnd);C.on(document,"touchmove",hM.dragIng);C.on(document,"touchend",hM.dragEnd);if(hM.domElement&&hM.domElement.setCapture){hM.domElement.setCapture()}};this.dragIng=function(hU){var hP=i(hU);if(hP.equals(e)){return}e=hP;if(!hM._isDragging){return}var hQ=i(hU);var hR=new eb((hQ.x-hK),(hQ.y-hJ));hN=hR;hM._draggingMovePixel=hR;if((hM._config.restrictDraggingArea&&(hR.x>15&&hR.x<hM.map.width-15)&&(hR.y>30&&hR.y<hM.map.height-15))||!hM._config.restrictDraggingArea){var hO=hM.map.pixelToPointIn(hR);var hS=hM.map.pixelToPoint(hR);var hT={pixel:hR,point:hO,latLng:hS};hM._panByX=hM._panByY=0;if(hR.x<=20||hR.x>=hM.map.width-20||hR.y<=50||hR.y>=hM.map.height-10){if(hR.x<=20){hM._panByX=8}else{if(hR.x>=hM.map.width-20){hM._panByX=-8}}if(hR.y<=50){hM._panByY=8}else{if(hR.y>=hM.map.height-10){hM._panByY=-8}}if(!hM._draggingMoveTimer){hM._draggingMoveTimer=setInterval(function(){T.panBy(hM._panByX,hM._panByY,{newAnimation:true});var hV=T.pixelToPointIn(hM._draggingMovePixel);hM.setPoint(hV)},30)}}else{if(hM._draggingMoveTimer){clearInterval(hM._draggingMoveTimer);hM._draggingMoveTimer=null}hM.setPoint(hO)}if(!hM._dragstarted){hM.dispatchEvent(hL(hT,new a6("ondragstart").inherit(hU)));hM._dragstarted=true;if(hM._config.raiseOnDrag){hM.setAnimation(BMAP_ANIMATION_RAISEUP);dk._addDragCrossImg(hM._config.icon.offset,hM.siblingElement)}}hM.dispatchEvent(hL(hT,new a6("ondragging").inherit(hU)))}};this.dragEnd=function(hO){if(hM.domElement&&hM.domElement.releaseCapture){hM.domElement.releaseCapture()}hM._isDragging=false;if(hM.map){hM.map.temp._draggingMarker=null}C.un(document,"mousemove",hM.dragIng);C.un(document,"mouseup",hM.dragEnd);C.un(document,"touchmove",hM.dragIng);C.un(document,"touchend",hM.dragEnd);hK=hJ=0;if(hM._draggingMoveTimer){clearInterval(hM._draggingMoveTimer);hM._draggingMoveTimer=null}if(hN.x>2||hN.y>2){hM._dragstarted=false;hM.dispatchEvent(hL({pixel:hM.map.pointToPixelIn(hM.getPoint()),point:hM.getPoint(),latLng:ef.convertMC2LL(hM.getPoint())},new a6("ondragend").inherit(hO)));if(hM._config.raiseOnDrag){hM.setAnimation(BMAP_ANIMATION_DROPDOWN);dk._removeDragCrossImg()}hN.x=hN.y=0}hM._updateDomZIndex()};this.delVertexMarker=function(hO){c5(hO);hM.dispatchEvent(hL({pixel:hM.map.pointToPixelIn(hM.getPoint()),point:hM.getPoint(),latLng:ef.convertMC2LL(hM.getPoint())},new a6("onmarkerdelvertex").inherit(hO)))};C.on(this.domElement,"mousedown",this.dragStart);C.on(this.domElement,"touchstart",this.dragStart);C.on(this.domElement,"contextmenu",this.delVertexMarker)},setPoint:function(e){if(!e){return}this.point=this._config.point=new hj(e.lng,e.lat);this.latLng=ef.convertMC2LL(e);if(this._config.label){this._config.label.setPoint(this.point)}this.draw();this._updateDomZIndex();var i=new a6("onstatus_change");i.overlay=this;i.action="setPoint";this.fire(i)},_updateDomZIndex:function(){var i=this;var e;if(i._isDragging===true){e=dk.DRAG_ZINDEX}else{if(i._config.isTop===true){e=dk.TOP_ZINDEX+(i._addi||0)}else{if(typeof i.zIndex!=="undefined"){e=i.zIndex}else{e=0;if(i.map&&i.getPoint()){e=bf.getZIndex(i.getPoint().lat,i.map.config.coordType)+i._config.baseZIndex}}}}if(i.domElement){i.domElement.style.zIndex=e}if(i.siblingElement){i.siblingElement.style.zIndex=e}this._zIndex=e},setTop:function(T,i){this._config.isTop=!!T;if(T){this._addi=i||0}this._updateDomZIndex();var e=new a6("onstatus_change");e.overlay=this;e.action="setTop";this.fire(e)},setTitle:function(e){this._config.title=e||"";if(this.domElement){this.domElement.title=this._config.title}},setOffset:function(i){if(!i){return}this._config.offset=i;this.setPoint(this.getPoint());var e=new a6("onstatus_change");e.overlay=this;e.action="setOffset";this.fire(e)},setAnimation:function(i){var e=this;d2.load("markeranimation",function(){e._setAnimation(i)},true)},_setAnimation:function(i){if(!this.iconDom){return}this._clearAnimation(i!==null);var e=bw[i];if(!e){return}this._execJSAnimation(i)},_clearAnimation:function(i){if(i){if(this._aniObj){this._aniObj.stop();this._aniObj=null}this.iconDom.style.top=this.iconDom.style.left="0px";if(this.shadowDom){this.shadowDom.style.top=this.shadowDom.style.left="0px"}}else{if(this._aniObj){var e=this;this._aniObj.setFinishCallback(function(){e._aniObj=null})}}},_execJSAnimation:function(hK){var hM=this.iconDom.style;var e=false;var hJ;if(this.shadowDom){e=true;hJ=this.shadowDom.style}var T=bw[hK];var hO=this;var hN=T.iconAnis.length,hR=T.options.duration,hQ=hO._aniObj=new o({duration:0,delay:o.INFINITE});var hP=T.iconAnis;var hI=T.shadowAnis;hM.top=hP[0].translate[1]+"px";if(e){hJ.left=hI[0].translate[0]+"px";hJ.top=hI[0].translate[1]+"px"}for(var hL=1;hL<hN;hL++){(function(){var hW=[hP[hL].translate[0]-hP[hL-1].translate[0],hP[hL].translate[1]-hP[hL-1].translate[1]];var hV=[hP[hL-1].translate[0],hP[hL-1].translate[1]];if(e){var hT=[hI[hL].translate[0]-hI[hL-1].translate[0],hI[hL].translate[1]-hI[hL-1].translate[1]];var hS=[hI[hL-1].translate[0],hI[hL-1].translate[1]]}var hU=ci[hP[hL-1].timingFunc];var i=function(){};if(hL===hN-1){if(T.options.loop!==o.INFINITE){i=function(){hO._aniObj=null}}else{i=function(){hO._aniObj.start()}}}hQ.add(new o({duration:(T.iconAnis[hL].percent-hP[hL-1].percent)*hR,fps:40,delay:o.INFINITE,transition:hU,render:function(hX){if(hO.iconDom){hO.iconDom.style.top=hV[1]+Math.round(hX*hW[1])+"px"}if(e&&hO.shadowDom){hO.shadowDom.style.left=hS[0]+Math.round(hX*hT[0])+"px";hO.shadowDom.style.top=hS[1]+Math.round(hX*hT[1])+"px"}},finish:i}))})()}hQ.start()},getVertexInfoForGL:function(){var T=this._config.icon.getRenderData();var e=this.point;var hJ=aB(e.lng);var i=aB(e.lat);var hI=[];this._buildVertexForEachRender(hJ,i,hI);return{vertex:hI,textureCoordGLMap:T.textureCoordGLMap}},_buildVertexForEachRender:function(hP,hO,hM){var hN=this._config.icon;var hI=this._config.offset;var e=0;var hL=[];hL[0]=[-hN.offset.width+hI.width,-(hN.size.height-hN.offset.height)-hI.height];hL[1]=[hN.size.width-hN.offset.width+hI.width,-(hN.size.height-hN.offset.height)-hI.height];hL[2]=[hN.size.width-hN.offset.width+hI.width,hN.offset.height-hI.height];hL[3]=[-hN.offset.width+hI.width,hN.offset.height-hI.height];if(this._rotation!==0){for(var hJ=0;hJ<hL.length;hJ++){var T=vec2.fromValues(hL[hJ][0],hL[hJ][1]);vec2.rotate(T,T,[0,0],dE(-this._rotation));hL[hJ][0]=T[0];hL[hJ][1]=T[1]}}while(e<6){var hK=e<3?e:(e===3?e-3:e-2);hM.push([hP[0],hO[0],hP[1],hO[1],hL[hK][0],hL[hK][1]]);e++}}});var hF=g2.prototype;hF.getHTML=function(){if(!this.imageUrl){return""}var e=[];e.push(\'<img src="\'+this.imageUrl+\'" \');if(this.srcSet){e.push(\'srcset="\'+this.srcSet+\'" \')}e.push(\'style="left:\'+(-this.imageOffset.width)+"px;");e.push("top:"+(-this.imageOffset.height)+"px;");if(this.imageSize){this.imageSize.width&&e.push("width:"+this.imageSize.width+"px;");this.imageSize.height&&e.push("height:"+this.imageSize.height+"px;")}e.push(\'position:absolute;"/>\');return e.join("")};C.extend(aI.prototype,{_addDom:function(){var i=this._config;var hI=this.content;var e=S("label",{"class":"BMapLabel",unselectable:"on"});if(i.title){e.title=i.title}var T=e.style;T.position="absolute";T.MozUserSelect="none";if(i.width===0||i.width==="auto"){T.display="inline"}else{T.width=i.width+"px";T.display="block";T.overflow="hidden"}if(!C.Browser.ie){T.cursor="inherit"}e.innerHTML=hI;this.map.getPanes().labelPane.appendChild(e);this.domElement=e;this.setStyle(this._config.styles);return e},setPoint:function(e){if(e){this.point=this._config.point=e.clone();this.draw()}},draw:function(T){if(this.domElement&&this.getPoint()){var hI=this._config.offset||new d1(0,0);T=T||{};var i=this.map.pointToOverlayPixelIn(this.getPoint(),{zoom:T.zoom,center:T.center,fixPosition:true});if(i.onBack||i.outOfFrustum){this.hideInternal("out-of-view")}else{this.showInternal();this.domElement.style.left=(i.x+hI.width)+"px";this.domElement.style.top=(i.y+hI.height)+"px";this._updateDomZIndex()}}},_draw:function(){if(this.map){if(!this.domElement){this.domElement=this.initialize(this.map)}this.draw()}},setContent:function(e){this.content=e;if(this.domElement){this.domElement.innerHTML=e}},setOpacity:function(e){if(e>=0&&e<=1){this._config.opacity=e}if(this.domElement){this.domElement.style.opacity=e}},setOffset:function(e){if(!e){return}this._config.offset=new d1(e.width,e.height);this.draw()},setStyle:function(i){i=i||{};this._config.styles=C.extend(this._config.styles,i);if(this.domElement){for(var hI in i){try{this.domElement.style[hI]=i[hI]}catch(T){}}}},setTitle:function(e){this._config.title=e||"";if(this.domElement){this.domElement.title=this._config.title}}});C.extend(a8.prototype,{initialize:function(e){cP.prototype.initialize.call(this,e);return this.domElement},_getPixPos:function(hJ,i){var hI=this.map.getZoomUnits();var e=this._config.height/hI/2;var T=this.map.pointToPixelIn(this.getPoint(),{zoom:hJ,center:i,height:e});return T},_draw:function(){if(this.map){this.domElement=this.initialize(this.map)}},_addDom:function(){var e=this.map;if(this.domElement&&this.domElement.parentNode){this.domElement.parentNode.removeChild(this.domElement);this.domElement=null}this.domElement=dC(e.getPanes().markerMouseTarget,this._msTargetRender());if(e.getMapType()==="B_EARTH_MAP"||e._renderType==="webgl"){return}},_msTargetRender:function(){var e=[\'<div class="BMap_Marker BMap_noprint" unselectable="on" \'];e.push(\' style="position:absolute;padding:0;margin:0;border:0;width:0;height:0;-moz-user-select:none;\');e.push(this._config.clickable?"cursor:pointer;":"");e.push("width:"+this._config.size+"px;");e.push("height:"+this._config.size+"px;");e.push(\'"></div>\');return e.join("")},draw:function(hJ){if(!this.domElement){return}hJ=hJ||{};if(hJ.currentTarget){var hI=hJ.currentTarget.zoomLevel;var i=hJ.currentTarget.centerPoint}var T=this._getPixPos(hI,i);this.showInternal();this.domElement.style.left=T.x-this._config.size/2+"px";this.domElement.style.top=T.y-this._config.size/2+"px";if(this.map.getMapType()!=="B_EARTH_MAP"&&this.map._renderType!=="webgl"){this.initialize(this.map)}if(this.infoWindow!==null&&this.infoWindow.isOpen()){this.infoWindow.setPosition(hJ.center,hJ.zoom)}},showInternal:function(){if(cP.prototype.showInternal.call(this)===false){return false}if(!this._visible){return false}return true},hideInternal:function(e){if(cP.prototype.hideInternal.call(this,e)===false){return false}return true},getVertexInfoForGL:function(){var e=this.point;var hI=aB(e.lng);var i=aB(e.lat);var T=[];this._buildVertexForEachRender(hI,i,T);return{vertex:T}},_buildVertexForEachRender:function(hI,e,T){var i=gR.parseHexAndOpacityToRgbaArray(this._config.fillColor,this._config.fillOpacity);T.push([hI[0],e[0],hI[1],e[1],this._config.height,i[0]/255,i[1]/255,i[2]/255,i[3],this._config.size*a1(),this._config.shape])}});');
