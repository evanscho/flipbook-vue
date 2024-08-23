(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".viewport[data-v-64726a36]{-webkit-overflow-scrolling:touch;width:100%;height:100%}.viewport.zoom[data-v-64726a36]{overflow:scroll}.viewport.zoom.drag-to-scroll[data-v-64726a36]{overflow:hidden}.flipbook-container[data-v-64726a36]{position:relative;width:100%;height:100%;transform-origin:top left;-webkit-user-select:none;user-select:none}.click-to-flip[data-v-64726a36]{position:absolute;width:50%;height:100%;top:0;-webkit-user-select:none;user-select:none}.click-to-flip.left[data-v-64726a36]{left:0}.click-to-flip.right[data-v-64726a36]{right:0}.bounding-box[data-v-64726a36]{position:absolute;-webkit-user-select:none;user-select:none}.page[data-v-64726a36]{position:absolute;backface-visibility:hidden}.polygon[data-v-64726a36]{position:absolute;top:0;left:0;background-repeat:no-repeat;backface-visibility:hidden;transform-origin:center left}.polygon.blank[data-v-64726a36]{background-color:#ddd}.polygon .lighting[data-v-64726a36]{width:100%;height:100%}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
(function(g,r){typeof exports=="object"&&typeof module<"u"?module.exports=r(require("rematrix"),require("vue")):typeof define=="function"&&define.amd?define(["rematrix","vue"],r):(g=typeof globalThis<"u"?globalThis:g||self,g.Flipbook=r(g.Rematrix,g.Vue))})(this,function(g,r){"use strict";/*!
 * @license
 * flipbook v1.0.0-beta.5
 * Copyright © 2024 Takeshi Sone.
 * Released under the MIT License.
 */class z{constructor(e){e?e.m?this.m=[...e.m]:this.m=[...e]:this.m=g.identity()}clone(){return new z(this)}multiply(e){this.m=g.multiply(this.m,e)}perspective(e){this.multiply(g.perspective(e))}transformX(e){return(e*this.m[0]+this.m[12])/(e*this.m[3]+this.m[15])}translate(e,o){this.multiply(g.translate(e,o))}translate3d(e,o,a){this.multiply(g.translate3d(e,o,a))}rotateY(e){this.multiply(g.rotateY(e))}toString(){return g.toString(this.m)}}const k="data:image/svg+xml,%3c?xml%20version='1.0'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='500'%20height='500'%20viewBox='0%200%20500%20500'%20fill='transparent'%20style='background-color:%20%23fff'%3e%3ccircle%20cx='250'%20cy='250'%20r='48'%20stroke='%23333'%20stroke-width='2'%20stroke-dasharray='271%2030'%20%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20250%20250'%20to='360%20250%20250'%20dur='1s'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3c/svg%3e",W=(t,e)=>{const o=t.__vccOpts||t;for(const[a,n]of e)o[a]=n;return o},x=t=>t**2,E=t=>1-x(1-t),L=function(e){return e<.5?x(e*2)/2:.5+E((e-.5)*2)/2},F={name:"FlipBook",props:{pages:{type:Array,required:!0},pagesHiRes:{type:Array,default:()=>[]},flipDuration:{type:Number,default:1e3},zoomDuration:{type:Number,default:500},zooms:{type:Array,default:()=>[1,2,4]},perspective:{type:Number,default:2400},nPolygons:{type:Number,default:10},ambient:{type:Number,default:.4},gloss:{type:Number,default:.6},swipeMin:{type:Number,default:3},singlePage:{type:Boolean,default:!1},doublePage:{type:Boolean,default:!1},forwardDirection:{validator:t=>t==="right"||t==="left",default:"right"},centering:{type:Boolean,default:!0},startPage:{type:Number,default:null},loadingImage:{type:String,default:k},clickToZoom:{type:Boolean,default:!0},dragToFlip:{type:Boolean,default:!0},wheel:{type:String,default:"scroll"}},emits:["zoom-start","zoom-end"],data(){return{viewWidth:0,viewHeight:0,imageWidth:null,imageHeight:null,displayedPages:1,nImageLoad:0,nImageLoadTrigger:0,imageLoadCallback:null,currentPage:0,firstPage:0,secondPage:1,zoomIndex:0,zoom:1,zooming:!1,touchStartX:null,touchStartY:null,maxMove:0,activeCursor:null,hasTouchEvents:!1,hasPointerEvents:!1,minX:1/0,maxX:-1/0,preloadedImages:{},flip:{progress:0,direction:null,frontImage:null,backImage:null,auto:!1,opacity:1},currentCenterOffset:null,animatingCenter:!1,startScrollLeft:0,startScrollTop:0,scrollLeft:0,scrollTop:0,loadedImages:{}}},computed:{IE(){return typeof navigator<"u"&&/Trident/.test(navigator.userAgent)},canFlipLeft(){return this.forwardDirection==="left"?this.canGoForward:this.canGoBack},canFlipRight(){return this.forwardDirection==="right"?this.canGoForward:this.canGoBack},canZoomIn(){return!this.zooming&&this.zoomIndex<this.zooms_.length-1},canZoomOut(){return!this.zooming&&this.zoomIndex>0},numPages(){return this.pages[0]==null?this.pages.length-1:this.pages.length},page(){return this.pages[0]!=null?this.currentPage+1:Math.max(1,this.currentPage)},zooms_(){return this.zooms||[1]},canGoForward(){return!this.flip.direction&&this.currentPage<this.pages.length-this.displayedPages},canGoBack(){return!this.flip.direction&&this.currentPage>=this.displayedPages&&this.displayedPages===1?console.log(`canGoBack and will call pageUrl with ${this.firstPage-1}`):console.log("canGoBack and won't call pageUrl"),!this.flip.direction&&this.currentPage>=this.displayedPages&&!(this.displayedPages===1&&!this.pageUrl(this.firstPage-1))},leftPage(){return this.forwardDirection==="right"||this.displayedPages===1?this.firstPage:this.secondPage},rightPage(){return this.forwardDirection==="left"?this.firstPage:this.secondPage},showLeftPage(){return console.log(`showLeftPage with leftPage ${this.leftPage}`),this.pageUrl(this.leftPage)},showRightPage(){return console.log(`showRightPage with rightPage ${this.rightPage}`),this.pageUrl(this.rightPage)&&this.displayedPages===2},cursor(){return this.activeCursor?this.activeCursor:this.IE?"auto":this.clickToZoom&&this.canZoomIn?"zoom-in":this.clickToZoom&&this.canZoomOut?"zoom-out":this.dragToFlip?"grab":"auto"},pageScale(){const e=this.viewWidth/this.displayedPages/this.imageWidth,o=this.viewHeight/this.imageHeight;console.log(`pageScale with viewWidth ${this.viewWidth}, viewHeight ${this.viewHeight}, imageWidth ${this.imageWidth}, imageHeight ${this.imageHeight}`),console.log(`pageScale = ${e<o?e:o}`);const a=e<o?e:o;return a<1?a:1},pageWidth(){return Math.round(this.imageWidth*this.pageScale)},pageHeight(){return Math.round(this.imageHeight*this.pageScale)},xMargin(){return(this.viewWidth-this.pageWidth*this.displayedPages)/2},yMargin(){return(this.viewHeight-this.pageHeight)/2},polygonWidth(){let t=this.pageWidth/this.nPolygons;return t=Math.ceil(t+1/this.zoom),`${t}px`},polygonHeight(){return`${this.pageHeight}px`},polygonBgSize(){return`${this.pageWidth}px ${this.pageHeight}px`},polygonArray(){const t=this.makePolygonArray("front").concat(this.makePolygonArray("back"));return console.log("polygonArray",t),t},boundingLeft(){if(console.log("boundingLeft"),this.displayedPages===1)return this.xMargin;console.log("in boundingLeft, about to call pageUrl");const t=this.pageUrl(this.leftPage)?this.xMargin:this.viewWidth/2;return t<this.minX?t:this.minX},boundingRight(){if(console.log("boundingRight"),this.displayedPages===1)return this.viewWidth-this.xMargin;console.log("in boundingLeft, about to call pageUrl");const t=this.pageUrl(this.rightPage)?this.viewWidth-this.xMargin:this.viewWidth/2;return t>this.maxX?t:this.maxX},centerOffset(){const t=this.centering?Math.round(this.viewWidth/2-(this.boundingLeft+this.boundingRight)/2):0;return this.currentCenterOffset==null&&this.imageWidth!=null&&(this.currentCenterOffset=t),t},centerOffsetSmoothed(){return Math.round(this.currentCenterOffset)},dragToScroll(){return!this.hasTouchEvents},scrollLeftMin(){const t=(this.boundingRight-this.boundingLeft)*this.zoom;return t<this.viewWidth?(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom-(this.viewWidth-t)/2:(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom},scrollLeftMax(){const t=(this.boundingRight-this.boundingLeft)*this.zoom;return t<this.viewWidth?(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom-(this.viewWidth-t)/2:(this.boundingRight+this.centerOffsetSmoothed)*this.zoom-this.viewWidth},scrollTopMin(){const t=this.pageHeight*this.zoom;return t<this.viewHeight?this.yMargin*this.zoom-(this.viewHeight-t)/2:this.yMargin*this.zoom},scrollTopMax(){const t=this.pageHeight*this.zoom;return t<this.viewHeight?this.yMargin*this.zoom-(this.viewHeight-t)/2:(this.yMargin+this.pageHeight)*this.zoom-this.viewHeight},scrollLeftLimited(){return Math.min(this.scrollLeftMax,Math.max(this.scrollLeftMin,this.scrollLeft))},scrollTopLimited(){return Math.min(this.scrollTopMax,Math.max(this.scrollTopMin,this.scrollTop))}},watch:{currentPage(){this.firstPage=this.currentPage,this.secondPage=this.currentPage+1,this.preloadImages()},centerOffset(){if(this.animatingCenter)return;const t=()=>{requestAnimationFrame(()=>{const o=this.centerOffset-this.currentCenterOffset;Math.abs(o)<.5?(this.currentCenterOffset=this.centerOffset,this.animatingCenter=!1):(this.currentCenterOffset+=o*.1,t())})};this.animatingCenter=!0,t()},scrollLeftLimited(t){this.IE?requestAnimationFrame(()=>{this.$refs.viewport.scrollLeft=t}):this.$refs.viewport.scrollLeft=t},scrollTopLimited(t){this.IE?requestAnimationFrame(()=>{this.$refs.viewport.scrollTop=t}):this.$refs.viewport.scrollTop=t},pages(t,e){this.fixFirstPage(),!(e!=null&&e.length)&&(t!=null&&t.length)&&this.startPage>1&&t[0]===null&&(this.currentPage+=1)},startPage(t){this.goToPage(t)}},mounted(){window.addEventListener("resize",this.onResize,{passive:!0}),this.onResize(),[this.zoom]=this.zooms_,this.goToPage(this.startPage)},beforeUnmount(){window.removeEventListener("resize",this.onResize,{passive:!0})},methods:{onResize(){const{viewport:t}=this.$refs;t&&(this.viewWidth=t.clientWidth,this.viewHeight=t.clientHeight,this.displayedPages=this.viewWidth>this.viewHeight&&!this.singlePage||this.doublePage?2:1,this.displayedPages===2&&(this.currentPage&=-2),this.fixFirstPage(),this.minX=1/0,this.maxX=-1/0)},fixFirstPage(){this.displayedPages===1&&this.currentPage===0&&this.pages.length?console.log("in fixFirstPage and will call pageUrl[0]"):console.log("in fixFirstPage and won't call pageUrl[0]"),this.displayedPages===1&&this.currentPage===0&&this.pages.length&&!this.pageUrl(0)&&(this.currentPage+=1)},pageUrl(t,e=!1){if(console.log(`pageUrl of ${t} with hiRes ${e}`),e&&this.zoom>1&&!this.zooming){const o=this.pagesHiRes[t];if(o)return o}return console.log(`this.pages[page] is ${this.pages[t]}`),this.pages[t]||null},pageUrlLoading(t,e=!1){console.log(`pageUrlLoading and about to call pageUrl with page ${t} and hiRes ${e}`);const o=this.pageUrl(t,e);return console.log(`pageUrlLoading: url is ${o}`),e&&this.zoom>1&&!this.zooming?o:(console.log(`pageUrlLoading: about to loadImage with url ${o}`),o?this.loadImage(o):null)},flipLeft(){this.canFlipLeft&&this.flipStart("left",!0)},flipRight(){this.canFlipRight&&this.flipStart("right",!0)},makePolygonArray(t){if(!this.flip.direction)return[];let{progress:e}=this.flip,{direction:o}=this.flip;this.displayedPages===1&&o!==this.forwardDirection&&(e=1-e,o=this.forwardDirection),this.flip.opacity=this.displayedPages===1&&e>.7?1-(e-.7)/.3:1;const a=t==="front"?this.flip.frontImage:this.flip.backImage,n=this.pageWidth/this.nPolygons;let i=this.xMargin,s=!1;this.displayedPages===1?this.forwardDirection==="right"?t==="back"&&(s=!0,i=this.xMargin-this.pageWidth):o==="left"?t==="back"?i=this.pageWidth-this.xMargin:s=!0:t==="front"?i=this.pageWidth-this.xMargin:s=!0:o==="left"?t==="back"?i=this.viewWidth/2:s=!0:t==="front"?i=this.viewWidth/2:s=!0;const l=new z;l.translate(this.viewWidth/2),l.perspective(this.perspective),l.translate(-this.viewWidth/2),l.translate(i,this.yMargin);let h=0;e>.5&&(h=-(e-.5)*2*180),o==="left"&&(h=-h),t==="back"&&(h+=180),h&&(l.translate(this.pageWidth),s&&l.translate(-this.pageWidth),l.rotateY(h));let f=e<.5?e*2*Math.PI:(1-(e-.5)*2)*Math.PI;f===0&&(f=1e-9);const m=this.pageWidth/f;let c=0;const P=f/this.nPolygons;let u=P/2/Math.PI*180;const w=P/Math.PI*180;s&&(u=-(f/Math.PI)*180+w/2),t==="back"&&(u=-u),this.minX=1/0,this.maxX=-1/0;const p=[];for(let d=0;d<this.nPolygons;d+=1){const R=`${d/(this.nPolygons-1)*100}% 0px`,y=l.clone(),T=s?f-c:c;let b=Math.sin(T)*m;s&&(b=this.pageWidth-b);let M=(1-Math.cos(T))*m;t==="back"&&(M=-M),y.translate3d(b,0,M),y.rotateY(-u);const v=y.transformX(0),S=y.transformX(n);this.maxX=Math.max(Math.max(v,S),this.maxX),this.minX=Math.min(Math.min(v,S),this.minX);const X=this.computeLighting(h-u,w);c+=P,u+=w,p.push([`${t}${d}`,a,X,R,y.toString(),Math.abs(Math.round(M))])}return p},computeLighting(t,e){const o=[],a=[-.5,-.25,0,.25,.5];if(this.ambient<1){const n=1-this.ambient,i=a.map(s=>(1-Math.cos((t-e*s)/180*Math.PI))*n);o.push(`
          linear-gradient(to right,
            rgba(0, 0, 0, ${i[0]}),
            rgba(0, 0, 0, ${i[1]}) 25%,
            rgba(0, 0, 0, ${i[2]}) 50%,
            rgba(0, 0, 0, ${i[3]}) 75%,
            rgba(0, 0, 0, ${i[4]}))
        `)}if(this.gloss>0&&!this.IE){const s=a.map(l=>Math.max(Math.cos((t+30-e*l)/180*Math.PI)**200,Math.cos((t-30-e*l)/180*Math.PI)**200));o.push(`
          linear-gradient(to right,
            rgba(255, 255, 255, ${s[0]*this.gloss}),
            rgba(255, 255, 255, ${s[1]*this.gloss}) 25%,
            rgba(255, 255, 255, ${s[2]*this.gloss}) 50%,
            rgba(255, 255, 255, ${s[3]*this.gloss}) 75%,
            rgba(255, 255, 255, ${s[4]*this.gloss}))
        `)}return o.join(",")},flipStart(t,e){console.log(`flipStart, will call pageUrl with ${this.currentPage}`),t!==this.forwardDirection?this.displayedPages===1?(this.flip.frontImage=this.pageUrl(this.currentPage-1),this.flip.backImage=null):(this.flip.frontImage=this.pageUrl(this.firstPage),this.flip.backImage=this.pageUrl(this.currentPage-this.displayedPages+1)):this.displayedPages===1?(this.flip.frontImage=this.pageUrl(this.currentPage),this.flip.backImage=null):(this.flip.frontImage=this.pageUrl(this.secondPage),this.flip.backImage=this.pageUrl(this.currentPage+this.displayedPages)),this.flip.direction=t,this.flip.progress=0,requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.flip.direction!==this.forwardDirection?this.displayedPages===2&&(this.firstPage=this.currentPage-this.displayedPages):this.displayedPages===1?this.firstPage=this.currentPage+this.displayedPages:this.secondPage=this.currentPage+1+this.displayedPages,e&&this.flipAuto(!0)})})},flipAuto(t){const e=Date.now(),o=this.flipDuration*(1-this.flip.progress),a=this.flip.progress;this.flip.auto=!0,this.$emit(`flip-${this.flip.direction}-start`,this.page);const n=()=>{requestAnimationFrame(()=>{const i=Date.now()-e;let s=a+i/o;s>1&&(s=1),this.flip.progress=t?L(s):s,s<1?n():(this.flip.direction!==this.forwardDirection?this.currentPage-=this.displayedPages:this.currentPage+=this.displayedPages,this.$emit(`flip-${this.flip.direction}-end`,this.page),this.displayedPages===1&&this.flip.direction===this.forwardDirection?this.flip.direction=null:this.onImageLoad(1,()=>{this.flip.direction=null}),this.flip.auto=!1)})};n()},flipRevert(){const t=Date.now(),e=this.flipDuration*this.flip.progress,o=this.flip.progress;this.flip.auto=!0;const a=()=>{requestAnimationFrame(()=>{const n=Date.now()-t;let i=o-o*n/e;i<0&&(i=0),this.flip.progress=i,i>0?a():(this.firstPage=this.currentPage,this.secondPage=this.currentPage+1,this.displayedPages===1&&this.flip.direction!==this.forwardDirection?this.flip.direction=null:this.onImageLoad(1,()=>{this.flip.direction=null}),this.flip.auto=!1)})};a()},onImageLoad(t,e){this.nImageLoad=0,this.nImageLoadTrigger=t,this.imageLoadCallback=e},didLoadImage(t){console.log("didLoadImage"),this.imageWidth==null&&(this.imageWidth=(t.target||t.path[0]).naturalWidth,this.imageHeight=(t.target||t.path[0]).naturalHeight,console.log(`about to preloadImages with this.imageWidth ${this.imageWidth}`),this.preloadImages()),this.imageLoadCallback&&++this.nImageLoad>=this.nImageLoadTrigger&&(console.log("calling imageLoadCallback"),this.imageLoadCallback(),this.imageLoadCallback=null)},imageFailedToLoad(t){console.error("Failed to load image",t)},zoomIn(t=null){this.canZoomIn&&(this.zoomIndex+=1,this.zoomTo(this.zooms_[this.zoomIndex],t))},zoomOut(t=null){this.canZoomOut&&(this.zoomIndex-=1,this.zoomTo(this.zooms_[this.zoomIndex],t))},zoomTo(t,e=null){const{viewport:o}=this.$refs;let a,n;if(e){const p=o.getBoundingClientRect();a=e.pageX-p.left,n=e.pageY-p.top}else a=o.clientWidth/2,n=o.clientHeight/2;const i=this.zoom,s=t,l=o.scrollLeft,h=o.scrollTop,f=a+l,m=n+h,c=f/i*s-a,P=m/i*s-n,u=Date.now();this.zooming=!0,this.$emit("zoom-start",t);const w=()=>{requestAnimationFrame(()=>{const p=Date.now()-u;let d=p/this.zoomDuration;(d>1||this.IE)&&(d=1),d=L(d),this.zoom=i+(s-i)*d,this.scrollLeft=l+(c-l)*d,this.scrollTop=h+(P-h)*d,p<this.zoomDuration?w():(this.$emit("zoom-end",t),this.zooming=!1,this.zoom=t,this.scrollLeft=c,this.scrollTop=P)})};w(),s>1&&this.preloadImages(!0)},zoomAt(t){this.zoomIndex=(this.zoomIndex+1)%this.zooms_.length,this.zoomTo(this.zooms_[this.zoomIndex],t)},swipeStart(t){this.touchStartX=t.pageX,this.touchStartY=t.pageY,this.maxMove=0,this.zoom<=1?this.dragToFlip&&(this.activeCursor="grab"):(this.startScrollLeft=this.$refs.viewport.scrollLeft,this.startScrollTop=this.$refs.viewport.scrollTop,this.activeCursor="all-scroll")},swipeMove(t){if(this.touchStartX==null)return!1;const e=t.pageX-this.touchStartX,o=t.pageY-this.touchStartY;return this.maxMove=Math.max(this.maxMove,Math.abs(e)),this.maxMove=Math.max(this.maxMove,Math.abs(o)),this.zoom>1?(this.dragToScroll&&this.dragScroll(e,o),!1):!this.dragToFlip||Math.abs(o)>Math.abs(e)?!1:(this.activeCursor="grabbing",e>0?(this.flip.direction==null&&this.canFlipLeft&&e>=this.swipeMin&&this.flipStart("left",!1),this.flip.direction==="left"&&(this.flip.progress=e/this.pageWidth,this.flip.progress>1&&(this.flip.progress=1))):(this.flip.direction==null&&this.canFlipRight&&e<=-this.swipeMin&&this.flipStart("right",!1),this.flip.direction==="right"&&(this.flip.progress=-e/this.pageWidth,this.flip.progress>1&&(this.flip.progress=1))),!0)},swipeEnd(t){this.touchStartX!=null&&(this.clickToZoom&&this.maxMove<this.swipeMin&&this.zoomAt(t),this.flip.direction!=null&&!this.flip.auto&&(this.flip.progress>.25?this.flipAuto(!1):this.flipRevert()),this.touchStartX=null,this.activeCursor=null)},onTouchStart(t){this.hasTouchEvents=!0,this.swipeStart(t.changedTouches[0])},onTouchMove(t){this.swipeMove(t.changedTouches[0])&&t.cancelable&&t.preventDefault()},onTouchEnd(t){this.swipeEnd(t.changedTouches[0])},onPointerDown(t){if(this.hasPointerEvents=!0,!this.hasTouchEvents&&!(t.which&&t.which!==1)){this.swipeStart(t);try{t.target.setPointerCapture(t.pointerId)}catch{}}},onPointerMove(t){this.hasTouchEvents||this.swipeMove(t)},onPointerUp(t){if(!this.hasTouchEvents){this.swipeEnd(t);try{t.target.releasePointerCapture(t.pointerId)}catch{}}},onMouseDown(t){this.hasTouchEvents||this.hasPointerEvents||t.which&&t.which!==1||this.swipeStart(t)},onMouseMove(t){!this.hasTouchEvents&&!this.hasPointerEvents&&this.swipeMove(t)},onMouseUp(t){!this.hasTouchEvents&&!this.hasPointerEvents&&this.swipeEnd(t)},dragScroll(t,e){this.scrollLeft=this.startScrollLeft-t,this.scrollTop=this.startScrollTop-e},onWheel(t){this.wheel==="scroll"&&this.zoom>1&&this.dragToScroll&&(this.scrollLeft=this.$refs.viewport.scrollLeft+t.deltaX,this.scrollTop=this.$refs.viewport.scrollTop+t.deltaY,t.cancelable&&t.preventDefault()),this.wheel==="zoom"&&(t.deltaY>=100?(this.zoomOut(t),t.cancelable&&t.preventDefault()):t.deltaY<=-100&&(this.zoomIn(t),t.cancelable&&t.preventDefault()))},preloadImages(t=!1){console.log(`preloadImages with hiRes ${t}`),console.log("this.currentPage",this.currentPage);for(let e=this.currentPage-3;e<=this.currentPage+3;e++)this.pageUrlLoading(e);if(t)for(let e=this.currentPage;e<this.currentPage+this.displayedPages;e++){const o=this.pagesHiRes[e];if(o){const a=new Image;a.src=o}}},goToPage(t){console.log(`goToPage with p ${t} and this.page ${this.page}`),console.log("this.pages",this.pages),!(t==null||t===this.page)&&(this.pages[0]==null?this.displayedPages===2&&t===1?this.currentPage=0:this.currentPage=t:this.currentPage=t-1,this.minX=1/0,this.maxX=-1/0,this.currentCenterOffset=this.centerOffset)},loadImage(t){if(console.log(`loadImage of ${t} with imageWidth ${this.imageWidth}, loadedImages[url] ${this.loadedImages[t]}`),console.log("loadedImages",this.loadedImages),this.imageWidth==null||this.loadedImages[t])return t;const e=new Image;return e.onload=()=>{this.$set?this.$set(this.loadedImages,t,!0):this.loadedImages[t]=!0},e.src=t,this.loadingImage}}},D=["src"],U=["src"];function H(t,e,o,a,n,i){return r.openBlock(),r.createElementBlock("div",null,[r.renderSlot(t.$slots,"default",r.normalizeProps(r.guardReactiveProps({canFlipLeft:i.canFlipLeft,canFlipRight:i.canFlipRight,canZoomIn:i.canZoomIn,canZoomOut:i.canZoomOut,page:i.page,numPages:i.numPages,flipLeft:i.flipLeft,flipRight:i.flipRight,zoomIn:i.zoomIn,zoomOut:i.zoomOut})),void 0,!0),r.createElementVNode("div",{ref:"viewport",class:r.normalizeClass(["viewport",{zoom:n.zooming||n.zoom>1,"drag-to-scroll":i.dragToScroll}]),style:r.normalizeStyle({cursor:i.cursor=="grabbing"?"grabbing":"auto"}),onTouchmove:e[9]||(e[9]=(...s)=>i.onTouchMove&&i.onTouchMove(...s)),onPointermove:e[10]||(e[10]=(...s)=>i.onPointerMove&&i.onPointerMove(...s)),onMousemove:e[11]||(e[11]=(...s)=>i.onMouseMove&&i.onMouseMove(...s)),onTouchend:e[12]||(e[12]=(...s)=>i.onTouchEnd&&i.onTouchEnd(...s)),onTouchcancel:e[13]||(e[13]=(...s)=>i.onTouchEnd&&i.onTouchEnd(...s)),onPointerup:e[14]||(e[14]=(...s)=>i.onPointerUp&&i.onPointerUp(...s)),onPointercancel:e[15]||(e[15]=(...s)=>i.onPointerUp&&i.onPointerUp(...s)),onMouseup:e[16]||(e[16]=(...s)=>i.onMouseUp&&i.onMouseUp(...s)),onWheel:e[17]||(e[17]=(...s)=>i.onWheel&&i.onWheel(...s))},[r.createElementVNode("div",{class:"flipbook-container",style:r.normalizeStyle({transform:`scale(${n.zoom})`})},[r.createElementVNode("div",{class:"click-to-flip left",style:r.normalizeStyle({cursor:i.canFlipLeft?"pointer":"auto"}),onClick:e[0]||(e[0]=(...s)=>i.flipLeft&&i.flipLeft(...s))},null,4),r.createElementVNode("div",{class:"click-to-flip right",style:r.normalizeStyle({cursor:i.canFlipRight?"pointer":"auto"}),onClick:e[1]||(e[1]=(...s)=>i.flipRight&&i.flipRight(...s))},null,4),r.createElementVNode("div",{style:r.normalizeStyle({transform:`translateX(${i.centerOffsetSmoothed}px)`})},[i.showLeftPage?(r.openBlock(),r.createElementBlock("img",{key:0,class:"page fixed",style:r.normalizeStyle({width:i.pageWidth+"px",height:i.pageHeight+"px",left:i.xMargin+"px",top:i.yMargin+"px"}),src:i.pageUrlLoading(i.leftPage,!0),onLoad:e[2]||(e[2]=s=>i.didLoadImage(s)),onError:e[3]||(e[3]=s=>i.imageFailedToLoad(s))},null,44,D)):r.createCommentVNode("",!0),i.showRightPage?(r.openBlock(),r.createElementBlock("img",{key:1,class:"page fixed",style:r.normalizeStyle({width:i.pageWidth+"px",height:i.pageHeight+"px",left:n.viewWidth/2+"px",top:i.yMargin+"px"}),src:i.pageUrlLoading(i.rightPage,!0),onLoad:e[4]||(e[4]=s=>i.didLoadImage(s)),onError:e[5]||(e[5]=s=>i.imageFailedToLoad(s))},null,44,U)):r.createCommentVNode("",!0),r.createElementVNode("div",{style:r.normalizeStyle({opacity:n.flip.opacity})},[(r.openBlock(!0),r.createElementBlock(r.Fragment,null,r.renderList(i.polygonArray,([s,l,h,f,m,c])=>(r.openBlock(),r.createElementBlock("div",{key:s,class:r.normalizeClass(["polygon",{blank:!l}]),style:r.normalizeStyle({backgroundImage:l&&`url(${i.loadImage(l)})`,backgroundSize:i.polygonBgSize,backgroundPosition:f,width:i.polygonWidth,height:i.polygonHeight,transform:m,zIndex:c})},[r.withDirectives(r.createElementVNode("div",{class:"lighting",style:r.normalizeStyle({backgroundImage:h})},null,4),[[r.vShow,h.length]])],6))),128))],4),r.createElementVNode("div",{class:"bounding-box",style:r.normalizeStyle({left:i.boundingLeft+"px",top:i.yMargin+"px",width:i.boundingRight-i.boundingLeft+"px",height:i.pageHeight+"px",cursor:i.cursor}),onTouchstart:e[6]||(e[6]=(...s)=>i.onTouchStart&&i.onTouchStart(...s)),onPointerdown:e[7]||(e[7]=(...s)=>i.onPointerDown&&i.onPointerDown(...s)),onMousedown:e[8]||(e[8]=(...s)=>i.onMouseDown&&i.onMouseDown(...s))},null,36)],4)],4)],38)])}const I=W(F,[["render",H],["__scopeId","data-v-64726a36"]]);return window.Vue&&window.Vue.component?Vue.component("flipbook",I):window.Flipbook=I,I});
