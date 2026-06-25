/* Uri Shymeiko — site interactions: nav, reveal, lightbox */
(function () {
  "use strict";

  // Sticky header shadow on scroll
  var header = document.querySelector(".header");
  var onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  var burger = document.querySelector(".burger");
  var links = document.querySelector(".nav-links");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      burger.classList.remove("open");
    }
  });

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Fade-in images as they load
  document.querySelectorAll(".tile img").forEach(function (img) {
    var done = function () { img.setAttribute("data-loaded", "1"); };
    if (img.complete && img.naturalWidth) done();
    else img.addEventListener("load", done, { once: true });
  });

  // Lightbox
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var lbCount = lb.querySelector(".lb-count");
  var group = [];
  var index = 0;

  function preload(src) { if (src) { var i = new Image(); i.src = src; } }
  function show(i) {
    index = (i + group.length) % group.length;
    lbImg.src = group[index];
    lbCount.textContent = (index + 1) + " / " + group.length;
    preload(group[(index + 1) % group.length]);
    preload(group[(index - 1 + group.length) % group.length]);
  }
  function open(startTile) {
    var cat = startTile.getAttribute("data-cat");
    var inCat = tiles.filter(function (t) { return t.getAttribute("data-cat") === cat; });
    group = inCat.map(function (t) { return t.getAttribute("href"); });
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    show(inCat.indexOf(startTile));
  }
  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  tiles.forEach(function (t) {
    t.addEventListener("click", function (e) { e.preventDefault(); open(t); });
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
  });

  // Touch swipe (mobile)
  var tsX = 0, tsY = 0;
  lb.addEventListener("touchstart", function (e) {
    tsX = e.changedTouches[0].clientX; tsY = e.changedTouches[0].clientY;
  }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - tsX;
    var dy = e.changedTouches[0].clientY - tsY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) close();
  }, { passive: true });

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Re-align to #hash after images/layout settle (lazy-load can shift anchors)
  function realignHash() {
    if (location.hash.length > 1) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) t.scrollIntoView();
    }
  }
  window.addEventListener("load", realignHash);
  setTimeout(realignHash, 600);
})();
