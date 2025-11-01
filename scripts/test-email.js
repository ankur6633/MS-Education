/**
 * Email Configuration Test Script
 * 
 * This script tests your email configuration to ensure
 * that emails can be sent successfully.
 * 
 * Usage: node scripts/test-email.js your-test-email@example.com
 */

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

const testEmail = async (recipientEmail) => {
  console.log('🔧 Testing Email Configuration...\n');

  // Check if required environment variables are set
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env.local file.');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`📧 SMTP Host: ${process.env.EMAIL_HOST}`);
  console.log(`📧 SMTP Port: ${process.env.EMAIL_PORT}`);
  console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
  console.log(`📧 Sending to: ${recipientEmail}\n`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    // Verify connection
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'MS Education'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: '✅ Email Configuration Test - MS Education',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .success { background: #10b981; color: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .info { background: #fff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
            code { background: #e5e7eb; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Email Test Successful!</h1>
            </div>
            <div class="content">
              <div class="success">
                <strong>✅ Configuration Verified</strong><br>
                Your email service is properly configured and working!
              </div>
              
              <h2>Configuration Details:</h2>
              <div class="info">
                <strong>SMTP Host:</strong> ${process.env.EMAIL_HOST}<br>
                <strong>SMTP Port:</strong> ${process.env.EMAIL_PORT}<br>
                <strong>From Email:</strong> ${process.env.EMAIL_FROM || process.env.EMAIL_USER}<br>
                <strong>From Name:</strong> ${process.env.EMAIL_FROM_NAME || 'MS Education'}
              </div>

              <h2>Next Steps:</h2>
              <ol>
                <li>Your email configuration is ready for production</li>
                <li>Test the newsletter subscription on your website</li>
                <li>Monitor email delivery in production</li>
              </ol>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                This is an automated test email sent from MS Education Newsletter System.<br>
                Timestamp: ${new Date().toISOString()}
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📧 Email sent to: ${recipientEmail}`);
    console.log('\n🎉 Your email configuration is working correctly!');
    console.log('You can now use the newsletter subscription feature.\n');

  } catch (error) {
    console.error('❌ Email test failed!\n');
    console.error('Error details:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed. Common solutions:');
      console.error('   - For Gmail: Use App Password, not your regular password');
      console.error('   - Generate App Password: https://myaccount.google.com/apppasswords');
      console.error('   - Make sure 2FA is enabled on your Google account');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n💡 Connection failed. Check:');
      console.error('   - SMTP host and port are correct');
      console.error('   - Your firewall allows outbound SMTP connections');
      console.error('   - Your internet connection is working');
    }
    
    process.exit(1);
  }
};

// Get recipient email from command line argument
const recipientEmail = process.argv[2];

if (!recipientEmail) {
  console.error('❌ Please provide a recipient email address');
  console.error('\nUsage: node scripts/test-email.js your-email@example.com\n');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(recipientEmail)) {
  console.error('❌ Invalid email address format');
  process.exit(1);
}

// Run the test
testEmail(recipientEmail);

