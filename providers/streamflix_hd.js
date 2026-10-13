/**
 * streamflix_hd - Built for Nuvio (1080P+ Only)
 * Generated: 2026-10-13T12:49:27.869Z
 */
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/common/filter.js
var require_filter = __commonJS({
  "src/common/filter.js"(exports2, module2) {
    function analyzeQuality(stream) {
      if (!stream || !stream.url) {
        return { valid: false, quality: "invalid", rank: 0 };
      }
      const rawQuality = String(stream.quality || "").trim();
      const qLower = rawQuality.toLowerCase();
      const nameLower = String(stream.name || "").toLowerCase().replace(/4khdhub/g, "").replace(/4k-hdhub/g, "");
      const titleLower = String(stream.title || "").toLowerCase();
      const urlLower = String(stream.url || "").toLowerCase();
      if (["4k", "2160p", "2160", "uhd"].some((k) => qLower === k || qLower.startsWith("2160") || qLower.startsWith("4k"))) {
        return { valid: true, quality: "4K", rank: 2160 };
      }
      if (["1440p", "1440", "2k"].some((k) => qLower === k || qLower.startsWith("1440"))) {
        return { valid: true, quality: "1440p", rank: 1440 };
      }
      if (["1080p", "1080", "fhd", "1080i"].some((k) => qLower === k || qLower.startsWith("1080"))) {
        return { valid: true, quality: "1080p", rank: 1080 };
      }
      const lowQualities = ["720p", "720", "480p", "480", "360p", "360", "240p", "240", "sd", "cam", "ts", "telesync", "hdts", "dvdrip"];
      if (lowQualities.some((k) => qLower.includes(k))) {
        return { valid: false, quality: qLower, rank: 0 };
      }
      if (/\b(4k|2160p|2160)\b/i.test(nameLower) || /\b(4k|2160p|2160)\b/i.test(titleLower)) {
        return { valid: true, quality: "4K", rank: 2160 };
      }
      if (/\b(1440p|1440|2k)\b/i.test(nameLower) || /\b(1440p|1440|2k)\b/i.test(titleLower)) {
        return { valid: true, quality: "1440p", rank: 1440 };
      }
      if (/\b(1080p|1080|fhd)\b/i.test(nameLower) || /\b(1080p|1080|fhd)\b/i.test(titleLower)) {
        return { valid: true, quality: "1080p", rank: 1080 };
      }
      if (/(2160p|4k|\b2160\b)/i.test(urlLower)) {
        return { valid: true, quality: "4K", rank: 2160 };
      }
      if (/(1080p|fhd|\b1080\b)/i.test(urlLower)) {
        return { valid: true, quality: "1080p", rank: 1080 };
      }
      if (urlLower.includes("master.m3u8") && !lowQualities.some((k) => nameLower.includes(k) || urlLower.includes(k))) {
        return { valid: true, quality: "1080p", rank: 1080 };
      }
      return { valid: false, quality: qLower || "unknown", rank: 0 };
    }
    function getCanonicalUrlKey(url) {
      if (!url)
        return "";
      try {
        const trimmed = String(url).trim();
        const qIndex = trimmed.indexOf("?");
        if (qIndex === -1)
          return trimmed;
        const base = trimmed.substring(0, qIndex);
        return base;
      } catch (e) {
        return url;
      }
    }
    function filterAndDeduplicate2(streams) {
      if (!Array.isArray(streams) || streams.length === 0) {
        return [];
      }
      const seenUrls = /* @__PURE__ */ new Set();
      const seenCanonicalKeys = /* @__PURE__ */ new Set();
      const filtered = [];
      for (const stream of streams) {
        if (!stream || !stream.url)
          continue;
        const qualityInfo = analyzeQuality(stream);
        if (!qualityInfo.valid || qualityInfo.rank < 1080) {
          continue;
        }
        const rawUrl = String(stream.url).trim();
        if (seenUrls.has(rawUrl)) {
          continue;
        }
        const canonicalKey = getCanonicalUrlKey(rawUrl);
        if (canonicalKey && canonicalKey.length > 20 && seenCanonicalKeys.has(canonicalKey)) {
          continue;
        }
        seenUrls.add(rawUrl);
        if (canonicalKey) {
          seenCanonicalKeys.add(canonicalKey);
        }
        filtered.push({
          name: stream.name || "HD Stream",
          title: stream.title || "HD Video",
          url: rawUrl,
          quality: qualityInfo.quality,
          size: stream.size,
          headers: stream.headers || void 0,
          subtitles: Array.isArray(stream.subtitles) ? stream.subtitles : void 0,
          _rank: qualityInfo.rank
        });
      }
      filtered.sort((a, b) => (b._rank || 0) - (a._rank || 0));
      return filtered.map((s) => {
        const res = Object.assign({}, s);
        delete res._rank;
        return res;
      });
    }
    module2.exports = {
      analyzeQuality,
      filterAndDeduplicate: filterAndDeduplicate2
    };
  }
});

// src/common/scrapers/streamflix.js
var require_streamflix = __commonJS({
  "src/common/scrapers/streamflix.js"(exports2, module2) {
    var cheerio = require("cheerio-without-node-native");
    var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
    var STREAMFLIX_API_BASE = "https://api.streamflix.app";
    var CONFIG_URL = `${STREAMFLIX_API_BASE}/config/config-streamflixapp.json`;
    var DATA_URL = `${STREAMFLIX_API_BASE}/data.json`;
    var cache = {
      config: null,
      configTimestamp: 0,
      data: null,
      dataTimestamp: 0
    };
    var CACHE_TTL = 1e3 * 60 * 5;
    function makeRequest(url, options = {}) {
      const defaultHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive"
      };
      return fetch(url, __spreadProps(__spreadValues({}, options), {
        headers: __spreadValues(__spreadValues({}, defaultHeaders), options.headers)
      })).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
      });
    }
    function getConfig() {
      const now = Date.now();
      if (cache.config && now - cache.configTimestamp < CACHE_TTL) {
        return Promise.resolve(cache.config);
      }
      console.log("[StreamFlix] Fetching config data...");
      return makeRequest(CONFIG_URL).then((response) => response.json()).then((json) => {
        cache.config = json;
        cache.configTimestamp = now;
        console.log("[StreamFlix] Config data cached successfully");
        return json;
      }).catch((error) => {
        console.error("[StreamFlix] Failed to fetch config:", error.message);
        throw error;
      });
    }
    function getData() {
      const now = Date.now();
      if (cache.data && now - cache.dataTimestamp < CACHE_TTL) {
        return Promise.resolve(cache.data);
      }
      console.log("[StreamFlix] Fetching data...");
      return makeRequest(DATA_URL).then((response) => response.json()).then((json) => {
        cache.data = json;
        cache.dataTimestamp = now;
        console.log("[StreamFlix] Data cached successfully");
        return json;
      }).catch((error) => {
        console.error("[StreamFlix] Failed to fetch data:", error.message);
        throw error;
      });
    }
    function searchContent(title, year, mediaType) {
      console.log(`[StreamFlix] Searching for: "${title}" (${year})`);
      return getData().then((data) => {
        if (!data || !data.data) {
          throw new Error("Invalid data structure received");
        }
        const searchQuery = title.toLowerCase();
        const results = data.data.filter((item) => {
          if (!item.moviename)
            return false;
          const itemTitle = item.moviename.toLowerCase();
          const titleWords = searchQuery.split(/\s+/);
          return titleWords.every((word) => itemTitle.includes(word));
        });
        console.log(`[StreamFlix] Found ${results.length} search results`);
        return results;
      });
    }
    function findBestMatch(targetTitle, results) {
      if (!results || results.length === 0) {
        return null;
      }
      let bestMatch = null;
      let bestScore = 0;
      for (const result of results) {
        const score = calculateSimilarity(
          targetTitle.toLowerCase(),
          result.moviename.toLowerCase()
        );
        if (score > bestScore) {
          bestScore = score;
          bestMatch = result;
        }
      }
      console.log(`[StreamFlix] Best match: "${bestMatch == null ? void 0 : bestMatch.moviename}" (score: ${bestScore.toFixed(2)})`);
      return bestMatch;
    }
    function calculateSimilarity(str1, str2) {
      const words1 = str1.split(/\s+/);
      const words2 = str2.split(/\s+/);
      let matches = 0;
      for (const word of words1) {
        if (word.length > 2 && words2.some((w) => w.includes(word) || word.includes(w))) {
          matches++;
        }
      }
      return matches / Math.max(words1.length, words2.length);
    }
    function getEpisodesFromWebSocket(movieKey, totalSeasons = 1) {
      return new Promise((resolve, reject) => {
        let WSImpl = null;
        try {
          WSImpl = typeof WebSocket !== "undefined" ? WebSocket : require("ws");
        } catch (e) {
          WSImpl = null;
        }
        if (!WSImpl) {
          return reject(new Error("WebSocket implementation not available"));
        }
        const ws = new WSImpl(
          "wss://chilflix-410be-default-rtdb.asia-southeast1.firebasedatabase.app/.ws?ns=chilflix-410be-default-rtdb&v=5"
        );
        const seasonsData = {};
        let currentSeason = 1;
        let completedSeasons = 0;
        let messageBuffer = "";
        let expectedResponses = 0;
        let responsesReceived = 0;
        const overallTimeout = setTimeout(() => {
          try {
            ws.close();
          } catch (e) {
          }
          reject(new Error("WebSocket timeout"));
        }, 3e4);
        function sendSeasonRequest(season) {
          const payload = {
            t: "d",
            d: { a: "q", r: season, b: { p: `Data/${movieKey}/seasons/${season}/episodes`, h: "" } }
          };
          try {
            ws.send(JSON.stringify(payload));
          } catch (e) {
          }
        }
        ws.onopen = function() {
          sendSeasonRequest(currentSeason);
        };
        ws.onmessage = function(evt) {
          try {
            const message = typeof evt.data === "string" ? evt.data : evt.data.toString();
            if (/^\d+$/.test(message.trim())) {
              expectedResponses = parseInt(message.trim(), 10);
              responsesReceived = 0;
              return;
            }
            messageBuffer += message;
            try {
              const data = JSON.parse(messageBuffer);
              messageBuffer = "";
              if (data.t === "c") {
                return;
              }
              if (data.t === "d") {
                const d_data = data.d || {};
                const b_data = d_data.b || {};
                if (d_data.r === currentSeason && b_data.s === "ok") {
                  completedSeasons++;
                  if (completedSeasons < totalSeasons) {
                    currentSeason++;
                    expectedResponses = 0;
                    responsesReceived = 0;
                    sendSeasonRequest(currentSeason);
                  } else {
                    clearTimeout(overallTimeout);
                    try {
                      ws.close();
                    } catch (e) {
                    }
                    resolve(seasonsData);
                  }
                  return;
                }
                if (b_data.d) {
                  const episodes = b_data.d;
                  const seasonEpisodes = seasonsData[currentSeason] || {};
                  for (const [epKey, epData] of Object.entries(episodes)) {
                    if (epData && typeof epData === "object") {
                      seasonEpisodes[parseInt(epKey, 10)] = {
                        key: epData.key,
                        link: epData.link,
                        name: epData.name,
                        overview: epData.overview,
                        runtime: epData.runtime,
                        still_path: epData.still_path,
                        vote_average: epData.vote_average
                      };
                      responsesReceived++;
                    }
                  }
                  seasonsData[currentSeason] = seasonEpisodes;
                }
              }
            } catch (e) {
              if (messageBuffer.length > 1e5) {
                messageBuffer = "";
              }
            }
          } catch (err) {
          }
        };
        ws.onerror = function(err) {
          clearTimeout(overallTimeout);
          reject(new Error("WebSocket error"));
        };
        ws.onclose = function() {
          clearTimeout(overallTimeout);
        };
      });
    }
    function getStreams2(tmdbId, mediaType = "movie", seasonNum = null, episodeNum = null) {
      console.log(`[StreamFlix] Fetching streams for TMDB ID: ${tmdbId}, Type: ${mediaType}`);
      if (seasonNum !== null) {
        console.log(`[StreamFlix] Season: ${seasonNum}, Episode: ${episodeNum}`);
      }
      const tmdbUrl = `https://api.themoviedb.org/3/${mediaType === "tv" ? "tv" : "movie"}/${tmdbId}?api_key=${TMDB_API_KEY}`;
      return makeRequest(tmdbUrl).then((response) => response.json()).then((tmdbData) => {
        var _a, _b;
        const title = mediaType === "tv" ? tmdbData.name : tmdbData.title;
        const year = mediaType === "tv" ? (_a = tmdbData.first_air_date) == null ? void 0 : _a.substring(0, 4) : (_b = tmdbData.release_date) == null ? void 0 : _b.substring(0, 4);
        if (!title) {
          throw new Error("Could not extract title from TMDB response");
        }
        console.log(`[StreamFlix] TMDB Info: "${title}" (${year})`);
        return searchContent(title, year, mediaType).then((searchResults) => {
          if (searchResults.length === 0) {
            console.log("[StreamFlix] No search results found");
            return [];
          }
          const selectedResult = findBestMatch(title, searchResults);
          if (!selectedResult) {
            console.log("[StreamFlix] No suitable match found");
            return [];
          }
          return getConfig().then((config) => {
            if (mediaType === "movie") {
              return processMovieStreams(selectedResult, config);
            } else {
              return processTVStreams(selectedResult, config, seasonNum, episodeNum);
            }
          });
        });
      }).catch((error) => {
        console.error(`[StreamFlix] Error in getStreams: ${error.message}`);
        return [];
      });
    }
    function processMovieStreams(movieData, config) {
      console.log(`[StreamFlix] Processing movie streams for: ${movieData.moviename}`);
      const streams = [];
      if (config.premium && movieData.movielink) {
        config.premium.forEach((baseUrl, index) => {
          const streamUrl = `${baseUrl}${movieData.movielink}`;
          streams.push({
            name: "StreamFlix",
            title: `${movieData.moviename} - Premium Quality`,
            url: streamUrl,
            quality: "1080p",
            size: movieData.movieduration || "Unknown",
            type: "direct",
            headers: {
              "Referer": "https://api.streamflix.app",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
          });
        });
      }
      if (config.movies && movieData.movielink) {
        config.movies.forEach((baseUrl, index) => {
          const streamUrl = `${baseUrl}${movieData.movielink}`;
          streams.push({
            name: "StreamFlix",
            title: `${movieData.moviename} - Standard Quality`,
            url: streamUrl,
            quality: "720p",
            size: movieData.movieduration || "Unknown",
            type: "direct",
            headers: {
              "Referer": "https://api.streamflix.app",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
          });
        });
      }
      console.log(`[StreamFlix] Generated ${streams.length} movie streams`);
      return streams;
    }
    function processTVStreams(tvData, config, seasonNum, episodeNum) {
      var _a;
      console.log(`[StreamFlix] Processing TV streams for: ${tvData.moviename}`);
      const seasonMatch = (_a = tvData.movieduration) == null ? void 0 : _a.match(/(\d+)\s+Season/);
      const totalSeasons = seasonMatch ? parseInt(seasonMatch[1]) : 1;
      return getEpisodesFromWebSocket(tvData.moviekey, totalSeasons).then((seasonsData) => {
        const streams = [];
        if (seasonNum !== null && episodeNum !== null) {
          const seasonData = seasonsData[seasonNum];
          if (seasonData) {
            const episodeData = seasonData[episodeNum - 1];
            if (episodeData && config.premium) {
              config.premium.forEach((baseUrl) => {
                const streamUrl = `${baseUrl}${episodeData.link}`;
                streams.push({
                  name: "StreamFlix",
                  title: `${tvData.moviename} S${seasonNum}E${episodeNum} - ${episodeData.name}`,
                  url: streamUrl,
                  quality: "1080p",
                  size: episodeData.runtime ? `${episodeData.runtime}min` : "Unknown",
                  type: "direct",
                  headers: {
                    "Referer": "https://api.streamflix.app",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                  }
                });
              });
            }
          }
        } else {
          for (const [season, episodes] of Object.entries(seasonsData)) {
            for (const [epIndex, episodeData] of Object.entries(episodes)) {
              if (config.premium && episodeData.link) {
                const epNum = parseInt(epIndex) + 1;
                config.premium.forEach((baseUrl) => {
                  const streamUrl = `${baseUrl}${episodeData.link}`;
                  streams.push({
                    name: "StreamFlix",
                    title: `${tvData.moviename} S${season}E${epNum} - ${episodeData.name}`,
                    url: streamUrl,
                    quality: "1080p",
                    size: episodeData.runtime ? `${episodeData.runtime}min` : "Unknown",
                    type: "direct",
                    headers: {
                      "Referer": "https://api.streamflix.app",
                      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                    }
                  });
                });
              }
            }
          }
        }
        if (streams.length === 0 && config.premium && seasonNum !== null && episodeNum !== null) {
          const fallbackUrl = `${config.premium[0]}tv/${tvData.moviekey}/s${seasonNum}/episode${episodeNum}.mkv`;
          streams.push({
            name: "StreamFlix",
            title: `${tvData.moviename} S${seasonNum}E${episodeNum} (Fallback)`,
            url: fallbackUrl,
            quality: "720p",
            size: "Unknown",
            type: "direct",
            headers: {
              "Referer": "https://api.streamflix.app",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
          });
        }
        console.log(`[StreamFlix] Generated ${streams.length} TV streams`);
        return streams;
      }).catch((error) => {
        console.error("[StreamFlix] WebSocket failed, using fallback:", error.message);
        if (config.premium && seasonNum !== null && episodeNum !== null) {
          const fallbackUrl = `${config.premium[0]}tv/${tvData.moviekey}/s${seasonNum}/episode${episodeNum}.mkv`;
          return [{
            name: "StreamFlix",
            title: `${tvData.moviename} S${seasonNum}E${episodeNum} (Fallback)`,
            url: fallbackUrl,
            quality: "720p",
            size: "Unknown",
            type: "direct",
            headers: {
              "Referer": "https://api.streamflix.app",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
          }];
        }
        return [];
      });
    }
    if (typeof module2 !== "undefined" && module2.exports) {
      module2.exports = { getStreams: getStreams2 };
    } else {
      global.getStreams = getStreams2;
    }
  }
});

// src/streamflix_hd/index.js
var { filterAndDeduplicate } = require_filter();
var streamflix = require_streamflix();
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      const raw = yield streamflix.getStreams(tmdbId, mediaType, season, episode);
      return filterAndDeduplicate(raw);
    } catch (e) {
      console.error("[StreamFlix HD] Error:", e.message);
      return [];
    }
  });
}
module.exports = { getStreams };
