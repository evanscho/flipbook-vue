(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".viewport[data-v-2f29e5e1]{-webkit-overflow-scrolling:touch;width:100%;height:100%}.viewport.zoom[data-v-2f29e5e1]{overflow:scroll}.viewport.zoom.drag-to-scroll[data-v-2f29e5e1]{overflow:hidden}.flipbook-container[data-v-2f29e5e1]{position:relative;width:100%;height:100%;transform-origin:top left;-webkit-user-select:none;user-select:none}.click-to-flip[data-v-2f29e5e1]{position:absolute;width:50%;height:100%;top:0;-webkit-user-select:none;user-select:none}.click-to-flip.left[data-v-2f29e5e1]{left:0}.click-to-flip.right[data-v-2f29e5e1]{right:0}.bounding-box[data-v-2f29e5e1]{position:absolute;-webkit-user-select:none;user-select:none}.page[data-v-2f29e5e1]{position:absolute;backface-visibility:hidden}.polygon[data-v-2f29e5e1]{position:absolute;top:0;left:0;background-repeat:no-repeat;backface-visibility:hidden;transform-origin:center left}.polygon.blank[data-v-2f29e5e1]{background-color:#ddd}.polygon .lighting[data-v-2f29e5e1]{width:100%;height:100%}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { identity as O, multiply as R, perspective as C, translate as H, translate3d as U, rotateY as A, toString as Y } from "rematrix";
import { openBlock as M, createElementBlock as v, renderSlot as B, normalizeProps as Z, guardReactiveProps as N, createElementVNode as p, normalizeClass as S, normalizeStyle as f, createCommentVNode as W, Fragment as q, renderList as G, withDirectives as V, vShow as j } from "vue";
/*!
 * @license
 * flipbook v1.0.0-beta.5
 * Copyright © 2024 Takeshi Sone.
 * Released under the MIT License.
 */
class z {
  constructor(i) {
    i ? i.m ? this.m = [...i.m] : this.m = [...i] : this.m = O();
  }
  clone() {
    return new z(this);
  }
  multiply(i) {
    this.m = R(this.m, i);
  }
  perspective(i) {
    this.multiply(C(i));
  }
  transformX(i) {
    return (i * this.m[0] + this.m[12]) / (i * this.m[3] + this.m[15]);
  }
  translate(i, r) {
    this.multiply(H(i, r));
  }
  translate3d(i, r, o) {
    this.multiply(U(i, r, o));
  }
  rotateY(i) {
    this.multiply(A(i));
  }
  toString() {
    return Y(this.m);
  }
}
const J = "data:image/svg+xml,%3c?xml%20version='1.0'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='500'%20height='500'%20viewBox='0%200%20500%20500'%20fill='transparent'%20style='background-color:%20%23fff'%3e%3ccircle%20cx='250'%20cy='250'%20r='48'%20stroke='%23333'%20stroke-width='2'%20stroke-dasharray='271%2030'%20%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20250%20250'%20to='360%20250%20250'%20dur='1s'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3c/svg%3e", K = (t, i) => {
  const r = t.__vccOpts || t;
  for (const [o, a] of i)
    r[o] = a;
  return r;
}, D = (t) => t ** 2, Q = (t) => 1 - D(1 - t), k = function(i) {
  return i < 0.5 ? D(i * 2) / 2 : 0.5 + Q((i - 0.5) * 2) / 2;
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
      default: J
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
      return !this.flip.direction && this.currentPage >= this.displayedPages && !(this.displayedPages === 1 && !this.pageUrl(this.firstPage - 1));
    },
    leftPage() {
      return this.forwardDirection === "right" || this.displayedPages === 1 ? this.firstPage : this.secondPage;
    },
    rightPage() {
      return this.forwardDirection === "left" ? this.firstPage : this.secondPage;
    },
    showLeftPage() {
      return this.pageUrl(this.leftPage);
    },
    showRightPage() {
      return this.pageUrl(this.rightPage) && this.displayedPages === 2;
    },
    cursor() {
      return this.activeCursor ? this.activeCursor : this.IE ? "auto" : this.clickToZoom && this.canZoomIn ? "zoom-in" : this.clickToZoom && this.canZoomOut ? "zoom-out" : this.dragToFlip ? "grab" : "auto";
    },
    pageScale() {
      const i = this.viewWidth / this.displayedPages / this.imageWidth, r = this.viewHeight / this.imageHeight, o = i < r ? i : r;
      return o < 1 ? o : 1;
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
      return this.makePolygonArray("front").concat(this.makePolygonArray("back"));
    },
    boundingLeft() {
      if (this.displayedPages === 1)
        return this.xMargin;
      const t = this.pageUrl(this.leftPage) ? this.xMargin : this.viewWidth / 2;
      return t < this.minX ? t : this.minX;
    },
    boundingRight() {
      if (this.displayedPages === 1)
        return this.viewWidth - this.xMargin;
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
  watch: {
    currentPage() {
      this.firstPage = this.currentPage, this.secondPage = this.currentPage + 1, this.preloadImages();
    },
    centerOffset() {
      if (this.animatingCenter)
        return;
      const t = () => {
        requestAnimationFrame(() => {
          const r = this.centerOffset - this.currentCenterOffset;
          Math.abs(r) < 0.5 ? (this.currentCenterOffset = this.centerOffset, this.animatingCenter = !1) : (this.currentCenterOffset += r * 0.1, t());
        });
      };
      this.animatingCenter = !0, t();
    },
    scrollLeftLimited(t) {
      this.IE ? requestAnimationFrame(() => {
        this.$refs.viewport.scrollLeft = t;
      }) : this.$refs.viewport.scrollLeft = t;
    },
    scrollTopLimited(t) {
      this.IE ? requestAnimationFrame(() => {
        this.$refs.viewport.scrollTop = t;
      }) : this.$refs.viewport.scrollTop = t;
    },
    pages(t, i) {
      this.fixFirstPage(), !(i != null && i.length) && (t != null && t.length) && this.startPage > 1 && t[0] === null && (this.currentPage += 1);
    },
    startPage(t) {
      this.goToPage(t);
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize, { passive: !0 }), this.onResize(), [this.zoom] = this.zooms_, this.goToPage(this.startPage);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize, { passive: !0 });
  },
  methods: {
    onResize() {
      const { viewport: t } = this.$refs;
      t && (this.viewWidth = t.clientWidth, this.viewHeight = t.clientHeight, this.displayedPages = this.viewWidth > this.viewHeight && !this.singlePage || this.doublePage ? 2 : 1, this.displayedPages === 2 && (this.currentPage &= -2), this.fixFirstPage(), this.minX = 1 / 0, this.maxX = -1 / 0);
    },
    fixFirstPage() {
      this.displayedPages === 1 && this.currentPage === 0 && this.pages.length && !this.pageUrl(0) && (this.currentPage += 1);
    },
    pageUrl(t, i = !1) {
      if (i && this.zoom > 1 && !this.zooming) {
        const r = this.pagesHiRes[t];
        if (r) return r;
      }
      return this.pages[t] || null;
    },
    pageUrlLoading(t, i = !1) {
      const r = this.pageUrl(t, i);
      return i && this.zoom > 1 && !this.zooming ? r : r ? this.loadImage(r) : null;
    },
    flipLeft() {
      this.canFlipLeft && this.flipStart("left", !0);
    },
    flipRight() {
      this.canFlipRight && this.flipStart("right", !0);
    },
    makePolygonArray(t) {
      if (!this.flip.direction) return [];
      let { progress: i } = this.flip, { direction: r } = this.flip;
      this.displayedPages === 1 && r !== this.forwardDirection && (i = 1 - i, r = this.forwardDirection), this.flip.opacity = this.displayedPages === 1 && i > 0.7 ? 1 - (i - 0.7) / 0.3 : 1;
      const o = t === "front" ? this.flip.frontImage : this.flip.backImage, a = this.pageWidth / this.nPolygons;
      console.log(`makePolygonArray with image ${o} and polygonWidth ${a}`);
      let e = this.xMargin, s = !1;
      this.displayedPages === 1 ? this.forwardDirection === "right" ? t === "back" && (s = !0, e = this.xMargin - this.pageWidth) : r === "left" ? t === "back" ? e = this.pageWidth - this.xMargin : s = !0 : t === "front" ? e = this.pageWidth - this.xMargin : s = !0 : r === "left" ? t === "back" ? e = this.viewWidth / 2 : s = !0 : t === "front" ? e = this.viewWidth / 2 : s = !0;
      const n = new z();
      console.log(`pageMatrix pre-translation: ${n.toString()}`), n.translate(this.viewWidth / 2), n.perspective(this.perspective), n.translate(-this.viewWidth / 2), n.translate(e, this.yMargin), console.log(`pageMatrix post-translation: ${n.toString()}`);
      let h = 0;
      i > 0.5 && (h = -(i - 0.5) * 2 * 180), r === "left" && (h = -h), t === "back" && (h += 180), h && (s && n.translate(this.pageWidth), n.rotateY(h), s && n.translate(-this.pageWidth)), console.log(`pageMatrix post-rotation: ${n.toString()}`);
      let g = i < 0.5 ? i * 2 * Math.PI : (1 - (i - 0.5) * 2) * Math.PI;
      g === 0 && (g = 1e-9);
      const m = this.pageWidth / g;
      let u = 0;
      const P = g / this.nPolygons;
      let c = P / 2 / Math.PI * 180;
      const y = P / Math.PI * 180;
      s && (c = -(g / Math.PI) * 180 + y / 2), t === "back" && (c = -c), this.minX = 1 / 0, this.maxX = -1 / 0;
      const d = [];
      console.log("pageMatrix loop start"), console.log(`params: ${this.nPolygons}, ${g}, ${m}, ${u}, ${P}, ${c}, ${y}, ${s}, ${t}, ${a}, ${h}, ${this.pageWidth}`), console.log(`pre: this.maxX: ${this.maxX}, this.minX: ${this.minX}`), console.log(`pageMatrix pre: ${n.toString()}`);
      for (let l = 0; l < this.nPolygons; l += 1) {
        const E = `${l / (this.nPolygons - 1) * 100}% 0px`, w = n.clone(), b = s ? g - u : u;
        let I = Math.sin(b) * m;
        s && (I = this.pageWidth - I);
        let x = (1 - Math.cos(b)) * m;
        t === "back" && (x = -x), w.translate3d(I, 0, x), w.rotateY(-c);
        const L = w.transformX(0), T = w.transformX(a);
        this.maxX = Math.max(Math.max(L, T), this.maxX), this.minX = Math.min(Math.min(L, T), this.minX), console.log(`post iteration ${l}: this.maxX: ${this.maxX}, this.minX: ${this.minX}`);
        const F = this.computeLighting(h - c, y);
        u += P, c += y, d.push([`${t}${l}`, o, F, E, w.toString(), Math.abs(Math.round(x))]);
      }
      return d;
    },
    computeLighting(t, i) {
      const r = [], o = [-0.5, -0.25, 0, 0.25, 0.5];
      if (this.ambient < 1) {
        const a = 1 - this.ambient, e = o.map((s) => (1 - Math.cos((t - i * s) / 180 * Math.PI)) * a);
        r.push(`
          linear-gradient(to right,
            rgba(0, 0, 0, ${e[0]}),
            rgba(0, 0, 0, ${e[1]}) 25%,
            rgba(0, 0, 0, ${e[2]}) 50%,
            rgba(0, 0, 0, ${e[3]}) 75%,
            rgba(0, 0, 0, ${e[4]}))
        `);
      }
      if (this.gloss > 0 && !this.IE) {
        const s = o.map(
          (n) => Math.max(
            Math.cos((t + 30 - i * n) / 180 * Math.PI) ** 200,
            Math.cos((t - 30 - i * n) / 180 * Math.PI) ** 200
          )
        );
        r.push(`
          linear-gradient(to right,
            rgba(255, 255, 255, ${s[0] * this.gloss}),
            rgba(255, 255, 255, ${s[1] * this.gloss}) 25%,
            rgba(255, 255, 255, ${s[2] * this.gloss}) 50%,
            rgba(255, 255, 255, ${s[3] * this.gloss}) 75%,
            rgba(255, 255, 255, ${s[4] * this.gloss}))
        `);
      }
      return r.join(",");
    },
    flipStart(t, i) {
      t !== this.forwardDirection ? this.displayedPages === 1 ? (this.flip.frontImage = this.pageUrl(this.currentPage - 1), this.flip.backImage = null) : (this.flip.frontImage = this.pageUrl(this.firstPage), this.flip.backImage = this.pageUrl(this.currentPage - this.displayedPages + 1)) : this.displayedPages === 1 ? (this.flip.frontImage = this.pageUrl(this.currentPage), this.flip.backImage = null) : (this.flip.frontImage = this.pageUrl(this.secondPage), this.flip.backImage = this.pageUrl(this.currentPage + this.displayedPages)), this.flip.direction = t, this.flip.progress = 0, requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.flip.direction !== this.forwardDirection ? this.displayedPages === 2 && (this.firstPage = this.currentPage - this.displayedPages) : this.displayedPages === 1 ? this.firstPage = this.currentPage + this.displayedPages : this.secondPage = this.currentPage + 1 + this.displayedPages, i && this.flipAuto(!0);
        });
      });
    },
    flipAuto(t) {
      const i = Date.now(), r = this.flipDuration * (1 - this.flip.progress), o = this.flip.progress;
      this.flip.auto = !0, this.$emit(`flip-${this.flip.direction}-start`, this.page);
      const a = () => {
        requestAnimationFrame(() => {
          const e = Date.now() - i;
          let s = o + e / r;
          s > 1 && (s = 1), this.flip.progress = t ? k(s) : s, s < 1 ? a() : (this.flip.direction !== this.forwardDirection ? this.currentPage -= this.displayedPages : this.currentPage += this.displayedPages, this.$emit(`flip-${this.flip.direction}-end`, this.page), this.displayedPages === 1 && this.flip.direction === this.forwardDirection ? this.flip.direction = null : this.onImageLoad(1, () => {
            this.flip.direction = null;
          }), this.flip.auto = !1);
        });
      };
      a();
    },
    flipRevert() {
      const t = Date.now(), i = this.flipDuration * this.flip.progress, r = this.flip.progress;
      this.flip.auto = !0;
      const o = () => {
        requestAnimationFrame(() => {
          const a = Date.now() - t;
          let e = r - r * a / i;
          e < 0 && (e = 0), this.flip.progress = e, e > 0 ? o() : (this.firstPage = this.currentPage, this.secondPage = this.currentPage + 1, this.displayedPages === 1 && this.flip.direction !== this.forwardDirection ? this.flip.direction = null : this.onImageLoad(1, () => {
            this.flip.direction = null;
          }), this.flip.auto = !1);
        });
      };
      o();
    },
    onImageLoad(t, i) {
      this.nImageLoad = 0, this.nImageLoadTrigger = t, this.imageLoadCallback = i;
    },
    didLoadImage(t) {
      this.imageWidth == null && (this.imageWidth = (t.target || t.path[0]).naturalWidth, this.imageHeight = (t.target || t.path[0]).naturalHeight, this.preloadImages()), this.imageLoadCallback && ++this.nImageLoad >= this.nImageLoadTrigger && (this.imageLoadCallback(), this.imageLoadCallback = null);
    },
    zoomIn(t = null) {
      this.canZoomIn && (this.zoomIndex += 1, this.zoomTo(this.zooms_[this.zoomIndex], t));
    },
    zoomOut(t = null) {
      this.canZoomOut && (this.zoomIndex -= 1, this.zoomTo(this.zooms_[this.zoomIndex], t));
    },
    zoomTo(t, i = null) {
      const { viewport: r } = this.$refs;
      let o, a;
      if (i) {
        const d = r.getBoundingClientRect();
        o = i.pageX - d.left, a = i.pageY - d.top;
      } else
        o = r.clientWidth / 2, a = r.clientHeight / 2;
      const e = this.zoom, s = t, n = r.scrollLeft, h = r.scrollTop, g = o + n, m = a + h, u = g / e * s - o, P = m / e * s - a, c = Date.now();
      this.zooming = !0, this.$emit("zoom-start", t);
      const y = () => {
        requestAnimationFrame(() => {
          const d = Date.now() - c;
          let l = d / this.zoomDuration;
          (l > 1 || this.IE) && (l = 1), l = k(l), this.zoom = e + (s - e) * l, this.scrollLeft = n + (u - n) * l, this.scrollTop = h + (P - h) * l, d < this.zoomDuration ? y() : (this.$emit("zoom-end", t), this.zooming = !1, this.zoom = t, this.scrollLeft = u, this.scrollTop = P);
        });
      };
      y(), s > 1 && this.preloadImages(!0);
    },
    zoomAt(t) {
      this.zoomIndex = (this.zoomIndex + 1) % this.zooms_.length, this.zoomTo(this.zooms_[this.zoomIndex], t);
    },
    swipeStart(t) {
      this.touchStartX = t.pageX, this.touchStartY = t.pageY, this.maxMove = 0, this.zoom <= 1 ? this.dragToFlip && (this.activeCursor = "grab") : (this.startScrollLeft = this.$refs.viewport.scrollLeft, this.startScrollTop = this.$refs.viewport.scrollTop, this.activeCursor = "all-scroll");
    },
    swipeMove(t) {
      if (this.touchStartX == null) return !1;
      const i = t.pageX - this.touchStartX, r = t.pageY - this.touchStartY;
      return this.maxMove = Math.max(this.maxMove, Math.abs(i)), this.maxMove = Math.max(this.maxMove, Math.abs(r)), this.zoom > 1 ? (this.dragToScroll && this.dragScroll(i, r), !1) : !this.dragToFlip || Math.abs(r) > Math.abs(i) ? !1 : (this.activeCursor = "grabbing", i > 0 ? (this.flip.direction == null && this.canFlipLeft && i >= this.swipeMin && this.flipStart("left", !1), this.flip.direction === "left" && (this.flip.progress = i / this.pageWidth, this.flip.progress > 1 && (this.flip.progress = 1))) : (this.flip.direction == null && this.canFlipRight && i <= -this.swipeMin && this.flipStart("right", !1), this.flip.direction === "right" && (this.flip.progress = -i / this.pageWidth, this.flip.progress > 1 && (this.flip.progress = 1))), !0);
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
      for (let i = this.currentPage - 3; i <= this.currentPage + 3; i++)
        this.pageUrlLoading(i);
      if (t)
        for (let i = this.currentPage; i < this.currentPage + this.displayedPages; i++) {
          const r = this.pagesHiRes[i];
          if (r) {
            const o = new Image();
            o.src = r;
          }
        }
    },
    goToPage(t) {
      t == null || t === this.page || (this.pages[0] == null ? this.displayedPages === 2 && t === 1 ? this.currentPage = 0 : this.currentPage = t : this.currentPage = t - 1, this.minX = 1 / 0, this.maxX = -1 / 0, this.currentCenterOffset = this.centerOffset);
    },
    loadImage(t) {
      if (this.imageWidth == null || this.loadedImages[t])
        return t;
      const i = new Image();
      return i.onload = () => {
        this.$set ? this.$set(this.loadedImages, t, !0) : this.loadedImages[t] = !0;
      }, i.src = t, this.loadingImage;
    }
  }
}, _ = ["src"], tt = ["src"];
function it(t, i, r, o, a, e) {
  return M(), v("div", null, [
    B(t.$slots, "default", Z(N({
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
      class: S(["viewport", {
        zoom: a.zooming || a.zoom > 1,
        "drag-to-scroll": e.dragToScroll
      }]),
      style: f({ cursor: e.cursor == "grabbing" ? "grabbing" : "auto" }),
      onTouchmove: i[7] || (i[7] = (...s) => e.onTouchMove && e.onTouchMove(...s)),
      onPointermove: i[8] || (i[8] = (...s) => e.onPointerMove && e.onPointerMove(...s)),
      onMousemove: i[9] || (i[9] = (...s) => e.onMouseMove && e.onMouseMove(...s)),
      onTouchend: i[10] || (i[10] = (...s) => e.onTouchEnd && e.onTouchEnd(...s)),
      onTouchcancel: i[11] || (i[11] = (...s) => e.onTouchEnd && e.onTouchEnd(...s)),
      onPointerup: i[12] || (i[12] = (...s) => e.onPointerUp && e.onPointerUp(...s)),
      onPointercancel: i[13] || (i[13] = (...s) => e.onPointerUp && e.onPointerUp(...s)),
      onMouseup: i[14] || (i[14] = (...s) => e.onMouseUp && e.onMouseUp(...s)),
      onWheel: i[15] || (i[15] = (...s) => e.onWheel && e.onWheel(...s))
    }, [
      p("div", {
        class: "flipbook-container",
        style: f({ transform: `scale(${a.zoom})` })
      }, [
        p("div", {
          class: "click-to-flip left",
          style: f({ cursor: e.canFlipLeft ? "pointer" : "auto" }),
          onClick: i[0] || (i[0] = (...s) => e.flipLeft && e.flipLeft(...s))
        }, null, 4),
        p("div", {
          class: "click-to-flip right",
          style: f({ cursor: e.canFlipRight ? "pointer" : "auto" }),
          onClick: i[1] || (i[1] = (...s) => e.flipRight && e.flipRight(...s))
        }, null, 4),
        p("div", {
          style: f({ transform: `translateX(${e.centerOffsetSmoothed}px)` })
        }, [
          e.showLeftPage ? (M(), v("img", {
            key: 0,
            class: "page fixed",
            style: f({
              width: e.pageWidth + "px",
              height: e.pageHeight + "px",
              left: e.xMargin + "px",
              top: e.yMargin + "px"
            }),
            src: e.pageUrlLoading(e.leftPage, !0),
            onLoad: i[2] || (i[2] = (s) => e.didLoadImage(s))
          }, null, 44, _)) : W("", !0),
          e.showRightPage ? (M(), v("img", {
            key: 1,
            class: "page fixed",
            style: f({
              width: e.pageWidth + "px",
              height: e.pageHeight + "px",
              left: a.viewWidth / 2 + "px",
              top: e.yMargin + "px"
            }),
            src: e.pageUrlLoading(e.rightPage, !0),
            onLoad: i[3] || (i[3] = (s) => e.didLoadImage(s))
          }, null, 44, tt)) : W("", !0),
          p("div", {
            style: f({ opacity: a.flip.opacity })
          }, [
            (M(!0), v(q, null, G(e.polygonArray, ([s, n, h, g, m, u]) => (M(), v("div", {
              key: s,
              class: S(["polygon", { blank: !n }]),
              style: f({
                backgroundImage: n && `url(${e.loadImage(n)})`,
                backgroundSize: e.polygonBgSize,
                backgroundPosition: g,
                width: e.polygonWidth,
                height: e.polygonHeight,
                transform: m,
                zIndex: u
              })
            }, [
              V(p("div", {
                class: "lighting",
                style: f({ backgroundImage: h })
              }, null, 4), [
                [j, h.length]
              ])
            ], 6))), 128))
          ], 4),
          p("div", {
            class: "bounding-box",
            style: f({
              left: e.boundingLeft + "px",
              top: e.yMargin + "px",
              width: e.boundingRight - e.boundingLeft + "px",
              height: e.pageHeight + "px",
              cursor: e.cursor
            }),
            onTouchstart: i[4] || (i[4] = (...s) => e.onTouchStart && e.onTouchStart(...s)),
            onPointerdown: i[5] || (i[5] = (...s) => e.onPointerDown && e.onPointerDown(...s)),
            onMousedown: i[6] || (i[6] = (...s) => e.onMouseDown && e.onMouseDown(...s))
          }, null, 36)
        ], 4)
      ], 4)
    ], 38)
  ]);
}
const X = /* @__PURE__ */ K($, [["render", it], ["__scopeId", "data-v-2f29e5e1"]]);
window.Vue && window.Vue.component ? Vue.component("flipbook", X) : window.Flipbook = X;
export {
  X as default
};
