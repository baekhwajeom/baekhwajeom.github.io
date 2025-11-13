'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}


// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    const item = filterItems[i];
    const category = (item.dataset.category || '').toLowerCase();

    if (selectedValue === "all") {
      // Show everything EXCEPT items marked with .exclude-all
      if (!item.classList.contains("exclude-all")) {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
          void item.offsetWidth; // force reflow so animation restarts
        }
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    } else if (selectedValue === category) {
      if (item.classList.contains("active")) {
        item.classList.remove("active");
        void item.offsetWidth; // force reflow
      }
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  }
};




// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });







  







}









/* ===== PDF modal add-on (safe/auto-creating) ===== */
(function () {
  // 1) Create the modal markup if it doesn't exist
  function ensurePdfModal() {
    let modal = document.getElementById('pdf-modal');
    if (!modal) {
      const tpl = document.createElement('template');
      tpl.innerHTML = `
<div id="pdf-modal" class="pdf-modal" hidden>
  <div class="pdf-backdrop" data-pdf-close></div>
  <div class="pdf-dialog">
    <button class="pdf-close" aria-label="Close" data-pdf-close>&times;</button>
    <iframe id="pdf-frame" title="PDF preview" loading="lazy"></iframe>
    <div class="pdf-actions">
      <a id="pdf-open-new" target="_blank" rel="noopener">Open in new tab</a>
      <a id="pdf-download" download>Download</a>
    </div>
  </div>
</div>`;
      document.body.appendChild(tpl.content.firstElementChild);
      modal = document.getElementById('pdf-modal');
    }
    return modal;
  }

  const modal   = ensurePdfModal();
  const frame   = document.getElementById('pdf-frame');
  const openNew = document.getElementById('pdf-open-new');
  const dl      = document.getElementById('pdf-download');

  // 2) Open on click of any .pdf-open element
  document.addEventListener('click', function (e) {
    const opener = e.target.closest('.pdf-open');
    if (opener) {
      const url = opener.getAttribute('data-pdf');
      if (!url) return;

      if (frame) frame.src = url + '#toolbar=1&navpanes=0&scrollbar=1';
      if (openNew) openNew.href = url;
      if (dl) dl.href = url;

      modal.hidden = false;
      document.body.style.overflow = 'hidden'; // lock scroll
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // 3) Close when clicking X or backdrop
    const closer = e.target.closest('[data-pdf-close]');
    if (closer && !modal.hidden) {
      if (frame) frame.src = '';
      modal.hidden = true;
      document.body.style.overflow = '';
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // 4) Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) {
      if (frame) frame.src = '';
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  });

  // 5) Lightweight styles (inject once so you don't have to touch CSS)
  if (!document.getElementById('pdf-modal-style')) {
    const style = document.createElement('style');
    style.id = 'pdf-modal-style';
    style.textContent = `
      .pdf-modal[hidden]{display:none;}
      .pdf-modal{position:fixed;inset:0;z-index:9999;}
      .pdf-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);}
      .pdf-dialog{
        position:relative;margin:4vh auto;width:min(1000px,92vw);height:88vh;
        background:#111;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;
      }
      .pdf-close{
        position:absolute;top:10px;right:14px;font-size:28px;background:transparent;color:#fff;border:0;cursor:pointer;
      }
      #pdf-frame{border:0;width:100%;height:100%;}
      .pdf-actions{position:absolute;bottom:8px;right:12px;display:flex;gap:14px;}
      .pdf-actions a{color:#fff;text-decoration:underline;}
    `;
    document.head.appendChild(style);
  }
})();





// --- Video modal (safe version) ---
(function () {
  const videoModal = document.getElementById('video-modal');
  const player = document.getElementById('video-player');

  function openVideo(src, poster) {
    if (!videoModal || !player) return;

    // set source & optional poster
    player.src = src || '';
    if (poster) player.setAttribute('poster', poster);

    // open modal
    videoModal.hidden = false;

    // attempt to play (OK if autoplay is blocked)
    player.play().catch(() => {});
  }

  function closeVideo() {
    if (!videoModal || !player) return;
    player.pause();
    player.removeAttribute('src'); // release on iOS
    player.load();
    videoModal.hidden = true;
  }

  // open from any .video-open button
  document.querySelectorAll('.video-open[data-video]').forEach(btn => {
    btn.addEventListener('click', () => openVideo(btn.dataset.video, btn.dataset.poster));
  });

  // close on overlay or X button
  videoModal?.addEventListener('click', (e) => {
    if (e.target.matches('[data-close], .pdf-overlay')) closeVideo();
  });

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (!videoModal?.hidden && e.key === 'Escape') closeVideo();
  });
})();






/* --- Switch to "Knee Exo" and scroll to the card (no auto-open) --- */
(function () {
  const selectValueEl = document.querySelector("[data-selecct-value]");
  const filterButtons = document.querySelectorAll("[data-filter-btn]");

  function switchTo(label) {
    const value = (label || "").toLowerCase();

    // Update dropdown label (if visible)
    if (selectValueEl) selectValueEl.textContent = label;

    // Use your existing filter function
    if (typeof filterFunc === "function") filterFunc(value);

    // Reflect active state on the top filter buttons
    let targetBtn = null;
    filterButtons.forEach((btn) => {
      const isTarget = btn.textContent.trim().toLowerCase() === value;
      btn.classList.toggle("active", isTarget);
      if (isTarget) targetBtn = btn;
    });

    // Keep lastClickedBtn in sync if defined
    if (typeof lastClickedBtn !== "undefined" && targetBtn) {
      if (lastClickedBtn && lastClickedBtn !== targetBtn) lastClickedBtn.classList.remove("active");
      lastClickedBtn = targetBtn;
    }
  }

 // Unified launcher for tab jump cards
document.addEventListener("click", (e) => {
  const go = e.target.closest(".go-tab, .go-webdesign");
  if (!go) return;

  e.preventDefault();

  // Determine which tab to open
  const tabName =
    go.dataset.go ||                       // e.g. data-go="ADA" on your Automatic Door Opener card
    (go.classList.contains("go-webdesign") ? "Knee Exo" : "all");

  switchTo(tabName);

  // Optional scroll target
  const targetSel =
    go.dataset.target ||                   // e.g. data-target="#ada-anchor"
    (go.classList.contains("go-webdesign") ? "#knee-pdf-card" : null);

  if (targetSel) {
    const card = document.querySelector(targetSel);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("glow");
      setTimeout(() => card.classList.remove("glow"), 1200);
    }
  }
});

})();




// Hide "exclude-all" items when the All tab is selected
(function () {
  // try to find the All filter button in a few common ways
  const allBtn =
    document.querySelector('[data-filter-btn="all"]') ||
    document.querySelector('[data-filter="all"]') ||
    Array.from(document.querySelectorAll('[data-filter-btn],[data-filter]'))
      .find(b => (b.dataset.filterBtn || b.dataset.filter || b.textContent || '')
        .trim().toLowerCase() === 'all');

  if (!allBtn) return;

  allBtn.addEventListener('click', () => {
    // your template shows everything on All; remove 'active' from the ones we want to hide
    document.querySelectorAll('.project-item.exclude-all').forEach(el => {
      el.classList.remove('active');
    });
  });
})();


