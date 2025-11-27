'use client';

export default function PurchaseGate() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            ListWorxx
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2">
            Turn Lists Into Viral Videos
          </p>
          <p className="text-lg text-white/70">
            Create professional listicle videos for TikTok & YouTube Shorts in minutes
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Starter Pack */}
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary mb-2">Starter</h3>
              <div className="text-4xl font-bold text-primary mb-1">$10</div>
              <p className="text-gray-600 mb-6">Perfect for testing</p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">10 Videos</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Custom backgrounds</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Background music</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Instant download</span>
                </div>
              </div>

              <a
                href="https://thrivecart.com/your-product-link-here"
                className="block w-full bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg text-lg"
              >
                🚀 Get Started
              </a>
            </div>
          </div>

          {/* Creator Pack - Most Popular */}
          <div className="bg-accent rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-white text-accent px-4 py-1 rounded-full text-sm font-bold shadow-md">
                MOST POPULAR
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Creator</h3>
              <div className="text-4xl font-bold text-white mb-1">$39</div>
              <p className="text-white/80 mb-6">Best value per video</p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white font-bold">50 Videos</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Everything in Starter</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Priority support</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Only $0.78/video</span>
                </div>
              </div>

              <a
                href="https://thrivecart.com/your-product-link-here"
                className="block w-full bg-white text-accent font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg text-lg"
              >
                🚀 Get Started Now
              </a>
            </div>
          </div>

          {/* Weekly Pass */}
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary mb-2">Weekly</h3>
              <div className="text-4xl font-bold text-primary mb-1">$19</div>
              <p className="text-gray-600 mb-6">7 days unlimited</p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-bold">Unlimited Videos</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">7 days access</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">All features</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Great for campaigns</span>
                </div>
              </div>

              <a
                href="https://thrivecart.com/your-product-link-here"
                className="block w-full bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg text-lg"
              >
                🚀 Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            What You Get
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-bold mb-2">Lightning Fast</h3>
              <p className="text-white/80 text-sm">Generate videos in under 60 seconds</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <h3 className="font-bold mb-2">Fully Customizable</h3>
              <p className="text-white/80 text-sm">Your branding, your style, your content</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <h3 className="font-bold mb-2">TikTok Ready</h3>
              <p className="text-white/80 text-sm">Perfect 9:16 format for all platforms</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm">
          <p>From the makers of SnapWorxx</p>
          <p className="mt-2">Questions? Email support@listworxx.com</p>
        </div>
      </div>
    </div>
  );
}
