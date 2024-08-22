import { identity as H, multiply as R, perspective as U, translate as A, translate3d as Y, rotateY as B, toString as Z } from "rematrix";
import { openBlock as v, createElementBlock as M, renderSlot as N, normalizeProps as q, guardReactiveProps as G, createElementVNode as m, normalizeClass as k, normalizeStyle as u, createCommentVNode as D, Fragment as V, renderList as j, withDirectives as J, vShow as K } from "vue";
/*!
 * @license
 * flipbook v1.0.0-beta.5
 * Copyright © 2024 Takeshi Sone.
 * Released under the MIT License.
 */
class z {
  constructor(e) {
    e ? e.m ? this.m = [...e.m] : this.m = [...e] : this.m = H();
  }
  clone() {
    return new z(this);
  }
  multiply(e) {
    this.m = R(this.m, e);
  }
  perspective(e) {
    this.multiply(U(e));
  }
  transformX(e) {
    return (e * this.m[0] + this.m[12]) / (e * this.m[3] + this.m[15]);
  }
  translate(e, r) {
    this.multiply(A(e, r));
  }
  translate3d(e, r, a) {
    this.multiply(Y(e, r, a));
  }
  rotateY(e) {
    this.multiply(B(e));
  }
  toString() {
    return Z(this.m);
  }
}
const Q = "data:image/svg+xml,%3c?xml%20version='1.0'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='500'%20height='500'%20viewBox='0%200%20500%20500'%20fill='transparent'%20style='background-color:%20%23fff'%3e%3ccircle%20cx='250'%20cy='250'%20r='48'%20stroke='%23333'%20stroke-width='2'%20stroke-dasharray='271%2030'%20%3e%3canimateTransform%20attributeName='transform'%20attributeType='XML'%20type='rotate'%20from='0%20250%20250'%20to='360%20250%20250'%20dur='1s'%20repeatCount='indefinite'%20/%3e%3c/circle%3e%3c/svg%3e", _ = (t, e) => {
  const r = t.__vccOpts || t;
  for (const [a, n] of e)
    r[a] = n;
  return r;
}, X = (t) => Math.pow(t, 2), $ = (t) => 1 - X(1 - t), E = function(t) {
  return t < 0.5 ? X(t * 2) / 2 : 0.5 + $((t - 0.5) * 2) / 2;
}, tt = {
  name: "Flipbook",
  props: {
    pages: {
      type: Array,
      required: !0
    },
    pagesHiRes: {
      type: Array,
      default() {
        return [];
      }
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
      default() {
        return [1, 2, 4];
      }
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
      validator(t) {
        return t === "right" || t === "left";
      },
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
      default: Q
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
      return this.forwardDirection == "left" ? this.canGoForward : this.canGoBack;
    },
    canFlipRight() {
      return this.forwardDirection == "right" ? this.canGoForward : this.canGoBack;
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
      return this.forwardDirection == "right" || this.displayedPages == 1 ? this.firstPage : this.secondPage;
    },
    rightPage() {
      return this.forwardDirection == "left" ? this.firstPage : this.secondPage;
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
      const e = this.viewWidth / this.displayedPages / this.imageWidth, r = this.viewHeight / this.imageHeight, a = e < r ? e : r;
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
      return this.makePolygonArray("front").concat(this.makePolygonArray("back"));
    },
    boundingLeft() {
      if (this.displayedPages === 1)
        return this.xMargin;
      {
        const t = this.pageUrl(this.leftPage) ? this.xMargin : this.viewWidth / 2;
        return t < this.minX ? t : this.minX;
      }
    },
    boundingRight() {
      if (this.displayedPages === 1)
        return this.viewWidth - this.xMargin;
      {
        const t = this.pageUrl(this.rightPage) ? this.viewWidth - this.xMargin : this.viewWidth / 2;
        return t > this.maxX ? t : this.maxX;
      }
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
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize, { passive: !0 });
  },
  methods: {
    onResize() {
      const { viewport: t } = this.$refs;
      t && (this.viewWidth = t.clientWidth, this.viewHeight = t.clientHeight, this.displayedPages = this.viewWidth > this.viewHeight && !this.singlePage || this.doublePage ? 2 : 1, console.log("onResize", this.displayedPages), this.displayedPages === 2 && (this.currentPage &= -2), this.fixFirstPage(), this.minX = 1 / 0, this.maxX = -1 / 0);
    },
    fixFirstPage() {
      this.displayedPages === 1 && this.currentPage === 0 && this.pages.length && !this.pageUrl(0) && this.currentPage++;
    },
    pageUrl(t, e) {
      if (e == null && (e = !1), e && this.zoom > 1 && !this.zooming) {
        const r = this.pagesHiRes[t];
        if (r)
          return r;
      }
      return this.pages[t] || null;
    },
    pageUrlLoading(t, e) {
      e == null && (e = !1);
      const r = this.pageUrl(t, e);
      return e && this.zoom > 1 && !this.zooming ? r : r && this.loadImage(r);
    },
    flipLeft() {
      this.canFlipLeft && this.flipStart("left", !0);
    },
    flipRight() {
      this.canFlipRight && this.flipStart("right", !0);
    },
    makePolygonArray(t) {
      let e;
      if (!this.flip.direction)
        return [];
      let {
        progress: r
      } = this.flip, {
        direction: a
      } = this.flip;
      this.displayedPages === 1 && a !== this.forwardDirection && (r = 1 - r, a = this.forwardDirection), this.flip.opacity = this.displayedPages === 1 && r > 0.7 ? 1 - (r - 0.7) / 0.3 : 1;
      const n = t === "front" ? this.flip.frontImage : this.flip.backImage, i = this.pageWidth / this.nPolygons;
      let s = this.xMargin, o = !1;
      this.displayedPages === 1 ? this.forwardDirection === "right" ? t === "back" && (o = !0, s = this.xMargin - this.pageWidth) : a === "left" ? t === "back" ? s = this.pageWidth - this.xMargin : o = !0 : t === "front" ? s = this.pageWidth - this.xMargin : o = !0 : a === "left" ? t === "back" ? s = this.viewWidth / 2 : o = !0 : t === "front" ? s = this.viewWidth / 2 : o = !0;
      const h = new z();
      h.translate(this.viewWidth / 2), h.perspective(this.perspective), h.translate(-this.viewWidth / 2), h.translate(s, this.yMargin);
      let g = 0;
      r > 0.5 && (g = -(r - 0.5) * 2 * 180), a === "left" && (g = -g), t === "back" && (g += 180), g && (o && h.translate(this.pageWidth), h.rotateY(g), o && h.translate(-this.pageWidth)), r < 0.5 ? e = r * 2 * Math.PI : e = (1 - (r - 0.5) * 2) * Math.PI, e === 0 && (e = 1e-9);
      const P = this.pageWidth / e;
      let f = 0;
      const w = e / this.nPolygons;
      let d = w / 2 / Math.PI * 180, c = w / Math.PI * 180;
      return o && (d = -e / Math.PI * 180 + c / 2), t === "back" && (d = -d, c = -c), this.minX = 1 / 0, this.maxX = -1 / 0, (() => {
        const p = [];
        for (let l = 0, b = this.nPolygons, L = 0 <= b; L ? l < b : l > b; L ? l++ : l--) {
          const O = `${l / (this.nPolygons - 1) * 100}% 0px`, y = h.clone(), T = o ? e - f : f;
          let I = Math.sin(T) * P;
          o && (I = this.pageWidth - I);
          let x = (1 - Math.cos(T)) * P;
          t === "back" && (x = -x), y.translate3d(I, 0, x), y.rotateY(-d);
          const W = y.transformX(0), S = y.transformX(i);
          this.maxX = Math.max(Math.max(W, S), this.maxX), this.minX = Math.min(Math.min(W, S), this.minX);
          const C = this.computeLighting(g - d, c);
          f += w, d += c, p.push([t + l, n, C, O, y.toString(), Math.abs(Math.round(x))]);
        }
        return p;
      })();
    },
    computeLighting(t, e) {
      const r = [], a = [-0.5, -0.25, 0, 0.25, 0.5];
      if (this.ambient < 1) {
        const n = 1 - this.ambient, i = a.map((s) => (1 - Math.cos((t - e * s) / 180 * Math.PI)) * n);
        r.push(
          `          linear-gradient(to right,
            rgba(0, 0, 0, ${i[0]}),
            rgba(0, 0, 0, ${i[1]}) 25%,
            rgba(0, 0, 0, ${i[2]}) 50%,
            rgba(0, 0, 0, ${i[3]}) 75%,
            rgba(0, 0, 0, ${i[4]}))          `
        );
      }
      if (this.gloss > 0 && !this.IE) {
        const s = a.map((o) => Math.max(
          Math.pow(Math.cos((t + 30 - e * o) / 180 * Math.PI), 200),
          Math.pow(Math.cos((t - 30 - e * o) / 180 * Math.PI), 200)
        ));
        r.push(
          `          linear-gradient(to right,
            rgba(255, 255, 255, ${s[0] * this.gloss}),
            rgba(255, 255, 255, ${s[1] * this.gloss}) 25%,
            rgba(255, 255, 255, ${s[2] * this.gloss}) 50%,
            rgba(255, 255, 255, ${s[3] * this.gloss}) 75%,
            rgba(255, 255, 255, ${s[4] * this.gloss}))          `
        );
      }
      return r.join(",");
    },
    flipStart(t, e) {
      return t !== this.forwardDirection ? this.displayedPages === 1 ? (this.flip.frontImage = this.pageUrl(this.currentPage - 1), this.flip.backImage = null) : (this.flip.frontImage = this.pageUrl(this.firstPage), this.flip.backImage = this.pageUrl(this.currentPage - this.displayedPages + 1)) : this.displayedPages === 1 ? (this.flip.frontImage = this.pageUrl(this.currentPage), this.flip.backImage = null) : (this.flip.frontImage = this.pageUrl(this.secondPage), this.flip.backImage = this.pageUrl(this.currentPage + this.displayedPages)), this.flip.direction = t, this.flip.progress = 0, requestAnimationFrame(() => requestAnimationFrame(() => {
        if (this.flip.direction !== this.forwardDirection ? this.displayedPages === 2 && (this.firstPage = this.currentPage - this.displayedPages) : this.displayedPages === 1 ? this.firstPage = this.currentPage + this.displayedPages : this.secondPage = this.currentPage + 1 + this.displayedPages, e)
          return this.flipAuto(!0);
      }));
    },
    flipAuto(t) {
      const e = Date.now(), r = this.flipDuration * (1 - this.flip.progress), a = this.flip.progress;
      this.flip.auto = !0, this.$emit(`flip-${this.flip.direction}-start`, this.page);
      var n = () => requestAnimationFrame(() => {
        const i = Date.now() - e;
        let s = a + i / r;
        return s > 1 && (s = 1), this.flip.progress = t ? E(s) : s, s < 1 ? n() : (this.flip.direction !== this.forwardDirection ? this.currentPage -= this.displayedPages : this.currentPage += this.displayedPages, this.$emit(`flip-${this.flip.direction}-end`, this.page), this.displayedPages === 1 && this.flip.direction === this.forwardDirection ? this.flip.direction = null : this.onImageLoad(1, () => this.flip.direction = null), this.flip.auto = !1);
      });
      return n();
    },
    flipRevert() {
      const t = Date.now(), e = this.flipDuration * this.flip.progress, r = this.flip.progress;
      this.flip.auto = !0;
      var a = () => requestAnimationFrame(() => {
        const n = Date.now() - t;
        let i = r - r * n / e;
        return i < 0 && (i = 0), this.flip.progress = i, i > 0 ? a() : (this.firstPage = this.currentPage, this.secondPage = this.currentPage + 1, this.displayedPages === 1 && this.flip.direction !== this.forwardDirection ? this.flip.direction = null : this.onImageLoad(1, () => this.flip.direction = null), this.flip.auto = !1);
      });
      return a();
    },
    onImageLoad(t, e) {
      return this.nImageLoad = 0, this.nImageLoadTrigger = t, this.imageLoadCallback = e;
    },
    didLoadImage(t) {
      if (this.imageWidth === null && (this.imageWidth = (t.target || t.path[0]).naturalWidth, this.imageHeight = (t.target || t.path[0]).naturalHeight, this.preloadImages()), !!this.imageLoadCallback && ++this.nImageLoad >= this.nImageLoadTrigger)
        return this.imageLoadCallback(), this.imageLoadCallback = null;
    },
    zoomIn(t = null) {
      if (this.canZoomIn)
        return this.zoomIndex += 1, this.zoomTo(this.zooms_[this.zoomIndex], t);
    },
    zoomOut(t = null) {
      if (this.canZoomOut)
        return this.zoomIndex -= 1, this.zoomTo(this.zooms_[this.zoomIndex], t);
    },
    zoomTo(t, e = null) {
      let r, a;
      const {
        viewport: n
      } = this.$refs;
      if (e) {
        const p = n.getBoundingClientRect();
        r = e.pageX - p.left, a = e.pageY - p.top;
      } else
        r = n.clientWidth / 2, a = n.clientHeight / 2;
      const i = this.zoom, s = t, o = n.scrollLeft, h = n.scrollTop, g = r + o, P = a + h, f = g / i * s - r, w = P / i * s - a, d = Date.now();
      this.zooming = !0, this.$emit("zoom-start", t);
      var c = () => requestAnimationFrame(() => {
        const p = Date.now() - d;
        let l = p / this.zoomDuration;
        return (l > 1 || this.IE) && (l = 1), l = E(l), this.zoom = i + (s - i) * l, this.scrollLeft = o + (f - o) * l, this.scrollTop = h + (w - h) * l, p < this.zoomDuration ? c() : (this.$emit("zoom-end", t), this.zooming = !1, this.zoom = t, this.scrollLeft = f, this.scrollTop = w);
      });
      if (c(), s > 1)
        return this.preloadImages(!0);
    },
    zoomAt(t) {
      return this.zoomIndex = (this.zoomIndex + 1) % this.zooms_.length, this.zoomTo(this.zooms_[this.zoomIndex], t);
    },
    swipeStart(t) {
      if (this.touchStartX = t.pageX, this.touchStartY = t.pageY, this.maxMove = 0, this.zoom <= 1) {
        if (this.dragToFlip)
          return this.activeCursor = "grab";
      } else
        return this.startScrollLeft = this.$refs.viewport.scrollLeft, this.startScrollTop = this.$refs.viewport.scrollTop, this.activeCursor = "all-scroll";
    },
    swipeMove(t) {
      if (this.touchStartX == null)
        return;
      const e = t.pageX - this.touchStartX, r = t.pageY - this.touchStartY;
      if (this.maxMove = Math.max(this.maxMove, Math.abs(e)), this.maxMove = Math.max(this.maxMove, Math.abs(r)), this.zoom > 1) {
        this.dragToScroll && this.dragScroll(e, r);
        return;
      }
      if (this.dragToFlip && !(Math.abs(r) > Math.abs(e)))
        return this.activeCursor = "grabbing", e > 0 ? (this.flip.direction === null && this.canFlipLeft && e >= this.swipeMin && this.flipStart("left", !1), this.flip.direction === "left" && (this.flip.progress = e / this.pageWidth, this.flip.progress > 1 && (this.flip.progress = 1))) : (this.flip.direction === null && this.canFlipRight && e <= -this.swipeMin && this.flipStart("right", !1), this.flip.direction === "right" && (this.flip.progress = -e / this.pageWidth, this.flip.progress > 1 && (this.flip.progress = 1))), !0;
    },
    swipeEnd(t) {
      if (this.touchStartX != null)
        return this.clickToZoom && this.maxMove < this.swipeMin && this.zoomAt(t), this.flip.direction !== null && !this.flip.auto && (this.flip.progress > 1 / 4 ? this.flipAuto(!1) : this.flipRevert()), this.touchStartX = null, this.activeCursor = null;
    },
    onTouchStart(t) {
      return this.hasTouchEvents = !0, this.swipeStart(t.changedTouches[0]);
    },
    onTouchMove(t) {
      if (this.swipeMove(t.changedTouches[0]) && t.cancelable)
        return t.preventDefault();
    },
    onTouchEnd(t) {
      return this.swipeEnd(t.changedTouches[0]);
    },
    onPointerDown(t) {
      if (this.hasPointerEvents = !0, !this.hasTouchEvents && !(t.which && t.which !== 1)) {
        this.swipeStart(t);
        try {
          return t.target.setPointerCapture(t.pointerId);
        } catch {
        }
      }
    },
    onPointerMove(t) {
      if (!this.hasTouchEvents)
        return this.swipeMove(t);
    },
    onPointerUp(t) {
      if (!this.hasTouchEvents) {
        this.swipeEnd(t);
        try {
          return t.target.releasePointerCapture(t.pointerId);
        } catch {
        }
      }
    },
    onMouseDown(t) {
      if (!(this.hasTouchEvents || this.hasPointerEvents) && !(t.which && t.which !== 1))
        return this.swipeStart(t);
    },
    onMouseMove(t) {
      if (!this.hasTouchEvents && !this.hasPointerEvents)
        return this.swipeMove(t);
    },
    onMouseUp(t) {
      if (!this.hasTouchEvents && !this.hasPointerEvents)
        return this.swipeEnd(t);
    },
    dragScroll(t, e) {
      return this.scrollLeft = this.startScrollLeft - t, this.scrollTop = this.startScrollTop - e;
    },
    onWheel(t) {
      if (this.wheel === "scroll" && this.zoom > 1 && this.dragToScroll && (this.scrollLeft = this.$refs.viewport.scrollLeft + t.deltaX, this.scrollTop = this.$refs.viewport.scrollTop + t.deltaY, t.cancelable && t.preventDefault()), this.wheel === "zoom") {
        if (t.deltaY >= 100)
          return this.zoomOut(t), t.preventDefault();
        if (t.deltaY <= -100)
          return this.zoomIn(t), t.preventDefault();
      }
    },
    preloadImages(t) {
      let e, r, a, n;
      for (t == null && (t = !1), a = this.currentPage - 3, n = a, r = this.currentPage + 3, e = a <= r; e ? n <= r : n >= r; e ? n++ : n--)
        this.pageUrlLoading(n);
      if (t) {
        let i, s;
        for (n = this.currentPage, s = this.currentPage + this.displayedPages, i = this.currentPage <= s; i ? n < s : n > s; i ? n++ : n--) {
          const o = this.pagesHiRes[n];
          o && (new Image().src = o);
        }
      }
    },
    goToPage(t) {
      if (!(t === null || t === this.page))
        return this.pages[0] === null ? this.displayedPages === 2 && t === 1 ? this.currentPage = 0 : this.currentPage = t : this.currentPage = t - 1, this.minX = 1 / 0, this.maxX = -1 / 0, this.currentCenterOffset = this.centerOffset;
    },
    loadImage(t) {
      if (this.imageWidth === null)
        return t;
      if (this.loadedImages[t])
        return t;
      {
        const e = new Image();
        return e.onload = () => this.$set ? this.$set(this.loadedImages, t, !0) : this.loadedImages[t] = !0, e.src = t, this.loadingImage;
      }
    }
  },
  watch: {
    currentPage() {
      return this.firstPage = this.currentPage, this.secondPage = this.currentPage + 1, this.preloadImages();
    },
    centerOffset() {
      if (!this.animatingCenter) {
        var t = () => requestAnimationFrame(() => {
          const r = this.centerOffset - this.currentCenterOffset;
          return Math.abs(r) < 0.5 ? (this.currentCenterOffset = this.centerOffset, this.animatingCenter = !1) : (this.currentCenterOffset += r * 0.1, t());
        });
        return this.animatingCenter = !0, t();
      }
    },
    scrollLeftLimited(t) {
      return this.IE ? requestAnimationFrame(() => this.$refs.viewport.scrollLeft = t) : this.$refs.viewport.scrollLeft = t;
    },
    scrollTopLimited(t) {
      return this.IE ? requestAnimationFrame(() => this.$refs.viewport.scrollTop = t) : this.$refs.viewport.scrollTop = t;
    },
    pages(t, e) {
      if (this.fixFirstPage(), !(e != null && e.length) && (t != null && t.length) && this.startPage > 1 && t[0] === null)
        return this.currentPage++;
    },
    startPage(t) {
      return this.goToPage(t);
    }
  }
}, et = ["src"], it = ["src"];
function st(t, e, r, a, n, i) {
  return v(), M("div", null, [
    N(t.$slots, "default", q(G({
      canFlipLeft: i.canFlipLeft,
      canFlipRight: i.canFlipRight,
      canZoomIn: i.canZoomIn,
      canZoomOut: i.canZoomOut,
      page: i.page,
      numPages: i.numPages,
      flipLeft: i.flipLeft,
      flipRight: i.flipRight,
      zoomIn: i.zoomIn,
      zoomOut: i.zoomOut
    })), void 0, !0),
    m("div", {
      class: k(["viewport", {
        zoom: n.zooming || n.zoom > 1,
        "drag-to-scroll": i.dragToScroll
      }]),
      ref: "viewport",
      style: u({ cursor: i.cursor == "grabbing" ? "grabbing" : "auto" }),
      onTouchmove: e[7] || (e[7] = (...s) => i.onTouchMove && i.onTouchMove(...s)),
      onPointermove: e[8] || (e[8] = (...s) => i.onPointerMove && i.onPointerMove(...s)),
      onMousemove: e[9] || (e[9] = (...s) => i.onMouseMove && i.onMouseMove(...s)),
      onTouchend: e[10] || (e[10] = (...s) => i.onTouchEnd && i.onTouchEnd(...s)),
      onTouchcancel: e[11] || (e[11] = (...s) => i.onTouchEnd && i.onTouchEnd(...s)),
      onPointerup: e[12] || (e[12] = (...s) => i.onPointerUp && i.onPointerUp(...s)),
      onPointercancel: e[13] || (e[13] = (...s) => i.onPointerUp && i.onPointerUp(...s)),
      onMouseup: e[14] || (e[14] = (...s) => i.onMouseUp && i.onMouseUp(...s)),
      onWheel: e[15] || (e[15] = (...s) => i.onWheel && i.onWheel(...s))
    }, [
      m("div", {
        class: "flipbook-container",
        style: u({ transform: `scale(${n.zoom})` })
      }, [
        m("div", {
          class: "click-to-flip left",
          style: u({ cursor: i.canFlipLeft ? "pointer" : "auto" }),
          onClick: e[0] || (e[0] = (...s) => i.flipLeft && i.flipLeft(...s))
        }, null, 4),
        m("div", {
          class: "click-to-flip right",
          style: u({ cursor: i.canFlipRight ? "pointer" : "auto" }),
          onClick: e[1] || (e[1] = (...s) => i.flipRight && i.flipRight(...s))
        }, null, 4),
        m("div", {
          style: u({ transform: `translateX(${i.centerOffsetSmoothed}px)` })
        }, [
          i.showLeftPage ? (v(), M("img", {
            key: 0,
            class: "page fixed",
            style: u({
              width: i.pageWidth + "px",
              height: i.pageHeight + "px",
              left: i.xMargin + "px",
              top: i.yMargin + "px"
            }),
            src: i.pageUrlLoading(i.leftPage, !0),
            onLoad: e[2] || (e[2] = (s) => i.didLoadImage(s))
          }, null, 44, et)) : D("", !0),
          i.showRightPage ? (v(), M("img", {
            key: 1,
            class: "page fixed",
            style: u({
              width: i.pageWidth + "px",
              height: i.pageHeight + "px",
              left: n.viewWidth / 2 + "px",
              top: i.yMargin + "px"
            }),
            src: i.pageUrlLoading(i.rightPage, !0),
            onLoad: e[3] || (e[3] = (s) => i.didLoadImage(s))
          }, null, 44, it)) : D("", !0),
          m("div", {
            style: u({ opacity: n.flip.opacity })
          }, [
            (v(!0), M(V, null, j(i.polygonArray, ([
              s,
              o,
              h,
              g,
              P,
              f
            ]) => (v(), M("div", {
              class: k(["polygon", { blank: !o }]),
              key: s,
              style: u({
                backgroundImage: o && `url(${i.loadImage(o)})`,
                backgroundSize: i.polygonBgSize,
                backgroundPosition: g,
                width: i.polygonWidth,
                height: i.polygonHeight,
                transform: P,
                zIndex: f
              })
            }, [
              J(m("div", {
                class: "lighting",
                style: u({ backgroundImage: h })
              }, null, 4), [
                [K, h.length]
              ])
            ], 6))), 128))
          ], 4),
          m("div", {
            class: "bounding-box",
            style: u({
              left: i.boundingLeft + "px",
              top: i.yMargin + "px",
              width: i.boundingRight - i.boundingLeft + "px",
              height: i.pageHeight + "px",
              cursor: i.cursor
            }),
            onTouchstart: e[4] || (e[4] = (...s) => i.onTouchStart && i.onTouchStart(...s)),
            onPointerdown: e[5] || (e[5] = (...s) => i.onPointerDown && i.onPointerDown(...s)),
            onMousedown: e[6] || (e[6] = (...s) => i.onMouseDown && i.onMouseDown(...s))
          }, null, 36)
        ], 4)
      ], 4)
    ], 38)
  ]);
}
const F = /* @__PURE__ */ _(tt, [["render", st], ["__scopeId", "data-v-a1479749"]]);
window.Vue && window.Vue.component ? Vue.component("flipbook", F) : window.Flipbook = F;
export {
  F as default
};
