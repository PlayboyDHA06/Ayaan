document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
     AUTO UPDATE COPYRIGHT YEAR
  ============================== */

  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  /* ==============================
     PREMIUM IMAGE LIGHTBOX
  ============================== */

  const galleryImages = [
    ...document.querySelectorAll(".gallery img")
  ];

  if (!galleryImages.length) return;

  let currentIndex = 0;
  let overlay = null;


  /* ==============================
     CREATE LIGHTBOX
  ============================== */

  function createLightbox() {

    if (overlay) return;

    overlay = document.createElement("div");

    overlay.className = "image-overlay";

    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Image preview");

    overlay.innerHTML = `
      <button
        class="lightbox-close"
        type="button"
        aria-label="Close image"
      >
        &times;
      </button>

      <button
        class="lightbox-prev"
        type="button"
        aria-label="Previous image"
      >
        &#10094;
      </button>

      <div class="lightbox-content">

        <img
          class="lightbox-image"
          src=""
          alt=""
        />

        <div class="lightbox-counter"></div>

      </div>

      <button
        class="lightbox-next"
        type="button"
        aria-label="Next image"
      >
        &#10095;
      </button>
    `;

    document.body.appendChild(overlay);

    document.body.style.overflow = "hidden";


    /* Close button */

    overlay
      .querySelector(".lightbox-close")
      .addEventListener("click", closeLightbox);


    /* Previous */

    overlay
      .querySelector(".lightbox-prev")
      .addEventListener("click", showPrevious);


    /* Next */

    overlay
      .querySelector(".lightbox-next")
      .addEventListener("click", showNext);


    /* Click outside image */

    overlay.addEventListener("click", (event) => {

      if (
        event.target === overlay ||
        event.target.classList.contains("lightbox-content")
      ) {
        closeLightbox();
      }

    });


    /* Keyboard navigation */

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

  }


  /* ==============================
     SHOW IMAGE
  ============================== */

  function showImage(index) {

    if (!overlay) return;

    currentIndex =
      (index + galleryImages.length) %
      galleryImages.length;

    const selectedImage =
      galleryImages[currentIndex];

    const lightboxImage =
      overlay.querySelector(".lightbox-image");

    const counter =
      overlay.querySelector(".lightbox-counter");


    lightboxImage.src =
      selectedImage.src;

    lightboxImage.alt =
      selectedImage.alt || "Gallery image";


    counter.textContent =
      `${currentIndex + 1} / ${galleryImages.length}`;


    /* Small animation */

    lightboxImage.classList.remove("lightbox-show");

    requestAnimationFrame(() => {
      lightboxImage.classList.add("lightbox-show");
    });


    /* Hide navigation if only one image */

    const prev =
      overlay.querySelector(".lightbox-prev");

    const next =
      overlay.querySelector(".lightbox-next");

    if (galleryImages.length <= 1) {

      prev.style.display = "none";
      next.style.display = "none";

    } else {

      prev.style.display = "flex";
      next.style.display = "flex";

    }

  }


  /* ==============================
     OPEN LIGHTBOX
  ============================== */

  function openLightbox(index) {

    currentIndex = index;

    createLightbox();

    showImage(currentIndex);

  }


  /* ==============================
     CLOSE LIGHTBOX
  ============================== */

  function closeLightbox() {

    if (!overlay) return;

    overlay.classList.add("closing");

    setTimeout(() => {

      if (overlay) {
        overlay.remove();
        overlay = null;
      }

      document.body.style.overflow = "";

    }, 200);

    document.removeEventListener(
      "keydown",
      handleKeyboard
    );

  }


  /* ==============================
     NEXT IMAGE
  ============================== */

  function showNext(event) {

    if (event) {
      event.stopPropagation();
    }

    showImage(currentIndex + 1);

  }


  /* ==============================
     PREVIOUS IMAGE
  ============================== */

  function showPrevious(event) {

    if (event) {
      event.stopPropagation();
    }

    showImage(currentIndex - 1);

  }


  /* ==============================
     KEYBOARD CONTROLS
  ============================== */

  function handleKeyboard(event) {

    if (!overlay) return;

    switch (event.key) {

      case "Escape":
        closeLightbox();
        break;

      case "ArrowRight":
        showNext();
        break;

      case "ArrowLeft":
        showPrevious();
        break;

    }

  }


  /* ==============================
     ATTACH GALLERY EVENTS
  ============================== */

  galleryImages.forEach((img, index) => {

    img.style.cursor = "zoom-in";

    img.setAttribute(
      "tabindex",
      "0"
    );

    img.setAttribute(
      "role",
      "button"
    );

    img.setAttribute(
      "aria-label",
      "Open gallery image"
    );


    /* Mouse */

    img.addEventListener(
      "click",
      () => openLightbox(index)
    );


    /* Keyboard */

    img.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openLightbox(index);

        }

      }
    );

  });

});
