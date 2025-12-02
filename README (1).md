# AI Text Summarizer & Explainer

A web app that uses AI to analyze and summarize text. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

**Multiple Input Methods**
- Text mode: paste or type text directly
- Image mode: upload or paste images with OCR text extraction
- Document mode: extract text from PDF, DOCX, DOC, and TXT files
- YouTube mode: extract and analyze video transcripts

**Text Analysis**
- Paste up to 50,000 characters
- Get a concise summary, key points, and simple explanation
- Reading time estimates and word count stats
- Reading complexity analysis

**Image Support**
- Upload images or paste with Ctrl+V / Cmd+V
- Automatic text extraction via OCR
- Supports JPG, PNG, GIF, WebP (max 5MB)
- Shows error if no text is found

**Document Support**
- Drag and drop or click to upload
- Paste documents with Ctrl+V / Cmd+V
- Supports PDF, DOCX, DOC, TXT (max 10MB)
- Automatic text extraction

**YouTube Transcripts**
- Paste any YouTube video URL
- Fetches transcripts automatically
- Works with videos that have captions/subtitles

**UI Features**
- Light and dark mode with manual toggle
- System preference detection
- Theme persists across sessions
- Responsive design for mobile and desktop

**Multi-Language Support**
Available in English, Spanish, German, French, and Polish. Automatically detects your browser language and saves your preference.

**Keyboard Shortcuts**
- Ctrl+Enter / Cmd+Enter: analyze text
- Ctrl+V / Cmd+V: paste images or documents

Uses GPT-4o-mini for fast and affordable analysis.

## Getting Started

**Prerequisites**
- Node.js 18 or higher
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- SearchAPI key for YouTube transcripts ([get one here](https://www.searchapi.io/)) - optional, only needed for YouTube feature

**Installation**

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

Note: The SearchAPI key is only required if you want to use the YouTube transcript feature. Text, image, and document analysis work without it.

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Project Structure

```
ai-tool/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for analysis
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page
├── components/
│   ├── AnalysisResults.tsx        # Results display
│   ├── AnalysisHistory.tsx        # History modal
│   ├── AnalysisSettings.tsx       # Settings component
│   └── shared/                    # Shared components
├── hooks/
│   ├── useAnalysisHistory.ts      # History management
│   ├── useFileUpload.ts           # File upload logic
│   └── useTranslation.ts          # Translation hook
├── lib/
│   ├── utils.ts                   # Utility functions
│   ├── translations.ts            # Translation strings
│   ├── storage.ts                 # LocalStorage utilities
│   └── errors.ts                  # Error handling
├── contexts/
│   ├── LanguageContext.tsx        # Language context
│   └── ThemeContext.tsx           # Theme context
└── types/
    └── index.ts                   # TypeScript types
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- OpenAI GPT-4o-mini
- pdfreader, mammoth for document parsing
- SearchAPI for YouTube transcripts
- Axios for HTTP requests

## API Reference

**POST /api/analyze**

Analyzes text or extracts and analyzes text from images, documents, or YouTube videos.

**Request Body (Text):**
```json
{
  "text": "Your text to analyze...",
  "summaryLength": "medium",
  "analysisStyle": "casual"
}
```

**Request Body (Image):**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Request Body (Document):**
```json
{
  "document": "data:application/pdf;base64,...",
  "documentName": "example.pdf"
}
```

**Request Body (YouTube):**
```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=..."
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Concise summary",
    "keyPoints": ["Point 1", "Point 2"],
    "explanation": "Simple explanation",
    "readingTime": 3,
    "wordCount": 542,
    "readingLevel": "7th grade (easy to understand)",
    "speakingTime": 4,
    "uniqueWords": 120,
    "averageSentenceLength": 15,
    "topWords": [{"word": "example", "count": 5}]
  },
  "extractedText": "Text extracted from image/document"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Use Cases

- Students summarizing study materials
- Professionals cleaning up notes
- Quick content digestion
- Analyzing drafts
- Fast text understanding

## Development

**Build for production:**
```bash
npm run build
npm start
```

**Linting:**
```bash
npm run lint
```

## Tips

**General**
- Use Ctrl+V / Cmd+V to paste images and documents directly
- Ctrl+Enter / Cmd+Enter for quick analysis
- Shorter texts analyze faster

**Image Mode**
- Works best with clear, high-contrast images
- Take a screenshot (Win+Shift+S on Windows, Cmd+Shift+4 on Mac) and paste directly
- Supported formats: JPG, PNG, GIF, WebP
- Max size: 5MB

**Document Mode**
- Supported formats: PDF, DOCX, DOC, TXT
- Max size: 10MB
- Drag and drop or paste with Ctrl+V

**YouTube Mode**
- Works with any YouTube video URL
- Video must have captions/subtitles
- Analyzes the entire transcript

## License

MIT License

## Contributing

Contributions, issues, and feature requests are welcome.

## Acknowledgments

Built with Next.js, powered by OpenAI, styled with Tailwind CSS.
