#!/usr/bin/env node
/**
 * Build Verification for WayPartner Vercel Deployment
 * Simple script to verify the build output structure
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 WayPartner Build Verification\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Run this from the project root.');
  process.exit(1);
}

// Check if dist directory exists
if (!fs.existsSync('dist')) {
  console.error('❌ Error: dist directory not found!');
  console.log('💡 This means the build failed to create output.');
  console.log('   Check the build logs for TypeScript or Vite errors.');
  process.exit(1);
}

console.log('✅ dist directory exists');

// Check for essential files
const essentialFiles = [
  'dist/index.html',
  'dist/assets'
];

let allFilesExist = true;

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} found`);
  } else {
    console.error(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ Build verification failed - missing essential files');
  process.exit(1);
}

// Check dist structure and size
const getDirectorySize = (dirPath) => {
  let totalSize = 0;
  if (!fs.existsSync(dirPath)) return 0;
  
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += fs.statSync(filePath).size;
    }
  }
  return totalSize;
};

const totalSize = getDirectorySize('dist');
const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log(`\n📊 Build Statistics:`);
console.log(`   Total size: ${sizeInMB} MB`);

// List dist contents
console.log(`\n📁 Output Directory Structure:`);
const listDirectory = (dirPath, level = 0) => {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    const indent = '  '.repeat(level);
    
    if (stats.isDirectory()) {
      console.log(`${indent}📁 ${file}/`);
      if (level < 2) { // Limit depth
        listDirectory(fullPath, level + 1);
      }
    } else {
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`${indent}📄 ${file} (${sizeKB} KB)`);
    }
  });
};

listDirectory('dist');

// Verify index.html content
const indexPath = 'dist/index.html';
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.includes('WayPartner')) {
    console.log('\n✅ index.html contains WayPartner branding');
  } else {
    console.log('\n⚠️  index.html may be malformed (no WayPartner branding found)');
  }
  
  if (indexContent.includes('assets/')) {
    console.log('✅ index.html references assets correctly');
  } else {
    console.log('⚠️  index.html may not reference assets properly');
  }
}

console.log('\n🎉 Build Verification Complete!');
console.log('✅ Ready for Vercel deployment');

console.log('\n🔧 Troubleshooting Tips:');
console.log('   • If build fails: Check TypeScript errors with `npm run type-check`');
console.log('   • If missing files: Verify Vite config entry points');
console.log('   • If wrong structure: Check that index.html is in project root');

console.log('\n📋 Next Steps for Vercel:');
console.log('   1. Add environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
console.log('   2. Set Output Directory to: dist');
console.log('   3. Deploy and check console for "Production Mode"');