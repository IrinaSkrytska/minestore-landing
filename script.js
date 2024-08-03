document.addEventListener("DOMContentLoaded", () => {
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
        const dataId = entry.target.getAttribute("data-id"); // Get the data-id attribute

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
          // Scrolling up
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
    ".features-text",
    ".categories-thumb",
    ".benefits-thumb",
    ".more-features-section",
    ".more-title",
    ".more-subtitle",
    ".more-features-thumb",
    ".antifraud-thumb",
    ".more-thumb",
    ".pricing-title",
    ".pricing-sub-text",
    ".pricing-buttons-thumb",
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
        if (
          element.classList.contains("categories-thumb") ||
          element.classList.contains("categories-text-thumb")
        ) {
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

  // ----------Slider functionality

  // const scrollOffset = 700; // Offset to scroll a little beyond the current view

  // const sliderContainer = document.querySelector(".slider-container");
  // const titleElements = document.querySelectorAll(".benefit-title-item");
  // const descriptionElements = document.querySelectorAll(
  //   ".benefit-description-item"
  // );

  // let isPageScrolling = false;
  // let isSliderInteracted = false;

  // function isSafari() {
  //   const userAgent = navigator.userAgent.toLowerCase();
  //   return userAgent.includes("safari") && !userAgent.includes("chrome");
  // }

  // // Function to handle the scroll effect
  // function handleScroll() {
  //   const itemWidth = sliderContainer.scrollWidth / titleElements.length;
  //   const maxScrollLeft =
  //     sliderContainer.scrollWidth - sliderContainer.clientWidth;
  //   const scrollLeft = sliderContainer.scrollLeft;
  //   const remainingItems = (maxScrollLeft - scrollLeft) / itemWidth;

  //   // Check if the slider is at the end or start
  //   const atEnd = remainingItems === 0;
  //   const atStart = scrollLeft <= 0.5;

  //   // Disable body scroll if not at the start or end, unless Safari
  //   if (atEnd || atStart) {
  //     if (document.body.style.overflow === "hidden" && !isSafari()) {
  //       document.body.style.overflow = ""; // Re-enable body scroll
  //     }
  //   } else {
  //     if (document.body.style.overflow !== "hidden" && !isSafari()) {
  //       document.body.style.overflow = "hidden"; // Disable body scroll
  //     }
  //   }

  //   if (atEnd) {
  //     if (!isPageScrolling) {
  //       isPageScrolling = true;
  //       window.scrollBy({
  //         top: scrollOffset,
  //         behavior: "smooth",
  //       });
  //       setTimeout(() => {
  //         isPageScrolling = false;
  //       }, 500);
  //     }
  //   } else if (atStart) {
  //     if (!isPageScrolling) {
  //       isPageScrolling = true;
  //       window.scrollBy({
  //         top: -scrollOffset,
  //         behavior: "smooth",
  //       });
  //       setTimeout(() => {
  //         isPageScrolling = false;
  //       }, 500);
  //     }
  //   }
  // }

  // // IntersectionObserver to track slider visibility
  // const Observer = new IntersectionObserver(
  //   (entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
  //         // Slider is at least 80% visible
  //         if (!isSafari()) {
  //           document.body.style.overflow = "hidden"; // Disable body scroll
  //         }
  //       } else {
  //         // Slider is less than 80% visible
  //         if (!isSafari()) {
  //           document.body.style.overflow = ""; // Re-enable body scroll
  //         }
  //       }
  //     });
  //   },
  //   {
  //     threshold: [0.8], // Trigger when 80% of the slider is visible
  //   }
  // );

  // // Start observing the sliderContainer
  // Observer.observe(sliderContainer);

  // // Function to scroll slider to the end
  // function scrollToEnd() {
  //   sliderContainer.scrollTo({
  //     left: sliderContainer.scrollWidth - sliderContainer.clientWidth,
  //     behavior: "auto", // Adjust if you want a smooth scroll
  //   });
  // }

  // // On page load, check if the user should see the slider at the end
  // window.addEventListener("load", () => {
  //   if (sessionStorage.getItem("scrollToEnd") === "true") {
  //     scrollToEnd();
  //   }
  // });

  // // Handle slider container scroll
  // sliderContainer.addEventListener("scroll", handleScroll);

  // // Handle wheel event for horizontal scrolling
  // sliderContainer.addEventListener("wheel", (event) => {
  //   event.preventDefault();
  //   sliderContainer.scrollBy({
  //     left: event.deltaY < 0 ? -220 : 220,
  //     behavior: "smooth",
  //   });
  // });

  // // Activate item and handle page scroll
  // function activateItem(index) {
  //   titleElements.forEach((item) => {
  //     item.classList.remove("highlighted");
  //   });

  //   descriptionElements.forEach((item) => {
  //     item.classList.remove("active");
  //   });

  //   if (descriptionElements[index]) {
  //     descriptionElements[index].classList.add("active");
  //   }

  //   titleElements[index].classList.add("highlighted");
  // }

  // // Initial activation
  // activateItem(0);

  // // Add click event listeners to title elements
  // titleElements.forEach((titleElement, index) => {
  //   titleElement.addEventListener("click", () => {
  //     activateItem(index);
  //   });
  // });

  // function updateScrollPosition() {
  //   if (
  //     sliderContainer.scrollLeft >=
  //     sliderContainer.scrollWidth - sliderContainer.clientWidth - 1
  //   ) {
  //     sessionStorage.setItem("scrollToEnd", "true");
  //   } else {
  //     sessionStorage.setItem("scrollToEnd", "false");
  //   }
  // }

  // sliderContainer.addEventListener("scroll", updateScrollPosition);

  // function isDesktop() {
  //   return window.matchMedia("(min-width: 1200px)").matches;
  // }

  // console.log("is desktop", isDesktop());

  // if (!isDesktop()) {
  //   return;
  // } else if (isDesktop()) {
  //   const scrollOffset = 300; // Offset to scroll a little beyond the current view

  //   const sliderContainer = document.querySelector(".slider-container");
  //   const titleElements = document.querySelectorAll(".benefit-title-item");
  //   const descriptionElements = document.querySelectorAll(
  //     ".benefit-description-item"
  //   );

  //   let isPageScrolling = false;
  //   let isSliderInteracted = false;

  //   function isSafari() {
  //     const userAgent = navigator.userAgent.toLowerCase();
  //     return userAgent.includes("safari") && !userAgent.includes("chrome");
  //   }

  //   // Function to handle the scroll effect
  //   function handleScroll() {
  //     const itemWidth = sliderContainer.scrollWidth / titleElements.length;
  //     const maxScrollLeft =
  //       sliderContainer.scrollWidth - sliderContainer.clientWidth;
  //     const scrollLeft = sliderContainer.scrollLeft;
  //     const remainingItems = (maxScrollLeft - scrollLeft) / itemWidth;

  //     // Check if the slider is at the end or start
  //     const atEnd = remainingItems === 0;
  //     const atStart = scrollLeft <= 0.5;

  //     // // Disable body scroll if not at the start or end, unless Safari
  //     // if (atEnd || atStart) {
  //     //   if (document.body.style.overflow === "hidden" && !isSafari()) {
  //     //     document.body.style.overflow = ""; // Re-enable body scroll
  //     //   }
  //     // } else {
  //     //   if (document.body.style.overflow !== "hidden" && !isSafari()) {
  //     //     document.body.style.overflow = "hidden"; // Disable body scroll
  //     //   }
  //     // }

  //     if (atEnd) {
  //       if (!isPageScrolling) {
  //         document.body.style.overflow = "";
  //         isPageScrolling = true;
  //         window.scrollBy({
  //           top: scrollOffset,
  //           behavior: "smooth",
  //         });
  //         setTimeout(() => {
  //           isPageScrolling = false;
  //         }, 500);
  //       }
  //     } else if (atStart) {
  //       if (!isPageScrolling) {
  //         document.body.style.overflow = "";
  //         isPageScrolling = true;
  //         window.scrollBy({
  //           top: -scrollOffset,
  //           behavior: "smooth",
  //         });
  //         setTimeout(() => {
  //           isPageScrolling = false;
  //         }, 500);
  //       }
  //     }
  //   }

  //   // IntersectionObserver to track slider visibility
  //   const Observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting && entry.intersectionRatio === 0.5) {
  //           // Slider is at least 90% visible
  //           if (!isSafari()) {
  //             document.body.style.overflow = "hidden"; // Disable body scroll
  //           }
  //         } else {
  //           // Slider is less than 80% visible
  //           if (!isSafari()) {
  //             document.body.style.overflow = ""; // Re-enable body scroll
  //           }
  //         }
  //       });
  //     },
  //     {
  //       threshold: [0.5], // Trigger when 90% of the slider is visible
  //     }
  //   );

  //   // Start observing the sliderContainer
  //   Observer.observe(sliderContainer);

  //   // Function to scroll slider to the end
  //   function scrollToEnd() {
  //     sliderContainer.scrollTo({
  //       left: sliderContainer.scrollWidth - sliderContainer.clientWidth,
  //       behavior: "auto", // Adjust if you want a smooth scroll
  //     });
  //   }

  //   // On page load, check if the user should see the slider at the end
  //   window.addEventListener("load", () => {
  //     if (sessionStorage.getItem("scrollToEnd") === "true") {
  //       scrollToEnd();
  //     }
  //   });

  //   // Handle slider container scroll
  //   sliderContainer.addEventListener("scroll", handleScroll);

  //   // Handle wheel event for horizontal scrolling
  //   sliderContainer.addEventListener("wheel", (event) => {
  //     event.preventDefault();
  //     sliderContainer.scrollBy({
  //       left: event.deltaY < 0 ? -220 : 220,
  //       behavior: "smooth",
  //     });
  //   });

  //   // Activate item and handle page scroll
  //   function activateItem(index) {
  //     titleElements.forEach((item) => {
  //       item.classList.remove("highlighted");
  //     });

  //     descriptionElements.forEach((item) => {
  //       item.classList.remove("active");
  //     });

  //     if (descriptionElements[index]) {
  //       descriptionElements[index].classList.add("active");
  //     }

  //     titleElements[index].classList.add("highlighted");
  //   }

  //   // Initial activation
  //   activateItem(0);

  //   // Add click event listeners to title elements
  //   titleElements.forEach((titleElement, index) => {
  //     titleElement.addEventListener("click", () => {
  //       activateItem(index);
  //     });
  //   });

  //   function updateScrollPosition() {
  //     if (
  //       sliderContainer.scrollLeft >=
  //       sliderContainer.scrollWidth - sliderContainer.clientWidth - 1
  //     ) {
  //       sessionStorage.setItem("scrollToEnd", "true");
  //     } else {
  //       sessionStorage.setItem("scrollToEnd", "false");
  //     }
  //   }

  //   sliderContainer.addEventListener("scroll", updateScrollPosition);
  // }

  // function isDesktop() {
  //   return window.matchMedia("(min-width: 1200px)").matches;
  // }

  // console.log("is desktop", isDesktop());

  // if (isDesktop()) {
  //   const scrollOffset = 500; // Offset to scroll a little beyond the current view

  //   const sliderContainer = document.querySelector(".slider-container");
  //   const titleElements = document.querySelectorAll(".benefit-title-item");

  //   let isPageScrolling = false;
  //   let isSliderInteracted = false;

  //   function isSafari() {
  //     const userAgent = navigator.userAgent.toLowerCase();
  //     return userAgent.includes("safari") && !userAgent.includes("chrome");
  //   }

  //   // Function to handle the scroll effect
  //   function handleScroll() {
  //     const itemWidth = sliderContainer.scrollWidth / titleElements.length;
  //     const maxScrollLeft =
  //       sliderContainer.scrollWidth - sliderContainer.clientWidth;
  //     const scrollLeft = sliderContainer.scrollLeft;
  //     const remainingItems = (maxScrollLeft - scrollLeft) / itemWidth;

  //     // Check if the slider is at the end or start
  //     const atEnd = remainingItems === 0;
  //     const atStart = scrollLeft <= 40 || scrollLeft <= 0.5;

  //     if (atEnd) {
  //       if (!isPageScrolling) {
  //         isPageScrolling = true;
  //         window.scrollBy({
  //           top: scrollOffset,
  //           behavior: "smooth",
  //         });
  //         setTimeout(() => {
  //           isPageScrolling = false;
  //         }, 500);
  //       }
  //     } else if (atStart) {
  //       if (!isPageScrolling) {
  //         isPageScrolling = true;
  //         window.scrollBy({
  //           top: -scrollOffset,
  //           behavior: "smooth",
  //         });
  //         setTimeout(() => {
  //           isPageScrolling = false;
  //         }, 500);
  //       }
  //     }

  //     updateScrollPosition(); // Update scroll position in session storage
  //   }

  //   // IntersectionObserver to track slider visibility
  //   const Observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
  //           // Slider is at least 90% visible
  //           if (!isSafari()) {
  //             document.body.style.overflow = ""; // Re-enable body scroll
  //           }
  //         } else {
  //           // Slider is less than 80% visible
  //           if (!isSafari()) {
  //             document.body.style.overflow = ""; // Re-enable body scroll
  //           }
  //         }
  //       });
  //     },
  //     {
  //       threshold: [0.9], // Trigger when 90% of the slider is visible
  //     }
  //   );

  //   // Start observing the sliderContainer
  //   Observer.observe(sliderContainer);

  //   // Function to scroll slider to the end
  //   function scrollToEnd() {
  //     sliderContainer.scrollTo({
  //       left: sliderContainer.scrollWidth - sliderContainer.clientWidth,
  //       behavior: "auto", // Adjust if you want a smooth scroll
  //     });
  //   }

  //   // On page load, check if the user should see the slider at the end
  //   window.addEventListener("load", () => {
  //     if (sessionStorage.getItem("scrollToEnd") === "true") {
  //       scrollToEnd();
  //     }
  //   });

  //   // Handle slider container scroll
  //   sliderContainer.addEventListener("scroll", handleScroll);

  //   // Handle wheel event for horizontal scrolling
  //   sliderContainer.addEventListener("wheel", (event) => {
  //     event.preventDefault();
  //     sliderContainer.scrollBy({
  //       left: event.deltaY < 0 ? -220 : 220,
  //       behavior: "smooth",
  //     });
  //   });

  //   // Activate item and handle page scroll
  //   function activateItem(index) {
  //     titleElements.forEach((item) => {
  //       item.classList.remove("highlighted");
  //     });

  //     titleElements[index].classList.add("highlighted");
  //   }

  //   // Initial activation
  //   activateItem(0);

  //   // Add click event listeners to title elements
  //   titleElements.forEach((titleElement, index) => {
  //     titleElement.addEventListener("click", () => {
  //       activateItem(index);
  //     });
  //   });

  //   function updateScrollPosition() {
  //     if (
  //       sliderContainer.scrollLeft >=
  //       sliderContainer.scrollWidth - sliderContainer.clientWidth - 1
  //     ) {
  //       sessionStorage.setItem("scrollToEnd", "true");
  //     } else {
  //       sessionStorage.setItem("scrollToEnd", "false");
  //     }
  //   }
  // }
  // function isDesktop() {
  //   return window.matchMedia("(min-width: 1200px)").matches;
  // }

  // console.log("is desktop", isDesktop());

  // if (isDesktop()) {
  //   const scrollOffset = 1000; // Offset to scroll a little beyond the current view

  //   const sliderContainer = document.querySelector(".slider-container");
  //   const titleElements = document.querySelectorAll(".feature-item");

  //   let isPageScrolling = false;
  //   let isSliderInteracted = false;

  //   function handleScroll() {
  //     const itemWidth = sliderContainer.scrollWidth / titleElements.length;
  //     const maxScrollLeft =
  //       sliderContainer.scrollWidth - sliderContainer.clientWidth;
  //     const scrollLeft = sliderContainer.scrollLeft;
  //     const remainingItems = (maxScrollLeft - scrollLeft) / itemWidth;

  //     // Check if the slider is at the end or start
  //     const atEnd = remainingItems === 0;
  //     const atStart = scrollLeft <= 0.5 || scrollLeft === 40;

  //     if (atEnd) {
  //       if (!isPageScrolling) {
  //         isPageScrolling = true;
  //         window.scrollBy({
  //           top: scrollOffset,
  //           behavior: "smooth",
  //         });
  //         setTimeout(() => {
  //           isPageScrolling = false;
  //         }, 500);
  //       }
  //     } else if (atStart) {
  //       if (!isPageScrolling) {
  //         isPageScrolling = true;
  //         window.scrollBy({
  //           top: -scrollOffset,
  //           behavior: "smooth",
  //         });
  //         setTimeout(() => {
  //           isPageScrolling = false;
  //         }, 500);
  //       }
  //     }

  //     updateScrollPosition(); // Update scroll position in session storage
  //   }

  //   function preventScroll(event) {
  //     const itemWidth = sliderContainer.scrollWidth / titleElements.length;
  //     const maxScrollLeft =
  //       sliderContainer.scrollWidth - sliderContainer.clientWidth;
  //     const scrollLeft = sliderContainer.scrollLeft;
  //     const remainingItems = (maxScrollLeft - scrollLeft) / itemWidth;

  //     const atEnd = remainingItems <= 0;
  //     const atStart = scrollLeft <= 0.5;

  //     if (!atEnd && !atStart) {
  //       event.preventDefault();
  //       sliderContainer.scrollBy({
  //         left: event.deltaY < 0 ? -220 : 220,
  //         behavior: "smooth",
  //       });
  //     }
  //   }

  //   // IntersectionObserver to track slider visibility
  //   const Observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting && entry.intersectionRatio >= 0.08) {
  //           console.log("view:", entry.intersectionRatio);
  //           // Slider is at least 90% visible
  //           document.addEventListener("wheel", preventScroll, {
  //             passive: false,
  //           });
  //         } else {
  //           // Slider is less than 90% visible
  //           document.removeEventListener("wheel", preventScroll);
  //         }
  //       });
  //     },
  //     {
  //       threshold: [0.08], // Trigger when 90% of the slider is visible
  //     }
  //   );

  //   // Start observing the sliderContainer
  //   Observer.observe(sliderContainer);

  //   // Function to scroll slider to the end
  //   function scrollToEnd() {
  //     sliderContainer.scrollTo({
  //       left: sliderContainer.scrollWidth - sliderContainer.clientWidth,
  //       behavior: "auto", // Adjust if you want a smooth scroll
  //     });
  //   }

  //   // On page load, check if the user should see the slider at the end
  //   window.addEventListener("load", () => {
  //     if (sessionStorage.getItem("scrollToEnd") === "true") {
  //       scrollToEnd();
  //     }
  //   });

  //   // Handle slider container scroll
  //   sliderContainer.addEventListener("scroll", handleScroll);

  //   // Handle wheel event for horizontal scrolling
  //   sliderContainer.addEventListener("wheel", (event) => {
  //     preventScroll(event);
  //   });

  //   // Activate item and handle page scroll
  //   function activateItem(index) {
  //     titleElements.forEach((item) => {
  //       item.classList.remove("highlighted");
  //     });

  //     titleElements[index].classList.add("highlighted");
  //   }

  //   // Initial activation
  //   activateItem(0);

  //   // Add click event listeners to title elements
  //   titleElements.forEach((titleElement, index) => {
  //     titleElement.addEventListener("click", () => {
  //       activateItem(index);
  //     });
  //   });

  //   function updateScrollPosition() {
  //     if (
  //       sliderContainer.scrollLeft >=
  //       sliderContainer.scrollWidth - sliderContainer.clientWidth - 1
  //     ) {
  //       sessionStorage.setItem("scrollToEnd", "true");
  //     } else {
  //       sessionStorage.setItem("scrollToEnd", "false");
  //     }
  //   }
  // }

  function isDesktop() {
    return window.matchMedia("(min-width: 1200px)").matches;
  }

  if (isDesktop()) {
    const scrollOffset = 500; // Offset to scroll a little beyond the current view

    const sliderContainer = document.querySelector(".slider-container");
    const titleElements = document.querySelectorAll(".feature-item");

    let isPageScrolling = false;

    function handleScroll() {
      const itemWidth = sliderContainer.scrollWidth / titleElements.length;
      const maxScrollLeft =
        sliderContainer.scrollWidth - sliderContainer.clientWidth;
      const scrollLeft = sliderContainer.scrollLeft;
      const remainingItems = (maxScrollLeft - scrollLeft) / itemWidth;

      // Check if the slider is at the end or start
      const atEnd = remainingItems === 0;
      const atStart = scrollLeft <= 0.5 || scrollLeft === 40;

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

    function preventScroll(event) {
      const itemWidth = sliderContainer.scrollWidth / titleElements.length;
      const maxScrollLeft =
        sliderContainer.scrollWidth - sliderContainer.clientWidth;
      const scrollLeft = sliderContainer.scrollLeft;
      const remainingItems = (maxScrollLeft - scrollLeft) / itemWidth;

      const atEnd = remainingItems === 0;
      const atStart = scrollLeft <= 0.5;

      if (!atStart) {
        event.preventDefault();
        sliderContainer.scrollBy({
          left: event.deltaY < 0 ? -220 : 220,
          behavior: "smooth",
        });
      }
    }

    function cursorIsOnSlider(event) {
      const rect = sliderContainer.getBoundingClientRect();
      return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
    }

    // Prevent page scroll when slider is not at the first item
    document.addEventListener(
      "wheel",
      (event) => {
        if (cursorIsOnSlider(event)) {
          preventScroll(event);
        }
      },
      { passive: false }
    );

    // IntersectionObserver to track slider visibility
    const Observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log("entry", entry.intersectionRatio);
          if (entry.isIntersecting && entry.intersectionRatio >= 1) {
            document.addEventListener("wheel", preventScroll, {
              passive: false,
            });
          } else {
            // Slider is less than 8% visible
            document.removeEventListener("wheel", preventScroll);
          }
        });
      },
      {
        threshold: [0.9], // Trigger when 8% of the slider is visible
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

  // //  REVIEWS CAROUSEL//
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
