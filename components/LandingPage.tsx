

import React, { useState } from 'react';


export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    setEmailSubmitted(true);
    setSuccess(`Check your email! We sent a verification link to ${email}`);
    // TODO: Integrate with backend/email service
  };

  return (
    <div className="bg-white">
      {/* --- Hero Section --- */}
      <section className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Column - Value Prop & Form */}
          <div className="space-y-8 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-purple-700">Limited Time Offer</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight heading-font">
                Create Your First<br />
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Viral Listicle Video
                </span><br />
                Free
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Turn your lists into engaging TikTok & YouTube Shorts videos in under 60 seconds. No credit card required.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 slide-up delay-2">
              <form id="emailForm" className="space-y-4" onSubmit={handleEmailSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter your email to get started
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-lg"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={emailSubmitted}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-cta w-full py-4 text-white font-bold text-lg rounded-xl"
                  disabled={emailSubmitted}
                >
                  {emailSubmitted ? 'Email Sent!' : 'Get My Free Video Credit →'}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  We'll email you a verification link to create your video
                </p>
                {error && <div className="text-red-500 font-semibold text-center">{error}</div>}
                {success && <div className="text-green-500 font-semibold text-center">{success}</div>}
              </form>
            </div>
            <div className="flex items-center gap-6 pt-4 fade-in delay-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Instant access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">No download</span>
              </div>
            </div>
          </div>
          {/* Right Column - Video Phone Mockup */}
          <div className="relative fade-in delay-1">
            <div className="video-phone max-w-sm mx-auto float">
              <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-2">10 Reasons</h3>
                    <p className="text-lg opacity-90">To Try ListWorxx</p>
                  </div>
                  <div className="space-y-4 w-full">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-bold">1</span>
                        <span className="text-sm">Creates videos in 60 seconds</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-bold">2</span>
                        <span className="text-sm">Perfect for TikTok & Shorts</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-bold">3</span>
                        <span className="text-sm">No video editing skills needed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -left-8 w-20 h-20 bg-purple-300 rounded-full blur-2xl opacity-60"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-300 rounded-full blur-2xl opacity-60"></div>
          </div>
        </div>
      </section>
      {/* --- Features Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 heading-font">What You Get With Your Free Credit</h2>
            <p className="text-lg text-gray-600">Everything you need to create professional listicle videos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* --- Feature Cards --- */}
            {/* Each card follows the HTML structure, with SVG and text */}
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 feature-icon rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">9:16 Vertical Format</h3>
              <p className="text-gray-600">Perfect dimensions for TikTok, Instagram Reels, and YouTube Shorts</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 feature-icon rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Backgrounds</h3>
              <p className="text-gray-600">Upload your own images or videos as backgrounds for your listicle</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 feature-icon rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Download</h3>
              <p className="text-gray-600">Download your video as .webm and start posting immediately</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 feature-icon rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Background Music</h3>
              <p className="text-gray-600">Add your own music tracks to make your videos more engaging</p>
            </div>
            {/* Card 5 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 feature-icon rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Drag & Drop Text</h3>
              <p className="text-gray-600">Position your text exactly where you want it on each frame</p>
            </div>
            {/* Card 6 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 feature-icon rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Watermark</h3>
              <p className="text-gray-600">Your free video comes without any ListWorxx branding</p>
            </div>
          </div>
        </div>
      </section>
      {/* --- How It Works --- */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 heading-font">How It Works</h2>
            <p className="text-lg text-gray-600">From email to video in 3 simple steps</p>
          </div>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">1</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Email</h3>
                <p className="text-gray-600">We'll send you a verification link to confirm it's really you</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">2</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Click Your Link</h3>
                <p className="text-gray-600">Open the email and click the link to access ListWorxx with your free credit</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">3</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create & Download</h3>
                <p className="text-gray-600">Enter your list content, customize your video, and download in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- Example Videos Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 heading-font">Perfect For Any List</h2>
            <p className="text-lg text-gray-600">Create engaging videos for any topic</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="text-3xl mb-3">🏢</div>
              <h4 className="font-bold text-gray-900 mb-2">Business</h4>
              <p className="text-sm text-gray-600">"5 Reasons to Choose Us"</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="text-3xl mb-3">🏠</div>
              <h4 className="font-bold text-gray-900 mb-2">Real Estate</h4>
              <p className="text-sm text-gray-600">"Top 10 Homes This Week"</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-gray-900 mb-2">Marketing</h4>
              <p className="text-sm text-gray-600">"7 Tips to Boost Sales"</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="text-3xl mb-3">🎉</div>
              <h4 className="font-bold text-gray-900 mb-2">Events</h4>
              <p className="text-sm text-gray-600">"10 Best Moments"</p>
            </div>
          </div>
        </div>
      </section>
      {/* --- Final CTA --- */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 heading-font">Ready to Create Your First Video?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of creators making viral content with ListWorxx</p>
          <button
            className="inline-block px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:shadow-2xl transition-all"
            onClick={() => document.getElementById('email')?.focus()}
          >
            Get Started Free →
          </button>
          <p className="text-sm mt-6 opacity-75">No credit card • Instant access • Cancel anytime</p>
        </div>
      </section>
      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold mb-4 heading-font">ListWorxx</div>
              <p className="text-gray-400 text-sm">Create viral listicle videos in seconds</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2024 ListWorxx. From the makers of SnapWorxx.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
