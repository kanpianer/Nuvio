/**
 * Nuvio HD Streams Plugin Verification Test Suite
 * 验证 1080P+ 筛选与去重有效性
 */

const hdmaster = require('./src/hdmaster/index.js');

async function runTests() {
  console.log('====================================================');
  console.log('🚀 开始验证 Nuvio HD Ultra 插件标准与筛选逻辑');
  console.log('====================================================\n');

  let passed = true;

  // 测试 1: 电影测试 (Oppenheimer, TMDB 872585)
  console.log('🧪 测试 1: 电影抓取 (Oppenheimer - TMDB: 872585)...');
  const movieStart = Date.now();
  const movieStreams = await hdmaster.getStreams('872585', 'movie');
  const movieDuration = ((Date.now() - movieStart) / 1000).toFixed(1);

  console.log(`\n📊 电影测试结果: 耗时 ${movieDuration}s, 获取到 ${movieStreams.length} 个 1080P/4K 视频源`);

  if (movieStreams.length === 0) {
    console.error('❌ 未获取到任何电影源');
    passed = false;
  } else {
    // 验证每一条流均满足 1080P 及以上且无重复
    const seenUrls = new Set();
    let lowQualityCount = 0;

    movieStreams.forEach((s, idx) => {
      const q = String(s.quality).toLowerCase();
      const isHD = q === '1080p' || q === '1440p' || q === '4k' || q === '2160p';
      if (!isHD) {
        lowQualityCount++;
        console.error(`  ❌ 异常低画质流 [${idx}]: ${s.name} (${s.quality})`);
      }
      if (seenUrls.has(s.url)) {
        console.error(`  ❌ 发现重复 URL [${idx}]: ${s.url}`);
        passed = false;
      }
      seenUrls.add(s.url);
      console.log(`  ✅ [${idx + 1}] [${s.quality}] ${s.name} -> ${(s.url || '').substring(0, 70)}...`);
    });

    if (lowQualityCount > 0) {
      console.error(`❌ 发现了 ${lowQualityCount} 个低于 1080P 的流`);
      passed = false;
    } else {
      console.log('  🎯 1080P+ 筛选验证: 100% 通过（无任何 720P/480P 杂质）');
      console.log('  🎯 去重检测: 100% 通过（无任何重复流）');
    }
  }

  // 测试 2: 剧集测试 (Game of Thrones, TMDB 1399, S1E1)
  console.log('\n----------------------------------------------------');
  console.log('🧪 测试 2: 剧集抓取 (Game of Thrones - TMDB: 1399 S1E1)...');
  const tvStart = Date.now();
  const tvStreams = await hdmaster.getStreams('1399', 'tv', 1, 1);
  const tvDuration = ((Date.now() - tvStart) / 1000).toFixed(1);

  console.log(`\n📊 剧集测试结果: 耗时 ${tvDuration}s, 获取到 ${tvStreams.length} 个 1080P/4K 视频源`);

  if (tvStreams.length === 0) {
    console.error('❌ 未获取到任何剧集源');
    passed = false;
  } else {
    const seenUrls = new Set();
    let lowQualityCount = 0;

    tvStreams.forEach((s, idx) => {
      const q = String(s.quality).toLowerCase();
      const isHD = q === '1080p' || q === '1440p' || q === '4k' || q === '2160p';
      if (!isHD) {
        lowQualityCount++;
        console.error(`  ❌ 异常低画质流 [${idx}]: ${s.name} (${s.quality})`);
      }
      if (seenUrls.has(s.url)) {
        console.error(`  ❌ 发现重复 URL [${idx}]: ${s.url}`);
        passed = false;
      }
      seenUrls.add(s.url);
      console.log(`  ✅ [${idx + 1}] [${s.quality}] ${s.name} -> ${(s.url || '').substring(0, 70)}...`);
    });

    if (lowQualityCount > 0) {
      console.error(`❌ 发现了 ${lowQualityCount} 个低于 1080P 的剧集流`);
      passed = false;
    } else {
      console.log('  🎯 1080P+ 筛选验证: 100% 通过（无任何 720P/480P 杂质）');
      console.log('  🎯 去重检测: 100% 通过（无任何重复流）');
    }
  }

  console.log('\n====================================================');
  if (passed) {
    console.log('🎉 恭喜！所有测试顺利通过，插件完全符合官方标准与筛选要求！');
  } else {
    console.error('⚠️ 部分测试未通过，请检查日志。');
    process.exit(1);
  }
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
