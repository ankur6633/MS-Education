#!/usr/bin/env node

console.log('🔧 Vercel Environment Variables Setup\n');

console.log('Copy these environment variables to your Vercel dashboard:\n');

console.log('MONGODB_URI=mongodb+srv://msenglish:ankur@msenglish.ugt6lgz.mongodb.net/mseducation');
console.log('NEXTAUTH_URL=https://ms-education-pi.vercel.app');
console.log('NEXTAUTH_SECRET=6f29f29b8b321a1a8c2f3e40d00c8f864fe69bf9a34099bdc592351a4633b427');
console.log('CLOUDINARY_CLOUD_NAME=drzbeglpo');
console.log('CLOUDINARY_API_KEY=444348525411693');
console.log('CLOUDINARY_API_SECRET=gYAEgghJEuMe-0Ro0wDA2XGiQO4');
console.log('ADMIN_USERNAME=admin');
console.log('ADMIN_PASSWORD=admin123\n');

console.log('Steps to add in Vercel:');
console.log('1. Go to https://vercel.com');
console.log('2. Select your project: ms-education-pi');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add each variable above');
console.log('5. Select "Production", "Preview", and "Development" for each');
console.log('6. Click "Save" for each variable');
console.log('7. Go to Deployments tab and click "Redeploy"\n');

console.log('After setup, test these URLs:');
console.log('- https://ms-education-pi.vercel.app/api/test');
console.log('- https://ms-education-pi.vercel.app/admin');
