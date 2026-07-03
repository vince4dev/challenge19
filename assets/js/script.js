/* ==================================================================
  DOM
================================================================== */
const overlay = document.getElementById("overlay");
const galleryImg = document.getElementById("gallery-img");
const galleryThumbs = document.getElementById("gallery-thumbnail");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const body = document.body;
const btnMinus = document.getElementById("btn-minus");
const btnPlus = document.getElementById("btn-plus");
const qtyEl = document.querySelector(".product__quantity");
// const productImg = document.querySelectorAll("gallery__img img");

/* ==================================================================
  Compteur
================================================================== */
let quantity = parseInt(qtyEl.textContent, 10);

function updateQuantity() {
  qtyEl.textContent = quantity;
}

btnMinus.addEventListener("click", () => {
  if (quantity > 0) {
    quantity -= 1;
    updateQuantity();
  }
});

btnPlus.addEventListener("click", () => {
  quantity += 1;
  updateQuantity();
});

updateQuantity();

/* ==================================================================
  Images Gallery
================================================================== */
const images = [
  "./assets/images/image-product-1.jpg",
  "./assets/images/image-product-2.jpg",
  "./assets/images/image-product-3.jpg",
  "./assets/images/image-product-4.jpg",
];

const thumbnails = [
  "./assets/images/image-product-1-thumbnail.jpg",
  "./assets/images/image-product-2-thumbnail.jpg",
  "./assets/images/image-product-3-thumbnail.jpg",
  "./assets/images/image-product-4-thumbnail.jpg",
];

let currentIndex = 0;

function showImage(index) {
  galleryImg.innerHTML = `<img id="product-img" class="product__img" src="${images[index]}" alt="Product image ${index + 1}"/>`;
}

function updateSelectedThumbnail(index) {
  // remove the class from all thumbnails
  galleryThumbs
    .querySelectorAll("img")
    .forEach((img) => img.classList.remove("selected"));

  // Add the class to the corresponding thumbnail.
  const selectedImg = galleryThumbs.querySelector(`img[data-index="${index}"]`);
  if (selectedImg) selectedImg.classList.add("selected");
}

function showThumbnail() {
  galleryThumbs.innerHTML = thumbnails
    .map(
      (img, i) =>
        `<div class="thumb"><img src="${img}" alt="Product thumbnail ${i + 1}" data-index="${i}"></div>`,
    )
    .join("");

  galleryThumbs.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      const idx = parseInt(img.dataset.index, 10);
      currentIndex = idx;
      showImage(currentIndex);

      updateSelectedThumbnail(idx);
    });
  });
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
});

showImage(currentIndex);
showThumbnail();
updateSelectedThumbnail(currentIndex);

/* ==================================================================
  Open/Close Menu
================================================================== */
navToggle.addEventListener("click", openMenu);
navClose.addEventListener("click", closeMenu);

/* Open Menu */
function openMenu() {
  navMenu.classList.add("show__menu");
  body.classList.add("menu__open");
  navToggle.setAttribute("aria-expanded", "true");
}

/* Close Menu */
function closeMenu() {
  navMenu.classList.remove("show__menu");
  body.classList.remove("menu__open");
  navToggle.setAttribute("aria-expanded", "false");
}

/* ==================================================================
  Close Overlay
================================================================== */
overlay.addEventListener("click", closeMenu);

/* ==================================================================
  Preview Modal
================================================================== */
const prevOverlay = document.getElementById("preview-overlay");
const previewImg = document.getElementById("preview-image");
const thumbContainer = document.getElementById("preview-thumbnails");
const closeBtn = document.getElementById("preview-close");
const prevModalBtn = document.getElementById("preview-prev");
const nextModalBtn = document.getElementById("preview-next");

const galleryImgContainer = document.getElementById("gallery-img");

let thumgImages = [];

galleryImgContainer.addEventListener("click", (e) => {
  if (e.target.matches("#product-img")) {
    openModal();
  }
});

function initGallery() {
  // Retrieval of all images from the existing gallery
  const galleryThumbImgs = document.querySelectorAll(".gallery__thumbnail img");

  if (galleryThumbImgs.length === 0) {
    console.error(
      "Aucune image trouvée dans la galerie. Vérifiez la classe CSS.",
    );
    return;
  }
  // We store the image links in an array.
  thumgImages = Array.from(galleryThumbImgs).map((img) => img.src);

  thumbContainer.innerHTML = "";
  thumgImages.forEach((src, index) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.classList.add("preview-thumb");
    if (index === 0) thumb.classList.add("active");

    thumb.addEventListener("click", () => {
      currentIndex = index;
      updatePreview();
    });
    thumbContainer.appendChild(thumb);
  });
}

function updatePreview() {
  previewImg.src = images[currentIndex];

  // Update to the orange border on the active thumbnail
  document.querySelectorAll(".preview-thumb").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === currentIndex);
  });

  // Automatic scrolling of the active thumbnail to make it visible
  const activeThumb = thumbContainer.querySelector(".active");
  if (activeThumb) {
    activeThumb.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}

// Opening and closing
function openModal() {
  prevOverlay.classList.add("active");
  // Prevents background page scrolling.
  document.body.style.overflow = "hidden";
  initGallery();
  updatePreview();
}
function closeModal() {
  prevOverlay.classList.remove("active");
  // Re-enables page scrolling.
  document.body.style.overflow = "";
}

// Navigation Previous / Next
function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updatePreview();
}
function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updatePreview();
}

// --- EVENT LISTENERS ---
closeBtn.addEventListener("click", closeModal);

// Close when clicking the dark background
prevOverlay.addEventListener("click", (e) => {
  if (e.target === prevOverlay) closeModal();
});

prevModalBtn.addEventListener("click", prevImage);
nextModalBtn.addEventListener("click", nextImage);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!prevOverlay.classList.contains("active")) return;

  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});

// initGallery();
