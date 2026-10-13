const { filterAndDeduplicate } = require('../common/filter.js');
const hub4k = require('../common/scrapers/hub4k.js');

async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    const raw = await hub4k.getStreams(tmdbId, mediaType, season, episode);
    return filterAndDeduplicate(raw);
  } catch (e) {
    console.error('[4KHDHub HD] Error:', e.message);
    return [];
  }
}

module.exports = { getStreams };
