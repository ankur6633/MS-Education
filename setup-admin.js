#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Course Management Admin Panel...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Database
MONGODB_URI=mongodb+srv://msenglish:ankur@msenglish.ugt6lgz.mongodb.net/mseducation

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Credentials (for demo purposes)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('⚠️  Please update the environment variables with your actual values.\n');
} else {
  console.log('✅ .env.local file already exists.\n');
}

// Check if MongoDB is mentioned in package.json scripts
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts['dev:admin']) {
    console.log('📝 Adding admin development script...');
    packageJson.scripts['dev:admin'] = 'next dev --port 3000';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added dev:admin script to package.json\n');
  }
}

console.log('🎉 Setup complete! Next steps:\n');
console.log('1. Update your .env.local file with actual values:');
console.log('   - MongoDB connection string');
console.log('   - Cloudinary credentials');
console.log('   - Secure NEXTAUTH_SECRET');
console.log('   - Admin credentials\n');

console.log('2. Make sure MongoDB is running:');
console.log('   - Local: mongod');
console.log('   - Or use MongoDB Atlas\n');

console.log('3. Start the development server:');
console.log('   npm run dev\n');

console.log('4. Access the admin panel at:');
console.log('   http://localhost:3000/admin\n');

console.log('5. Login with demo credentials:');
console.log('   Username: admin');
console.log('   Password: admin123\n');

console.log('📚 For detailed instructions, see ADMIN_README.md');
console.log('🔧 For troubleshooting, check the console for errors');
