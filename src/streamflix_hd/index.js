const { filterAndDeduplicate } = require('../common/filter.js');
const streamflix = require('../common/scrapers/streamflix.js');

async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    const raw = await streamflix.getStreams(tmdbId, mediaType, season, episode);
    return filterAndDeduplicate(raw);
  } catch (e) {
    console.error('[StreamFlix HD] Error:', e.message);
    return [];
  }
}

module.exports = { getStreams };
