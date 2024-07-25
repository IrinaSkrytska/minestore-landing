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
  const slideWidth =
    slides[0].offsetWidth +
    parseInt(window.getComputedStyle(slides[0]).marginRight);
  const slideNav = document.querySelector(".slide-nav");
  const currentSlideElem = document.querySelector(".current-slide");
  const totalSlidesElem = document.querySelector(".total-slides");
  const scrollContent = document.querySelector("#scroll-content");
  let currentIndex = 0;

  function updateSlideIndicator(direction) {
    const newSlideNumber = (currentIndex + 1).toString().padStart(2, "0");

    // Create new element for the new slide number
    const newSlideElem = document.createElement("p");
    newSlideElem.textContent = newSlideNumber;
    newSlideElem.classList.add(
      direction === "next" ? "scroll-from-bottom" : "scroll-from-top"
    );

    // Clear previous content and add new slide element
    scrollContent.innerHTML = "";
    scrollContent.appendChild(newSlideElem);

    // Handle the transition to "01" from the last slide
    if (
      direction === "next" &&
      currentIndex === 0 &&
      currentSlideElem.textContent === "01"
    ) {
      // Handle wrap around to first slide
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
          }, 500); // Pause at the end of the scrolling
        }
      }, 100); // Adjust speed here
    } else {
      // Normal transition
      currentSlideElem.textContent = newSlideNumber;
    }

    // Reset animation classes after transition
    setTimeout(() => {
      newSlideElem.classList.remove(
        direction === "next" ? "scroll-from-bottom" : "scroll-from-top"
      );
    }, 500); // Match this with the animation duration
  }

  function showSlide(index, direction) {
    if (index >= slideCount) {
      index = 0;
    } else if (index < 0) {
      index = slideCount - 1;
    }

    reviewsList.style.transform = `translateX(-${index * slideWidth}px)`;
    currentIndex = index;
    updateSlideIndicator(direction);
    updateSlideNav();
  }

  function updateSlideNav() {
    const indicators = document.querySelectorAll(".slide-nav span");
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === currentIndex);
    });
  }

  function createSlideNav() {
    slideNav.innerHTML = ""; // Clear existing indicators
    for (let i = 0; i < slideCount; i++) {
      const span = document.createElement("span");
      span.addEventListener("click", () =>
        showSlide(i, i > currentIndex ? "next" : "prev")
      );
      slideNav.appendChild(span);
    }
    updateSlideNav(); // Set the initial active indicator
  }

  function initialize() {
    createSlideNav();
    // Initialize the default slide indicator
    const indicator = slideCount.toString().padStart(2, "0");
    totalSlidesElem.textContent = `/${indicator}`;
    currentSlideElem.textContent = "01";
  }

  // Event listeners
  prevBtn.addEventListener("click", () => {
    showSlide(currentIndex - 1, "prev");
  });

  nextBtn.addEventListener("click", () => {
    showSlide(currentIndex + 1, "next");
  });

  // Initialize
  initialize();

  // PRICING SWITCH//
  const buttons = document.querySelectorAll(".pricing-button");
  const tables = document.querySelectorAll(".pricing-table");

  function handleButtonClick(event) {
    // Get the target class to show
    const targetClass = event.target.getAttribute("data-target");

    // Hide all tables
    tables.forEach((table) => {
      table.classList.add("hidden");
      table.classList.remove("visible");
    });

    // Show the table that matches the clicked button
    const targetTable = document.querySelector(`.${targetClass}`);
    if (targetTable) {
      targetTable.classList.add("visible");
      targetTable.classList.remove("hidden");
    }

    // Update button styles
    buttons.forEach((button) => {
      if (button === event.target) {
        button.classList.add("active-button");
      } else {
        button.classList.remove("active-button");
      }
    });
  }

  // Attach click event listeners to all buttons
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
});
