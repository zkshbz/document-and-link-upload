# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite single-page application for uploading documents and adding links. The app is configured for GitHub Pages deployment at the base path `/document-and-link-upload/`.

The main application is located in the `file-upload-app/` subdirectory.

## Key Commands

All commands should be run from the `file-upload-app/` directory:

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint linter
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Single Component Design
The entire UI is contained in `src/App.jsx` - a single React component with no external state management. All state is managed using React hooks:
- `useState` for local state management (files list, active tab, form inputs)
- `useRef` for direct DOM access (hidden file input)

### Core Features
The app supports two upload modes via tabs:
1. **File Upload (Dosya)**: Upload local files with type validation (PDF, Word, Excel, Image, Zip) and size limits
2. **Link Upload (Bağlantı)**: Add external URLs with custom short names

### State Management
All state is local to the App component:
- `files`: Array of uploaded items (both files and URLs)
- `activeTab`: Current tab ('dosya' or 'baglanti')
- `fileType`: Selected file type for validation
- `shortName`: Optional short name for items
- `urlInput`: URL input for link tab
- `showError`: Error message display
- `isCollapsed`: Collapsible UI state

### File Handling
- Files are stored as JavaScript File objects in state
- Download action uses `URL.createObjectURL()` for client-side file downloads
- Links open in new tabs via `window.open()`

## Deployment

The app is configured for GitHub Pages deployment:
- Base path set to `/document-and-link-upload/` in `vite.config.js`
- Uses `gh-pages` package to deploy the `dist/` folder
- Run `npm run deploy` to build and deploy automatically
