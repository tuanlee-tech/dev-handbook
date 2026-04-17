import path from 'path';
import { defineConfig } from 'vitepress';

const isProd = process.env.NODE_ENV === 'production';
const repo = 'dev-handbook';
export const base = isProd ? `/${repo}/` : '/';

export default defineConfig({
  base: base,
  lang: 'vi-VN',
  title: 'Dev Handbook',
  description:
    'Personal tech knowledge base - Frontend, Backend, DevOps, Tools & Tips',
  ignoreDeadLinks: true,
  head: [
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Dev Handbook',
        url: 'https://tuanlee-tech.github.io/dev-handbook',
      }),
    ],
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon.png` }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],

    // SEO
    [
      'meta',
      {
        name: 'keywords',
        content:
          'Frontend, Backend, DevOps, React, Node.js, Docker, Programming, Web Development',
      },
    ],
    ['meta', { name: 'robots', content: 'index, follow' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    [
      'meta',
      {
        property: 'og:title',
        content: 'Dev Handbook - Tech Knowledge Base',
      },
    ],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Personal documentation covering Frontend, Backend, DevOps and more',
      },
    ],
    ['meta', { property: 'og:image', content: `${base}og-image.png` }],
    [
      'meta',
      {
        property: 'og:url',
        content: 'https://tuanlee-tech.github.io/dev-handbook',
      },
    ],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Dev Handbook' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'Personal tech documentation - Frontend, Backend, DevOps',
      },
    ],
    ['meta', { name: 'twitter:image', content: `${base}og-image.png` }],
  ],

  vite: {
    resolve: {
      alias: {
        '@ui': path.resolve(__dirname, '../components/ui'),
        '@components': path.resolve(__dirname, '../components'),
        '@exercises': path.resolve(__dirname, '../exercises'),
      },
    },
  },

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      {
        text: 'Topics',
        items: [
          { text: '⚛️ Frontend', link: '/frontend/' },
          { text: '🔧 Backend', link: '/backend/' },
          { text: '🐳 DevOps', link: '/devops/' },
          { text: '🛠️ Tools & Tips', link: '/tools-tips/' },
          { text: '🧩 DSA', link: '/dsa/' },
        ],
      },
      {
        text: 'Courses',
        items: [
          {
            text: 'THE ULTIMATE REACT MASTERY',
            link: '/frontend/react/the-ultimate-react-mastery/',
          },
          { text: '🚀 DSA Mastery (100 Days)', link: '/dsa/' },
        ],
      },
    ],

    sidebar: {
      // Homepage sidebar
      '/': [
        {
          text: '🚀 Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/getting-started' },
            { text: 'Learning Roadmap', link: '/roadmap' },
            { text: 'How to Use', link: '/how-to-use' },
          ],
        },
        {
          text: '📚 Main Topics',
          collapsed: false,
          items: [
            { text: '⚛️ Frontend Development', link: '/frontend/' },
            { text: '🔧 Backend Development', link: '/backend/' },
            {
              text: '🐳 DevOps & Infrastructure',
              link: '/devops/',
            },
            {
              text: '🛠️ Tools & Productivity',
              link: '/tools-tips/',
            },
            {
              text: '🧩 Data Structures & Algorithms',
              link: '/dsa/',
            },
          ],
        },
      ],

      // Frontend sidebar
      '/frontend/': [
        {
          text: '⚛️ Frontend Development',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/frontend/' },
            {
              text: 'HTML & CSS',
              collapsed: true,
              items: [
                {
                  text: 'Flexbox & Grid',
                  link: '/frontend/html-css/flexbox-grid',
                },
                {
                  text: 'Responsive Design',
                  link: '/frontend/html-css/responsive-design',
                },
                {
                  text: 'CSS Tricks & Tips',
                  link: '/frontend/html-css/css-tricks',
                },
                {
                  text: 'SCSS, Web Components & Build Tools',
                  link: '/frontend/html-css/scss-web-components-and-build-tools',
                },
                {
                  text: 'SCSS Zero to Hero: Enterprise Edition 2025',
                  link: '/frontend/html-css/scss-zero-to-hero-enterprise-edition-2025',
                },
                {
                  text: 'Mobile-First 2025: Performance, SEO & A11y',
                  link: '/frontend/html-css/mobile-first-2025-performance-seo-and-a11y',
                },
              ],
            },
            {
              text: 'JavaScript/TypeScript',
              collapsed: true,
              items: [
                {
                  text: 'Client-Side Analytics Engine',
                  link: '/frontend/javascript/analytics-engine',
                },
                {
                  text: 'ES6+ Features',
                  link: '/frontend/javascript/es6-features',
                },
                {
                  text: 'Async/Await',
                  link: '/frontend/javascript/async-await',
                },
                {
                  text: 'Array Methods',
                  link: '/frontend/javascript/array-methods',
                },
                {
                  text: 'TypeScript Basics',
                  link: '/frontend/javascript/typescript-basics',
                },
              ],
            },
            {
              text: 'React',
              collapsed: true,
              items: [
                {
                  text: 'React Overview',
                  link: '/frontend/react/',
                },
                {
                  text: 'Testing',

                  collapsed: true,
                  items: [
                    {
                      text: 'Testing - Phần 1',
                      link: '/frontend/react/testing/phan-1',
                    },
                    {
                      text: 'Testing - Phần 2',
                      link: '/frontend/react/testing/phan-2',
                    },
                    {
                      text: 'Testing - Phần 3',
                      link: '/frontend/react/testing/phan-3',
                    },
                    {
                      text: 'Tư duy Test',
                      link: '/frontend/react/testing/tu-duy-test',
                    },
                  ],
                },
                {
                  text: 'Tối Ưu React Rendering',
                  link: '/frontend/react/toi-uu-react-rendering',
                },
                {
                  text: 'React Workflow',
                  link: '/frontend/react/react_workflow',
                },
                {
                  text: 'State Management',
                  link: '/frontend/react/state-management',
                },
                {
                  text: 'React Component Lifecycle',
                  link: '/frontend/react/react-component-lifecycle',
                },
                {
                  text: 'THE ULTIMATE REACT MASTERY',
                  link: '/frontend/react/the-ultimate-react-mastery/',
                },
              ],
            },
            {
              text: 'Vue',
              collapsed: true,
              items: [
                {
                  text: 'Vue Overview',
                  link: '/frontend/vue/',
                },
                {
                  text: 'Composition API',
                  link: '/frontend/vue/composition-api',
                },
                {
                  text: 'Reactivity System',
                  link: '/frontend/vue/reactivity',
                },
              ],
            },
          ],
        },
      ],
      '/frontend/react/the-ultimate-react-mastery/': [
        {
          text: '📚 Giai đoạn học',
          collapsed: false,
          items: [
            {
              text: 'Giai đoạn 1 – NỀN TẢNG REACT (Ngày 1-15)',
              collapsed: true,
              items: [
                {
                  text: 'Ngày 1 – ES6+ Essentials cho React',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/01.es6-essentials-cho-react',
                },
                {
                  text: 'Ngày 2 – ES6+ Nâng cao',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/02.es6-nang-cao',
                },
                {
                  text: 'Ngày 3 – React Basics & JSX',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/03.react-basics-and-jsx',
                },
                {
                  text: 'Ngày 4 – Components & Props',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/04.components-and-props',
                },
                {
                  text: 'Ngày 5 – Events & Conditional Rendering',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/05.events-and-conditional-rendering',
                },
                {
                  text: 'Ngày 6 – Lists & Keys',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/06.lists-and-keys',
                },
                {
                  text: 'Ngày 7 – Component Composition',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/07.component-composition',
                },
                {
                  text: 'Ngày 8 – Styling trong React',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/08.styling-trong-react',
                },
                {
                  text: 'Ngày 9 – Forms Controlled (KHÔNG STATE)',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/09.forms-controlled-khong-state',
                },
                {
                  text: 'Ngày 10 – Mini Project 1 - Static Product Catalog',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/10.mini-project-1-static-product-catalog',
                },
                {
                  text: 'Ngày 11 – useState - Fundamentals',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/11.usestate-fundamentals',
                },
                {
                  text: 'Ngày 12 – useState - Patterns & Best Practices',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/12.usestate-patterns-and-best-practices',
                },
                {
                  text: 'Ngày 13 – Forms với State',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/13.forms-voi-state',
                },
                {
                  text: 'Ngày 14 – Lifting State Up',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/14.lifting-state-up',
                },
                {
                  text: 'Ngày 15 – Project 2 - Interactive Todo App',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-1/15.project-2-interactive-todo-app',
                },
              ],
            },
            {
              text: 'Giai đoạn 2 – SIDE EFFECTS & LIFECYCLE (Ngày 16-25)',
              collapsed: true,
              items: [
                {
                  text: 'Ngày 16 – useEffect Introduction',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/16.useeffect-introduction',
                },
                {
                  text: 'Ngày 17 – useEffect Dependencies Deep Dive',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/17.useeffect-dependencies-deep-dive',
                },
                {
                  text: 'Ngày 18 – Cleanup & Memory Leaks',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/18.cleanup-and-memory-leaks',
                },
                {
                  text: 'Ngày 19 – Data Fetching Basics',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/19.data-fetching-basics',
                },
                {
                  text: 'Ngày 20 – Data Fetching Advanced Patterns',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/20.data-fetching-advanced-patterns',
                },
                {
                  text: 'Ngày 21 – useRef Fundamentals',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/21.useref-fundamentals',
                },
                {
                  text: 'Ngày 22 – useRef DOM Manipulation',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/22.useref-dom-manipulation',
                },
                {
                  text: 'Ngày 23 – useLayoutEffect',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/23.uselayouteffect',
                },
                {
                  text: 'Ngày 24 – Custom Hooks Basics',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/24.custom-hooks-basics',
                },
                {
                  text: 'Ngày 25 – Project 3 - Real-time Dashboard',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-2/25.project-3-real-time-dashboard',
                },
              ],
            },
            {
              text: 'Giai đoạn 3 – COMPLEX STATE & PERFORMANCE (Ngày 26-35)',
              collapsed: true,
              items: [
                {
                  text: 'Ngày 26 – useReducer Fundamentals',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/26.usereducer-fundamentals',
                },
                {
                  text: 'Ngày 27 – useReducer Advanced Patterns',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/27.usereducer-advanced-patterns',
                },
                {
                  text: 'Ngày 28 – useReducer + useEffect',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/28.usereducer-with-useeffect',
                },
                {
                  text: 'Ngày 29 – Custom Hooks with useReducer',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/29.custom-hooks-with-usereducer',
                },
                {
                  text: 'Ngày 30 – Project 4: Shopping Cart',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/30.project-4-shopping-cart',
                },
                {
                  text: 'Ngày 31 – React Rendering Behavior',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/31.react-rendering-behavior',
                },
                {
                  text: 'Ngày 32 – React.memo',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/32.react-memo',
                },
                {
                  text: 'Ngày 33 – useMemo',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/33.usememo',
                },
                {
                  text: 'Ngày 34 – useCallback',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/34.usecallback',
                },
                {
                  text: 'Ngày 35 – Project 5: Optimized Data Table',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-3/35.project-5-optimized-data-table',
                },
              ],
            },
            {
              text: 'Giai đoạn 4 – ADVANCED PATTERNS (Ngày 36-45)',
              collapsed: true,
              items: [
                {
                  text: 'Ngày 36 – Context Fundamentals',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/36.context-fundamentals',
                },
                {
                  text: 'Ngày 37 – Context Advanced Patterns',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/37.context-advanced-patterns',
                },
                {
                  text: 'Ngày 38 – Context Performance Optimization',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/38.context-performance-optimization',
                },
                {
                  text: 'Ngày 39 – Component Patterns Part 1 (Compound Components)',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/39.component-patterns-compound-components',
                },
                {
                  text: 'Ngày 40 – Component Patterns Part 2 (Render Props & HOCs)',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/40.component-patterns-render-props-hoc',
                },
                {
                  text: 'Ngày 41 – React Hook Form Basics',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/41.react-hook-form-basics',
                },
                {
                  text: 'Ngày 42 – React Hook Form Advanced',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/42.react-hook-form-advanced',
                },
                {
                  text: 'Ngày 43 – Form Validation with Zod',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/43.form-validation-with-zod',
                },
                {
                  text: 'Ngày 44 – Multi-step Forms Architecture',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/44.multi-step-forms-architecture',
                },
                {
                  text: 'Ngày 45 – Project 6: Registration Flow',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-4/45.project-6-registration-flow',
                },
              ],
            },
            {
              text: 'Giai đoạn 5 – MODERN REACT FEATURES (Ngày 46-52)',
              collapsed: true,
              items: [
                {
                  text: 'Ngày 46 – Concurrent Rendering Introduction',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-5/46.concurrent-rendering-introduction',
                },
                {
                  text: 'Ngày 47 – useTransition',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-5/47.usetransition',
                },
                {
                  text: 'Ngày 48 – useDeferredValue',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-5/48.usedeferredvalue',
                },
                {
                  text: 'Ngày 49 – Suspense for Data Fetching',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-5/49.suspense-for-data-fetching',
                },
                {
                  text: 'Ngày 50 – Error Boundaries',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-5/50.error-boundaries',
                },
                {
                  text: 'Ngày 51 – React Server Components Overview',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-5/51.react-server-components-overview',
                },
                {
                  text: 'Ngày 52 – Project 7: Modern React App',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-5/52.project-7-modern-react-app',
                },
              ],
            },
            {
              text: 'Giai đoạn 6 – TESTING & QUALITY (Ngày 53-60)',
              collapsed: true,
              items: [
                {
                  text: 'Ngày 53 – Testing Philosophy',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-6/53.testing-philosophy',
                },
                {
                  text: 'Ngày 54 – React Testing Library Basics',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-6/54.react-testing-library-basics',
                },
                {
                  text: 'Ngày 55 – Testing Hooks & Context',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-6/55.testing-hooks-and-context',
                },
                {
                  text: 'Ngày 56 – Mocking API with MSW',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-6/56.mocking-api-with-msw',
                },
                {
                  text: 'Ngày 57 – Integration & E2E Testing Overview',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-6/57.integration-and-e2e-testing-overview',
                },
                {
                  text: 'Ngày 58 – TypeScript Fundamentals for React',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-6/58.typescript-fundamentals-for-react',
                },
                {
                  text: 'Ngày 59 – TypeScript Advanced Patterns',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-6/59.typescript-advanced-patterns',
                },
                {
                  text: 'Ngày 60 – Accessibility (A11y)',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-6/60.accessibility-a11y',
                },
              ],
            },
            {
              text: 'Giai đoạn 7 – CAPSTONE PROJECT (Ngày 61-75)',
              collapsed: true,
              items: [
                {
                  text: 'Ngày 61 – Capstone Planning & Architecture',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-7/61.capstone-planning-and-architecture',
                },
                {
                  text: 'Ngày 62–63 – Authentication Flow',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-7/62-63.authentication-flow',
                },
                {
                  text: 'Ngày 64–65 – Feed Core Features',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-7/64-65.feed-core-features',
                },
                {
                  text: 'Ngày 66–67 – User Interactions',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-7/66-67.user-interactions',
                },
                {
                  text: 'Ngày 68–70 – Testing & Quality Assurance',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-7/68-70.testing-and-quality-assurance',
                },
                {
                  text: 'Ngày 71–72 – Performance & Optimization',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-7/71-72.performance-and-optimization',
                },
                {
                  text: 'Ngày 73–74 – Documentation & Review',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-7/73-74.documentation-and-review',
                },
                {
                  text: 'Ngày 75 – Final Audit & Deployment Prep',
                  link: '/frontend/react/the-ultimate-react-mastery/stages/stage-7/75.final-audit-and-deployment-prep',
                },
              ],
            },
          ],
        },
      ],
      // Backend sidebar
      '/backend/': [
        {
          text: '🔧 Backend Development',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/backend/' },
            {
              text: 'Experience',
              collapsed: true,
              items: [
                {
                  text: 'Ecommerce Architecture',
                  link: '/backend/experience/ecommerce-architecture',
                },
              ],
            },
            {
              text: 'Node.js',
              collapsed: true,
              items: [
                {
                  text: 'Express Basics',
                  link: '/backend/nodejs/express-basics',
                },
                {
                  text: 'Middleware Pattern',
                  link: '/backend/nodejs/middleware',
                },
                {
                  text: 'Authentication',
                  link: '/backend/nodejs/authentication',
                },
                {
                  text: 'Error Handling',
                  link: '/backend/nodejs/error-handling',
                },
              ],
            },
            {
              text: 'Python',
              collapsed: true,
              items: [
                {
                  text: 'FastAPI Guide',
                  link: '/backend/python/fastapi-guide',
                },
                {
                  text: 'Django Basics',
                  link: '/backend/python/django-basics',
                },
              ],
            },
            {
              text: 'Databases',
              collapsed: true,
              items: [
                {
                  text: 'PostgreSQL Tips',
                  link: '/backend/databases/postgresql-tips',
                },
                {
                  text: 'MongoDB Queries',
                  link: '/backend/databases/mongodb-queries',
                },
                {
                  text: 'Redis Caching',
                  link: '/backend/databases/redis-caching',
                },
                {
                  text: 'Prisma ORM',
                  link: '/backend/databases/prisma-orm',
                },
              ],
            },
            {
              text: 'APIs',
              collapsed: true,
              items: [
                {
                  text: 'REST API Design',
                  link: '/backend/apis/rest-api-design',
                },
                {
                  text: 'GraphQL Basics',
                  link: '/backend/apis/graphql-basics',
                },
              ],
            },
          ],
        },
      ],

      // DevOps sidebar
      '/devops/': [
        {
          text: '🐳 DevOps & Infrastructure',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/devops/' },
            {
              text: 'Docker',
              collapsed: true,
              items: [
                {
                  text: 'Dockerfile Best Practices',
                  link: '/devops/docker/dockerfile-best-practices',
                },
                {
                  text: 'Docker Compose',
                  link: '/devops/docker/docker-compose',
                },
                {
                  text: 'Multi-stage Builds',
                  link: '/devops/docker/multi-stage-builds',
                },
                {
                  text: 'Docker Networking',
                  link: '/devops/docker/docker-networking',
                },
              ],
            },
            {
              text: 'CI/CD',
              collapsed: true,
              items: [
                {
                  text: 'GitHub Actions',
                  link: '/devops/ci-cd/github-actions',
                },
                {
                  text: 'GitLab CI',
                  link: '/devops/ci-cd/gitlab-ci',
                },
                {
                  text: 'Deployment Strategies',
                  link: '/devops/ci-cd/deployment-strategies',
                },
              ],
            },
            {
              text: 'Kubernetes',
              collapsed: true,
              items: [
                {
                  text: 'K8s Basics',
                  link: '/devops/kubernetes/k8s-basics',
                },
                {
                  text: 'Deployments',
                  link: '/devops/kubernetes/deployments',
                },
                {
                  text: 'Services',
                  link: '/devops/kubernetes/services',
                },
              ],
            },
            {
              text: 'Server & Hosting',
              collapsed: true,
              items: [
                {
                  text: 'Nginx Configuration',
                  link: '/devops/server/nginx-config',
                },
                {
                  text: 'SSL/TLS Setup',
                  link: '/devops/server/ssl-tls-setup',
                },
              ],
            },
          ],
        },
      ],

      // DSA Mastery sidebar
      '/dsa/': [
        {
          text: '🚀 DSA Mastery - Overview',
          collapsed: false,
          items: [
            { text: 'Course Introduction', link: '/dsa/' },
            {
              text: 'Getting Started',
              link: '/dsa/getting-started',
            },
            { text: 'Study Plan', link: '/dsa/study-plan' },
          ],
        },
        {
          text: '📘 Phase 1: Fundamentals (Days 1-25)',
          collapsed: true,
          items: [
            {
              text: 'Week 1 - Complexity Analysis',
              link: '/dsa/phase-1/week-1',
            },
            {
              text: 'Week 2 - Arrays & Strings',
              link: '/dsa/phase-1/week-2',
            },
            {
              text: 'Week 3 - Linked Lists',
              link: '/dsa/phase-1/week-3',
            },
            {
              text: 'Week 4 - Stacks & Queues',
              link: '/dsa/phase-1/week-4',
            },
          ],
        },
        {
          text: '📗 Phase 2: Core Data Structures (Days 26-50)',
          collapsed: true,
          items: [
            {
              text: 'Week 5 - Hashing',
              link: '/dsa/phase-2/week-5',
            },
            {
              text: 'Week 6 - Recursion & Backtracking',
              link: '/dsa/phase-2/week-6',
            },
            {
              text: 'Week 7 - Trees Part 1',
              link: '/dsa/phase-2/week-7',
            },
            {
              text: 'Week 8 - Trees Part 2',
              link: '/dsa/phase-2/week-8',
            },
          ],
        },
        {
          text: '📙 Phase 3: Advanced Algorithms (Days 51-75)',
          collapsed: true,
          items: [
            {
              text: 'Week 9 - Heaps & Priority Queues',
              link: '/dsa/phase-3/week-9',
            },
            {
              text: 'Week 10 - Graphs Part 1',
              link: '/dsa/phase-3/week-10',
            },
            {
              text: 'Week 11 - Graphs Part 2',
              link: '/dsa/phase-3/week-11',
            },
            {
              text: 'Week 12 - Sorting & Searching',
              link: '/dsa/phase-3/week-12',
            },
          ],
        },
        {
          text: '📕 Phase 4: Expert Level (Days 76-100)',
          collapsed: true,
          items: [
            {
              text: 'Week 13 - Dynamic Programming Part 1',
              link: '/dsa/phase-4/week-13',
            },
            {
              text: 'Week 14 - Dynamic Programming Part 2',
              link: '/dsa/phase-4/week-14',
            },
            {
              text: 'Week 15 - Greedy Algorithms',
              link: '/dsa/phase-4/week-15',
            },
            {
              text: 'Week 16 - Advanced Topics',
              link: '/dsa/phase-4/week-16',
            },
          ],
        },
        {
          text: '📚 Resources',
          collapsed: true,
          items: [
            {
              text: 'Problem Sets',
              link: '/dsa/resources/problem-sets',
            },
            {
              text: 'Cheat Sheets',
              link: '/dsa/resources/cheat-sheets',
            },
            {
              text: 'Interview Tips',
              link: '/dsa/resources/interview-tips',
            },
          ],
        },
      ],

      // Tools & Tips sidebar
      '/tools-tips/': [
        {
          text: '🛠️ Tools & Productivity',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/tools-tips/' },
            {
              text: 'Git',
              collapsed: true,
              items: [
                {
                  text: 'Common Commands',
                  link: '/tools-tips/git/common-commands',
                },
                {
                  text: 'Git Workflows',
                  link: '/tools-tips/git/workflows',
                },
                {
                  text: 'Troubleshooting',
                  link: '/tools-tips/git/troubleshooting',
                },
                {
                  text: 'Advanced Git',
                  link: '/tools-tips/git/advanced-git',
                },
              ],
            },
            {
              text: 'VSCode',
              collapsed: true,
              items: [
                {
                  text: 'Essential Extensions',
                  link: '/tools-tips/vscode/extensions',
                },
                {
                  text: 'Keyboard Shortcuts',
                  link: '/tools-tips/vscode/shortcuts',
                },
                {
                  text: 'Settings & Config',
                  link: '/tools-tips/vscode/settings',
                },
                {
                  text: 'Snippets',
                  link: '/tools-tips/vscode/snippets',
                },
              ],
            },
            {
              text: 'Terminal',
              collapsed: true,
              items: [
                {
                  text: 'Bash Tricks',
                  link: '/tools-tips/terminal/bash-tricks',
                },
                {
                  text: 'Zsh Setup',
                  link: '/tools-tips/terminal/zsh-setup',
                },
                {
                  text: 'Terminal Tools',
                  link: '/tools-tips/terminal/terminal-tools',
                },
              ],
            },
            {
              text: 'Development Workflow',
              collapsed: true,
              items: [
                {
                  text: 'Code Review Tips',
                  link: '/tools-tips/workflow/code-review',
                },
                {
                  text: 'Debugging Techniques',
                  link: '/tools-tips/workflow/debugging',
                },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/tuanlee-tech/dev-handbook',
      },
    ],

    footer: {
      message: 'Personal tech knowledge base',
      copyright: 'Copyright © 2025 Tuan Lee',
    },

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },
});
