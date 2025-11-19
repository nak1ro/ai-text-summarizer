# 🧠 AI Text Summarizer & Explainer

A modern, fast, and beautiful web application that uses AI to analyze and summarize text. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## ✨ Features

- **🎛️ Multi-Mode Input System**: Easy tab-based switching between input methods
  - **Text Mode**: Direct text input
  - **Image Mode**: Upload or paste images with OCR
  - **Document Mode**: Extract and analyze text from PDF, DOCX, and TXT files
  - **YouTube Mode**: Extract and analyze video transcripts from YouTube
- **📝 Text Input**: Paste or type up to 50,000 characters of text
- **📷 Image Upload & Paste**: Upload or paste images with text (OCR support via OpenAI Vision)
  - **Ctrl+V / Cmd+V**: Paste images directly from clipboard
  - Click to upload from file system
  - Automatic text extraction from images
  - Support for various image formats (JPG, PNG, etc.)
  - Max image size: 5MB
  - Shows error if no text is detected in the image
- **📄 Document Support**: Extract text from PDF, DOCX, DOC, and TXT files
  - Drag & drop or click to upload
  - **Ctrl+V / Cmd+V**: Paste documents directly from clipboard
  - Support for multiple formats (PDF, DOCX, TXT)
  - Max document size: 10MB
  - Automatic text extraction and analysis
- **🎬 YouTube Support**: Extract and analyze video transcripts
  - Paste any YouTube video URL
  - Automatic transcript fetching via SearchAPI
  - Works with videos that have captions/subtitles
  - Full transcript analysis with AI
- **⚡ One-Click Analysis**: Get instant AI-powered insights
- **📊 Rich Results Display**: 
  - Concise Summary
  - Key Points (bullet list)
  - Simple Explanation (ELI5-style)
  - Reading Time & Stats (estimated time + word count + reading level)
- **🎨 Modern UI**: Clean, responsive design with light/dark mode toggle
  - Manual theme switcher in the header
  - Automatic system preference detection
  - Theme persists across sessions
- **🌍 Multi-Language Support**: Available in 5 languages
  - 🇬🇧 English
  - 🇪🇸 Spanish (Español)
  - 🇩🇪 German (Deutsch)
  - 🇫🇷 French (Français)
  - 🇵🇱 Polish (Polski)
  - Automatic browser language detection
  - Language preference saved to localStorage
- **💰 Cost-Efficient**: Uses GPT-4o-mini for fast, affordable analysis
- **⌨️ Keyboard Shortcuts**: Ctrl/Cmd + Enter to analyze

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- SearchAPI API key for YouTube transcripts ([Get one here](https://www.searchapi.io/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-tool
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
SEARCHAPI_API_KEY=your_searchapi_api_key_here
```

> **Note**: SearchAPI key is only required if you want to use the YouTube transcript feature. Text, image, and document analysis work without it.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
ai-tool/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for text analysis
│   ├── globals.css                # Global styles and animations
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Main application page
├── components/
│   ├── AnalysisResults.tsx        # Results display component
│   └── ResultCard.tsx             # Individual result card component
├── lib/
│   └── utils.ts                   # Utility functions
├── types/
│   └── index.ts                   # TypeScript type definitions
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI GPT-4o-mini
- **Document Parsing**: pdfreader, mammoth
- **YouTube Transcripts**: SearchAPI
- **HTTP Client**: Axios
- **Font**: Geist Sans & Geist Mono

## 📡 API Reference

### POST /api/analyze

Analyzes text or extracts and analyzes text from images.

**Request Body (Text):**
```json
{
  "text": "Your text to analyze..."
}
```

**Request Body (Image):**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Base64 encoded image
}
```

**Request Body (Document):**
```json
{
  "document": "data:application/pdf;base64,...", // Base64 encoded document
  "documentName": "example.pdf" // Filename with extension
}
```

**Request Body (YouTube):**
```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Concise summary of the text",
    "keyPoints": [
      "First key point",
      "Second key point",
      "Third key point"
    ],
    "explanation": "Simple explanation of the content",
    "readingTime": 3,
    "wordCount": 542,
    "readingLevel": "7th grade (easy to understand)"
  },
  "extractedText": "Text extracted from image (only if image was uploaded)"
}
```

**Error Response (No Text in Image):**
```json
{
  "success": false,
  "error": "No text was found in the uploaded image. Please upload an image containing text."
}
```

## 🎯 Use Cases

- Students summarizing study materials
- Professionals cleaning up notes
- Readers wanting quick content digestion
- Writers analyzing drafts
- Anyone needing fast, structured text understanding

## 🎨 Features in Detail

### Character Counter
- Real-time character count with visual progress bar
- Color-coded warnings (orange at 90%, red at 100%)
- Maximum 50,000 characters

### Error Handling
- Input validation
- API error handling
- User-friendly error messages

### Responsive Design
- Works seamlessly on desktop and mobile
- Optimized for all screen sizes
- Dark mode support

## 🔧 Development

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Tips

### General
- **Ctrl+V / Cmd+V**: Paste images and documents directly from clipboard
- **Ctrl+Enter / Cmd+Enter**: Quick text analysis shortcut
- Shorter texts analyze faster

### Image Mode
- Upload images containing text (screenshots, documents, signs, etc.)
- Supported image formats: JPG, PNG, GIF, WebP
- Max size: 5MB
- For best OCR results, use clear, high-contrast images
- Take a screenshot (Windows: Win+Shift+S, Mac: Cmd+Shift+4) and paste directly!

### Document Mode
- Supported formats: PDF, DOCX, DOC, TXT
- Max size: 10MB
- Drag & drop or click to upload
- Paste documents directly with Ctrl+V

### YouTube Mode
- Works with any YouTube video URL (youtube.com or youtu.be)
- Video must have captions/subtitles available
- Analyzes the entire transcript automatically
- Great for summarizing lectures, tutorials, and talks

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [OpenAI](https://openai.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
