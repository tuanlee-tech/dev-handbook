import { defineConfig } from 'vitepress'
import path from 'path'
import react from '@vitejs/plugin-react'

const isProd = process.env.NODE_ENV === "production"; // true nếu build (production)
const repo = "react-mastery";

export default defineConfig({
  lang: "vi-VN",
  title: "ReactJS Mastery",
  description: "Khoá ReactJS 30 ngày – React 18/19, performance, hooks, patterns, best practices.",
  head: [
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ReactJS Mastery",
      "url": "https://tuanlee-tech.github.io/react-mastery"
    })],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#61dafb' }],
    // Meta viewport
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],

    // SEO cơ bản
    ['meta', { name: 'keywords', content: 'ReactJS, JSX, Hooks, Patterns, Performance' }],
    ['meta', { name: 'robots', content: 'index, follow' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'ReactJS Mastery' }],
    ['meta', { property: 'og:description', content: 'Khoá ReactJS 30 ngày với React 18/19, performance, hooks, patterns' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://tuanlee-tech.github.io/react-mastery' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'ReactJS Mastery' }],
    ['meta', { name: 'twitter:description', content: 'Khoá ReactJS 30 ngày với React 18/19, performance, hooks, patterns' }],
    ['meta', { name: 'twitter:image', content: '/og-image.png' }],
  ],
  vite: {
    plugins: [react()],
    base: isProd ? `/${repo}/` : "/", // dynamic base path
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
      { text: "Trang chủ", link: "/" },
      { text: "Giáo án", link: "/curriculum" },
      { text: "Lộ trình", link: "/30-days" },
    ],

    sidebar: {
      "/": [
        {
          text: "📘 Tổng quan",
          collapsed: false,
          items: [
            { text: "Giáo án", link: "/curriculum" },
            { text: "Lộ trình", link: "/30-days" },
          ]
        },

        {
          text: "📚 Giai đoạn học",
          collapsed: false,
          items: [
            // Giai đoạn 1: Ngày 1-5
            {
              text: "Giai đoạn 1 – Foundation",
              collapsed: true,
              items: [
                { text: "Ngày 1 – JSX & Rendering Basics", link: "/stages/stage-1/01.jsx-rendering-basics" },
                { text: "Ngày 2 – Conditional & List Rendering", link: "/stages/stage-1/02.conditional-list-rendering" },
                { text: "Ngày 3 – Components Fundamentals", link: "/stages/stage-1/03.components-fundamentals" },
                { text: "Ngày 4 – Component Composition Patterns", link: "/stages/stage-1/04.component-composition-patterns" },
                { text: "Ngày 5 – Class Components (Legacy)", link: "/stages/stage-1/05.class-components-legacy" },
              ],
            },

            // Giai đoạn 2: Ngày 6-10
            {
              text: "Giai đoạn 2 – State & Effects",
              collapsed: true,
              items: [
                { text: "Ngày 6 – useState nâng cao", link: "/stages/stage-2/06.use-state-mastery" },
                { text: "Ngày 7 – useReducer - Complex State Logic", link: "/stages/stage-2/07.use-reducer-complex-state-logic" },
                { text: "Ngày 8 – State Management Patterns", link: "/stages/stage-2/08.state-management-patterns" },
                { text: "Ngày 9 – useEffect & Side Effects", link: "/stages/stage-2/09.use-effect-and-side-effects" },
                { text: "Ngày 10 – Advanced Effects & Best Practices", link: "/stages/stage-2/10.advanced-effects" },
              ],
            },

            // Giai đoạn 3: Ngày 11-15
            {
              text: "Giai đoạn 3 – Advanced Hooks",
              collapsed: true,
              items: [
                { text: "Ngày 11 – Performance Hooks (useMemo, useCallback, React.memo)", link: "/stages/stage-3/11.performance-hooks" },
                { text: "Ngày 12 – Refs & DOM Access", link: "/stages/stage-3/12.refs-dom-access" },
                { text: "Ngày 13 – React 18 Concurrent Hooks", link: "/stages/stage-3/13.react-18-concurrent-hooks" },
                { text: "Ngày 14 – React 19 Modern Hooks", link: "/stages/stage-3/14.react-19-modern-hooks" },
                { text: "Ngày 15 – Custom Hooks", link: "/stages/stage-3/15.custom-hooks" },
              ],
            },

            // Giai đoạn 4: Ngày 16-20
            {
              text: "Giai đoạn 4 – Context & Forms",
              collapsed: true,
              items: [
                { text: "Ngày 16 – Context API Basics", link: "/stages/stage-4/16.context-api-basics" },
                { text: "Ngày 17 – Advanced Context Patterns", link: "/stages/stage-4/17.advanced-context-patterns" },
                { text: "Ngày 18 – Forms - Controlled Components", link: "/stages/stage-4/18.forms-controlled-components" },
                { text: "Ngày 19 – Advanced Forms", link: "/stages/stage-4/19.advanced-forms" },
                { text: "Ngày 20 – Forms & Context Integration", link: "/stages/stage-4/20.forms-and-context-integration" },
              ],
            },

            // Giai đoạn 5: Ngày 21-25
            {
              text: "Giai đoạn 5 – Performance & Patterns",
              collapsed: true,
              items: [
                { text: "Ngày 21 – Performance Optimization Deep Dive", link: "/stages/stage-5/21.performance-optimization-deep-dive" },
                { text: "Ngày 22 – Code Splitting & Lazy Loading", link: "/stages/stage-5/22.code-splitting-and-lazy-loading" },
                { text: "Ngày 23 –  Virtualization & Large Lists", link: "/stages/stage-5/23.virtualization-and-large-lists" },
                { text: "Ngày 24 – Advanced Component Patterns", link: "/stages/stage-5/24.advanced-component-patterns" },
                { text: "Ngày 25 – Error Handling & Testing Prep", link: "/stages/stage-5/25.error-handling-and-testing-prep" },
              ],
            },

            // Giai đoạn 6: Ngày 26-30
            {
              text: "Giai đoạn 6 – React 18/19 & Best Practices",
              collapsed: true,
              items: [
                { text: "Ngày 26 – React 18 Concurrent Features", link: "/stages/stage-6/26.react-18-concurrent-features" },
                { text: "Ngày 27 – React 19 Latest Features", link: "/stages/stage-6/27.react-19-latest-features" },
                { text: "Ngày 28 – Testing với Testing Library", link: "/stages/stage-6/28.testing-library" },
                { text: "Ngày 29 – Best Practices & Anti-patterns", link: "/stages/stage-6/29.best-practices-and-anti-patterns" },
                { text: "Ngày 30 – Capstone Project & Review", link: "/stages/stage-6/30.capstone-project-and-review" },
              ],
            }
          ]
        }
      ]
    }
  },
});
