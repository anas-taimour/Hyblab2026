document.addEventListener("DOMContentLoaded", () => {
  const topbar    = document.getElementById("topbar");

  // ── Topbar scroll shadow ──────────────────────────────────
  const syncHeaderState = () =>
    topbar?.classList.toggle("is-scrolled", window.scrollY > 20);

  window.addEventListener("scroll", syncHeaderState, { passive: true });
  syncHeaderState();

  // ── Mobile nav toggle ────────────────────────────────────
  // ── Reveal on scroll ─────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) =>
    revealObserver.observe(el)
  );

  // ── Quiz logic ───────────────────────────────────────────
  // Chaque .quiz-layout est indépendant (questions multiples sur la page).
  document.querySelectorAll(".quiz-layout").forEach((quizLayout) => {
    const options      = quizLayout.querySelectorAll(".quiz-option");
    const feedback     = quizLayout.querySelector(".quiz-feedback");
    const feedbackTitle = feedback?.querySelector("h3");

    // Sauvegarde du titre "succès" original défini dans le HTML
    const successTitle = feedbackTitle?.textContent.trim() ?? "BRAVO";

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const isCorrect = option.dataset.answer === "correct";

        // Réinitialise toutes les options
        options.forEach((btn) => btn.classList.remove("is-correct"));

        // Marque la bonne réponse (ou la réponse choisie si incorrecte)
        if (isCorrect) {
          option.classList.add("is-correct");
          if (feedbackTitle) feedbackTitle.textContent = successTitle;
        } else {
          if (feedbackTitle) feedbackTitle.textContent = "DOMMAGE";
        }

        feedback?.classList.add("is-visible");
      });
    });
  });

  const interviewsTrack = document.querySelector("[data-interviews-track]");
  const interviewSlides = Array.from(document.querySelectorAll("[data-interview-slide]"));
  const interviewButtons = document.querySelectorAll("[data-interview-nav]");
  let activeInterviewIndex = interviewSlides.findIndex((slide) =>
    slide.classList.contains("is-active")
  );

  if (activeInterviewIndex < 0) activeInterviewIndex = 0;

  const syncInterviewSlider = () => {
    interviewSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeInterviewIndex);
    });

    if (interviewsTrack) {
      interviewsTrack.style.transform = `translateX(-${activeInterviewIndex * 100}%)`;
    }
  };

  interviewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!interviewSlides.length) return;

      const direction = button.getAttribute("data-interview-nav") === "next" ? 1 : -1;
      activeInterviewIndex =
        (activeInterviewIndex + direction + interviewSlides.length) % interviewSlides.length;
      syncInterviewSlider();
    });
  });

  syncInterviewSlider();
});
