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

  window.carouselState = {
    activeIndex: slides.findIndex((slide) => slide.classList.contains("is-active")),
    activeFactIndex: factSlides.findIndex((slide) => slide.classList.contains("is-active")),
    activeDidYouKnowIndex: didYouKnowSlides.findIndex((slide) => slide.classList.contains("is-active")),
  };

  if (window.carouselState.activeIndex < 0) window.carouselState.activeIndex = 0;
  if (window.carouselState.activeFactIndex < 0) window.carouselState.activeFactIndex = 0;
  if (window.carouselState.activeDidYouKnowIndex < 0) window.carouselState.activeDidYouKnowIndex = 0;

  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
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

  const syncCarousel = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === window.carouselState.activeIndex);
    });
    if (track) {
      track.style.transform = `translateX(-${window.carouselState.activeIndex * 113.5}%)`;
    }
  };

  window.syncCarousel = syncCarousel;

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!slides.length) return;
      const direction = button.getAttribute("data-carousel-nav") === "next" ? 1 : -1;
      window.carouselState.activeIndex = (window.carouselState.activeIndex + direction + slides.length) % slides.length;
      syncCarousel();
    });
  });

  syncCarousel();

  const syncFactsCarousel = () => {
    factSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === window.carouselState.activeFactIndex);
    });
    if (factsTrack) {
      factsTrack.style.transform = `translateX(-${window.carouselState.activeFactIndex * 100}%)`;
    }
    factButtons.forEach((button) => {
      const isPrev = button.getAttribute("data-facts-nav") === "prev";
      const shouldHide =
        (isPrev && window.carouselState.activeFactIndex === 0) ||
        (!isPrev && window.carouselState.activeFactIndex === factSlides.length - 1);
      button.classList.toggle("is-hidden", shouldHide);
    });
  };

  window.syncFactsCarousel = syncFactsCarousel;

  factButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!factSlides.length) return;
      const direction = button.getAttribute("data-facts-nav") === "next" ? 1 : -1;
      window.carouselState.activeFactIndex = Math.max(0, Math.min(factSlides.length - 1, window.carouselState.activeFactIndex + direction));
      syncFactsCarousel();
    });
  });

  syncFactsCarousel();

  const syncDidYouKnowCarousel = () => {
    didYouKnowSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === window.carouselState.activeDidYouKnowIndex);
    });
    if (didYouKnowTrack) {
      didYouKnowTrack.style.transform = `translateX(-${window.carouselState.activeDidYouKnowIndex * 100}%)`;
    }
    didYouKnowButtons.forEach((button) => {
      const isPrev = button.getAttribute("data-didyouknow-nav") === "prev";
      const shouldHide =
        (isPrev && window.carouselState.activeDidYouKnowIndex === 0) ||
        (!isPrev && window.carouselState.activeDidYouKnowIndex === didYouKnowSlides.length - 1);
      button.classList.toggle("is-hidden", shouldHide);
    });
  };

  window.syncDidYouKnowCarousel = syncDidYouKnowCarousel;

  didYouKnowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!didYouKnowSlides.length) return;
      const direction = button.getAttribute("data-didyouknow-nav") === "next" ? 1 : -1;
      window.carouselState.activeDidYouKnowIndex = Math.max(
        0,
        Math.min(didYouKnowSlides.length - 1, window.carouselState.activeDidYouKnowIndex + direction)
      );
      syncDidYouKnowCarousel();
    });
  });

  if (didYouKnowViewport) {
    let touchStartX = 0;

    didYouKnowViewport.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
    }, { passive: true });

    didYouKnowViewport.addEventListener("touchend", (event) => {
      const touchEndX = event.changedTouches[0]?.clientX ?? 0;
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) < 40 || !didYouKnowSlides.length) return;
      if (deltaX < 0 && window.carouselState.activeDidYouKnowIndex < didYouKnowSlides.length - 1) {
        window.carouselState.activeDidYouKnowIndex += 1;
      } else if (deltaX > 0 && window.carouselState.activeDidYouKnowIndex > 0) {
        window.carouselState.activeDidYouKnowIndex -= 1;
      }
      syncDidYouKnowCarousel();
    }, { passive: true });
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
          feedbackStatus.textContent = isCorrect ? "BIEN JOUE !" : "DOMMAGE !";
          feedbackBody.textContent = feedbackText;
        }

        answers.forEach((answerBtn) => {
          if (answerBtn.getAttribute("data-correct") === "true") {
            if (answerBtn.style.scale == "1.15") {
              answerBtn.style.scale = "1";
            } else answerBtn.style.scale = "1.15";
          } else {
            if (answerBtn.classList.contains("light_blurred")) {
              answerBtn.classList.remove("light_blurred");
            } else answerBtn.classList.add("light_blurred");
          }
        });
      });
    });
  });

  endPopupClose?.addEventListener("click", () => {
    endPopup?.classList.add("is-hidden");
  });
});