/**
 * hdmaster - Built for Nuvio (1080P+ Only)
 * Generated: 2026-10-13T12:49:27.859Z
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

// src/common/scrapers/vidrock.js
var require_vidrock = __commonJS({
  "src/common/scrapers/vidrock.js"(exports2, module2) {
    var _0x1fe5d1 = _0x4bc9;
    (function(_0x4d1f37, _0x16f41e) {
      const _0x3685b1 = { _0x59e8b2: 521, _0x57eaee: 522, _0x3a5874: 472, _0x1483f1: 442, _0x3e927b: 505, _0x5b1802: 497 }, _0x2b3656 = _0x4bc9, _0x59699b = _0x4d1f37();
      while (!![]) {
        try {
          const _0x3f710f = -parseInt(_0x2b3656(_0x3685b1._0x59e8b2)) / 1 * (-parseInt(_0x2b3656(_0x3685b1._0x57eaee)) / 2) + parseInt(_0x2b3656(469)) / 3 + parseInt(_0x2b3656(520)) / 4 + -parseInt(_0x2b3656(_0x3685b1._0x3a5874)) / 5 + parseInt(_0x2b3656(509)) / 6 + -parseInt(_0x2b3656(_0x3685b1._0x1483f1)) / 7 + parseInt(_0x2b3656(_0x3685b1._0x3e927b)) / 8 * (parseInt(_0x2b3656(_0x3685b1._0x5b1802)) / 9);
          if (_0x3f710f === _0x16f41e)
            break;
          else
            _0x59699b["push"](_0x59699b["shift"]());
        } catch (_0x4e1889) {
          _0x59699b["push"](_0x59699b["shift"]());
        }
      }
    })(_0x572c, 744100);
    var __async2 = (_0x71bf3e, _0x848029, _0x295487) => {
      const _0x5dd5e2 = { _0xfaf840: 496 };
      return new Promise((_0x509e39, _0x24f765) => {
        const _0x437b18 = _0x4bc9;
        var _0x4d0e59 = (_0x1442ff) => {
          try {
            _0x259a66(_0x295487["next"](_0x1442ff));
          } catch (_0x3ccd12) {
            _0x24f765(_0x3ccd12);
          }
        }, _0x2f55ce = (_0x215a54) => {
          try {
            _0x259a66(_0x295487["throw"](_0x215a54));
          } catch (_0x3d309b) {
            _0x24f765(_0x3d309b);
          }
        }, _0x259a66 = (_0x30c04b) => _0x30c04b["done"] ? _0x509e39(_0x30c04b[_0x437b18(451)]) : Promise["resolve"](_0x30c04b["value"])["then"](_0x4d0e59, _0x2f55ce);
        _0x259a66((_0x295487 = _0x295487[_0x437b18(_0x5dd5e2._0xfaf840)](_0x71bf3e, _0x848029))[_0x437b18(482)]());
      });
    };
    var TMDB_API_KEY = "1865f43a0549ca50d341dd9ab8b29f49";
    var DOMAINS_URL = "https://raw.githubusercontent.com/sapariyaneel/nuvio-plugin/refs/heads/main/domains.json";
    var FALLBACK_BASE_URL = _0x1fe5d1(462);
    var HEADERS = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36", "Referer": "https://vidrock.net/", "Origin": "https://vidrock.net" };
    var STREAM_KEY_HEX = _0x1fe5d1(493);
    var GCM_IV_LENGTH = 12;
    var GCM_TAG_LENGTH = 16;
    var cachedDomains = null;
    function getDomains() {
      return __async2(this, null, function* () {
        if (cachedDomains)
          return cachedDomains;
        try {
          const _0x31cfa9 = yield fetch(DOMAINS_URL, { "skipSizeCheck": !![] });
          cachedDomains = yield _0x31cfa9["json"]();
        } catch (_0x5dd86f) {
          cachedDomains = {};
        }
        return cachedDomains;
      });
    }
    function getBaseUrl() {
      const _0x56c01a = { _0xd90b24: 453 };
      return __async2(this, null, function* () {
        const _0x3a37b5 = _0x4bc9, _0x4a7d5a = yield getDomains();
        return (_0x4a7d5a[_0x3a37b5(_0x56c01a._0xd90b24)] || FALLBACK_BASE_URL)["replace"](/\/+$/, "");
      });
    }
    var AES_SBOX = new Uint8Array(256);
    var AES_RCON = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77];
    (function buildSbox() {
      const _0x3b8e24 = new Uint8Array(256), _0x5ea36a = new Uint8Array(256);
      let _0x3daa25 = 1;
      for (let _0x5674eb = 0; _0x5674eb < 256; _0x5674eb++) {
        _0x3b8e24[_0x5674eb] = _0x3daa25, _0x5ea36a[_0x3daa25] = _0x5674eb, _0x3daa25 = (_0x3daa25 ^ _0x3daa25 << 1 & 255 ^ (_0x3daa25 & 128 ? 27 : 0)) & 255;
      }
      AES_SBOX[0] = 99;
      for (let _0x271f6e = 1; _0x271f6e < 256; _0x271f6e++) {
        const _0x513533 = _0x3b8e24[(255 - _0x5ea36a[_0x271f6e]) % 255];
        let _0x4f1e9c = _0x513533, _0xb3dec8 = _0x513533;
        for (let _0x21f7a0 = 0; _0x21f7a0 < 4; _0x21f7a0++) {
          _0xb3dec8 = (_0xb3dec8 << 1 | _0xb3dec8 >>> 7) & 255, _0x4f1e9c ^= _0xb3dec8;
        }
        AES_SBOX[_0x271f6e] = (_0x4f1e9c ^ 99) & 255;
      }
    })();
    function gfMultiply(_0x4b6f7d, _0x51574) {
      let _0x50ed16 = 0;
      while (_0x51574) {
        if (_0x51574 & 1)
          _0x50ed16 ^= _0x4b6f7d;
        _0x4b6f7d = (_0x4b6f7d << 1 ^ (_0x4b6f7d & 128 ? 27 : 0)) & 255, _0x51574 >>= 1;
      }
      return _0x50ed16 & 255;
    }
    function expandAesKey(_0x984572) {
      const _0x4e598b = { _0x4fd0d7: 444 }, _0x567301 = _0x1fe5d1, _0x8af7c = _0x984572["length"] / 4, _0x3d4701 = _0x8af7c + 6, _0x16d034 = new Uint8Array(16 * (_0x3d4701 + 1));
      _0x16d034[_0x567301(_0x4e598b._0x4fd0d7)](_0x984572);
      for (let _0x574071 = _0x8af7c; _0x574071 < 4 * (_0x3d4701 + 1); _0x574071++) {
        let _0x1d08a2 = _0x16d034[(_0x574071 - 1) * 4], _0x3f33f7 = _0x16d034[(_0x574071 - 1) * 4 + 1], _0xc7a1d1 = _0x16d034[(_0x574071 - 1) * 4 + 2], _0x377233 = _0x16d034[(_0x574071 - 1) * 4 + 3];
        if (_0x574071 % _0x8af7c === 0) {
          const _0x1db76f = _0x1d08a2;
          _0x1d08a2 = AES_SBOX[_0x3f33f7] ^ AES_RCON[_0x574071 / _0x8af7c - 1], _0x3f33f7 = AES_SBOX[_0xc7a1d1], _0xc7a1d1 = AES_SBOX[_0x377233], _0x377233 = AES_SBOX[_0x1db76f];
        } else
          _0x8af7c > 6 && _0x574071 % _0x8af7c === 4 && (_0x1d08a2 = AES_SBOX[_0x1d08a2], _0x3f33f7 = AES_SBOX[_0x3f33f7], _0xc7a1d1 = AES_SBOX[_0xc7a1d1], _0x377233 = AES_SBOX[_0x377233]);
        _0x16d034[_0x574071 * 4] = _0x16d034[(_0x574071 - _0x8af7c) * 4] ^ _0x1d08a2, _0x16d034[_0x574071 * 4 + 1] = _0x16d034[(_0x574071 - _0x8af7c) * 4 + 1] ^ _0x3f33f7, _0x16d034[_0x574071 * 4 + 2] = _0x16d034[(_0x574071 - _0x8af7c) * 4 + 2] ^ _0xc7a1d1, _0x16d034[_0x574071 * 4 + 3] = _0x16d034[(_0x574071 - _0x8af7c) * 4 + 3] ^ _0x377233;
      }
      return { "schedule": _0x16d034, "rounds": _0x3d4701 };
    }
    function aesEncryptBlock(_0x2124c4, _0x214902) {
      const _0x35a129 = _0x1fe5d1, _0x585c9b = _0x214902[_0x35a129(448)], _0x5682cd = _0x214902["rounds"];
      for (let _0x3c3d16 = 0; _0x3c3d16 < 16; _0x3c3d16++)
        _0x2124c4[_0x3c3d16] ^= _0x585c9b[_0x3c3d16];
      for (let _0x2adac6 = 1; _0x2adac6 <= _0x5682cd; _0x2adac6++) {
        for (let _0x12af79 = 0; _0x12af79 < 16; _0x12af79++)
          _0x2124c4[_0x12af79] = AES_SBOX[_0x2124c4[_0x12af79]];
        let _0x76a664 = _0x2124c4[1];
        _0x2124c4[1] = _0x2124c4[5], _0x2124c4[5] = _0x2124c4[9], _0x2124c4[9] = _0x2124c4[13], _0x2124c4[13] = _0x76a664, _0x76a664 = _0x2124c4[2], _0x2124c4[2] = _0x2124c4[10], _0x2124c4[10] = _0x76a664, _0x76a664 = _0x2124c4[6], _0x2124c4[6] = _0x2124c4[14], _0x2124c4[14] = _0x76a664, _0x76a664 = _0x2124c4[15], _0x2124c4[15] = _0x2124c4[11], _0x2124c4[11] = _0x2124c4[7], _0x2124c4[7] = _0x2124c4[3], _0x2124c4[3] = _0x76a664;
        if (_0x2adac6 !== _0x5682cd)
          for (let _0x191786 = 0; _0x191786 < 4; _0x191786++) {
            const _0x2eb2cf = _0x191786 * 4, _0x421510 = _0x2124c4[_0x2eb2cf], _0x28eef1 = _0x2124c4[_0x2eb2cf + 1], _0xa79a51 = _0x2124c4[_0x2eb2cf + 2], _0x28328e = _0x2124c4[_0x2eb2cf + 3];
            _0x2124c4[_0x2eb2cf] = gfMultiply(_0x421510, 2) ^ gfMultiply(_0x28eef1, 3) ^ _0xa79a51 ^ _0x28328e, _0x2124c4[_0x2eb2cf + 1] = _0x421510 ^ gfMultiply(_0x28eef1, 2) ^ gfMultiply(_0xa79a51, 3) ^ _0x28328e, _0x2124c4[_0x2eb2cf + 2] = _0x421510 ^ _0x28eef1 ^ gfMultiply(_0xa79a51, 2) ^ gfMultiply(_0x28328e, 3), _0x2124c4[_0x2eb2cf + 3] = gfMultiply(_0x421510, 3) ^ _0x28eef1 ^ _0xa79a51 ^ gfMultiply(_0x28328e, 2);
          }
        for (let _0x4b80ae = 0; _0x4b80ae < 16; _0x4b80ae++)
          _0x2124c4[_0x4b80ae] ^= _0x585c9b[_0x2adac6 * 16 + _0x4b80ae];
      }
      return _0x2124c4;
    }
    function hexToBytes(_0x1899d1) {
      const _0x7e6335 = { _0x378705: 464, _0xcf0461: 465 }, _0x134aac = _0x1fe5d1, _0x4d954a = new Uint8Array(_0x1899d1[_0x134aac(_0x7e6335._0x378705)] / 2);
      for (let _0x35c52a = 0; _0x35c52a < _0x4d954a[_0x134aac(464)]; _0x35c52a++)
        _0x4d954a[_0x35c52a] = parseInt(_0x1899d1[_0x134aac(_0x7e6335._0xcf0461)](_0x35c52a * 2, 2), 16);
      return _0x4d954a;
    }
    var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function base64UrlToBytes(_0x16b088) {
      const _0x4d672b = { _0x4eac83: 494, _0x568143: 491 }, _0x30dce2 = _0x1fe5d1, _0x36b81a = _0x16b088[_0x30dce2(_0x4d672b._0x4eac83)](/-/g, "+")["replace"](/_/g, "/")["replace"](/=+$/, ""), _0x24ad0e = new Uint8Array(Math[_0x30dce2(456)](_0x36b81a["length"] * 3 / 4));
      let _0x4d1415 = 0, _0x180ac2 = 0, _0x328558 = 0;
      for (let _0x31a74a = 0; _0x31a74a < _0x36b81a[_0x30dce2(464)]; _0x31a74a++) {
        const _0x37c629 = BASE64_CHARS[_0x30dce2(483)](_0x36b81a[_0x30dce2(_0x4d672b._0x568143)](_0x31a74a));
        if (_0x37c629 < 0)
          continue;
        _0x4d1415 = _0x4d1415 << 6 | _0x37c629, _0x180ac2 += 6, _0x180ac2 >= 8 && (_0x180ac2 -= 8, _0x24ad0e[_0x328558++] = _0x4d1415 >> _0x180ac2 & 255);
      }
      return _0x24ad0e[_0x30dce2(478)](0, _0x328558);
    }
    function utf8BytesToString(_0x4d1596) {
      const _0x818024 = { _0x5dadb2: 445, _0x5cc641: 445 }, _0x397132 = _0x1fe5d1;
      let _0x347bd5 = "", _0x2e323e = 0;
      while (_0x2e323e < _0x4d1596["length"]) {
        const _0xaaffb1 = _0x4d1596[_0x2e323e++];
        if (_0xaaffb1 < 128)
          _0x347bd5 += String[_0x397132(445)](_0xaaffb1);
        else {
          if ((_0xaaffb1 & 224) === 192) {
            const _0x387e2d = _0x4d1596[_0x2e323e++];
            _0x347bd5 += String[_0x397132(_0x818024._0x5dadb2)]((_0xaaffb1 & 31) << 6 | _0x387e2d & 63);
          } else {
            if ((_0xaaffb1 & 240) === 224) {
              const _0x23e84d = _0x4d1596[_0x2e323e++], _0x4a3746 = _0x4d1596[_0x2e323e++];
              _0x347bd5 += String[_0x397132(_0x818024._0x5cc641)]((_0xaaffb1 & 15) << 12 | (_0x23e84d & 63) << 6 | _0x4a3746 & 63);
            } else {
              if ((_0xaaffb1 & 248) === 240) {
                const _0xf5024 = _0x4d1596[_0x2e323e++], _0x2eef9d = _0x4d1596[_0x2e323e++], _0x5e490e = _0x4d1596[_0x2e323e++];
                let _0x3c1773 = (_0xaaffb1 & 7) << 18 | (_0xf5024 & 63) << 12 | (_0x2eef9d & 63) << 6 | _0x5e490e & 63;
                _0x3c1773 -= 65536, _0x347bd5 += String[_0x397132(445)](55296 + (_0x3c1773 >> 10), 56320 + (_0x3c1773 & 1023));
              } else
                _0x347bd5 += String[_0x397132(_0x818024._0x5dadb2)](_0xaaffb1);
            }
          }
        }
      }
      return _0x347bd5;
    }
    var cachedKeySchedule = null;
    function decryptStreamUrl(_0x1930c4) {
      const _0x73fcef = { _0x40a395: 464, _0x4b4cff: 511, _0x237901: 478, _0x185743: 464, _0xad3736: 444, _0x14f194: 444 }, _0x5c1319 = _0x1fe5d1, _0x303644 = base64UrlToBytes(_0x1930c4);
      if (_0x303644[_0x5c1319(_0x73fcef._0x40a395)] <= GCM_IV_LENGTH + GCM_TAG_LENGTH)
        throw new Error(_0x5c1319(_0x73fcef._0x4b4cff));
      if (!cachedKeySchedule)
        cachedKeySchedule = expandAesKey(hexToBytes(STREAM_KEY_HEX));
      const _0x24d318 = _0x303644[_0x5c1319(_0x73fcef._0x237901)](GCM_IV_LENGTH, _0x303644["length"] - GCM_TAG_LENGTH), _0x3a682b = new Uint8Array(_0x24d318[_0x5c1319(_0x73fcef._0x185743)]), _0x6a12bc = new Uint8Array(16);
      _0x6a12bc[_0x5c1319(_0x73fcef._0xad3736)](_0x303644["subarray"](0, GCM_IV_LENGTH), 0);
      let _0x41fd7f = 2;
      for (let _0x437543 = 0; _0x437543 < _0x24d318["length"]; _0x437543 += 16) {
        _0x6a12bc[12] = _0x41fd7f >>> 24 & 255, _0x6a12bc[13] = _0x41fd7f >>> 16 & 255, _0x6a12bc[14] = _0x41fd7f >>> 8 & 255, _0x6a12bc[15] = _0x41fd7f & 255;
        const _0x7cf49 = new Uint8Array(16);
        _0x7cf49[_0x5c1319(_0x73fcef._0x14f194)](_0x6a12bc), aesEncryptBlock(_0x7cf49, cachedKeySchedule);
        const _0x31e8b3 = Math["min"](16, _0x24d318["length"] - _0x437543);
        for (let _0x407a13 = 0; _0x407a13 < _0x31e8b3; _0x407a13++)
          _0x3a682b[_0x437543 + _0x407a13] = _0x24d318[_0x437543 + _0x407a13] ^ _0x7cf49[_0x407a13];
        _0x41fd7f++;
      }
      return utf8BytesToString(_0x3a682b);
    }
    function getProviderEmoji(_0x4aecb7) {
      const _0x288c5c = { _0x36d251: 470 }, _0x571c8c = _0x1fe5d1, _0x58e89b = String(_0x4aecb7)[_0x571c8c(480)]();
      if (_0x58e89b[_0x571c8c(447)]("astra"))
        return "\u{1FA90}";
      if (_0x58e89b["includes"](_0x571c8c(_0x288c5c._0x36d251)))
        return "\u{1F300}";
      if (_0x58e89b["includes"]("orion"))
        return "\u{1F3AF}";
      return "\u{1F30D}";
    }
    function buildDropdownMetadata(_0x1b2034, _0x1685fb, _0x30ab22, _0x380bec, _0x122369, _0x1951dd) {
      const _0x2c6b10 = { _0x1a6c45: 480, _0x19f481: 452, _0x591ea7: 466, _0x252352: 458, _0x4fa76a: 487, _0x224d91: 517, _0x3d649c: 515 }, _0x4c827d = _0x1fe5d1;
      let _0x23f32a = String(_0x1b2034)[_0x4c827d(494)](/\s*(1080p\s+)?server\s*2\s*$/gi, "")["trim"](), _0x3efdca = _0x1685fb[_0x4c827d(_0x2c6b10._0x1a6c45)]()["trim"]() === "auto" ? _0x4c827d(500) : _0x1685fb, _0x4bce57 = _0x4c827d(_0x2c6b10._0x19f481) + _0x3efdca;
      const _0x2e073b = _0x3efdca["toLowerCase"]();
      if (_0x2e073b["includes"]("2160") || _0x2e073b[_0x4c827d(447)]("4k"))
        _0x4bce57 = "\u{1F31F} 2160p";
      else {
        if (_0x2e073b["includes"](_0x4c827d(504)))
          _0x4bce57 = _0x4c827d(443);
        else {
          if (_0x2e073b["includes"]("720"))
            _0x4bce57 = _0x4c827d(_0x2c6b10._0x591ea7);
          else
            _0x2e073b === _0x4c827d(_0x2c6b10._0x252352) && (_0x4bce57 = _0x4c827d(475));
        }
      }
      const _0x155180 = _0x30ab22[_0x4c827d(_0x2c6b10._0x4fa76a)] || "90 min", _0x2af7d0 = _0x1951dd[_0x4c827d(447)](".m3u8") ? "\u{1F4E1} M3U8" : "\u{1F39E}\uFE0F MP4", _0x27642e = getProviderEmoji(_0x23f32a), _0x5118c3 = _0x30ab22[_0x4c827d(517)] ? "(" + _0x30ab22[_0x4c827d(_0x2c6b10._0x224d91)] + ")" : _0x4c827d(474);
      let _0x37c442 = _0x4c827d(499) + (_0x30ab22["title"] || _0x4c827d(459)) + _0x4c827d(523) + _0x5118c3;
      return _0x380bec && _0x122369 && (_0x37c442 += " | S" + _0x380bec + "E" + _0x122369), _0x37c442 + "\n" + _0x4bce57 + " | \u{1F30D} Original Audio | \u{1F3A7} AAC\n" + _0x2af7d0 + _0x4c827d(_0x2c6b10._0x3d649c) + _0x155180 + "\n" + _0x27642e + " " + _0x23f32a + " | \u{1F517} Provider: VidRock";
    }
    function fetchTmdbDetails(_0x414fc0, _0x4b28e9, _0x5a3c22, _0x43e357) {
      const _0x17568a = { _0x7c037e: 461, _0x20009e: 481, _0x4dacb6: 474, _0x87ea79: 489, _0x4b27d4: 486, _0x1f1961: 488, _0x49f6cc: 489 };
      return __async2(this, null, function* () {
        const _0x442096 = _0x4bc9;
        try {
          const _0x4f1f04 = _0x4b28e9 === "tv" ? "tv" : _0x442096(_0x17568a._0x7c037e), _0x3d054c = _0x442096(_0x17568a._0x20009e) + _0x4f1f04 + "/" + _0x414fc0 + "?api_key=" + TMDB_API_KEY, _0x3256c1 = yield fetch(_0x3d054c, { "skipSizeCheck": !![] });
          if (!_0x3256c1["ok"])
            return { "title": "Unknown", "year": _0x442096(_0x17568a._0x4dacb6), "runtime": _0x442096(_0x17568a._0x87ea79) };
          const _0x1be7fb = yield _0x3256c1[_0x442096(516)]();
          let _0x4099c9 = _0x1be7fb["runtime"];
          if (_0x4b28e9 === "tv")
            try {
              const _0x31f9ad = "https://api.themoviedb.org/3/tv/" + _0x414fc0 + "/season/" + (_0x5a3c22 || 1) + "/episode/" + (_0x43e357 || 1) + _0x442096(467) + TMDB_API_KEY, _0x2daf41 = yield fetch(_0x31f9ad, { "skipSizeCheck": !![] });
              if (_0x2daf41["ok"]) {
                const _0x13c96d = yield _0x2daf41["json"]();
                if (_0x13c96d["runtime"])
                  _0x4099c9 = _0x13c96d["runtime"];
              }
            } catch (_0x2b0e5b) {
            }
          const _0x5d6e19 = _0x4099c9 ? _0x4099c9 + " min" : _0x4b28e9 === "tv" ? "45 min" : _0x442096(489);
          return { "title": _0x4b28e9 === "tv" ? _0x1be7fb["name"] : _0x1be7fb[_0x442096(512)], "year": (_0x4b28e9 === "tv" ? _0x1be7fb[_0x442096(_0x17568a._0x4b27d4)] : _0x1be7fb[_0x442096(508)] || "")[_0x442096(_0x17568a._0x1f1961)](0, 4), "runtime": _0x5d6e19 };
        } catch (_0x2411c3) {
          return { "title": "Unknown", "year": "N/A", "runtime": _0x442096(_0x17568a._0x49f6cc) };
        }
      });
    }
    function _0x572c() {
      const _0x1e9e36 = ["AgvPz2H0", "Bw92Awu", "Ahr0Chm6lY92AwrYB2nRlM5LDa", "DhjPBq", "BgvUz3rO", "C3vIC3rY", "8j+BSo+4JYa3mJbW", "p2fWAv9RzxK9", "l2fWAs8", "mtK4nJeYt2PRBMLs", "yxrSyxm", "mtq0mha", "nZe2mJuYmhHfv2TQEa", "C3rHCNrZv2L0Aa", "tI9b", "8j+BUcbbDxrV", "z2v0u3rYzwfTCW", "zxjYB3i", "C3vIyxjYyxK", "D2LKDgG", "Dg9mB3DLCKnHC2u", "Ahr0Chm6lY9HCgKUDgHLBw92AwvKyI5VCMCVmY8", "BMv4Da", "Aw5KzxHpzG", "BwfW", "DgvZDa", "zMLYC3rFywLYx2rHDgu", "CNvUDgLTzq", "C3vIC3rYAw5N", "otaGBwLU", "DhyV", "y2HHCKf0", "Bw92AwuV", "n2yZztLJmMe4yJvKmwy0ztzHowmZyJDKmMu1zJHHmwm0yJzKowuYzJvHogmXyJrKn2u5zJjHnwm4yJfKngu3zG", "CMvWBgfJzq", "mta4mha", "yxbWBhK", "nte3mdvzEwvHwxK", "jMv4DgvYBMfSx3nVDxjJzt1PBwrIx2LK", "8j+oRca", "qxv0BW", "x3jHD1f1ywXPDhK", "ChvZAa", "zMLSDgvY", "mta4ma", "mti4ChHzCxjK", "C29YDa", "AxngAw5PDgu", "CMvSzwfZzv9KyxrL", "nZyXnJm2neTJqvDlqq", "B2jQzwn0", "y2LWAgvYDgv4Dcb0B28GC2HVCNq", "DgL0Bgu", "Bwf0y2G", "DhzFCMvZDwX0CW", "ihWG4PQHihGYlJy0ihWG4O+X77Ipia", "ANnVBG", "EwvHCG", "DxjS", "x3nLCNzLCKTLEq", "nZaZmde2uenwDuXJ", "mtu2m29Ksu5myq", "odC0tu9NrffH", "ic0G", "nZy3odKZEM9nAK5A", "8j+AGcaXmdGWCa", "C2v0", "zNjVBunOyxjdB2rL", "i0vyvc1ylvnuuKvbts1jtKy", "Aw5JBhvKzxm", "C2nOzwr1Bgu", "nZiWCa", "ihWG", "DMfSDwu", "8j+sJIa", "DMLKCM9JAW", "8j+QQcbwAwrsB2nRihWG", "Bw92AwvFCMvZDwX0CW", "zMXVB3i", "ywXS", "yxv0BW", "vw5RBM93BG"];
      _0x572c = function() {
        return _0x1e9e36;
      };
      return _0x572c();
    }
    function qualityLabelFromResolution(_0x5b0136, _0x3a1a7c) {
      const _0x574d14 = { _0x32110d: 449 }, _0x3b3856 = _0x1fe5d1;
      if (_0x5b0136 >= 3200 || _0x3a1a7c >= 2e3)
        return "4K";
      if (_0x5b0136 >= 2400 || _0x3a1a7c >= 1400)
        return _0x3b3856(471);
      if (_0x5b0136 >= 1800 || _0x3a1a7c >= 1e3)
        return _0x3b3856(495);
      if (_0x5b0136 >= 1200 || _0x3a1a7c >= 700)
        return _0x3b3856(_0x574d14._0x32110d);
      if (_0x5b0136 >= 800 || _0x3a1a7c >= 460)
        return "480p";
      if (_0x5b0136 >= 600 || _0x3a1a7c >= 340)
        return "360p";
      if (_0x5b0136 > 0 || _0x3a1a7c > 0)
        return "240p";
      return "Unknown";
    }
    function qualityRank(_0x21ec49) {
      const _0x20c445 = _0x1fe5d1;
      if (_0x21ec49 === "4K" || _0x21ec49 === "2160p")
        return 2160;
      const _0x9a31e3 = parseInt(_0x21ec49, 10);
      return Number[_0x20c445(507)](_0x9a31e3) ? _0x9a31e3 : 0;
    }
    function _0x4bc9(_0x5d2ca0, _0x21ec7d) {
      _0x5d2ca0 = _0x5d2ca0 - 442;
      const _0x572c89 = _0x572c();
      let _0x4bc90d = _0x572c89[_0x5d2ca0];
      if (_0x4bc9["avSWUS"] === void 0) {
        var _0x3ac810 = function(_0x38d5b9) {
          const _0x55f4c3 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
          let _0x71bf3e = "", _0x848029 = "";
          for (let _0x295487 = 0, _0x509e39, _0x24f765, _0x4d0e59 = 0; _0x24f765 = _0x38d5b9["charAt"](_0x4d0e59++); ~_0x24f765 && (_0x509e39 = _0x295487 % 4 ? _0x509e39 * 64 + _0x24f765 : _0x24f765, _0x295487++ % 4) ? _0x71bf3e += String["fromCharCode"](255 & _0x509e39 >> (-2 * _0x295487 & 6)) : 0) {
            _0x24f765 = _0x55f4c3["indexOf"](_0x24f765);
          }
          for (let _0x2f55ce = 0, _0x259a66 = _0x71bf3e["length"]; _0x2f55ce < _0x259a66; _0x2f55ce++) {
            _0x848029 += "%" + ("00" + _0x71bf3e["charCodeAt"](_0x2f55ce)["toString"](16))["slice"](-2);
          }
          return decodeURIComponent(_0x848029);
        };
        _0x4bc9["LgHTfy"] = _0x3ac810, _0x4bc9["tzrBYr"] = {}, _0x4bc9["avSWUS"] = !![];
      }
      const _0x48df73 = _0x572c89[0], _0x3874d7 = _0x5d2ca0 + _0x48df73, _0x1eed62 = _0x4bc9["tzrBYr"][_0x3874d7];
      return !_0x1eed62 ? (_0x4bc90d = _0x4bc9["LgHTfy"](_0x4bc90d), _0x4bc9["tzrBYr"][_0x3874d7] = _0x4bc90d) : _0x4bc90d = _0x1eed62, _0x4bc90d;
    }
    function resolveUrl(_0x518797, _0x1e945f) {
      try {
        return new URL(_0x518797, _0x1e945f)["toString"]();
      } catch (_0x101b48) {
        return _0x518797;
      }
    }
    function parseMasterTopVariant(_0x2d2d5d, _0x4aacf0) {
      const _0x572859 = { _0x4abe39: 473 }, _0x4fb67e = _0x1fe5d1, _0x27fa2c = _0x2d2d5d["split"]("\n")[_0x4fb67e(484)]((_0x414af2) => _0x414af2[_0x4fb67e(463)]());
      let _0x43eaa3 = null;
      for (let _0x384214 = 0; _0x384214 < _0x27fa2c["length"]; _0x384214++) {
        if (!_0x27fa2c[_0x384214][_0x4fb67e(_0x572859._0x4abe39)](_0x4fb67e(446)))
          continue;
        const _0xcc470d = _0x27fa2c[_0x384214 + 1];
        if (!_0xcc470d || _0xcc470d[_0x4fb67e(473)]("#"))
          continue;
        const _0x2f53af = _0x27fa2c[_0x384214]["match"](/BANDWIDTH=(\d+)/), _0xf90a3d = _0x27fa2c[_0x384214][_0x4fb67e(513)](/RESOLUTION=(\d+)x(\d+)/), _0x255f7f = _0x2f53af ? parseInt(_0x2f53af[1], 10) : 0, _0x3766a5 = _0xf90a3d ? parseInt(_0xf90a3d[1], 10) : 0, _0x1f28a9 = _0xf90a3d ? parseInt(_0xf90a3d[2], 10) : 0;
        (!_0x43eaa3 || _0x255f7f > _0x43eaa3["bandwidth"]) && (_0x43eaa3 = { "url": resolveUrl(_0xcc470d, _0x4aacf0), "bandwidth": _0x255f7f, "width": _0x3766a5, "height": _0x1f28a9 });
      }
      return _0x43eaa3;
    }
    function buildStream(_0x54c020, _0x4536c0, _0x3dac81, _0x59316c, _0x49ae21) {
      const _0x11ef00 = { _0x31b5c9: 460, _0x5b352d: 450 };
      return __async2(this, null, function* () {
        const _0x4912a3 = _0x4bc9;
        try {
          const _0xba5a64 = decryptStreamUrl(_0x4536c0["url"]);
          if (!/^https?:\/\//i[_0x4912a3(485)](_0xba5a64))
            return null;
          const _0xeef186 = yield fetch(_0xba5a64, { "headers": HEADERS, "skipSizeCheck": !![] });
          if (!_0xeef186["ok"])
            return null;
          const _0x23892f = parseMasterTopVariant(yield _0xeef186["text"](), _0xba5a64);
          if (!_0x23892f)
            return null;
          const _0x8be275 = qualityLabelFromResolution(_0x23892f[_0x4912a3(479)], _0x23892f[_0x4912a3(_0x11ef00._0x31b5c9)]);
          let _0x40441c = String(_0x54c020)["replace"](/\s*(1080p\s+)?server\s*2\s*$/gi, "")["trim"]();
          const _0x13810b = getProviderEmoji(_0x40441c), _0x39e45c = buildDropdownMetadata(_0x54c020, _0x8be275, _0x3dac81, _0x59316c, _0x49ae21, _0xba5a64);
          return { "name": _0x4912a3(454) + _0x8be275 + _0x4912a3(_0x11ef00._0x5b352d) + _0x13810b + " [" + _0x40441c + "]", "title": _0x39e45c, "size": _0x39e45c, "description": _0x39e45c, "url": _0xba5a64, "quality": "", "language": "", "headers": HEADERS, "provider": "vidrock", "subtitles": [], "_serverKey": _0x54c020, "_rawQuality": _0x8be275 };
        } catch (_0x4cd41c) {
          return null;
        }
      });
    }
    function getStreams2(_0x57e554, _0x22a367, _0x1507d9, _0x99159c) {
      const _0x388b9c = { _0x2cf0d6: 498, _0x286ec1: 490, _0x3b4c45: 492, _0x54ae95: 468, _0x34ce41: 516, _0x5361ba: 510, _0x3ff251: 464, _0x45cb98: 457, _0x1315de: 477 }, _0x1bc882 = { _0x1a78e4: 501 };
      return __async2(this, null, function* () {
        const _0x297011 = _0x4bc9;
        try {
          let _0x5ab710 = _0x57e554;
          if (typeof _0x57e554 === "string" && _0x57e554[_0x297011(463)]()["toLowerCase"]()[_0x297011(473)]("tt")) {
            const _0x4d49e1 = "https://api.themoviedb.org/3/find/" + _0x57e554 + _0x297011(467) + TMDB_API_KEY + _0x297011(_0x388b9c._0x2cf0d6), _0x216290 = yield (yield fetch(_0x4d49e1, { "skipSizeCheck": !![] }))[_0x297011(516)](), _0x2b085c = _0x22a367 === "tv" ? _0x216290[_0x297011(514)] : _0x216290[_0x297011(455)];
            _0x5ab710 = _0x2b085c && _0x2b085c["length"] ? _0x2b085c[0]["id"] : null;
            if (!_0x5ab710)
              return [];
          }
          _0x5ab710 = parseInt(_0x5ab710, 10);
          if (!_0x5ab710)
            return [];
          const _0x3f57e8 = yield getBaseUrl(), _0x14e400 = _0x22a367 === "tv", _0x57e68a = _0x14e400 ? _0x297011(_0x388b9c._0x286ec1) + _0x5ab710 + "/" + (_0x1507d9 || 1) + "/" + (_0x99159c || 1) : _0x297011(_0x388b9c._0x3b4c45) + _0x5ab710, _0x407a94 = yield fetch(_0x3f57e8 + _0x297011(_0x388b9c._0x54ae95) + _0x57e68a, { "headers": HEADERS, "skipSizeCheck": !![] });
          if (!_0x407a94["ok"])
            return [];
          const _0x541513 = yield _0x407a94[_0x297011(_0x388b9c._0x34ce41)]()["catch"](() => null);
          if (!_0x541513 || typeof _0x541513 !== _0x297011(_0x388b9c._0x5361ba) || _0x541513["error"])
            return [];
          const _0x502643 = Object["keys"](_0x541513)["map"]((_0x1b714d) => ({ "name": _0x1b714d, "entry": _0x541513[_0x1b714d] }))[_0x297011(503)]((_0x3aab67) => _0x3aab67["entry"] && typeof _0x3aab67["entry"] === "object" && _0x3aab67["entry"][_0x297011(518)]);
          if (!_0x502643[_0x297011(_0x388b9c._0x3ff251)])
            return [];
          const _0x46fbd9 = yield fetchTmdbDetails(_0x5ab710, _0x22a367, _0x1507d9, _0x99159c), _0xaee8cb = yield Promise[_0x297011(_0x388b9c._0x45cb98)](_0x502643[_0x297011(484)]((_0x2701c0) => buildStream(_0x2701c0["name"], _0x2701c0["entry"], _0x46fbd9, _0x1507d9, _0x99159c))), _0x237251 = {}, _0xacb16e = [];
          for (const _0xd63a7c of _0xaee8cb) {
            if (!_0xd63a7c || _0x237251[_0xd63a7c[_0x297011(518)]])
              continue;
            _0x237251[_0xd63a7c["url"]] = !![], _0xacb16e[_0x297011(502)](_0xd63a7c);
          }
          return _0xacb16e[_0x297011(506)]((_0x4bcfeb, _0x1ca243) => {
            const _0xbf3736 = _0x297011, _0x48a624 = String(_0x4bcfeb[_0xbf3736(519)] || "")["toLowerCase"](), _0x1dd722 = String(_0x1ca243["_serverKey"] || "")[_0xbf3736(480)]();
            if (_0x48a624 !== _0x1dd722)
              return _0x48a624["localeCompare"](_0x1dd722);
            return qualityRank(_0x1ca243[_0xbf3736(501)]) - qualityRank(_0x4bcfeb[_0xbf3736(_0x1bc882._0x1a78e4)]);
          }), _0xacb16e;
        } catch (_0x35acd5) {
          return console[_0x297011(_0x388b9c._0x1315de)]("[Vidrock]", _0x35acd5), [];
        }
      });
    }
    typeof module2 !== "undefined" && module2["exports"] ? module2["exports"] = { "getStreams": getStreams2 } : global[_0x1fe5d1(476)] = getStreams2;
  }
});

// src/common/scrapers/castle.js
var require_castle = __commonJS({
  "src/common/scrapers/castle.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues2 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp2.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      if (__getOwnPropSymbols2)
        for (var prop of __getOwnPropSymbols2(b)) {
          if (__propIsEnum2.call(b, prop))
            __defNormalProp2(a, prop, b[prop]);
        }
      return a;
    };
    var __async2 = (__this, __arguments, generator) => {
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
    var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
    var TMDB_BASE_URL = "https://api.themoviedb.org/3";
    var CASTLE_BASE = "https://api.hlowb.com";
    var PKG = "com.external.castle";
    var CHANNEL = "IndiaA";
    var CLIENT = "1";
    var LANG = "en-US";
    var API_HEADERS = {
      "User-Agent": "okhttp/4.9.3",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Connection": "Keep-Alive",
      "Referer": CASTLE_BASE
    };
    var PLAYBACK_HEADERS = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      "Accept": "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "identity",
      "Connection": "keep-alive",
      "Sec-Fetch-Dest": "video",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "cross-site",
      "DNT": "1"
    };
    function makeRequest(_0) {
      return __async2(this, arguments, function* (url, options = {}) {
        try {
          const response = yield fetch(url, {
            method: options.method || "GET",
            headers: __spreadValues2(__spreadValues2({}, API_HEADERS), options.headers),
            body: options.body
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response;
        } catch (error) {
          console.error(`[Castle] Request failed for ${url}: ${error.message}`);
          throw error;
        }
      });
    }
    function extractCipherFromResponse(response) {
      return __async2(this, null, function* () {
        const text = yield response.text();
        const trimmed = text.trim();
        if (!trimmed) {
          throw new Error("Empty response");
        }
        try {
          const json = JSON.parse(trimmed);
          if (json && json.data && typeof json.data === "string") {
            return json.data.trim();
          }
        } catch (e) {
        }
        return trimmed;
      });
    }
    function extractDataBlock(obj) {
      if (obj && obj.data && typeof obj.data === "object") {
        return obj.data;
      }
      return obj || {};
    }
    function getTMDBDetails(tmdbId, mediaType) {
      return __async2(this, null, function* () {
        const endpoint = mediaType === "tv" ? "tv" : "movie";
        const url = `${TMDB_BASE_URL}/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`;
        const response = yield makeRequest(url);
        const data = yield response.json();
        const title = mediaType === "tv" ? data.name : data.title;
        const releaseDate = mediaType === "tv" ? data.first_air_date : data.release_date;
        const year = releaseDate ? parseInt(releaseDate.split("-")[0]) : null;
        return {
          title,
          year,
          tmdbId
        };
      });
    }
    function decryptCastle(encryptedB64, securityKeyB64) {
      return __async2(this, null, function* () {
        console.log("[Castle] Starting local AES-CBC decryption...");
        try {
          const CryptoJS = require("crypto-js");
          if (typeof __crypto_aes_decrypt_raw !== "undefined") {
            const originalDecrypt = CryptoJS.AES.decrypt;
            CryptoJS.AES.decrypt = function(cipher, key, options) {
              try {
                const wordArrayToBytes = (wordArray) => {
                  const bytes = new Uint8Array(wordArray.sigBytes);
                  for (let i = 0; i < wordArray.sigBytes; i++) {
                    bytes[i] = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                  }
                  return bytes;
                };
                const toUint8Array = (data2) => {
                  if (data2 instanceof Uint8Array)
                    return data2;
                  if (data2 instanceof ArrayBuffer)
                    return new Uint8Array(data2);
                  if (data2 && typeof data2.length === "number")
                    return new Uint8Array(Array.prototype.slice.call(data2));
                  return new Uint8Array(0);
                };
                const data = typeof cipher === "string" ? new Uint8Array(Array.from(atob(cipher), (c) => c.charCodeAt(0))) : cipher.ciphertext ? wordArrayToBytes(cipher.ciphertext) : toUint8Array(cipher);
                const kBytes = wordArrayToBytes(key);
                const ivBytes = options && options.iv ? wordArrayToBytes(options.iv) : new Uint8Array(0);
                const mode = options && options.mode || "AES-CBC";
                const keyArg = typeof Int8Array !== "undefined" ? new Int8Array(kBytes.buffer) : kBytes;
                const ivArg = typeof Int8Array !== "undefined" ? new Int8Array(ivBytes.buffer) : ivBytes;
                const dataArg = typeof Int8Array !== "undefined" ? new Int8Array(data.buffer) : data;
                const resBytes = __crypto_aes_decrypt_raw(mode, keyArg, ivArg, dataArg);
                const plain = new TextDecoder().decode(resBytes);
                return { toString: function() {
                  return plain;
                } };
              } catch (err) {
                console.error("[Castle JNI Patch] Decrypt failed, falling back:", err);
                return originalDecrypt.call(CryptoJS.AES, cipher, key, options);
              }
            };
          }
          const CASTLE_SUFFIX = "T!BgJB";
          const securityKeyWords = CryptoJS.enc.Base64.parse(securityKeyB64);
          const suffixWords = CryptoJS.enc.Utf8.parse(CASTLE_SUFFIX);
          const keyMaterial = securityKeyWords.concat(suffixWords);
          let finalKey;
          if (keyMaterial.sigBytes < 16) {
            const padding = CryptoJS.lib.WordArray.create(new Array(16 - keyMaterial.sigBytes).fill(0));
            finalKey = keyMaterial.concat(padding);
          } else if (keyMaterial.sigBytes > 16) {
            finalKey = CryptoJS.lib.WordArray.create(keyMaterial.words.slice(0, 4), 16);
          } else {
            finalKey = keyMaterial;
          }
          const iv = finalKey;
          const decrypted = CryptoJS.AES.decrypt(encryptedB64, finalKey, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
          const result = decrypted.toString(CryptoJS.enc.Utf8);
          if (!result) {
            throw new Error("Decryption resulted in empty string (possible key/IV mismatch)");
          }
          console.log("[Castle] Local decryption successful");
          return result;
        } catch (error) {
          console.error(`[Castle] Local decryption failed: ${error.message}`);
          throw error;
        }
      });
    }
    function getSecurityKey() {
      return __async2(this, null, function* () {
        console.log("[Castle] Fetching security key...");
        const url = `${CASTLE_BASE}/v0.1/system/getSecurityKey/1?channel=${CHANNEL}&clientType=${CLIENT}&lang=${LANG}`;
        const response = yield makeRequest(url);
        const data = yield response.json();
        if (data.code !== 200 || !data.data) {
          throw new Error(`Security key API error: ${JSON.stringify(data)}`);
        }
        console.log("[Castle] Security key obtained");
        return data.data;
      });
    }
    function searchCastle(securityKey, keyword, page = 1, size = 30) {
      return __async2(this, null, function* () {
        console.log(`[Castle] Searching for: ${keyword}`);
        const params = new URLSearchParams({
          channel: CHANNEL,
          clientType: CLIENT,
          keyword,
          lang: LANG,
          mode: "1",
          packageName: PKG,
          page: page.toString(),
          size: size.toString()
        });
        const url = `${CASTLE_BASE}/film-api/v1.1.0/movie/searchByKeyword?${params.toString()}`;
        const response = yield makeRequest(url);
        const cipher = yield extractCipherFromResponse(response);
        const decrypted = yield decryptCastle(cipher, securityKey);
        return JSON.parse(decrypted);
      });
    }
    function getDetails(securityKey, movieId) {
      return __async2(this, null, function* () {
        console.log(`[Castle] Fetching details for movieId: ${movieId}`);
        const url = `${CASTLE_BASE}/film-api/v1.9.9/movie?channel=${CHANNEL}&clientType=${CLIENT}&lang=${LANG}&movieId=${movieId}&packageName=${PKG}`;
        const response = yield makeRequest(url);
        const cipher = yield extractCipherFromResponse(response);
        const decrypted = yield decryptCastle(cipher, securityKey);
        return JSON.parse(decrypted);
      });
    }
    function getVideoV1(securityKey, movieId, episodeId, languageId, resolution = 2) {
      return __async2(this, null, function* () {
        console.log(`[Castle] Fetching video (v1) for movieId: ${movieId}, languageId: ${languageId}`);
        const url = `${CASTLE_BASE}/film-api/v2.0.1/movie/getVideo2?clientType=${CLIENT}&packageName=${PKG}&channel=${CHANNEL}&lang=${LANG}`;
        const body = {
          mode: "1",
          appMarket: "GuanWang",
          clientType: CLIENT,
          woolUser: "false",
          apkSignKey: "ED0955EB04E67A1D9F3305B95454FED485261475",
          androidVersion: "13",
          movieId: movieId.toString(),
          episodeId: episodeId.toString(),
          languageId: languageId.toString(),
          isNewUser: "true",
          resolution: resolution.toString(),
          packageName: PKG
        };
        const response = yield makeRequest(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const cipher = yield extractCipherFromResponse(response);
        const decrypted = yield decryptCastle(cipher, securityKey);
        return JSON.parse(decrypted);
      });
    }
    function getVideo2(securityKey, movieId, episodeId, resolution = 2) {
      return __async2(this, null, function* () {
        console.log(`[Castle] Fetching video (v2) for movieId: ${movieId}, episodeId: ${episodeId}`);
        const url = `${CASTLE_BASE}/film-api/v2.0.1/movie/getVideo2?clientType=${CLIENT}&packageName=${PKG}&channel=${CHANNEL}&lang=${LANG}`;
        const body = {
          mode: "1",
          appMarket: "GuanWang",
          clientType: CLIENT,
          woolUser: "false",
          apkSignKey: "ED0955EB04E67A1D9F3305B95454FED485261475",
          androidVersion: "13",
          movieId: movieId.toString(),
          episodeId: episodeId.toString(),
          isNewUser: "true",
          resolution: resolution.toString(),
          packageName: PKG
        };
        const response = yield makeRequest(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const cipher = yield extractCipherFromResponse(response);
        const decrypted = yield decryptCastle(cipher, securityKey);
        return JSON.parse(decrypted);
      });
    }
    function findCastleMovieId(securityKey, tmdbInfo) {
      return __async2(this, null, function* () {
        const searchTerm = tmdbInfo.year ? `${tmdbInfo.title} ${tmdbInfo.year}` : tmdbInfo.title;
        const searchResult = yield searchCastle(securityKey, searchTerm);
        const data = extractDataBlock(searchResult);
        const rows = data.rows || [];
        if (rows.length === 0) {
          throw new Error("No search results found");
        }
        for (const item of rows) {
          const itemTitle = (item.title || item.name || "").toLowerCase();
          const searchTitle = tmdbInfo.title.toLowerCase();
          if (itemTitle.includes(searchTitle) || searchTitle.includes(itemTitle)) {
            const movieId2 = item.id || item.redirectId || item.redirectIdStr;
            if (movieId2) {
              console.log(`[Castle] Found match: ${item.title || item.name} (id: ${movieId2})`);
              return movieId2.toString();
            }
          }
        }
        const firstItem = rows[0];
        const movieId = firstItem.id || firstItem.redirectId || firstItem.redirectIdStr;
        if (movieId) {
          console.log(`[Castle] Using first result: ${firstItem.title || firstItem.name} (id: ${movieId})`);
          return movieId.toString();
        }
        throw new Error("Could not extract movie ID from search results");
      });
    }
    function getQualityValue(quality) {
      if (!quality)
        return 0;
      const cleanQuality = quality.toString().toLowerCase().replace(/^(sd|hd|fhd|uhd|4k)\s*/i, "").replace(/p$/, "").trim();
      const qualityMap = {
        "4k": 2160,
        "2160": 2160,
        "1440": 1440,
        "1080": 1080,
        "720": 720,
        "480": 480,
        "360": 360,
        "240": 240
      };
      if (qualityMap[cleanQuality]) {
        return qualityMap[cleanQuality];
      }
      const numQuality = parseInt(cleanQuality);
      if (!isNaN(numQuality) && numQuality > 0) {
        return numQuality;
      }
      return 0;
    }
    function formatSize(sizeValue) {
      if (typeof sizeValue !== "number" || sizeValue <= 0) {
        return "Unknown";
      }
      if (sizeValue > 1e9) {
        return `${(sizeValue / 1e9).toFixed(2)} GB`;
      }
      return `${(sizeValue / 1e6).toFixed(0)} MB`;
    }
    function resolutionToQuality(resolution) {
      const qualityMap = {
        1: "480p",
        2: "720p",
        3: "1080p"
      };
      return qualityMap[resolution] || `${resolution}p`;
    }
    function processVideoResponse(videoData, mediaInfo, seasonNum, episodeNum, resolution, languageInfo) {
      const streams = [];
      const data = extractDataBlock(videoData);
      const videoUrl = data.videoUrl;
      if (!videoUrl) {
        console.log("[Castle] No videoUrl found in response");
        return streams;
      }
      const subtitles = [];
      if (data.subtitles && Array.isArray(data.subtitles)) {
        data.subtitles.forEach((sub) => {
          if (sub.url) {
            subtitles.push({
              url: sub.url,
              language: sub.abbreviate || "Unknown",
              name: sub.title || sub.abbreviate || "Unknown",
              headers: PLAYBACK_HEADERS
            });
          }
        });
      }
      let mediaTitle = mediaInfo.title || "Unknown";
      if (mediaInfo.year) {
        mediaTitle += ` (${mediaInfo.year})`;
      }
      if (seasonNum && episodeNum) {
        mediaTitle = `${mediaInfo.title} S${String(seasonNum).padStart(2, "0")}E${String(episodeNum).padStart(2, "0")}`;
      }
      const quality = resolutionToQuality(resolution);
      if (data.videos && Array.isArray(data.videos)) {
        for (const video of data.videos) {
          let videoQuality = video.resolutionDescription || video.resolution || quality;
          videoQuality = videoQuality.replace(/^(SD|HD|FHD)\s+/i, "");
          const streamName = languageInfo ? `Castle ${languageInfo} - ${videoQuality}` : `Castle - ${videoQuality}`;
          streams.push({
            name: streamName,
            title: mediaTitle,
            url: video.url || videoUrl,
            quality: videoQuality,
            size: formatSize(video.size),
            headers: PLAYBACK_HEADERS,
            provider: "castle",
            subtitles
          });
        }
      } else {
        const streamName = languageInfo ? `Castle ${languageInfo} - ${quality}` : `Castle - ${quality}`;
        streams.push({
          name: streamName,
          title: mediaTitle,
          url: videoUrl,
          quality,
          size: formatSize(data.size),
          headers: PLAYBACK_HEADERS,
          provider: "castle",
          subtitles
        });
      }
      return streams;
    }
    function getStreams2(tmdbId, mediaType, seasonNum, episodeNum) {
      return __async2(this, null, function* () {
        console.log(`[Castle] Starting extraction for TMDB ID: ${tmdbId}, Type: ${mediaType}${mediaType === "tv" ? `, S:${seasonNum}E:${episodeNum}` : ""}`);
        try {
          const tmdbInfo = yield getTMDBDetails(tmdbId, mediaType);
          console.log(`[Castle] TMDB Info: "${tmdbInfo.title}" (${tmdbInfo.year || "N/A"})`);
          const securityKey = yield getSecurityKey();
          const movieId = yield findCastleMovieId(securityKey, tmdbInfo);
          let details = yield getDetails(securityKey, movieId);
          let currentMovieId = movieId;
          if (mediaType === "tv" && seasonNum && episodeNum) {
            const data = extractDataBlock(details);
            const seasons = data.seasons || [];
            const season = seasons.find((s) => s.number === seasonNum);
            if (season && season.movieId && season.movieId !== movieId) {
              console.log(`[Castle] Fetching season ${seasonNum} details...`);
              details = yield getDetails(securityKey, season.movieId.toString());
              currentMovieId = season.movieId.toString();
            }
          }
          const detailsData = extractDataBlock(details);
          const episodes = detailsData.episodes || [];
          let episodeId = null;
          if (mediaType === "tv" && seasonNum && episodeNum) {
            const episode2 = episodes.find((e) => e.number === episodeNum);
            if (episode2 && episode2.id) {
              episodeId = episode2.id.toString();
            }
          } else if (episodes.length > 0) {
            episodeId = episodes[0].id.toString();
          }
          if (!episodeId) {
            throw new Error("Could not find episode ID");
          }
          const episode = episodes.find((e) => e.id.toString() === episodeId);
          const tracks = episode && episode.tracks || [];
          const resolution = 2;
          const allStreams = [];
          for (const track of tracks) {
            const langName = track.languageName || track.abbreviate || "Unknown";
            if (track.existIndividualVideo && track.languageId) {
              try {
                console.log(`[Castle] Fetching ${langName} (languageId: ${track.languageId})`);
                const videoData = yield getVideoV1(securityKey, currentMovieId, episodeId, track.languageId, resolution);
                const langStreams = processVideoResponse(videoData, tmdbInfo, seasonNum, episodeNum, resolution, `[${langName}]`);
                if (langStreams.length > 0) {
                  console.log(`[Castle] \u2705 ${langName}: Found ${langStreams.length} streams`);
                  allStreams.push(...langStreams);
                }
              } catch (error) {
                console.log(`[Castle] \u26A0\uFE0F ${langName}: Failed - ${error.message}`);
              }
            }
          }
          if (allStreams.length === 0) {
            console.log("[Castle] Falling back to shared stream (v2)");
            const videoData = yield getVideo2(securityKey, currentMovieId, episodeId, resolution);
            const sharedStreams = processVideoResponse(videoData, tmdbInfo, seasonNum, episodeNum, resolution, "[Shared]");
            allStreams.push(...sharedStreams);
          }
          allStreams.sort((a, b) => getQualityValue(b.quality) - getQualityValue(a.quality));
          console.log(`[Castle] Total streams found: ${allStreams.length}`);
          return allStreams;
        } catch (error) {
          console.error(`[Castle] Error: ${error.message}`);
          return [];
        }
      });
    }
    module2.exports = { getStreams: getStreams2 };
  }
});

// src/common/scrapers/hub4k.js
var require_hub4k = __commonJS({
  "src/common/scrapers/hub4k.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __defProps2 = Object.defineProperties;
    var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues2 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp2.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      if (__getOwnPropSymbols2)
        for (var prop of __getOwnPropSymbols2(b)) {
          if (__propIsEnum2.call(b, prop))
            __defNormalProp2(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
    var __async2 = (__this, __arguments, generator) => {
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
    var BASE_URL = "https://4khdhub.click";
    var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
    var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    var DOMAINS_URL = "https://raw.githubusercontent.com/phisher98/TVVVV/refs/heads/main/domains.json";
    var domainCache = { url: BASE_URL, ts: 0 };
    function fetchLatestDomain() {
      return __async2(this, null, function* () {
        const now = Date.now();
        if (now - domainCache.ts < 36e5)
          return domainCache.url;
        try {
          const response = yield fetch(DOMAINS_URL);
          const data = yield response.json();
          if (data && data["4khdhub"]) {
            domainCache.url = data["4khdhub"];
            domainCache.ts = now;
          }
        } catch (e) {
        }
        return domainCache.url;
      });
    }
    function fetchText(_0) {
      return __async2(this, arguments, function* (url, options = {}) {
        const retries = options.retries !== void 0 ? options.retries : 2;
        const delay = options.delay !== void 0 ? options.delay : 1e3;
        for (let i = 0; i <= retries; i++) {
          try {
            const response = yield fetch(url, {
              headers: __spreadValues2({
                "User-Agent": USER_AGENT
              }, options.headers)
            });
            return yield response.text();
          } catch (err) {
            console.log(`[4KHDHub] Request failed for ${url}: ${err.message}${i < retries ? `, retrying (${i + 1}/${retries})...` : ""}`);
          }
          if (i < retries) {
            yield new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
          }
        }
        return null;
      });
    }
    function getTmdbDetails(tmdbId, type) {
      return __async2(this, null, function* () {
        const isSeries = type === "series" || type === "tv";
        const endpoint = isSeries ? "tv" : "movie";
        const url = `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}`;
        console.log(`[4KHDHub] Fetching TMDB details from: ${url}`);
        try {
          const response = yield fetch(url);
          const data = yield response.json();
          if (isSeries) {
            return {
              title: data.name,
              year: data.first_air_date ? parseInt(data.first_air_date.split("-")[0]) : 0
            };
          } else {
            return {
              title: data.title,
              year: data.release_date ? parseInt(data.release_date.split("-")[0]) : 0
            };
          }
        } catch (error) {
          console.log(`[4KHDHub] TMDB request failed: ${error.message}`);
          return null;
        }
      });
    }
    function atob2(input) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      let str = String(input).replace(/=+$/, "");
      if (str.length % 4 === 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      let output = "";
      for (let bc = 0, bs, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        buffer = chars.indexOf(buffer);
      }
      return output;
    }
    function rot13Cipher(str) {
      return str.replace(/[a-zA-Z]/g, function(c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
      });
    }
    function levenshteinDistance(s, t) {
      if (s === t)
        return 0;
      const n = s.length;
      const m = t.length;
      if (n === 0)
        return m;
      if (m === 0)
        return n;
      const d = [];
      for (let i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
      }
      for (let j = 0; j <= m; j++) {
        d[0][j] = j;
      }
      for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
          const cost = s.charAt(i - 1) === t.charAt(j - 1) ? 0 : 1;
          d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
      }
      return d[n][m];
    }
    function parseBytes(val) {
      if (typeof val === "number")
        return val;
      if (!val)
        return 0;
      const match = val.match(/^([0-9.]+)\s*([a-zA-Z]+)$/);
      if (!match)
        return 0;
      const num = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      let multiplier = 1;
      if (unit.indexOf("k") === 0)
        multiplier = 1024;
      else if (unit.indexOf("m") === 0)
        multiplier = 1024 * 1024;
      else if (unit.indexOf("g") === 0)
        multiplier = 1024 * 1024 * 1024;
      else if (unit.indexOf("t") === 0)
        multiplier = 1024 * 1024 * 1024 * 1024;
      return num * multiplier;
    }
    function formatBytes(val) {
      if (val === 0)
        return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      let i = Math.floor(Math.log(val) / Math.log(k));
      if (i < 0)
        i = 0;
      return parseFloat((val / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
    var cheerio = require("cheerio-without-node-native");
    function fetchPageUrl(name, year, isSeries) {
      return __async2(this, null, function* () {
        const domain = yield fetchLatestDomain();
        const searchUrl = `${domain}/?s=${encodeURIComponent(name + " " + year)}`;
        console.log(`[4KHDHub] Search Request URL: ${searchUrl}`);
        const html = yield fetchText(searchUrl);
        if (!html) {
          console.log("[4KHDHub] Search failed: No HTML response");
          return null;
        }
        const $ = cheerio.load(html);
        const targetType = isSeries ? "Series" : "Movies";
        console.log(`[4KHDHub] Parsing search results for type: ${targetType}`);
        const matchingCards = $(".movie-card").filter((_, el) => {
          const hasFormat = $(el).find(`.movie-card-format:contains("${targetType}")`).length > 0;
          if (!hasFormat) {
          }
          return hasFormat;
        }).filter((_, el) => {
          const metaText = $(el).find(".movie-card-meta").text();
          const movieCardYear = parseInt(metaText);
          const yearMatch = !isNaN(movieCardYear) && Math.abs(movieCardYear - year) <= 1;
          if (!yearMatch) {
            console.log(`[4KHDHub] Skip: Year mismatch (${movieCardYear} vs ${year}) - ${$(el).find(".movie-card-title").text().trim()}`);
          }
          return yearMatch;
        }).filter((_, el) => {
          const movieCardTitle = $(el).find(".movie-card-title").text().replace(/\[.*?]/g, "").trim();
          const distance = levenshteinDistance(movieCardTitle.toLowerCase(), name.toLowerCase());
          const match = distance < 5;
          console.log(`[4KHDHub] Checking: "${movieCardTitle}" (Dist: ${distance}) vs "${name}"`);
          return match;
        }).map((_, el) => {
          let href = $(el).attr("href");
          if (href && !href.startsWith("http")) {
            href = domain + (href.startsWith("/") ? "" : "/") + href;
          }
          return href;
        }).get();
        if (matchingCards.length === 0) {
          console.log("[4KHDHub] No matching cards found after filtering");
        } else {
          console.log(`[4KHDHub] Found ${matchingCards.length} matching cards`);
        }
        return matchingCards.length > 0 ? matchingCards[0] : null;
      });
    }
    var cheerio2 = require("cheerio-without-node-native");
    function resolveRedirectUrl(redirectUrl) {
      return __async2(this, null, function* () {
        if (redirectUrl.includes("hubcloud.") || redirectUrl.includes("hubdrive.")) {
          return redirectUrl;
        }
        const redirectHtml = yield fetchText(redirectUrl);
        if (!redirectHtml)
          return redirectUrl;
        try {
          const redirectDataMatch = redirectHtml.match(/'o','(.*?)'/);
          if (!redirectDataMatch)
            return redirectUrl;
          const step1 = atob2(redirectDataMatch[1]);
          const step2 = atob2(step1);
          const step3 = rot13Cipher(step2);
          const step4 = atob2(step3);
          const redirectData = JSON.parse(step4);
          if (redirectData && redirectData.o) {
            return atob2(redirectData.o);
          }
        } catch (e) {
          console.log(`[4KHDHub] Error resolving redirect: ${e.message}`);
        }
        return redirectUrl;
      });
    }
    function extractSourceResults($, el) {
      return __async2(this, null, function* () {
        const localHtml = $(el).html();
        const sizeMatch = localHtml.match(/([\d.]+ ?[GM]B)/);
        const heightMatch = localHtml.match(/\d{3,}p/);
        const title = $(el).find(".file-title, .episode-file-title").text().trim();
        let height = heightMatch ? parseInt(heightMatch[0]) : 0;
        if (height === 0 && (title.includes("4K") || title.includes("4k") || localHtml.includes("4K") || localHtml.includes("4k"))) {
          height = 2160;
        }
        const meta = {
          bytes: sizeMatch ? parseBytes(sizeMatch[1]) : 0,
          height,
          title
        };
        const hubCloudLink = $(el).find("a").filter((_, a) => {
          const text = $(a).text();
          const href = $(a).attr("href") || "";
          return text.includes("HubCloud") || href.includes("hubcloud.") || href.includes("hubcloud/");
        }).attr("href");
        if (hubCloudLink) {
          const resolved = yield resolveRedirectUrl(hubCloudLink);
          return { url: resolved, meta };
        }
        const hubDriveLink = $(el).find("a").filter((_, a) => {
          const text = $(a).text();
          const href = $(a).attr("href") || "";
          return text.includes("HubDrive") || href.includes("hubdrive.") || href.includes("hubdrive/");
        }).attr("href");
        if (hubDriveLink) {
          const resolvedDrive = yield resolveRedirectUrl(hubDriveLink);
          if (resolvedDrive) {
            const hubDriveHtml = yield fetchText(resolvedDrive);
            if (hubDriveHtml) {
              const $2 = cheerio2.load(hubDriveHtml);
              const innerCloudLink = $2('a:contains("HubCloud")').attr("href") || $2("a").filter((_, a) => {
                const text = $2(a).text();
                const href = $2(a).attr("href") || "";
                return text.includes("HubCloud") || href.includes("hubcloud.") || href.includes("hubcloud/");
              }).attr("href");
              if (innerCloudLink) {
                return { url: innerCloudLink, meta };
              }
            }
          }
        }
        return null;
      });
    }
    function extractHubCloud(hubCloudUrl, baseMeta) {
      return __async2(this, null, function* () {
        if (!hubCloudUrl)
          return [];
        const redirectHtml = yield fetchText(hubCloudUrl, { headers: { Referer: hubCloudUrl } });
        if (!redirectHtml)
          return [];
        const redirectUrlMatch = redirectHtml.match(/var url ?= ?'(.*?)'/);
        if (!redirectUrlMatch)
          return [];
        const finalLinksUrl = redirectUrlMatch[1];
        const linksHtml = yield fetchText(finalLinksUrl, { headers: { Referer: hubCloudUrl } });
        if (!linksHtml)
          return [];
        const $ = cheerio2.load(linksHtml);
        const results = [];
        const sizeText = $("#size").text();
        const titleText = $("title").text().trim();
        const currentMeta = __spreadProps2(__spreadValues2({}, baseMeta), {
          bytes: parseBytes(sizeText) || baseMeta.bytes,
          title: titleText || baseMeta.title
        });
        $("a").each((_, el) => {
          const text = $(el).text().trim();
          const href = $(el).attr("href");
          if (!href)
            return;
          if (text.includes("10Gbps") || text.includes("PixelServer") || href.includes("hubcloud.cx")) {
            results.push({
              source: "HubCloud 10Gbps",
              url: href,
              meta: currentMeta
            });
          } else if (text.includes("Download File") || href.includes("r2.dev")) {
            results.push({
              source: "Direct R2",
              url: href,
              meta: currentMeta
            });
          } else if (text.includes("ZipDisk") || href.includes("workers.dev")) {
            results.push({
              source: "ZipDisk Server",
              url: href,
              meta: currentMeta
            });
          } else if (text.includes("FSL")) {
            results.push({
              source: "FSL",
              url: href,
              meta: currentMeta
            });
          }
        });
        return results;
      });
    }
    var cheerio3 = require("cheerio-without-node-native");
    function getStreams2(tmdbId, type, season, episode) {
      return __async2(this, null, function* () {
        const tmdbDetails = yield getTmdbDetails(tmdbId, type);
        if (!tmdbDetails)
          return [];
        const { title, year } = tmdbDetails;
        console.log(`[4KHDHub] Search: ${title} (${year})`);
        const isSeries = type === "series" || type === "tv";
        const pageUrl = yield fetchPageUrl(title, year, isSeries);
        if (!pageUrl) {
          console.log("[4KHDHub] Page not found");
          return [];
        }
        console.log(`[4KHDHub] Found page: ${pageUrl}`);
        const html = yield fetchText(pageUrl);
        if (!html)
          return [];
        const $ = cheerio3.load(html);
        const itemsToProcess = [];
        if (isSeries && season && episode) {
          const seasonStr = "S" + String(season).padStart(2, "0");
          const episodeStr = "Episode-" + String(episode).padStart(2, "0");
          $(".episode-item").each((_, el) => {
            if ($(".episode-title", el).text().includes(seasonStr)) {
              const downloadItems = $(".episode-download-item", el).filter((_2, item) => $(item).text().includes(episodeStr));
              downloadItems.each((_2, item) => {
                itemsToProcess.push(item);
              });
            }
          });
        } else {
          $(".download-item").each((_, el) => {
            itemsToProcess.push(el);
          });
        }
        console.log(`[4KHDHub] Processing ${itemsToProcess.length} items`);
        const streamPromises = itemsToProcess.map((item) => __async2(this, null, function* () {
          try {
            const sourceResult = yield extractSourceResults($, item);
            if (sourceResult && sourceResult.url) {
              console.log(`[4KHDHub] Extracting from HubCloud: ${sourceResult.url}`);
              const extractedLinks = yield extractHubCloud(sourceResult.url, sourceResult.meta);
              return extractedLinks.map((link) => ({
                name: `4KHDHub - ${link.source}${sourceResult.meta.height ? ` ${sourceResult.meta.height}p` : ""}`,
                title: `${link.meta.title}
${formatBytes(link.meta.bytes || 0)}`,
                url: link.url,
                quality: sourceResult.meta.height ? `${sourceResult.meta.height}p` : void 0,
                behaviorHints: {
                  bingeGroup: `4khdhub-${link.source}`
                }
              }));
            }
            return [];
          } catch (err) {
            console.log(`[4KHDHub] Item processing error: ${err.message}`);
            return [];
          }
        }));
        const results = yield Promise.all(streamPromises);
        return results.reduce((acc, val) => acc.concat(val), []);
      });
    }
    module2.exports = { getStreams: getStreams2 };
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

// src/hdmaster/index.js
var { filterAndDeduplicate } = require_filter();
var vidrockScraper = require_vidrock();
var castleScraper = require_castle();
var hub4kScraper = require_hub4k();
var streamflixScraper = require_streamflix();
var TIMEOUT_MS = 15e3;
function safeFetchStreams(scraper, name, tmdbId, mediaType, season, episode) {
  if (!scraper || typeof scraper.getStreams !== "function") {
    return Promise.resolve([]);
  }
  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => {
      console.log(`[HD Master] ${name} timed out after ${TIMEOUT_MS / 1e3}s`);
      resolve([]);
    }, TIMEOUT_MS);
  });
  const fetchPromise = Promise.resolve().then(() => scraper.getStreams(tmdbId, mediaType, season, episode)).then((streams) => {
    clearTimeout(timer);
    const count = Array.isArray(streams) ? streams.length : 0;
    console.log(`[HD Master] ${name} returned ${count} stream(s)`);
    return Array.isArray(streams) ? streams : [];
  }).catch((err) => {
    clearTimeout(timer);
    console.log(`[HD Master] ${name} error: ${err.message}`);
    return [];
  });
  return Promise.race([fetchPromise, timeoutPromise]);
}
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    console.log(`[HD Master] Fetching 1080P+ streams for TMDB: ${tmdbId}, Type: ${mediaType}, S:${season || 1}E:${episode || 1}`);
    try {
      const sources = [
        safeFetchStreams(vidrockScraper, "VidRock", tmdbId, mediaType, season, episode),
        safeFetchStreams(castleScraper, "Castle", tmdbId, mediaType, season, episode),
        safeFetchStreams(hub4kScraper, "4KHDHub", tmdbId, mediaType, season, episode),
        safeFetchStreams(streamflixScraper, "StreamFlix", tmdbId, mediaType, season, episode)
      ];
      const results = yield Promise.all(sources);
      const rawStreams = results.flat();
      console.log(`[HD Master] Total raw streams gathered: ${rawStreams.length}`);
      const finalStreams = filterAndDeduplicate(rawStreams);
      console.log(`[HD Master] \u2705 Final filtered & deduplicated 1080P/4K streams: ${finalStreams.length}`);
      return finalStreams;
    } catch (error) {
      console.error(`[HD Master] Unexpected error: ${error.message}`);
      return [];
    }
  });
}
module.exports = { getStreams };
