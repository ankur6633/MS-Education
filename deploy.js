#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploying to Vercel...\n');

try {
  // Check if vercel is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Check if user is logged in
  try {
    execSync('vercel whoami', { stdio: 'ignore' });
    console.log('✅ Already logged in to Vercel');
  } catch (error) {
    console.log('🔐 Please login to Vercel:');
    console.log('   Run: vercel login');
    console.log('   Then run this script again');
    process.exit(1);
  }

  // Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });

  console.log('\n✅ Deployment complete!');
  console.log('📝 Next steps:');
  console.log('1. Add environment variables in Vercel dashboard');
  console.log('2. Update MongoDB Atlas network access');
  console.log('3. Test your admin panel');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
