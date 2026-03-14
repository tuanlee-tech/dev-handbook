# 🗺️ LỘ TRÌNH 6 THÁNG — MIDDLE/SENIOR FRONTEND REACT/NEXT.JS

### Tài liệu tổng hợp kế hoạch học tập & career transition

**Mục tiêu:** Vị trí Middle→Senior Frontend tại công ty Outsource US/EU
**Target lương:** 28–40M gross
**Địa điểm:** Đà Nẵng (ưu tiên remote) hoặc HCM
**Thời gian:** 6 tháng

---

## PHẦN 1 — BỨC TRANH THỊ TRƯỜNG

### Thực tế lương theo loại công ty

| Loại công ty        | HCM             | Đà Nẵng |
| ------------------- | --------------- | ------- |
| Outsource US/EU     | 28–45M          | 22–38M  |
| Product company     | 25–40M          | 20–32M  |
| Startup funded      | 25–45M + equity | 20–35M  |
| Công ty Nhật/Hàn    | 22–35M          | 18–28M  |
| Công ty nội địa nhỏ | 15–25M          | 12–22M  |

### Nhận định thực tế về bạn

Với 4 năm từ công ty nhỏ, không có dự án public, khi mới vào thị trường sẽ bị xếp ngưỡng **Middle**. Mức **28–33M là realistic cho lần đổi việc đầu tiên**. Mức 35–40M cần 1–2 năm thêm trong môi trường lớn hơn.

**Option tốt nhất:** Tìm công ty HCM cho **remote từ Đà Nẵng** — hưởng lương HCM rate, sống với chi phí Đà Nẵng.

---

## PHẦN 2 — TOÀN BỘ KIẾN THỨC CẦN NẮM

### 2.1 JavaScript Core — Nền tảng không được yếu

Đây là chỗ bị lộ ngay ở vòng phỏng vấn kỹ thuật dù đã dùng React nhiều năm.

**Phải nắm chắc:**

- Execution context, call stack, event loop, microtask vs macrotask
- Closure, hoisting, scope chain
- Prototype chain, `this` binding — call/apply/bind
- Async: Promise, async/await, Promise.all / race / allSettled
- Destructuring, spread/rest, optional chaining, nullish coalescing
- Array methods: map/filter/reduce/find/some/every — viết tay được không cần tra
- Immutability — hiểu tại sao và cách làm
- Module system: ESM vs CommonJS

---

### 2.2 TypeScript

**Phải nắm:**

- Interface vs Type — khi nào dùng cái nào
- Generic types: `<T>`, `<T extends ...>`, `<T = Default>`
- Utility types: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `ReturnType`, `Parameters`
- Union `|` và Intersection `&`
- Type narrowing: `typeof`, `instanceof`, `in`, discriminated union
- `as const`, `satisfies`
- Strict mode — phải quen làm việc với `strict: true`
- Typing cho React: `FC`, `ReactNode`, `ReactElement`, `MouseEvent`, `ChangeEvent`, `RefObject`
- Typing API response với generic

---

### 2.3 React — Phải hiểu bên trong, không chỉ dùng

**Rendering & Re-render:**

- React reconciliation, diffing algorithm
- Khi nào component re-render: state, props, context, parent re-render
- `memo` — khi nào có tác dụng, khi nào vô nghĩa
- `useMemo` vs `useCallback` — hiểu bản chất, không dùng bừa
- Batching updates (React 18 automatic batching)

**Hooks — hiểu sâu:**

- `useState` — functional update, lazy initialization
- `useEffect` — dependency array, cleanup, stale closure pitfall
- `useRef` — không chỉ cho DOM, lưu giá trị không trigger re-render
- `useReducer` — khi nào dùng thay useState
- `useContext` — cách tối ưu tránh re-render thừa
- `useLayoutEffect` vs `useEffect`
- `useDeferredValue`, `useTransition` — React 18 concurrent
- `useId` — dùng cho accessibility

**Custom Hooks:**

- Tách logic ra custom hook đúng cách
- Các pattern hay gặp: `useDebounce`, `useLocalStorage`, `useFetch`, `useIntersectionObserver`

**Patterns:**

- Compound component pattern
- Controlled vs Uncontrolled component
- Lifting state up vs colocating state
- Code splitting với `lazy` + `Suspense`
- Virtualization cho danh sách dài (react-virtual / react-window)

**Performance:**

- Code splitting với `lazy` + `Suspense`
- Virtualization cho danh sách dài (react-virtual hoặc react-window)
- Tránh prop drilling đúng cách

---

### 2.4 Next.js 14+ App Router — Trọng tâm nhất, gap lớn nhất thị trường

**App Router fundamentals:**

- Folder structure: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- `template.tsx` vs `layout.tsx` — khác nhau chỗ nào
- Route groups `(group)`, parallel routes `@slot`, intercepting routes `(..)`

**Server Components vs Client Components:**

- Mặc định là Server Component
- Khi nào phải thêm `"use client"` — event handlers, hooks, browser APIs
- Không thể import Server Component vào Client Component trực tiếp
- Data fetching trong Server Component với `fetch` và cache options
- Streaming với `Suspense`

**Data Fetching & Caching:**

- `fetch` với `{ cache: 'force-cache' }`, `{ cache: 'no-store' }`, `{ next: { revalidate: 3600 } }`
- `unstable_cache` cho function không phải fetch
- `revalidatePath`, `revalidateTag`
- Static vs Dynamic rendering

**Server Actions:**

- `"use server"` directive
- Form submission với Server Actions
- Optimistic updates với `useOptimistic`
- `redirect()`, `notFound()` bên trong Server Actions

**Routing nâng cao:**

- Dynamic routes `[slug]`, catch-all `[...slug]`, optional `[[...slug]]`
- `generateStaticParams` cho SSG
- `generateMetadata` cho SEO dynamic

**Middleware:**

- `middleware.ts` — authentication, redirect, A/B testing
- `matcher` config

**Tối ưu:**

- `next/image` — biết hết các props quan trọng
- `next/font` — không dùng Google Fonts CDN nữa
- `next/link` — prefetching behavior
- Bundle analyzer — debug bundle size

---

### 2.5 State Management — Hiểu đúng để không dùng sai

**Mental model quan trọng nhất — phân biệt 2 loại state:**

```
CLIENT STATE              SERVER STATE
"UI state"                "Data từ server"

Modal open/close          Danh sách users
Selected tab              Product list
Form values               User profile
Sidebar collapsed         Orders

Tool: Zustand/Context     Tool: TanStack Query
      Redux                     RTK Query
```

**Sai lầm phổ biến nhất:** Dùng Redux/Zustand để lưu data fetch từ API. Đây là anti-pattern — bạn tự làm lại những gì TanStack Query đã làm tốt hơn.

---

**Context API:**

- Không phải state management tool — là dependency injection
- Giải quyết prop drilling, không giải quyết complex state logic
- Phù hợp cho: theme, locale, auth user, feature flags — những thứ ít thay đổi
- Vấn đề: mọi consumer re-render khi value thay đổi → không dùng cho state thay đổi thường xuyên

---

**Zustand:**

- Store đơn giản, không cần Provider
- Selector để tránh re-render thừa — chỉ subscribe field cần thiết
- Middleware quan trọng: `immer` (mutate trực tiếp), `persist` (lưu localStorage), `devtools`
- Slice pattern — chia store lớn thành slices độc lập
- Khi nào chọn Zustand: project mới, team nhỏ, không cần Redux DevTools time-travel

---

**Redux Legacy → Redux Toolkit:**

Redux gốc — phải biết vì codebase cũ đầy, nhưng không cần master:

- Store = single source of truth
- State = read only, chỉ thay đổi qua dispatch action
- Reducer = pure function, không side effects, phải return new object

Redux Toolkit — đây mới là thứ cần thành thục:

- `createSlice` — action types + action creators + reducer trong 1 chỗ
- Dùng Immer bên trong → mutate trực tiếp được trong reducer
- `createAsyncThunk` — handle async sạch hơn Thunk thuần
- `configureStore` — auto setup DevTools, middleware
- Typed hooks: `useAppSelector`, `useAppDispatch`

Câu hỏi hay bị hỏi phỏng vấn:

- _"Tại sao Redux yêu cầu immutability?"_ → React so sánh reference để detect thay đổi. Mutate trực tiếp thì reference không đổi, UI không update.
- _"RTK khác Redux gốc chỗ nào?"_ → Immer, createSlice, configureStore, createAsyncThunk.
- _"Khi nào dùng Redux thay Zustand?"_ → App lớn nhiều team, cần time-travel debugging, codebase đã có Redux.

---

**TanStack Query — quan trọng nhất, thay đổi cách fetch data:**

Core concepts:

- `useQuery` — fetch data, auto caching, auto refetch
- Query Keys = cache key — tổ chức theo hierarchy: `['users']`, `['users', id]`, `['users', { status }]`
- `staleTime` = bao lâu data được coi là fresh, không refetch
- `gcTime` = sau khi unmount, giữ cache bao lâu
- `useMutation` — POST/PUT/DELETE với onMutate/onError/onSettled
- Optimistic updates — UI cập nhật ngay không đợi server, rollback nếu lỗi
- `useInfiniteQuery` — infinite scroll
- Prefetching — preload data trước khi user navigate
- `queryClient.invalidateQueries` — trigger refetch

---

**RTK Query:**

- TanStack Query tích hợp vào Redux store
- Định nghĩa API endpoints tập trung trong `createApi`
- `providesTags` / `invalidatesTags` — auto refetch khi mutation xảy ra
- Auto-generated hooks từ endpoint definitions
- Dùng khi: project đã có Redux, muốn API state trong Redux store

|             | TanStack Query    | RTK Query               |
| ----------- | ----------------- | ----------------------- |
| Setup       | Độc lập, nhẹ      | Cần Redux store         |
| Flexibility | Cao, custom nhiều | Ít hơn, theo convention |
| Best for    | Project mới       | Project đã dùng Redux   |
| Market      | Phổ biến hơn      | Enterprise cũ           |

---

**TanStack Query (React Query) — bắt buộc:**

- `useQuery`, `useMutation`, `useInfiniteQuery`
- Query keys — cách tổ chức đúng
- Stale time vs cache time
- Background refetching, window focus refetching
- Optimistic updates
- `queryClient.invalidateQueries`, `prefetchQuery`
- Suspense mode với React 18

**Zustand:**

- Tạo store, slice pattern
- Middleware: `persist`, `devtools`, `immer`
- Selector để tránh re-render thừa

**Jotai (biết cơ bản):**

- Atom, derived atom
- Khi nào chọn Jotai thay Zustand

**Redux Toolkit (biết đọc, không cần deep):**

- `createSlice`, `createAsyncThunk`
- RTK Query — nhiều codebase cũ vẫn dùng

---

### 2.6 Styling

**Tailwind CSS — phải thành thục:**

- Responsive: `sm:`, `md:`, `lg:`, `xl:`
- Dark mode: `dark:`
- Arbitrary values: `w-[320px]`, `bg-[#custom]`
- `@apply` trong CSS — khi nào nên/không nên
- `clsx` + `tailwind-merge` — pattern chuẩn để merge class
- `cva` (class-variance-authority) — component variants

**CSS quan trọng:**

- Flexbox và Grid — thành thục, không tra Google
- CSS variables, `calc()`
- Animation: `transition`, `@keyframes`
- `position`: static/relative/absolute/fixed/sticky — biết rõ stacking context
- CSS specificity, animation

**Component Libraries — biết ít nhất 1:**

- shadcn/ui — đang hot nhất, code bạn own
- Radix UI primitives
- Headless UI

---

### 2.7 Forms

**React Hook Form — tiêu chuẩn:**

- `register`, `handleSubmit`, `formState`
- `Controller` cho controlled component
- `useFieldArray` cho dynamic fields
- Validation với Zod (phổ biến nhất hiện tại)
- `zodResolver`

**Zod:**

- Schema validation: string, number, object, array, enum, union
- Transform, refine, superRefine
- Infer TypeScript type từ schema: `z.infer<typeof schema>`, `zodResolver`
- Pattern: define Zod schema → infer TypeScript type → pass vào RHF

---

### 2.8 Testing

**Vitest + React Testing Library:**

- Render component, query by role/text/testid
- `fireEvent` vs `userEvent`
- Mock module, mock fetch
- Test custom hooks với `renderHook`
- Async testing với `waitFor`

**Nguyên tắc testing:**

- Test behavior, không test implementation
- AAA pattern: Arrange, Act, Assert
- Biết viết test cho: form submit, async data fetching, conditional render, custom hooks

**E2E (biết cơ bản):**

- Playwright hoặc Cypress — biết cách viết basic test flow

---

### 2.9 Performance & Core Web Vitals

**Metrics phải hiểu:**

- LCP (Largest Contentful Paint) — target < 2.5s
- FID/INP (Interaction to Next Paint) — target < 200ms
- CLS (Cumulative Layout Shift) — target < 0.1
- TTFB (Time to First Byte)

**Kỹ thuật tối ưu:**

- Image optimization: WebP/AVIF, lazy loading, `srcset`
- Font optimization: `font-display: swap`, preload
- Bundle splitting: dynamic import, tree shaking
- Prefetching, preconnect, dns-prefetch
- Memoization đúng chỗ
- Tránh layout thrashing
- Debounce/throttle cho event handlers

---

### 2.10 Tooling & DX

**Git:**

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Git flow: feature branch, PR workflow
- Rebase vs merge — biết khi nào dùng gì
- Interactive rebase, cherry-pick, stash

**Build tools:**

- Vite — config cơ bản, alias, env variables
- Biết đọc bundle analyzer output

**Code quality:**

- ESLint config (eslint-config-next, airbnb rules)
- Prettier
- Husky + lint-staged — pre-commit hooks
- CommitLint

**CI/CD (hiểu flow, không cần deep):**

- GitHub Actions — đọc và sửa được workflow YAML
- Vercel deployment — preview deploy, env variables
- Environment variables — biết phân biệt server vs client env trong Next.js

**Docker (biết cơ bản):**

- Đọc Dockerfile
- `docker-compose` cơ bản
- Nhiều JD Senior mention điều này

---

### 2.11 Accessibility (A11y) — Điểm phân biệt Senior

- Semantic HTML: dùng đúng tag (`button` không phải `div`, `nav`, `main`, `article`)
- ARIA attributes: `aria-label`, `aria-expanded`, `role`
- Keyboard navigation
- Focus management
- Color contrast
- Screen reader basics

Nhiều công ty product coi đây là tiêu chí Senior bắt buộc.

---

### 2.12 Security

- XSS — không dùng `dangerouslySetInnerHTML` bừa
- CSRF
- Không expose secret key ra client
- Input sanitization
- Content Security Policy cơ bản

---

## PHẦN 3 — TIẾNG ANH KỸ THUẬT CHO PHỎNG VẤN

### Mục tiêu thực tế

Không cần IELTS. Cần: đọc tài liệu kỹ thuật thoải mái, hiểu câu hỏi phỏng vấn, giải thích technical decision rõ ràng.

### Lộ trình 6 tháng song song

**Tháng 1–2 — Nghe + đọc:**

- Đọc documentation tiếng Anh thay vì tìm bản dịch: React docs, Next.js docs, MDN
- Nghe: Syntax.fm podcast, Fireship YouTube — vừa học kỹ thuật vừa luyện nghe
- Học 5–10 từ vựng kỹ thuật/ngày

**Tháng 3–4 — Luyện nói:**

- Shadowing: nghe rồi nói theo podcast/video kỹ thuật
- Ghi âm lại mình giải thích project bằng tiếng Anh, nghe lại
- Dùng Claude/ChatGPT: đặt câu hỏi kỹ thuật bằng tiếng Anh, nhờ sửa câu trả lời
- Practice trả lời câu hỏi phỏng vấn phổ biến bằng tiếng Anh (STAR method)

**Tháng 5–6 — Mock interview:**

- Tự record video giải thích từng project của mình bằng tiếng Anh
- Dùng Pramp hoặc Interviewing.io để practice với người thật
- Luyện small talk kỹ thuật: "Tell me about yourself", "Why are you looking for a new role"

### Từ vựng kỹ thuật phải thuộc

**Mô tả architecture:**

- scalable, maintainable, extensible, performant
- trade-off, bottleneck, overhead
- modular, reusable, decoupled
- single source of truth, separation of concerns

**Mô tả quá trình làm việc:**

- I refactored... / I optimized... / I implemented...
- We faced a challenge where... / The root cause was...
- I decided to use X because... / The trade-off was...
- It reduced load time by X% / improved performance significantly

**Phỏng vấn behavioral:**

- stakeholder, deadline, collaborate, align, prioritize
- I took ownership of... / I proactively...
- In retrospect... / If I could redo it...

### Câu trả lời phỏng vấn mẫu

**"Tell me about yourself"**

> "I'm a Frontend Developer with 4 years of experience, primarily working with React. I've been responsible for building and maintaining internal web applications end-to-end. Over the past 6 months, I've been deepening my expertise in Next.js App Router, TypeScript, and modern state management. I'm now looking to join a product-focused team where I can work at a larger scale."

**"Why do you want to leave your current company?"**

> "I've learned a lot in a small team — I had to handle many responsibilities which gave me broad experience. But I'm at a point where I want to work with a larger engineering team, be exposed to more complex systems, and have a clearer technical growth path."

**"Explain a technical challenge you faced"**

> "In one project, we had a performance issue where the page re-rendered too frequently. I profiled it using React DevTools and found the root cause was a context value changing on every render. I resolved it by splitting the context and memoizing the values, which reduced unnecessary re-renders by about 80%."

---

## PHẦN 4 — 3 PORTFOLIO PROJECTS — NHẮM ĐÚNG JD

### JD phân tích — Keywords xuất hiện nhiều nhất

Dựa trên JD Middle/Senior Frontend tại ITviec, TopDev hiện tại, đây là những từ xuất hiện nhiều nhất:

```
React / Next.js · TypeScript · TanStack Query · Tailwind CSS
REST API integration · Authentication (JWT) · Performance optimization
Responsive design · Git workflow · Testing · Vercel · CI/CD
SSR / SSG / ISR · App Router · State management · Agile/Scrum
```

### Thiết kế dựa trên: Outsource US/EU target + interests (Tài chính, Fitness, AI, Du lịch) + strengths (UI/UX, Logic, Performance, API)

---

### Project 1 — 💰 AI Finance Dashboard

**"Personal finance tracker với AI-powered insights"**

**Tại sao chọn:** Fintech SaaS dashboard là domain outsource US/EU trả tiền cao nhất. AI + finance là combo hot 2025–2026. Bạn tự dùng app này nên câu chuyện khi phỏng vấn authentic.

**User story:** Người dùng kết nối tài khoản/nhập giao dịch thủ công → app tự phân loại chi tiêu → AI phân tích pattern và đưa ra gợi ý tiết kiệm → dashboard hiển thị forecast tháng tới.

**Tech stack (nhắm JD keywords):**

**Framework & Language**

- Next.js 14 App Router + TypeScript strict

**Database & Backend**

- Prisma + Neon PostgreSQL — database + ORM

**Authentication**

- NextAuth.js v5 — Google OAuth + credentials

**State Management**

- TanStack Query — transactions, dashboard stats, infinite scroll
- Zustand + persist — filter state, date range, category
- RTK Query — refactor 1 feature (để có RTK Query trong CV)

**UI & Styling**

- shadcn/ui + Tailwind

**Forms & Validation**

- React Hook Form + Zod — add transaction form

**Data Visualization**

- Recharts + Tremor — line, bar, pie, area charts + metric cards

**AI**

- Vercel AI SDK + OpenAI GPT-4o-mini — spending coach, forecast (streaming)

**Export**

- @react-pdf/renderer — export monthly report PDF

**Testing**

- Vitest + RTL — ít nhất 20 test cases

**DevOps**

- GitHub Actions — CI lint + test + build
- Vercel — deployment + preview

---

**Features tạo khác biệt — cái bình thường không có:**

- **AI Spending Coach:** Mỗi tuần AI tóm tắt pattern chi tiêu và đưa ra 3 gợi ý cụ thể (dùng Vercel AI SDK với streaming response)
- **Budget Forecast:** Dựa vào 3 tháng data, predict chi tiêu tháng tới theo category — dùng simple linear regression tự implement (chứng minh bạn handle data logic)
- **Anomaly highlight:** Tự động highlight giao dịch bất thường so với trung bình (ví dụ tháng này ăn ngoài gấp đôi bình thường)
- **Export report:** Xuất PDF monthly report — flex thêm skill

**JD keywords cover:** Dashboard · Data visualization · AI integration · Authentication · CRUD · TypeScript · API integration · PostgreSQL · Streaming UI

**Câu chuyện phỏng vấn:**

> _"I built this because I wanted to understand where my money was going each month. The interesting technical challenge was implementing the AI forecast feature — I had to think carefully about how to stream the AI response progressively so the UI doesn't block while waiting."_

> _"The interesting challenge was implementing the AI forecast — I had to think carefully about how to stream the AI response progressively so the UI doesn't block while waiting."_

---

### Project 2 — 🏃 FitSync — Workout & Health Tracker

**"Real-time workout logger với body metrics analytics"**

**Tại sao chọn:** Health/fitness app là domain outsource US/EU hay gặp nhất. Flex được real-time features, complex UI state, mobile-first design. Build trước vì ít dependencies nhất.

**User story:** User tạo workout plan → log từng buổi tập (sets, reps, weight) → xem progress chart theo thời gian → tracker calories + macros → weekly summary.

**Tech stack:**

**Framework & Language**

- Next.js 14 App Router + TypeScript strict

**Database & Backend**

- Supabase — PostgreSQL + Auth + Realtime + Storage

**Authentication**

- Supabase Auth — email + OAuth

**State Management**

- TanStack Query — sync workout data, cache server state
- Zustand + immer — workout session state machine (idle → active → rest → complete)
- Context API — AuthProvider pattern

**UI & Styling**

- shadcn/ui + Tailwind — mobile-first UI
- Framer Motion — live workout transitions, animations

**Forms & Validation**

- React Hook Form + Zod — log workout form

**Data Visualization**

- Recharts — progress charts (weight, volume, body metrics)

**PWA**

- next-pwa — offline support, installable trên mobile

**Testing**

- Vitest + RTL — test state machine logic, form validation
- Playwright — E2E basic flows

**DevOps**

- GitHub Actions — CI lint + test + build
- Vercel — deployment + preview

**Features tạo khác biệt:**

- Live workout mode: Khi đang tập, app vào "focus mode" — full screen, timer giữa sets, swipe next exercise — `useReducer` state machine (Rest → Active → Complete)
- Progressive overload indicator: Tự động so sánh buổi tập hôm nay với buổi trước, highlight nếu bạn tăng weight/reps (visual feedback xanh/đỏ)
- Body metrics chart: Nhập cân nặng, body fat % theo ngày → chart trend với goal line
- PWA + offline: Log workout ngay cả khi không có mạng (gym hay mất sóng), sync lại khi có internet — dùng Supabase offline-first pattern
- Share workout: Generate ảnh summary buổi tập để share (dùng `html-to-image` hoặc Vercel OG)

**JD keywords cover:** Real-time · State machine · Mobile-first · PWA · Offline support · Complex UI · Animation · Performance · Supabase/PostgreSQL

**Câu chuyện phỏng vấn:**

> _"The most interesting challenge was designing the live workout session — it's a state machine with strict transitions. I used useReducer to model states explicitly: idle → active → rest → complete. This made logic predictable and easy to test."_

---

### Project 3 — ✈️ WanderAI — AI Travel Planner

**"Trip planning với AI itinerary generator + collaborative editing"**

**Tại sao chọn:** Đây là **differentiator project** — không phải CRUD thông thường. AI + collaboration là hai thứ outsource US/EU startup đang đổ tiền vào. Project phức tạp nhất — để build cuối khi đã quen stack. Chứng minh được level Senior territory.

**User story:** User nhập điểm đến + ngân sách + sở thích → AI tạo itinerary chi tiết theo ngày → user chỉnh sửa, kéo thả sắp xếp lại → invite bạn bè cùng edit → export lịch trình ra PDF/calendar.

**Tech stack:**

**Framework & Language**

- Next.js 14 App Router + TypeScript strict

**Database & Backend**

- Supabase — PostgreSQL + Auth + Realtime + Storage

**Authentication**

- Supabase Auth — email + OAuth

**State Management**

- TanStack Query — trips, itinerary data
- Zustand — editor UI state, active trip state

**UI & Styling**

- shadcn/ui + Tailwind
- Framer Motion — page transitions, itinerary animations

**Forms & Validation**

- React Hook Form + Zod — trip creation form

**AI**

- Vercel AI SDK + OpenAI GPT-4o — streaming itinerary generation

**Map**

- Mapbox GL JS — interactive map, pins, route display

**Drag & Drop**

- @dnd-kit/core + @dnd-kit/sortable — reorder days & activities

**Real-time Collaboration**

- Supabase Realtime — live editing sync
- Supabase Presence — collaborative cursor tracking

**Testing**

- Vitest + RTL — unit tests
- Playwright — E2E: tạo trip, generate itinerary, drag & drop

**DevOps**

- GitHub Actions — CI lint + test + build
- Vercel — deployment + preview

**Features tạo khác biệt:**

- **AI streaming itinerary:** User nhấn "Generate" → itinerary xuất hiện từng dòng như ChatGPT (Vercel AI SDK `useChat` hoặc `useCompletion`) — visual rất ấn tượng khi demo
- **Interactive map:** Mỗi activity trong itinerary có pin trên map, click pin highlight activity trong list và ngược lại — two-way binding
- **Drag & drop reorder:** Kéo thả để sắp xếp lại ngày/activity trong itinerary (dùng `@dnd-kit`)
- **Collaborative cursor:** Khi 2 người cùng edit, thấy cursor của nhau real-time (Supabase Presence) — đây là feature "wow" khi demo
- **Budget tracker:** Tự động tính tổng budget dựa trên activities, highlight nếu vượt ngân sách

**JD keywords cover:** AI integration · Streaming · Real-time collaboration · Drag & drop · Map · Complex state · E2E testing

**Câu chuyện phỏng vấn:**

> _"The collaborative editing was the hardest part — I had to think about conflict resolution when two users edit simultaneously. I designed the data model so each activity is an independent unit to minimize merge conflicts."_

---

### Thứ tự build & so sánh

**Thứ tự build:** FitSync trước (ít dependencies nhất, dễ done) → Finance Dashboard → WanderAI (phức tạp nhất, để cuối khi đã quen stack).

|                  | FitSync           | Finance AI          | WanderAI              |
| ---------------- | ----------------- | ------------------- | --------------------- |
| **Thứ tự build** | 1st               | 2nd                 | 3rd                   |
| **Build time**   | ~5 tuần           | ~6 tuần             | ~6 tuần               |
| **Domain**       | Health SaaS       | Fintech SaaS        | Travel/AI SaaS        |
| **Wow feature**  | Live workout mode | AI coach + forecast | AI streaming + collab |
| **Độ phức tạp**  | ⭐⭐⭐            | ⭐⭐⭐⭐            | ⭐⭐⭐⭐⭐            |

### So sánh nhanh

|                   | 🏃 FitSync        | 💰 Finance        | ✈️ WanderAI       |
| ----------------- | ----------------- | ----------------- | ----------------- |
| **Framework**     | Next.js 14        | Next.js 14        | Next.js 14        |
| **Database**      | Supabase          | Neon + Prisma     | Supabase          |
| **Auth**          | Supabase Auth     | NextAuth.js v5    | Supabase Auth     |
| **Server State**  | TanStack Query    | TanStack Query    | TanStack Query    |
| **Client State**  | Zustand + Context | Zustand + persist | Zustand           |
| **RTK Query**     | ❌                | ✅ 1 feature      | ❌                |
| **AI**            | ❌                | GPT-4o-mini       | GPT-4o            |
| **Realtime**      | Supabase Realtime | ❌                | Supabase Realtime |
| **Collaboration** | ❌                | ❌                | Supabase Presence |
| **Charts**        | Recharts          | Recharts + Tremor | ❌                |
| **Map**           | ❌                | ❌                | Mapbox GL JS      |
| **DnD**           | ❌                | ❌                | @dnd-kit          |
| **PWA**           | ✅                | ❌                | ❌                |
| **PDF Export**    | ❌                | ✅                | ❌                |
| **E2E Testing**   | Playwright        | ❌                | Playwright        |
| **Build order**   | 1st 🟢            | 2nd 🟡            | 3rd 🔴            |

Mỗi project cố tình **khác nhau ở DB và Auth** — Supabase vs Neon+Prisma, Supabase Auth vs NextAuth.js — để CV nói được "đã làm việc với nhiều stack" thay vì lặp lại cùng một bộ tool.

---

### README template cho mỗi project

```
# Project Name

## Overview
[1-2 câu mô tả bài toán project giải quyết]

## Features
[Danh sách tính năng chính]

## Tech Stack
Next.js 14 · TypeScript · TanStack Query · ...

## Architecture decisions
[Tại sao chọn tech này, trade-off là gì]

## Performance
Lighthouse: Performance 96 / SEO 100 / A11y 92
TTI: 1.2s

## Getting Started
[Rõ ràng, copy-paste được]

## Screenshots / Demo
[Link demo + screenshots]
```

---

## PHẦN 5 — KẾ HOẠCH 6 THÁNG CHI TIẾT

### Tháng 1 — JavaScript Core + TypeScript + App Router

**Tuần 1–2: Next.js App Router**

- Đọc hết official Next.js docs phần App Router
- Build lại 1 project cũ nhỏ bằng App Router để cảm nhận sự khác biệt
- Hiểu Server Components thực sự, không chỉ đọc lý thuyết

**Tuần 3–4: TypeScript**

- TypeScript Handbook chính thức
- Làm lại project vừa build với TypeScript strict mode
- Tập focus vào: generics, utility types, typing cho React

**Song song mỗi ngày:** Đọc doc tiếng Anh, 5–10 từ vựng kỹ thuật

---

### Tháng 2 — State Management thực chiến

**Tuần 1: Context API → Build AuthProvider**

- Hiểu Context là dependency injection, không phải state manager
- Build `AuthProvider` với `useReducer` bên trong cho FitSync

**Tuần 2: Zustand → Build WorkoutSessionStore**

- Core API, selectors, middleware (immer + persist)
- Build `useWorkoutSessionStore` — state machine cho live workout

**Tuần 3–4: TanStack Query — Query + Mutation**

- `useQuery`, `useMutation`, query keys, staleTime vs gcTime
- Fetch workout data, add log với optimistic updates
- `invalidateQueries` pattern

**Song song:** Luyện shadowing podcast kỹ thuật (Syntax.fm)

---

### Tháng 3 — Build Project 1: FitSync

**Tuần 1–2: Setup + core features**

- Project setup: Next.js + TypeScript + Tailwind + shadcn/ui
- Auth với Supabase, protected routes
- Workout plan CRUD

**Tuần 3: Live workout mode**

- State machine với `useReducer`
- Timer, set tracking, swipe gestures
- Mobile-first UI với Framer Motion

**Tuần 4: Polish + Testing**

- PWA setup, offline support
- Charts với Recharts
- Vitest + RTL — ít nhất 15 test cases
- Deploy Vercel, Lighthouse audit

**Song song:** Bắt đầu record giải thích project bằng tiếng Anh

---

### Tháng 4 — TanStack Query nâng cao + Redux + Build Project 2

**Tuần 1: TanStack Query advanced**

- `useInfiniteQuery` — infinite scroll
- Prefetching pattern
- Suspense mode

**Tuần 2: Redux Legacy → RTK**

- Đọc + hiểu Redux gốc (tại sao cần immutability)
- Redux Toolkit: `createSlice`, `createAsyncThunk`, `configureStore`
- RTK Query cơ bản

**Tuần 3–4: Build Finance Dashboard**

- Setup + Authentication
- Transaction CRUD với optimistic updates
- Charts + AI integration (Vercel AI SDK)

**Song song:** Luyện trả lời câu hỏi phỏng vấn behavioral bằng tiếng Anh

---

### Tháng 5 — Hoàn thiện Finance Dashboard + Build WanderAI

**Tuần 1–2: Hoàn thiện Project 2**

- AI Spending Coach với streaming
- Budget forecast logic
- Testing + performance optimization
- Lighthouse 90+

**Tuần 3–4: Bắt đầu WanderAI**

- Setup + Auth + DB schema
- AI streaming itinerary (Vercel AI SDK)
- Map integration (Mapbox)

**Song song:** Bắt đầu build portfolio site bằng Next.js

---

### Tháng 6 — WanderAI + Portfolio + Apply

**Tuần 1–2: Hoàn thiện WanderAI**

- Drag & drop với @dnd-kit
- Supabase Realtime — collaborative cursor
- Playwright E2E tests

**Tuần 3: Portfolio site + CV**

- Portfolio site: `/, /projects, /uses` — deploy trên Vercel với domain riêng
- CV chuẩn hóa với keywords từ JD
- Tất cả GitHub README hoàn chỉnh

**Tuần 4: Apply + Mock interview**

- Apply qua ITviec, TopDev (chất lượng hơn TopCV cho IT)
- Kết nối Tech Lead/Engineering Manager qua LinkedIn trực tiếp
- Tham gia ReactJS Vietnam, Đà Nẵng IT community
- Lấy feedback từ phỏng vấn thật để điều chỉnh

---

## PHẦN 6 — CV STRUCTURE

```
[Tên] — Frontend Developer (React / Next.js)
[Email] | [GitHub] | [Portfolio URL] | [LinkedIn]

━━━ SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend Developer 4+ năm kinh nghiệm xây dựng web
application. Thành thạo React, Next.js 14 App Router,
TypeScript. Kinh nghiệm tối ưu performance và tích hợp
REST API. Tư duy end-to-end từ UI đến deployment.

━━━ SKILLS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Core:       React 18, Next.js 14 (App Router), TypeScript
Styling:    Tailwind CSS, shadcn/ui, Framer Motion
State:      Zustand, TanStack Query, Redux Toolkit
Testing:    Vitest, React Testing Library, Playwright
Tools:      Git, Vercel, Supabase, Prisma, GitHub Actions

━━━ PROJECTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FitSync — [demo] | [GitHub]
Next.js 14 · TypeScript · Supabase · PWA · Framer Motion
• Real-time workout tracker với live session mode (state machine)
• Progressive overload tracking, body metrics analytics
• PWA với offline support — Lighthouse Performance 96

AI Finance Dashboard — [demo] | [GitHub]
Next.js 14 · TanStack Query · Vercel AI SDK · PostgreSQL
• AI-powered spending insights với streaming response
• Budget forecast dựa trên historical data pattern
• Optimistic updates cho transaction CRUD

WanderAI — [demo] | [GitHub]
Next.js 14 · Vercel AI SDK · Supabase Realtime · Mapbox
• AI itinerary generator với streaming UI
• Collaborative editing real-time với cursor presence
• Drag & drop trip planning, interactive map

━━━ EXPERIENCE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend Developer — [Công ty] (2021 – nay)
• Xây dựng và maintain [X] internal web application
  phục vụ [Y] người dùng nội bộ
• Responsible for full cycle: UI design → implementation
  → deployment trên [platform]
• Stack: React, [...]

━━━ EDUCATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Trường / Chứng chỉ nếu có]
```

---

## PHẦN 7 — CHECKLIST TRƯỚC KHI APPLY

**Kỹ thuật:**

- Giải thích được re-render optimization mà không cần tra Google
- Phân biệt được Server Component vs Client Component và lý do chọn
- Giải thích staleTime vs gcTime trong TanStack Query
- Giải thích tại sao Redux cần immutability
- Viết custom hook từ đầu trong phỏng vấn live coding

**Portfolio:**

- 3 projects có demo live + GitHub public
- README đủ: overview, tech stack, architecture decisions, performance metrics
- Lighthouse score 90+ cho cả 3 projects
- Portfolio site với domain riêng

**Tiếng Anh:**

- Record và xem lại video mình giải thích từng project — phải nghe được rõ ràng
- Trả lời được "Tell me about yourself" trong 90 giây không vấp

**Apply:**

- CV 1 trang, keywords match JD
- GitHub profile README có avatar, bio, featured repos
- LinkedIn cập nhật với portfolio link

---

## LƯU Ý QUAN TRỌNG

Khi quay lại bàn về từng project, sẽ đi sâu vào: folder structure, database schema, component architecture, state flow diagram, và danh sách câu hỏi phỏng vấn thường gặp cho từng tech stack đã dùng.

**Thứ tự ưu tiên tuyệt đối trong 4 tuần đầu:**

1. Next.js App Router — gap lớn nhất, hỏi nhiều nhất
2. TypeScript strict — bị loại ngay vòng CV nếu không có
3. TanStack Query — gần như bắt buộc trong mọi JD Middle+
4. Zustand — thay thế Redux ở hầu hết project mới

---

_Tài liệu này sẽ được cập nhật sau mỗi giai đoạn. Gặp lại ở bước build project để đi vào architecture chi tiết._
