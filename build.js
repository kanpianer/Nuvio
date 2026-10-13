#!/usr/bin/env node

/**
 * Build script for Nuvio HD Streams Plugin
 * Bundles each provider from src/<provider>/ into a single file at providers/<provider>.js
 * Complies with official Nuvio React Native / Hermes requirements (ES2016 target).
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'providers');

const EXTERNAL_MODULES = [
    'cheerio-without-node-native',
    'react-native-cheerio',
    'cheerio',
    'crypto-js',
    'axios'
];

function getProvidersToBuild() {
    const args = process.argv.slice(2).filter(arg => !arg.startsWith('-'));
    if (args.length > 0) {
        return args;
    }
    if (!fs.existsSync(srcDir)) {
        console.error('❌ src/ directory not found.');
        process.exit(1);
    }
    return fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name !== 'common')
        .map(d => d.name);
}

async function buildProvider(providerName) {
    const providerDir = path.join(srcDir, providerName);
    const entryPoint = path.join(providerDir, 'index.js');
    const outFile = path.join(outDir, `${providerName}.js`);

    if (!fs.existsSync(entryPoint)) {
        console.warn(`⚠️ Skipping ${providerName}: no src/${providerName}/index.js found`);
        return false;
    }

    try {
        await esbuild.build({
            entryPoints: [entryPoint],
            bundle: true,
            outfile: outFile,
            format: 'cjs',
            platform: 'neutral',
            target: 'es2016', // Transpile async/await for Hermes
            minify: false,
            sourcemap: false,
            external: EXTERNAL_MODULES,
            banner: {
                js: `/**\n * ${providerName} - Built for Nuvio (1080P+ Only)\n * Generated: ${new Date().toISOString()}\n */`
            },
            logLevel: 'warning'
        });

        const stats = fs.statSync(outFile);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${providerName}.js (${sizeKB} KB)`);
        return true;
    } catch (err) {
        console.error(`❌ Failed to build ${providerName}:`, err.message);
        return false;
    }
}

async function main() {
    const providers = getProvidersToBuild();
    if (providers.length === 0) {
        console.log('No providers found in src/');
        return;
    }

    console.log(`\n📦 Building ${providers.length} provider(s)...\n`);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    let success = 0;
    for (const provider of providers) {
        const result = await buildProvider(provider);
        if (result) success++;
    }
    console.log(`\n✨ Build completed: ${success}/${providers.length} successful.\n`);
}

main().catch(err => {
    console.error('Build script error:', err);
    process.exit(1);
});
