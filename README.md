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

##Each scene can contain:

Title
Start time
End time
Script
Visual prompt
Camera motion
Motion speed
Supported Camera Motion

Currently supported scene motions:
```text
zoom-in
zoom-out
pan-left
pan-right
static
