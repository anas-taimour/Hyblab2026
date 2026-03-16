const quizQuestions = document.querySelectorAll("[data-quiz-question]");

function resetQuiz() {
    quizQuestions.forEach((question) => {
        const answers = question.querySelectorAll("[data-quiz-answer]");
        const feedback = question.querySelector("[data-quiz-feedback]");
        const feedbackBody = question.querySelector("[data-quiz-feedback-text]");
        answers.forEach((item) => item.classList.remove("is-selected"));
        if (feedback) feedback.hidden = true;
        if (feedbackBody) feedbackBody.textContent = "";
        answers.forEach((answerBtn) => {
            answerBtn.style.scale = "1";
            answerBtn.classList.remove("light_blurred");
        });
    });
}

function displayScroll(id) {
    const scrollable = document.getElementById(id);
    scrollable.classList.remove("slide-out", "slide-in");
    scrollable.style.display = "block";
    scrollable.scrollTop = 0;

    if (window.carouselState) {
        window.carouselState.activeIndex = 0;
        window.carouselState.activeFactIndex = 0;
        window.carouselState.activeDidYouKnowIndex = 0;
    }
    if (window.syncCarousel) window.syncCarousel();
    if (window.syncFactsCarousel) window.syncFactsCarousel();
    if (window.syncDidYouKnowCarousel) window.syncDidYouKnowCarousel();

    resetQuiz();

    void scrollable.offsetWidth;
    scrollable.classList.add("slide-in");

    const header = document.querySelector("header");
    header.classList.add("blurred");
    const main = document.querySelector("main");
    main.classList.add("blurred");

    if (window.initWavesurfers) {
        window.initWavesurfers();
    } else {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }
}

function hideScroll(id) {
    const scrollable = document.getElementById(id);
    scrollable.classList.remove("slide-in");
    scrollable.classList.add("slide-out");

    const header = document.querySelector("header");
    header.classList.remove("blurred");
    const main = document.querySelector("main");
    main.classList.remove("blurred");

    scrollable.addEventListener("animationend", () => {
        scrollable.scrollTop = 0;

        if (window.carouselState) {
            window.carouselState.activeIndex = 0;
            window.carouselState.activeFactIndex = 0;
            window.carouselState.activeDidYouKnowIndex = 0;
        }
        if (window.syncCarousel) window.syncCarousel();
        if (window.syncFactsCarousel) window.syncFactsCarousel();
        if (window.syncDidYouKnowCarousel) window.syncDidYouKnowCarousel();

        resetQuiz();

        scrollable.style.display = "none";
        scrollable.classList.remove("slide-out");
    }, { once: true });
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    if (requestedView === "company") {
        displayScroll("scrollable_page");
    }
});

window.addEventListener('mouseup', function (event) {
    var scrollable = document.getElementById('scrollable_page');
    var scrollable_2 = document.getElementById('scrollable_page_2');
    const isVisible = scrollable && getComputedStyle(scrollable).display !== "none";
    const isVisible_2 = scrollable_2 && getComputedStyle(scrollable_2).display !== "none";
    if (!isVisible && !isVisible_2) return;
    if (isVisible && !event.target.closest("#scrollable_page") && !event.target.closest(".entreprisePin")) {
        hideScroll('scrollable_page');
    }
    if (isVisible_2 && !event.target.closest("#scrollable_page_2")) {
        hideScroll('scrollable_page_2');
    }
});