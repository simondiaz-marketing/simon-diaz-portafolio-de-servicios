export class SearchManager {
    constructor() {
        this.overlay = document.getElementById('search-overlay');
        this.input = document.getElementById('search-input');
        this.resultsContainer = document.getElementById('search-results');
        this.closeBtn = document.getElementById('close-search');
        this.navBtn = document.getElementById('search-nav-btn');
        this.blogBtn = document.getElementById('search-blog-btn');
        this.blogPosts = [];
        this.youtubeVideos = [];

        this.init();
    }

    async init() {
        if (!this.overlay) return;

        // Fetch academic posts using relative path fallbacks for local file access
        this.blogPosts = await this.fetchRelativeJson('academic-posts.json') || [];

        // Try to get videos from the YouTube global state if available
        this.getYouTubeVideos();

        // Setup event listeners
        this.navBtn?.addEventListener('click', () => this.open());
        this.blogBtn?.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        this.input.addEventListener('input', () => this.performSearch());

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });
    }

    open() {
        this.getYouTubeVideos(); // Refresh video list in case they loaded late
        this.overlay.classList.add('active');
        this.overlay.style.display = 'flex';
        setTimeout(() => {
            this.overlay.style.opacity = '1';
            this.input.focus();
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.classList.remove('active');
            this.overlay.style.display = 'none';
            this.input.value = '';
            this.resultsContainer.innerHTML = '';
        }, 400);
        document.body.style.overflow = '';
    }

    async getYouTubeVideos() {
        this.youtubeVideos = []; // Clear to avoid duplicates
        const videoCards = document.querySelectorAll('.video-card');
        if (videoCards.length > 0) {
            videoCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent;
                const url = card.closest('a')?.href;
                if (title && url) {
                    this.youtubeVideos.push({
                        title,
                        description: 'Video Tutorial',
                        url,
                        badge: 'Video'
                    });
                }
            });
        } else {
            const videos = await this.fetchRelativeJson('sources_youtube.json');
            if (videos) {
                this.youtubeVideos = videos.map(video => ({
                    title: video.title,
                    description: 'Video Tutorial',
                    url: video.url || `https://www.youtube.com/watch?v=${video.id}`,
                    badge: 'Video'
                })).slice(0, 15);
            }
        }
    }

    async fetchRelativeJson(filename) {
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

    performSearch() {
        const query = this.input.value.toLowerCase().trim();
        if (query.length < 2) {
            this.resultsContainer.innerHTML = '';
            return;
        }

        const allItems = [...this.blogPosts, ...this.youtubeVideos];

        const filtered = allItems.filter(item => 
            item.title.toLowerCase().includes(query) || 
            (item.description && item.description.toLowerCase().includes(query))
        );

        this.renderResults(filtered);
    }

    renderResults(results) {
        this.resultsContainer.innerHTML = '';

        if (results.length === 0) {
            this.resultsContainer.innerHTML = '<p style="text-align:center; color:var(--text-dim);">No se encontraron resultados.</p>';
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement('a');
            
            let finalUrl = item.url;
            if (!item.url.startsWith('http')) {
                let cleanUrl = item.url.startsWith('/') ? item.url.slice(1) : item.url;
                if (!cleanUrl.endsWith('.html') && !cleanUrl.endsWith('/')) {
                    cleanUrl += '/index.html';
                } else if (cleanUrl.endsWith('/')) {
                    cleanUrl += 'index.html';
                }
                
                let prefix = "";
                const indexLink = document.querySelector('nav a[href*="index.html"]');
                if (indexLink) {
                    const href = indexLink.getAttribute('href');
                    if (href.startsWith('../../../')) {
                        prefix = '../../../';
                    } else if (href.startsWith('../../')) {
                        prefix = '../../';
                    } else if (href.startsWith('../')) {
                        prefix = '../';
                    }
                }
                finalUrl = prefix + cleanUrl;
            }
            
            resultItem.href = finalUrl;
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <div class="badge">${item.badge || 'Académico'}</div>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            `;

            this.resultsContainer.appendChild(resultItem);
        });
    }
}
