/* ==================================================================
    CONFIG & STATE
    ================================================================== */
const CONFIG = {
  images: [
    "./assets/images/image-product-1.jpg",
    "./assets/images/image-product-2.jpg",
    "./assets/images/image-product-3.jpg",
    "./assets/images/image-product-4.jpg",
  ],
  thumbnails: [
    "./assets/images/image-product-1-thumbnail.jpg",
    "./assets/images/image-product-2-thumbnail.jpg",
    "./assets/images/image-product-3-thumbnail.jpg",
    "./assets/images/image-product-4-thumbnail.jpg",
  ],
};

const state = {
  quantity: 0,
  currentIndex: 0,
  totalItemsInCart: 0,
};

/* ==================================================================
    DOM ELEMENTS
    ================================================================== */
const DOM = {
  // Gallery
  galleryImg: document.getElementById("product-img"),
  galleryThumbs: document.getElementById("gallery-thumbnail"),
  productImgBtn: document.getElementById("product-img-btn"),
  btnPrev: document.getElementById("btn-prev"),
  btnNext: document.getElementById("btn-next"),

  // Modal
  previewOverlay: document.getElementById("preview-overlay"),
  previewImg: document.getElementById("preview-image"),
  previewThumbs: document.getElementById("preview-thumbnails"),
  previewClose: document.getElementById("preview-close"),
  previewPrev: document.getElementById("preview-prev"),
  previewNext: document.getElementById("preview-next"),

  // Menu
  navMenu: document.getElementById("nav-menu"),
  navToggle: document.getElementById("nav-toggle"),
  navClose: document.getElementById("nav-close"),

  // Cart
  cartTrigger: document.getElementById("cart-trigger"),
  cartPopover: document.getElementById("cart-popover"),
  cartBody: document.getElementById("cart-popover-body"),
  cartFooter: document.getElementById("cart-popover-footer"),
  cartEmptyMsg: document.getElementById("cart-empty-msg"),
  cartBadge: document.querySelector(".cart__badge"),
  cartRemoveBtn: document.getElementById("cart-item-remove"),

  // Product
  qtyEl: document.querySelector(".product__quantity"),
  btnMinus: document.getElementById("btn-minus"),
  btnPlus: document.getElementById("btn-plus"),
  addBtn: document.querySelector(".product__btn-add"),
  body: document.body,
};

/* ==================================================================
    QUANTITY LOGIC
    ================================================================== */
function updateQuantityUI() {
  DOM.qtyEl.textContent = state.quantity;
}

DOM.btnMinus.addEventListener("click", () => {
  if (state.quantity > 0) {
    state.quantity--;
    updateQuantityUI();
  }
});

DOM.btnPlus.addEventListener("click", () => {
  state.quantity++;
  updateQuantityUI();
});

/* ==================================================================
    GALLERY & MODAL LOGIC
    ================================================================== */
function updateMainImage() {
  DOM.galleryImg.src = CONFIG.images[state.currentIndex];
  DOM.galleryImg.alt = `Product image ${state.currentIndex + 1}`;

  // Update active thumbnail class
  DOM.galleryThumbs.querySelectorAll("img").forEach((img, i) => {
    img.classList.toggle("selected", i === state.currentIndex);
  });
}

function renderGallery() {
  DOM.galleryThumbs.innerHTML = CONFIG.thumbnails
    .map(
      (img, i) =>
        `<div class="thumb"><img src="${img}" alt="Thumb ${i + 1}" data-index="${i}"></div>`,
    )
    .join("");

  DOM.galleryThumbs.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      state.currentIndex = parseInt(img.dataset.index);
      updateMainImage();
    });
  });
}

// Modal Logic
function openModal() {
  DOM.previewOverlay.classList.add("active");
  DOM.body.style.overflow = "hidden";
  updatePreviewUI();
}

function closeModal() {
  DOM.previewOverlay.classList.remove("active");
  DOM.body.style.overflow = "";
}

function updatePreviewUI() {
  DOM.previewImg.src = CONFIG.images[state.currentIndex];

  // Update modal thumbnails
  const thumbs = DOM.previewThumbs.querySelectorAll(".preview-thumb");
  thumbs.forEach((thumb, i) => {
    thumb.classList.toggle("active", i === state.currentIndex);
  });

  const activeThumb = DOM.previewThumbs.querySelector(".active");
  if (activeThumb)
    activeThumb.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
}

function initModalThumbs() {
  DOM.previewThumbs.innerHTML = CONFIG.images
    .map((src, i) => {
      return `<img src="${src}" class="preview-thumb ${i === 0 ? "active" : ""}" data-index="${i}">`;
    })
    .join("");

  DOM.previewThumbs.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      state.currentIndex = parseInt(img.dataset.index);
      updatePreviewUI();
      updateMainImage(); // Sync with main gallery
    });
  });
}

// Image Activation (Click & Keyboard)
function handleImageActivation(e) {
  console.log(e.target);
  if (e.target.matches("#product-img-btn")) {
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    if (e.type === "keydown") e.preventDefault();
  }
  openModal();
}

/* ==================================================================
    CART LOGIC
    ================================================================== */
function updateCartUI() {
  const isEmpty = state.totalItemsInCart === 0;
  DOM.cartBody.style.display = isEmpty ? "none" : "block";
  DOM.cartFooter.style.display = isEmpty ? "none" : "block";
  DOM.cartEmptyMsg.style.display = isEmpty ? "block" : "none";

  if (DOM.cartBadge) {
    DOM.cartBadge.textContent = state.totalItemsInCart;
    DOM.cartBadge.style.opacity = isEmpty ? "0" : "1";
  }
}

DOM.addBtn.addEventListener("click", () => {
  if (state.quantity > 0) {
    state.totalItemsInCart += state.quantity;
    state.quantity = 0;
    updateQuantityUI();
    updateCartUI();
  } else {
    alert("Veuillez choisir au moins un article.");
  }
});

DOM.cartTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  DOM.cartPopover.classList.toggle("active");
  updateCartUI();
});

document.addEventListener("click", (e) => {
  if (
    !DOM.cartTrigger.contains(e.target) &&
    !DOM.cartPopover.contains(e.target)
  ) {
    DOM.cartPopover.classList.remove("active");
  }
});

DOM.cartRemoveBtn.addEventListener("click", () => {
  state.totalItemsInCart = 0;
  updateCartUI();
});

/* ==================================================================
    MENU & GLOBAL EVENTS
    ================================================================== */
const toggleMenu = (isOpen) => {
  DOM.navMenu.classList.toggle("show__menu", isOpen);
  DOM.body.classList.toggle("menu__open", isOpen);
  DOM.navToggle.setAttribute("aria-expanded", isOpen);
};

DOM.navToggle.addEventListener("click", () => toggleMenu(true));
DOM.navClose.addEventListener("click", () => toggleMenu(false));

// Gallery Navigation
DOM.btnPrev.addEventListener("click", () => {
  state.currentIndex = (state.currentIndex + 1) % CONFIG.images.length;
  updateMainImage();
});

DOM.btnNext.addEventListener("click", () => {
  state.currentIndex =
    (state.currentIndex - 1 + CONFIG.images.length) % CONFIG.images.length;
  updateMainImage();
});

DOM.previewPrev.addEventListener("click", () => {
  state.currentIndex =
    (state.currentIndex - 1 + CONFIG.images.length) % CONFIG.images.length;
  updatePreviewUI();
});

DOM.previewNext.addEventListener("click", () => {
  state.currentIndex = (state.currentIndex + 1) % CONFIG.images.length;
  updatePreviewUI();
});

// General Listeners
DOM.productImgBtn.addEventListener("click", handleImageActivation);
DOM.productImgBtn.addEventListener("keydown", handleImageActivation);
DOM.previewClose.addEventListener("click", closeModal);

DOM.previewOverlay.addEventListener("click", (e) => {
  if (e.target === DOM.previewOverlay) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (!DOM.previewOverlay.classList.contains("active")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") {
    state.currentIndex =
      (state.currentIndex - 1 + CONFIG.images.length) % CONFIG.images.length;
    updatePreviewUI();
  }
  if (e.key === "ArrowRight") {
    state.currentIndex = (state.currentIndex + 1) % CONFIG.images.length;
    updatePreviewUI();
  }
});

/* ==================================================================
    INIT
    ================================================================== */
function init() {
  state.quantity = parseInt(DOM.qtyEl.textContent, 10) || 0;
  updateQuantityUI();
  renderGallery();
  initModalThumbs();
  updateMainImage();
}

init();
