async function fetchLatestVideos() {
    let videos = [];
    
    // 1. Try Vercel Serverless API first
    try {
        const response = await fetch('/api/youtube');
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                videos = data.items;
            }
        }
    } catch (e) {
        console.warn('Serverless API /api/youtube not available:', e);
    }

    // 2. Fallback to local JSON sources if API is not configured or failed
    if (!videos || videos.length === 0) {
        videos = await fetchRelativeJson('sources_youtube.json') || [];
    }

    if (videos && videos.length > 0) {
        renderVideos(videos);
    } else {
        renderFallbackMessage();
    }
}

async function fetchRelativeJson(filename) {
    const candidates = [
        `data/${filename}`,
        `../data/${filename}`,
        `../../data/${filename}`,
        `../../../data/${filename}`
    ];
    for (const path of candidates) {
        try {
            const res = await fetch(path);
            if (res.ok) return await res.json();
        } catch (e) {}
    }
    return null;
}

function renderVideos(videos) {
    const grid = document.querySelector('#youtube-gallery') || document.querySelector('#videos .grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    videos.forEach(video => {
        let videoId = '';
        let title = video.title || (video.snippet && video.snippet.title) || 'Video Tutorial';
        let thumbnail = '';
        let url = video.url;

        if (video.snippet) {
            // Live YouTube API object format
            videoId = typeof video.id === 'string' ? video.id : (video.id && video.id.videoId);
            thumbnail = video.snippet.thumbnails ? (video.snippet.thumbnails.medium ? video.snippet.thumbnails.medium.url : video.snippet.thumbnails.default.url) : '';
            if (!url && videoId) url = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
            // Local JSON format
            if (video.id && !video.id.includes('-')) {
                videoId = video.id;
            }
            if (!url && videoId) {
                url = `https://www.youtube.com/watch?v=${videoId}`;
            } else if (!url) {
                url = 'https://www.youtube.com/@simondiaz.marketingdigital';
            }
            if (videoId) {
                thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            } else {
                thumbnail = '../assets/img/perfil.jpg';
            }
        }

        if (!thumbnail && videoId) {
            thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
        
        const cardHTML = `
            <a href="${url}" target="_blank" class="card-link youtube-card-link">
                <div class="card video-card youtube-video-card">
                    <div class="video-container youtube-video-container">
                        <img src="${thumbnail}" alt="${title}" class="youtube-video-thumbnail" onerror="this.src='../assets/img/perfil.jpg'">
                        <div class="youtube-play-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f2ff" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                    </div>
                    <h3 class="youtube-video-title">${title}</h3>
                    <p class="youtube-video-cta">Míralo ahora en YouTube &rarr;</p>
                </div>
            </a>
        `;
        
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    if (window.initCardEffects) {
        const newCards = grid.querySelectorAll('.card');
        newCards.forEach(card => window.initCardEffects(card));
    }
}

function renderFallbackMessage() {
    const grid = document.querySelector('#youtube-gallery') || document.querySelector('#videos .grid');
    if (!grid) return;
    grid.innerHTML = `
        <div class="youtube-fallback-container">
            <p class="youtube-fallback-text">Visita nuestro canal para explorar todos los videos y tutoriales.</p>
            <a href="https://www.youtube.com/@simondiaz.marketingdigital" target="_blank" class="cta-button youtube-fallback-btn">Ir al Canal de YouTube</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', fetchLatestVideos);
