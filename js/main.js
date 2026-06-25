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

  // Lightbox
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var lbCount = lb.querySelector(".lb-count");
  var group = [];
  var index = 0;

  function show(i) {
    index = (i + group.length) % group.length;
    lbImg.src = group[index];
    lbCount.textContent = (index + 1) + " / " + group.length;
  }
  function open(startTile) {
    var cat = startTile.getAttribute("data-cat");
    group = tiles
      .filter(function (t) { return t.getAttribute("data-cat") === cat; })
      .map(function (t) { return t.getAttribute("href"); });
    var start = tiles
      .filter(function (t) { return t.getAttribute("data-cat") === cat; })
      .indexOf(startTile);
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    show(start);
  }
  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  tiles.forEach(function (t) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      open(t);
    });
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

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
