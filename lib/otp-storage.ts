// Shared OTP storage for the application
// In production, use Redis or database for persistence across server restarts

interface OTPData {
  otp: string;
  expiry: Date;
  attempts: number;
}

class OTPStorage {
  private storage = new Map<string, OTPData>();

  // Store OTP with expiry
  setOTP(mobile: string, otp: string, expiryMinutes: number = 5): void {
    const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
    this.storage.set(mobile, {
      otp,
      expiry,
      attempts: 0
    });
    
    console.log(`OTP stored for ${mobile}: ${otp}, expires at: ${expiry.toLocaleString()}`);
  }

  // Get OTP data
  getOTP(mobile: string): OTPData | null {
    const data = this.storage.get(mobile);
    if (!data) return null;

    // Check if expired
    if (new Date() > data.expiry) {
      this.storage.delete(mobile);
      console.log(`OTP expired for ${mobile}`);
      return null;
    }

    return data;
  }

  // Verify OTP
  verifyOTP(mobile: string, enteredOTP: string): { success: boolean; message: string } {
    const data = this.getOTP(mobile);
    
    if (!data) {
      return { success: false, message: 'OTP not found or expired' };
    }

    // Check attempt limit (optional security feature)
    if (data.attempts >= 3) {
      this.storage.delete(mobile);
      return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    if (data.otp !== enteredOTP) {
      data.attempts++;
      return { success: false, message: 'Invalid OTP' };
    }

    // OTP is correct, delete it
    this.storage.delete(mobile);
    return { success: true, message: 'OTP verified successfully' };
  }

  // Delete OTP (for cleanup)
  deleteOTP(mobile: string): void {
    this.storage.delete(mobile);
  }

  // Get all stored OTPs (for debugging)
  getAllOTPs(): Array<{ mobile: string; data: OTPData }> {
    return Array.from(this.storage.entries()).map(([mobile, data]) => ({ mobile, data }));
  }

  // Clean expired OTPs
  cleanExpired(): void {
    const now = new Date();
    for (const [mobile, data] of this.storage.entries()) {
      if (now > data.expiry) {
        this.storage.delete(mobile);
        console.log(`Cleaned expired OTP for ${mobile}`);
      }
    }
  }
}

// Create singleton instance
const otpStorage = new OTPStorage();

// Clean expired OTPs every 5 minutes
setInterval(() => {
  otpStorage.cleanExpired();
}, 5 * 60 * 1000);

export default otpStorage;
