'use client';

import { useState } from 'react';
import {
  isValidEmail,
  generateVerificationCode,
  storeEmailVerification,
  sendVerificationEmail,
  verifyCode,
  grantFreeTrial,
} from '../lib/emailVerification';

interface EmailGateProps {
  onVerified: () => void;
}

export default function EmailGate({ onVerified }: EmailGateProps) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const verificationCode = generateVerificationCode();
      storeEmailVerification(email, verificationCode);
      await sendVerificationEmail(email, verificationCode);
      setStep('code');
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    const isValid = verifyCode(code);

    if (!isValid) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    // Grant free trial access
    grantFreeTrial();
    onVerified();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            🎁 Try ListWorxx Free!
          </h1>
          <p className="text-lg text-gray-600">
            Get 1 free video by verifying your email
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-lg"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? '📧 Sending...' : '📧 Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                We sent a 6-digit code to:
              </p>
              <p className="font-bold text-primary">{email}</p>
              <p className="text-xs text-gray-600 mt-2">
                Check your inbox (and spam folder)
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-center text-2xl font-bold tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition text-lg"
            >
              ✓ Verify & Get Free Video
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-primary hover:underline text-sm"
            >
              ← Change email address
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t-2 border-gray-200">
          <p className="text-center text-gray-600 text-sm mb-4">
            Already have an access key?
          </p>
          <a
            href="?skip=true"
            className="block text-center text-primary hover:underline font-semibold"
          >
            Enter access key instead →
          </a>
        </div>
      </div>
    </div>
  );
}
