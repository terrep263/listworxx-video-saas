'use client';

import { Suspense, useState } from 'react';
import VideoGenerator from '../components/VideoGenerator';
import LandingPage from '../components/LandingPage';

function VideoGeneratorWrapper() {
  return <VideoGenerator />;
}

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading ListWorxx...</p>
          </div>
        </div>
      }
    >
      <VideoGeneratorWrapper />
    </Suspense>
  );
}
