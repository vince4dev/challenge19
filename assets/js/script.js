/* ==================================================================
  DOM
================================================================== */
const galleryImg = document.getElementById("gallery-img");
const galleryThumbnail = document.getElementById("gallery-thumbnail");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const body = document.body;
const btnMinus = document.getElementById("btn-minus");
const btnPlus = document.getElementById("btn-plus");
const qtyEl = document.querySelector(".product__quantity");

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
  galleryImg.innerHTML = `<img class="product__img" src="${images[index]}" alt="Product image ${index + 1}"/>`;
}

function updateSelectedThumbnail(index) {
  // remove the class from all thumbnails
  galleryThumbnail
    .querySelectorAll("img")
    .forEach((img) => img.classList.remove("selected"));

  // Add the class to the corresponding thumbnail.
  const selectedImg = galleryThumbnail.querySelector(
    `img[data-index="${index}"]`,
  );
  if (selectedImg) selectedImg.classList.add("selected");
}

function showThumbnail() {
  galleryThumbnail.innerHTML = thumbnails
    .map(
      (img, i) =>
        `<div class="thumb"><img src="${img}" alt="Product thumbnail ${i + 1}" data-index="${i}"></div>`,
    )
    .join("");

  galleryThumbnail.querySelectorAll("img").forEach((img) => {
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
  // body.classList.add("menu__open");
  navToggle.setAttribute("aria-expanded", "true");
}

/* Close Menu */
function closeMenu() {
  navMenu.classList.remove("show__menu");
  // body.classList.remove("menu__open");
  navToggle.setAttribute("aria-expanded", "false");
}

/* ==================================================================
  Close Overlay
================================================================== */
overlay.addEventListener("click", closeMenu);
