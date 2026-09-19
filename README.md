# Creora — AI Content Studio

Creora is an AI-powered content creation studio designed to help creators turn a single idea and image into structured, ready-to-edit short-form social media videos.

The project focuses on creating content for platforms such as TikTok, Instagram Reels, and YouTube Shorts.

## Overview

Creora helps creators generate:

- Video concepts
- Hooks
- Scene-by-scene scripts
- Visual prompts
- Camera motion suggestions
- Social captions
- Hashtags
- Full vertical video previews
- MP4 exports

The application currently uses local AI and local video rendering, avoiding paid APIs during development.

## Current Features

- AI content generation with Ollama
- Local model using `qwen2.5:3b`
- Creator profile / description input
- Video prompt input
- Platform selection
- Video duration selection
- Video style selection
- AI-generated hook
- AI-generated scene structure
- Scene durations
- Scene scripts
- Visual prompts
- Camera motion per scene
- Motion speed per scene
- Individual scene preview
- Edit visual prompt
- Edit full script
- Regenerate individual scenes
- Add custom scenes
- Full video preview
- Vertical 9:16 video format
- Remotion-based video animation
- MP4 export
- H.264 rendering
- Social media caption generation
- Hashtag generation

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### AI

- Ollama
- Qwen 2.5 3B

### Video

- Remotion
- `@remotion/player`
- `@remotion/renderer`
- `@remotion/bundler`
- `@remotion/cli`

## How It Works

The current workflow is:

1. Upload an image
2. Describe the creator
3. Describe the video idea
4. Select a platform
5. Select a video duration
6. Select a video style
7. Generate the video structure with local AI
8. Review the generated hook and scenes
9. Edit scripts or visual prompts
10. Preview individual scenes
11. Preview the complete video
12. Export the final video as MP4

## Video Structure

A generated video is divided into multiple scenes.

Example:

```text
Scene 1 — Hook
0s–2s

Scene 2 — Getting Ready
2s–5s

Scene 3 — Product Close-Up
5s–8s

Scene 4 — Application
8s–11s

Scene 5 — Final Look
11s–13s

Scene 6 — CTA
13s–15s

Each scene can contain:

Title
Start time
End time
Script
Visual prompt
Camera motion
Motion speed
Supported Camera Motion

Currently supported scene motions:

zoom-in
zoom-out
pan-left
pan-right
static

Motion speeds:

slow
medium
fast
Local AI

Creora currently uses Ollama locally.

Recommended model:

qwen2.5:3b

Ollama endpoint:

http://localhost:11434/api/generate

This allows the content-generation system to run locally without requiring a paid AI API.

Video Rendering

Creora uses Remotion to create video previews and MP4 exports.

Current output format:

Resolution: 1080 × 1920
Aspect Ratio: 9:16
Frame Rate: 30 FPS
Codec: H.264
Format: MP4
Project Structure
src
├── app
│   ├── api
│   │   ├── generate-content
│   │   │   └── route.ts
│   │   ├── regenerate-scene
│   │   │   └── route.ts
│   │   └── export-video
│   │       └── route.ts
│   │
│   └── page.tsx
│
├── components
│   ├── creator
│   │   └── CreatorInputPanel.tsx
│   │
│   ├── dashboard
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── StepProgress.tsx
│   │
│   ├── editor
│   │   ├── EditorControls.tsx
│   │   ├── ScriptPanel.tsx
│   │   └── VideoPreview.tsx
│   │
│   └── video
│       ├── SceneComposition.tsx
│       ├── ScenePlayer.tsx
│       ├── FullVideoComposition.tsx
│       └── FullVideoPlayer.tsx
│
└── remotion
    ├── index.ts
    └── Root.tsx
Getting Started

Clone the repository:

git clone YOUR_REPOSITORY_URL

Enter the project:

cd creora

Install dependencies:

npm install

Start Ollama:

ollama serve

Make sure the model is installed:

ollama pull qwen2.5:3b

Run the development server:

npm run dev

Open:

http://localhost:3000
Remotion

To check available Remotion compositions:

npx remotion compositions src/remotion/index.ts

The main composition is:

CreoraFullVideo
Current Development Stage

Creora is currently an MVP under active development.

The current version can generate scripts, build scenes, animate uploaded images, preview the complete video, and export the result as an MP4.

At this stage, all scenes can still use the same uploaded image.

Planned Features
Different image for each scene
Upload / replace image per scene
AI-generated scene images
Creator-focused scenes
Product-focused scenes
Automatic scene image selection
Scene transitions
Animated captions
Voiceover
Background music
Audio controls
Branding
Logo overlays
Editable project titles
Scene reordering
Scene deletion
Timeline editor
Export settings
Project saving
Templates
User accounts
Project dashboard
Cloud storage
Creator profiles
Multiple video formats
Future Vision

The long-term goal is for Creora to generate complete creator-style videos from a simple prompt.

For example, a user could request:

Create a 15-second luxury perfume video.

Show the creator getting ready for dinner,
holding the perfume,
applying it to her wrist,
and showing the final look.

Creora could then automatically create:

Hook
↓
Creator getting ready
↓
Product close-up
↓
Creator using the product
↓
Final look
↓
Call to action

Each scene could eventually contain its own generated visual or video clip.

Development Philosophy

The current development approach focuses on:

Keeping the architecture simple
Building features incrementally
Prioritizing local tools where possible
Avoiding unnecessary API costs
Creating a clean creator-friendly workflow
Maintaining editable AI output
Keeping the final user in control of generated content
Status

In active development.

Creora is not yet production-ready.

Built with Next.js, Ollama, and Remotion.