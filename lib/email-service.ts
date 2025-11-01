import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@mseducation.in';
    this.fromName = process.env.EMAIL_FROM_NAME || 'MS Education';
  }

  private createTransporter(): nodemailer.Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    const config: EmailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || ''
      }
    };

    if (!config.auth.user || !config.auth.pass) {
      throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in environment variables.');
    }

    this.transporter = nodemailer.createTransport(config);
    return this.transporter;
  }

  async sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
    try {
      const transporter = this.createTransporter();
      
      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  // Beautiful welcome email template
  getWelcomeEmailTemplate(email: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MS Education Newsletter</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .logo-text {
          color: #ffffff;
          font-size: 24px;
          font-weight: bold;
        }
        .header-title {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          margin-bottom: 10px;
        }
        .header-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin: 0;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 20px;
          color: #1a1a1a;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #4a5568;
          margin-bottom: 30px;
        }
        .benefits {
          background: linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
        }
        .benefits-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 15px;
        }
        .benefit-item {
          display: flex;
          align-items: start;
          margin-bottom: 12px;
        }
        .benefit-icon {
          color: #667eea;
          font-size: 20px;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .benefit-text {
          font-size: 15px;
          color: #4a5568;
          line-height: 1.5;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-2px);
        }
        .footer {
          background-color: #1a202c;
          color: #a0aec0;
          padding: 30px;
          text-align: center;
        }
        .footer-text {
          font-size: 14px;
          margin-bottom: 15px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-link {
          display: inline-block;
          margin: 0 8px;
          color: #a0aec0;
          text-decoration: none;
          font-size: 14px;
        }
        .unsubscribe {
          font-size: 12px;
          color: #718096;
          margin-top: 20px;
        }
        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">
            <span class="logo-text">MS</span>
          </div>
          <h1 class="header-title">Welcome to MS Education!</h1>
          <p class="header-subtitle">Your Journey to Success Starts Here</p>
        </div>

        <!-- Content -->
        <div class="content">
          <p class="greeting">Hello, Future Achiever! 👋</p>
          
          <p class="message">
            Thank you for subscribing to the <strong>MS Education Newsletter</strong>! We're thrilled to have you as part of our learning community.
          </p>

          <p class="message">
            You've just taken an important step towards transforming your career and achieving your educational goals. We're committed to supporting you every step of the way!
          </p>

          <!-- Benefits Section -->
          <div class="benefits">
            <div class="benefits-title">📚 What You'll Receive:</div>
            
            <div class="benefit-item">
              <span class="benefit-icon">✨</span>
              <span class="benefit-text"><strong>Latest Course Updates:</strong> Be the first to know about new courses and special offers</span>
            </div>
            
            <div class="benefit-item">
              <span class="benefit-icon">🎯</span>
              <span class="benefit-text"><strong>Exam Notifications:</strong> Important dates, syllabus updates, and exam strategies</span>
            </div>
            
            <div class="benefit-item">
              <span class="benefit-icon">🏆</span>
              <span class="benefit-text"><strong>Success Stories:</strong> Inspiring journeys from students who achieved their dreams</span>
            </div>
            
            <div class="benefit-item">
              <span class="benefit-icon">💡</span>
              <span class="benefit-text"><strong>Study Tips & Resources:</strong> Expert advice and free study materials</span>
            </div>
            
            <div class="benefit-item">
              <span class="benefit-icon">🎓</span>
              <span class="benefit-text"><strong>Exclusive Content:</strong> Webinars, workshops, and career guidance sessions</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="https://mseducation.in/courses" class="cta-button">
              Explore Our Courses
            </a>
          </div>

          <div class="divider"></div>

          <p class="message" style="margin-bottom: 10px;">
            <strong>Need help getting started?</strong>
          </p>
          <p class="message">
            Our team is here to guide you. Feel free to reach out at 
            <a href="mailto:contact@mseducation.in" style="color: #667eea;">contact@mseducation.in</a>
          </p>

          <p class="message" style="font-style: italic; color: #718096;">
            "Education is the most powerful weapon which you can use to change the world." - Nelson Mandela
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="footer-text">
            <strong>MS Education</strong><br>
            Transforming Futures Through Quality Education
          </p>
          
          <div class="social-links">
            <a href="https://linkedin.com/company/mseducation.in" class="social-link">LinkedIn</a> •
            <a href="https://twitter.com/mseducation.in" class="social-link">Twitter</a> •
            <a href="https://youtube.com/@mseducation.in" class="social-link">YouTube</a>
          </div>

          <p class="footer-text">
            📧 <a href="mailto:contact@mseducation.in" style="color: #a0aec0;">contact@mseducation.in</a>
          </p>

          <p class="unsubscribe">
            You're receiving this email because you subscribed at mseducation.in<br>
            <a href="https://mseducation.in/unsubscribe?email=${encodeURIComponent(email)}" style="color: #718096;">Unsubscribe</a> from our newsletter
          </p>

          <p class="footer-text" style="margin-top: 20px;">
            © 2025 MS Education. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  async sendWelcomeEmail(email: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: '🎓 Welcome to MS Education - Your Success Journey Begins!',
      html: this.getWelcomeEmailTemplate(email)
    });
  }

  // Test email configuration
  async verifyConnection(): Promise<boolean> {
    try {
      const transporter = this.createTransporter();
      await transporter.verify();
      console.log('✅ Email server connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email server connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();

