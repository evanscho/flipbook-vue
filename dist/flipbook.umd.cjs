(function(g,o){typeof exports=="object"&&typeof module<"u"?module.exports=o(require("rematrix"),require("vue")):typeof define=="function"&&define.amd?define(["rematrix","vue"],o):(g=typeof globalThis<"u"?globalThis:g||self,g.Flipbook=o(g.Rematrix,g.Vue))})(this,function(g,o){"use strict";/*!
 * @license
 * flipbook v1.0.0-beta.5
 * Copyright © 2024 Takeshi Sone.
 * Released under the MIT License.
 */class z{constructor(e){e?e.m?this.m=[...e.m]:this.m=[...e]:this.m=g.identity()}clone(){return new z(this)}multiply(e){this.m=g.multiply(this.m,e)}perspective(e){this.multiply(g.perspective(e))}transformX(e){return(e*this.m[0]+this.m[12])/(e*this.m[3]+this.m[15])}translate(e,r){this.multiply(g.translate(e,r))}translate3d(e,r,a){this.multiply(g.translate3d(e,r,a))}rotateY(e){this.multiply(g.rotateY(e))}toString(){return g.toString(this.m)}}const k="data:image/svg+xml,%3c?xml%20version='1.0'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='500'%20height='500'%20viewBox='0%200%20500%20500'%20fill='transparent'%20style='background-color:%20%23fff'%3e%3ccircle%20cx='250'%20cy='250'%20r='48'%20stroke='%23333'%20stroke-width='2'%20stroke-dasharray='271%2030'%20%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20250%20250'%20to='360%20250%20250'%20dur='1s'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3c/svg%3e",W=(t,e)=>{const r=t.__vccOpts||t;for(const[a,n]of e)r[a]=n;return r},x=t=>Math.pow(t,2),E=t=>1-x(1-t),L=function(t){return t<.5?x(t*2)/2:.5+E((t-.5)*2)/2},D={name:"Flipbook",props:{pages:{type:Array,required:!0},pagesHiRes:{type:Array,default:()=>[]},flipDuration:{type:Number,default:1e3},zoomDuration:{type:Number,default:500},zooms:{type:Array,default:()=>[1,2,4]},perspective:{type:Number,default:2400},nPolygons:{type:Number,default:10},ambient:{type:Number,default:.4},gloss:{type:Number,default:.6},swipeMin:{type:Number,default:3},singlePage:{type:Boolean,default:!1},doublePage:{type:Boolean,default:!1},forwardDirection:{validator:t=>t=="right"||t=="left",default:"right"},centering:{type:Boolean,default:!0},startPage:{type:Number,default:null},loadingImage:{type:String,default:k},clickToZoom:{type:Boolean,default:!0},dragToFlip:{type:Boolean,default:!0},wheel:{type:String,default:"scroll"}},data(){return{viewWidth:0,viewHeight:0,imageWidth:null,imageHeight:null,displayedPages:1,nImageLoad:0,nImageLoadTrigger:0,imageLoadCallback:null,currentPage:0,firstPage:0,secondPage:1,zoomIndex:0,zoom:1,zooming:!1,touchStartX:null,touchStartY:null,maxMove:0,activeCursor:null,hasTouchEvents:!1,hasPointerEvents:!1,minX:1/0,maxX:-1/0,preloadedImages:{},flip:{progress:0,direction:null,frontImage:null,backImage:null,auto:!1,opacity:1},currentCenterOffset:null,animatingCenter:!1,startScrollLeft:0,startScrollTop:0,scrollLeft:0,scrollTop:0,loadedImages:{}}},computed:{IE(){return typeof navigator<"u"&&/Trident/.test(navigator.userAgent)},canFlipLeft(){return this.forwardDirection=="left"?this.canGoForward:this.canGoBack},canFlipRight(){return this.forwardDirection=="right"?this.canGoForward:this.canGoBack},canZoomIn(){return!this.zooming&&this.zoomIndex<this.zooms_.length-1},canZoomOut(){return!this.zooming&&this.zoomIndex>0},numPages(){return this.pages[0]==null?this.pages.length-1:this.pages.length},page(){return this.pages[0]!=null?this.currentPage+1:Math.max(1,this.currentPage)},zooms_(){return this.zooms||[1]},canGoForward(){return!this.flip.direction&&this.currentPage<this.pages.length-this.displayedPages},canGoBack(){return!this.flip.direction&&this.currentPage>=this.displayedPages&&!(this.displayedPages==1&&!this.pageUrl(this.firstPage-1))},leftPage(){return this.forwardDirection=="right"||this.displayedPages==1?this.firstPage:this.secondPage},rightPage(){return this.forwardDirection=="left"?this.firstPage:this.secondPage},showLeftPage(){return this.pageUrl(this.leftPage)},showRightPage(){return this.pageUrl(this.rightPage)&&this.displayedPages==2},cursor(){return this.activeCursor?this.activeCursor:this.IE?"auto":this.clickToZoom&&this.canZoomIn?"zoom-in":this.clickToZoom&&this.canZoomOut?"zoom-out":this.dragToFlip?"grab":"auto"},pageScale(){const e=this.viewWidth/this.displayedPages/this.imageWidth,r=this.viewHeight/this.imageHeight,a=e<r?e:r;return a<1?a:1},pageWidth(){return Math.round(this.imageWidth*this.pageScale)},pageHeight(){return Math.round(this.imageHeight*this.pageScale)},xMargin(){return(this.viewWidth-this.pageWidth*this.displayedPages)/2},yMargin(){return(this.viewHeight-this.pageHeight)/2},polygonWidth(){let t=this.pageWidth/this.nPolygons;return t=Math.ceil(t+1/this.zoom),`${t}px`},polygonHeight(){return`${this.pageHeight}px`},polygonBgSize(){return`${this.pageWidth}px ${this.pageHeight}px`},polygonArray(){return this.makePolygonArray("front").concat(this.makePolygonArray("back"))},boundingLeft(){if(this.displayedPages===1)return this.xMargin;{const t=this.pageUrl(this.leftPage)?this.xMargin:this.viewWidth/2;return t<this.minX?t:this.minX}},boundingRight(){if(this.displayedPages===1)return this.viewWidth-this.xMargin;{const t=this.pageUrl(this.rightPage)?this.viewWidth-this.xMargin:this.viewWidth/2;return t>this.maxX?t:this.maxX}},centerOffset(){const t=this.centering?Math.round(this.viewWidth/2-(this.boundingLeft+this.boundingRight)/2):0;return this.currentCenterOffset==null&&this.imageWidth!=null&&(this.currentCenterOffset=t),t},centerOffsetSmoothed(){return Math.round(this.currentCenterOffset)},dragToScroll(){return!this.hasTouchEvents},scrollLeftMin(){const t=(this.boundingRight-this.boundingLeft)*this.zoom;return t<this.viewWidth?(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom-(this.viewWidth-t)/2:(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom},scrollLeftMax(){const t=(this.boundingRight-this.boundingLeft)*this.zoom;return t<this.viewWidth?(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom-(this.viewWidth-t)/2:(this.boundingRight+this.centerOffsetSmoothed)*this.zoom-this.viewWidth},scrollTopMin(){const t=this.pageHeight*this.zoom;return t<this.viewHeight?this.yMargin*this.zoom-(this.viewHeight-t)/2:this.yMargin*this.zoom},scrollTopMax(){const t=this.pageHeight*this.zoom;return t<this.viewHeight?this.yMargin*this.zoom-(this.viewHeight-t)/2:(this.yMargin+this.pageHeight)*this.zoom-this.viewHeight},scrollLeftLimited(){return Math.min(this.scrollLeftMax,Math.max(this.scrollLeftMin,this.scrollLeft))},scrollTopLimited(){return Math.min(this.scrollTopMax,Math.max(this.scrollTopMin,this.scrollTop))}},mounted(){window.addEventListener("resize",this.onResize,{passive:!0}),this.onResize(),this.zoom=this.zooms_[0],this.goToPage(this.startPage)},beforeDestroy(){window.removeEventListener("resize",this.onResize,{passive:!0})},methods:{onResize(){const t=this.$refs.viewport;t&&(this.viewWidth=t.clientWidth,this.viewHeight=t.clientHeight,this.displayedPages=this.viewWidth>this.viewHeight&&!this.singlePage||this.doublePage?2:1,this.displayedPages===2&&(this.currentPage&=-2),this.fixFirstPage(),this.minX=1/0,this.maxX=-1/0)},fixFirstPage(){this.displayedPages===1&&this.currentPage===0&&this.pages.length&&!this.pageUrl(0)&&this.currentPage++},pageUrl(t,e=!1){if(e&&this.zoom>1&&!this.zooming){const r=this.pagesHiRes[t];if(r)return r}return this.pages[t]||null},pageUrlLoading(t,e=!1){console.log(`pageUrlLoading of ${t} with hiRes ${e}`);const r=this.pageUrl(t,e);return console.log(`url is ${r}`),e&&this.zoom>1&&!this.zooming?r:r&&this.loadImage(r)},flipLeft(){this.canFlipLeft&&this.flipStart("left",!0)},flipRight(){this.canFlipRight&&this.flipStart("right",!0)},makePolygonArray(t){if(!this.flip.direction)return[];let e=this.flip.progress,r=this.flip.direction;this.displayedPages===1&&r!==this.forwardDirection&&(e=1-e,r=this.forwardDirection),this.flip.opacity=this.displayedPages===1&&e>.7?1-(e-.7)/.3:1;const a=t==="front"?this.flip.frontImage:this.flip.backImage,n=this.pageWidth/this.nPolygons;let i=this.xMargin,s=!1;this.displayedPages===1?this.forwardDirection==="right"?t==="back"&&(s=!0,i=this.xMargin-this.pageWidth):r==="left"?t==="back"?i=this.pageWidth-this.xMargin:s=!0:t==="front"?i=this.pageWidth-this.xMargin:s=!0:r==="left"?t==="back"?i=this.viewWidth/2:s=!0:t==="front"?i=this.viewWidth/2:s=!0;const h=new z;h.translate(this.viewWidth/2),h.perspective(this.perspective),h.translate(-this.viewWidth/2),h.translate(i,this.yMargin);let l=0;e>.5&&(l=-(e-.5)*2*180),r==="left"&&(l=-l),t==="back"&&(l+=180),l&&(h.translate(this.pageWidth),s&&h.translate(-this.pageWidth),h.rotateY(l));let d=e<.5?e*2*Math.PI:(1-(e-.5)*2)*Math.PI;d===0&&(d=1e-9);const m=this.pageWidth/d;let c=0;const P=d/this.nPolygons;let u=P/2/Math.PI*180;const y=P/Math.PI*180;s&&(u=-(d/Math.PI)*180+y/2),t==="back"&&(u=-u),this.minX=1/0,this.maxX=-1/0;const p=[];for(let f=0;f<this.nPolygons;f++){const H=`${f/(this.nPolygons-1)*100}% 0px`,w=h.clone(),T=s?d-c:c;let b=Math.sin(T)*m;s&&(b=this.pageWidth-b);let M=(1-Math.cos(T))*m;t==="back"&&(M=-M),w.translate3d(b,0,M),w.rotateY(-u);const v=w.transformX(0),S=w.transformX(n);this.maxX=Math.max(Math.max(v,S),this.maxX),this.minX=Math.min(Math.min(v,S),this.minX);const C=this.computeLighting(l-u,y);c+=P,u+=y,p.push([`${t}${f}`,a,C,H,w.toString(),Math.abs(Math.round(M))])}return p},computeLighting(t,e){const r=[],a=[-.5,-.25,0,.25,.5];if(this.ambient<1){const n=1-this.ambient,i=a.map(s=>(1-Math.cos((t-e*s)/180*Math.PI))*n);r.push(`
          linear-gradient(to right,
            rgba(0, 0, 0, ${i[0]}),
            rgba(0, 0, 0, ${i[1]}) 25%,
            rgba(0, 0, 0, ${i[2]}) 50%,
            rgba(0, 0, 0, ${i[3]}) 75%,
            rgba(0, 0, 0, ${i[4]}))
        `)}if(this.gloss>0&&!this.IE){const s=a.map(h=>Math.max(Math.cos((t+30-e*h)/180*Math.PI)**200,Math.cos((t-30-e*h)/180*Math.PI)**200));r.push(`
          linear-gradient(to right,
            rgba(255, 255, 255, ${s[0]*this.gloss}),
            rgba(255, 255, 255, ${s[1]*this.gloss}) 25%,
            rgba(255, 255, 255, ${s[2]*this.gloss}) 50%,
            rgba(255, 255, 255, ${s[3]*this.gloss}) 75%,
            rgba(255, 255, 255, ${s[4]*this.gloss}))
        `)}return r.join(",")},flipStart(t,e){t!==this.forwardDirection?this.displayedPages===1?(this.flip.frontImage=this.pageUrl(this.currentPage-1),this.flip.backImage=null):(this.flip.frontImage=this.pageUrl(this.firstPage),this.flip.backImage=this.pageUrl(this.currentPage-this.displayedPages+1)):this.displayedPages===1?(this.flip.frontImage=this.pageUrl(this.currentPage),this.flip.backImage=null):(this.flip.frontImage=this.pageUrl(this.secondPage),this.flip.backImage=this.pageUrl(this.currentPage+this.displayedPages)),this.flip.direction=t,this.flip.progress=0,requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.flip.direction!==this.forwardDirection?this.displayedPages===2&&(this.firstPage=this.currentPage-this.displayedPages):this.displayedPages===1?this.firstPage=this.currentPage+this.displayedPages:this.secondPage=this.currentPage+1+this.displayedPages,e&&this.flipAuto(!0)})})},flipAuto(t){const e=Date.now(),r=this.flipDuration*(1-this.flip.progress),a=this.flip.progress;this.flip.auto=!0,this.$emit(`flip-${this.flip.direction}-start`,this.page);const n=()=>{requestAnimationFrame(()=>{const i=Date.now()-e;let s=a+i/r;s>1&&(s=1),this.flip.progress=t?L(s):s,s<1?n():(this.flip.direction!==this.forwardDirection?this.currentPage-=this.displayedPages:this.currentPage+=this.displayedPages,this.$emit(`flip-${this.flip.direction}-end`,this.page),this.displayedPages===1&&this.flip.direction===this.forwardDirection?this.flip.direction=null:this.onImageLoad(1,()=>{this.flip.direction=null}),this.flip.auto=!1)})};n()},flipRevert(){const t=Date.now(),e=this.flipDuration*this.flip.progress,r=this.flip.progress;this.flip.auto=!0;const a=()=>{requestAnimationFrame(()=>{const n=Date.now()-t;let i=r-r*n/e;i<0&&(i=0),this.flip.progress=i,i>0?a():(this.firstPage=this.currentPage,this.secondPage=this.currentPage+1,this.displayedPages===1&&this.flip.direction!==this.forwardDirection?this.flip.direction=null:this.onImageLoad(1,()=>{this.flip.direction=null}),this.flip.auto=!1)})};a()},onImageLoad(t,e){this.nImageLoad=0,this.nImageLoadTrigger=t,this.imageLoadCallback=e},didLoadImage(t){this.imageWidth==null&&(this.imageWidth=(t.target||t.path[0]).naturalWidth,this.imageHeight=(t.target||t.path[0]).naturalHeight,this.preloadImages()),this.imageLoadCallback&&++this.nImageLoad>=this.nImageLoadTrigger&&(this.imageLoadCallback(),this.imageLoadCallback=null)},zoomIn(t=null){this.canZoomIn&&(this.zoomIndex+=1,this.zoomTo(this.zooms_[this.zoomIndex],t))},zoomOut(t=null){this.canZoomOut&&(this.zoomIndex-=1,this.zoomTo(this.zooms_[this.zoomIndex],t))},zoomTo(t,e=null){const r=this.$refs.viewport;let a,n;if(e){const p=r.getBoundingClientRect();a=e.pageX-p.left,n=e.pageY-p.top}else a=r.clientWidth/2,n=r.clientHeight/2;const i=this.zoom,s=t,h=r.scrollLeft,l=r.scrollTop,d=a+h,m=n+l,c=d/i*s-a,P=m/i*s-n,u=Date.now();this.zooming=!0,this.$emit("zoom-start",t);const y=()=>{requestAnimationFrame(()=>{const p=Date.now()-u;let f=p/this.zoomDuration;(f>1||this.IE)&&(f=1),f=L(f),this.zoom=i+(s-i)*f,this.scrollLeft=h+(c-h)*f,this.scrollTop=l+(P-l)*f,p<this.zoomDuration?y():(this.$emit("zoom-end",t),this.zooming=!1,this.zoom=t,this.scrollLeft=c,this.scrollTop=P)})};y(),s>1&&this.preloadImages(!0)},zoomAt(t){this.zoomIndex=(this.zoomIndex+1)%this.zooms_.length,this.zoomTo(this.zooms_[this.zoomIndex],t)},swipeStart(t){this.touchStartX=t.pageX,this.touchStartY=t.pageY,this.maxMove=0,this.zoom<=1?this.dragToFlip&&(this.activeCursor="grab"):(this.startScrollLeft=this.$refs.viewport.scrollLeft,this.startScrollTop=this.$refs.viewport.scrollTop,this.activeCursor="all-scroll")},swipeMove(t){if(this.touchStartX==null)return;const e=t.pageX-this.touchStartX,r=t.pageY-this.touchStartY;if(this.maxMove=Math.max(this.maxMove,Math.abs(e)),this.maxMove=Math.max(this.maxMove,Math.abs(r)),this.zoom>1){this.dragToScroll&&this.dragScroll(e,r);return}if(this.dragToFlip&&!(Math.abs(r)>Math.abs(e)))return this.activeCursor="grabbing",e>0?(this.flip.direction==null&&this.canFlipLeft&&e>=this.swipeMin&&this.flipStart("left",!1),this.flip.direction==="left"&&(this.flip.progress=e/this.pageWidth,this.flip.progress>1&&(this.flip.progress=1))):(this.flip.direction==null&&this.canFlipRight&&e<=-this.swipeMin&&this.flipStart("right",!1),this.flip.direction==="right"&&(this.flip.progress=-e/this.pageWidth,this.flip.progress>1&&(this.flip.progress=1))),!0},swipeEnd(t){this.touchStartX!=null&&(this.clickToZoom&&this.maxMove<this.swipeMin&&this.zoomAt(t),this.flip.direction!=null&&!this.flip.auto&&(this.flip.progress>.25?this.flipAuto(!1):this.flipRevert()),this.touchStartX=null,this.activeCursor=null)},onTouchStart(t){this.hasTouchEvents=!0,this.swipeStart(t.changedTouches[0])},onTouchMove(t){this.swipeMove(t.changedTouches[0])&&t.cancelable&&t.preventDefault()},onTouchEnd(t){this.swipeEnd(t.changedTouches[0])},onPointerDown(t){if(this.hasPointerEvents=!0,!this.hasTouchEvents&&!(t.which&&t.which!==1)){this.swipeStart(t);try{t.target.setPointerCapture(t.pointerId)}catch{}}},onPointerMove(t){this.hasTouchEvents||this.swipeMove(t)},onPointerUp(t){if(!this.hasTouchEvents){this.swipeEnd(t);try{t.target.releasePointerCapture(t.pointerId)}catch{}}},onMouseDown(t){this.hasTouchEvents||this.hasPointerEvents||t.which&&t.which!==1||this.swipeStart(t)},onMouseMove(t){!this.hasTouchEvents&&!this.hasPointerEvents&&this.swipeMove(t)},onMouseUp(t){!this.hasTouchEvents&&!this.hasPointerEvents&&this.swipeEnd(t)},dragScroll(t,e){this.scrollLeft=this.startScrollLeft-t,this.scrollTop=this.startScrollTop-e},onWheel(t){this.wheel==="scroll"&&this.zoom>1&&this.dragToScroll&&(this.scrollLeft=this.$refs.viewport.scrollLeft+t.deltaX,this.scrollTop=this.$refs.viewport.scrollTop+t.deltaY,t.cancelable&&t.preventDefault()),this.wheel==="zoom"&&(t.deltaY>=100?(this.zoomOut(t),t.cancelable&&t.preventDefault()):t.deltaY<=-100&&(this.zoomIn(t),t.cancelable&&t.preventDefault()))},preloadImages(t=!1){console.log(`preloadImages with hiRes ${t}`),console.log("this.currentPage",this.currentPage);for(let e=this.currentPage-3;e<=this.currentPage+3;e++)this.pageUrlLoading(e);if(t)for(let e=this.currentPage;e<this.currentPage+this.displayedPages;e++){const r=this.pagesHiRes[e];if(r){const a=new Image;a.src=r}}},goToPage(t){t==null||t===this.page||(this.pages[0]==null?this.displayedPages===2&&t===1?this.currentPage=0:this.currentPage=t:this.currentPage=t-1,this.minX=1/0,this.maxX=-1/0,this.currentCenterOffset=this.centerOffset)},loadImage(t){if(console.log(`loadImage of ${t} with imageWidth ${this.imageWidth}, loadedImages[url] ${loadedImages[t]}`),console.log("loadedImages",this.loadedImages),this.imageWidth==null)return t;if(this.loadedImages[t])return t;{const e=new Image;return e.onload=()=>{this.$set?this.$set(this.loadedImages,t,!0):this.loadedImages[t]=!0},e.src=t,this.loadingImage}}}},X=["src"],R=["src"];function F(t,e,r,a,n,i){return o.openBlock(),o.createElementBlock("div",null,[o.renderSlot(t.$slots,"default",o.normalizeProps(o.guardReactiveProps({canFlipLeft:i.canFlipLeft,canFlipRight:i.canFlipRight,canZoomIn:i.canZoomIn,canZoomOut:i.canZoomOut,page:i.page,numPages:i.numPages,flipLeft:i.flipLeft,flipRight:i.flipRight,zoomIn:i.zoomIn,zoomOut:i.zoomOut})),void 0,!0),o.createElementVNode("div",{class:o.normalizeClass(["viewport",{zoom:n.zooming||n.zoom>1,"drag-to-scroll":i.dragToScroll}]),ref:"viewport",style:o.normalizeStyle({cursor:i.cursor=="grabbing"?"grabbing":"auto"}),onTouchmove:e[7]||(e[7]=(...s)=>i.onTouchMove&&i.onTouchMove(...s)),onPointermove:e[8]||(e[8]=(...s)=>i.onPointerMove&&i.onPointerMove(...s)),onMousemove:e[9]||(e[9]=(...s)=>i.onMouseMove&&i.onMouseMove(...s)),onTouchend:e[10]||(e[10]=(...s)=>i.onTouchEnd&&i.onTouchEnd(...s)),onTouchcancel:e[11]||(e[11]=(...s)=>i.onTouchEnd&&i.onTouchEnd(...s)),onPointerup:e[12]||(e[12]=(...s)=>i.onPointerUp&&i.onPointerUp(...s)),onPointercancel:e[13]||(e[13]=(...s)=>i.onPointerUp&&i.onPointerUp(...s)),onMouseup:e[14]||(e[14]=(...s)=>i.onMouseUp&&i.onMouseUp(...s)),onWheel:e[15]||(e[15]=(...s)=>i.onWheel&&i.onWheel(...s))},[o.createElementVNode("div",{class:"flipbook-container",style:o.normalizeStyle({transform:`scale(${n.zoom})`})},[o.createElementVNode("div",{class:"click-to-flip left",style:o.normalizeStyle({cursor:i.canFlipLeft?"pointer":"auto"}),onClick:e[0]||(e[0]=(...s)=>i.flipLeft&&i.flipLeft(...s))},null,4),o.createElementVNode("div",{class:"click-to-flip right",style:o.normalizeStyle({cursor:i.canFlipRight?"pointer":"auto"}),onClick:e[1]||(e[1]=(...s)=>i.flipRight&&i.flipRight(...s))},null,4),o.createElementVNode("div",{style:o.normalizeStyle({transform:`translateX(${i.centerOffsetSmoothed}px)`})},[i.showLeftPage?(o.openBlock(),o.createElementBlock("img",{key:0,class:"page fixed",style:o.normalizeStyle({width:i.pageWidth+"px",height:i.pageHeight+"px",left:i.xMargin+"px",top:i.yMargin+"px"}),src:i.pageUrlLoading(i.leftPage,!0),onLoad:e[2]||(e[2]=s=>i.didLoadImage(s))},null,44,X)):o.createCommentVNode("",!0),i.showRightPage?(o.openBlock(),o.createElementBlock("img",{key:1,class:"page fixed",style:o.normalizeStyle({width:i.pageWidth+"px",height:i.pageHeight+"px",left:n.viewWidth/2+"px",top:i.yMargin+"px"}),src:i.pageUrlLoading(i.rightPage,!0),onLoad:e[3]||(e[3]=s=>i.didLoadImage(s))},null,44,R)):o.createCommentVNode("",!0),o.createElementVNode("div",{style:o.normalizeStyle({opacity:n.flip.opacity})},[(o.openBlock(!0),o.createElementBlock(o.Fragment,null,o.renderList(i.polygonArray,([s,h,l,d,m,c])=>(o.openBlock(),o.createElementBlock("div",{class:o.normalizeClass(["polygon",{blank:!h}]),key:s,style:o.normalizeStyle({backgroundImage:h&&`url(${i.loadImage(h)})`,backgroundSize:i.polygonBgSize,backgroundPosition:d,width:i.polygonWidth,height:i.polygonHeight,transform:m,zIndex:c})},[o.withDirectives(o.createElementVNode("div",{class:"lighting",style:o.normalizeStyle({backgroundImage:l})},null,4),[[o.vShow,l.length]])],6))),128))],4),o.createElementVNode("div",{class:"bounding-box",style:o.normalizeStyle({left:i.boundingLeft+"px",top:i.yMargin+"px",width:i.boundingRight-i.boundingLeft+"px",height:i.pageHeight+"px",cursor:i.cursor}),onTouchstart:e[4]||(e[4]=(...s)=>i.onTouchStart&&i.onTouchStart(...s)),onPointerdown:e[5]||(e[5]=(...s)=>i.onPointerDown&&i.onPointerDown(...s)),onMousedown:e[6]||(e[6]=(...s)=>i.onMouseDown&&i.onMouseDown(...s))},null,36)],4)],4)],38)])}const I=W(D,[["render",F],["__scopeId","data-v-1c3ff3e6"]]);return window.Vue&&window.Vue.component?Vue.component("flipbook",I):window.Flipbook=I,I});
