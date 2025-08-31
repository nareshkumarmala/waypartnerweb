#!/usr/bin/env node
/**
 * Pre-Deploy Verification for WayPartner
 * Ensures all fixes are in place before Git push
 */

const fs = require('fs');

console.log('🔍 WayPartner Pre-Deploy Verification\n');

let allGood = true;

// Check 1: App.tsx has the fixes
console.log('📝 Checking App.tsx fixes...');
if (fs.existsSync('App.tsx')) {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (appContent.includes('(window as any).gtag')) {
    console.log('✅ App.tsx has proper gtag fixes');
  } else {
    console.log('❌ App.tsx missing gtag fixes');
    allGood = false;
  }
  
  if (appContent.includes('2025-01-30-CACHE-FIX')) {
    console.log('✅ App.tsx has version marker');
  } else {
    console.log('❌ App.tsx missing version marker');
    allGood = false;
  }
} else {
  console.log('❌ App.tsx not found');
  allGood = false;
}

// Check 2: Vite config
console.log('\n🔧 Checking vite.config.ts...');
if (fs.existsSync('vite.config.ts')) {
  const viteContent = fs.readFileSync('vite.config.ts', 'utf8');
  
  if (viteContent.includes('outDir: \'dist\'')) {
    console.log('✅ Vite config has correct outDir');
  } else {
    console.log('❌ Vite config missing outDir');
    allGood = false;
  }
  
  if (viteContent.includes('emptyOutDir: true')) {
    console.log('✅ Vite config has emptyOutDir');
  } else {
    console.log('❌ Vite config missing emptyOutDir');
    allGood = false;
  }
} else {
  console.log('❌ vite.config.ts not found');
  allGood = false;
}

// Check 3: Package.json scripts
console.log('\n📦 Checking package.json scripts...');
if (fs.existsSync('package.json')) {
  const packageContent = fs.readFileSync('package.json', 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  if (packageJson.scripts['build:vercel']) {
    console.log('✅ build:vercel script exists');
  } else {
    console.log('❌ build:vercel script missing');
    allGood = false;
  }
  
  if (packageJson.scripts['verify']) {
    console.log('✅ verify script exists');
  } else {
    console.log('❌ verify script missing');
    allGood = false;
  }
} else {
  console.log('❌ package.json not found');
  allGood = false;
}

// Check 4: Vercel config
console.log('\n🌐 Checking vercel.json...');
if (fs.existsSync('vercel.json')) {
  const vercelContent = fs.readFileSync('vercel.json', 'utf8');
  
  if (vercelContent.includes('build:vercel')) {
    console.log('✅ Vercel uses build:vercel command');
  } else {
    console.log('❌ Vercel not using build:vercel command');
    allGood = false;
  }
  
  if (vercelContent.includes('"outputDirectory": "dist"')) {
    console.log('✅ Vercel output directory is dist');
  } else {
    console.log('❌ Vercel output directory not set to dist');
    allGood = false;
  }
} else {
  console.log('❌ vercel.json not found');
  allGood = false;
}

// Check 5: Helper files
console.log('\n🛠️  Checking helper files...');
const helperFiles = [
  'verify-build.js',
  'debug-imports.js', 
  'check-deployment.js',
  'CACHE_CLEARING_GUIDE.md',
  'BUILD_VERSION.txt'
];

helperFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allGood = false;
  }
});

// Final assessment
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 ALL CHECKS PASSED! Ready for deployment');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: git add .');
  console.log('   2. Run: git commit -m "🔥 CRITICAL FIX: Resolve Vercel build errors"');
  console.log('   3. Run: git push origin main');
  console.log('   4. Watch Vercel dashboard for successful build');
  console.log('   5. Add environment variables when build completes');
  
  console.log('\n📋 Post-deployment verification:');
  console.log('   • Site should show green banner');
  console.log('   • Console should log version: 2025-01-30-CACHE-FIX');
  console.log('   • No TypeScript or build errors');
  
} else {
  console.log('❌ DEPLOYMENT NOT READY - Fix issues above first');
  console.log('\n🔧 Some fixes may be missing. Check the ❌ items above.');
  process.exit(1);
}

console.log('\n💡 Pro tip: After successful deployment, run `npm run check` to verify live site');
console.log('🎯 Goal: Switch from demo mode to production mode with real Supabase connection!');