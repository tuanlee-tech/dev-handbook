
## 📚 Giai đoạn 02: React Pure (React 18/19)
<details>
<summary>
<span style="font-size: 20px; font-weight: bold;">React Fundamentals ( Nhấn để xem thêm ) </span>
</summary>

#### **1. JSX & Rendering**
* **JSX Syntax**: expressions, embedding JavaScript, fragments
* **Conditional Rendering**: `if/else`, ternary, logical AND `&&`, nullish coalescing
* **List Rendering**: `map()`, `key` prop, index as key (anti-pattern)
* **React Elements**: `React.createElement()`, JSX transform
* **Fragments**: `<React.Fragment>`, `<>...</>` shorthand

#### **2. Components**
* **Function Components**: modern approach, hooks-based
* **Class Components**: legacy, lifecycle methods (biết để đọc code cũ)
* **Props**: passing data, prop types, default props, children prop
* **Props Destructuring**: cleaner code, default values
* **Prop Drilling**: vấn đề và giải pháp
* **Component Composition**: children, render props, compound components
* **Higher-Order Components (HOC)**: pattern, use cases, caveats

#### **3. State Management (Component Level)**
* **useState**: basic state, lazy initialization, functional updates
* **useReducer**: complex state logic, action types, reducer pattern
* **State Immutability**: spread operator, immutable updates, Immer
* **Lifting State Up**: shared state, state hoisting
* **Derived State**: tính toán từ state/props, tránh redundancy
* **State Batching**: automatic batching (React 18+), manual batching

#### **4. Effects & Side Effects**
* **useEffect**: side effects, dependencies array, cleanup function
* **Effect Dependencies**: dependency array rules, exhaustive-deps
* **Cleanup**: preventing memory leaks, subscription cleanup
* **useLayoutEffect**: synchronous effects, DOM measurements
* **useInsertionEffect**: CSS-in-JS libraries (React 18+)
* **Effect Best Practices**: separation of concerns, avoiding race conditions

#### **5. React Hooks (Core & Modern)**

**Core Hooks:**
* **useState**: state management
* **useEffect**: side effects
* **useContext**: consume context
* **useReducer**: complex state logic
* **useCallback**: memoize callbacks, prevent re-renders
* **useMemo**: memoize expensive calculations
* **useRef**: DOM references, mutable values không trigger re-render
* **useImperativeHandle**: customize ref exposure (với `forwardRef`)
* **useLayoutEffect**: synchronous DOM effects
* **useDebugValue**: custom hooks debugging

**React 18+ Hooks:**
* **useId**: unique IDs cho accessibility (SSR-safe)
* **useTransition**: non-blocking UI updates, concurrent features
* **useDeferredValue**: defer non-urgent updates
* **useSyncExternalStore**: subscribe external stores (tearing prevention)
* **useInsertionEffect**: CSS-in-JS injection

**React 19 Hooks (Mới nhất):**
* **useActionState**: quản lý form actions với pending states
* **useFormStatus**: theo dõi form submission status
* **useOptimistic**: optimistic updates cho better UX
* **use**: unwrap Promises/Context (experimental)

#### **6. Context API**
* **createContext**: tạo context
* **useContext**: consume context trong functional components
* **Provider**: cung cấp value, re-render optimization
* **Consumer**: legacy consumption pattern
* **Context Best Practices**: tránh over-use, split contexts, memoization
* **Context vs Props**: khi nào dùng context

#### **7. Refs & DOM Access**
* **useRef**: DOM references, previous values, timers
* **forwardRef**: truyền ref qua components
* **useImperativeHandle**: custom ref API
* **Callback Refs**: dynamic refs, measurement
* **Ref vs State**: khi nào dùng ref thay vì state

#### **8. Forms & User Input**
* **Controlled Components**: state-managed inputs, two-way binding
* **Uncontrolled Components**: ref-based forms, default values
* **Form Validation**: client-side validation, error messages
* **Form Libraries**: React Hook Form, Formik (ecosystem)
* **File Uploads**: handling file inputs
* **Form Submission**: preventDefault, async submission

#### **9. Performance Optimization**
* **React.memo**: prevent unnecessary re-renders
* **useMemo**: memoize expensive computations
* **useCallback**: memoize callbacks
* **Code Splitting**: `React.lazy()`, `Suspense`
* **Dynamic Import**: route-based splitting
* **Windowing/Virtualization**: react-window, react-virtualized
* **Profiler**: React DevTools Profiler, `<Profiler>` component
* **Concurrent Features (React 18+)**: automatic batching, transitions, Suspense for data fetching

#### **10. React 18/19 Features**

**React 18:**
* **Concurrent Rendering**: interruptible rendering, prioritization
* **Automatic Batching**: multiple setState batched automatically
* **Transitions**: `startTransition`, `useTransition` - non-blocking updates
* **Suspense SSR**: streaming SSR, selective hydration
* **New Root API**: `createRoot`, thay thế `ReactDOM.render`
* **Strict Mode Changes**: double-invoked effects trong dev

**React 19 (Latest):**
* **Server Components**: React Server Components (RSC) native support
* **Actions**: built-in form actions, `useActionState`
* **Document Metadata**: `<title>`, `<meta>` in components
* **Asset Loading**: Suspense for stylesheets, fonts, scripts
* **Web Components**: better integration
* **Ref as Prop**: không cần forwardRef nữa
* **Optimistic Updates**: `useOptimistic` hook
* **Form Status**: `useFormStatus` hook
* **Context Provider Simplification**: `<Context>` thay vì `<Context.Provider>`

#### **11. Error Handling**
* **Error Boundaries**: class-based (chưa có hook)
* **componentDidCatch**: error logging
* **getDerivedStateFromError**: fallback UI
* **Error Boundary Libraries**: react-error-boundary

#### **12. Testing**
* **Testing Library**: @testing-library/react, user-centric tests
* **Test Types**: unit, integration, e2e
* **Testing Hooks**: @testing-library/react-hooks
* **Mocking**: jest mocks, MSW (Mock Service Worker)
* **Snapshot Testing**: Jest snapshots

#### **13. Patterns & Best Practices**
* **Component Patterns**: Container/Presentational, Compound Components, Render Props
* **Custom Hooks**: logic reuse, hook composition
* **Prop Types**: PropTypes (legacy), TypeScript (modern)
* **Folder Structure**: feature-based, atomic design
* **Code Organization**: separation of concerns, single responsibility
* **Naming Conventions**: components, hooks, handlers
* **Anti-patterns**: prop drilling, unnecessary state, prop mutation


</details>

---

## 📘 Giáo Án React Pure (React 18/19) - 30 Ngày

### 🎯 Cấu trúc: 6 tuần × 5 ngày = 30 ngày học



## **TUẦN 1: FOUNDATION - Nền tảng cơ bản**

### **Ngày 1: JSX & Rendering Basics**
- JSX Syntax: expressions, embedding JavaScript
- React Elements & JSX transform
- Fragments (`<></>`, `React.Fragment`)
- **Thực hành**: Tạo UI components đơn giản với JSX

### **Ngày 2: Conditional & List Rendering**
- Conditional Rendering: `if/else`, ternary, `&&`, nullish coalescing
- List Rendering: `map()`, `key` prop
- Anti-pattern: index as key
- **Thực hành**: Todo list với conditional rendering

### **Ngày 3: Components Fundamentals**
- Function Components (modern approach)
- Props: passing data, children prop
- Props Destructuring & default values
- **Thực hành**: Component library nhỏ (Button, Card, Badge)

### **Ngày 4: Component Composition**
- Component Composition patterns
- Children prop advanced usage
- Compound Components pattern
- **Thực hành**: Tabs component với compound pattern

### **Ngày 5: Class Components (Legacy)**
- Class Components syntax & lifecycle
- Đọc hiểu code cũ
- So sánh Function vs Class
- **Thực hành**: Đọc & refactor class component sang function

---

## **TUẦN 2: STATE & EFFECTS - Quản lý state và side effects**

### **Ngày 6: useState Mastery**
- useState basics & lazy initialization
- Functional updates
- State Immutability (spread operator)
- **Thực hành**: Counter, Form inputs, Toggle components

### **Ngày 7: Complex State với useReducer**
- useReducer pattern
- Action types & reducer function
- Khi nào dùng useReducer vs useState
- **Thực hành**: Shopping cart với useReducer

### **Ngày 8: State Management Patterns**
- Lifting State Up
- Derived State (tránh redundancy)
- State Batching (React 18)
- **Thực hành**: Multi-step form với shared state

### **Ngày 9: useEffect Fundamentals**
- Side effects concept
- Dependencies array rules
- Cleanup function
- **Thực hành**: Data fetching, timers, subscriptions

### **Ngày 10: Advanced Effects**
- useLayoutEffect vs useEffect
- useInsertionEffect (React 18)
- Effect best practices: race conditions, cleanup
- **Thực hành**: Scroll position tracker, DOM measurements

---

## **TUẦN 3: ADVANCED HOOKS - Hooks nâng cao**

### **Ngày 11: Performance Hooks**
- useMemo: memoize calculations
- useCallback: memoize callbacks
- React.memo: component memoization
- **Thực hành**: Optimize expensive list rendering

### **Ngày 12: Refs & DOM Access**
- useRef: DOM references & mutable values
- forwardRef pattern
- useImperativeHandle
- Callback refs
- **Thực hành**: Custom video player với ref API

### **Ngày 13: React 18 Concurrent Hooks**
- useTransition: non-blocking updates
- useDeferredValue: defer updates
- useSyncExternalStore: external stores
- **Thực hành**: Search với debounced results (useTransition)

### **Ngày 14: React 19 Modern Hooks**
- useId: unique IDs (SSR-safe)
- useActionState: form actions
- useFormStatus: form submission tracking
- useOptimistic: optimistic updates
- **Thực hành**: Modern form với React 19 features

### **Ngày 15: Custom Hooks**
- Tạo custom hooks
- Hook composition
- useDebugValue
- Best practices
- **Thực hành**: useLocalStorage, useFetch, useMediaQuery

---

## **TUẦN 4: CONTEXT & FORMS - Context API và Forms**

### **Ngày 16: Context API Basics**
- createContext & useContext
- Provider pattern
- Context vs Props
- **Thực hành**: Theme switcher với Context

### **Ngày 17: Advanced Context Patterns**
- Multiple contexts
- Context composition
- Re-render optimization
- Context best practices
- **Thực hành**: Auth context với user management

### **Ngày 18: Forms - Controlled Components**
- Controlled vs Uncontrolled
- Two-way binding
- Form validation
- **Thực hành**: Registration form với validation

### **Ngày 19: Advanced Forms**
- React Hook Form introduction
- File uploads
- Async form submission
- Form error handling
- **Thực hành**: Multi-step form với file upload

### **Ngày 20: Forms & Context Integration**
- Form state management với Context
- Global form state
- **Thực hành**: Wizard form với global state

---

## **TUẦN 5: PERFORMANCE & PATTERNS - Tối ưu và Patterns**

### **Ngày 21: Performance Optimization Deep Dive**
- React DevTools Profiler
- Performance bottlenecks identification
- Profiler component
- **Thực hành**: Profile & optimize slow components

### **Ngày 22: Code Splitting & Lazy Loading**
- React.lazy() & Suspense
- Dynamic import
- Route-based splitting strategy
- **Thực hành**: Lazy load routes và components

### **Ngày 23: Virtualization & Large Lists**
- Windowing concepts
- react-window/react-virtualized
- Infinite scroll patterns
- **Thực hành**: Virtual list với 10,000+ items

### **Ngày 24: Advanced Component Patterns**
- Higher-Order Components (HOC)
- Render Props pattern
- Container/Presentational pattern
- **Thực hành**: withAuth HOC, Render Props toggle

### **Ngày 25: Error Handling & Testing Prep**
- Error Boundaries (class-based)
- componentDidCatch & getDerivedStateFromError
- react-error-boundary library
- **Thực hành**: Error boundary wrapper cho app

---

## **TUẦN 6: REACT 18/19 & BEST PRACTICES - Features mới và Best practices**

### **Ngày 26: React 18 Concurrent Features**
- Concurrent Rendering concepts
- Automatic Batching
- Transitions & startTransition
- Suspense SSR
- New Root API (createRoot)
- **Thực hành**: Migrate app sang React 18

### **Ngày 27: React 19 Latest Features**
- Server Components overview
- Built-in Actions
- Document Metadata in components
- Asset Loading với Suspense
- Ref as Prop (no forwardRef needed)
- Context Provider simplification
- **Thực hành**: Experiment với React 19 features

### **Ngày 28: Testing với Testing Library**
- @testing-library/react setup
- Writing user-centric tests
- Testing hooks
- Mocking với MSW
- **Thực hành**: Test suite cho key components

### **Ngày 29: Best Practices & Anti-patterns**
- Code organization & folder structure
- Naming conventions
- Common anti-patterns to avoid
- Prop drilling solutions
- **Thực hành**: Code review & refactoring session

### **Ngày 30: Capstone Project & Review**
- Build complete app tích hợp tất cả kiến thức:
  - Multiple routes (code splitting)
  - Context for global state
  - Forms với validation
  - Performance optimization
  - Error boundaries
  - React 18/19 features
- Code review checklist
- Next steps: học routing, state management libraries

---

## 📊 **Cấu trúc mỗi ngày (2-3 giờ):**

1. **Theory** (30-45 phút): Đọc tài liệu, xem video
2. **Code Demo** (30-45 phút): Follow along examples
3. **Thực hành** (60-90 phút): Hands-on exercises
4. **Review** (15-30 phút): Tổng kết, ghi chú

## 🎯 **Tips học hiệu quả:**

- **Ngày 1-5**: Focus vào JSX và components, nắm vững trước khi sang state
- **Ngày 6-15**: Đây là phần quan trọng nhất, dành thời gian practice nhiều
- **Ngày 16-20**: Context và Forms là nền tảng cho real-world apps
- **Ngày 21-25**: Performance và patterns giúp viết code professional
- **Ngày 26-30**: Modern features và best practices cho production-ready code

## 📚 **Tài nguyên gợi ý:**

- React Docs (beta.reactjs.org)
- React 19 RC Documentation
- Kent C. Dodds - Epic React
- Frontend Masters courses
- Josh Comeau blog