# 📚 Dev Handbook

> Personal tech knowledge base covering Frontend, Backend, DevOps, and practical development tips

🌐 **Live Site**: [https://tuanlee-tech.github.io/dev-handbook](https://tuanlee-tech.github.io/dev-handbook)

---

## 📖 What's Inside

This handbook contains my personal notes, guides, and best practices across various tech domains:

### ⚛️ **Frontend Development**

- **React**: Hooks, patterns, performance, React 18/19 features
- **Vue**: Composition API, reactivity system
- **JavaScript/TypeScript**: Modern ES6+, async programming, type safety
- **HTML/CSS**: Flexbox, Grid, responsive design, Tailwind CSS

### 🔧 **Backend Development**

- **Node.js**: Express, NestJS, middleware patterns
- **Python**: FastAPI, Django basics
- **Databases**: PostgreSQL, MongoDB, Redis
- **APIs**: REST, GraphQL, authentication

### 🐳 **DevOps & Infrastructure**

- **Docker**: Dockerfile best practices, Docker Compose, multi-stage builds
- **CI/CD**: GitHub Actions, GitLab CI pipelines
- **Kubernetes**: Basic concepts, deployments
- **Server**: Nginx, deployment strategies

### 🛠️ **Tools & Productivity**

- **Git**: Workflows, common commands, troubleshooting
- **VSCode**: Extensions, shortcuts, settings
- **Terminal**: Bash/Zsh tricks, productivity tips

---

## 🚀 Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) - Fast, Vue-powered static site generator
- **Styling**: Markdown + Custom components
- **Deployment**: GitHub Pages
- **Language**: Vietnamese (content) / English (structure)

---

## 🏗️ Project Structure

```
dev-handbook/
├── .vitepress/
│   ├── config.mts          # VitePress configuration
│   └── theme/              # Custom theme (if any)
├── frontend/
│   ├── index.md
│   ├── html-css/
│   ├── javascript/
│   ├── react/
│   └── vue/
├── backend/
│   ├── index.md
│   ├── nodejs/
│   ├── python/
│   └── databases/
├── devops/
│   ├── index.md
│   ├── docker/
│   ├── ci-cd/
│   └── kubernetes/
├── tools-tips/
│   ├── index.md
│   ├── git/
│   ├── vscode/
│   └── terminal/
├── index.md                # Homepage
├── getting-started.md
├── roadmap.md
└── package.json
```

---

## 💻 Local Development

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tuanlee-tech/dev-handbook.git
cd dev-handbook

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173/`

### Build for Production

```bash
# Build static files
npm run build

# Preview production build
npm run preview
```

---

## 📝 Writing Content

### Adding New Documentation

1. Create a new `.md` file in the appropriate directory
2. Add frontmatter (optional):

```markdown
---
title: Your Page Title
description: Brief description
tags: [tag1, tag2]
---

# Your Content Here
```

3. Update sidebar in `.vitepress/config.mts`

### File Naming Convention

- Use **kebab-case**: `docker-compose.md`, `github-actions.md`
- Keep names **short and descriptive**
- Each directory should have an `index.md` for overview

---

## 🎯 Goals

- 📚 Create a comprehensive, searchable knowledge base
- 🚀 Document solutions to common problems
- 💡 Share best practices and lessons learned
- 🔄 Continuously update with new technologies

---

## 🤝 Contributing

This is a personal knowledge base, but suggestions are welcome!

- Open an issue for corrections or suggestions
- Fork the repo if you want to adapt it for your own use

---

## 📄 License

MIT License - Feel free to use this structure for your own knowledge base

---

## 🙏 Acknowledgments

- Built with [VitePress](https://vitepress.dev/)
- Inspired by digital garden and learning in public movements
- Thanks to the open-source community

---

## 📬 Contact

- GitHub: [@tuanlee-tech](https://github.com/tuanlee-tech)
- Website: [tuanlee-tech.github.io/dev-handbook](https://tuanlee-tech.github.io/dev-handbook)

---

**Happy Learning! 🎉**
