document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("companyHeader");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const track = document.querySelector("[data-carousel-track]");
  const slides = Array.from(document.querySelectorAll("[data-carousel-slide]"));
  const navButtons = document.querySelectorAll("[data-carousel-nav]");
  const factsTrack = document.querySelector("[data-facts-track]");
  const factSlides = Array.from(document.querySelectorAll("[data-fact-slide]"));
  const factButtons = document.querySelectorAll("[data-facts-nav]");
  const didYouKnowTrack = document.querySelector("[data-didyouknow-track]");
  const didYouKnowViewport = document.querySelector("[data-didyouknow-viewport]");
  const didYouKnowSlides = Array.from(document.querySelectorAll("[data-didyouknow-slide]"));
  const didYouKnowButtons = document.querySelectorAll("[data-didyouknow-nav]");
  const quizQuestions = document.querySelectorAll("[data-quiz-question]");
  const endPopup = document.querySelector("[data-end-popup]");
  const endPopupClose = document.querySelector("[data-end-popup-close]");
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let activeFactIndex = factSlides.findIndex((slide) => slide.classList.contains("is-active"));
  let activeDidYouKnowIndex = didYouKnowSlides.findIndex((slide) => slide.classList.contains("is-active"));

  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const syncCarousel = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });

    if (track) {
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
    }
  };

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!slides.length) {
        return;
      }

      const direction = button.getAttribute("data-carousel-nav") === "next" ? 1 : -1;
      activeIndex = (activeIndex + direction + slides.length) % slides.length;
      syncCarousel();
    });
  });

  syncCarousel();

  if (activeFactIndex < 0) {
    activeFactIndex = 0;
  }

  const syncFactsCarousel = () => {
    factSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeFactIndex);
    });

    if (factsTrack) {
      factsTrack.style.transform = `translateX(-${activeFactIndex * 100}%)`;
    }

    factButtons.forEach((button) => {
      const isPrev = button.getAttribute("data-facts-nav") === "prev";
      const shouldHide =
        (isPrev && activeFactIndex === 0) ||
        (!isPrev && activeFactIndex === factSlides.length - 1);
      button.classList.toggle("is-hidden", shouldHide);
    });
  };

  factButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!factSlides.length) {
        return;
      }

      const direction = button.getAttribute("data-facts-nav") === "next" ? 1 : -1;
      activeFactIndex = Math.max(0, Math.min(factSlides.length - 1, activeFactIndex + direction));
      syncFactsCarousel();
    });
  });

  syncFactsCarousel();

  if (activeDidYouKnowIndex < 0) {
    activeDidYouKnowIndex = 0;
  }

  const syncDidYouKnowCarousel = () => {
    didYouKnowSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeDidYouKnowIndex);
    });

    if (didYouKnowTrack) {
      didYouKnowTrack.style.transform = `translateX(-${activeDidYouKnowIndex * 100}%)`;
    }

    didYouKnowButtons.forEach((button) => {
      const isPrev = button.getAttribute("data-didyouknow-nav") === "prev";
      const shouldHide =
        (isPrev && activeDidYouKnowIndex === 0) ||
        (!isPrev && activeDidYouKnowIndex === didYouKnowSlides.length - 1);
      button.classList.toggle("is-hidden", shouldHide);
    });
  };

  didYouKnowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!didYouKnowSlides.length) {
        return;
      }

      const direction = button.getAttribute("data-didyouknow-nav") === "next" ? 1 : -1;
      activeDidYouKnowIndex = Math.max(
        0,
        Math.min(didYouKnowSlides.length - 1, activeDidYouKnowIndex + direction)
      );
      syncDidYouKnowCarousel();
    });
  });

  if (didYouKnowViewport) {
    let touchStartX = 0;

    didYouKnowViewport.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? 0;
      },
      { passive: true }
    );

    didYouKnowViewport.addEventListener(
      "touchend",
      (event) => {
        const touchEndX = event.changedTouches[0]?.clientX ?? 0;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) < 40 || !didYouKnowSlides.length) {
          return;
        }

        if (deltaX < 0 && activeDidYouKnowIndex < didYouKnowSlides.length - 1) {
          activeDidYouKnowIndex += 1;
        } else if (deltaX > 0 && activeDidYouKnowIndex > 0) {
          activeDidYouKnowIndex -= 1;
        }

        syncDidYouKnowCarousel();
      },
      { passive: true }
    );
  }

  syncDidYouKnowCarousel();

  const quizFeedback = {
    countries:
      "« Ecofrost entretient bien la reputation de la frite belge puisque l'essentiel de sa production est destine a l'exportation vers plus de 150 pays. »",
    storage:
      "Comme l'explique Pauline Jean,\nresponsable de l'approvisionnement et\ndu stockage chez Ecofrost :\nLes pommes de terre recoltees entre\naout et octobre peuvent etre\nconservees jusqu'a l'ete suivant grace a\nces techniques de stockage.",
  };

  quizQuestions.forEach((question) => {
    const answers = question.querySelectorAll("[data-quiz-answer]");
    const questionKey = question.getAttribute("data-quiz-question") || "";
    const feedbackText = quizFeedback[questionKey] || "";
    const feedback = question.querySelector("[data-quiz-feedback]");
    const feedbackStatus = question.querySelector("[data-quiz-feedback-status]");
    const feedbackBody = question.querySelector("[data-quiz-feedback-text]");

    answers.forEach((answer) => {
      answer.addEventListener("click", () => {
        answers.forEach((item) => item.classList.remove("is-selected"));
        answer.classList.add("is-selected");
        const isCorrect = answer.getAttribute("data-correct") === "true";

        if (feedback && feedbackStatus && feedbackBody) {
          feedback.hidden = false;
          feedbackStatus.textContent = isCorrect ? "BIEN JOUE" : "DOMMAGE";
          feedbackBody.textContent = feedbackText;
        }
      });
    });
  });

  endPopupClose?.addEventListener("click", () => {
    endPopup?.classList.add("is-hidden");
  });
});
