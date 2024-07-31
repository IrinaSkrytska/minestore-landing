document.addEventListener("DOMContentLoaded", () => {
  let lastScrollTop = 0; // To track the last scroll position

  const observer = new IntersectionObserver(
    (entries) => {
      const currentScrollTop =
        window.scrollY || document.documentElement.scrollTop;

      entries.forEach((entry) => {
        // Check if scrolling downwards
        if (currentScrollTop > lastScrollTop) {
          if (entry.isIntersecting) {
            if (
              entry.target.classList.contains("categories-thumb") ||
              entry.target.classList.contains("option") ||
              entry.target.classList.contains("categories-text-thumb")
            ) {
              entry.target.classList.add("visible-flex");
            } else {
              entry.target.classList.add("visible");
            }
          } else {
            if (
              entry.target.classList.contains("categories-thumb") ||
              entry.target.classList.contains("option") ||
              entry.target.classList.contains("categories-text-thumb")
            ) {
              entry.target.classList.remove("visible-flex");
            } else {
              entry.target.classList.remove("visible");
            }
          }
        } else {
          // If scrolling up, remove visible class
          entry.target.classList.remove("visible");
          entry.target.classList.remove("visible-flex");
        }
      });

      // Update last scroll position
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -300px 0px",
    }
  );

  const selectors = [
    ".features-title",
    ".features-text",
    ".more-sub-features-thumb",
    ".categories-thumb",
    ".benefits-thumb",
    ".more-title",
    ".more-subtitle",
    ".more-features-thumb",
    ".antifraud-thumb",
    ".more-thumb",
    ".option",
    ".categories-options-list",
    ".reviews-section",
    ".pricing-title",
    ".pricing-sub-text",
    ".pricing-buttons-thumb",
    ".footer-thumb",
  ];

  // Observe all elements matching the selectors
  selectors.forEach((selector) => {
    document
      .querySelectorAll(selector)
      .forEach((element) => observer.observe(element));
  });

  // Apply animation to elements visible on page load
  const initiallyVisibleSelectors = [
    ".hero-title",
    ".hero-description",
    ".hero-btns-thumb",
  ];

  initiallyVisibleSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      // Check if the element is already in the viewport
      const rect = element.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      ) {
        // Element is in the viewport
        element.classList.add("visible");
        if (
          element.classList.contains("categories-thumb") ||
          element.classList.contains("option") ||
          element.classList.contains("categories-text-thumb")
        ) {
          element.classList.add("visible-flex");
        }
      }
    });
  });
  // Slider functionality

  const desktopMinWidth = 1200;
  const scrollOffset = 700; // Offset to scroll a little beyond the current view

  if (window.innerWidth >= desktopMinWidth) {
    const sliderContainer = document.querySelector(".slider-container");
    const titleItems = document.querySelectorAll(".benefit-title-item");
    const descriptionItems = document.querySelectorAll(
      ".benefit-description-item"
    );

    let isPageScrolling = false;

    // Function to handle the scroll effect
    function handleScroll() {
      const maxScrollLeft =
        sliderContainer.scrollWidth - sliderContainer.clientWidth;
      const scrollLeft = sliderContainer.scrollLeft;

      // Determine if we're at the end or start
      if (scrollLeft >= maxScrollLeft - 5) {
        // Threshold for the end
        if (!isPageScrolling) {
          isPageScrolling = true;
          window.scrollBy({
            top: scrollOffset,
            behavior: "smooth",
          });
          setTimeout(() => {
            isPageScrolling = false;
          }, 1000); // Adjust timeout as needed
        }
      } else if (scrollLeft <= 5) {
        // Threshold for the start
        if (!isPageScrolling) {
          isPageScrolling = true;
          window.scrollBy({
            top: -scrollOffset,
            behavior: "smooth",
          });
          setTimeout(() => {
            isPageScrolling = false;
          }, 1000); // Adjust timeout as needed
        }
      }
    }

    // Handle slider container scroll
    sliderContainer.addEventListener("scroll", handleScroll);

    // Handle wheel event for horizontal scrolling
    sliderContainer.addEventListener("wheel", (event) => {
      event.preventDefault();
      sliderContainer.scrollBy({
        left: event.deltaY < 0 ? -220 : 220,
        behavior: "smooth",
      });
    });

    // Activate item and handle page scroll
    function activateItem(index) {
      titleItems.forEach((item) => {
        item.classList.remove("highlighted");
      });

      descriptionItems.forEach((item) => {
        item.classList.remove("active");
      });

      if (descriptionItems[index]) {
        descriptionItems[index].classList.add("active");
      }

      titleItems[index].classList.add("highlighted");
    }

    // Initial activation
    activateItem(0);

    // Add click event listeners to title items
    titleItems.forEach((titleItem, index) => {
      titleItem.addEventListener("click", () => {
        activateItem(index);
      });
    });

    // Optional: Add a resize event listener to recheck the window width if the user resizes the window
    window.addEventListener("resize", () => {
      if (window.innerWidth < desktopMinWidth) {
        location.reload(); // Reload to reapply the scroll functionality on resize
      }
    });
  }

  // Benefits items click action
  const titleItems = document.querySelectorAll(".benefit-title-item");
  const descriptionItems = document.querySelectorAll(
    ".benefit-description-item"
  );

  function activateItem(index) {
    titleItems.forEach((item) => {
      item.classList.remove("highlighted");
    });

    descriptionItems.forEach((item) => {
      item.classList.remove("active");
    });

    if (descriptionItems[index]) {
      descriptionItems[index].classList.add("active");
    }

    titleItems[index].classList.add("highlighted");
  }

  activateItem(0);

  titleItems.forEach((titleItem, index) => {
    titleItem.addEventListener("click", () => {
      activateItem(index);
    });
  });

  //  REVIEWS CAROUSEL//
  const prevBtn = document.querySelector(".review-prev-btn");
  const nextBtn = document.querySelector(".review-next-btn");
  const reviewsList = document.querySelector(".reviews-list");
  const slides = document.querySelectorAll(".review-item");
  const slideCount = slides.length;
  const slideNav = document.querySelector(".slide-nav");
  const slideNavMobile = document.querySelector(".slide-nav-mobile");
  const currentSlideElem = document.querySelector(".current-slide");
  const totalSlidesElem = document.querySelector(".total-slides");
  const scrollContent = document.querySelector("#scroll-content");
  let currentIndex = 0;

  function getSlideWidth() {
    return (
      slides[0].offsetWidth +
      parseInt(window.getComputedStyle(slides[0]).marginRight)
    );
  }

  function updateSlideIndicator(direction) {
    const newSlideNumber = (currentIndex + 1).toString().padStart(2, "0");

    const newSlideElem = document.createElement("p");
    newSlideElem.textContent = newSlideNumber;
    newSlideElem.classList.add(
      direction === "next" ? "scroll-from-bottom" : "scroll-from-top"
    );

    scrollContent.innerHTML = "";
    scrollContent.appendChild(newSlideElem);

    if (
      direction === "next" &&
      currentIndex === 0 &&
      currentSlideElem.textContent === "01"
    ) {
      let currentNumber = slideCount;
      const interval = setInterval(() => {
        currentSlideElem.textContent = currentNumber
          .toString()
          .padStart(2, "0");
        currentNumber--;
        if (currentNumber < 1) {
          clearInterval(interval);
          setTimeout(() => {
            currentSlideElem.textContent = newSlideNumber;
          }, 500);
        }
      }, 100);
    } else {
      currentSlideElem.textContent = newSlideNumber;
    }

    setTimeout(() => {
      newSlideElem.classList.remove(
        direction === "next" ? "scroll-from-bottom" : "scroll-from-top"
      );
    }, 500);
  }

  function showSlide(index, direction) {
    if (index >= slideCount) {
      index = 0;
    } else if (index < 0) {
      index = slideCount - 1;
    }

    const slideWidth = getSlideWidth();
    reviewsList.style.transform = `translateX(-${index * slideWidth}px)`;
    currentIndex = index;
    updateSlideIndicator(direction);
    updateSlideNav();
  }

  function updateSlideNav() {
    const indicators = document.querySelectorAll(
      ".slide-nav span, .slide-nav-mobile span"
    );
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === currentIndex);
    });
  }

  function createSlideNav() {
    const isSlideNavVisible =
      window.getComputedStyle(slideNav).display !== "none";

    slideNav.innerHTML = "";
    slideNavMobile.innerHTML = "";

    // console.log("test", isSlideNavVisible);

    for (let i = 0; i < slideCount; i++) {
      const span = document.createElement("span");

      span.addEventListener("click", () => {
        showSlide(i, i > currentIndex ? "next" : "prev");
      });

      if (isSlideNavVisible) {
        slideNav.appendChild(span);
      } else {
        slideNavMobile.appendChild(span);
      }
    }

    updateSlideNav();
  }

  function initialize() {
    createSlideNav();
    const indicator = slideCount.toString().padStart(2, "0");
    totalSlidesElem.textContent = `/${indicator}`;
    currentSlideElem.textContent = "01";
  }

  prevBtn.addEventListener("click", () => {
    showSlide(currentIndex - 1, "prev");
  });

  nextBtn.addEventListener("click", () => {
    showSlide(currentIndex + 1, "next");
  });

  initialize();

  // PRICING SWITCH//
  const buttons = document.querySelectorAll(".pricing-button");
  const tables = document.querySelectorAll(".pricing-table");

  function handleButtonClick(event) {
    const targetClass = event.target.getAttribute("data-target");

    tables.forEach((table) => {
      table.classList.add("hidden");
      table.classList.remove("visible");
    });

    const targetTable = document.querySelector(`.${targetClass}`);
    if (targetTable) {
      targetTable.classList.add("visible");
      targetTable.classList.remove("hidden");
    }

    buttons.forEach((button) => {
      if (button === event.target) {
        button.classList.add("active-button");
      } else {
        button.classList.remove("active-button");
      }
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });

  // MOBILE MENU //
  const mobileMenuIcon = document.querySelector(".mobile-menu-icon");
  const navList = document.querySelector(".nav-list");
  const headerMobileMenu = document.querySelector(".header-mobile-menu");

  mobileMenuIcon.addEventListener("click", function () {
    if (navList.classList.contains("nav-list-active")) {
      navList.classList.remove("nav-list-active");
      mobileMenuIcon.src = "./images/mobile-menu.svg";
    } else {
      navList.classList.add("nav-list-active");
      mobileMenuIcon.src = "./images/close-menu.svg";
    }
  });

  // HIDING DISCOUNT BANNER
  const closeButton = document.querySelector(".discount-banner-close");
  const banner = document.querySelector(".discount-banner-thumb");

  closeButton.addEventListener("click", () => {
    banner.style.display = "none";
  });
});
