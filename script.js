document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     COPYRIGHT YEAR
  ========================================= */

  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  /* =========================================
     GALLERY
  ========================================= */

  const galleryImages = Array.from(
    document.querySelectorAll(".gallery img")
  );

  if (!galleryImages.length) return;


  /* =========================================
     LIGHTBOX STATE
  ========================================= */

  let currentIndex = 0;
  let overlay = null;
  let previousActiveElement = null;


  /* =========================================
     CREATE LIGHTBOX
  ========================================= */

  function createLightbox() {

    if (overlay) return;

    previousActiveElement = document.activeElement;

    overlay = document.createElement("div");

    overlay.className = "image-overlay";

    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Gallery image preview");

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

    /* Close */

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

    /* Background click */

    overlay.addEventListener("click", (event) => {

      if (event.target === overlay) {
        closeLightbox();
      }

    });

    /* Keyboard */

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    /* Focus close button */

    overlay
      .querySelector(".lightbox-close")
      .focus();
  }


  /* =========================================
     SHOW IMAGE
  ========================================= */

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

    const previousButton =
      overlay.querySelector(".lightbox-prev");

    const nextButton =
      overlay.querySelector(".lightbox-next");


    /* Image */

    lightboxImage.src =
      selectedImage.currentSrc ||
      selectedImage.src;

    lightboxImage.alt =
      selectedImage.alt ||
      "Gallery image";


    /* Counter */

    counter.textContent =
      `${currentIndex + 1} / ${galleryImages.length}`;


    /* Animation */

    lightboxImage.classList.remove(
      "lightbox-show"
    );

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        lightboxImage.classList.add(
          "lightbox-show"
        );

      });

    });


    /* Navigation */

    if (galleryImages.length <= 1) {

      previousButton.style.display = "none";
      nextButton.style.display = "none";

    } else {

      previousButton.style.display = "flex";
      nextButton.style.display = "flex";

    }

  }


  /* =========================================
     OPEN LIGHTBOX
  ========================================= */

  function openLightbox(index) {

    if (overlay) return;

    currentIndex = index;

    createLightbox();

    showImage(currentIndex);

  }


  /* =========================================
     CLOSE LIGHTBOX
  ========================================= */

  function closeLightbox() {

    if (!overlay) return;

    const currentOverlay = overlay;

    currentOverlay.classList.add("closing");

    document.removeEventListener(
      "keydown",
      handleKeyboard
    );

    setTimeout(() => {

      currentOverlay.remove();

      if (overlay === currentOverlay) {
        overlay = null;
      }

      document.body.style.overflow = "";

      /* Restore focus */

      if (
        previousActiveElement &&
        typeof previousActiveElement.focus === "function"
      ) {
        previousActiveElement.focus();
      }

    }, 220);

  }


  /* =========================================
     NEXT IMAGE
  ========================================= */

  function showNext(event) {

    if (event) {
      event.stopPropagation();
    }

    showImage(currentIndex + 1);

  }


  /* =========================================
     PREVIOUS IMAGE
  ========================================= */

  function showPrevious(event) {

    if (event) {
      event.stopPropagation();
    }

    showImage(currentIndex - 1);

  }


  /* =========================================
     KEYBOARD CONTROLS
  ========================================= */

  function handleKeyboard(event) {

    if (!overlay) return;

    switch (event.key) {

      case "Escape":
        event.preventDefault();
        closeLightbox();
        break;

      case "ArrowRight":
        event.preventDefault();
        showNext();
        break;

      case "ArrowLeft":
        event.preventDefault();
        showPrevious();
        break;

    }

  }


  /* =========================================
     PRELOAD GALLERY IMAGES
  ========================================= */

  galleryImages.forEach((img) => {

    img.style.cursor = "zoom-in";

    img.setAttribute("tabindex", "0");

    img.setAttribute("role", "button");

    img.setAttribute(
      "aria-label",
      "Open gallery image"
    );


    /* Click */

    img.addEventListener("click", () => {

      const index =
        galleryImages.indexOf(img);

      openLightbox(index);

    });


    /* Keyboard */

    img.addEventListener("keydown", (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        const index =
          galleryImages.indexOf(img);

        openLightbox(index);

      }

    });

  });


  /* =========================================
     SWIPE SUPPORT FOR MOBILE
  ========================================= */

  let touchStartX = 0;
  let touchEndX = 0;


  document.addEventListener(
    "touchstart",
    (event) => {

      if (!overlay) return;

      touchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  document.addEventListener(
    "touchend",
    (event) => {

      if (!overlay) return;

      touchEndX =
        event.changedTouches[0].screenX;

      const difference =
        touchStartX - touchEndX;


      /* Swipe left */

      if (difference > 60) {
        showNext();
      }


      /* Swipe right */

      if (difference < -60) {
        showPrevious();
      }

    },
    { passive: true }
  );

});
