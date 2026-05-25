(function () {
  "use strict";

  function PageLoader(options) {
    this.minDuration = options.minDuration || 2950;
    this.fadeOutMs = options.fadeOutMs || 320;
    this.logoSrc = options.logoSrc || "images/logop.png";
    this.fallbackLogoSrc = options.fallbackLogoSrc || "images/profyna-logo.png";
    this.active = false;
    this.startedAt = 0;
    this.loaderEl = null;
    this.logoEl = null;
  }

  PageLoader.prototype.mount = function () {
    if (this.loaderEl) return;

    var wrapper = document.createElement("div");
    wrapper.id = "page-loader";
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.innerHTML =
      '<div class="page-loader-core">' +
      '  <span class="page-loader-ring"></span>' +
      '  <div class="page-loader-logo-wrap">' +
      '    <img class="page-loader-logo" alt="Loading" decoding="async" />' +
      "  </div>" +
      "</div>";

    document.body.appendChild(wrapper);
    this.loaderEl = wrapper;
    this.logoEl = wrapper.querySelector(".page-loader-logo");

    this.logoEl.src = this.logoSrc;
    this.logoEl.addEventListener("error", this.onLogoError.bind(this), { once: true });
  };

  PageLoader.prototype.onLogoError = function () {
    if (this.logoEl && this.logoEl.src.indexOf(this.fallbackLogoSrc) === -1) {
      this.logoEl.src = this.fallbackLogoSrc;
    }
  };

  PageLoader.prototype.show = function () {
    if (this.active) return;
    this.active = true;
    this.startedAt = Date.now();
    this.mount();
    this.loaderEl.classList.add("is-active");
  };

  PageLoader.prototype.hide = function () {
    var self = this;
    if (!self.loaderEl) return;

    var elapsed = Date.now() - self.startedAt;
    var wait = Math.max(self.minDuration - elapsed, 0);

    window.setTimeout(function () {
      self.loaderEl.classList.remove("is-active");
      window.setTimeout(function () {
        self.active = false;
      }, self.fadeOutMs);
    }, wait);
  };

  PageLoader.prototype.handleNavigation = function () {
    var self = this;
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var link = event.target.closest("a");
      if (!self.shouldIntercept(link)) return;

      event.preventDefault();
      var href = link.href;
      self.show();
      window.setTimeout(function () {
        window.location.href = href;
      }, 2380);
    }, true);
  };

  PageLoader.prototype.shouldIntercept = function (link) {
    if (!link || !link.href) return false;
    if (link.target === "_blank") return false;
    if (link.hasAttribute("download")) return false;
    if (link.getAttribute("data-no-loader") === "true") return false;

    var href = link.getAttribute("href") || "";
    if (!href || href === "#" || href.indexOf("#") === 0) return false;
    if (href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return false;
    if (href.indexOf("javascript:") === 0) return false;

    var nextUrl = new URL(link.href, window.location.href);
    if (nextUrl.origin !== window.location.origin) return false;
    if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search) return false;
    return true;
  };

  PageLoader.prototype.init = function () {
    this.mount();
    this.handleNavigation();

    var self = this;
    window.addEventListener("beforeunload", function () {
      self.show();
    });

    window.addEventListener("pageshow", function () {
      self.hide();
    });
  };

  window.PageLoader = PageLoader;

  document.addEventListener("DOMContentLoaded", function () {
    var loader = new PageLoader({
      minDuration: 2950,
      fadeOutMs: 320,
      logoSrc: "images/logop.png",
      fallbackLogoSrc: "images/profyna-logo.png"
    });
    loader.init();
    loader.hide();
  });
})();
