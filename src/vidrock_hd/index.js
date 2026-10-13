const { filterAndDeduplicate } = require('../common/filter.js');
const vidrock = require('../common/scrapers/vidrock.js');

async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    const raw = await vidrock.getStreams(tmdbId, mediaType, season, episode);
    return filterAndDeduplicate(raw);
  } catch (e) {
    console.error('[VidRock HD] Error:', e.message);
    return [];
  }
}

module.exports = { getStreams };
