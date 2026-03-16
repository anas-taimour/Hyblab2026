const videoIntro = document.getElementById('video-intro');
const videoPlayer = document.getElementById('intro-player');

videoPlayer.onended = function() {
    videoIntro.classList.add('fade-out');
    
    setTimeout(() => {
        videoIntro.remove();
    }, 300); 
};

// 2. Sécurité : Si la vidéo met trop de temps à charger (ex: 5s), on l'enlève
setTimeout(() => {
    if (!videoIntro.classList.contains('fade-out')) {
        videoIntro.classList.add('fade-out');
    }
}, 4000);