# 🤖 Luwi RAG ChatBot

Modern RAG (Retrieval-Augmented Generation) ChatBot for Tax Legislation built with Next.js, TypeScript & Claude AI.

![Luwi RAG ChatBot](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)

## ✨ Features

- 🚀 **Modern Tech Stack**: Next.js 14, TypeScript, React 18
- 🎨 **Glassmorphism UI**: Beautiful floating animations & zen design
- 💬 **Real-time Chat**: Instant messaging with typing indicators
- 🔗 **N8N Integration**: Seamless webhook connectivity
- 📱 **Responsive Design**: Works on all devices
- 🌟 **Production Ready**: Optimized for deployment

## 🎯 Demo

Experience the live chatbot interface with:
- Interactive welcome message
- Quick action buttons for common tax questions
- Smooth animations and transitions
- Real-time response system

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS3 with modern animations
- **Backend Integration**: N8N Webhook API
- **State Management**: React Hooks
- **Build Tool**: Next.js with SWC
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- N8N instance (for backend)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/umutluwi/luwi-ragchatbot.git
cd luwi-ragchatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your N8N webhook URL
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
luwi-ragchatbot/
├── app/
│   ├── api/chat/          # Chat API endpoint
│   ├── globals.css        # Global styles & animations
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat interface
├── public/                # Static assets
├── .env.example          # Environment template
├── next.config.js        # Next.js configuration
└── package.json          # Dependencies
```

## 🎨 Design Features

### Floating Animations
- 10 floating cubes with random timing
- Subtle gradients and transparency
- Smooth CSS3 animations

### Chat Interface
- Glassmorphism effects
- Responsive message bubbles
- Typing indicators with animated dots
- Quick action buttons

### Performance
- Server-side rendering
- Optimized bundle sizes
- Lazy loading
- Image optimization

## 🔧 Configuration

### Environment Variables

```env
# N8N Webhook URL
N8N_WEBHOOK_URL=http://localhost:5678/webhook/ragchat-pro-v2

# Application Settings
NEXT_PUBLIC_APP_NAME=Luwi RAG ChatBot
NEXT_PUBLIC_APP_VERSION=2.0.0
```

### N8N Integration

The chatbot integrates with N8N workflows via webhook:

- **Endpoint**: `POST /api/chat`
- **Payload**: `{ message: string, session_id: string }`
- **Response**: `{ response: string, session_id: string }`

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
```
Deploy to Vercel with one click.

### Docker
```bash
docker build -t luwi-ragchatbot .
docker run -p 3000:3000 luwi-ragchatbot
```

### Manual
```bash
npm run build
npm start
```

## 🎯 Use Cases

- **Tax Consultation**: Answer questions about tax legislation
- **Legal Advice**: Provide guidance on tax regulations
- **Documentation**: Help with tax form submissions
- **Educational**: Teach tax concepts and procedures

## 🔮 Roadmap

- [ ] **Dark Mode**: Toggle between light/dark themes
- [ ] **Voice Integration**: Speech-to-text input
- [ ] **Multi-language**: Support for multiple languages
- [ ] **Advanced Analytics**: User interaction tracking
- [ ] **Mobile App**: React Native version
- [ ] **API Rate Limiting**: Advanced request handling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💎 About Luwi Developments

**DREAM · DESIGN · DEVELOP**

We create innovative digital solutions that combine cutting-edge technology with beautiful design.

- 🌐 Website: [luwi.dev](https://luwi.dev)
- 💼 LinkedIn: [Luwi Developments](https://linkedin.com/company/luwi-developments)
- 📧 Contact: hello@luwi.dev

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Claude AI** for intelligent conversations
- **N8N Community** for workflow automation
- **Open Source Community** for inspiration

---

<div align="center">
  <strong>Built with ❤️ by Luwi Developments</strong>
  <br>
  <em>Modern RAG ChatBot for Tax Legislation</em>
</div>
