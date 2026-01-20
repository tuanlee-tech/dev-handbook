# VERCEL REACT BEST PRACTICES - INTEGRATION GUIDE

**Nguồn:** Vercel Engineering react-best-practices (January 2026)  
**Scope:** React Core (Framework-Agnostic) - 32 Rules  
**Mục đích:** Tích hợp best practices từ Vercel vào khóa React Mastery

---

## 📋 TRIẾT LÝ TÍCH HỢP

### 🎯 Nguyên tắc cốt lõi

1. **Progressive Introduction**: Rules được giới thiệu KHI HỌC VIÊN ĐÃ CÓ KIẾN THỨC NỀN
2. **Context-First**: Luôn giải thích PROBLEM trước khi show SOLUTION
3. **Production Mindset**: Mỗi rule đều có real-world impact metrics
4. **Trade-off Transparency**: Không có "perfect solution", chỉ có "right choice for context"

### ⚠️ Quy tắc vàng

- ❌ **KHÔNG** giới thiệu rule trước khi học concepts cần thiết
- ✅ **PHẢI** có ví dụ ❌ SAI và ✅ ĐÚNG cho mọi rule
- ✅ **PHẢI** giải thích WHY và WHEN TO USE
- ✅ **PHẢI** có performance metrics (ms, KB, % improvement)

---

## 🗺️ TỔNG QUAN 32 RULES

| Category | Rules | Impact | Applicable Days |
|----------|-------|--------|-----------------|
| Async Patterns | 3 | CRITICAL-HIGH | 16-20, 26-28 |
| Bundle Optimization | 3 | CRITICAL-MEDIUM | 8, 31-35 |
| Client Data Fetching | 4 | MEDIUM-HIGH | 16-25, 81-84 |
| Re-render Optimization | 7 | MEDIUM | 11-12, 31-35 |
| Rendering Performance | 6 | MEDIUM-LOW | 6-10, 31-35, 46-50 |
| JavaScript Performance | 12 | LOW-MEDIUM | 31-35, 53-60 |
| Advanced Patterns | 2 | LOW | 21-25 |

---

## 📅 MAPPING: RULES → ROADMAP DAYS

### 🟢 PHASE 1: NỀN TẢNG REACT (Ngày 1-15)

#### Ngày 6: Lists & Keys
**Applicable Rules:**
- ✅ `rendering-conditional-render` (LOW)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Explicit Conditional Rendering

**Rule:** Dùng ternary `? :` thay vì `&&` khi condition có thể là `0` hoặc `NaN`

❌ **Anti-pattern:**
```jsx
function Badge({ count }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}
// count = 0 → renders "0" trên UI!
```

✅ **Best practice:**
```jsx
function Badge({ count }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}
// count = 0 → renders nothing
```

**Khi nào áp dụng:**
- Condition là number (có thể = 0)
- Condition là calculation result
- Boolean safety needed

**Impact:** Tránh render unexpected values (0, NaN)
```

---

#### Ngày 8: Styling trong React
**Applicable Rules:**
- ✅ `rendering-animate-svg-wrapper` (LOW)
- ✅ `rendering-svg-precision` (LOW)

**Integration:**
```markdown
### 📚 Vercel Best Practice: SVG Performance

**Rule 1:** Animate wrapper div thay vì SVG element trực tiếp

❌ **Anti-pattern:**
```jsx
// No hardware acceleration
<svg className="animate-spin" width="24" height="24">
  <circle cx="12" cy="12" r="10" />
</svg>
```

✅ **Best practice:**
```jsx
// GPU accelerated
<div className="animate-spin">
  <svg width="24" height="24">
    <circle cx="12" cy="12" r="10" />
  </svg>
</div>
```

**Rule 2:** Giảm SVG coordinate precision

```bash
# Automate với SVGO
npx svgo --precision=1 --multipass icon.svg
```

**Impact:** Smoother animations + smaller file size
```

---

### 🟢 PHASE 2: STATE MANAGEMENT BASICS (Ngày 11-15)

#### Ngày 11: useState - Fundamentals
**Applicable Rules:**
- ⚠️ `rerender-lazy-state-init` (MEDIUM) - Chỉ MENTION, chưa dạy chi tiết

**Integration:**
```markdown
### 💡 Preview: Lazy State Initialization

Bạn sẽ học pattern này ở **Ngày 12**.

**Teaser:**
```jsx
// Này sẽ chạy MỖI render (ngay cả sau initial)
const [data, setData] = useState(expensiveComputation())

// Này chỉ chạy 1 lần (sẽ học Ngày 12)
const [data, setData] = useState(() => expensiveComputation())
```

**Tại sao chưa học?** Cần hiểu render cycle trước.
```

---

#### Ngày 12: useState - Patterns & Best Practices
**Applicable Rules:**
- ✅ `rerender-functional-setstate` (MEDIUM)
- ✅ `rerender-lazy-state-init` (MEDIUM)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Functional setState Updates

**Rule:** Dùng function form khi update dựa trên previous state

❌ **Anti-pattern - Stale closure:**
```jsx
const removeItem = useCallback((id) => {
  setItems(items.filter(item => item.id !== id))
}, []) // ❌ Missing dependency → uses stale items!
```

✅ **Best practice - Always fresh:**
```jsx
const removeItem = useCallback((id) => {
  setItems(curr => curr.filter(item => item.id !== id))
}, []) // ✅ No dependencies, always correct
```

**Benefits:**
- Stable callback references
- No stale closures
- Fewer dependencies
- Prevents most common React bugs

**Impact:** Eliminates 80% of closure bugs

---

### 📚 Vercel Best Practice: Lazy State Initialization

**Rule:** Pass function to useState for expensive initial values

❌ **Runs on EVERY render:**
```jsx
function FilteredList({ items }) {
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  // buildSearchIndex() runs even after initialization!
}
```

✅ **Runs ONLY once:**
```jsx
function FilteredList({ items }) {
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  // Function only called on initial render
}
```

**When to use:**
- localStorage/sessionStorage reads
- Building data structures (maps, indexes)
- DOM measurements
- Heavy transformations

**When NOT to use:**
- Simple primitives: `useState(0)`
- Cheap literals: `useState({})`
- Direct prop references: `useState(props.value)`

**Impact:** Prevents wasted computation on every render
```

---

### 🟢 PHASE 3: SIDE EFFECTS & LIFECYCLE (Ngày 16-25)

#### Ngày 16-17: useEffect Basics & Dependencies
**Applicable Rules:**
- ✅ `rerender-defer-reads` (MEDIUM)
- ✅ `rerender-dependencies` (LOW)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Defer State Reads to Usage Point

**Rule:** Đừng subscribe state nếu chỉ đọc trong callbacks

❌ **Anti-pattern - Unnecessary subscription:**
```jsx
function ShareButton({ chatId }) {
  const searchParams = useSearchParams() // Re-render on EVERY param change
  
  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }
  
  return <button onClick={handleShare}>Share</button>
}
```

✅ **Best practice - Read on demand:**
```jsx
function ShareButton({ chatId }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }
  
  return <button onClick={handleShare}>Share</button>
}
```

**Impact:** Fewer re-renders, better performance

---

### 📚 Vercel Best Practice: Narrow Effect Dependencies

**Rule:** Dùng primitive dependencies thay vì objects

❌ **Re-runs on any user field change:**
```jsx
useEffect(() => {
  console.log(user.id)
}, [user]) // Entire object as dependency
```

✅ **Re-runs only when id changes:**
```jsx
useEffect(() => {
  console.log(user.id)
}, [user.id]) // Primitive dependency
```

**For derived state:**
```jsx
// ❌ Runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) enableMobileMode()
}, [width])

// ✅ Runs only on boolean transition
const isMobile = width < 768
useEffect(() => {
  if (isMobile) enableMobileMode()
}, [isMobile])
```

**Impact:** Fewer effect executions
```

---

#### Ngày 18: Cleanup & Memory Leaks
**Applicable Rules:**
- ✅ `client-event-listeners` (LOW)
- ✅ `client-passive-event-listeners` (MEDIUM)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Passive Event Listeners

**Rule:** Add `{ passive: true }` cho touch/wheel listeners

❌ **Blocks scrolling:**
```jsx
useEffect(() => {
  const handleWheel = (e) => console.log(e.deltaY)
  document.addEventListener('wheel', handleWheel)
  return () => document.removeEventListener('wheel', handleWheel)
}, [])
```

✅ **Immediate scrolling:**
```jsx
useEffect(() => {
  const handleWheel = (e) => console.log(e.deltaY)
  document.addEventListener('wheel', handleWheel, { passive: true })
  return () => document.removeEventListener('wheel', handleWheel)
}, [])
```

**When to use passive:**
- Tracking/analytics
- Logging
- Any listener that doesn't call `preventDefault()`

**When NOT to use:**
- Custom swipe gestures
- Custom zoom controls
- Need to call `preventDefault()`

**Impact:** Eliminates scroll delay

---

### 📚 Vercel Best Practice: Deduplicate Global Event Listeners

**Rule:** Use SWR subscription pattern để share listeners

❌ **N instances = N listeners:**
```jsx
function useKeyboardShortcut(key, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (e.metaKey && e.key === key) callback()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

✅ **N instances = 1 listener:**
```jsx
import useSWRSubscription from 'swr/subscription'

const keyCallbacks = new Map()

function useKeyboardShortcut(key, callback) {
  // Register callback
  useEffect(() => {
    if (!keyCallbacks.has(key)) keyCallbacks.set(key, new Set())
    keyCallbacks.get(key).add(callback)
    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) keyCallbacks.delete(key)
      }
    }
  }, [key, callback])
  
  // Single shared listener
  useSWRSubscription('global-keydown', () => {
    const handler = (e) => {
      if (e.metaKey && keyCallbacks.has(e.key)) {
        keyCallbacks.get(e.key).forEach(cb => cb())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}
```

**Impact:** Lower memory usage, single event handler
```

---

#### Ngày 19-20: Data Fetching
**Applicable Rules:**
- ✅ `async-parallel` (CRITICAL)
- ✅ `async-defer-await` (HIGH)
- ✅ `client-swr-dedup` (MEDIUM-HIGH)
- ✅ `client-localstorage-schema` (MEDIUM)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Promise.all() for Independent Operations

**Rule:** Async operations không phụ thuộc nhau → chạy song song

❌ **Anti-pattern - 3 round trips:**
```jsx
useEffect(() => {
  async function fetchData() {
    const user = await fetchUser()      // Wait
    const posts = await fetchPosts()    // Wait
    const comments = await fetchComments() // Wait
    // Total time: T1 + T2 + T3
  }
  fetchData()
}, [])
```

✅ **Best practice - 1 round trip:**
```jsx
useEffect(() => {
  async function fetchData() {
    const [user, posts, comments] = await Promise.all([
      fetchUser(),
      fetchPosts(),
      fetchComments()
    ])
    // Total time: max(T1, T2, T3)
  }
  fetchData()
}, [])
```

**Impact:** 2-10× faster loading (CRITICAL)

---

### 📚 Vercel Best Practice: Defer Await Until Needed

**Rule:** Move `await` into branch that actually uses it

❌ **Blocks both branches:**
```jsx
async function handleRequest(userId, skipProcessing) {
  const userData = await fetchUserData(userId) // Wait even if skipping
  
  if (skipProcessing) {
    return { skipped: true }
  }
  
  return processUserData(userData)
}
```

✅ **Only blocks when needed:**
```jsx
async function handleRequest(userId, skipProcessing) {
  if (skipProcessing) {
    return { skipped: true } // Returns immediately
  }
  
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**Impact:** Faster execution for skipped paths

---

### 📚 Vercel Best Practice: SWR for Automatic Deduplication

**Rule:** Use SWR để tự động dedupe requests

❌ **Each instance fetches:**
```jsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

✅ **Multiple instances share one request:**
```jsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**Benefits:**
- Automatic request deduplication
- Caching
- Revalidation
- Focus revalidation
- Retry on error

**Impact:** Fewer network requests, better UX

---

### 📚 Vercel Best Practice: Version localStorage Data

**Rule:** Add version prefix + minimize stored data

❌ **No version, everything stored:**
```jsx
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

✅ **Versioned + minimal:**
```jsx
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // Incognito mode, quota exceeded, disabled
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(`userConfig:${VERSION}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Migration
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}
```

**Benefits:**
- Schema evolution
- Reduced storage size
- Prevents storing tokens/PII
- Always wrap in try-catch (throws in incognito)

**Impact:** Safer, smaller storage
```

---

#### Ngày 21-22: useRef
**Applicable Rules:**
- ✅ `advanced-event-handler-refs` (LOW)
- ✅ `advanced-use-latest` (LOW)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Store Event Handlers in Refs

**Rule:** Use refs cho callbacks trong effects that shouldn't re-subscribe

❌ **Re-subscribes on every render:**
```jsx
function useWindowEvent(event, handler) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler]) // handler changes → re-subscribe
}
```

✅ **Stable subscription:**
```jsx
function useWindowEvent(event, handler) {
  const handlerRef = useRef(handler)
  
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])
  
  useEffect(() => {
    const listener = (...args) => handlerRef.current(...args)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event]) // Only re-subscribe when event changes
}
```

**React 19 alternative:**
```jsx
import { useEffectEvent } from 'react'

function useWindowEvent(event, handler) {
  const onEvent = useEffectEvent(handler)
  
  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

**Impact:** Fewer subscriptions, better performance

---

### 📚 Vercel Best Practice: useLatest for Stable Callback Refs

**Rule:** Access latest values without adding to dependencies

```jsx
function useLatest<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}
```

**Usage:**
```jsx
function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('')
  const onSearchRef = useLatest(onSearch)
  
  useEffect(() => {
    const timeout = setTimeout(() => onSearchRef.current(query), 300)
    return () => clearTimeout(timeout)
  }, [query]) // onSearch not in deps, but always fresh
}
```

**Impact:** Stable effects, fresh callbacks
```

---

### 🟢 PHASE 4: PERFORMANCE OPTIMIZATION (Ngày 31-35)

#### Ngày 31: React Rendering Behavior
**Applicable Rules:**
- Preview all optimization rules (concepts only)

---

#### Ngày 32-34: React.memo, useMemo, useCallback
**Applicable Rules:**
- ✅ `rerender-memo` (MEDIUM)
- ✅ `rerender-derived-state` (MEDIUM)
- ✅ ALL JavaScript Performance rules (12 rules)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Extract to Memoized Components

**Rule:** Extract expensive work into memoized components for early returns

❌ **Computes avatar even when loading:**
```jsx
function Profile({ user, loading }) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])
  
  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

✅ **Skips computation when loading:**
```jsx
const UserAvatar = memo(function UserAvatar({ user }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

**Impact:** Enables early returns before expensive work

---

### 📚 Vercel Best Practice: Subscribe to Derived State

**Rule:** Subscribe booleans thay vì continuous values

❌ **Re-renders on every pixel:**
```jsx
function Sidebar() {
  const width = useWindowWidth() // 1920, 1919, 1918...
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

✅ **Re-renders only on boolean change:**
```jsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**Impact:** Fewer re-renders

---

### 📚 Vercel Best Practice: JavaScript Performance (12 Rules)

**Rule 1: Build Index Maps for Repeated Lookups**

❌ **O(n) per lookup - 1M ops:**
```jsx
orders.map(order => ({
  ...order,
  user: users.find(u => u.id === order.userId)
}))
```

✅ **O(1) per lookup - 2K ops:**
```jsx
const userById = new Map(users.map(u => [u.id, u]))
orders.map(order => ({
  ...order,
  user: userById.get(order.userId)
}))
```

**Rule 2: Use toSorted() Instead of sort()**

❌ **Mutates array - React bugs:**
```jsx
const sorted = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
) // ❌ Mutates props!
```

✅ **Creates new array:**
```jsx
const sorted = useMemo(
  () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
  [users]
) // ✅ Immutable
```

**Rule 3: Early Length Check for Array Comparisons**

```jsx
function hasChanges(current, original) {
  if (current.length !== original.length) return true // O(1) check
  
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) return true
  }
  return false
}
```

**Rule 4-12:** [Detailed examples for remaining 9 rules]
- Cache property access in loops
- Cache repeated function calls
- Cache storage API calls
- Combine multiple iterations
- Early return from functions
- Hoist RegExp creation
- Use loop for min/max
- Use Set/Map for lookups
- Batch DOM CSS changes

**Impact:** Micro-optimizations compound in hot paths
```

---

### 🟢 PHASE 5: MODERN REACT FEATURES (Ngày 46-52)

#### Ngày 47-48: useTransition, useDeferredValue
**Applicable Rules:**
- ✅ `rerender-transitions` (MEDIUM)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Use Transitions for Non-Urgent Updates

**Rule:** Mark frequent, non-urgent updates as transitions

❌ **Blocks UI on every scroll:**
```jsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

✅ **Non-blocking updates:**
```jsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**When to use:**
- Heavy list filtering
- Search results updates
- Canvas/chart rendering
- Analytics tracking

**Impact:** Maintains UI responsiveness
```

---

#### Ngày 49: Suspense for Data Fetching
**Applicable Rules:**
- Preview Next.js `async-suspense-boundaries` (conceptual only)

---

#### Ngày 50: Error Boundaries
**Applicable Rules:**
- ✅ `rendering-activity` (MEDIUM) - If React 19

**Integration:**
```markdown
### 📚 Vercel Best Practice: Activity Component for Show/Hide

**Rule:** Use `<Activity>` to preserve state/DOM for toggled components

❌ **Unmounts on hide:**
```jsx
function Dropdown({ isOpen }) {
  return isOpen ? <ExpensiveMenu /> : null
}
// Re-mounts every toggle → loses state, re-renders expensive tree
```

✅ **Preserves state/DOM:**
```jsx
import { Activity } from 'react'

function Dropdown({ isOpen }) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

**When to use:**
- Expensive components
- Frequently toggled visibility
- Need to preserve scroll position
- Need to preserve form state

**Impact:** Avoids expensive re-renders
```

---

### 🟢 PHASE 6: TESTING & QUALITY (Ngày 53-60)

#### Ngày 58-60: TypeScript & A11y
**Applicable Rules:**
- ✅ `rendering-hoist-jsx` (LOW)
- ✅ `rendering-content-visibility` (HIGH)

**Integration:**
```markdown
### 📚 Vercel Best Practice: Hoist Static JSX Elements

**Rule:** Extract static JSX outside components

❌ **Recreates element every render:**
```jsx
function Container({ loading }) {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
```

✅ **Reuses same element:**
```jsx
const loadingSkeleton = <LoadingSkeleton />

function Container({ loading }) {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
```

**Note:** React Compiler (React 19) auto-hoists static JSX

---

### 📚 Vercel Best Practice: CSS content-visibility for Long Lists

**Rule:** Use `content-visibility: auto` để defer off-screen rendering

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

```jsx
function MessageList({ messages }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

**Impact:** 10× faster initial render for 1000 messages
```

---

## 🎯 INSTRUCTIONS CHO AI

### Khi tạo nội dung cho mỗi ngày:

#### 1. Check Applicable Rules
```
IF ngày == [mapped day]:
  → Include relevant Vercel rules
  → Follow integration format above
  → Add to "Vercel Best Practices" section
```

#### 2. Integration Format

```markdown
### 📚 Vercel Best Practice: [Rule Name]

**Rule:** [One sentence summary]

**Impact:** [Performance metric - ms, KB, %]

❌ **Anti-pattern:**
[Code example với giải thích tại sao sai]

✅ **Best practice:**
[Code example với giải thích tại sao tốt]

**When to use:**
- [Use case 1]
- [Use case 2]

**When NOT to use:**
- [Anti-use case 1]

**Trade-offs:**
- Pros: [...]
- Cons: [...]
```

#### 3. Placement Rules

- ✅ **PHẢI** đặt sau khi concepts cần thiết đã được học
- ✅ **PHẢI** có section riêng "📚 Vercel Best Practices"
- ✅ **PHẢI** link về Vercel blog posts khi available
- ❌ **KHÔNG** mix Vercel rules vào core explanations
- ❌ **KHÔNG** giới thiệu rule trước khi học concepts

#### 4. Tone & Style

```markdown
✅ "Vercel Engineering khuyến nghị pattern này vì..."
✅ "Production experience cho thấy..."
✅ "Impact metrics: 2-10× improvement"
❌ "Vercel bảo phải làm vậy" (thiếu context)
❌ "Rule này là best" (absolutes without context)
```

---

## 📊 IMPACT METRICS REFERENCE

| Rule | Time Saved | Size Saved | Re-renders Avoided |
|------|-----------|------------|-------------------|
| `async-parallel` | 2-10× | - | - |
| `bundle-barrel-imports` | 200-800ms import | 40% cold start | - |
| `rerender-functional-setstate` | - | - | 80% closure bugs |
| `js-index-maps` | 1M→2K ops | - | - |
| `rendering-content-visibility` | 10× render | - | - |

---

## ✅ CHECKLIST KHI INTEGRATE

Trước khi thêm Vercel rule vào bài học:

- [ ] Học viên đã học ALL concepts cần thiết
- [ ] Có ví dụ ❌ SAI rõ ràng
- [ ] Có ví dụ ✅ ĐÚNG production-ready
- [ ] Giải thích WHY và WHEN
- [ ] Có performance metrics
- [ ] Có trade-offs analysis
- [ ] Link về official docs

---

## 🔗 REFERENCES

- [Vercel Blog: Package Imports Optimization](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [Vercel Blog: Dashboard 2× Faster](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
- [better-all Library](https://github.com/shuding/better-all)
- [node-lru-cache](https://github.com/isaacs/node-lru-cache)
- [React Docs](https://react.dev)
- [SWR Documentation](https://swr.vercel.app)

---

**© 2026 Vercel Engineering Best Practices**
