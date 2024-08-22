import { identity as F, multiply as H, perspective as O, translate as U, translate3d as C, rotateY as A, toString as Y } from "rematrix";
import { openBlock as v, createElementBlock as M, renderSlot as B, normalizeProps as Z, guardReactiveProps as N, createElementVNode as p, normalizeClass as W, normalizeStyle as g, createCommentVNode as S, Fragment as G, renderList as q, withDirectives as V, vShow as j } from "vue";
/*!
 * @license
 * flipbook v1.0.0-beta.5
 * Copyright © 2024 Takeshi Sone.
 * Released under the MIT License.
 */
class x {
  constructor(i) {
    i ? i.m ? this.m = [...i.m] : this.m = [...i] : this.m = F();
  }
  clone() {
    return new x(this);
  }
  multiply(i) {
    this.m = H(this.m, i);
  }
  perspective(i) {
    this.multiply(O(i));
  }
  transformX(i) {
    return (i * this.m[0] + this.m[12]) / (i * this.m[3] + this.m[15]);
  }
  translate(i, r) {
    this.multiply(U(i, r));
  }
  translate3d(i, r, o) {
    this.multiply(C(i, r, o));
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
}, X = (t) => t ** 2, Q = (t) => 1 - X(1 - t), k = function(i) {
  return i < 0.5 ? X(i * 2) / 2 : 0.5 + Q((i - 0.5) * 2) / 2;
}, _ = {
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
      return console.log(`showLeftPage with leftPage ${this.leftPage}`), this.pageUrl(this.leftPage);
    },
    showRightPage() {
      return console.log(`showRightPage with rightPage ${this.rightPage}`), this.pageUrl(this.rightPage) && this.displayedPages === 2;
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
  mounted() {
    window.addEventListener("resize", this.onResize, { passive: !0 }), this.onResize(), this.zoom = this.zooms_[0], this.goToPage(this.startPage);
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
      if (console.log(`pageUrl of ${t} with hiRes ${i}`), i && this.zoom > 1 && !this.zooming) {
        const r = this.pagesHiRes[t];
        if (r) return r;
      }
      return console.log(`this.pages[page] is ${this.pages[t]}`), this.pages[t] || null;
    },
    pageUrlLoading(t, i = !1) {
      console.log(`pageUrlLoading of ${t} with hiRes ${i}`);
      const r = this.pageUrl(t, i);
      return console.log(`url is ${r}`), i && this.zoom > 1 && !this.zooming ? r : (console.log(`about to loadImage with url ${r}`), r ? this.loadImage(r) : null);
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
      let e = this.xMargin, s = !1;
      this.displayedPages === 1 ? this.forwardDirection === "right" ? t === "back" && (s = !0, e = this.xMargin - this.pageWidth) : r === "left" ? t === "back" ? e = this.pageWidth - this.xMargin : s = !0 : t === "front" ? e = this.pageWidth - this.xMargin : s = !0 : r === "left" ? t === "back" ? e = this.viewWidth / 2 : s = !0 : t === "front" ? e = this.viewWidth / 2 : s = !0;
      const n = new x();
      n.translate(this.viewWidth / 2), n.perspective(this.perspective), n.translate(-this.viewWidth / 2), n.translate(e, this.yMargin);
      let h = 0;
      i > 0.5 && (h = -(i - 0.5) * 2 * 180), r === "left" && (h = -h), t === "back" && (h += 180), h && (n.translate(this.pageWidth), s && n.translate(-this.pageWidth), n.rotateY(h));
      let f = i < 0.5 ? i * 2 * Math.PI : (1 - (i - 0.5) * 2) * Math.PI;
      f === 0 && (f = 1e-9);
      const m = this.pageWidth / f;
      let u = 0;
      const P = f / this.nPolygons;
      let d = P / 2 / Math.PI * 180;
      const w = P / Math.PI * 180;
      s && (d = -(f / Math.PI) * 180 + w / 2), t === "back" && (d = -d), this.minX = 1 / 0, this.maxX = -1 / 0;
      const c = [];
      for (let l = 0; l < this.nPolygons; l += 1) {
        const E = `${l / (this.nPolygons - 1) * 100}% 0px`, y = n.clone(), z = s ? f - u : u;
        let b = Math.sin(z) * m;
        s && (b = this.pageWidth - b);
        let I = (1 - Math.cos(z)) * m;
        t === "back" && (I = -I), y.translate3d(b, 0, I), y.rotateY(-d);
        const L = y.transformX(0), T = y.transformX(a);
        this.maxX = Math.max(Math.max(L, T), this.maxX), this.minX = Math.min(Math.min(L, T), this.minX);
        const R = this.computeLighting(h - d, w);
        u += P, d += w, c.push([`${t}${l}`, o, R, E, y.toString(), Math.abs(Math.round(I))]);
      }
      return c;
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
      console.log("didLoadImage"), this.imageWidth == null && (this.imageWidth = (t.target || t.path[0]).naturalWidth, this.imageHeight = (t.target || t.path[0]).naturalHeight, console.log(`about to preloadImages with this.imageWidth ${this.imageWidth}`), this.preloadImages()), this.imageLoadCallback && ++this.nImageLoad >= this.nImageLoadTrigger && (console.log("calling imageLoadCallback"), this.imageLoadCallback(), this.imageLoadCallback = null);
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
        const c = r.getBoundingClientRect();
        o = i.pageX - c.left, a = i.pageY - c.top;
      } else
        o = r.clientWidth / 2, a = r.clientHeight / 2;
      const e = this.zoom, s = t, n = r.scrollLeft, h = r.scrollTop, f = o + n, m = a + h, u = f / e * s - o, P = m / e * s - a, d = Date.now();
      this.zooming = !0, this.$emit("zoom-start", t);
      const w = () => {
        requestAnimationFrame(() => {
          const c = Date.now() - d;
          let l = c / this.zoomDuration;
          (l > 1 || this.IE) && (l = 1), l = k(l), this.zoom = e + (s - e) * l, this.scrollLeft = n + (u - n) * l, this.scrollTop = h + (P - h) * l, c < this.zoomDuration ? w() : (this.$emit("zoom-end", t), this.zooming = !1, this.zoom = t, this.scrollLeft = u, this.scrollTop = P);
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
      console.log(`preloadImages with hiRes ${t}`), console.log("this.currentPage", this.currentPage);
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
}, $ = ["src"], tt = ["src"];
function it(t, i, r, o, a, e) {
  return v(), M("div", null, [
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
      class: W(["viewport", {
        zoom: a.zooming || a.zoom > 1,
        "drag-to-scroll": e.dragToScroll
      }]),
      style: g({ cursor: e.cursor == "grabbing" ? "grabbing" : "auto" }),
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
        style: g({ transform: `scale(${a.zoom})` })
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
            onLoad: i[2] || (i[2] = (s) => e.didLoadImage(s))
          }, null, 44, $)) : S("", !0),
          e.showRightPage ? (v(), M("img", {
            key: 1,
            class: "page fixed",
            style: g({
              width: e.pageWidth + "px",
              height: e.pageHeight + "px",
              left: a.viewWidth / 2 + "px",
              top: e.yMargin + "px"
            }),
            src: e.pageUrlLoading(e.rightPage, !0),
            onLoad: i[3] || (i[3] = (s) => e.didLoadImage(s))
          }, null, 44, tt)) : S("", !0),
          p("div", {
            style: g({ opacity: a.flip.opacity })
          }, [
            (v(!0), M(G, null, q(e.polygonArray, ([s, n, h, f, m, u]) => (v(), M("div", {
              key: s,
              class: W(["polygon", { blank: !n }]),
              style: g({
                backgroundImage: n && `url(${e.loadImage(n)})`,
                backgroundSize: e.polygonBgSize,
                backgroundPosition: f,
                width: e.polygonWidth,
                height: e.polygonHeight,
                transform: m,
                zIndex: u
              })
            }, [
              V(p("div", {
                class: "lighting",
                style: g({ backgroundImage: h })
              }, null, 4), [
                [j, h.length]
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
            onTouchstart: i[4] || (i[4] = (...s) => e.onTouchStart && e.onTouchStart(...s)),
            onPointerdown: i[5] || (i[5] = (...s) => e.onPointerDown && e.onPointerDown(...s)),
            onMousedown: i[6] || (i[6] = (...s) => e.onMouseDown && e.onMouseDown(...s))
          }, null, 36)
        ], 4)
      ], 4)
    ], 38)
  ]);
}
const D = /* @__PURE__ */ K(_, [["render", it], ["__scopeId", "data-v-7aba66dd"]]);
window.Vue && window.Vue.component ? Vue.component("flipbook", D) : window.Flipbook = D;
export {
  D as default
};
