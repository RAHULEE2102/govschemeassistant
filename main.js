/* ============================================================
   Government Scheme Assistant India — main.js
   ============================================================ */

(function () {
  "use strict";

  /* ── Mobile Navigation ── */
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      links.classList.toggle("mobile-open");
    });
    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        toggle.classList.remove("open");
        links.classList.remove("mobile-open");
      }
    });
  }

  /* ── Back to Top ── */
  const backTop = document.getElementById("backTop");
  if (backTop) {
    window.addEventListener("scroll", function () {
      backTop.classList.toggle("visible", window.scrollY > 400);
    });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      const item = q.closest(".faq-item");
      const isOpen = item.classList.contains("open");
      // Close all
      document.querySelectorAll(".faq-item.open").forEach(function (i) {
        i.classList.remove("open");
      });
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ── Language Toggle (EN / HI) ── */
  const langBtn = document.getElementById("langToggle");
  const langBtnMob = document.getElementById("langToggleMob");
  function setLang(lang) {
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
    if (lang === "hi") {
      document.body.classList.add("lang-hi");
      document.querySelectorAll("[data-hi]").forEach(function (el) {
        el.dataset._en = el.dataset._en || el.textContent;
        el.textContent = el.dataset.hi;
      });
      if (langBtn) langBtn.textContent = "English";
      if (langBtnMob) langBtnMob.textContent = "English";
      localStorage.setItem("gsa_lang", "hi");
    } else {
      document.body.classList.remove("lang-hi");
      document.querySelectorAll("[data-hi]").forEach(function (el) {
        if (el.dataset._en) el.textContent = el.dataset._en;
      });
      if (langBtn) langBtn.textContent = "हिन्दी";
      if (langBtnMob) langBtnMob.textContent = "हिन्दी";
      localStorage.setItem("gsa_lang", "en");
    }
  }
  // Restore saved lang
  const savedLang = localStorage.getItem("gsa_lang");
  if (savedLang === "hi") setLang("hi");

  if (langBtn) langBtn.addEventListener("click", function () {
    setLang(document.body.classList.contains("lang-hi") ? "en" : "hi");
  });
  if (langBtnMob) langBtnMob.addEventListener("click", function () {
    setLang(document.body.classList.contains("lang-hi") ? "en" : "hi");
  });

  /* ── Global Search ── */
  const SCHEMES = [
    { title: "PM Kisan Samman Nidhi",               url: "schemes/pm-kisan.html",         icon: "🌾", cat: "Agriculture" },
    { title: "PM Fasal Bima Yojana",                 url: "schemes/pmfby.html",             icon: "🌿", cat: "Agriculture" },
    { title: "PM Kusum Yojana",                      url: "schemes/pm-kusum.html",          icon: "☀️", cat: "Agriculture" },
    { title: "Soil Health Card Scheme",              url: "schemes/soil-health-card.html",  icon: "🌱", cat: "Agriculture" },
    { title: "PM Awas Yojana (PMAY)",                url: "schemes/pm-awas.html",           icon: "🏠", cat: "Housing" },
    { title: "Credit Linked Subsidy Scheme",         url: "schemes/clss.html",              icon: "🏦", cat: "Housing" },
    { title: "Ayushman Bharat PM-JAY",               url: "schemes/ayushman-bharat.html",   icon: "🏥", cat: "Health" },
    { title: "Janani Suraksha Yojana",               url: "schemes/janani-suraksha.html",   icon: "🤱", cat: "Health" },
    { title: "National Scholarship Portal",          url: "schemes/nsp.html",               icon: "🎓", cat: "Education" },
    { title: "PM Vidya Lakshmi Scheme",              url: "schemes/vidya-lakshmi.html",     icon: "📚", cat: "Education" },
    { title: "Beti Bachao Beti Padhao",              url: "schemes/beti-bachao.html",       icon: "👧", cat: "Women & Child" },
    { title: "PM Mudra Yojana",                      url: "schemes/mudra-yojana.html",      icon: "💼", cat: "Business" },
    { title: "Startup India Initiative",             url: "schemes/startup-india.html",     icon: "🚀", cat: "Business" },
    { title: "Stand Up India Scheme",                url: "schemes/standup-india.html",     icon: "💡", cat: "Business" },
    { title: "PM Jeevan Jyoti Bima Yojana",         url: "schemes/pmjjby.html",            icon: "🛡️", cat: "Insurance" },
    { title: "PM Suraksha Bima Yojana",              url: "schemes/pmsby.html",             icon: "🔐", cat: "Insurance" },
    { title: "Atal Pension Yojana",                  url: "schemes/atal-pension.html",      icon: "🏆", cat: "Pension" },
    { title: "PM Jan Dhan Yojana",                   url: "schemes/jan-dhan.html",          icon: "🏧", cat: "Banking" },
    { title: "PM Kaushal Vikas Yojana",              url: "schemes/pmkvy.html",             icon: "🔧", cat: "Employment" },
    { title: "MGNREGA Employment Scheme",            url: "schemes/mgnrega.html",           icon: "🪚", cat: "Employment" },
  ];

  function getRelPrefix() {
    // If on a schemes/ page, links need ../prefix
    return location.pathname.includes("/schemes/") ? "../" : "";
  }

  function buildSearchIndex(arr) {
    const prefix = getRelPrefix();
    return arr.map(function (s) {
      return { ...s, url: prefix + s.url };
    });
  }

  function renderSearchResults(query, containerEl) {
    if (!containerEl) return;
    const q = query.trim().toLowerCase();
    if (!q) { containerEl.classList.remove("open"); return; }
    const idx = buildSearchIndex(SCHEMES);
    const results = idx.filter(function (s) {
      return s.title.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q);
    });
    if (!results.length) {
      containerEl.innerHTML = '<div class="search-no-results">No schemes found for "' + query + '"</div>';
    } else {
      containerEl.innerHTML = results.map(function (s) {
        return '<a class="search-result-item" href="' + s.url + '">' +
          '<span class="result-icon">' + s.icon + '</span>' +
          '<span class="result-text"><strong>' + s.title + '</strong><span>' + s.cat + '</span></span>' +
          '</a>';
      }).join('');
    }
    containerEl.classList.add("open");
  }

  // Navbar search
  const navInput = document.getElementById("navSearch");
  const navResults = document.getElementById("navResults");
  if (navInput && navResults) {
    navInput.addEventListener("input", function () {
      renderSearchResults(navInput.value, navResults);
    });
    document.addEventListener("click", function (e) {
      if (!navInput.contains(e.target) && !navResults.contains(e.target)) {
        navResults.classList.remove("open");
      }
    });
  }

  // Full-page search bar
  const pageSearch = document.getElementById("pageSearch");
  const pageResults = document.getElementById("pageResults");
  if (pageSearch && pageResults) {
    pageSearch.addEventListener("input", function () {
      renderSearchResults(pageSearch.value, pageResults);
    });
  }

  /* ── Scheme Category Filters (Homepage) ── */
  const filterTabs = document.querySelectorAll(".filter-tab");
  const schemeCards = document.querySelectorAll(".scheme-card[data-cat]");
  filterTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      filterTabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      const cat = tab.dataset.cat;
      schemeCards.forEach(function (card) {
        if (cat === "all" || card.dataset.cat === cat) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ── Eligibility Checker ── */
  const eligForm = document.getElementById("eligForm");
  const eligResult = document.getElementById("eligResult");
  if (eligForm) {
    eligForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const occ = document.getElementById("eligOcc").value;
      const inc = parseInt(document.getElementById("eligInc").value || "0", 10);
      const area = document.getElementById("eligArea").value;
      const prefix = getRelPrefix();
      const matches = [];

      if (occ === "farmer" || occ === "any") {
        matches.push({ t: "PM Kisan Samman Nidhi", u: prefix + "schemes/pm-kisan.html" });
        matches.push({ t: "PM Fasal Bima Yojana", u: prefix + "schemes/pmfby.html" });
        matches.push({ t: "Soil Health Card", u: prefix + "schemes/soil-health-card.html" });
      }
      if (inc <= 500000) {
        matches.push({ t: "Ayushman Bharat", u: prefix + "schemes/ayushman-bharat.html" });
      }
      if (inc <= 300000 && area === "rural") {
        matches.push({ t: "PM Awas Yojana (Gramin)", u: prefix + "schemes/pm-awas.html" });
        matches.push({ t: "MGNREGA", u: prefix + "schemes/mgnrega.html" });
      }
      if (inc <= 600000) {
        matches.push({ t: "CLSS (EWS/LIG)", u: prefix + "schemes/clss.html" });
      }
      matches.push({ t: "PM Jan Dhan Yojana", u: prefix + "schemes/jan-dhan.html" });
      matches.push({ t: "PM Suraksha Bima (₹20/yr)", u: prefix + "schemes/pmsby.html" });
      matches.push({ t: "PM Jeevan Jyoti Bima", u: prefix + "schemes/pmjjby.html" });
      matches.push({ t: "PM Kaushal Vikas Yojana", u: prefix + "schemes/pmkvy.html" });
      matches.push({ t: "Atal Pension Yojana", u: prefix + "schemes/atal-pension.html" });

      if (!eligResult) return;
      eligResult.innerHTML = "<h4>✅ Schemes You May Be Eligible For</h4>" +
        "<p style='font-size:.88rem;margin-bottom:10px;'>Based on your answers. Always verify on the official government website.</p>" +
        [...new Map(matches.map(function(m){ return [m.t, m]; })).values()]
          .map(function (m) {
            return '<a class="elig-scheme-chip" href="' + m.u + '">' + m.t + '</a>';
          }).join('');
      eligResult.classList.add("show");
    });
  }

  /* ── Active nav link highlight ── */
  var currentPath = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href").split("/").pop();
    if (href && href === currentPath) a.classList.add("active");
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

})();
