document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0;

  // Function to detect device type
  function getDeviceType() {
    if (window.innerWidth >= 1200) return "desktop";
    if (window.innerWidth >= 768) return "tablet"; // Adjust tablet breakpoint as needed
    return "phone"; // Default to phone
  }

  let visibleOptions = []; // Track visible options
  let batchSize = 3; // Default batch size for desktop

  const observer = new IntersectionObserver(
    (entries) => {
      const currentScrollTop =
        window.scrollY || document.documentElement.scrollTop;

      entries.forEach((entry) => {
        const dataId = entry.target.getAttribute("data-id");

        if (currentScrollTop > lastScrollTop) {
          // Scrolling down
          if (entry.isIntersecting) {
            if (!localStorage.getItem(dataId)) {
              // Add animation classes only if the section hasn't been animated before
              if (
                entry.target.classList.contains("categories-thumb") ||
                entry.target.classList.contains("option") ||
                entry.target.classList.contains("categories-text-thumb")
              ) {
                entry.target.classList.add("visible-flex");
              } else {
                entry.target.classList.add("visible");
              }
              localStorage.setItem(dataId, "animated"); // Mark as animated
            }
          }
        } else {
        }
      });

      // Update last scroll position
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px 0px 0px", // Buffer zone
    }
  );

  // Clear localStorage on page load
  window.addEventListener("load", () => {
    localStorage.clear();
  });

  const selectors = [
    ".features-title",
    ".features-info-thumb",
    ".categories-thumb",
    ".benefits-thumb",
    ".more-title",
    ".more-subtitle",
    ".more-features-thumb",
    ".more-sub-features-thumb",
    ".antifraud-thumb",
    ".more-thumb",
    ".faq-title",
    ".faq-sub-title",
    ".faq-description",
    ".accordion",
    ".footer-thumb",
  ];

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
      const rect = element.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      ) {
        element.classList.add("visible");
        if (element.classList.contains("categories-text-thumb")) {
          element.classList.add("visible-flex");
        }
      }
    });
  });

  // Function to adjust batch size based on device type
  function updateBatchSize() {
    const deviceType = getDeviceType();
    switch (deviceType) {
      case "tablet":
        batchSize = 2;
        break;
      case "phone":
        batchSize = 1;
        break;
      default:
        batchSize = 3; // Default batch size for desktop
        break;
    }
  }

  // Initialize batch size
  updateBatchSize();

  // Observer for .categories-options-list .option elements (works on all devices)
  const categoriesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (!visibleOptions.includes(element)) {
            visibleOptions.push(element);
            showOptions();
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px 0px 0px",
    }
  );

  // Observer for .features-list .feature-item elements (works only on tablets and phones)
  const featuresObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (!visibleOptions.includes(element)) {
            visibleOptions.push(element);
            showOptions();
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px 0px 0px",
    }
  );

  function showOptions() {
    // Only process if there are visible options to show
    if (visibleOptions.length > 0 && batchSize > 0) {
      // Show up to batchSize options
      for (let i = 0; i < batchSize && i < visibleOptions.length; i++) {
        const option = visibleOptions[i];
        if (!option.classList.contains("visible-flex")) {
          option.classList.add("visible-flex");
        }
      }
      // Remove the processed options from the list
      visibleOptions = visibleOptions.slice(batchSize);
    }
  }

  // Observe elements for categories
  const categoriesSelectors = [".categories-options-list .option"];

  categoriesSelectors.forEach((selector) => {
    document
      .querySelectorAll(selector)
      .forEach((element) => categoriesObserver.observe(element));
  });

  // Observe elements for features (only on tablets and phones)
  const featuresSelectors = [".features-list .feature-item"];

  function observeFeatures() {
    const deviceType = getDeviceType();
    if (deviceType === "tablet" || deviceType === "phone") {
      featuresSelectors.forEach((selector) => {
        document
          .querySelectorAll(selector)
          .forEach((element) => featuresObserver.observe(element));
      });
    } else {
      // Unobserve all feature items if it's a desktop
      featuresSelectors.forEach((selector) => {
        document
          .querySelectorAll(selector)
          .forEach((element) => featuresObserver.unobserve(element));
      });
    }
  }

  // Initial observation for features
  observeFeatures();

  // --------------- FEATURES ITEMS SLIDER --------------
  function isDesktop() {
    return window.matchMedia("(min-width: 1200px)").matches;
  }

  // console.log("is desktop", isDesktop());

  if (isDesktop()) {
    const scrollOffset = 500; // Offset to scroll a little beyond the current view

    const sliderContainer = document.querySelector(".slider-container");
    const titleElements = document.querySelectorAll(".benefit-title-item");

    let isPageScrolling = false;
    let isSliderInteracted = false;

    function isSafari() {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes("safari") && !userAgent.includes("chrome");
    }

    // Function to handle the scroll effect
    function handleScroll() {
      const itemWidth = sliderContainer.scrollWidth / titleElements.length;
      const maxScrollLeft =
        sliderContainer.scrollWidth - sliderContainer.clientWidth;
      const scrollLeft = sliderContainer.scrollLeft;
      const remainingItems = (maxScrollLeft - scrollLeft) / itemWidth;

      // Check if the slider is at the end or start
      const atEnd = remainingItems === 0;
      const atStart = scrollLeft <= 40 || scrollLeft <= 0.5;

      if (atEnd) {
        if (!isPageScrolling) {
          isPageScrolling = true;
          window.scrollBy({
            top: scrollOffset,
            behavior: "smooth",
          });
          setTimeout(() => {
            isPageScrolling = false;
          }, 500);
        }
      } else if (atStart) {
        if (!isPageScrolling) {
          isPageScrolling = true;
          window.scrollBy({
            top: -scrollOffset,
            behavior: "smooth",
          });
          setTimeout(() => {
            isPageScrolling = false;
          }, 500);
        }
      }

      updateScrollPosition(); // Update scroll position in session storage
    }

    // IntersectionObserver to track slider visibility
    const Observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
            // Slider is at least 90% visible
            if (!isSafari()) {
              document.body.style.overflow = ""; // Re-enable body scroll
            }
          } else {
            // Slider is less than 80% visible
            if (!isSafari()) {
              document.body.style.overflow = ""; // Re-enable body scroll
            }
          }
        });
      },
      {
        threshold: [0.9], // Trigger when 90% of the slider is visible
      }
    );

    // Start observing the sliderContainer
    Observer.observe(sliderContainer);

    // Function to scroll slider to the end
    function scrollToEnd() {
      sliderContainer.scrollTo({
        left: sliderContainer.scrollWidth - sliderContainer.clientWidth,
        behavior: "auto", // Adjust if you want a smooth scroll
      });
    }

    // On page load, check if the user should see the slider at the end
    window.addEventListener("load", () => {
      if (sessionStorage.getItem("scrollToEnd") === "true") {
        scrollToEnd();
      }
    });

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
      titleElements.forEach((item) => {
        item.classList.remove("highlighted");
      });

      titleElements[index].classList.add("highlighted");
    }

    // Initial activation
    activateItem(0);

    // Add click event listeners to title elements
    titleElements.forEach((titleElement, index) => {
      titleElement.addEventListener("click", () => {
        activateItem(index);
      });
    });

    function updateScrollPosition() {
      if (
        sliderContainer.scrollLeft >=
        sliderContainer.scrollWidth - sliderContainer.clientWidth - 1
      ) {
        sessionStorage.setItem("scrollToEnd", "true");
      } else {
        sessionStorage.setItem("scrollToEnd", "false");
      }
    }
  }

  //--------------- Benefits items click action
  const titleItems = document.querySelectorAll(".benefit-title-item");
  const descriptionItems = document.querySelectorAll(
    ".benefit-description-item"
  );

  function activateBenefitItem(index) {
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

  activateBenefitItem(0);

  titleItems.forEach((titleItem, index) => {
    titleItem.addEventListener("click", () => {
      activateBenefitItem(index);
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
