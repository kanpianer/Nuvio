/**
 * Nuvio HD Stream Filter & Deduplication Engine
 * 严格筛选 1080P 及以上画质，全自动去重
 */

// 质量等级映射表
const QUALITY_RANKS = {
  '4K': 2160,
  '2160p': 2160,
  '2160P': 2160,
  '1440p': 1440,
  '1440P': 1440,
  '2K': 1440,
  '1080p': 1080,
  '1080P': 1080
};

/**
 * 分析并归一化视频源质量
 * @param {Object} stream 
 * @returns {{ valid: boolean, quality: string, rank: number }}
 */
function analyzeQuality(stream) {
  if (!stream || !stream.url) {
    return { valid: false, quality: 'invalid', rank: 0 };
  }

  const rawQuality = String(stream.quality || '').trim();
  const qLower = rawQuality.toLowerCase();
  const nameLower = String(stream.name || '').toLowerCase().replace(/4khdhub/g, '').replace(/4k-hdhub/g, '');
  const titleLower = String(stream.title || '').toLowerCase();
  const urlLower = String(stream.url || '').toLowerCase();

  // 1. 显式判定 4K / 2160P
  if (['4k', '2160p', '2160', 'uhd'].some(k => qLower === k || qLower.startsWith('2160') || qLower.startsWith('4k'))) {
    return { valid: true, quality: '4K', rank: 2160 };
  }

  // 2. 显式判定 1440P / 2K
  if (['1440p', '1440', '2k'].some(k => qLower === k || qLower.startsWith('1440'))) {
    return { valid: true, quality: '1440p', rank: 1440 };
  }

  // 3. 显式判定 1080P
  if (['1080p', '1080', 'fhd', '1080i'].some(k => qLower === k || qLower.startsWith('1080'))) {
    return { valid: true, quality: '1080p', rank: 1080 };
  }

  // 4. 显式丢弃低于 1080P 的画质
  const lowQualities = ['720p', '720', '480p', '480', '360p', '360', '240p', '240', 'sd', 'cam', 'ts', 'telesync', 'hdts', 'dvdrip'];
  if (lowQualities.some(k => qLower.includes(k))) {
    return { valid: false, quality: qLower, rank: 0 };
  }

  // 5. 从名称或标题中提取分辨率
  if (/\b(4k|2160p|2160)\b/i.test(nameLower) || /\b(4k|2160p|2160)\b/i.test(titleLower)) {
    return { valid: true, quality: '4K', rank: 2160 };
  }
  if (/\b(1440p|1440|2k)\b/i.test(nameLower) || /\b(1440p|1440|2k)\b/i.test(titleLower)) {
    return { valid: true, quality: '1440p', rank: 1440 };
  }
  if (/\b(1080p|1080|fhd)\b/i.test(nameLower) || /\b(1080p|1080|fhd)\b/i.test(titleLower)) {
    return { valid: true, quality: '1080p', rank: 1080 };
  }

  // 6. 从 URL 路径特征提取分辨率
  if (/(2160p|4k|\b2160\b)/i.test(urlLower)) {
    return { valid: true, quality: '4K', rank: 2160 };
  }
  if (/(1080p|fhd|\b1080\b)/i.test(urlLower)) {
    return { valid: true, quality: '1080p', rank: 1080 };
  }

  // 7. 针对带有 master.m3u8 的自适应流，如果名称没有明确声明为 720p 或更低，默认支持 1080P 自适应分片
  if (urlLower.includes('master.m3u8') && !lowQualities.some(k => nameLower.includes(k) || urlLower.includes(k))) {
    return { valid: true, quality: '1080p', rank: 1080 };
  }

  // 其他未知或未达标的源一律拒绝
  return { valid: false, quality: qLower || 'unknown', rank: 0 };
}

/**
 * 生成用于去重的标准化唯一键
 * @param {string} url 
 * @returns {string}
 */
function getCanonicalUrlKey(url) {
  if (!url) return '';
  try {
    const trimmed = String(url).trim();
    // 去除特定临时签名或时间戳参数
    const qIndex = trimmed.indexOf('?');
    if (qIndex === -1) return trimmed;
    const base = trimmed.substring(0, qIndex);
    // 对于某些依赖鉴权签名的 url，提取关键文件路径
    return base;
  } catch (e) {
    return url;
  }
}

/**
 * 对视频源数组进行 1080P+ 筛选与智能去重
 * @param {Array} streams 原始视频源数组
 * @returns {Array} 仅包含 1080P 及以上且去重后的视频源数组
 */
function filterAndDeduplicate(streams) {
  if (!Array.isArray(streams) || streams.length === 0) {
    return [];
  }

  const seenUrls = new Set();
  const seenCanonicalKeys = new Set();
  const filtered = [];

  for (const stream of streams) {
    if (!stream || !stream.url) continue;

    // 1. 质量检测：低于 1080P 直接跳过
    const qualityInfo = analyzeQuality(stream);
    if (!qualityInfo.valid || qualityInfo.rank < 1080) {
      continue;
    }

    // 2. 精准 URL 去重
    const rawUrl = String(stream.url).trim();
    if (seenUrls.has(rawUrl)) {
      continue;
    }

    // 3. 规范化路径去重（针对同一存储桶/文件的不同临时 token）
    const canonicalKey = getCanonicalUrlKey(rawUrl);
    if (canonicalKey && canonicalKey.length > 20 && seenCanonicalKeys.has(canonicalKey)) {
      continue;
    }

    seenUrls.add(rawUrl);
    if (canonicalKey) {
      seenCanonicalKeys.add(canonicalKey);
    }

    // 4. 标准化格式输出
    filtered.push({
      name: stream.name || 'HD Stream',
      title: stream.title || 'HD Video',
      url: rawUrl,
      quality: qualityInfo.quality,
      size: stream.size,
      headers: stream.headers || undefined,
      subtitles: Array.isArray(stream.subtitles) ? stream.subtitles : undefined,
      _rank: qualityInfo.rank
    });
  }

  // 5. 按分辨率从高到低排序 (4K 2160p > 1440p > 1080p)
  filtered.sort((a, b) => (b._rank || 0) - (a._rank || 0));

  // 清除内部辅助字段
  return filtered.map(s => {
    const res = Object.assign({}, s);
    delete res._rank;
    return res;
  });
}

module.exports = {
  analyzeQuality,
  filterAndDeduplicate
};
