#!/usr/bin/env node
/**
 * Build Validation Script for WayPartner Service Center
 * Tests build process and verifies output before deployment
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🔧 WayPartner Build Validation Starting...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

// Check if dist directory exists (from previous builds)
if (fs.existsSync('dist')) {
  console.log('🗑️  Cleaning previous build directory...');
  fs.rmSync('dist', { recursive: true, force: true });
}

// Validate TypeScript configuration
console.log('📋 Validating TypeScript configuration...');
if (!fs.existsSync('tsconfig.json')) {
  console.error('❌ tsconfig.json not found!');
  process.exit(1);
}

// Check environment variables
console.log('🔍 Checking environment configuration...');
const envFiles = ['.env.local', '.env.example'];
const hasEnvConfig = envFiles.some(file => fs.existsSync(file));
if (!hasEnvConfig) {
  console.log('⚠️  No environment files found - will use fallback values');
} else {
  console.log('✅ Environment configuration found');
}

// Test TypeScript compilation
console.log('🔨 Testing TypeScript compilation...');
exec('npm run type-check', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ TypeScript compilation failed:');
    console.error(stderr);
    process.exit(1);
  }
  
  console.log('✅ TypeScript compilation successful');
  
  // Run the actual build
  console.log('🏗️  Running production build...');
  exec('npm run build', (buildError, buildStdout, buildStderr) => {
    if (buildError) {
      console.error('❌ Build failed:');
      console.error(buildStderr);
      process.exit(1);
    }
    
    // Validate build output
    console.log('🔍 Validating build output...');
    
    if (!fs.existsSync('dist')) {
      console.error('❌ dist directory not created!');
      process.exit(1);
    }
    
    if (!fs.existsSync('dist/index.html')) {
      console.error('❌ index.html not found in dist directory!');
      process.exit(1);
    }
    
    // Check for JavaScript chunks
    const jsDir = path.join('dist', 'js');
    if (!fs.existsSync(jsDir)) {
      console.log('⚠️  No JS directory found - checking assets...');
      const distFiles = fs.readdirSync('dist');
      const hasJS = distFiles.some(file => file.endsWith('.js'));
      if (!hasJS) {
        console.error('❌ No JavaScript files found in build output!');
        process.exit(1);
      }
    }
    
    // Get build statistics
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
    
    console.log('\n🎉 Build Validation Complete!');
    console.log('✅ TypeScript compilation: SUCCESS');
    console.log('✅ Vite build: SUCCESS');
    console.log('✅ Output directory: Created');
    console.log('✅ Essential files: Present');
    console.log(`📊 Total build size: ${sizeInMB} MB`);
    
    // List key files in dist
    console.log('\n📁 Build Output Summary:');
    const distFiles = fs.readdirSync('dist');
    distFiles.forEach(file => {
      const filePath = path.join('dist', file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`   ${stats.isDirectory() ? '📁' : '📄'} ${file} ${stats.isFile() ? `(${sizeKB} KB)` : ''}`);
    });
    
    console.log('\n🚀 Ready for Vercel deployment!');
    console.log('💡 Next steps:');
    console.log('   1. Add environment variables to Vercel');
    console.log('   2. Deploy to Vercel');
    console.log('   3. Verify production environment');
  });
});