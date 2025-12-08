import { defineConfig } from 'vitepress'
import path from 'path'

const isProd = process.env.NODE_ENV === "production";
const repo = "dev-handbook";
const base = isProd ? `/${repo}/` : "/";

export default defineConfig({
  base: base,
  lang: "vi-VN",
  title: "Dev Handbook",
  description: "Personal tech knowledge base - Frontend, Backend, DevOps, Tools & Tips",
  ignoreDeadLinks: true,
  head: [
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Dev Handbook",
      "url": "https://tuanlee-tech.github.io/dev-handbook"
    })],
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon.png` }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],

    // SEO
    ['meta', { name: 'keywords', content: 'Frontend, Backend, DevOps, React, Node.js, Docker, Programming, Web Development' }],
    ['meta', { name: 'robots', content: 'index, follow' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Dev Handbook - Tech Knowledge Base' }],
    ['meta', { property: 'og:description', content: 'Personal documentation covering Frontend, Backend, DevOps and more' }],
    ['meta', { property: 'og:image', content: `${base}og-image.png` }],
    ['meta', { property: 'og:url', content: 'https://tuanlee-tech.github.io/dev-handbook' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Dev Handbook' }],
    ['meta', { name: 'twitter:description', content: 'Personal tech documentation - Frontend, Backend, DevOps' }],
    ['meta', { name: 'twitter:image', content: `${base}og-image.png` }],
  ],

  vite: {
    resolve: {
      alias: {
        '@ui': path.resolve(__dirname, '../components/ui'),
        '@components': path.resolve(__dirname, '../components'),
        '@exercises': path.resolve(__dirname, '../exercises'),
      }
    }
  },

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started" },
      {
        text: "Topics",
        items: [
          { text: "⚛️ Frontend", link: "/frontend/" },
          { text: "🔧 Backend", link: "/backend/" },
          { text: "🐳 DevOps", link: "/devops/" },
          { text: "🛠️ Tools & Tips", link: "/tools-tips/" },
          { text: "🧩 DSA", link: "/dsa/" }
        ]
      },
      {
        text: "Courses",
        items: [
          { text: "📘 React Mastery (30 Days)", link: "/frontend/react/react-mastery/" },
          { text: "🚀 DSA Mastery (100 Days)", link: "/dsa/" }
        ]
      }
    ],

    sidebar: {
      // Homepage sidebar
      "/": [
        {
          text: "🚀 Getting Started",
          collapsed: false,
          items: [
            { text: "Introduction", link: "/getting-started" },
            { text: "Learning Roadmap", link: "/roadmap" },
            { text: "How to Use", link: "/how-to-use" },
          ]
        },
        {
          text: "📚 Main Topics",
          collapsed: false,
          items: [
            { text: "⚛️ Frontend Development", link: "/frontend/" },
            { text: "🔧 Backend Development", link: "/backend/" },
            { text: "🐳 DevOps & Infrastructure", link: "/devops/" },
            { text: "🛠️ Tools & Productivity", link: "/tools-tips/" },
            { text: "🧩 Data Structures & Algorithms", link: "/dsa/" }
          ]
        }
      ],

      // Frontend sidebar
      "/frontend/": [
        {
          text: "⚛️ Frontend Development",
          collapsed: false,
          items: [
            { text: "Overview", link: "/frontend/" },
            {
              text: "HTML & CSS",
              collapsed: true,
              items: [
                { text: "Flexbox & Grid", link: "/frontend/html-css/flexbox-grid" },
                { text: "Responsive Design", link: "/frontend/html-css/responsive-design" },
                { text: "CSS Tricks & Tips", link: "/frontend/html-css/css-tricks" },
                { text: "Tailwind CSS", link: "/frontend/html-css/tailwind-css" },
              ]
            },
            {
              text: "JavaScript/TypeScript",
              collapsed: true,
              items: [
                { text: "ES6+ Features", link: "/frontend/javascript/es6-features" },
                { text: "Async/Await", link: "/frontend/javascript/async-await" },
                { text: "Array Methods", link: "/frontend/javascript/array-methods" },
                { text: "TypeScript Basics", link: "/frontend/javascript/typescript-basics" },
              ]
            },
            {
              text: "React",
              collapsed: true,
              items: [
                { text: "React Overview", link: "/frontend/react/" },
                { text: "Hooks Guide", link: "/frontend/react/hooks-guide" },
                { text: "State Management", link: "/frontend/react/state-management" },
                { text: "Performance Tips", link: "/frontend/react/performance" },
                { text: "📘 React Mastery (30 Days)", link: "/frontend/react/react-mastery/" },
              ]
            },
            {
              text: "Vue",
              collapsed: true,
              items: [
                { text: "Vue Overview", link: "/frontend/vue/" },
                { text: "Composition API", link: "/frontend/vue/composition-api" },
                { text: "Reactivity System", link: "/frontend/vue/reactivity" },
              ]
            }
          ]
        }
      ],

      // React Mastery - Giữ nguyên cấu trúc cũ
      "/frontend/react/react-mastery/": [
        {
          text: "📘 React Mastery - Tổng quan",
          collapsed: false,
          items: [
            { text: "Giáo án", link: "/frontend/react/react-mastery/curriculum" },
            { text: "Lộ trình 30 ngày", link: "/frontend/react/react-mastery/30-days" },
            { text: "TypeScript với React", link: "/frontend/react/react-mastery/typescript-react" },
          ]
        },
        {
          text: "📚 Giai đoạn học",
          collapsed: false,
          items: [
            {
              text: "Giai đoạn 1 – Foundation",
              collapsed: true,
              items: [
                { text: "Ngày 1 – JSX & Rendering Basics", link: "/frontend/react/react-mastery/stages/stage-1/01.jsx-rendering-basics" },
                { text: "Ngày 2 – Conditional & List Rendering", link: "/frontend/react/react-mastery/stages/stage-1/02.conditional-list-rendering" },
                { text: "Ngày 3 – Components Fundamentals", link: "/frontend/react/react-mastery/stages/stage-1/03.components-fundamentals" },
                { text: "Ngày 4 – Component Composition Patterns", link: "/frontend/react/react-mastery/stages/stage-1/04.component-composition-patterns" },
                { text: "Ngày 5 – Class Components (Legacy)", link: "/frontend/react/react-mastery/stages/stage-1/05.class-components-legacy" },
              ],
            },
            {
              text: "Giai đoạn 2 – State & Effects",
              collapsed: true,
              items: [
                { text: "Ngày 6 – useState nâng cao", link: "/frontend/react/react-mastery/stages/stage-2/06.use-state-mastery" },
                { text: "Ngày 7 – useReducer - Complex State Logic", link: "/frontend/react/react-mastery/stages/stage-2/07.use-reducer-complex-state-logic" },
                { text: "Ngày 8 – State Management Patterns", link: "/frontend/react/react-mastery/stages/stage-2/08.state-management-patterns" },
                { text: "Ngày 9 – useEffect & Side Effects", link: "/frontend/react/react-mastery/stages/stage-2/09.use-effect-and-side-effects" },
                { text: "Ngày 10 – Advanced Effects & Best Practices", link: "/frontend/react/react-mastery/stages/stage-2/10.advanced-effects" },
              ],
            },
            {
              text: "Giai đoạn 3 – Advanced Hooks",
              collapsed: true,
              items: [
                { text: "Ngày 11 – Performance Hooks", link: "/frontend/react/react-mastery/stages/stage-3/11.performance-hooks" },
                { text: "Ngày 12 – Refs & DOM Access", link: "/frontend/react/react-mastery/stages/stage-3/12.refs-dom-access" },
                { text: "Ngày 13 – React 18 Concurrent Hooks", link: "/frontend/react/react-mastery/stages/stage-3/13.react-18-concurrent-hooks" },
                { text: "Ngày 14 – React 19 Modern Hooks", link: "/frontend/react/react-mastery/stages/stage-3/14.react-19-modern-hooks" },
                { text: "Ngày 15 – Custom Hooks", link: "/frontend/react/react-mastery/stages/stage-3/15.custom-hooks" },
              ],
            },
            {
              text: "Giai đoạn 4 – Context & Forms",
              collapsed: true,
              items: [
                { text: "Ngày 16 – Context API Basics", link: "/frontend/react/react-mastery/stages/stage-4/16.context-api-basics" },
                { text: "Ngày 17 – Advanced Context Patterns", link: "/frontend/react/react-mastery/stages/stage-4/17.advanced-context-patterns" },
                { text: "Ngày 18 – Forms - Controlled Components", link: "/frontend/react/react-mastery/stages/stage-4/18.forms-controlled-components" },
                { text: "Ngày 19 – Advanced Forms", link: "/frontend/react/react-mastery/stages/stage-4/19.advanced-forms" },
                { text: "Ngày 20 – Forms & Context Integration", link: "/frontend/react/react-mastery/stages/stage-4/20.forms-and-context-integration" },
              ],
            },
            {
              text: "Giai đoạn 5 – Performance & Patterns",
              collapsed: true,
              items: [
                { text: "Ngày 21 – Performance Optimization Deep Dive", link: "/frontend/react/react-mastery/stages/stage-5/21.performance-optimization-deep-dive" },
                { text: "Ngày 22 – Code Splitting & Lazy Loading", link: "/frontend/react/react-mastery/stages/stage-5/22.code-splitting-and-lazy-loading" },
                { text: "Ngày 23 – Virtualization & Large Lists", link: "/frontend/react/react-mastery/stages/stage-5/23.virtualization-and-large-lists" },
                { text: "Ngày 24 – Advanced Component Patterns", link: "/frontend/react/react-mastery/stages/stage-5/24.advanced-component-patterns" },
                { text: "Ngày 25 – Error Handling & Testing Prep", link: "/frontend/react/react-mastery/stages/stage-5/25.error-handling-and-testing-prep" },
              ],
            },
            {
              text: "Giai đoạn 6 – React 18/19 & Best Practices",
              collapsed: true,
              items: [
                { text: "Ngày 26 – React 18 Concurrent Features", link: "/frontend/react/react-mastery/stages/stage-6/26.react-18-concurrent-features" },
                { text: "Ngày 27 – React 19 Latest Features", link: "/frontend/react/react-mastery/stages/stage-6/27.react-19-latest-features" },
                { text: "Ngày 28 – Testing với Testing Library", link: "/frontend/react/react-mastery/stages/stage-6/28.testing-library" },
                { text: "Ngày 29 – Best Practices & Anti-patterns", link: "/frontend/react/react-mastery/stages/stage-6/29.best-practices-and-anti-patterns" },
                { text: "Ngày 30 – Capstone Project & Review", link: "/frontend/react/react-mastery/stages/stage-6/30.capstone-project-and-review" },
              ],
            }
          ]
        }
      ],

      // Backend sidebar
      "/backend/": [
        {
          text: "🔧 Backend Development",
          collapsed: false,
          items: [
            { text: "Overview", link: "/backend/" },
            {
              text: "Node.js",
              collapsed: true,
              items: [
                { text: "Express Basics", link: "/backend/nodejs/express-basics" },
                { text: "Middleware Pattern", link: "/backend/nodejs/middleware" },
                { text: "Authentication", link: "/backend/nodejs/authentication" },
                { text: "Error Handling", link: "/backend/nodejs/error-handling" },
              ]
            },
            {
              text: "Python",
              collapsed: true,
              items: [
                { text: "FastAPI Guide", link: "/backend/python/fastapi-guide" },
                { text: "Django Basics", link: "/backend/python/django-basics" },
              ]
            },
            {
              text: "Databases",
              collapsed: true,
              items: [
                { text: "PostgreSQL Tips", link: "/backend/databases/postgresql-tips" },
                { text: "MongoDB Queries", link: "/backend/databases/mongodb-queries" },
                { text: "Redis Caching", link: "/backend/databases/redis-caching" },
                { text: "Prisma ORM", link: "/backend/databases/prisma-orm" },
              ]
            },
            {
              text: "APIs",
              collapsed: true,
              items: [
                { text: "REST API Design", link: "/backend/apis/rest-api-design" },
                { text: "GraphQL Basics", link: "/backend/apis/graphql-basics" },
              ]
            }
          ]
        }
      ],

      // DevOps sidebar
      "/devops/": [
        {
          text: "🐳 DevOps & Infrastructure",
          collapsed: false,
          items: [
            { text: "Overview", link: "/devops/" },
            {
              text: "Docker",
              collapsed: true,
              items: [
                { text: "Dockerfile Best Practices", link: "/devops/docker/dockerfile-best-practices" },
                { text: "Docker Compose", link: "/devops/docker/docker-compose" },
                { text: "Multi-stage Builds", link: "/devops/docker/multi-stage-builds" },
                { text: "Docker Networking", link: "/devops/docker/docker-networking" },
              ]
            },
            {
              text: "CI/CD",
              collapsed: true,
              items: [
                { text: "GitHub Actions", link: "/devops/ci-cd/github-actions" },
                { text: "GitLab CI", link: "/devops/ci-cd/gitlab-ci" },
                { text: "Deployment Strategies", link: "/devops/ci-cd/deployment-strategies" },
              ]
            },
            {
              text: "Kubernetes",
              collapsed: true,
              items: [
                { text: "K8s Basics", link: "/devops/kubernetes/k8s-basics" },
                { text: "Deployments", link: "/devops/kubernetes/deployments" },
                { text: "Services", link: "/devops/kubernetes/services" },
              ]
            },
            {
              text: "Server & Hosting",
              collapsed: true,
              items: [
                { text: "Nginx Configuration", link: "/devops/server/nginx-config" },
                { text: "SSL/TLS Setup", link: "/devops/server/ssl-tls-setup" },
              ]
            }
          ]
        }
      ],

      // DSA Mastery sidebar
      "/dsa/": [
        {
          text: "🚀 DSA Mastery - Overview",
          collapsed: false,
          items: [
            { text: "Course Introduction", link: "/dsa/" },
            { text: "Getting Started", link: "/dsa/getting-started" },
            { text: "Study Plan", link: "/dsa/study-plan" },
          ]
        },
        {
          text: "📘 Phase 1: Fundamentals (Days 1-25)",
          collapsed: true,
          items: [
            { text: "Week 1 - Complexity Analysis", link: "/dsa/phase-1/week-1" },
            { text: "Week 2 - Arrays & Strings", link: "/dsa/phase-1/week-2" },
            { text: "Week 3 - Linked Lists", link: "/dsa/phase-1/week-3" },
            { text: "Week 4 - Stacks & Queues", link: "/dsa/phase-1/week-4" },
          ]
        },
        {
          text: "📗 Phase 2: Core Data Structures (Days 26-50)",
          collapsed: true,
          items: [
            { text: "Week 5 - Hashing", link: "/dsa/phase-2/week-5" },
            { text: "Week 6 - Recursion & Backtracking", link: "/dsa/phase-2/week-6" },
            { text: "Week 7 - Trees Part 1", link: "/dsa/phase-2/week-7" },
            { text: "Week 8 - Trees Part 2", link: "/dsa/phase-2/week-8" },
          ]
        },
        {
          text: "📙 Phase 3: Advanced Algorithms (Days 51-75)",
          collapsed: true,
          items: [
            { text: "Week 9 - Heaps & Priority Queues", link: "/dsa/phase-3/week-9" },
            { text: "Week 10 - Graphs Part 1", link: "/dsa/phase-3/week-10" },
            { text: "Week 11 - Graphs Part 2", link: "/dsa/phase-3/week-11" },
            { text: "Week 12 - Sorting & Searching", link: "/dsa/phase-3/week-12" },
          ]
        },
        {
          text: "📕 Phase 4: Expert Level (Days 76-100)",
          collapsed: true,
          items: [
            { text: "Week 13 - Dynamic Programming Part 1", link: "/dsa/phase-4/week-13" },
            { text: "Week 14 - Dynamic Programming Part 2", link: "/dsa/phase-4/week-14" },
            { text: "Week 15 - Greedy Algorithms", link: "/dsa/phase-4/week-15" },
            { text: "Week 16 - Advanced Topics", link: "/dsa/phase-4/week-16" },
          ]
        },
        {
          text: "📚 Resources",
          collapsed: true,
          items: [
            { text: "Problem Sets", link: "/dsa/resources/problem-sets" },
            { text: "Cheat Sheets", link: "/dsa/resources/cheat-sheets" },
            { text: "Interview Tips", link: "/dsa/resources/interview-tips" },
          ]
        }
      ],

      // Tools & Tips sidebar
      "/tools-tips/": [
        {
          text: "🛠️ Tools & Productivity",
          collapsed: false,
          items: [
            { text: "Overview", link: "/tools-tips/" },
            {
              text: "Git",
              collapsed: true,
              items: [
                { text: "Common Commands", link: "/tools-tips/git/common-commands" },
                { text: "Git Workflows", link: "/tools-tips/git/workflows" },
                { text: "Troubleshooting", link: "/tools-tips/git/troubleshooting" },
                { text: "Advanced Git", link: "/tools-tips/git/advanced-git" },
              ]
            },
            {
              text: "VSCode",
              collapsed: true,
              items: [
                { text: "Essential Extensions", link: "/tools-tips/vscode/extensions" },
                { text: "Keyboard Shortcuts", link: "/tools-tips/vscode/shortcuts" },
                { text: "Settings & Config", link: "/tools-tips/vscode/settings" },
                { text: "Snippets", link: "/tools-tips/vscode/snippets" },
              ]
            },
            {
              text: "Terminal",
              collapsed: true,
              items: [
                { text: "Bash Tricks", link: "/tools-tips/terminal/bash-tricks" },
                { text: "Zsh Setup", link: "/tools-tips/terminal/zsh-setup" },
                { text: "Terminal Tools", link: "/tools-tips/terminal/terminal-tools" },
              ]
            },
            {
              text: "Development Workflow",
              collapsed: true,
              items: [
                { text: "Code Review Tips", link: "/tools-tips/workflow/code-review" },
                { text: "Debugging Techniques", link: "/tools-tips/workflow/debugging" },
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tuanlee-tech/dev-handbook' }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2024 Tuan Lee'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    }
  }
})