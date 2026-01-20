# 📊 VERCEL BEST PRACTICES - MAPPING MATRIX

**Tổng hợp:** 32 React Core + 13 Next.js Rules → React Mastery Roadmap  
**Purpose:** Quick reference cho AI khi tạo content từng ngày

---

## 🎯 CÁCH SỬ DỤNG

Khi tạo content cho **Ngày X**, tra cứu bảng này để biết:
1. Rules nào áp dụng cho ngày đó
2. Impact level (CRITICAL/HIGH/MEDIUM/LOW)
3. Link đến detailed integration instructions

---

## 📅 REACT CORE MAPPING (Days 1-110)

### Phase 1: Nền tảng React (Days 1-15)

| Day | Topic | Vercel Rules | Impact | Note |
|-----|-------|--------------|--------|------|
| 1-5 | JavaScript ES6+ | - | - | No React yet |
| 6 | Lists & Keys | `rendering-conditional-render` | LOW | Ternary vs && |
| 7 | Component Composition | - | - | - |
| 8 | Styling | `rendering-animate-svg-wrapper`<br>`rendering-svg-precision` | LOW | SVG performance |
| 9 | Forms (Theory) | - | - | Chưa có state |
| 10 | **Project 1** | Apply Days 1-9 | - | No Vercel rules |
| 11 | useState Basics | Preview: `rerender-lazy-state-init` | - | MENTION only |
| 12 | useState Patterns | `rerender-functional-setstate`<br>`rerender-lazy-state-init` | MEDIUM | Stale closures, lazy init |
| 13 | Forms with State | - | - | - |
| 14 | Lifting State Up | - | - | - |
| 15 | **Project 2** | useState mastery | - | - |

### Phase 2: Side Effects & Lifecycle (Days 16-25)

| Day | Topic | Vercel Rules | Impact | Note |
|-----|-------|--------------|--------|------|
| 16-17 | useEffect Basics & Deps | `rerender-defer-reads`<br>`rerender-dependencies` | MEDIUM<br>LOW | Defer state reads, narrow deps |
| 18 | Cleanup & Memory Leaks | `client-event-listeners`<br>`client-passive-event-listeners` | LOW<br>MEDIUM | Dedupe listeners, passive |
| 19-20 | Data Fetching | `async-parallel`<br>`async-defer-await`<br>`client-swr-dedup`<br>`client-localstorage-schema` | CRITICAL<br>HIGH<br>MEDIUM-HIGH<br>MEDIUM | Promise.all, defer await, SWR, localStorage |
| 21-22 | useRef | `advanced-event-handler-refs`<br>`advanced-use-latest` | LOW<br>LOW | Store handlers in refs |
| 23 | useLayoutEffect | - | - | - |
| 24 | Custom Hooks Basics | - | - | - |
| 25 | **Project 3** | Effects & data fetching | - | - |

### Phase 3: Complex State & Performance (Days 26-35)

| Day | Topic | Vercel Rules | Impact | Note |
|-----|-------|--------------|--------|------|
| 26-30 | useReducer | - | - | State management only |
| 31 | Rendering Behavior | Preview all optimization | - | Concepts only |
| 32 | React.memo | `rerender-memo` | MEDIUM | Extract to memoized components |
| 33 | useMemo | `rerender-derived-state` | MEDIUM | Subscribe to booleans |
| 34 | useCallback | - | - | - |
| 35 | **Project 5** | **ALL JS Performance (12 rules)** | LOW-MEDIUM | `js-index-maps`<br>`js-tosorted-immutable`<br>`js-length-check-first`<br>`js-cache-property-access`<br>`js-cache-function-results`<br>`js-cache-storage`<br>`js-combine-iterations`<br>`js-early-exit`<br>`js-hoist-regexp`<br>`js-min-max-loop`<br>`js-set-map-lookups`<br>`js-batch-dom-css` |

### Phase 4: Advanced Patterns (Days 36-45)

| Day | Topic | Vercel Rules | Impact | Note |
|-----|-------|--------------|--------|------|
| 36-40 | Context API | - | - | - |
| 41-45 | Forms & Validation | - | - | RHF + Zod |

### Phase 5: Modern React Features (Days 46-52)

| Day | Topic | Vercel Rules | Impact | Note |
|-----|-------|--------------|--------|------|
| 46 | Concurrent Rendering | - | - | Concepts |
| 47-48 | useTransition, useDeferredValue | `rerender-transitions` | MEDIUM | Non-urgent updates |
| 49 | Suspense | Preview: `async-suspense-boundaries` | - | Concepts only (needs Next.js) |
| 50 | Error Boundaries | `rendering-activity` | MEDIUM | If React 19 |
| 51 | RSC Overview | Preview Next.js | - | Conceptual |
| 52 | **Project 7** | React 18 features | - | - |

### Phase 6: Testing & Quality (Days 53-60)

| Day | Topic | Vercel Rules | Impact | Note |
|-----|-------|--------------|--------|------|
| 53-57 | Testing | - | - | RTL, MSW |
| 58-60 | TypeScript & A11y | `rendering-hoist-jsx`<br>`rendering-content-visibility` | LOW<br>HIGH | Hoist JSX, content-visibility |

### Phase 7: Capstone Project (Days 61-75)

| Day | Topic | Vercel Rules | Impact | Note |
|-----|-------|--------------|--------|------|
| 61-75 | **Final Capstone** | Apply ALL React Core rules | - | Production-grade app |

### Phase 8-10: Ecosystem (Days 76-110)

| Day | Topic | Vercel Rules | Impact | Note |
|-----|-------|--------------|--------|------|
| 76-110 | Routing, State Libs, UI, Animations | Re-apply React Core rules in context | - | No new Vercel rules |

---

## 📅 NEXT.JS MODULE MAPPING (Days 111-120)

| Day | Topic | Vercel Rules | Impact | Integration Notes |
|-----|-------|--------------|--------|-------------------|
| **111** | Next.js Fundamentals | - | - | Concepts, file-based routing |
| **112** | Rendering Strategies | Decision framework (not a rule) | - | SSG/ISR/SSR/CSR decision tree |
| **114** | **Data Fetching** | `server-serialization`<br>`server-parallel-fetching`<br>`server-cache-react` | HIGH<br>CRITICAL<br>MEDIUM | RSC boundaries<br>Component composition<br>React.cache() |
| **115** | **Server Actions** | `async-api-routes` | CRITICAL | Start early, await late |
| **116** | **Streaming & Suspense** | `async-suspense-boundaries`<br>`rendering-hydration-no-flicker` | HIGH<br>MEDIUM | Strategic Suspense<br>Inline script pattern |
| **117** | SEO & Metadata | Re-emphasis: `server-serialization` | - | Metadata perf |
| **118** | **Optimization** | `bundle-dynamic-imports`<br>`bundle-defer-third-party` | CRITICAL<br>MEDIUM | next/dynamic<br>defer analytics |
| **119** | **Middleware** | `server-after-nonblocking` | MEDIUM | after() for logging |
| **120** | **Project 14** | `server-cache-lru` | HIGH | E-commerce with LRU cache |

---

## 🔍 QUICK LOOKUP: BY RULE NAME

### React Core Rules (32)

#### 🔴 CRITICAL (3)
| Rule | Days | Topic |
|------|------|-------|
| `async-parallel` | 19-20 | Promise.all for independent ops |
| `bundle-barrel-imports` | ⚠️ Mention only | Direct imports (no exercise in roadmap) |
| `bundle-dynamic-imports` | ⚠️ React: mention<br>118: Next.js | next/dynamic |

#### 🟠 HIGH (2)
| Rule | Days | Topic |
|------|------|-------|
| `async-defer-await` | 19-20 | Move await to branch |
| `rendering-content-visibility` | 58-60 | CSS content-visibility |

#### 🟡 MEDIUM (16)
| Rule | Days | Topic |
|------|------|-------|
| `rerender-functional-setstate` | 12 | Functional setState |
| `rerender-lazy-state-init` | 12 | Lazy state initialization |
| `rerender-defer-reads` | 16-17 | Don't subscribe if only in callbacks |
| `rerender-memo` | 32 | Extract to memoized components |
| `rerender-derived-state` | 33 | Subscribe to booleans |
| `rerender-transitions` | 47-48 | startTransition |
| `client-passive-event-listeners` | 18 | Passive listeners |
| `client-swr-dedup` | 19-20 | SWR auto-dedup |
| `client-localstorage-schema` | 19-20 | Version localStorage |
| `bundle-defer-third-party` | 118 (Next.js) | Defer analytics |
| `rendering-activity` | 50 | Activity component (React 19) |
| `js-cache-function-results` | 35 | Module-level Map cache |
| `js-cache-storage` | 35 | Cache localStorage reads |
| `js-tosorted-immutable` | 35 | toSorted() vs sort() |
| `js-length-check-first` | 35 | Early length check |
| `js-combine-iterations` | 35 | Combine filter/map |

#### 🟢 LOW (11)
| Rule | Days | Topic |
|------|------|-------|
| `rendering-conditional-render` | 6 | Ternary vs && |
| `rendering-animate-svg-wrapper` | 8 | Animate wrapper div |
| `rendering-svg-precision` | 8 | Reduce SVG precision |
| `rendering-hoist-jsx` | 58-60 | Hoist static JSX |
| `rerender-dependencies` | 16-17 | Narrow effect deps |
| `client-event-listeners` | 18 | Dedupe global listeners |
| `advanced-event-handler-refs` | 21-22 | Store handlers in refs |
| `advanced-use-latest` | 21-22 | useLatest hook |
| `js-index-maps` | 35 | Build maps for lookups |
| `js-*` (7 more) | 35 | Other JS micro-optimizations |

### Next.js Rules (13)

#### 🔴 CRITICAL (3)
| Rule | Days | Topic |
|------|------|-------|
| `server-parallel-fetching` | 114 | Component composition for parallel |
| `async-api-routes` | 115 | Start promises early |
| `bundle-dynamic-imports` | 118 | next/dynamic |

#### 🟠 HIGH (3)
| Rule | Days | Topic |
|------|------|-------|
| `server-serialization` | 114, 117 | Minimize props at RSC boundary |
| `async-suspense-boundaries` | 116 | Strategic Suspense |
| `server-cache-lru` | 120 | LRU cache across requests |

#### 🟡 MEDIUM (4)
| Rule | Days | Topic |
|------|------|-------|
| `server-cache-react` | 114 | React.cache() deduplication |
| `rendering-hydration-no-flicker` | 116 | Inline script pattern |
| `bundle-defer-third-party` | 118 | Defer analytics |
| `server-after-nonblocking` | 119 | after() for logging |

---

## 📈 IMPACT SUMMARY

### React Core (32 rules)
- **CRITICAL:** 3 rules (async optimization, bundle)
- **HIGH:** 2 rules (defer await, content-visibility)
- **MEDIUM:** 16 rules (re-renders, client fetching, JS perf)
- **LOW:** 11 rules (rendering patterns, advanced)

### Next.js (13 rules)
- **CRITICAL:** 3 rules (parallel fetching, API routes, dynamic imports)
- **HIGH:** 3 rules (serialization, Suspense, LRU cache)
- **MEDIUM:** 4 rules (React.cache, hydration, defer, after)

---

## 🎯 USAGE PATTERNS

### Pattern 1: Giảng ngày thường (có rules)
```markdown
# 📅 NGÀY X: [TOPIC]

[Content như bình thường...]

---

## 📚 VERCEL BEST PRACTICES

[Tra bảng mapping → inject rules tương ứng]

---

## 🏠 BÀI TẬP VỀ NHÀ
```

### Pattern 2: Giảng ngày không có rules
```markdown
# 📅 NGÀY X: [TOPIC]

[Content như bình thường - no Vercel section]
```

### Pattern 3: Project days (apply nhiều rules)
```markdown
# 📅 NGÀY X: ⚡ PROJECT

## 📚 Vercel Rules to Apply

[Checklist các rules đã học, áp dụng vào project]

- [ ] `async-parallel` - Parallel data fetching
- [ ] `rerender-functional-setstate` - Stable callbacks
- [ ] `js-index-maps` - Optimize lookups
...
```

---

## ✅ QA CHECKLIST

### Trước khi tạo content cho Ngày X:

1. ✅ Tra cứu mapping matrix → Rules nào áp dụng?
2. ✅ Đọc detailed integration (PROMPT VERCEL files)
3. ✅ Kiểm tra học viên đã học concepts cần thiết chưa?
4. ✅ Có ví dụ ❌ SAI và ✅ ĐÚNG
5. ✅ Có performance metrics
6. ✅ Có trade-offs analysis

---

## 🔗 RELATED FILES

- **React Core Details:** `PROMPT VERCEL BEST PRACTICES.md`
- **Next.js Details:** `PROMPT VERCEL NEXTJS BEST PRACTICES.md`
- **Roadmap:** `README.md`
- **Context:** `PROMPT CONTEXT CHUNG.md`

---

**Last Updated:** 2026-01-19  
**Total Rules Mapped:** 45 (32 React Core + 13 Next.js)
