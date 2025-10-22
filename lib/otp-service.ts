import connectDB from '@/lib/db';
import OTP from '@/lib/models/OTP';

class OTPService {
  // Store OTP in database
  async setOTP(mobile: string, otp: string, expiryMinutes: number = 5): Promise<void> {
    await connectDB();
    
    const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
    
    // Delete any existing OTP for this mobile number
    await OTP.deleteOne({ mobile });
    
    // Create new OTP record
    const otpRecord = new OTP({
      mobile,
      otp,
      expiry,
      attempts: 0
    });
    
    await otpRecord.save();
    
    console.log(`OTP stored for ${mobile}: ${otp}, expires at: ${expiry.toLocaleString()}`);
  }

  // Get OTP from database
  async getOTP(mobile: string): Promise<{ otp: string; expiry: Date; attempts: number } | null> {
    await connectDB();
    
    const otpRecord = await OTP.findOne({ mobile });
    
    if (!otpRecord) {
      console.log(`No OTP found for ${mobile}`);
      return null;
    }

    // Check if expired
    if (new Date() > otpRecord.expiry) {
      await OTP.deleteOne({ mobile });
      console.log(`OTP expired for ${mobile}`);
      return null;
    }

    return {
      otp: otpRecord.otp,
      expiry: otpRecord.expiry,
      attempts: otpRecord.attempts
    };
  }

  // Verify OTP
  async verifyOTP(mobile: string, enteredOTP: string): Promise<{ success: boolean; message: string }> {
    await connectDB();
    
    const otpRecord = await OTP.findOne({ mobile });
    
    if (!otpRecord) {
      return { success: false, message: 'OTP not found or expired' };
    }

    // Check if expired
    if (new Date() > otpRecord.expiry) {
      await OTP.deleteOne({ mobile });
      return { success: false, message: 'OTP has expired' };
    }

    // Check attempt limit
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ mobile });
      return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    if (otpRecord.otp !== enteredOTP) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
      return { success: false, message: 'Invalid OTP' };
    }

    // OTP is correct, delete it
    await OTP.deleteOne({ mobile });
    return { success: true, message: 'OTP verified successfully' };
  }

  // Delete OTP (for cleanup)
  async deleteOTP(mobile: string): Promise<void> {
    await connectDB();
    await OTP.deleteOne({ mobile });
  }

  // Get all OTPs (for debugging)
  async getAllOTPs(): Promise<Array<{ mobile: string; otp: string; expiry: Date; attempts: number }>> {
    await connectDB();
    const otps = await OTP.find({});
    return otps.map(otp => ({
      mobile: otp.mobile,
      otp: otp.otp,
      expiry: otp.expiry,
      attempts: otp.attempts
    }));
  }

  // Clean expired OTPs
  async cleanExpired(): Promise<void> {
    await connectDB();
    const now = new Date();
    const result = await OTP.deleteMany({ expiry: { $lt: now } });
    if (result.deletedCount > 0) {
      console.log(`Cleaned ${result.deletedCount} expired OTPs`);
    }
  }
}

// Create singleton instance
const otpService = new OTPService();

export default otpService;

