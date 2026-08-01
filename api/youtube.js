export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Evitar caché estática agresiva: refrescar en Vercel Edge cada 60 segundos
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  // En Vercel, las variables de entorno se leen de process.env
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = 'UCRjEetcMz3rKhFAEQJN-Jag';

  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API Key no está configurada en Vercel' });
  }

  try {
    // Aumentar maxResults a 50 para obtener una muestra amplia de videos recientes
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.error) {
      return res.status(500).json({ error: searchData.error.message });
    }

    if (searchData.items && searchData.items.length > 0) {
      const videoIds = searchData.items.map(item => item.id.videoId).filter(Boolean).join(',');
      
      if (!videoIds) {
        return res.status(200).json({ items: [] });
      }

      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,snippet`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      if (!detailsData.items) {
        return res.status(200).json({ items: [] });
      }
      
      const isShort = (duration) => {
        if (!duration) return false;
        if (duration.includes('H')) return false;
        const minutesMatch = duration.match(/(\d+)M/);
        const secondsMatch = duration.match(/(\d+)S/);
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
        const totalSeconds = (minutes * 60) + seconds;
        return totalSeconds < 120; // Filtrar videos de formato corto (menos de 2 minutos / 120 segundos)
      };

      const videos = detailsData.items.filter(video => {
        const duration = video.contentDetails ? video.contentDetails.duration : '';
        return !isShort(duration);
      }).slice(0, 15); // Mostrar los 15 videos más recientes

      return res.status(200).json({ items: videos });
    }

    return res.status(200).json({ items: [] });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los videos de YouTube: ' + error.message });
  }
}
