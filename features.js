document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.target.classList.contains("categories-thumb") ||
          entry.target.classList.contains("option") ||
          entry.target.classList.contains("reviews-section") ||
          entry.target.classList.contains("pricing-section")
        ) {
          entry.target.classList.add("visible-flex");
        } else if (entry.isIntersecting) {
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

  document.querySelectorAll(".features-info-thumb").forEach((element) => {
    observer.observe(element);
  });

  //   document.querySelectorAll(".benefits-section").forEach((element) => {
  //     observer.observe(element);
  //   });

  document.querySelectorAll(".more-features-section").forEach((element) => {
    observer.observe(element);
  });

  document.querySelectorAll(".option").forEach((element) => {
    observer.observe(element);
  });

  document.querySelectorAll(".categories-thumb").forEach((element) => {
    observer.observe(element);
  });

  document.querySelectorAll(".reviews-section").forEach((element) => {
    observer.observe(element);
  });

  document.querySelectorAll(".pricing-section").forEach((element) => {
    observer.observe(element);
  });

  document.querySelectorAll(".footer-thumb").forEach((element) => {
    observer.observe(element);
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

  // FAQ

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionThumb = item.querySelector(".faq-question-thumb");
    const answer = item.querySelector(".faq-answer");
    const arrowIcon = item.querySelector(".arrow-icon");

    questionThumb.addEventListener("click", function () {
      // Check if the clicked item's answer is already visible
      const isAnswerVisible = answer.style.display === "block";

      // Hide all answers and remove the active class from all items
      faqItems.forEach((otherItem) => {
        const otherAnswer = otherItem.querySelector(".faq-answer");
        const otherArrow = otherItem.querySelector(".arrow-icon");
        otherItem.classList.remove("active-item");
        otherAnswer.style.display = "none";
        otherArrow.classList.remove("rotate");
      });

      // If the clicked answer was not visible, show it, add active class, and rotate the arrow
      if (!isAnswerVisible) {
        answer.style.display = "block";
        item.classList.add("active-item");
        arrowIcon.classList.add("rotate");
      } else {
        // If the answer was visible, just remove the active class and rotate class
        item.classList.remove("active-item");
        arrowIcon.classList.remove("rotate");
      }
    });
  });
});
