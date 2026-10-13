const { filterAndDeduplicate } = require('../common/filter.js');
const castle = require('../common/scrapers/castle.js');

async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    const raw = await castle.getStreams(tmdbId, mediaType, season, episode);
    return filterAndDeduplicate(raw);
  } catch (e) {
    console.error('[Castle HD] Error:', e.message);
    return [];
  }
}

module.exports = { getStreams };
