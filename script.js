document.addEventListener("DOMContentLoaded", () => {
  // Elements visibility for animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  // Observe all features-info-thumb elements
  document.querySelectorAll(".features-info-thumb").forEach((element) => {
    observer.observe(element);
  });

  // Observe all more-thumb elements
  document.querySelectorAll(".more-thumb").forEach((element) => {
    observer.observe(element);
  });

  // Slider functionality
  const sliderContainer = document.querySelector(".slider-container");
  const progressBar = document.querySelector(".custom-scrollbar");

  sliderContainer.addEventListener("scroll", () => {
    const maxScrollLeft =
      sliderContainer.scrollWidth - sliderContainer.clientWidth;
    const scrollLeft = sliderContainer.scrollLeft;
    const scrollPercentage = (scrollLeft / maxScrollLeft) * 100;
    progressBar.style.width = scrollPercentage + "%";
  });

  sliderContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    sliderContainer.scrollBy({
      left: event.deltaY < 0 ? -220 : 220,
      behavior: "smooth",
    });
  });

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
