// Email Verification System for Free Trial

export interface EmailVerification {
  email: string;
  verificationCode: string;
  expiresAt: string;
  verified: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'listworxx_email_verification';
const CODE_EXPIRY_MINUTES = 15;

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Store email verification data
 */
export function storeEmailVerification(email: string, code: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const verification: EmailVerification = {
      email,
      verificationCode: code,
      expiresAt: new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000).toISOString(),
      verified: false,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(verification));
    return true;
  } catch (error) {
    console.error('Error storing email verification:', error);
    return false;
  }
}

/**
 * Get stored email verification data
 */
export function getEmailVerification(): EmailVerification | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: EmailVerification = JSON.parse(stored);

    // Check if expired
    if (new Date(data.expiresAt) < new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading email verification:', error);
    return null;
  }
}

/**
 * Verify the code entered by user
 */
export function verifyCode(enteredCode: string): boolean {
  const verification = getEmailVerification();
  
  if (!verification) return false;
  
  if (verification.verificationCode !== enteredCode) return false;

  // Mark as verified
  verification.verified = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(verification));
  
  return true;
}

/**
 * Check if user has verified email
 */
export function hasVerifiedEmail(): boolean {
  const verification = getEmailVerification();
  return verification?.verified || false;
}

/**
 * Send verification email (mock function - you'll need to implement real email sending)
 */
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  // For now, just log to console
  // In production, you'd call your email API here
  console.log('===========================================');
  console.log('VERIFICATION EMAIL (DEVELOPMENT MODE)');
  console.log('===========================================');
  console.log(`To: ${email}`);
  console.log(`Verification Code: ${code}`);
  console.log('===========================================');
  console.log('In production, this would send a real email');
  console.log('===========================================');
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
}

/**
 * Grant free trial after email verification
 */
export function grantFreeTrial(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const freeTrialKey = {
      key: 'freetrial_verified_1',
      type: 'usage',
      limit: 1,
      used: 0,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('listworxx_access', JSON.stringify(freeTrialKey));
    return true;
  } catch (error) {
    console.error('Error granting free trial:', error);
    return false;
  }
}
