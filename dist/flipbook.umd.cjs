(function(g,o){typeof exports=="object"&&typeof module<"u"?module.exports=o(require("rematrix"),require("vue")):typeof define=="function"&&define.amd?define(["rematrix","vue"],o):(g=typeof globalThis<"u"?globalThis:g||self,g.Flipbook=o(g.Rematrix,g.Vue))})(this,function(g,o){"use strict";class z{constructor(i){i?i.m?this.m=[...i.m]:this.m=[...i]:this.m=g.identity()}clone(){return new z(this)}multiply(i){this.m=g.multiply(this.m,i)}perspective(i){this.multiply(g.perspective(i))}transformX(i){return(i*this.m[0]+this.m[12])/(i*this.m[3]+this.m[15])}translate(i,r){this.multiply(g.translate(i,r))}translate3d(i,r,a){this.multiply(g.translate3d(i,r,a))}rotateY(i){this.multiply(g.rotateY(i))}toString(){return g.toString(this.m)}}const k="data:image/svg+xml,%3c?xml%20version='1.0'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='500'%20height='500'%20viewBox='0%200%20500%20500'%20fill='transparent'%20style='background-color:%20%23fff'%3e%3ccircle%20cx='250'%20cy='250'%20r='48'%20stroke='%23333'%20stroke-width='2'%20stroke-dasharray='271%2030'%20%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20250%20250'%20to='360%20250%20250'%20dur='1s'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3c/svg%3e",W=(t,i)=>{const r=t.__vccOpts||t;for(const[a,n]of i)r[a]=n;return r},I=t=>Math.pow(t,2),E=t=>1-I(1-t),L=t=>t<.5?I(t*2)/2:.5+E((t-.5)*2)/2,D={name:"Flipbook",props:{pages:{type:Array,required:!0},pagesHiRes:{type:Array,default:()=>[]},flipDuration:{type:Number,default:1e3},zoomDuration:{type:Number,default:500},zooms:{type:Array,default:()=>[1,2,4]},perspective:{type:Number,default:2400},nPolygons:{type:Number,default:10},ambient:{type:Number,default:.4},gloss:{type:Number,default:.6},swipeMin:{type:Number,default:3},singlePage:{type:Boolean,default:!1},doublePage:{type:Boolean,default:!1},forwardDirection:{validator:t=>t=="right"||t=="left",default:"right"},centering:{type:Boolean,default:!0},startPage:{type:Number,default:null},loadingImage:{type:String,default:k},clickToZoom:{type:Boolean,default:!0},dragToFlip:{type:Boolean,default:!0},wheel:{type:String,default:"scroll"}},data(){return{viewWidth:0,viewHeight:0,imageWidth:null,imageHeight:null,displayedPages:1,nImageLoad:0,nImageLoadTrigger:0,imageLoadCallback:null,currentPage:0,firstPage:0,secondPage:1,zoomIndex:0,zoom:1,zooming:!1,touchStartX:null,touchStartY:null,maxMove:0,activeCursor:null,hasTouchEvents:!1,hasPointerEvents:!1,minX:1/0,maxX:-1/0,preloadedImages:{},flip:{progress:0,direction:null,frontImage:null,backImage:null,auto:!1,opacity:1},currentCenterOffset:null,animatingCenter:!1,startScrollLeft:0,startScrollTop:0,scrollLeft:0,scrollTop:0,loadedImages:{}}},computed:{IE(){return typeof navigator<"u"&&/Trident/.test(navigator.userAgent)},canFlipLeft(){return this.forwardDirection=="left"?this.canGoForward:this.canGoBack},canFlipRight(){return this.forwardDirection=="right"?this.canGoForward:this.canGoBack},canZoomIn(){return!this.zooming&&this.zoomIndex<this.zooms_.length-1},canZoomOut(){return!this.zooming&&this.zoomIndex>0},numPages(){return this.pages[0]==null?this.pages.length-1:this.pages.length},page(){return this.pages[0]!=null?this.currentPage+1:Math.max(1,this.currentPage)},zooms_(){return this.zooms||[1]},canGoForward(){return!this.flip.direction&&this.currentPage<this.pages.length-this.displayedPages},canGoBack(){return!this.flip.direction&&this.currentPage>=this.displayedPages&&!(this.displayedPages==1&&!this.pageUrl(this.firstPage-1))},leftPage(){return this.forwardDirection=="right"||this.displayedPages==1?this.firstPage:this.secondPage},rightPage(){return this.forwardDirection=="left"?this.firstPage:this.secondPage},showLeftPage(){return this.pageUrl(this.leftPage)},showRightPage(){return this.pageUrl(this.rightPage)&&this.displayedPages==2},cursor(){return this.activeCursor?this.activeCursor:this.IE?"auto":this.clickToZoom&&this.canZoomIn?"zoom-in":this.clickToZoom&&this.canZoomOut?"zoom-out":this.dragToFlip?"grab":"auto"},pageScale(){const i=this.viewWidth/this.displayedPages/this.imageWidth,r=this.viewHeight/this.imageHeight,a=i<r?i:r;return a<1?a:1},pageWidth(){return Math.round(this.imageWidth*this.pageScale)},pageHeight(){return Math.round(this.imageHeight*this.pageScale)},xMargin(){return(this.viewWidth-this.pageWidth*this.displayedPages)/2},yMargin(){return(this.viewHeight-this.pageHeight)/2},polygonWidth(){let t=this.pageWidth/this.nPolygons;return t=Math.ceil(t+1/this.zoom),`${t}px`},polygonHeight(){return`${this.pageHeight}px`},polygonBgSize(){return`${this.pageWidth}px ${this.pageHeight}px`},polygonArray(){return this.makePolygonArray("front").concat(this.makePolygonArray("back"))},boundingLeft(){if(this.displayedPages===1)return this.xMargin;{const t=this.pageUrl(this.leftPage)?this.xMargin:this.viewWidth/2;return t<this.minX?t:this.minX}},boundingRight(){if(this.displayedPages===1)return this.viewWidth-this.xMargin;{const t=this.pageUrl(this.rightPage)?this.viewWidth-this.xMargin:this.viewWidth/2;return t>this.maxX?t:this.maxX}},centerOffset(){const t=this.centering?Math.round(this.viewWidth/2-(this.boundingLeft+this.boundingRight)/2):0;return this.currentCenterOffset==null&&this.imageWidth!=null&&(this.currentCenterOffset=t),t},centerOffsetSmoothed(){return Math.round(this.currentCenterOffset)},dragToScroll(){return!this.hasTouchEvents},scrollLeftMin(){const t=(this.boundingRight-this.boundingLeft)*this.zoom;return t<this.viewWidth?(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom-(this.viewWidth-t)/2:(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom},scrollLeftMax(){const t=(this.boundingRight-this.boundingLeft)*this.zoom;return t<this.viewWidth?(this.boundingLeft+this.centerOffsetSmoothed)*this.zoom-(this.viewWidth-t)/2:(this.boundingRight+this.centerOffsetSmoothed)*this.zoom-this.viewWidth},scrollTopMin(){const t=this.pageHeight*this.zoom;return t<this.viewHeight?this.yMargin*this.zoom-(this.viewHeight-t)/2:this.yMargin*this.zoom},scrollTopMax(){const t=this.pageHeight*this.zoom;return t<this.viewHeight?this.yMargin*this.zoom-(this.viewHeight-t)/2:(this.yMargin+this.pageHeight)*this.zoom-this.viewHeight},scrollLeftLimited(){return Math.min(this.scrollLeftMax,Math.max(this.scrollLeftMin,this.scrollLeft))},scrollTopLimited(){return Math.min(this.scrollTopMax,Math.max(this.scrollTopMin,this.scrollTop))}},mounted(){window.addEventListener("resize",this.onResize,{passive:!0}),this.onResize(),this.zoom=this.zooms_[0],this.goToPage(this.startPage)},beforeDestroy(){window.removeEventListener("resize",this.onResize,{passive:!0})},methods:{onResize(){const t=this.$refs.viewport;t&&(this.viewWidth=t.clientWidth,this.viewHeight=t.clientHeight,this.displayedPages=this.viewWidth>this.viewHeight&&!this.singlePage||this.doublePage?2:1,this.displayedPages===2&&(this.currentPage&=-2),this.fixFirstPage(),this.minX=1/0,this.maxX=-1/0)},fixFirstPage(){this.displayedPages===1&&this.currentPage===0&&this.pages.length&&!this.pageUrl(0)&&this.currentPage++},pageUrl(t,i=!1){if(i&&this.zoom>1&&!this.zooming){const r=this.pagesHiRes[t];if(r)return r}return this.pages[t]||null},pageUrlLoading(t,i=!1){const r=this.pageUrl(t,i);return i&&this.zoom>1&&!this.zooming?r:r&&this.loadImage(r)},flipLeft(){this.canFlipLeft&&this.flipStart("left",!0)},flipRight(){this.canFlipRight&&this.flipStart("right",!0)},makePolygonArray(t){if(!this.flip.direction)return[];let i=this.flip.progress,r=this.flip.direction;this.displayedPages===1&&r!==this.forwardDirection&&(i=1-i,r=this.forwardDirection),this.flip.opacity=this.displayedPages===1&&i>.7?1-(i-.7)/.3:1;const a=t==="front"?this.flip.frontImage:this.flip.backImage,n=this.pageWidth/this.nPolygons;let e=this.xMargin,s=!1;this.displayedPages===1?this.forwardDirection==="right"?t==="back"&&(s=!0,e=this.xMargin-this.pageWidth):r==="left"?t==="back"?e=this.pageWidth-this.xMargin:s=!0:t==="front"?e=this.pageWidth-this.xMargin:s=!0:r==="left"?t==="back"?e=this.viewWidth/2:s=!0:t==="front"?e=this.viewWidth/2:s=!0;const h=new z;h.translate(this.viewWidth/2),h.perspective(this.perspective),h.translate(-this.viewWidth/2),h.translate(e,this.yMargin);let l=0;i>.5&&(l=-(i-.5)*2*180),r==="left"&&(l=-l),t==="back"&&(l+=180),l&&(h.translate(this.pageWidth),s&&h.translate(-this.pageWidth),h.rotateY(l));let d=i<.5?i*2*Math.PI:(1-(i-.5)*2)*Math.PI;d===0&&(d=1e-9);const m=this.pageWidth/d;let c=0;const y=d/this.nPolygons;let u=y/2/Math.PI*180;const P=y/Math.PI*180;s&&(u=-(d/Math.PI)*180+P/2),t==="back"&&(u=-u),this.minX=1/0,this.maxX=-1/0;const p=[];for(let f=0;f<this.nPolygons;f++){const H=`${f/(this.nPolygons-1)*100}% 0px`,w=h.clone(),T=s?d-c:c;let x=Math.sin(T)*m;s&&(x=this.pageWidth-x);let M=(1-Math.cos(T))*m;t==="back"&&(M=-M),w.translate3d(x,0,M),w.rotateY(-u);const v=w.transformX(0),S=w.transformX(n);this.maxX=Math.max(Math.max(v,S),this.maxX),this.minX=Math.min(Math.min(v,S),this.minX);const C=this.computeLighting(l-u,P);c+=y,u+=P,p.push([`${t}${f}`,a,C,H,w.toString(),Math.abs(Math.round(M))])}return p},computeLighting(t,i){const r=[],a=[-.5,-.25,0,.25,.5];if(this.ambient<1){const n=1-this.ambient,e=a.map(s=>(1-Math.cos((t-i*s)/180*Math.PI))*n);r.push(`
          linear-gradient(to right,
            rgba(0, 0, 0, ${e[0]}),
            rgba(0, 0, 0, ${e[1]}) 25%,
            rgba(0, 0, 0, ${e[2]}) 50%,
            rgba(0, 0, 0, ${e[3]}) 75%,
            rgba(0, 0, 0, ${e[4]}))
        `)}if(this.gloss>0&&!this.IE){const s=a.map(h=>Math.max(Math.cos((t+30-i*h)/180*Math.PI)**200,Math.cos((t-30-i*h)/180*Math.PI)**200));r.push(`
          linear-gradient(to right,
            rgba(255, 255, 255, ${s[0]*this.gloss}),
            rgba(255, 255, 255, ${s[1]*this.gloss}) 25%,
            rgba(255, 255, 255, ${s[2]*this.gloss}) 50%,
            rgba(255, 255, 255, ${s[3]*this.gloss}) 75%,
            rgba(255, 255, 255, ${s[4]*this.gloss}))
        `)}return r.join(",")},flipStart(t,i){t!==this.forwardDirection?this.displayedPages===1?(this.flip.frontImage=this.pageUrl(this.currentPage-1),this.flip.backImage=null):(this.flip.frontImage=this.pageUrl(this.firstPage),this.flip.backImage=this.pageUrl(this.currentPage-this.displayedPages+1)):this.displayedPages===1?(this.flip.frontImage=this.pageUrl(this.currentPage),this.flip.backImage=null):(this.flip.frontImage=this.pageUrl(this.secondPage),this.flip.backImage=this.pageUrl(this.currentPage+this.displayedPages)),this.flip.direction=t,this.flip.progress=0,requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.flip.direction!==this.forwardDirection?this.displayedPages===2&&(this.firstPage=this.currentPage-this.displayedPages):this.displayedPages===1?this.firstPage=this.currentPage+this.displayedPages:this.secondPage=this.currentPage+1+this.displayedPages,i&&this.flipAuto(!0)})})},flipAuto(t){const i=Date.now(),r=this.flipDuration*(1-this.flip.progress),a=this.flip.progress;this.flip.auto=!0,this.$emit(`flip-${this.flip.direction}-start`,this.page);const n=()=>{requestAnimationFrame(()=>{const e=Date.now()-i;let s=a+e/r;s>1&&(s=1),this.flip.progress=t?L(s):s,s<1?n():(this.flip.direction!==this.forwardDirection?this.currentPage-=this.displayedPages:this.currentPage+=this.displayedPages,this.$emit(`flip-${this.flip.direction}-end`,this.page),this.displayedPages===1&&this.flip.direction===this.forwardDirection?this.flip.direction=null:this.onImageLoad(1,()=>{this.flip.direction=null}),this.flip.auto=!1)})};n()},flipRevert(){const t=Date.now(),i=this.flipDuration*this.flip.progress,r=this.flip.progress;this.flip.auto=!0;const a=()=>{requestAnimationFrame(()=>{const n=Date.now()-t;let e=r-r*n/i;e<0&&(e=0),this.flip.progress=e,e>0?a():(this.firstPage=this.currentPage,this.secondPage=this.currentPage+1,this.displayedPages===1&&this.flip.direction!==this.forwardDirection?this.flip.direction=null:this.onImageLoad(1,()=>{this.flip.direction=null}),this.flip.auto=!1)})};a()},onImageLoad(t,i){this.nImageLoad=0,this.nImageLoadTrigger=t,this.imageLoadCallback=i},didLoadImage(t){this.imageWidth==null&&(this.imageWidth=(t.target||t.path[0]).naturalWidth,this.imageHeight=(t.target||t.path[0]).naturalHeight,this.preloadImages()),this.imageLoadCallback&&++this.nImageLoad>=this.nImageLoadTrigger&&(this.imageLoadCallback(),this.imageLoadCallback=null)},zoomIn(t=null){this.canZoomIn&&(this.zoomIndex+=1,this.zoomTo(this.zooms_[this.zoomIndex],t))},zoomOut(t=null){this.canZoomOut&&(this.zoomIndex-=1,this.zoomTo(this.zooms_[this.zoomIndex],t))},zoomTo(t,i=null){const r=this.$refs.viewport;let a,n;if(i){const p=r.getBoundingClientRect();a=i.pageX-p.left,n=i.pageY-p.top}else a=r.clientWidth/2,n=r.clientHeight/2;const e=this.zoom,s=t,h=r.scrollLeft,l=r.scrollTop,d=a+h,m=n+l,c=d/e*s-a,y=m/e*s-n,u=Date.now();this.zooming=!0,this.$emit("zoom-start",t);const P=()=>{requestAnimationFrame(()=>{const p=Date.now()-u;let f=p/this.zoomDuration;(f>1||this.IE)&&(f=1),f=L(f),this.zoom=e+(s-e)*f,this.scrollLeft=h+(c-h)*f,this.scrollTop=l+(y-l)*f,p<this.zoomDuration?P():(this.$emit("zoom-end",t),this.zooming=!1,this.zoom=t,this.scrollLeft=c,this.scrollTop=y)})};P(),s>1&&this.preloadImages(!0)},zoomAt(t){this.zoomIndex=(this.zoomIndex+1)%this.zooms_.length,this.zoomTo(this.zooms_[this.zoomIndex],t)},swipeStart(t){this.touchStartX=t.pageX,this.touchStartY=t.pageY,this.maxMove=0,this.zoom<=1?this.dragToFlip&&(this.activeCursor="grab"):(this.startScrollLeft=this.$refs.viewport.scrollLeft,this.startScrollTop=this.$refs.viewport.scrollTop,this.activeCursor="all-scroll")},swipeMove(t){if(this.touchStartX==null)return;const i=t.pageX-this.touchStartX,r=t.pageY-this.touchStartY;if(this.maxMove=Math.max(this.maxMove,Math.abs(i)),this.maxMove=Math.max(this.maxMove,Math.abs(r)),this.zoom>1){this.dragToScroll&&this.dragScroll(i,r);return}if(this.dragToFlip&&!(Math.abs(r)>Math.abs(i)))return this.activeCursor="grabbing",i>0?(this.flip.direction==null&&this.canFlipLeft&&i>=this.swipeMin&&this.flipStart("left",!1),this.flip.direction==="left"&&(this.flip.progress=i/this.pageWidth,this.flip.progress>1&&(this.flip.progress=1))):(this.flip.direction==null&&this.canFlipRight&&i<=-this.swipeMin&&this.flipStart("right",!1),this.flip.direction==="right"&&(this.flip.progress=-i/this.pageWidth,this.flip.progress>1&&(this.flip.progress=1))),!0},swipeEnd(t){this.touchStartX!=null&&(this.clickToZoom&&this.maxMove<this.swipeMin&&this.zoomAt(t),this.flip.direction!=null&&!this.flip.auto&&(this.flip.progress>.25?this.flipAuto(!1):this.flipRevert()),this.touchStartX=null,this.activeCursor=null)},onTouchStart(t){this.hasTouchEvents=!0,this.swipeStart(t.changedTouches[0])},onTouchMove(t){this.swipeMove(t.changedTouches[0])&&t.cancelable&&t.preventDefault()},onTouchEnd(t){this.swipeEnd(t.changedTouches[0])},onPointerDown(t){if(this.hasPointerEvents=!0,!this.hasTouchEvents&&!(t.which&&t.which!==1)){this.swipeStart(t);try{t.target.setPointerCapture(t.pointerId)}catch{}}},onPointerMove(t){this.hasTouchEvents||this.swipeMove(t)},onPointerUp(t){if(!this.hasTouchEvents){this.swipeEnd(t);try{t.target.releasePointerCapture(t.pointerId)}catch{}}},onMouseDown(t){this.hasTouchEvents||this.hasPointerEvents||t.which&&t.which!==1||this.swipeStart(t)},onMouseMove(t){!this.hasTouchEvents&&!this.hasPointerEvents&&this.swipeMove(t)},onMouseUp(t){!this.hasTouchEvents&&!this.hasPointerEvents&&this.swipeEnd(t)},dragScroll(t,i){this.scrollLeft=this.startScrollLeft-t,this.scrollTop=this.startScrollTop-i},onWheel(t){this.wheel==="scroll"&&this.zoom>1&&this.dragToScroll&&(this.scrollLeft=this.$refs.viewport.scrollLeft+t.deltaX,this.scrollTop=this.$refs.viewport.scrollTop+t.deltaY,t.cancelable&&t.preventDefault()),this.wheel==="zoom"&&(t.deltaY>=100?(this.zoomOut(t),t.cancelable&&t.preventDefault()):t.deltaY<=-100&&(this.zoomIn(t),t.cancelable&&t.preventDefault()))},preloadImages(t=!1){for(let i=this.currentPage-3;i<=this.currentPage+3;i++)this.pageUrlLoading(i);if(t)for(let i=this.currentPage;i<this.currentPage+this.displayedPages;i++){const r=this.pagesHiRes[i];if(r){const a=new Image;a.src=r}}},goToPage(t){t==null||t===this.page||(this.pages[0]==null?this.displayedPages===2&&t===1?this.currentPage=0:this.currentPage=t:this.currentPage=t-1,this.minX=1/0,this.maxX=-1/0,this.currentCenterOffset=this.centerOffset)},loadImage(t){if(this.imageWidth==null)return t;if(this.loadedImages[t])return t;{const i=new Image;return i.onload=()=>{this.$set?this.$set(this.loadedImages,t,!0):this.loadedImages[t]=!0},i.src=t,this.loadingImage}}}},X=["src"],R=["src"];function F(t,i,r,a,n,e){return o.openBlock(),o.createElementBlock("div",null,[o.renderSlot(t.$slots,"default",o.normalizeProps(o.guardReactiveProps({canFlipLeft:e.canFlipLeft,canFlipRight:e.canFlipRight,canZoomIn:e.canZoomIn,canZoomOut:e.canZoomOut,page:e.page,numPages:e.numPages,flipLeft:e.flipLeft,flipRight:e.flipRight,zoomIn:e.zoomIn,zoomOut:e.zoomOut})),void 0,!0),o.createElementVNode("div",{class:o.normalizeClass(["viewport",{zoom:n.zooming||n.zoom>1,"drag-to-scroll":e.dragToScroll}]),ref:"viewport",style:o.normalizeStyle({cursor:e.cursor=="grabbing"?"grabbing":"auto"}),onTouchmove:i[7]||(i[7]=(...s)=>e.onTouchMove&&e.onTouchMove(...s)),onPointermove:i[8]||(i[8]=(...s)=>e.onPointerMove&&e.onPointerMove(...s)),onMousemove:i[9]||(i[9]=(...s)=>e.onMouseMove&&e.onMouseMove(...s)),onTouchend:i[10]||(i[10]=(...s)=>e.onTouchEnd&&e.onTouchEnd(...s)),onTouchcancel:i[11]||(i[11]=(...s)=>e.onTouchEnd&&e.onTouchEnd(...s)),onPointerup:i[12]||(i[12]=(...s)=>e.onPointerUp&&e.onPointerUp(...s)),onPointercancel:i[13]||(i[13]=(...s)=>e.onPointerUp&&e.onPointerUp(...s)),onMouseup:i[14]||(i[14]=(...s)=>e.onMouseUp&&e.onMouseUp(...s)),onWheel:i[15]||(i[15]=(...s)=>e.onWheel&&e.onWheel(...s))},[o.createElementVNode("div",{class:"flipbook-container",style:o.normalizeStyle({transform:`scale(${n.zoom})`})},[o.createElementVNode("div",{class:"click-to-flip left",style:o.normalizeStyle({cursor:e.canFlipLeft?"pointer":"auto"}),onClick:i[0]||(i[0]=(...s)=>e.flipLeft&&e.flipLeft(...s))},null,4),o.createElementVNode("div",{class:"click-to-flip right",style:o.normalizeStyle({cursor:e.canFlipRight?"pointer":"auto"}),onClick:i[1]||(i[1]=(...s)=>e.flipRight&&e.flipRight(...s))},null,4),o.createElementVNode("div",{style:o.normalizeStyle({transform:`translateX(${e.centerOffsetSmoothed}px)`})},[e.showLeftPage?(o.openBlock(),o.createElementBlock("img",{key:0,class:"page fixed",style:o.normalizeStyle({width:e.pageWidth+"px",height:e.pageHeight+"px",left:e.xMargin+"px",top:e.yMargin+"px"}),src:e.pageUrlLoading(e.leftPage,!0),onLoad:i[2]||(i[2]=s=>e.didLoadImage(s))},null,44,X)):o.createCommentVNode("",!0),e.showRightPage?(o.openBlock(),o.createElementBlock("img",{key:1,class:"page fixed",style:o.normalizeStyle({width:e.pageWidth+"px",height:e.pageHeight+"px",left:n.viewWidth/2+"px",top:e.yMargin+"px"}),src:e.pageUrlLoading(e.rightPage,!0),onLoad:i[3]||(i[3]=s=>e.didLoadImage(s))},null,44,R)):o.createCommentVNode("",!0),o.createElementVNode("div",{style:o.normalizeStyle({opacity:n.flip.opacity})},[(o.openBlock(!0),o.createElementBlock(o.Fragment,null,o.renderList(e.polygonArray,([s,h,l,d,m,c])=>(o.openBlock(),o.createElementBlock("div",{class:o.normalizeClass(["polygon",{blank:!h}]),key:s,style:o.normalizeStyle({backgroundImage:h&&`url(${e.loadImage(h)})`,backgroundSize:e.polygonBgSize,backgroundPosition:d,width:e.polygonWidth,height:e.polygonHeight,transform:m,zIndex:c})},[o.withDirectives(o.createElementVNode("div",{class:"lighting",style:o.normalizeStyle({backgroundImage:l})},null,4),[[o.vShow,l.length]])],6))),128))],4),o.createElementVNode("div",{class:"bounding-box",style:o.normalizeStyle({left:e.boundingLeft+"px",top:e.yMargin+"px",width:e.boundingRight-e.boundingLeft+"px",height:e.pageHeight+"px",cursor:e.cursor}),onTouchstart:i[4]||(i[4]=(...s)=>e.onTouchStart&&e.onTouchStart(...s)),onPointerdown:i[5]||(i[5]=(...s)=>e.onPointerDown&&e.onPointerDown(...s)),onMousedown:i[6]||(i[6]=(...s)=>e.onMouseDown&&e.onMouseDown(...s))},null,36)],4)],4)],38)])}const b=W(D,[["render",F],["__scopeId","data-v-43840dec"]]);return window.Vue&&window.Vue.component?Vue.component("flipbook",b):window.Flipbook=b,b});
