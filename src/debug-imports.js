#!/usr/bin/env node
/**
 * Debug Import Checker for WayPartner
 * Verifies all imports are resolvable before build
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 WayPartner Import Debug\n');

// Check if essential files exist
const essentialFiles = [
  'App.tsx',
  'src/main.tsx',
  'index.html',
  'types/index.ts',
  'hooks/useKeyboardShortcuts.ts',
  'lib/supabase-client.ts',
  'components/ScreenRouter.tsx',
  'components/DashboardLayout.tsx',
  'components/SEOHead.tsx'
];

console.log('📁 Checking essential files:');
let allFilesExist = true;

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ Missing essential files! Build will fail.');
  console.log('\n💡 Fix by creating missing files or checking import paths.');
  process.exit(1);
}

// Check App.tsx imports
console.log('\n🔗 Analyzing App.tsx imports:');

if (fs.existsSync('App.tsx')) {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Extract import statements
  const importRegex = /import\s+.*?from\s+['"](.*?)['"];?/g;
  let match;
  
  while ((match = importRegex.exec(appContent)) !== null) {
    const importPath = match[1];
    
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      // Local import - check if file exists
      let resolvedPath = importPath;
      
      // Add .tsx/.ts extension if not present
      if (!resolvedPath.endsWith('.tsx') && !resolvedPath.endsWith('.ts')) {
        if (fs.existsSync(resolvedPath + '.tsx')) {
          resolvedPath += '.tsx';
        } else if (fs.existsSync(resolvedPath + '.ts')) {
          resolvedPath += '.ts';
        } else if (fs.existsSync(resolvedPath + '/index.tsx')) {
          resolvedPath += '/index.tsx';
        } else if (fs.existsSync(resolvedPath + '/index.ts')) {
          resolvedPath += '/index.ts';
        }
      }
      
      // Remove leading ./
      if (resolvedPath.startsWith('./')) {
        resolvedPath = resolvedPath.substring(2);
      }
      
      if (fs.existsSync(resolvedPath)) {
        console.log(`✅ ${importPath} → ${resolvedPath}`);
      } else {
        console.log(`❌ ${importPath} → File not found!`);
        allFilesExist = false;
      }
    } else if (!importPath.startsWith('@') && !importPath.includes('node_modules')) {
      // External package - just note it
      console.log(`📦 ${importPath} (external package)`);
    }
  }
}

// Check src/main.tsx imports
console.log('\n🔗 Analyzing src/main.tsx imports:');

if (fs.existsSync('src/main.tsx')) {
  const mainContent = fs.readFileSync('src/main.tsx', 'utf8');
  
  if (mainContent.includes("from '../App.tsx'")) {
    if (fs.existsSync('App.tsx')) {
      console.log("✅ '../App.tsx' → App.tsx found");
    } else {
      console.log("❌ '../App.tsx' → App.tsx not found!");
      allFilesExist = false;
    }
  }
  
  if (mainContent.includes("from '../styles/globals.css'")) {
    if (fs.existsSync('styles/globals.css')) {
      console.log("✅ '../styles/globals.css' → styles/globals.css found");
    } else {
      console.log("❌ '../styles/globals.css' → styles/globals.css not found!");
      allFilesExist = false;
    }
  }
}

// Final assessment
console.log('\n📊 Import Analysis Results:');

if (allFilesExist) {
  console.log('✅ All imports appear to be resolvable');
  console.log('💚 Build should succeed if TypeScript compilation passes');
  
  console.log('\n🔧 Next steps:');
  console.log('   1. Run: npm run type-check');
  console.log('   2. If no errors, run: npm run build:vercel');
  console.log('   3. Check for dist/ directory creation');
  
} else {
  console.error('❌ Import issues detected - build will fail');
  console.log('\n🛠️ Required actions:');
  console.log('   1. Create missing files listed above');
  console.log('   2. Fix import paths to match actual file locations');
  console.log('   3. Re-run this script until all ✅');
  console.log('   4. Then attempt build');
  
  process.exit(1);
}

console.log('\n🎯 Build Command Test:');
console.log('   npm run clean && npm run type-check && vite build');
console.log('   If this works locally, Vercel will work too!');