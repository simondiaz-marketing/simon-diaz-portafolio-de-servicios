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
            <a href="${url}" target="_blank" class="card-link" style="text-decoration: none;">
                <div class="card video-card" style="display: flex; flex-direction: column; height: 100%;">
                    <div class="video-container" style="position: relative; width: 100%; padding-top: 56.25%; overflow: hidden; border-radius: 12px; background: #000; margin-bottom: 1rem;">
                        <img src="${thumbnail}" alt="${title}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onerror="this.src='../assets/img/perfil.jpg'">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; background: rgba(0, 0, 0, 0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(0,242,255,0.4);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f2ff" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                    </div>
                    <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem; color: #fff; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${title}</h3>
                    <p style="color: var(--accent-primary); font-size: 0.9rem; font-weight: 600; margin-top: auto;">Míralo ahora en YouTube &rarr;</p>
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
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="color: var(--text-dim); font-size: 1.1rem; margin-bottom: 1.5rem;">Visita nuestro canal para explorar todos los videos y tutoriales.</p>
            <a href="https://www.youtube.com/@simondiaz.marketingdigital" target="_blank" class="cta-button" style="text-decoration: none;">Ir al Canal de YouTube</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', fetchLatestVideos);
