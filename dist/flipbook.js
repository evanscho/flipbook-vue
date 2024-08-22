(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".viewport[data-v-1ec53693]{-webkit-overflow-scrolling:touch;width:100%;height:100%}.viewport.zoom[data-v-1ec53693]{overflow:scroll}.viewport.zoom.drag-to-scroll[data-v-1ec53693]{overflow:hidden}.flipbook-container[data-v-1ec53693]{position:relative;width:100%;height:100%;transform-origin:top left;-webkit-user-select:none;user-select:none}.click-to-flip[data-v-1ec53693]{position:absolute;width:50%;height:100%;top:0;-webkit-user-select:none;user-select:none}.click-to-flip.left[data-v-1ec53693]{left:0}.click-to-flip.right[data-v-1ec53693]{right:0}.bounding-box[data-v-1ec53693]{position:absolute;-webkit-user-select:none;user-select:none}.page[data-v-1ec53693]{position:absolute;backface-visibility:hidden}.polygon[data-v-1ec53693]{position:absolute;top:0;left:0;background-repeat:no-repeat;backface-visibility:hidden;transform-origin:center left}.polygon.blank[data-v-1ec53693]{background-color:#ddd}.polygon .lighting[data-v-1ec53693]{width:100%;height:100%}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { identity as E, multiply as X, perspective as R, translate as O, translate3d as C, rotateY as A, toString as B } from "rematrix";
import { openBlock as v, createElementBlock as M, renderSlot as Y, normalizeProps as Z, guardReactiveProps as G, createElementVNode as p, normalizeClass as W, normalizeStyle as g, createCommentVNode as S, Fragment as N, renderList as q, withDirectives as j, vShow as J } from "vue";
/*!
 * @license
 * flipbook v1.0.0-beta.5
 * Copyright © 2024 Takeshi Sone.
 * Released under the MIT License.
 */
class x {
  constructor(i) {
    i ? i.m ? this.m = [...i.m] : this.m = [...i] : this.m = E();
  }
  clone() {
    return new x(this);
  }
  multiply(i) {
    this.m = X(this.m, i);
  }
  perspective(i) {
    this.multiply(R(i));
  }
  transformX(i) {
    return (i * this.m[0] + this.m[12]) / (i * this.m[3] + this.m[15]);
  }
  translate(i, o) {
    this.multiply(O(i, o));
  }
  translate3d(i, o, a) {
    this.multiply(C(i, o, a));
  }
  rotateY(i) {
    this.multiply(A(i));
  }
  toString() {
    return B(this.m);
  }
}
const K = "data:image/svg+xml,%3c?xml%20version='1.0'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='500'%20height='500'%20viewBox='0%200%20500%20500'%20fill='transparent'%20style='background-color:%20%23fff'%3e%3ccircle%20cx='250'%20cy='250'%20r='48'%20stroke='%23333'%20stroke-width='2'%20stroke-dasharray='271%2030'%20%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20250%20250'%20to='360%20250%20250'%20dur='1s'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3c/svg%3e", Q = (t, i) => {
  const o = t.__vccOpts || t;
  for (const [a, r] of i)
    o[a] = r;
  return o;
}, D = (t) => t ** 2, V = (t) => 1 - D(1 - t), k = function(i) {
  return i < 0.5 ? D(i * 2) / 2 : 0.5 + V((i - 0.5) * 2) / 2;
}, $ = {
  name: "FlipBook",
  props: {
    pages: {
      type: Array,
      required: !0
    },
    pagesHiRes: {
      type: Array,
      default: () => []
    },
    flipDuration: {
      type: Number,
      default: 1e3
    },
    zoomDuration: {
      type: Number,
      default: 500
    },
    zooms: {
      type: Array,
      default: () => [1, 2, 4]
    },
    perspective: {
      type: Number,
      default: 2400
    },
    nPolygons: {
      type: Number,
      default: 10
    },
    ambient: {
      type: Number,
      default: 0.4
    },
    gloss: {
      type: Number,
      default: 0.6
    },
    swipeMin: {
      type: Number,
      default: 3
    },
    singlePage: {
      type: Boolean,
      default: !1
    },
    doublePage: {
      type: Boolean,
      default: !1
    },
    forwardDirection: {
      validator: (t) => t === "right" || t === "left",
      default: "right"
    },
    centering: {
      type: Boolean,
      default: !0
    },
    startPage: {
      type: Number,
      default: null
    },
    loadingImage: {
      type: String,
      default: K
    },
    clickToZoom: {
      type: Boolean,
      default: !0
    },
    dragToFlip: {
      type: Boolean,
      default: !0
    },
    wheel: {
      type: String,
      default: "scroll"
    }
  },
  emits: ["zoom-start", "zoom-end"],
  data() {
    return {
      viewWidth: 0,
      viewHeight: 0,
      imageWidth: null,
      imageHeight: null,
      displayedPages: 1,
      nImageLoad: 0,
      nImageLoadTrigger: 0,
      imageLoadCallback: null,
      currentPage: 0,
      firstPage: 0,
      secondPage: 1,
      zoomIndex: 0,
      zoom: 1,
      zooming: !1,
      touchStartX: null,
      touchStartY: null,
      maxMove: 0,
      activeCursor: null,
      hasTouchEvents: !1,
      hasPointerEvents: !1,
      minX: 1 / 0,
      maxX: -1 / 0,
      preloadedImages: {},
      flip: {
        progress: 0,
        direction: null,
        frontImage: null,
        backImage: null,
        auto: !1,
        opacity: 1
      },
      currentCenterOffset: null,
      animatingCenter: !1,
      startScrollLeft: 0,
      startScrollTop: 0,
      scrollLeft: 0,
      scrollTop: 0,
      loadedImages: {}
    };
  },
  computed: {
    IE() {
      return typeof navigator < "u" && /Trident/.test(navigator.userAgent);
    },
    canFlipLeft() {
      return this.forwardDirection === "left" ? this.canGoForward : this.canGoBack;
    },
    canFlipRight() {
      return this.forwardDirection === "right" ? this.canGoForward : this.canGoBack;
    },
    canZoomIn() {
      return !this.zooming && this.zoomIndex < this.zooms_.length - 1;
    },
    canZoomOut() {
      return !this.zooming && this.zoomIndex > 0;
    },
    numPages() {
      return this.pages[0] == null ? this.pages.length - 1 : this.pages.length;
    },
    page() {
      return this.pages[0] != null ? this.currentPage + 1 : Math.max(1, this.currentPage);
    },
    zooms_() {
      return this.zooms || [1];
    },
    canGoForward() {
      return !this.flip.direction && this.currentPage < this.pages.length - this.displayedPages;
    },
    canGoBack() {
      return !this.flip.direction && this.currentPage >= this.displayedPages && this.displayedPages === 1 ? console.log(`canGoBack and will call pageUrl with ${this.firstPage - 1}`) : console.log("canGoBack and won't call pageUrl"), !this.flip.direction && this.currentPage >= this.displayedPages && !(this.displayedPages === 1 && !this.pageUrl(this.firstPage - 1));
    },
    leftPage() {
      return this.forwardDirection === "right" || this.displayedPages === 1 ? this.firstPage : this.secondPage;
    },
    rightPage() {
      return this.forwardDirection === "left" ? this.firstPage : this.secondPage;
    },
    showLeftPage() {
      return console.log(`showLeftPage with leftPage ${this.leftPage}`), this.pageUrl(this.leftPage);
    },
    showRightPage() {
      return console.log(`showRightPage with rightPage ${this.rightPage}`), this.pageUrl(this.rightPage) && this.displayedPages === 2;
    },
    cursor() {
      return this.activeCursor ? this.activeCursor : this.IE ? "auto" : this.clickToZoom && this.canZoomIn ? "zoom-in" : this.clickToZoom && this.canZoomOut ? "zoom-out" : this.dragToFlip ? "grab" : "auto";
    },
    pageScale() {
      const i = this.viewWidth / this.displayedPages / this.imageWidth, o = this.viewHeight / this.imageHeight;
      console.log(`pageScale with viewWidth ${this.viewWidth}, viewHeight ${this.viewHeight}, imageWidth ${this.imageWidth}, imageHeight ${this.imageHeight}`), console.log(`pageScale = ${i < o ? i : o}`);
      const a = i < o ? i : o;
      return a < 1 ? a : 1;
    },
    pageWidth() {
      return Math.round(this.imageWidth * this.pageScale);
    },
    pageHeight() {
      return Math.round(this.imageHeight * this.pageScale);
    },
    xMargin() {
      return (this.viewWidth - this.pageWidth * this.displayedPages) / 2;
    },
    yMargin() {
      return (this.viewHeight - this.pageHeight) / 2;
    },
    polygonWidth() {
      let t = this.pageWidth / this.nPolygons;
      return t = Math.ceil(t + 1 / this.zoom), `${t}px`;
    },
    polygonHeight() {
      return `${this.pageHeight}px`;
    },
    polygonBgSize() {
      return `${this.pageWidth}px ${this.pageHeight}px`;
    },
    polygonArray() {
      const t = this.makePolygonArray("front").concat(this.makePolygonArray("back"));
      return console.log("polygonArray", t), t;
    },
    boundingLeft() {
      if (console.log("boundingLeft"), this.displayedPages === 1)
        return this.xMargin;
      console.log("in boundingLeft, about to call pageUrl");
      const t = this.pageUrl(this.leftPage) ? this.xMargin : this.viewWidth / 2;
      return t < this.minX ? t : this.minX;
    },
    boundingRight() {
      if (console.log("boundingRight"), this.displayedPages === 1)
        return this.viewWidth - this.xMargin;
      console.log("in boundingLeft, about to call pageUrl");
      const t = this.pageUrl(this.rightPage) ? this.viewWidth - this.xMargin : this.viewWidth / 2;
      return t > this.maxX ? t : this.maxX;
    },
    centerOffset() {
      const t = this.centering ? Math.round(this.viewWidth / 2 - (this.boundingLeft + this.boundingRight) / 2) : 0;
      return this.currentCenterOffset == null && this.imageWidth != null && (this.currentCenterOffset = t), t;
    },
    centerOffsetSmoothed() {
      return Math.round(this.currentCenterOffset);
    },
    dragToScroll() {
      return !this.hasTouchEvents;
    },
    scrollLeftMin() {
      const t = (this.boundingRight - this.boundingLeft) * this.zoom;
      return t < this.viewWidth ? (this.boundingLeft + this.centerOffsetSmoothed) * this.zoom - (this.viewWidth - t) / 2 : (this.boundingLeft + this.centerOffsetSmoothed) * this.zoom;
    },
    scrollLeftMax() {
      const t = (this.boundingRight - this.boundingLeft) * this.zoom;
      return t < this.viewWidth ? (this.boundingLeft + this.centerOffsetSmoothed) * this.zoom - (this.viewWidth - t) / 2 : (this.boundingRight + this.centerOffsetSmoothed) * this.zoom - this.viewWidth;
    },
    scrollTopMin() {
      const t = this.pageHeight * this.zoom;
      return t < this.viewHeight ? this.yMargin * this.zoom - (this.viewHeight - t) / 2 : this.yMargin * this.zoom;
    },
    scrollTopMax() {
      const t = this.pageHeight * this.zoom;
      return t < this.viewHeight ? this.yMargin * this.zoom - (this.viewHeight - t) / 2 : (this.yMargin + this.pageHeight) * this.zoom - this.viewHeight;
    },
    scrollLeftLimited() {
      return Math.min(this.scrollLeftMax, Math.max(this.scrollLeftMin, this.scrollLeft));
    },
    scrollTopLimited() {
      return Math.min(this.scrollTopMax, Math.max(this.scrollTopMin, this.scrollTop));
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize, { passive: !0 }), this.onResize(), this.zoom = this.zooms_[0], this.goToPage(this.startPage);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize, { passive: !0 });
  },
  watch: {
    imageWidth(t, i) {
      t !== i && console.log(`imageWidth changed from ${i} to ${t}`);
    },
    imageHeight(t, i) {
      t !== i && console.log(`imageHeight changed from ${i} to ${t}`);
    },
    pageWidth(t, i) {
      t !== i && console.log(`pageWidth changed from ${i} to ${t}`);
    },
    pageHeight(t, i) {
      t !== i && console.log(`pageHeight changed from ${i} to ${t}`);
    }
  },
  methods: {
    onResize() {
      const { viewport: t } = this.$refs;
      t && (this.viewWidth = t.clientWidth, this.viewHeight = t.clientHeight, this.displayedPages = this.viewWidth > this.viewHeight && !this.singlePage || this.doublePage ? 2 : 1, this.displayedPages === 2 && (this.currentPage &= -2), this.fixFirstPage(), this.minX = 1 / 0, this.maxX = -1 / 0);
    },
    fixFirstPage() {
      this.displayedPages === 1 && this.currentPage === 0 && this.pages.length ? console.log("in fixFirstPage and will call pageUrl[0]") : console.log("in fixFirstPage and won't call pageUrl[0]"), this.displayedPages === 1 && this.currentPage === 0 && this.pages.length && !this.pageUrl(0) && (this.currentPage += 1);
    },
    pageUrl(t, i = !1) {
      if (console.log(`pageUrl of ${t} with hiRes ${i}`), i && this.zoom > 1 && !this.zooming) {
        const o = this.pagesHiRes[t];
        if (o) return o;
      }
      return console.log(`this.pages[page] is ${this.pages[t]}`), this.pages[t] || null;
    },
    pageUrlLoading(t, i = !1) {
      console.log(`pageUrlLoading and about to call pageUrl with page ${t} and hiRes ${i}`);
      const o = this.pageUrl(t, i);
      return console.log(`pageUrlLoading: url is ${o}`), i && this.zoom > 1 && !this.zooming ? o : (console.log(`pageUrlLoading: about to loadImage with url ${o}`), o ? this.loadImage(o) : null);
    },
    flipLeft() {
      this.canFlipLeft && this.flipStart("left", !0);
    },
    flipRight() {
      this.canFlipRight && this.flipStart("right", !0);
    },
    makePolygonArray(t) {
      if (!this.flip.direction) return [];
      let { progress: i } = this.flip, { direction: o } = this.flip;
      this.displayedPages === 1 && o !== this.forwardDirection && (i = 1 - i, o = this.forwardDirection), this.flip.opacity = this.displayedPages === 1 && i > 0.7 ? 1 - (i - 0.7) / 0.3 : 1;
      const a = t === "front" ? this.flip.frontImage : this.flip.backImage, r = this.pageWidth / this.nPolygons;
      let e = this.xMargin, s = !1;
      this.displayedPages === 1 ? this.forwardDirection === "right" ? t === "back" && (s = !0, e = this.xMargin - this.pageWidth) : o === "left" ? t === "back" ? e = this.pageWidth - this.xMargin : s = !0 : t === "front" ? e = this.pageWidth - this.xMargin : s = !0 : o === "left" ? t === "back" ? e = this.viewWidth / 2 : s = !0 : t === "front" ? e = this.viewWidth / 2 : s = !0;
      const n = new x();
      n.translate(this.viewWidth / 2), n.perspective(this.perspective), n.translate(-this.viewWidth / 2), n.translate(e, this.yMargin);
      let h = 0;
      i > 0.5 && (h = -(i - 0.5) * 2 * 180), o === "left" && (h = -h), t === "back" && (h += 180), h && (n.translate(this.pageWidth), s && n.translate(-this.pageWidth), n.rotateY(h));
      let d = i < 0.5 ? i * 2 * Math.PI : (1 - (i - 0.5) * 2) * Math.PI;
      d === 0 && (d = 1e-9);
      const m = this.pageWidth / d;
      let f = 0;
      const P = d / this.nPolygons;
      let c = P / 2 / Math.PI * 180;
      const w = P / Math.PI * 180;
      s && (c = -(d / Math.PI) * 180 + w / 2), t === "back" && (c = -c), this.minX = 1 / 0, this.maxX = -1 / 0;
      const u = [];
      for (let l = 0; l < this.nPolygons; l += 1) {
        const U = `${l / (this.nPolygons - 1) * 100}% 0px`, y = n.clone(), z = s ? d - f : f;
        let I = Math.sin(z) * m;
        s && (I = this.pageWidth - I);
        let b = (1 - Math.cos(z)) * m;
        t === "back" && (b = -b), y.translate3d(I, 0, b), y.rotateY(-c);
        const L = y.transformX(0), T = y.transformX(r);
        this.maxX = Math.max(Math.max(L, T), this.maxX), this.minX = Math.min(Math.min(L, T), this.minX);
        const F = this.computeLighting(h - c, w);
        f += P, c += w, u.push([`${t}${l}`, a, F, U, y.toString(), Math.abs(Math.round(b))]);
      }
      return u;
    },
    computeLighting(t, i) {
      const o = [], a = [-0.5, -0.25, 0, 0.25, 0.5];
      if (this.ambient < 1) {
        const r = 1 - this.ambient, e = a.map((s) => (1 - Math.cos((t - i * s) / 180 * Math.PI)) * r);
        o.push(`
          linear-gradient(to right,
            rgba(0, 0, 0, ${e[0]}),
            rgba(0, 0, 0, ${e[1]}) 25%,
            rgba(0, 0, 0, ${e[2]}) 50%,
            rgba(0, 0, 0, ${e[3]}) 75%,
            rgba(0, 0, 0, ${e[4]}))
        `);
      }
      if (this.gloss > 0 && !this.IE) {
        const s = a.map(
          (n) => Math.max(
            Math.cos((t + 30 - i * n) / 180 * Math.PI) ** 200,
            Math.cos((t - 30 - i * n) / 180 * Math.PI) ** 200
          )
        );
        o.push(`
          linear-gradient(to right,
            rgba(255, 255, 255, ${s[0] * this.gloss}),
            rgba(255, 255, 255, ${s[1] * this.gloss}) 25%,
            rgba(255, 255, 255, ${s[2] * this.gloss}) 50%,
            rgba(255, 255, 255, ${s[3] * this.gloss}) 75%,
            rgba(255, 255, 255, ${s[4] * this.gloss}))
        `);
      }
      return o.join(",");
    },
    flipStart(t, i) {
      console.log(`flipStart, will call pageUrl with ${this.currentPage}`), t !== this.forwardDirection ? this.displayedPages === 1 ? (this.flip.frontImage = this.pageUrl(this.currentPage - 1), this.flip.backImage = null) : (this.flip.frontImage = this.pageUrl(this.firstPage), this.flip.backImage = this.pageUrl(this.currentPage - this.displayedPages + 1)) : this.displayedPages === 1 ? (this.flip.frontImage = this.pageUrl(this.currentPage), this.flip.backImage = null) : (this.flip.frontImage = this.pageUrl(this.secondPage), this.flip.backImage = this.pageUrl(this.currentPage + this.displayedPages)), this.flip.direction = t, this.flip.progress = 0, requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.flip.direction !== this.forwardDirection ? this.displayedPages === 2 && (this.firstPage = this.currentPage - this.displayedPages) : this.displayedPages === 1 ? this.firstPage = this.currentPage + this.displayedPages : this.secondPage = this.currentPage + 1 + this.displayedPages, i && this.flipAuto(!0);
        });
      });
    },
    flipAuto(t) {
      const i = Date.now(), o = this.flipDuration * (1 - this.flip.progress), a = this.flip.progress;
      this.flip.auto = !0, this.$emit(`flip-${this.flip.direction}-start`, this.page);
      const r = () => {
        requestAnimationFrame(() => {
          const e = Date.now() - i;
          let s = a + e / o;
          s > 1 && (s = 1), this.flip.progress = t ? k(s) : s, s < 1 ? r() : (this.flip.direction !== this.forwardDirection ? this.currentPage -= this.displayedPages : this.currentPage += this.displayedPages, this.$emit(`flip-${this.flip.direction}-end`, this.page), this.displayedPages === 1 && this.flip.direction === this.forwardDirection ? this.flip.direction = null : this.onImageLoad(1, () => {
            this.flip.direction = null;
          }), this.flip.auto = !1);
        });
      };
      r();
    },
    flipRevert() {
      const t = Date.now(), i = this.flipDuration * this.flip.progress, o = this.flip.progress;
      this.flip.auto = !0;
      const a = () => {
        requestAnimationFrame(() => {
          const r = Date.now() - t;
          let e = o - o * r / i;
          e < 0 && (e = 0), this.flip.progress = e, e > 0 ? a() : (this.firstPage = this.currentPage, this.secondPage = this.currentPage + 1, this.displayedPages === 1 && this.flip.direction !== this.forwardDirection ? this.flip.direction = null : this.onImageLoad(1, () => {
            this.flip.direction = null;
          }), this.flip.auto = !1);
        });
      };
      a();
    },
    onImageLoad(t, i) {
      this.nImageLoad = 0, this.nImageLoadTrigger = t, this.imageLoadCallback = i;
    },
    didLoadImage(t) {
      console.log("didLoadImage"), this.imageWidth == null && (this.imageWidth = (t.target || t.path[0]).naturalWidth, this.imageHeight = (t.target || t.path[0]).naturalHeight, console.log(`about to preloadImages with this.imageWidth ${this.imageWidth}`), this.preloadImages()), this.imageLoadCallback && ++this.nImageLoad >= this.nImageLoadTrigger && (console.log("calling imageLoadCallback"), this.imageLoadCallback(), this.imageLoadCallback = null);
    },
    imageFailedToLoad(t) {
      console.error("Failed to load image", t);
    },
    zoomIn(t = null) {
      this.canZoomIn && (this.zoomIndex += 1, this.zoomTo(this.zooms_[this.zoomIndex], t));
    },
    zoomOut(t = null) {
      this.canZoomOut && (this.zoomIndex -= 1, this.zoomTo(this.zooms_[this.zoomIndex], t));
    },
    zoomTo(t, i = null) {
      const { viewport: o } = this.$refs;
      let a, r;
      if (i) {
        const u = o.getBoundingClientRect();
        a = i.pageX - u.left, r = i.pageY - u.top;
      } else
        a = o.clientWidth / 2, r = o.clientHeight / 2;
      const e = this.zoom, s = t, n = o.scrollLeft, h = o.scrollTop, d = a + n, m = r + h, f = d / e * s - a, P = m / e * s - r, c = Date.now();
      this.zooming = !0, this.$emit("zoom-start", t);
      const w = () => {
        requestAnimationFrame(() => {
          const u = Date.now() - c;
          let l = u / this.zoomDuration;
          (l > 1 || this.IE) && (l = 1), l = k(l), this.zoom = e + (s - e) * l, this.scrollLeft = n + (f - n) * l, this.scrollTop = h + (P - h) * l, u < this.zoomDuration ? w() : (this.$emit("zoom-end", t), this.zooming = !1, this.zoom = t, this.scrollLeft = f, this.scrollTop = P);
        });
      };
      w(), s > 1 && this.preloadImages(!0);
    },
    zoomAt(t) {
      this.zoomIndex = (this.zoomIndex + 1) % this.zooms_.length, this.zoomTo(this.zooms_[this.zoomIndex], t);
    },
    swipeStart(t) {
      this.touchStartX = t.pageX, this.touchStartY = t.pageY, this.maxMove = 0, this.zoom <= 1 ? this.dragToFlip && (this.activeCursor = "grab") : (this.startScrollLeft = this.$refs.viewport.scrollLeft, this.startScrollTop = this.$refs.viewport.scrollTop, this.activeCursor = "all-scroll");
    },
    swipeMove(t) {
      if (this.touchStartX == null) return !1;
      const i = t.pageX - this.touchStartX, o = t.pageY - this.touchStartY;
      return this.maxMove = Math.max(this.maxMove, Math.abs(i)), this.maxMove = Math.max(this.maxMove, Math.abs(o)), this.zoom > 1 ? (this.dragToScroll && this.dragScroll(i, o), !1) : !this.dragToFlip || Math.abs(o) > Math.abs(i) ? !1 : (this.activeCursor = "grabbing", i > 0 ? (this.flip.direction == null && this.canFlipLeft && i >= this.swipeMin && this.flipStart("left", !1), this.flip.direction === "left" && (this.flip.progress = i / this.pageWidth, this.flip.progress > 1 && (this.flip.progress = 1))) : (this.flip.direction == null && this.canFlipRight && i <= -this.swipeMin && this.flipStart("right", !1), this.flip.direction === "right" && (this.flip.progress = -i / this.pageWidth, this.flip.progress > 1 && (this.flip.progress = 1))), !0);
    },
    swipeEnd(t) {
      this.touchStartX != null && (this.clickToZoom && this.maxMove < this.swipeMin && this.zoomAt(t), this.flip.direction != null && !this.flip.auto && (this.flip.progress > 0.25 ? this.flipAuto(!1) : this.flipRevert()), this.touchStartX = null, this.activeCursor = null);
    },
    onTouchStart(t) {
      this.hasTouchEvents = !0, this.swipeStart(t.changedTouches[0]);
    },
    onTouchMove(t) {
      this.swipeMove(t.changedTouches[0]) && t.cancelable && t.preventDefault();
    },
    onTouchEnd(t) {
      this.swipeEnd(t.changedTouches[0]);
    },
    onPointerDown(t) {
      if (this.hasPointerEvents = !0, !this.hasTouchEvents && !(t.which && t.which !== 1)) {
        this.swipeStart(t);
        try {
          t.target.setPointerCapture(t.pointerId);
        } catch {
        }
      }
    },
    onPointerMove(t) {
      this.hasTouchEvents || this.swipeMove(t);
    },
    onPointerUp(t) {
      if (!this.hasTouchEvents) {
        this.swipeEnd(t);
        try {
          t.target.releasePointerCapture(t.pointerId);
        } catch {
        }
      }
    },
    onMouseDown(t) {
      this.hasTouchEvents || this.hasPointerEvents || t.which && t.which !== 1 || this.swipeStart(t);
    },
    onMouseMove(t) {
      !this.hasTouchEvents && !this.hasPointerEvents && this.swipeMove(t);
    },
    onMouseUp(t) {
      !this.hasTouchEvents && !this.hasPointerEvents && this.swipeEnd(t);
    },
    dragScroll(t, i) {
      this.scrollLeft = this.startScrollLeft - t, this.scrollTop = this.startScrollTop - i;
    },
    onWheel(t) {
      this.wheel === "scroll" && this.zoom > 1 && this.dragToScroll && (this.scrollLeft = this.$refs.viewport.scrollLeft + t.deltaX, this.scrollTop = this.$refs.viewport.scrollTop + t.deltaY, t.cancelable && t.preventDefault()), this.wheel === "zoom" && (t.deltaY >= 100 ? (this.zoomOut(t), t.cancelable && t.preventDefault()) : t.deltaY <= -100 && (this.zoomIn(t), t.cancelable && t.preventDefault()));
    },
    preloadImages(t = !1) {
      console.log(`preloadImages with hiRes ${t}`), console.log("this.currentPage", this.currentPage);
      for (let i = this.currentPage - 3; i <= this.currentPage + 3; i++)
        this.pageUrlLoading(i);
      if (t)
        for (let i = this.currentPage; i < this.currentPage + this.displayedPages; i++) {
          const o = this.pagesHiRes[i];
          if (o) {
            const a = new Image();
            a.src = o;
          }
        }
    },
    goToPage(t) {
      console.log(`goToPage with p ${t} and this.page ${this.page}`), console.log("this.pages", this.pages), !(t == null || t === this.page) && (this.pages[0] == null ? this.displayedPages === 2 && t === 1 ? this.currentPage = 0 : this.currentPage = t : this.currentPage = t - 1, this.minX = 1 / 0, this.maxX = -1 / 0, this.currentCenterOffset = this.centerOffset);
    },
    loadImage(t) {
      if (console.log(
        `loadImage of ${t} with imageWidth ${this.imageWidth}, loadedImages[url] ${this.loadedImages[t]}`
      ), console.log("loadedImages", this.loadedImages), this.imageWidth == null || this.loadedImages[t])
        return t;
      const i = new Image();
      return i.onload = () => {
        this.$set ? this.$set(this.loadedImages, t, !0) : this.loadedImages[t] = !0;
      }, i.src = t, this.loadingImage;
    }
  }
}, _ = ["src"], tt = ["src"];
function it(t, i, o, a, r, e) {
  return v(), M("div", null, [
    Y(t.$slots, "default", Z(G({
      canFlipLeft: e.canFlipLeft,
      canFlipRight: e.canFlipRight,
      canZoomIn: e.canZoomIn,
      canZoomOut: e.canZoomOut,
      page: e.page,
      numPages: e.numPages,
      flipLeft: e.flipLeft,
      flipRight: e.flipRight,
      zoomIn: e.zoomIn,
      zoomOut: e.zoomOut
    })), void 0, !0),
    p("div", {
      ref: "viewport",
      class: W(["viewport", {
        zoom: r.zooming || r.zoom > 1,
        "drag-to-scroll": e.dragToScroll
      }]),
      style: g({ cursor: e.cursor == "grabbing" ? "grabbing" : "auto" }),
      onTouchmove: i[9] || (i[9] = (...s) => e.onTouchMove && e.onTouchMove(...s)),
      onPointermove: i[10] || (i[10] = (...s) => e.onPointerMove && e.onPointerMove(...s)),
      onMousemove: i[11] || (i[11] = (...s) => e.onMouseMove && e.onMouseMove(...s)),
      onTouchend: i[12] || (i[12] = (...s) => e.onTouchEnd && e.onTouchEnd(...s)),
      onTouchcancel: i[13] || (i[13] = (...s) => e.onTouchEnd && e.onTouchEnd(...s)),
      onPointerup: i[14] || (i[14] = (...s) => e.onPointerUp && e.onPointerUp(...s)),
      onPointercancel: i[15] || (i[15] = (...s) => e.onPointerUp && e.onPointerUp(...s)),
      onMouseup: i[16] || (i[16] = (...s) => e.onMouseUp && e.onMouseUp(...s)),
      onWheel: i[17] || (i[17] = (...s) => e.onWheel && e.onWheel(...s))
    }, [
      p("div", {
        class: "flipbook-container",
        style: g({ transform: `scale(${r.zoom})` })
      }, [
        p("div", {
          class: "click-to-flip left",
          style: g({ cursor: e.canFlipLeft ? "pointer" : "auto" }),
          onClick: i[0] || (i[0] = (...s) => e.flipLeft && e.flipLeft(...s))
        }, null, 4),
        p("div", {
          class: "click-to-flip right",
          style: g({ cursor: e.canFlipRight ? "pointer" : "auto" }),
          onClick: i[1] || (i[1] = (...s) => e.flipRight && e.flipRight(...s))
        }, null, 4),
        p("div", {
          style: g({ transform: `translateX(${e.centerOffsetSmoothed}px)` })
        }, [
          e.showLeftPage ? (v(), M("img", {
            key: 0,
            class: "page fixed",
            style: g({
              width: e.pageWidth + "px",
              height: e.pageHeight + "px",
              left: e.xMargin + "px",
              top: e.yMargin + "px"
            }),
            src: e.pageUrlLoading(e.leftPage, !0),
            onLoad: i[2] || (i[2] = (s) => e.didLoadImage(s)),
            onError: i[3] || (i[3] = (s) => e.imageFailedToLoad(s))
          }, null, 44, _)) : S("", !0),
          e.showRightPage ? (v(), M("img", {
            key: 1,
            class: "page fixed",
            style: g({
              width: e.pageWidth + "px",
              height: e.pageHeight + "px",
              left: r.viewWidth / 2 + "px",
              top: e.yMargin + "px"
            }),
            src: e.pageUrlLoading(e.rightPage, !0),
            onLoad: i[4] || (i[4] = (s) => e.didLoadImage(s)),
            onError: i[5] || (i[5] = (s) => e.imageFailedToLoad(s))
          }, null, 44, tt)) : S("", !0),
          p("div", {
            style: g({ opacity: r.flip.opacity })
          }, [
            (v(!0), M(N, null, q(e.polygonArray, ([s, n, h, d, m, f]) => (v(), M("div", {
              key: s,
              class: W(["polygon", { blank: !n }]),
              style: g({
                backgroundImage: n && `url(${e.loadImage(n)})`,
                backgroundSize: e.polygonBgSize,
                backgroundPosition: d,
                width: e.polygonWidth,
                height: e.polygonHeight,
                transform: m,
                zIndex: f
              })
            }, [
              j(p("div", {
                class: "lighting",
                style: g({ backgroundImage: h })
              }, null, 4), [
                [J, h.length]
              ])
            ], 6))), 128))
          ], 4),
          p("div", {
            class: "bounding-box",
            style: g({
              left: e.boundingLeft + "px",
              top: e.yMargin + "px",
              width: e.boundingRight - e.boundingLeft + "px",
              height: e.pageHeight + "px",
              cursor: e.cursor
            }),
            onTouchstart: i[6] || (i[6] = (...s) => e.onTouchStart && e.onTouchStart(...s)),
            onPointerdown: i[7] || (i[7] = (...s) => e.onPointerDown && e.onPointerDown(...s)),
            onMousedown: i[8] || (i[8] = (...s) => e.onMouseDown && e.onMouseDown(...s))
          }, null, 36)
        ], 4)
      ], 4)
    ], 38)
  ]);
}
const H = /* @__PURE__ */ Q($, [["render", it], ["__scopeId", "data-v-1ec53693"]]);
window.Vue && window.Vue.component ? Vue.component("flipbook", H) : window.Flipbook = H;
export {
  H as default
};
