/**
 * Nuvio HD Master - 全网 1080P/4K 超清视频源聚合器
 * 官方标准插件主入口
 */

const { filterAndDeduplicate } = require('../common/filter.js');
const vidrockScraper = require('../common/scrapers/vidrock.js');
const castleScraper = require('../common/scrapers/castle.js');
const hub4kScraper = require('../common/scrapers/hub4k.js');
const streamflixScraper = require('../common/scrapers/streamflix.js');

const TIMEOUT_MS = 15000; // 单源最大超时 15 秒

/**
 * 包装带有超时和容错的抓取请求
 */
function safeFetchStreams(scraper, name, tmdbId, mediaType, season, episode) {
  if (!scraper || typeof scraper.getStreams !== 'function') {
    return Promise.resolve([]);
  }

  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => {
      console.log(`[HD Master] ${name} timed out after ${TIMEOUT_MS / 1000}s`);
      resolve([]);
    }, TIMEOUT_MS);
  });

  const fetchPromise = Promise.resolve()
    .then(() => scraper.getStreams(tmdbId, mediaType, season, episode))
    .then(streams => {
      clearTimeout(timer);
      const count = Array.isArray(streams) ? streams.length : 0;
      console.log(`[HD Master] ${name} returned ${count} stream(s)`);
      return Array.isArray(streams) ? streams : [];
    })
    .catch(err => {
      clearTimeout(timer);
      console.log(`[HD Master] ${name} error: ${err.message}`);
      return [];
    });

  return Promise.race([fetchPromise, timeoutPromise]);
}

/**
 * Nuvio 官方插件主方法
 * @param {string} tmdbId TMDB 媒体 ID (如 '872585')
 * @param {'movie'|'tv'} mediaType 媒体类型
 * @param {number|null} season 季数 (电影为 null)
 * @param {number|null} episode 集数 (电影为 null)
 * @returns {Promise<Array>} 仅包含 1080P 及以上且去重后的视频源
 */
async function getStreams(tmdbId, mediaType, season, episode) {
  console.log(`[HD Master] Fetching 1080P+ streams for TMDB: ${tmdbId}, Type: ${mediaType}, S:${season||1}E:${episode||1}`);

  try {
    // 并行请求所有已验证的高清数据源
    const sources = [
      safeFetchStreams(vidrockScraper, 'VidRock', tmdbId, mediaType, season, episode),
      safeFetchStreams(castleScraper, 'Castle', tmdbId, mediaType, season, episode),
      safeFetchStreams(hub4kScraper, '4KHDHub', tmdbId, mediaType, season, episode),
      safeFetchStreams(streamflixScraper, 'StreamFlix', tmdbId, mediaType, season, episode)
    ];

    const results = await Promise.all(sources);
    const rawStreams = results.flat();
    console.log(`[HD Master] Total raw streams gathered: ${rawStreams.length}`);

    // 执行严格的 1080P+ 筛选与全网去重
    const finalStreams = filterAndDeduplicate(rawStreams);
    console.log(`[HD Master] ✅ Final filtered & deduplicated 1080P/4K streams: ${finalStreams.length}`);

    return finalStreams;
  } catch (error) {
    console.error(`[HD Master] Unexpected error: ${error.message}`);
    return [];
  }
}

module.exports = { getStreams };
