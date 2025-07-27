# Deployment Guide

## 🚀 Deployment Options

### GitHub Pages (Static - Chatbot Disabled)
- **Security**: Chatbot automatically disabled (no API keys exposed)
- **Setup**: Push to GitHub, enable Pages in repository settings
- **URL**: `https://username.github.io/repository-name`

### Vercel (Recommended - Full Features)
- **Security**: API keys handled securely via environment variables
- **Setup**: 
  1. Connect GitHub repository to Vercel
  2. Add environment variables in Vercel Dashboard
  3. Deploy

## 🔑 Environment Variables (Vercel)

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
```
**OR**
```
OPENAI_API_KEY=your_openai_api_key_here
```

## 🛡️ Security Features

- ✅ API keys never exposed in client-side code
- ✅ Automatic chatbot disabling on insecure deployments
- ✅ Build-time environment variable injection for Vercel
- ✅ No sensitive data in repository

## 📋 Deployment Checklist

### For Vercel:
- [ ] Repository connected to Vercel
- [ ] Environment variables added in Vercel Dashboard
- [ ] Build command set (automatic via package.json)
- [ ] Deploy and test chatbot functionality

### For GitHub Pages:
- [ ] Repository pushed to GitHub
- [ ] Pages enabled in repository settings
- [ ] Verify chatbot is properly hidden (security check)

## 🔧 Local Development

1. Copy `.env.example` to `.env`
2. Add your API key to `.env`
3. Open `index.html` in browser
4. Chatbot should work with your local API key

## 🌐 Live URLs

- **Vercel**: https://your-project.vercel.app (Full features)
- **GitHub Pages**: https://username.github.io/repo (Static only)