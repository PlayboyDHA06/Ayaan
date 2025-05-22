document.addEventListener("DOMContentLoaded", function () {
  // Update year automatically
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Gallery images click to open overlay popup
  const galleryImages = document.querySelectorAll(".gallery img");
  galleryImages.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      // Prevent multiple overlays
      if (document.querySelector(".image-overlay")) return;

      const overlay = document.createElement("div");
      overlay.classList.add("image-overlay");

      const largeImg = document.createElement("img");
      largeImg.src = img.src;
      largeImg.alt = img.alt || "";

      overlay.appendChild(largeImg);
      document.body.appendChild(overlay);

      // Remove overlay on click anywhere
      overlay.addEventListener("click", () => {
        overlay.remove();
      });
    });
  });
});
