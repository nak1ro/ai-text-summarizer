# 🧠 AI Text Summarizer & Explainer

A modern, fast, and beautiful web application that uses AI to analyze and summarize text. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## ✨ Features

- **📝 Text Input**: Paste or type up to 5,000 characters of text
- **⚡ One-Click Analysis**: Get instant AI-powered insights
- **📊 Rich Results Display**: 
  - Concise Summary
  - Key Points (bullet list)
  - Simple Explanation (ELI5-style)
  - Estimated Reading Time
- **🎨 Modern UI**: Clean, responsive design with dark mode support
- **💰 Cost-Efficient**: Uses GPT-4o-mini for fast, affordable analysis
- **⌨️ Keyboard Shortcuts**: Ctrl/Cmd + Enter to analyze

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

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
```

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
- **Font**: Geist Sans & Geist Mono

## 📡 API Reference

### POST /api/analyze

Analyzes text and returns structured insights.

**Request Body:**
```json
{
  "text": "Your text to analyze..."
}
```

**Response:**
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
    "readingTime": 3
  }
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
- Maximum 5,000 characters

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

- Use Ctrl+Enter (Cmd+Enter on Mac) for quick analysis
- Shorter texts analyze faster
- Try different types of content: articles, emails, code explanations, etc.

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [OpenAI](https://openai.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
