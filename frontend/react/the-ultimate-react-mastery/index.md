## 🎓 THE ULTIMATE REACT MASTERY - From Fundamentals to Senior-Level Architecture

## 📋 TRIẾT LÝ THIẾT KẾ

### 🎯 Nguyên tắc cốt lõi

1. **Progressive Learning Nghiêm ngặt**: Ngày N+1 CHỈ dùng kiến thức từ Ngày 1→N
2. **Core React First**: Vững React thuần 100% trước khi học Ecosystem
3. **No Knowledge Leaks**: Tuyệt đối KHÔNG dùng concepts chưa học
4. **Production Mindset**: Từ ngày đầu đã suy nghĩ như Senior
5. **Modular Architecture**: Core + Advanced Modules tùy chọn

---

## 🗺️ KIẾN TRÚC KHÓA HỌC

```
CORE PATH: React Fundamentals (60 ngày)
    ↓
INTERMEDIATE: React Ecosystem (15 ngày)
    ↓
ADVANCED MODULES (Chọn theo nhu cầu):
    ├─ Next.js Professional (10 ngày)
    ├─ State Management Mastery (10 ngày)
    ├─ Testing Professional (7 ngày)
    ├─ TypeScript Advanced (5 ngày)
    └─ DevOps cho Frontend (7 ngày)

Core (75 ngày) → Ecosystem (35 ngày) → Advanced Modules (Optional)

Học viên có thể:
- Stop ở Core (Junior-ready)
- Tiếp tục Ecosystem (Mid-ready)
- Chọn modules (Senior-ready)

```

---

## 📅 PHASE 1: NỀN TẢNG REACT (Ngày 1-15)

### 🎯 Mục tiêu: Vững JavaScript + React Cơ bản

```markdown
TUẦN 1: JavaScript Hiện đại (Ngày 1-5)
├── Ngày 1: ES6+ Essentials cho React
│ ✅ let/const, arrow functions, template literals
│ ✅ Destructuring (object & array)
│ ✅ Spread/Rest operators
│ ✅ Array methods (map, filter, reduce)
│ ❌ KHÔNG dùng: Bất kỳ React nào
│
├── Ngày 2: ES6+ Nâng cao
│ ✅ Promises & async/await (giải thích mà CHƯA dùng)
│ ✅ Modules (import/export)
│ ✅ Optional chaining & nullish coalescing
│ ✅ Array/Object methods nâng cao
│ ❌ KHÔNG dùng: Bất kỳ React nào
│
├── Ngày 3: React Basics & JSX
│ ✅ Tạo React app đầu tiên
│ ✅ JSX syntax & rules
│ ✅ JSX vs HTML differences
│ ✅ JavaScript expressions in JSX
│ ✅ CONCEPTS ALLOWED: ES6+ (Ngày 1-2)
│ ❌ KHÔNG dùng: Props, State, Events
│
├── Ngày 4: Components & Props
│ ✅ Function components
│ ✅ Props flow (parent → child)
│ ✅ Props destructuring
│ ✅ Children prop
│ ✅ CONCEPTS ALLOWED: JSX (Ngày 3)
│ ❌ KHÔNG dùng: State, Events, useEffect
│
└── Ngày 5: Events & Conditional Rendering
✅ Event handling
✅ Synthetic events
✅ Event binding patterns
✅ Conditional rendering (if, &&, ternary)
✅ CONCEPTS ALLOWED: Components, Props (Ngày 4)
❌ KHÔNG dùng: State, useEffect
```

```markdown
TUẦN 2: Rendering & Lists (Ngày 6-10)
├── Ngày 6: Lists & Keys
│ ✅ Rendering arrays
│ ✅ Keys importance
│ ✅ Index as key (why not)
│ ✅ Stable keys strategies
│ ✅ CONCEPTS ALLOWED: Events (Ngày 5)
│ ❌ KHÔNG dùng: State, useEffect
│
├── Ngày 7: Component Composition
│ ✅ Component hierarchy
│ ✅ Composition vs inheritance
│ ✅ Children pattern
│ ✅ Slots pattern (props.header, props.footer)
│ ✅ CONCEPTS ALLOWED: Lists (Ngày 6)
│ ❌ KHÔNG dùng: State, useEffect
│
├── Ngày 8: Styling trong React
│ ✅ Inline styles
│ ✅ CSS classes
│ ✅ CSS Modules (giới thiệu)
│ ✅ Tailwind basics (chỉ utility classes)
│ ✅ CONCEPTS ALLOWED: Composition (Ngày 7)
│ ❌ KHÔNG dùng: State, useEffect, styled-components
│
├── Ngày 9: Forms Controlled (KHÔNG STATE)
│ ✅ Form elements
│ ✅ Controlled inputs concept (giải thích lý thuyết)
│ ✅ Event.target.value
│ ⚠️ CHÚ Ý: Chỉ giải thích, CHƯA implement (cần state)
│ ✅ CONCEPTS ALLOWED: Events (Ngày 5)
│ ❌ KHÔNG dùng: State (chưa học!)
│
└── Ngày 10: ⚡ Mini Project 1 - Static Product Catalog
🎯 Mục tiêu: Tổng hợp Ngày 1-9
📋 Yêu cầu: - Component hierarchy - Props drilling - Lists rendering - Conditional UI - Event handlers (chỉ console.log) - Styling
✅ CONCEPTS ALLOWED: Tất cả Ngày 1-9
❌ KHÔNG dùng: State, useEffect
```

```markdown
TUẦN 3: State Management Basics (Ngày 11-15)
├── Ngày 11: useState - Fundamentals
│ ✅ State concept & necessity
│ ✅ useState basic syntax
│ ✅ State vs Props
│ ✅ Multiple state variables
│ ✅ State updates trigger re-render
│ ✅ CONCEPTS ALLOWED: Tất cả Ngày 1-10
│ ❌ KHÔNG dùng: useEffect, useReducer
│  
│ 🔥 QUAN TRỌNG:
│ - Chỉ dùng direct updates: setCount(5)
│ - CHƯA dùng functional updates: setCount(prev => prev + 1)
│ - CHƯA dùng lazy initialization
│
├── Ngày 12: useState - Patterns & Best Practices
│ ✅ Functional updates (bây giờ mới dạy!)
│ ✅ Lazy initialization
│ ✅ State structure decisions
│ ✅ Derived state
│ ✅ Immutability deep dive
│ ✅ CONCEPTS ALLOWED: useState basic (Ngày 11)
│ ❌ KHÔNG dùng: useEffect, useReducer
│  
│ 🔥 QUAN TRỌNG:
│ - Bài tập Counter increment 3 times
│ - Giải thích stale closure (KHÔNG dùng useEffect)
│ - Ví dụ: setTimeout(() => setCount(count + 1), 1000)
│
├── Ngày 13: Forms với State
│ ✅ Controlled components (bây giờ mới thực hành!)
│ ✅ Uncontrolled components (refs - giới thiệu sơ)
│ ✅ Form validation cơ bản
│ ✅ Multiple inputs handling
│ ✅ CONCEPTS ALLOWED: useState patterns (Ngày 12)
│ ❌ KHÔNG dùng: useEffect, useRef deep dive
│
├── Ngày 14: Lifting State Up
│ ✅ State lifting concept
│ ✅ Sibling communication
│ ✅ Props drilling
│ ✅ Callback props
│ ✅ CONCEPTS ALLOWED: Forms (Ngày 13)
│ ❌ KHÔNG dùng: useEffect, Context
│
└── Ngày 15: ⚡ Project 2 - Interactive Todo App
🎯 Mục tiêu: Master useState
📋 Features: - Add/Edit/Delete todos - Filter (All/Active/Completed) - Local state management - Form handling
✅ CONCEPTS ALLOWED: useState (Ngày 11-14)
❌ KHÔNG dùng: useEffect (localStorage), Context
```

---

## 📅 PHASE 2: SIDE EFFECTS & LIFECYCLE (Ngày 16-25)

### 🎯 Mục tiêu: Làm chủ useEffect & Async Operations

```markdown
TUẦN 4: useEffect Fundamentals (Ngày 16-20)
├── Ngày 16: useEffect - Introduction
│ ✅ Side effects concept
│ ✅ useEffect basic syntax
│ ✅ Effect timing (after render)
│ ✅ Dependencies array intro
│ ✅ CONCEPTS ALLOWED: useState (Ngày 11-14)
│ ❌ KHÔNG dùng: useReducer, useRef, useMemo
│  
│ 🔥 QUY TẮC:
│ - Chỉ dạy empty deps [] và no deps
│ - CHƯA dạy deps với variables
│
├── Ngày 17: useEffect - Dependencies Deep Dive
│ ✅ Dependency array rules
│ ✅ Primitive vs object deps
│ ✅ Missing dependencies
│ ✅ Infinite loops debugging
│ ✅ CONCEPTS ALLOWED: useEffect basic (Ngày 16)
│ ❌ KHÔNG dùng: useCallback, useMemo
│  
│ 🔥 BÀI TẬP:
│ - Sửa lỗi infinite loop
│ - Stale closure trong useEffect
│ - ESLint exhaustive-deps
│
├── Ngày 18: Cleanup & Memory Leaks
│ ✅ Cleanup function
│ ✅ When cleanup runs
│ ✅ Timers cleanup
│ ✅ Event listeners cleanup
│ ✅ CONCEPTS ALLOWED: useEffect deps (Ngày 17)
│ ❌ KHÔNG dùng: Subscriptions (WebSocket - chưa học)
│
├── Ngày 19: Data Fetching - Basics
│ ✅ fetch API review
│ ✅ async/await trong useEffect
│ ✅ Loading states
│ ✅ Error handling
│ ✅ CONCEPTS ALLOWED: useEffect + cleanup (Ngày 18)
│ ❌ KHÔNG dùng: Axios, React Query, SWR
│  
│ 🔥 PATTERN:
│ `jsx
│   const [data, setData] = useState(null);
│   const [loading, setLoading] = useState(true);
│   const [error, setError] = useState(null);
│   
│   useEffect(() => {
│     fetch(url)
│       .then(res => res.json())
│       .then(setData)
│       .catch(setError)
│       .finally(() => setLoading(false));
│   }, [url]);
│   `
│
└── Ngày 20: Data Fetching - Advanced Patterns
✅ Race conditions
✅ Request cancellation (AbortController)
✅ Dependent requests
✅ Parallel requests
✅ CONCEPTS ALLOWED: Data fetching basic (Ngày 19)
❌ KHÔNG dùng: React Query (chưa học)

    🔥 PATTERNS:
    - Ignore outdated responses
    - Abort in-flight requests
    - Handle multiple requests
```

```markdown
TUẦN 5: useRef & Advanced Effects (Ngày 21-25)
├── Ngày 21: useRef - Fundamentals
│ ✅ useRef concept
│ ✅ Mutable values
│ ✅ Persisting across renders
│ ✅ useRef vs useState
│ ✅ CONCEPTS ALLOWED: useEffect (Ngày 16-20)
│ ❌ KHÔNG dùng: forwardRef (chưa học)
│  
│ 🔥 USE CASES:
│ - Previous value tracking
│ - Interval/timeout IDs
│ - Flag variables
│ - CHƯA dạy DOM refs
│
├── Ngày 22: useRef - DOM Manipulation
│ ✅ Accessing DOM nodes
│ ✅ Focus management
│ ✅ Scroll control
│ ✅ Third-party library integration
│ ✅ CONCEPTS ALLOWED: useRef basics (Ngày 21)
│ ❌ KHÔNG dùng: forwardRef, useImperativeHandle
│
├── Ngày 23: useLayoutEffect
│ ✅ useLayoutEffect vs useEffect
│ ✅ Synchronous timing
│ ✅ DOM measurements
│ ✅ Preventing visual flicker
│ ✅ CONCEPTS ALLOWED: useRef DOM (Ngày 22)
│ ❌ KHÔNG dùng: Resize Observer (chưa học)
│  
│ 🔥 PATTERN:
│ `jsx
│   useLayoutEffect(() => {
│     const box = ref.current;
│     const height = box.offsetHeight;
│     // Adjust layout before paint
│   }, []);
│   `
│
├── Ngày 24: Custom Hooks - Basics
│ ✅ Custom hook concept
│ ✅ Naming convention (use\*)
│ ✅ Extracting logic
│ ✅ Reusability
│ ✅ CONCEPTS ALLOWED: Tất cả hooks đã học
│ ❌ KHÔNG dùng: useContext, useReducer
│  
│ 🔥 EXAMPLES:
│ - useToggle
│ - useLocalStorage (đơn giản)
│ - useFetch (wrap fetch logic)
│
└── Ngày 25: ⚡ Project 3 - Real-time Dashboard
🎯 Mục tiêu: Master Effects & Data Fetching
📋 Features: - Fetch data from API - Auto-refresh every 30s - Search filtering - Loading/Error states - Previous data comparison
✅ CONCEPTS ALLOWED: useState + useEffect + useRef + Custom hooks
❌ KHÔNG dùng: useReducer, Context, React Query
```

---

## 📅 PHASE 3: COMPLEX STATE & PERFORMANCE (Ngày 26-35)

### 🎯 Mục tiêu: useReducer + Performance Optimization

```markdown
TUẦN 6: useReducer (Ngày 26-30)
├── Ngày 26: useReducer - Fundamentals
│ ✅ Reducer pattern concept
│ ✅ useReducer syntax
│ ✅ Actions & action creators
│ ✅ Reducer pure function
│ ✅ CONCEPTS ALLOWED: useState (để so sánh)
│ ❌ KHÔNG dùng: Redux, Immer
│  
│ 🔥 SO SÁNH:
│ useState vs useReducer
│ - Khi nào dùng cái nào?
│ - Trade-offs rõ ràng
│
├── Ngày 27: useReducer - Advanced Patterns
│ ✅ Complex state logic
│ ✅ Multiple actions
│ ✅ Payload structures
│ ✅ State normalization
│ ✅ CONCEPTS ALLOWED: useReducer basic (Ngày 26)
│ ❌ KHÔNG dùng: Redux Toolkit patterns
│  
│ 🔥 PATTERNS:
│ - Enum actions (vs string)
│ - Action creators
│ - Reducer composition (giới thiệu)
│
├── Ngày 28: useReducer + useEffect
│ ✅ Async actions pattern
│ ✅ Dispatching in effects
│ ✅ Loading/error states
│ ✅ Optimistic updates
│ ✅ CONCEPTS ALLOWED: useReducer + useEffect
│ ❌ KHÔNG dùng: Redux middleware
│  
│ 🔥 PATTERN:
│ `jsx
│   const [state, dispatch] = useReducer(reducer, initialState);
│   
│   useEffect(() => {
│     dispatch({ type: 'FETCH_START' });
│     fetch(url)
│       .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
│       .catch(error => dispatch({ type: 'FETCH_ERROR', payload: error }));
│   }, [url]);
│   `
│
├── Ngày 29: Custom Hooks với useReducer
│ ✅ Encapsulating reducer logic
│ ✅ useReducer in custom hooks
│ ✅ Reusable state machines
│ ✅ CONCEPTS ALLOWED: useReducer (Ngày 26-28) + Custom hooks
│ ❌ KHÔNG dùng: XState, Redux
│  
│ 🔥 EXAMPLES:
│ - useAsync
│ - useForm với reducer
│ - useUndo/useRedo
│
└── Ngày 30: ⚡ Project 4 - Shopping Cart
🎯 Mục tiêu: useReducer mastery
📋 Features: - Add/remove items - Quantity updates - Price calculations - Undo/redo actions
✅ CONCEPTS ALLOWED: useReducer + Custom hooks
❌ KHÔNG dùng: Context (chưa học)
```

```markdown
TUẦN 7: Performance Optimization (Ngày 31-35)
├── Ngày 31: React Rendering Behavior
│ ✅ Render phase vs Commit phase
│ ✅ When does React re-render?
│ ✅ Props change detection
│ ✅ State change detection
│ ✅ Parent renders → Child renders
│ ✅ CONCEPTS ALLOWED: Tất cả đã học
│ ❌ KHÔNG dùng: useMemo, useCallback, React.memo
│  
│ 🔥 DEBUGGING:
│ - React DevTools Profiler
│ - Highlight updates
│ - Render count tracking
│
├── Ngày 32: React.memo
│ ✅ Memoization concept
│ ✅ React.memo syntax
│ ✅ Custom comparison function
│ ✅ When to use / When NOT to use
│ ✅ CONCEPTS ALLOWED: Rendering behavior (Ngày 31)
│ ❌ KHÔNG dùng: useMemo, useCallback
│  
│ 🔥 ANTI-PATTERNS:
│ - Premature optimization
│ - Memoizing everything
│ - Props always change
│
├── Ngày 33: useMemo
│ ✅ Expensive calculations
│ ✅ useMemo syntax
│ ✅ Dependencies
│ ✅ Memoization cost/benefit
│ ✅ CONCEPTS ALLOWED: React.memo (Ngày 32)
│ ❌ KHÔNG dùng: useCallback
│  
│ 🔥 WHEN TO USE:
│ - Expensive computation
│ - Referential equality needed
│ - Large list filtering/sorting
│  
│ 🔥 WHEN NOT TO USE:
│ - Simple calculations
│ - Premature optimization
│ - Dependencies change often
│
├── Ngày 34: useCallback
│ ✅ Function memoization
│ ✅ useCallback syntax
│ ✅ useCallback + React.memo
│ ✅ Inline functions problem
│ ✅ CONCEPTS ALLOWED: useMemo (Ngày 33)
│ ❌ KHÔNG dùng: Context
│  
│ 🔥 PATTERN:
│ `jsx
│   const Parent = () => {
│     const [count, setCount] = useState(0);
│     
│     // ❌ Creates new function every render
│     const handleClick = () => setCount(count + 1);
│     
│     // ✅ Memoized function
│     const handleClick = useCallback(() => {
│       setCount(prev => prev + 1);
│     }, []);
│     
│     return <Child onClick={handleClick} />;
│   };
│   `
│
└── Ngày 35: ⚡ Project 5 - Optimized Data Table
🎯 Mục tiêu: Performance optimization
📋 Features: - 10,000+ rows rendering - Sorting/filtering - Row selection - Optimized re-renders
📊 Requirements: - Profile before/after optimization - <16ms render time - Appropriate use of memo/useMemo/useCallback
✅ CONCEPTS ALLOWED: Tất cả optimization hooks
❌ KHÔNG dùng: React Window (chưa học)
```

---

## 📅 PHASE 4: ADVANCED PATTERNS (Ngày 36-45)

### 🎯 Mục tiêu: Context, Patterns, Forms

```markdown
TUẦN 8: Context API (Ngày 36-40)
├── Ngày 36: Context - Fundamentals
│ ✅ Props drilling problem
│ ✅ createContext
│ ✅ Provider & Consumer
│ ✅ useContext hook
│ ✅ CONCEPTS ALLOWED: Tất cả hooks đã học
│ ❌ KHÔNG dùng: Redux, Zustand
│  
│ 🔥 PATTERN:
│ `jsx
│   const ThemeContext = createContext();
│   
│   const App = () => (
│     <ThemeContext.Provider value={theme}>
│       <Component />
│     </ThemeContext.Provider>
│   );
│   
│   const Component = () => {
│     const theme = useContext(ThemeContext);
│   };
│   `
│
├── Ngày 37: Context - Advanced Patterns
│ ✅ Multiple contexts
│ ✅ Context composition
│ ✅ Custom provider pattern
│ ✅ Context + useReducer
│ ✅ CONCEPTS ALLOWED: Context basic + useReducer
│ ❌ KHÔNG dùng: Context splitting patterns (chưa optimize)
│  
│ 🔥 PATTERN:
│ `jsx
│   const AuthProvider = ({ children }) => {
│     const [state, dispatch] = useReducer(authReducer, initialState);
│     
│     const value = useMemo(() => ({ 
│       state, 
│       dispatch 
│     }), [state]);
│     
│     return (
│       <AuthContext.Provider value={value}>
│         {children}
│       </AuthContext.Provider>
│     );
│   };
│   `
│
├── Ngày 38: Context Performance
│ ✅ Re-render issues
│ ✅ Context splitting
│ ✅ Memoization strategies
│ ✅ Selector pattern (simple)
│ ✅ CONCEPTS ALLOWED: Context + Optimization hooks
│ ❌ KHÔNG dùng: use-context-selector library
│  
│ 🔥 PROBLEM:
│ - Context change → All consumers re-render
│ - Solution: Split contexts
│ - StateContext + DispatchContext pattern
│
├── Ngày 39: Component Patterns - Part 1
│ ✅ Compound Components
│ ✅ Flexible component API
│ ✅ Implict state sharing
│ ✅ CONCEPTS ALLOWED: Context
│ ❌ KHÔNG dùng: Render Props, HOCs
│  
│ 🔥 EXAMPLE:
│ `jsx
│   <Select value={value} onChange={onChange}>
│     <Select.Trigger />
│     <Select.Options>
│       <Select.Option value="1">One</Select.Option>
│       <Select.Option value="2">Two</Select.Option>
│     </Select.Options>
│   </Select>
│   `
│
└── Ngày 40: Component Patterns - Part 2
✅ Render Props (legacy, để hiểu)
✅ HOCs (legacy, để hiểu)
✅ So sánh với Hooks
✅ Migration strategies
✅ CONCEPTS ALLOWED: Tất cả patterns
❌ KHÔNG dùng: Class components (chỉ giải thích lịch sử)

    🔥 FOCUS:
    - Hiểu legacy code
    - Biết refactor sang hooks
    - Không khuyến khích dùng trong code mới
```

```markdown
TUẦN 9: Forms & Validation (Ngày 41-45)
├── Ngày 41: React Hook Form - Basics
│ ✅ Why React Hook Form?
│ ✅ useForm hook
│ ✅ register
│ ✅ handleSubmit
│ ✅ Basic validation
│ ✅ CONCEPTS ALLOWED: Forms với useState (Ngày 13)
│ ❌ KHÔNG dùng: Zod, Yup (chưa học)
│  
│ 🔥 COMPARISON:
│ - Manual state vs React Hook Form
│ - Performance benefits
│ - When to use each
│
├── Ngày 42: React Hook Form - Advanced
│ ✅ Complex validation rules
│ ✅ Custom validation
│ ✅ Field arrays
│ ✅ Watch & getValues
│ ✅ CONCEPTS ALLOWED: RHF basics (Ngày 41)
│ ❌ KHÔNG dùng: Zod
│  
│ 🔥 PATTERNS:
│ - Dynamic fields
│ - Dependent fields
│ - Conditional validation
│
├── Ngày 43: Form Validation Schemas
│ ✅ Zod introduction
│ ✅ Schema definition
│ ✅ Integration với RHF
│ ✅ Custom error messages
│ ✅ CONCEPTS ALLOWED: RHF (Ngày 41-42)
│ ❌ KHÔNG dùng: Yup (chỉ mention alternative)
│  
│ 🔥 PATTERN:
│ `jsx
│   const schema = z.object({
│     email: z.string().email(),
│     age: z.number().min(18)
│   });
│   
│   const { register, handleSubmit } = useForm({
│     resolver: zodResolver(schema)
│   });
│   `
│
├── Ngày 44: Multi-step Forms
│ ✅ Wizard pattern
│ ✅ State persistence
│ ✅ Navigation between steps
│ ✅ Validation per step
│ ✅ CONCEPTS ALLOWED: RHF + Zod + Context
│ ❌ KHÔNG dùng: Router (chưa học)
│  
│ 🔥 ARCHITECTURE:
│ - Step state management
│ - Data persistence
│ - Progress indication
│
└── Ngày 45: ⚡ Project 6 - Registration Flow
🎯 Mục tiêu: Forms mastery
📋 Features: - Multi-step wizard - Complex validation - File upload - Review & submit - Error handling
✅ CONCEPTS ALLOWED: RHF + Zod + Context + Patterns
❌ KHÔNG dùng: Backend integration (chưa học)
```

---

## 📅 PHASE 5: MODERN REACT FEATURES (Ngày 46-52)

### 🎯 Mục tiêu: React 18/19 Features

````markdown
TUẦN 10: Concurrent Features (Ngày 46-50)
├── Ngày 46: Concurrent Rendering Intro
│ ✅ Concurrent mode concept
│ ✅ Automatic batching
│ ✅ Benefit visualization
│ ✅ CONCEPTS ALLOWED: Tất cả đã học
│ ❌ KHÔNG dùng: useTransition, useDeferredValue (chưa học chi tiết)
│  
│ 🔥 COMPARISON:
│ - React 17 vs React 18
│ - Sync vs Concurrent rendering
│
├── Ngày 47: useTransition
│ ✅ Non-urgent updates
│ ✅ isPending state
│ ✅ UI feedback patterns
│ ✅ Use cases
│ ✅ CONCEPTS ALLOWED: Concurrent concepts (Ngày 46)
│ ❌ KHÔNG dùng: useDeferredValue
│  
│ 🔥 PATTERN:
│ `jsx
│   const [isPending, startTransition] = useTransition();
│   
│   const handleChange = (value) => {
│     // Urgent: Input update
│     setInput(value);
│     
│     // Non-urgent: Heavy computation
│     startTransition(() => {
│       setFilteredList(filter(list, value));
│     });
│   };
│   `
│
├── Ngày 48: useDeferredValue
│ ✅ Deferred value concept
│ ✅ vs useTransition
│ ✅ Debouncing comparison
│ ✅ CONCEPTS ALLOWED: useTransition (Ngày 47)
│ ❌ KHÔNG dùng: Suspense
│  
│ 🔥 COMPARISON:
│ - useDeferredValue vs useTransition
│ - useDeferredValue vs debounce
│ - When to use each
│
├── Ngày 49: Suspense for Data Fetching
│ ✅ Suspense concept
│ ✅ Fallback UI
│ ✅ Error Boundaries
│ ✅ Suspense boundaries
│ ✅ CONCEPTS ALLOWED: Concurrent features
│ ❌ KHÔNG dùng: React Query, SWR (chưa học)
│  
│ 🔥 PATTERN:
│ `jsx
│   <Suspense fallback={<Spinner />}>
│     <DataComponent />
│   </Suspense>
│   `
│  
│ ⚠️ CHÚ Ý: Chỉ concept, chưa integrate thư viện
│
└── Ngày 50: Error Boundaries
✅ Error Boundary concept
✅ componentDidCatch (class component - explain only)
✅ react-error-boundary library
✅ Recovery strategies
✅ CONCEPTS ALLOWED: Suspense (Ngày 49)
❌ KHÔNG dùng: Class components (chỉ hiểu concept)

    🔥 PATTERN:
    ```jsx
    <ErrorBoundary fallback={<ErrorUI />}>
      <App />
    </ErrorBoundary>
    ```
````

```markdown
TUẦN 11: Advanced Topics (Ngày 51-52)
├── Ngày 51: React Server Components (RSC) - Overview
│ ✅ RSC concept (high-level)
│ ✅ Server vs Client components
│ ✅ Benefits & trade-offs
│ ✅ CONCEPTS ALLOWED: Tất cả đã học
│ ❌ KHÔNG dùng: Next.js (sẽ học ở module riêng)
│  
│ ⚠️ CHÚ Ý:
│ - Chỉ conceptual understanding
│ - Không implement (cần Next.js)
│ - Preview cho module Next.js
│
└── Ngày 52: ⚡ Project 7 - Modern React App
🎯 Mục tiêu: Tổng hợp React 18 features
📋 Features: - Suspense boundaries - Error boundaries - useTransition for heavy updates - Concurrent rendering optimization
📊 Requirements: - Smooth UX during loading - Graceful error handling - Performance monitoring
✅ CONCEPTS ALLOWED: Tất cả React 18 features
❌ KHÔNG dùng: Next.js, external state libraries
```

---

## 📅 PHASE 6: TESTING & QUALITY (Ngày 53-60)

### 🎯 Mục tiêu: Testing, TypeScript, A11y

```markdown
TUẦN 12: Testing (Ngày 53-57)
├── Ngày 53: Testing Philosophy
│ ✅ Testing pyramid
│ ✅ What to test
│ ✅ Test structure (AAA pattern)
│ ✅ Mocking strategies
│ ✅ CONCEPTS ALLOWED: Tất cả React
│ ❌ KHÔNG dùng: Testing libraries (chưa học)
│  
│ 🔥 PRINCIPLES:
│ - Test behavior, not implementation
│ - User-centric testing
│ - Confidence vs cost
│
├── Ngày 54: React Testing Library - Basics
│ ✅ RTL philosophy
│ ✅ render, screen
│ ✅ Queries (getBy, findBy, queryBy)
│ ✅ User events
│ ✅ CONCEPTS ALLOWED: Testing philosophy
│ ❌ KHÔNG dùng: MSW (chưa học)
│  
│ 🔥 PATTERN:
│ `jsx
│   test('counter increments', () => {
│     render(<Counter />);
│     const button = screen.getByRole('button');
│     fireEvent.click(button);
│     expect(screen.getByText('1')).toBeInTheDocument();
│   });
│   `
│
├── Ngày 55: Testing Hooks & Context
│ ✅ Testing custom hooks
│ ✅ Testing context consumers
│ ✅ Testing async updates
│ ✅ CONCEPTS ALLOWED: RTL basics
│ ❌ KHÔNG dùng: MSW
│  
│ 🔥 PATTERN:
│ `jsx
│   const wrapper = ({ children }) => (
│     <ThemeProvider>{children}</ThemeProvider>
│   );
│   
│   const { result } = renderHook(() => useTheme(), { wrapper });
│   `
│
├── Ngày 56: Mocking API Calls
│ ✅ MSW (Mock Service Worker)
│ ✅ Setup & handlers
│ ✅ Testing loading/error states
│ ✅ CONCEPTS ALLOWED: RTL + Hooks testing
│ ❌ KHÔNG dùng: Backend (chưa có)
│  
│ 🔥 PATTERN:
│ `jsx
│   const server = setupServer(
│     rest.get('/api/user', (req, res, ctx) => {
│       return res(ctx.json({ name: 'John' }));
│     })
│   );
│   `
│
└── Ngày 57: Integration & E2E Testing Preview
✅ Integration test concept
✅ E2E testing overview (Playwright preview)
✅ Testing strategy matrix
✅ CONCEPTS ALLOWED: RTL + MSW
❌ KHÔNG dùng: Playwright deep dive (module riêng)

    🔥 STRATEGY:
    - 70% unit tests
    - 20% integration tests
    - 10% E2E tests
```

```markdown
TUẦN 13: TypeScript & Quality (Ngày 58-60)
├── Ngày 58: TypeScript Fundamentals cho React
│ ✅ TS setup với React
│ ✅ Component props typing
│ ✅ Event typing
│ ✅ Children typing
│ ✅ CONCEPTS ALLOWED: Tất cả React
│ ❌ KHÔNG dùng: Generic components
│  
│ 🔥 BASICS:
│ `tsx
│   interface Props {
│     name: string;
│     age?: number;
│     onClick: () => void;
│   }
│   
│   const Component: React.FC<Props> = ({ name, age, onClick }) => {
│     // ...
│   };
│   `
│
├── Ngày 59: TypeScript Advanced
│ ✅ Generic components
│ ✅ Hooks typing
│ ✅ Context typing
│ ✅ Utility types
│ ✅ CONCEPTS ALLOWED: TS basics (Ngày 58)
│ ❌ KHÔNG dùng: Advanced utility types (module riêng)
│  
│ 🔥 PATTERNS:
│ `tsx
│   function Select<T>({ options, value, onChange }: SelectProps<T>) {
│     // Fully type-safe
│   }
│   `
│
└── Ngày 60: Accessibility (A11y)
✅ A11y principles (WCAG)
✅ Semantic HTML
✅ ARIA attributes
✅ Keyboard navigation
✅ Screen reader testing
✅ CONCEPTS ALLOWED: Tất cả React
❌ KHÔNG dùng: External a11y libraries

    🔥 CHECKLIST:
    - [ ] Keyboard navigation
    - [ ] Focus management
    - [ ] ARIA labels
    - [ ] Color contrast
    - [ ] Screen reader tested
```

---

## 📅 PHASE 7: CAPSTONE PROJECT (Ngày 61-75)

### 🎯 Mục tiêu: Production-grade Application

```markdown
TUẦN 14-15: Final Capstone (Ngày 61-75)

📋 PROJECT: Social Media Dashboard

## Tuần 14: Setup & Core Features (Ngày 61-67)

├── Ngày 61: Project Planning
│ - Architecture design
│ - Component hierarchy
│ - State management strategy
│ - Testing strategy
│ - A11y plan
│
├── Ngày 62-63: Authentication Flow
│ - Login/Register forms
│ - Protected routes (concept - no router yet)
│ - Token management
│ - Error handling
│
├── Ngày 64-65: Feed Features
│ - Post CRUD
│ - Infinite scroll (manual)
│ - Optimistic updates
│ - Real-time updates (simulation)
│
└── Ngày 66-67: User Interactions - Comments - Likes - User profile - Search functionality

## Tuần 15: Polish & Deployment (Ngày 68-75)

├── Ngày 68-70: Testing
│ - Unit tests (>80% coverage)
│ - Integration tests
│ - A11y testing
│ - Performance testing
│
├── Ngày 71-72: Optimization
│ - Bundle size optimization
│ - Code splitting
│ - Image optimization
│ - Performance profiling
│
├── Ngày 73-74: Documentation
│ - Component documentation
│ - README
│ - Setup guide
│ - Architecture decisions
│
└── Ngày 75: Final Review - Code review checklist - Accessibility audit - Performance audit - Deployment prep (concept)

✅ DELIVERABLES:

-   [ ] Working application
-   [ ] Comprehensive tests
-   [ ] Full documentation
-   [ ] A11y compliant
-   [ ] Performance optimized
-   [ ] Production-ready code

✅ CONCEPTS USED:

-   Tất cả đã học trong 60 ngày
-   Best practices applied
-   Senior-level code quality
```

---

## 🎓 CORE REACT MASTERY: KẾT LUẬN

### 📊 Đánh giá sau 75 ngày Core

```
React Fundamentals:          ████████████████████ 100% ✅
React Hooks (All 15):        ████████████████░░░░  80% ✅
State Management (Core):     ████████████████████ 100% ✅
Performance Optimization:    ████████████████████ 100% ✅
Modern React (18/19):        ███████████████░░░░░  75% ✅
Testing Basics:              ████████████░░░░░░░░  60% ⚠️
TypeScript Basics:           ████████████░░░░░░░░  60% ⚠️
Accessibility:               ████████████████░░░░  80% ✅

Overall Core React:          ████████████████░░░░  85% ✅
```

### 🎯 Career Level sau Core (75 ngày)

```
Junior Developer:     ████████████████████ 100% ✅
Mid Developer:        ████████████████████  95% ✅
Senior Developer:     ██████████░░░░░░░░░░  50% ⚠️
```

**Kết luận**: Vững React thuần, thiếu Ecosystem & Production tools

---

## 🚀 PHASE 8: REACT ECOSYSTEM (Ngày 76-90)

### 🎯 Mục tiêu: Essential Tools & Libraries

````markdown
## Module A: Routing & Navigation (5 ngày)

### Ngày 76: React Router - Fundamentals

✅ BrowserRouter vs HashRouter
✅ Route, Routes
✅ Link, NavLink
✅ useNavigate, useParams
✅ CONCEPTS ALLOWED: Tất cả Core React
❌ KHÔNG dùng: Data Router API (chưa học)

🔥 BASIC ROUTING:

```jsx
<BrowserRouter>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/users/:id' element={<User />} />
    </Routes>
</BrowserRouter>
```

### Ngày 77: React Router - Nested Routes

✅ Nested routing
✅ Outlet
✅ Index routes
✅ Layout routes
✅ CONCEPTS ALLOWED: Router basics (Ngày 76)
❌ KHÔNG dùng: Loaders, Actions

### Ngày 78: React Router - Advanced

✅ Protected routes pattern
✅ 404 pages
✅ Redirect logic
✅ Search params
✅ CONCEPTS ALLOWED: Nested routes (Ngày 77)
❌ KHÔNG dùng: TanStack Router

🔥 PROTECTED ROUTE:

```jsx
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to='/login' />;
};
```

### Ngày 79: Code Splitting với Routes

✅ React.lazy
✅ Suspense boundaries
✅ Route-based splitting
✅ Prefetching strategies
✅ CONCEPTS ALLOWED: Router + Suspense
❌ KHÔNG dùng: Webpack manual config

### Ngày 80: ⚡ Project 8 - Multi-page App

🎯 Goal: Master routing
📋 Features:

-   Multiple pages
-   Nested layouts
-   Protected routes
-   404 handling
-   Code splitting
````

````markdown
## Module B: Data Fetching & State (10 ngày)

### Ngày 81: TanStack Query - Fundamentals

✅ Server state vs Client state
✅ useQuery basics
✅ Query keys
✅ Automatic refetching
✅ CONCEPTS ALLOWED: Core React + Routing
❌ KHÔNG dùng: useMutation

🔥 BASIC QUERY:

```jsx
const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
});
```

### Ngày 82: TanStack Query - Mutations

✅ useMutation
✅ Optimistic updates
✅ Cache invalidation
✅ Error handling
✅ CONCEPTS ALLOWED: useQuery (Ngày 81)
❌ KHÔNG dùng: Infinite queries

### Ngày 83: TanStack Query - Advanced

✅ Pagination
✅ Infinite queries
✅ Dependent queries
✅ Parallel queries
✅ CONCEPTS ALLOWED: Mutations (Ngày 82)
❌ KHÔNG dùng: SSR integration

### Ngày 84: Axios Deep Dive

✅ Axios vs fetch
✅ Interceptors
✅ Request/response transformation
✅ Error handling
✅ CONCEPTS ALLOWED: TanStack Query
❌ KHÔNG dùng: Ky, Got

🔥 INTERCEPTOR PATTERN:

```jsx
axios.interceptors.request.use((config) => {
    const token = getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```

### Ngày 85: Redux Toolkit - Fundamentals

✅ Why Redux? (State management philosophy)
✅ Store, Slices
✅ createSlice
✅ useSelector, useDispatch
✅ CONCEPTS ALLOWED: useReducer (để so sánh)
❌ KHÔNG dùng: Redux middleware

🔥 SLICE PATTERN:

```jsx
const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
    },
});
```

### Ngày 86: Redux Toolkit - Async Logic

✅ createAsyncThunk
✅ Loading states
✅ Error handling
✅ RTK Query intro
✅ CONCEPTS ALLOWED: RTK basics (Ngày 85)
❌ KHÔNG dùng: Redux Saga

### Ngày 87: Zustand

✅ Lightweight state management
✅ Store creation
✅ Selectors
✅ Middleware
✅ CONCEPTS ALLOWED: Redux (để so sánh)
❌ KHÔNG dùng: Jotai, Recoil

🔥 ZUSTAND STORE:

```jsx
const useStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Ngày 88: State Management Comparison

✅ Context vs Redux vs Zustand vs TanStack Query
✅ Decision matrix
✅ Trade-offs
✅ When to use what
✅ CONCEPTS ALLOWED: Tất cả state solutions
❌ KHÔNG dùng: MobX, XState

📊 DECISION TREE:

```
Need global state?
├─ Simple app-wide state → Context + useReducer
├─ Complex state with time-travel → Redux Toolkit
├─ Lightweight & flexible → Zustand
└─ Server state only → TanStack Query
```

### Ngày 89-90: ⚡ Project 9 - Full State Management

🎯 Goal: Integrate multiple state solutions
📋 Features:

-   Redux for app state
-   TanStack Query for server data
-   Zustand for UI state
-   Router integration
    📊 Architecture:
-   Clear state boundaries
-   Optimal tool for each job
````

---

## 🎨 PHASE 9: UI & STYLING (Ngày 91-100)

### 🎯 Mục tiêu: Styling Solutions & Component Libraries

```markdown
## Module C: Styling (5 ngày)

### Ngày 91: CSS-in-JS - styled-components

✅ Styled-components API
✅ Props-based styling
✅ Theming
✅ Global styles
✅ CONCEPTS ALLOWED: Core React
❌ KHÔNG dùng: Emotion, Stitches

### Ngày 92: CSS Modules Deep Dive

✅ Scoped styles
✅ Composition
✅ Global vs local
✅ CONCEPTS ALLOWED: CSS basics
❌ KHÔNG dùng: SCSS (chỉ mention)

### Ngày 93: Tailwind Advanced

✅ Custom configuration
✅ JIT mode
✅ Plugin system
✅ Best practices
✅ CONCEPTS ALLOWED: Tailwind basics (từ Core)
❌ KHÔNG dùng: UnoCSS

### Ngày 94: Styling Comparison

✅ CSS-in-JS vs CSS Modules vs Tailwind
✅ Performance implications
✅ DX comparison
✅ When to use what

### Ngày 95: ⚡ Project 10 - Styled Landing Page

🎯 Goal: Master styling approach

-   Pick one: styled-components, CSS Modules, hoặc Tailwind
-   Implement complex UI
-   Responsive design
-   Theme switching
```

```markdown
## Module D: Component Libraries (5 ngày)

### Ngày 96: shadcn/ui Deep Dive

✅ Copy-paste component philosophy
✅ Customization
✅ Integration
✅ CONCEPTS ALLOWED: Core React + Styling
❌ KHÔNG dùng: MUI, Ant Design

### Ngày 97: Material-UI (MUI) Basics

✅ Component library concept
✅ MUI components
✅ Theming system
✅ Customization
✅ CONCEPTS ALLOWED: shadcn (để so sánh)
❌ KHÔNG dùng: MUI advanced patterns

### Ngày 98: Headless UI Libraries

✅ Radix UI
✅ Headless UI
✅ React Aria
✅ Accessibility-first approach
✅ CONCEPTS ALLOWED: MUI (để so sánh)
❌ KHÔNG dùng: Implementation details

### Ngày 99: Component Library Comparison

✅ shadcn vs MUI vs Radix vs Ant Design
✅ Pros/Cons matrix
✅ Decision framework
✅ When to build custom

### Ngày 100: ⚡ Project 11 - Component Library Integration

🎯 Goal: Work with existing libraries

-   Pick một library
-   Build complex form
-   Custom components
-   Accessibility compliance
```

---

## 🎭 PHASE 10: ANIMATIONS & ADVANCED UI (Ngày 101-110)

### 🎯 Mục tiêu: Animations & Advanced Interactions

```markdown
## Module E: Animations (5 ngày)

### Ngày 101: CSS Animations trong React

✅ CSS transitions
✅ CSS animations
✅ React Transition Group
✅ CONCEPTS ALLOWED: Core React
❌ KHÔNG dùng: Animation libraries

### Ngày 102: Framer Motion - Basics

✅ Motion components
✅ Animate prop
✅ Variants
✅ Layout animations
✅ CONCEPTS ALLOWED: CSS animations (để so sánh)
❌ KHÔNG dùng: Advanced Framer features

### Ngày 103: Framer Motion - Advanced

✅ Gestures
✅ Scroll animations
✅ Shared layout animations
✅ AnimatePresence
✅ CONCEPTS ALLOWED: Framer basics (Ngày 102)
❌ KHÔNG dùng: 3D animations

### Ngày 104: React Spring (Alternative)

✅ Spring physics
✅ useSpring
✅ useTrail
✅ Comparison với Framer Motion

### Ngày 105: ⚡ Project 12 - Animated Dashboard

🎯 Goal: Master animations

-   Page transitions
-   Micro-interactions
-   Loading animations
-   Gesture controls
```

````markdown
## Module F: Advanced UI (5 ngày)

### Ngày 106: Virtualization

✅ Why virtualization?
✅ react-window
✅ react-virtualized comparison
✅ Infinite scroll optimization
✅ CONCEPTS ALLOWED: Performance knowledge
❌ KHÔNG dùng: Custom virtualization

🔥 PATTERN:

```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList height={600} itemCount={10000} itemSize={50}>
    {Row}
</FixedSizeList>;
```

### Ngày 107: Drag & Drop

✅ dnd-kit library
✅ Draggable components
✅ Droppable areas
✅ Sortable lists
✅ CONCEPTS ALLOWED: Core React
❌ KHÔNG dùng: react-beautiful-dnd (deprecated)

### Ngày 108: Data Tables

✅ TanStack Table
✅ Sorting/filtering
✅ Pagination
✅ Column customization
✅ CONCEPTS ALLOWED: Virtualization (Ngày 106)
❌ KHÔNG dùng: AG Grid (commercial)

### Ngày 109: Charts & Visualizations

✅ Recharts
✅ Chart types
✅ Responsive charts
✅ Interactive tooltips
✅ CONCEPTS ALLOWED: Core React
❌ KHÔNG dùng: D3.js direct (advanced)

### Ngày 110: ⚡ Project 13 - Admin Dashboard

🎯 Goal: Complex UI components

-   Virtualized tables (10k+ rows)
-   Drag & drop kanban
-   Interactive charts
-   Real-time updates
````

## 🏗️ INTERMEDIATE CHECKPOINT

### 📊 Sau 110 ngày (Core + Ecosystem)

```

React Core: ████████████████████ 100% ✅
React Ecosystem: ████████████████████ 95% ✅
State Management: ████████████████████ 100% ✅
Routing: ████████████████████ 100% ✅
Styling Solutions: ████████████████████ 100% ✅
UI Libraries: ████████████████░░░░ 85% ✅
Animations: ████████████████░░░░ 80% ✅
Advanced UI: ████████████████░░░░ 80% ✅

Overall: ████████████████████ 93% ✅
Career Level: Senior-Ready (70%) ⚠️

```

**Các mục còn thiếu để trở thành Senior:**

-   ❌ Next.js / SSR
-   ❌ Advanced Testing
-   ❌ Advanced TypeScript
-   ❌ DevOps / CI/CD
-   ❌ Production Experience

---

## 🎯 CẤU TRÚC MODULE BỔ SUNG (Tùy Chọn)

### Tự chọn modules theo nhu cầu công việc:

```markdown
📦 ADVANCED MODULES (Chọn những mục thực sự cần)

Module 1: Next.js Professional (10 ngày) ⭐⭐⭐ Must-have
Module 2: Testing Professional (7 ngày) ⭐⭐⭐ Must-have
Module 3: TypeScript Advanced (5 ngày) ⭐⭐ Recommended
Module 4: DevOps Frontend (7 ngày) ⭐⭐ Recommended
Module 5: GraphQL & Apollo (5 ngày) ⭐ Optional
Module 6: React Native Intro (7 ngày) ⭐ Optional
Module 7: Micro-frontends (5 ngày) ⭐ Optional
```

---

## 📦 MODULE 1: NEXT.JS PROFESSIONAL (10 ngày) ⭐⭐⭐

### 🎯 Must-have cho Senior React Developer

````markdown
### Ngày 111: Next.js Fundamentals

✅ Next.js vs Create React App
✅ File-based routing
✅ App Router vs Pages Router
✅ Project structure
✅ CONCEPTS ALLOWED: Tất cả React + Router
❌ KHÔNG dùng: Server Components (chưa học)

🔥 COMPARISON:
React SPA vs Next.js

-   Client-side routing vs File-based
-   CSR vs SSR vs SSG
-   When to use each

### Ngày 112: Rendering Strategies

✅ CSR (Client-Side Rendering)
✅ SSR (Server-Side Rendering)
✅ SSG (Static Site Generation)
✅ ISR (Incremental Static Regeneration)
✅ CONCEPTS ALLOWED: Next.js basics (Ngày 111)
❌ KHÔNG dùng: Server Actions

🔥 DECISION TREE:

Content type?
├─ Static content → SSG
├─ Dynamic but cacheable → ISR
├─ Real-time data → SSR
└─ Client-only → CSR

### Ngày 113: App Router Deep Dive

✅ Layout patterns
✅ Route groups
✅ Parallel routes
✅ Intercepting routes
✅ CONCEPTS ALLOWED: Rendering strategies (Ngày 112)
❌ KHÔNG dùng: Middleware (chưa học)

### Ngày 114: Data Fetching trong Next.js

✅ Server Components
✅ Client Components boundary
✅ fetch với caching
✅ Data revalidation
✅ CONCEPTS ALLOWED: App Router (Ngày 113)
❌ KHÔNG dùng: Server Actions

🔥 PATTERN:

```jsx
// Server Component (default)
async function Page() {
    const data = await fetch('...', {
        next: { revalidate: 3600 },
    });
    return <div>{/* ... */}</div>;
}

// Client Component (explicit)
('use client');
function ClientComponent() {
    // Hooks, events, etc.
}
```

### Ngày 115: Server Actions & Mutations

✅ Server Actions concept
✅ Form actions
✅ useFormState, useFormStatus
✅ Progressive enhancement
✅ CONCEPTS ALLOWED: Server Components (Ngày 114)
❌ KHÔNG dùng: tRPC

🔥 PATTERN:

```jsx
async function createUser(formData) {
    'use server';
    const name = formData.get('name');
    await db.users.create({ name });
    revalidatePath('/users');
}
```

### Ngày 116: Streaming & Suspense

✅ Streaming SSR
✅ Suspense boundaries
✅ Loading.js pattern
✅ Progressive rendering
✅ CONCEPTS ALLOWED: Server Actions (Ngày 115)
❌ KHÔNG dùng: React Server Components internals
````

### Ngày 117: SEO & Metadata

✅ Metadata API
✅ generateMetadata
✅ Dynamic OG images
✅ Sitemap generation
✅ CONCEPTS ALLOWED: Streaming (Ngày 116)
❌ KHÔNG dùng: next-seo (deprecated)

🔥 METADATA PATTERN:

```jsx
export async function generateMetadata({ params }) {
    const product = await getProduct(params.id);
    return {
        title: product.name,
        description: product.description,
        openGraph: {
            images: [product.image],
        },
    };
}
```

### Ngày 118: Optimization & Performance

✅ Image optimization
✅ Font optimization
✅ Script optimization
✅ Bundle analysis
✅ CONCEPTS ALLOWED: SEO (Ngày 117)
❌ KHÔNG dùng: Custom webpack config

### Ngày 119: Middleware & Edge Runtime

✅ Middleware concept
✅ Authentication patterns
✅ Redirects & rewrites
✅ Edge runtime
✅ CONCEPTS ALLOWED: Optimization (Ngày 118)
❌ KHÔNG dùng: Vercel-specific features

### Ngày 120: ⚡ Project 14 - Next.js E-commerce

🎯 Goal: Production Next.js app
📋 Features:

-   SSG product pages
-   ISR for inventory
-   Server Actions for checkout
-   Optimized images/fonts
-   SEO optimized
-   Streaming UI
    📊 Requirements:
-   Lighthouse score > 90
-   Core Web Vitals pass
-   SEO audit pass

`````

---

## 📦 MODULE 2: TESTING PROFESSIONAL (7 ngày) ⭐⭐⭐

### 🎯 Must-have cho Senior Developer

````markdown
### Ngày 121: Advanced RTL Patterns

✅ Custom render functions
✅ Testing async behavior
✅ Testing error boundaries
✅ Snapshot testing (when/when not)
✅ CONCEPTS ALLOWED: RTL basics từ Core
❌ KHÔNG dùng: Enzyme (deprecated)

### Ngày 122: Testing State Management

✅ Testing Redux
✅ Testing Context
✅ Testing Zustand
✅ Testing TanStack Query
✅ CONCEPTS ALLOWED: State management ecosystem
❌ KHÔNG dùng: Redux-mock-store (obsolete)

### Ngày 123: Component Integration Tests

✅ Testing component trees
✅ Testing routing
✅ Testing forms
✅ Testing side effects
✅ CONCEPTS ALLOWED: Router + Forms
❌ KHÔNG dùng: E2E (chưa học)

### Ngày 124: Playwright - E2E Fundamentals

✅ Playwright setup
✅ Locators & actions
✅ Assertions
✅ Test isolation
✅ CONCEPTS ALLOWED: RTL (để so sánh)
❌ KHÔNG dùng: Cypress (alternative mention only)

🔥 PATTERN:

```js
test('user can checkout', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'Checkout' }).click();
    await expect(page).toHaveURL('/checkout');
});
```

### Ngày 125: Visual Regression Testing

✅ Storybook setup
✅ Visual testing concept
✅ Percy / Chromatic
✅ Component documentation
✅ CONCEPTS ALLOWED: Component testing
❌ KHÔNG dùng: Paid tools (mention only)

### Ngày 126: Testing Strategy & Coverage

✅ Testing pyramid
✅ Coverage reports
✅ Mutation testing
✅ Performance testing
✅ CONCEPTS ALLOWED: Tất cả testing
❌ KHÔNG dùng: Advanced CI/CD (module khác)

### Ngày 127: ⚡ Project 15 - Fully Tested App

🎯 Goal: Comprehensive test suite
📋 Requirements:

-   Unit tests (>85% coverage)
-   Integration tests
-   E2E critical paths
-   Visual regression
-   A11y testing
-   Performance benchmarks

✅ CONCEPTS ALLOWED: Tất cả testing tools đã học
❌ KHÔNG dùng: CI/CD automation (module khác)

📊 Deliverables:

-   [ ] Full test suite
-   [ ] Coverage report
-   [ ] Testing documentation
-   [ ] Best practices guide
`````

---

## 📦 MODULE 3: TYPESCRIPT ADVANCED (5 ngày) ⭐⭐

### 🎯 Recommended cho Senior Developer

````markdown
### Ngày 128: Advanced Type Patterns

✅ Generic constraints
✅ Conditional types
✅ Mapped types
✅ Template literal types
✅ CONCEPTS ALLOWED: TS basics từ Core
❌ KHÔNG dùng: Compiler API

🔥 PATTERNS:

```typescript
// Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// Conditional types
type IsString<T> = T extends string ? true : false;

// Mapped types
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

### Ngày 129: Utility Types Mastery

✅ Built-in utility types
✅ Custom utility types
✅ Type manipulation
✅ Discriminated unions
✅ CONCEPTS ALLOWED: Advanced patterns (Ngày 128)
❌ KHÔNG dùng: External type libraries

🔥 UTILITY TYPES:

-   Partial<T>, Required<T>, Readonly<T>
-   Pick<T, K>, Omit<T, K>
-   Record<K, T>
-   Exclude<T, U>, Extract<T, U>
-   NonNullable<T>
-   ReturnType<T>, Parameters<T>

### Ngày 130: Type-safe React Patterns

✅ Generic components
✅ Discriminated union props
✅ Polymorphic components
✅ ForwardRef typing
✅ CONCEPTS ALLOWED: TS Advanced + React
❌ KHÔNG dùng: Any types

🔥 POLYMORPHIC COMPONENT:

```typescript
type ButtonProps<C extends React.ElementType> = {
    as?: C;
    children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

function Button<C extends React.ElementType = 'button'>({
    as,
    children,
    ...props
}: ButtonProps<C>) {
    const Component = as || 'button';
    return <Component {...props}>{children}</Component>;
}
```

### Ngày 131: Type-safe APIs

✅ Zod runtime validation
✅ Type inference from schemas
✅ API response typing
✅ Error handling types
✅ CONCEPTS ALLOWED: Zod từ Core + TS Advanced
❌ KHÔNG dùng: io-ts, Yup

🔥 PATTERN:

```typescript
const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

async function fetchUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return UserSchema.parse(data); // Runtime validation
}
```

### Ngày 132: ⚡ Project 16 - Type-safe Application

🎯 Goal: Full TypeScript mastery
📋 Features:

-   Generic components
-   Type-safe API layer
-   Discriminated unions
-   No `any` types
-   Full type coverage

✅ CONCEPTS ALLOWED: Tất cả TypeScript đã học
❌ KHÔNG dùng: Type assertions (minimize)
````

---

## 📦 MODULE 4: DEVOPS FRONTEND (7 ngày) ⭐⭐

### 🎯 Recommended cho Production Readiness

````markdown
### Ngày 133: Git Workflows & Collaboration

✅ Git branching strategies (Git Flow, GitHub Flow)
✅ Conventional commits
✅ PR best practices
✅ Code review guidelines
✅ CONCEPTS ALLOWED: Git basics
❌ KHÔNG dùng: Git internals

🔥 COMMIT CONVENTION:

```bash
feat: add user authentication
fix: resolve memory leak in dashboard
docs: update API documentation
refactor: simplify state management
test: add unit tests for hooks
```

### Ngày 134: CI/CD Fundamentals

✅ GitHub Actions basics
✅ Automated testing pipeline
✅ Build & deploy workflow
✅ Environment variables
✅ CONCEPTS ALLOWED: Git workflows (Ngày 133)
❌ KHÔNG dùng: Jenkins, GitLab CI (chỉ mention)

🔥 GITHUB ACTIONS:

```yaml
name: CI
on: [push, pull_request]
jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
            - run: npm ci
            - run: npm test
            - run: npm run build
```

### Ngày 135: Build Optimization

✅ Bundle analysis
✅ Code splitting strategies
✅ Tree shaking
✅ Dynamic imports
✅ CONCEPTS ALLOWED: Core React + Build tools
❌ KHÔNG dùng: Webpack manual config

🔥 ANALYSIS TOOLS:

-   Webpack Bundle Analyzer
-   source-map-explorer
-   Lighthouse CI

### Ngày 136: Deployment Strategies

✅ Vercel deployment
✅ Netlify deployment
✅ Environment management
✅ Preview deployments
✅ CONCEPTS ALLOWED: CI/CD (Ngày 134)
❌ KHÔNG dùng: Docker (chỉ mention)

### Ngày 137: Monitoring & Error Tracking

✅ Sentry setup
✅ Error boundaries integration
✅ Performance monitoring
✅ Analytics integration
✅ CONCEPTS ALLOWED: Error Boundaries từ Core
❌ KHÔNG dùng: Self-hosted solutions

🔥 SENTRY SETUP:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
});
```

### Ngày 138: Performance Optimization

✅ Core Web Vitals
✅ Lighthouse audits
✅ Performance budgets
✅ CDN strategies
✅ CONCEPTS ALLOWED: Performance từ Core
❌ KHÔNG dùng: Advanced CDN config

### Ngày 139: ⚡ Project 17 - Production Deployment

🎯 Goal: Full DevOps pipeline
📋 Features:

-   Automated CI/CD
-   Environment management
-   Error tracking
-   Performance monitoring
-   Zero-downtime deployment

📊 Requirements:

-   [ ] Lighthouse score > 90
-   [ ] Automated tests pass
-   [ ] Preview environments
-   [ ] Error tracking active
-   [ ] Analytics integrated
````

---

## 📦 MODULE 5: GRAPHQL & APOLLO (5 ngày) ⭐ OPTIONAL

### 🎯 Optional cho Full-stack Development

````markdown
### Ngày 140: GraphQL Fundamentals

✅ GraphQL vs REST
✅ Queries & Mutations
✅ Schema & Types
✅ GraphQL Playground
✅ CONCEPTS ALLOWED: REST API knowledge
❌ KHÔNG dùng: Apollo Client (chưa học)

🔥 BASIC QUERY:

```graphql
query GetUser($id: ID!) {
    user(id: $id) {
        id
        name
        email
        posts {
            title
        }
    }
}
```

### Ngày 141: Apollo Client Setup

✅ Apollo Client installation
✅ InMemoryCache
✅ Query components
✅ Error handling
✅ CONCEPTS ALLOWED: GraphQL basics (Ngày 140)
❌ KHÔNG dùng: urql, Relay

### Ngày 142: Apollo Mutations & Cache

✅ useMutation hook
✅ Cache updates
✅ Optimistic responses
✅ Refetch strategies
✅ CONCEPTS ALLOWED: Apollo basics (Ngày 141)
❌ KHÔNG dùng: Advanced cache policies

### Ngày 143: Apollo Advanced

✅ Pagination
✅ Subscriptions (overview)
✅ Local state management
✅ Error policies
✅ CONCEPTS ALLOWED: Apollo mutations (Ngày 142)
❌ KHÔNG dùng: Federation

### Ngày 144: ⚡ Project 18 - GraphQL App

🎯 Goal: Full Apollo integration
📋 Features:

-   GraphQL queries/mutations
-   Optimistic updates
-   Cache management
-   Subscription preview
````

---

## 📦 MODULE 6: REACT NATIVE INTRO (7 ngày) ⭐ OPTIONAL

### 🎯 Optional cho Mobile Development

````markdown
### Ngày 145: React Native Fundamentals

✅ React vs React Native
✅ Expo setup
✅ Core components (View, Text, Image)
✅ StyleSheet API
✅ CONCEPTS ALLOWED: Core React
❌ KHÔNG dùng: Native modules

🔥 BASIC COMPONENT:

```jsx
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <Text>Hello React Native!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
```

### Ngày 146: React Navigation

✅ Stack Navigator
✅ Tab Navigator
✅ Drawer Navigator
✅ Passing params
✅ CONCEPTS ALLOWED: React Router concepts
❌ KHÔNG dùng: Deep linking

### Ngày 147: Platform-Specific Code

✅ Platform module
✅ Platform-specific files
✅ Responsive design
✅ Safe area handling
✅ CONCEPTS ALLOWED: RN fundamentals
❌ KHÔNG dùng: Native code

### Ngày 148: Data & State

✅ AsyncStorage
✅ State management (Redux/Zustand)
✅ API calls
✅ Network handling
✅ CONCEPTS ALLOWED: State management từ Core
❌ KHÔNG dùng: SQLite, Realm

### Ngày 149: Native Features

✅ Camera (Expo)
✅ Location
✅ Permissions
✅ Push notifications (overview)
✅ CONCEPTS ALLOWED: RN APIs
❌ KHÔNG dùng: Custom native modules

### Ngày 150: Performance & Build

✅ Performance optimization
✅ Image optimization
✅ List performance
✅ Build & publish (overview)
✅ CONCEPTS ALLOWED: Tất cả RN
❌ KHÔNG dùng: Bare React Native

### Ngày 151: ⚡ Project 19 - Mobile App

🎯 Goal: Basic mobile app
📋 Features:

-   Navigation
-   API integration
-   Local storage
-   Camera/Location
-   Platform-specific UI
````

---

## 📦 MODULE 7: MICRO-FRONTENDS (5 ngày) ⭐ OPTIONAL

### 🎯 Optional cho Enterprise Architecture

````markdown
### Ngày 152: Micro-frontends Concepts

✅ Micro-frontends architecture
✅ When to use
✅ Trade-offs
✅ Module Federation
✅ CONCEPTS ALLOWED: Advanced architecture
❌ KHÔNG dùng: Implementation (chỉ concepts)

🔥 ARCHITECTURE PATTERNS:

-   Build-time integration
-   Server-side integration
-   Runtime integration (Module Federation)

### Ngày 153: Module Federation Setup

✅ Webpack Module Federation
✅ Host & Remote apps
✅ Shared dependencies
✅ Dynamic remotes
✅ CONCEPTS ALLOWED: Micro-frontend concepts
❌ KHÔNG dùng: Single-SPA

🔥 WEBPACK CONFIG:

```javascript
new ModuleFederationPlugin({
    name: 'app1',
    remotes: {
        app2: 'app2@http://localhost:3002/remoteEntry.js',
    },
    shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
    },
});
```

### Ngày 154: Communication Patterns

✅ Props passing
✅ Custom events
✅ Shared state
✅ Routing coordination
✅ CONCEPTS ALLOWED: Module Federation
❌ KHÔNG dùng: Message buses

### Ngày 155: Deployment & Versioning

✅ Independent deployments
✅ Versioning strategies
✅ Fallback mechanisms
✅ Testing strategies
✅ CONCEPTS ALLOWED: Micro-frontend architecture
❌ KHÔNG dùng: Kubernetes

### Ngày 156: ⚡ Project 20 - Micro-frontend System

🎯 Goal: Multi-app system
📋 Features:

-   2+ independent apps
-   Module Federation
-   Shared components
-   Independent deployment
````

---

## 🎓 FINAL ASSESSMENT & CERTIFICATION (Ngày 157-165)

### 🏆 Comprehensive Capstone

```markdown
### Ngày 157-158: Planning & Architecture

📋 Design a complex application:

-   Architecture document
-   Technology stack decisions
-   Database schema
-   API design
-   Component hierarchy
-   State management strategy

### Ngày 159-161: Core Features Implementation

📋 Build main features:

-   Authentication system
-   CRUD operations
-   Real-time features
-   File uploads
-   Search & filtering

### Ngày 162-163: Advanced Features

📋 Add complexity:

-   Complex state management
-   Performance optimization
-   Advanced UI components
-   Testing suite
-   Error handling

### Ngày 164: Polish & Documentation

📋 Final touches:

-   Code review & refactoring
-   Documentation
-   README & setup guide
-   Deployment
-   Presentation preparation

### Ngày 165: Final Presentation

🎯 Present your project:

-   [ ] Architecture walkthrough
-   [ ] Live demo
-   [ ] Code review
-   [ ] Q&A
-   [ ] Performance metrics
-   [ ] Testing coverage report

✅ CERTIFICATION REQUIREMENTS:

-   [ ] Working production app
-   [ ] > 85% test coverage
-   [ ] Lighthouse score >90
-   [ ] Accessibility compliant
-   [ ] Full documentation
-   [ ] Code review passed
-   [ ] Presentation completed
```

---

## 🎊 KHÓA HỌC HOÀN CHỈNH: TỔNG KẾT

### 📊 Total Learning Path

```
CORE PATH (75 ngày):
├─ Phase 1-7: React Fundamentals ████████████████████ 100%

ECOSYSTEM (35 ngày):
├─ Phase 8-10: React Ecosystem    ████████████████████ 100%

ADVANCED MODULES (50 ngày - Optional):
├─ Module 1: Next.js              ████████████████████ 100%
├─ Module 2: Testing              ████████████████████ 100%
├─ Module 3: TypeScript           ████████████████████ 100%
├─ Module 4: DevOps               ████████████████████ 100%
├─ Module 5: GraphQL              ███████████████░░░░░  75%
├─ Module 6: React Native         ███████████████░░░░░  75%
└─ Module 7: Micro-frontends      ████████████░░░░░░░░  60%

FINAL CAPSTONE (9 ngày):
└─ Comprehensive Project          ████████████████████ 100%

TOTAL: 169 ngày (24 tuần)
```

### 🎯 Career Readiness by Learning Path

```markdown
## Path A: Core Only (75 ngày)

Junior Developer: ████████████████████ 100% ✅
Mid Developer: ████████████████████ 95% ✅
Senior Developer: ██████████░░░░░░░░░░ 50% ⚠️

## Path B: Core + Ecosystem (110 ngày)

Junior Developer: ████████████████████ 100% ✅
Mid Developer: ████████████████████ 100% ✅
Senior Developer: ████████████████░░░░ 70% ⚠️

## Path C: Core + Ecosystem + Essential Modules (127 ngày)

Next.js + Testing + TypeScript
Junior Developer: ████████████████████ 100% ✅
Mid Developer: ████████████████████ 100% ✅
Senior Developer: ████████████████████ 90% ✅

## Path D: Complete Master (165+ ngày)

All modules + Capstone
Junior Developer: ████████████████████ 100% ✅
Mid Developer: ████████████████████ 100% ✅
Senior Developer: ████████████████████ 95% ✅
Staff+ Engineer: ███████████░░░░░░░░░ 55% ⚠️
```

---

## 🎁 BONUS: LEARNING RESOURCES & COMMUNITY

### 📚 Recommended Learning Path by Career Goal

```markdown
### Goal: Junior → Mid (3-6 tháng)

REQUIRED:
✅ Core Path (75 ngày)
✅ Module A-B: Routing + Data Fetching (15 ngày)

OPTIONAL:

-   Module C: Styling (5 ngày)
-   Module D: Component Libraries (5 ngày)

Total: 90-100 ngày

### Goal: Mid → Senior (6-12 tháng)

REQUIRED:
✅ Core Path (75 ngày)
✅ Ecosystem (35 ngày)
✅ Next.js Professional (10 ngày)
✅ Testing Professional (7 ngày)

HIGHLY RECOMMENDED:
✅ TypeScript Advanced (5 ngày)
✅ DevOps Frontend (7 ngày)

Total: 127-139 ngày

### Goal: Senior → Staff (12+ tháng)

REQUIRED:
✅ Complete Core + Ecosystem (110 ngày)
✅ All Essential Modules (29 ngày)

RECOMMENDED:
✅ GraphQL (5 ngày)
✅ Micro-frontends (5 ngày)
✅ 2-3 major production projects

Total: 140-160 ngày + real experience
```

---

## 🚀 NEXT STEPS AFTER COMPLETION

### 🎯 Continuous Learning

```markdown
### Keep Learning:

1. **Stay Updated**

    - React RFC discussions
    - React Labs blog
    - React conferences
    - Twitter/X React community

2. **Deep Dives**

    - React internals (Fiber architecture)
    - Compiler optimizations
    - Performance profiling
    - Advanced patterns

3. **Expand Stack**

    - Backend: Node.js, Express, tRPC
    - Databases: PostgreSQL, MongoDB
    - Cloud: AWS, GCP, Azure
    - Infrastructure: Docker, Kubernetes

4. **Build Portfolio**

    - 3-5 production-quality projects
    - Open source contributions
    - Technical blog posts
    - Conference talks

5. **Mentor Others**
    - Code reviews
    - Teaching juniors
    - Community involvement
    - Writing documentation
```

---

## ✅ CHECKLIST: LÀM CHỦ REACT HOÀN TOÀN

```markdown
### Fundamental Skills

-   [ ] JavaScript ES6+ expert
-   [ ] React core concepts mastered
-   [ ] All React hooks understood
-   [ ] State management (Context, useReducer)
-   [ ] Performance optimization
-   [ ] Testing mindset

### Ecosystem Skills

-   [ ] React Router proficient
-   [ ] TanStack Query/Redux Toolkit
-   [ ] Styling solution of choice
-   [ ] Component library experience
-   [ ] Animation libraries
-   [ ] Advanced UI patterns

### Production Skills

-   [ ] Next.js deployment
-   [ ] Testing strategy implementation
-   [ ] TypeScript in production
-   [ ] CI/CD pipeline setup
-   [ ] Monitoring & error tracking
-   [ ] Performance optimization

### Soft Skills

-   [ ] Code review skills
-   [ ] Technical communication
-   [ ] Architecture decisions
-   [ ] Team collaboration
-   [ ] Mentoring juniors
-   [ ] Documentation writing

### Portfolio

-   [ ] 3-5 production projects
-   [ ] Open source contributions
-   [ ] Technical blog
-   [ ] GitHub showcase
-   [ ] LinkedIn optimized
-   [ ] Resume updated
```

---

## 🎓 CERTIFICATE OF COMPLETION

```
🏆 REACT MASTERY CERTIFICATION

Học viên đã hoàn thành:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ React Fundamentals (75 ngày)
✅ React Ecosystem (35 ngày)
✅ [Optional Modules Completed]
✅ Final Capstone Project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Skills Acquired:
• React 18/19 Features
• Advanced State Management
• Performance Optimization
• Testing & Quality Assurance
• TypeScript Integration
• Production Deployment

Career Ready: ⭐⭐⭐⭐⭐ Senior React Developer

Date: [Completion Date]
Total Hours: [Estimated Hours]
Projects Completed: [Number]
Test Coverage: [Percentage]%
```

---

## 🎉 CHÚC MỪNG!

**Bạn đã hoàn thành lộ trình React Mastery!**

Bây giờ bạn đã:

-   ✅ Vững chắc React fundamentals
-   ✅ Thành thạo React ecosystem
-   ✅ Sẵn sàng cho production
-   ✅ Có portfolio ấn tượng
-   ✅ Sẵn sàng cho Senior role

**Next Steps:**

1. Apply for Senior React Developer positions
2. Contribute to open source
3. Start mentoring juniors
4. Build your personal brand
5. Never stop learning! 🚀

**Remember:** Becoming a Senior is not just about completing a course—it's about continuous practice, real-world experience, and helping others grow.

**Good luck on your journey!** 💪

---

# 📖 HẾT - END OF ROADMAP

**Total Days:** 169 ngày (24 tuần / 6 tháng)
**Total Projects:** 20 projects
**Skill Level:** Junior → Senior Ready
**Career Readiness:** 90-95% (với essential modules)

---
