document.addEventListener("DOMContentLoaded", function () {
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
    ".features-info-thumb",
    ".feature-item",
    ".more-sub-features-thumb",
    ".accordion",
    ".benefits-thumb",
    ".more-title",
    ".more-subtitle",
    ".more-features-thumb",
    ".antifraud-thumb",
    ".more-thumb",
    ".option",
    ".sub-features-title-thumb",
    ".more-sub-features-thumb",
    ".faq-title",
    ".faq-sub-title",
    ".faq-description",
    ".accrodion",
    ".accrodion-item",
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
    ".features-section-text",
    ".categories-text-thumb",

    ".categories-options-list",
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

  // FAQ

  const accordion = document.getElementById("accordion");
  const items = accordion.querySelectorAll(".accordion-item");

  items.forEach((item) => {
    const link = item.querySelector(".link");
    const arrowIcon = link.querySelector(".arrow-icon");
    const submenu = item.querySelector(".submenu");

    // Function to toggle the accordion item
    const toggleAccordion = () => {
      const isOpen = item.classList.contains("open");

      // Toggle the visibility and rotation
      submenu.style.maxHeight = isOpen ? "0px" : submenu.scrollHeight + "px";
      submenu.style.opacity = isOpen ? "0" : "1";
      link.parentElement.classList.toggle("open", !isOpen);

      // Close other items if not allowing multiple open
      if (!accordion.dataset.multiple) {
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherSubmenu = otherItem.querySelector(".submenu");
            otherSubmenu.style.maxHeight = "0px";
            otherSubmenu.style.opacity = "0";
            otherItem.classList.remove("open");
          }
        });
      }
    };

    // Add click event to the link and arrow icon
    link.addEventListener("click", toggleAccordion);
    arrowIcon.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click event from bubbling up
      toggleAccordion();
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
