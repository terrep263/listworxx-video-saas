# Listicle Video SaaS

A professional listicle video generator built with Next.js that converts text content into engaging TikTok/YouTube Shorts videos.

## Features

- 🎬 Generate slide-based listicle videos from text
- 🎨 Customizable title fonts and styling  
- 📱 Perfect for TikTok (9:16 aspect ratio)
- 🖼️ Support for image and video backgrounds
- 🎵 Background music support
- 📄 Automatic multi-page layouts for long lists
- 🎭 Smooth fade transitions and animations
- 💾 Direct .webm video download

## Pre-loaded Example

The app comes pre-loaded with your SnapWorxx listicle:
"10 Reasons I Love Giving the SNAPWORXX Gallery as a Gift"

## How to Use

1. **Edit Title**: Customize your listicle title and font size
2. **Add List Items**: Enter your list items (one per line)
3. **Upload Background** (Optional): Add an image or video background
4. **Add Music** (Optional): Upload background audio
5. **Preview**: Drag elements to adjust positioning
6. **Generate**: Click "Generate Video" to create your .webm file

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server  
npm start
```

## Deploy to Vercel

This project is ready to deploy to Vercel:

```bash
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Video Engine**: HTML5 Canvas + MediaRecorder API
- **Rendering**: Client-side (no backend needed)

## Future Enhancements

- [ ] User authentication (Supabase/Clerk)
- [ ] Save/load projects
- [ ] Template library
- [ ] Stripe payments integration
- [ ] Direct social media posting
- [ ] Team collaboration features
- [ ] White-label options

## License

Private - All rights reserved
