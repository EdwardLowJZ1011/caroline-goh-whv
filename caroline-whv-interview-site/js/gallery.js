// Gallery Lightbox
function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = document.getElementById("closeLightbox");
  const lightboxCounter = document.getElementById("lightboxCounter");

  if (!lightbox || !lightboxImage || !closeLightbox) return;

  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      lightboxImage.src = item.dataset.full;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      
      // Update counter in lightbox
      if (lightboxCounter) {
        lightboxCounter.textContent = `${index + 1} / ${galleryItems.length}`;
      }
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  function hideLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  closeLightbox.addEventListener("click", hideLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) hideLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideLightbox();
  });
}

// Mobile gallery indicators - tracks scroll position
function initGalleryIndicators() {
  const galleryGrid = document.querySelector('.gallery-grid');
  const indicators = document.querySelectorAll('.indicator-dot');
  const progressBar = document.querySelector('.gallery-indicators');

  if (!galleryGrid || indicators.length === 0) return;

  function updateIndicators() {
    const items = document.querySelectorAll('.gallery-item');
    let activeIndex = 0;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Item is "active" if its center is near viewport center
      if (rect.top <= viewportHeight * 0.3 && rect.bottom >= viewportHeight * 0.3) {
        activeIndex = index;
      }
    });

    indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
      dot.setAttribute('aria-pressed', index === activeIndex);
    });

    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', activeIndex + 1);
    }
  }

  // Debounced scroll listener
  let scrollTimeout;
  galleryGrid.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateIndicators, 50);
  });

  // Update on resize
  window.addEventListener('resize', updateIndicators);

  // Initial update
  updateIndicators();
}

// Swipe gesture support for gallery
function initSwipeGestures() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid || window.innerWidth > 640) return; // Desktop doesn't need swipe

  let touchStartY = 0;
  let touchEndY = 0;

  galleryGrid.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, false);

  galleryGrid.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const swipeThreshold = 50; // minimum distance for a swipe
    const diff = touchStartY - touchEndY;

    // Swipe up (next image)
    if (diff > swipeThreshold) {
      galleryGrid.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
    // Swipe down (previous image)
    else if (diff < -swipeThreshold) {
      galleryGrid.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
    }
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  initGallery();
  initGalleryIndicators();
  initSwipeGestures();
});
