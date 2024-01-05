import{D as j,V as L,M as z,_ as m,w as T,g as S,s as F}from"./deckgl_layers-f7f5f030.js";const k=85.05113;function C(i,e,n,t){if(n){if(n.userData._googleMap===i)return n;P(n)}const s={click:null,rightclick:null,dblclick:null,mousemove:null,mouseout:null},r=new j({...t,useDevicePixels:t.interleaved?!0:t.useDevicePixels,style:t.interleaved?null:{pointerEvents:"none"},parent:G(e,t.style),initialViewState:{longitude:0,latitude:0,zoom:1},controller:!1});for(const c in s)s[c]=i.addListener(c,a=>H(r,c,a));return r.userData._googleMap=i,r.userData._eventListeners=s,r}function G(i,e){const n=document.createElement("div");if(n.style.position="absolute",Object.assign(n.style,e),"getPanes"in i){var t;(t=i.getPanes())===null||t===void 0||t.overlayLayer.appendChild(n)}else{var s;(s=i.getMap())===null||s===void 0||s.getDiv().appendChild(n)}return n}function P(i){const{_eventListeners:e}=i.userData;for(const n in e)e[n]&&e[n].remove();i.finalize()}function N(i,e){const{width:n,height:t}=R(i),s=e.getProjection(),r=i.getBounds();if(!r)return{width:n,height:t,left:0,top:0};const c=r.getNorthEast(),a=r.getSouthWest(),o=s.fromLatLngToDivPixel(c),l=s.fromLatLngToDivPixel(a),h=b(s,n/2,t/2),f=new google.maps.LatLng(0,h[0]),d=s.fromLatLngToContainerPixel(f),u=s.fromLatLngToDivPixel(f);if(!o||!l||!u||!d)return{width:n,height:t,left:0,top:0};const E=Math.round(u.x-d.x);let _=u.y-d.y;const V=b(s,n/2,0),I=b(s,n/2,t);let p=h[1];const D=h[0];if(Math.abs(p)>k){p=p>0?k:-k;const w=new google.maps.LatLng(p,D),v=s.fromLatLngToContainerPixel(w);_+=v.y-t/2}_=Math.round(_);let g=180*new L(V).sub(I).verticalAngle()/Math.PI;g<0&&(g+=360);const A=i.getHeading()||0;let x=i.getZoom()-1,y;if(g===0)y=t?(l.y-o.y)/t:1;else if(g===A){const w=new L([o.x,o.y]).sub([l.x,l.y]).len(),v=new L([n,-t]).len();y=v?w/v:1}return x+=Math.log2(y||1),{width:n,height:t,left:E,top:_,zoom:x,bearing:g,pitch:i.getTilt(),latitude:p,longitude:D}}function M(i,e){const{width:n,height:t}=R(i),{center:s,heading:r,tilt:c,zoom:a}=e.getCameraParams(),o=25,l=t?n/t:1,h=.75,f=3e14,d=new z().perspective({fovy:o*Math.PI/180,aspect:l,near:h,far:f}),u=.5*d[5];return{width:n,height:t,viewState:{altitude:u,bearing:r,latitude:s.lat(),longitude:s.lng(),pitch:c,projectionMatrix:d,repeat:!0,zoom:a-1}}}function R(i){const e=i.getDiv().firstChild;return{width:e.offsetWidth,height:e.offsetHeight}}function b(i,e,n){const t=new google.maps.Point(e,n),s=i.fromContainerPixelToLatLng(t);return[s.lng(),s.lat()]}function W(i,e){if(i.pixel)return i.pixel;const n=e.getViewports()[0].project([i.latLng.lng(),i.latLng.lat()]);return{x:n[0],y:n[1]}}function H(i,e,n){if(!i.isInitialized)return;const t={type:e,offsetCenter:W(n,i),srcEvent:n};switch(e){case"click":case"rightclick":t.type="click",t.tapCount=1,i._onPointerDown(t),i._onEvent(t);break;case"dblclick":t.type="click",t.tapCount=2,i._onEvent(t);break;case"mousemove":t.type="pointermove",i._onPointerMove(t);break;case"mouseout":t.type="pointerleave",i._onPointerMove(t);break;default:return}}const q=()=>!1,U={depthMask:!0,depthTest:!0,blend:!0,blendFunc:[770,771,1,771],blendEquation:32774};function O(){}const Z={interleaved:!0};class Y{constructor(e){m(this,"props",{}),m(this,"_map",null),m(this,"_deck",null),m(this,"_overlay",null),this.setProps({...Z,...e})}setMap(e){if(e===this._map)return;const{VECTOR:n,UNINITIALIZED:t}=google.maps.RenderingType;if(this._map){var s;!e&&this._map.getRenderingType()===n&&this.props.interleaved&&this._overlay.requestRedraw(),(s=this._overlay)===null||s===void 0||s.setMap(null),this._map=null}e&&(this._map=e,e.getRenderingType()!==t?this._createOverlay(e):e.addListener("renderingtype_changed",()=>{this._createOverlay(e)}))}setProps(e){if(Object.assign(this.props,e),this._deck){const n=this._deck.getCanvas();if(e.style&&n!==null&&n!==void 0&&n.parentElement){const t=n.parentElement.style;Object.assign(t,e.style),e.style=null}this._deck.setProps(e)}}pickObject(e){return this._deck&&this._deck.pickObject(e)}pickMultipleObjects(e){return this._deck&&this._deck.pickMultipleObjects(e)}pickObjects(e){return this._deck&&this._deck.pickObjects(e)}finalize(){this.setMap(null),this._deck&&(P(this._deck),this._deck=null)}_createOverlay(e){const{interleaved:n}=this.props,{VECTOR:t,UNINITIALIZED:s}=google.maps.RenderingType,r=e.getRenderingType();if(r===s)return;const a=r===t&&google.maps.WebGLOverlayView?google.maps.WebGLOverlayView:google.maps.OverlayView,o=new a;o instanceof google.maps.WebGLOverlayView?(n?(o.onAdd=O,o.onContextRestored=this._onContextRestored.bind(this),o.onDraw=this._onDrawVectorInterleaved.bind(this)):(o.onAdd=this._onAdd.bind(this),o.onContextRestored=O,o.onDraw=this._onDrawVectorOverlay.bind(this)),o.onContextLost=this._onContextLost.bind(this)):(o.onAdd=this._onAdd.bind(this),o.draw=this._onDrawRaster.bind(this)),o.onRemove=this._onRemove.bind(this),this._overlay=o,this._overlay.setMap(e)}_onAdd(){this._deck=C(this._map,this._overlay,this._deck,this.props)}_onContextRestored({gl:e}){if(!this._map||!this._overlay)return;const n=()=>{this._overlay&&this._overlay.requestRedraw()},t=C(this._map,this._overlay,this._deck,{gl:e,_customRender:n,...this.props});this._deck=t;const{animationLoop:s}=t;s._renderFrame=()=>{const r=e.getParameter(34964);T(e,{},()=>{s.onRender()}),e.bindBuffer(34962,r)}}_onContextLost(){this._deck&&(P(this._deck),this._deck=null)}_onRemove(){var e;(e=this._deck)===null||e===void 0||e.setProps({layerFilter:q})}_onDrawRaster(){if(!this._deck||!this._map)return;const e=this._deck,{width:n,height:t,left:s,top:r,...c}=N(this._map,this._overlay),a=e.getCanvas();if(a!=null&&a.parentElement){const l=a.parentElement.style;l.left="".concat(s,"px"),l.top="".concat(r,"px")}const o=1e4;e.setProps({width:n,height:t,viewState:{altitude:o,repeat:!0,...c}}),e.redraw()}_onDrawVectorInterleaved({gl:e,transformer:n}){if(!this._deck||!this._map)return;const t=this._deck;if(t.setProps({...M(this._map,n),width:null,height:null}),t.isInitialized){const s=S(e,36006);t.setProps({_framebuffer:s}),t.needsRedraw({clearRedrawFlags:!0}),F(e,{viewport:[0,0,e.canvas.width,e.canvas.height],scissor:[0,0,e.canvas.width,e.canvas.height],stencilFunc:[519,0,255,519,0,255]}),T(e,U,()=>{t._drawLayers("google-vector",{clearCanvas:!1})})}}_onDrawVectorOverlay({transformer:e}){if(!this._deck||!this._map)return;const n=this._deck;n.setProps({...M(this._map,e)}),n.redraw()}}export{Y as G};
