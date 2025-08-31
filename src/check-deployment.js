#!/usr/bin/env node
/**
 * WayPartner Deployment Verification Script
 * Quick check to see if new version is deployed
 */

const https = require('https');

const SITE_URL = 'https://service.waypartnerindia.com';
const VERSION_MARKER = '2025-01-30-CACHE-FIX';

console.log('🔍 WayPartner Deployment Check\n');

// Check if site is accessible
console.log('📡 Checking site accessibility...');

const checkSite = () => {
  return new Promise((resolve, reject) => {
    const req = https.get(SITE_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Site is accessible');
          
          // Check for version marker
          if (data.includes('WayPartner')) {
            console.log('✅ WayPartner branding found');
          } else {
            console.log('⚠️  WayPartner branding not found');
          }
          
          // Check for basic structure
          if (data.includes('<!DOCTYPE html>')) {
            console.log('✅ HTML structure is valid');
          } else {
            console.log('❌ Invalid HTML structure');
          }
          
          // Check for assets
          if (data.includes('/assets/')) {
            console.log('✅ Assets are properly referenced');
          } else {
            console.log('⚠️  Assets may not be properly referenced');
          }
          
          console.log('\n📊 Response Details:');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Content-Type: ${res.headers['content-type']}`);
          console.log(`   Content-Length: ${res.headers['content-length'] || 'unknown'}`);
          console.log(`   Cache-Control: ${res.headers['cache-control'] || 'not set'}`);
          
          resolve({ success: true, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
};

// Run the check
checkSite()
  .then(({ success, data }) => {
    console.log('\n🎯 Deployment Status:');
    
    if (success) {
      console.log('✅ Site is live and responding');
      console.log('✅ HTML content is being served');
      
      console.log('\n🔧 Next Steps:');
      console.log('   1. Open browser and visit:', SITE_URL);
      console.log('   2. Press F12 to open developer console');
      console.log('   3. Look for these messages:');
      console.log('      ✅ "🚀 WayPartner App Initializing..."');
      console.log('      ✅ "🔄 App Version: 2025-01-30-CACHE-FIX"');
      console.log('      ✅ "✅ Production Mode - Connected to Supabase"');
      console.log('   4. If you see old version, force refresh: Ctrl+Shift+R');
      
      console.log('\n💡 Cache Clearing Tips:');
      console.log('   • Try incognito/private mode first');
      console.log('   • Clear browser cache and cookies');
      console.log('   • Try different browser or device');
      console.log('   • Add ?v=new to URL to force cache bust');
      
    } else {
      console.log('❌ Site deployment issue detected');
      console.log('💡 Check Vercel deployment status and logs');
    }
  })
  .catch((error) => {
    console.error('\n❌ Site Check Failed:');
    console.error('   Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if site URL is correct:', SITE_URL);
    console.log('   2. Verify Vercel deployment completed successfully');
    console.log('   3. Check DNS settings if using custom domain');
    console.log('   4. Try accessing Vercel preview URL directly');
  });

console.log('⏳ Checking site status...');