// Catalogue de vidéos pour la barre de recherche
const VIDEO_CATALOG = [
    { title: 'Ecofrost exporte la frite belge à travers le monde', tag: 'Label Eco', url: 'pagevideo.html' },
    { title: 'Labeléco : La Brasserie des Carrières, culture de l ancrage local', tag: 'Vidéos similaires', url: 'pagevideo.html' },
    { title: 'Labeléco : Bizzdev, l agence qui bouscule les codes', tag: 'Vidéos similaires', url: 'pagevideo.html' },
    { title: 'Labeléco : Dépôt Vrac, l esprit du circuit court bio', tag: 'Vidéos similaires', url: 'pagevideo.html' },
    { title: 'Pauline Jean - Directrice achat et matière première', tag: 'Reportages', url: 'pagevideo.html' },
    { title: 'Lauraline - Guide de visite', tag: 'Reportages', url: 'pagevideo.html' },
    { title: 'Antoine Van Wynsberghe - Agriculteur', tag: 'Reportages', url: 'pagevideo.html' },
    { title: 'Claire Hoflack - CEO', tag: 'Reportages', url: 'pagevideo.html' },
    { title: 'Olivier Maes - Production & R&D', tag: 'Reportages', url: 'pagevideo.html' },
    { title: 'Les coulisses de l usine Ecofrost à Péruwelz', tag: 'Reportage', url: 'pagevideo.html' },
    { title: 'Retour sur le live Label Eco - émission #01', tag: 'Live', url: 'pagevideo.html' },
];

function initSearch() {
    const input = document.getElementById('videoSearch');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    let activeIndex = -1;

    const escapeHtml = (str) => str.replace(/[&<>'"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[c]));

    const highlight = (text, query) => {
        if (!query) return escapeHtml(text);
        const regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        return escapeHtml(text).replace(regex, '<mark>$1</mark>');
    };

    const showResults = (query) => {
        results.innerHTML = '';
        activeIndex = -1;

        const q = query.trim().toLowerCase();
        if (!q) {
            results.hidden = true;
            return;
        }

        const matches = VIDEO_CATALOG.filter(v => v.title.toLowerCase().includes(q));

        if (matches.length === 0) {
            results.innerHTML = '<li class="search-no-result">Aucune vidéo trouvée</li>';
            results.hidden = false;
            return;
        }

        matches.forEach((video, i) => {
            const li = document.createElement('li');
            li.className = 'search-result-item';
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', 'false');
            li.dataset.url = video.url;
            li.innerHTML = '<span class="result-title">' + highlight(video.title, query.trim()) + '</span>' +
                           '<span class="result-tag">' + escapeHtml(video.tag) + '</span>';
            li.addEventListener('mousedown', (e) => {
                e.preventDefault();
                window.location.href = video.url;
            });
            results.appendChild(li);
        });

        results.hidden = false;
    };

    input.addEventListener('input', () => showResults(input.value));

    input.addEventListener('keydown', (e) => {
        const items = results.querySelectorAll('.search-result-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && items[activeIndex]) {
                window.location.href = items[activeIndex].dataset.url;
            }
            return;
        } else if (e.key === 'Escape') {
            results.hidden = true;
            activeIndex = -1;
            input.blur();
            return;
        } else {
            return;
        }

        items.forEach((item, i) => {
            const active = i === activeIndex;
            item.setAttribute('aria-selected', String(active));
        });

        if (activeIndex >= 0) items[activeIndex].scrollIntoView({ block: 'nearest' });
    });

    input.addEventListener('blur', () => {
        setTimeout(() => { results.hidden = true; activeIndex = -1; }, 150);
    });

    input.addEventListener('focus', () => {
        if (input.value.trim()) showResults(input.value);
    });
}

// Chapitrage: liste des temps et titres
const chapters = [
    {time:0, title:"Introduction - La frite belge qui s'exporte"},
    {time:130, title:'Une entreprise familiale devenue industrielle'},
    {time:267, title:'D\'où viennent les pommes de terre ?'},
    {time:438, title:'Dans les coulisses de l usine'},
    {time:600, title:'Une production a grande echelle'},
    {time:744, title:'Les frites belges a l international'},
    {time:924, title:'Impact economique et avenir d Ecofrost'}
];

const liveSeedComments = [
    { user: 'Maya', text: 'La réal est ultra clean, trop stylé.', time: '21:03' },
    { user: 'Noa', text: 'Le score impact qui monte c est satisfaisant.', time: '21:04' },
    { user: 'Lina', text: 'Ce format Label Eco parle vraiment à notre génération.', time: '21:05' }
];

function populateChapters() {
    const container = document.getElementById('chapterList');
    chapters.forEach(ch=>{
        const div = document.createElement('div');
        div.className='chapter-item';
        div.innerText = ch.title;
        div.onclick = () => seekTo(ch.time);
        container.appendChild(div);
    });
}

function seekTo(seconds) {
    const video = document.getElementById('videoPlayer');
    if (!video) return;

    video.currentTime = seconds;
    video.play().catch(() => {
        // Some browsers block autoplay after seek until user interaction.
    });
}

function setupThumbnail(video) {
    const capturePoster = () => {
        if (video.dataset.thumbSet) return;

        const seekToMiddle = () => {
            const mid = video.duration > 0 ? video.duration / 2 : 5;
            video.currentTime = mid;

            video.addEventListener('seeked', function onSeeked() {
                video.removeEventListener('seeked', onSeeked);
                if (video.dataset.thumbSet) return;
                video.dataset.thumbSet = 'true';

                // Capture the frame
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth || 320;
                    canvas.height = video.videoHeight || 180;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    video.poster = canvas.toDataURL('image/jpeg', 0.85);
                } catch (e) { /* cross-origin taint — poster stays empty */ }

                // Reset time display to 0:00
                video.currentTime = 0;
            }, { once: true });
        };

        if (Number.isFinite(video.duration) && video.duration > 0) {
            seekToMiddle();
        } else {
            video.addEventListener('loadedmetadata', seekToMiddle, { once: true });
        }
    };

    if (video._hls) {
        video._hls.on(Hls.Events.MANIFEST_PARSED, capturePoster);
    } else {
        video.addEventListener('loadedmetadata', capturePoster, { once: true });
    }
}

function attachStream(video, streamUrl) {
    if (!video || !streamUrl) {
        return;
    }

    if (video._hls) {
        video._hls.destroy();
        video._hls = null;
    }

    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        video._hls = hls;
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
    }
}

function initStreamVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
        if (video.dataset.streamSrc) {
            attachStream(video, video.dataset.streamSrc);
        }
        const isLive = video.id === 'liveFullscreenVideo';
        if (!isLive) {
            setupThumbnail(video);
        }
    });
}

function initSwipers() {
    const horizontalOptions = {
        direction: 'horizontal',
        slidesPerView: 1.2,
        spaceBetween: 15,
        nested: true,
        allowTouchMove: false,
        simulateTouch: false,
        touchStartPreventDefault: false,
        noSwipingSelector: 'video, video *, .clip-info, .clip-title, .clip-date',
        mousewheel: {
            forceToAxis: true,
            releaseOnEdges: true,
            sensitivity: 0.8,
            thresholdDelta: 12,
        },
        grabCursor: false,
        pagination: {
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    };

    new Swiper('.reportagesSwiper', {
        ...horizontalOptions,
        pagination: {
            ...horizontalOptions.pagination,
            el: '.reportagesSwiper .swiper-pagination',
        },
        navigation: {
            prevEl: '.reportages-prev',
            nextEl: '.reportages-next',
        },
    });

    new Swiper('.videosSwiper', {
        ...horizontalOptions,
        pagination: {
            ...horizontalOptions.pagination,
            el: '.videosSwiper .swiper-pagination',
        },
        navigation: {
            prevEl: '.videos-prev',
            nextEl: '.videos-next',
        },
    });
}

function initEcoPulse() {
    // Kept for structure consistency; score widget removed by request.
}

function renderLiveComment(container, comment) {
    const item = document.createElement('article');
    item.className = 'live-comment-item';

    const meta = document.createElement('div');
    meta.className = 'live-comment-meta';

    const user = document.createElement('strong');
    user.textContent = comment.user;

    const time = document.createElement('span');
    time.textContent = comment.time;

    const text = document.createElement('p');
    text.textContent = comment.text;

    meta.appendChild(user);
    meta.appendChild(time);
    item.appendChild(meta);
    item.appendChild(text);
    container.appendChild(item);
}

function initLiveComments() {
    const toggleBtn = document.getElementById('liveToggleBtn');
    const panel = document.getElementById('liveCommentsPanel');
    const status = document.getElementById('liveStatusText');
    const list = document.getElementById('liveCommentsList');
    const form = document.getElementById('liveCommentForm');
    const input = document.getElementById('liveCommentInput');
    const video = document.getElementById('videoPlayer');
    const liveFullscreenVideo = document.getElementById('liveFullscreenVideo');
    const liveMessage = document.getElementById('liveMessage');

    if (!toggleBtn || !panel || !status || !list || !form || !input || !video || !liveFullscreenVideo) {
        return;
    }

    const LIVE_DAY = 2; // Mardi (0 = dimanche)
    const LIVE_HOUR = 18;
    const LIVE_MINUTE = 30;

    const isLiveTime = () => {
        const now = new Date();
        const isTuesday = now.getDay() === LIVE_DAY;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const liveStartMinutes = LIVE_HOUR * 60 + LIVE_MINUTE;

        return isTuesday && currentMinutes >= liveStartMinutes;
    };

    // Update button label based on current time
    const updateButtonState = () => {
        if (isLiveTime()) {
            toggleBtn.textContent = 'Live en plein écran';
            toggleBtn.classList.remove('pre-live');
        } else {
            toggleBtn.textContent = 'Live mardi 18h30';
            toggleBtn.classList.add('pre-live');
        }
    };

    updateButtonState();
    // Re-check every minute in case the page stays open until mardi 18h30
    setInterval(updateButtonState, 60000);

    let liveActive = false;
    let hasSeeded = false;

    const activateLive = () => {
        liveActive = true;
        panel.hidden = false;
        toggleBtn.setAttribute('aria-pressed', 'true');
        toggleBtn.classList.add('is-live');
        toggleBtn.textContent = 'Live en plein écran';
        status.textContent = 'En direct avec la commu Label Eco';

        if (!hasSeeded) {
            liveSeedComments.forEach((comment) => {
                renderLiveComment(list, comment);
            });
            hasSeeded = true;
            list.scrollTop = list.scrollHeight;
        }
    };

    const openFullscreenLive = () => {
        if (!liveFullscreenVideo.src && !liveFullscreenVideo._hls) {
            attachStream(liveFullscreenVideo, liveFullscreenVideo.dataset.streamSrc);
        }

        video.pause();

        if (typeof liveFullscreenVideo.requestFullscreen === 'function') {
            liveFullscreenVideo.requestFullscreen().catch(() => {
                window.location.href = toggleBtn.getAttribute('href');
            });
            return;
        }

        if (typeof liveFullscreenVideo.webkitRequestFullscreen === 'function') {
            liveFullscreenVideo.webkitRequestFullscreen();
            return;
        }

        if (typeof liveFullscreenVideo.msRequestFullscreen === 'function') {
            liveFullscreenVideo.msRequestFullscreen();
            return;
        }

        if (typeof liveFullscreenVideo.webkitEnterFullscreen === 'function') {
            liveFullscreenVideo.webkitEnterFullscreen();
            return;
        }

        window.location.href = toggleBtn.getAttribute('href');
    };

    toggleBtn.addEventListener('click', (event) => {
        event.preventDefault();

        if (!isLiveTime()) {
            // Outside the live slot: show schedule message
            if (liveMessage) {
                liveMessage.hidden = false;
                liveMessage.textContent = 'Le live est disponible le mardi à 18h30.';
            }
            return;
        }

        // During the live slot: open fullscreen
        if (liveMessage) liveMessage.hidden = true;

        if (!liveActive) {
            activateLive();
        }

        status.textContent = 'Mode live activé: vidéo en plein écran';
        openFullscreenLive();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = input.value.trim();
        if (!message) {
            return;
        }

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        renderLiveComment(list, {
            user: 'Toi',
            text: message,
            time: hours + ':' + minutes
        });

        input.value = '';
        list.scrollTop = list.scrollHeight;
        status.textContent = 'Ton message vient d etre publié en live';
    });
}

function checkAnswer(isCorrect) {
    const result = document.getElementById('resultText');
    if (!result) {
        return;
    }

    if (isCorrect) {
        result.textContent = "BIEN JOUE ! T'es un vrai expert de l'economie locale.";
    } else {
        result.textContent = "Oups... Re-regarde le clip 'Impact' !";
    }

    result.style.color = 'white';
}

// Populate chapters once DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    initStreamVideos();
    populateChapters();
    initSwipers();
    initEcoPulse();
    initLiveComments();
    initSearch();
});
