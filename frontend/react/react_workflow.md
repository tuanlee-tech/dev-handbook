# 🎯 REACT SENIOR COMPLETE WORKFLOW

## 📋 MỤC ĐÍCH

Chuẩn hóa workflow làm bài tập React ở level Senior/Lead, bao phủm **TOÀN BỘ kiến thức ReactJS**, đảm bảo code production-ready và phù hợp cho technical interview.

---

## ✅ CHECKLIST CHUẨN - ÁP DỤNG CHO MỌI BÀI

### 🧠 A. Cách Làm Bài

-   [ ] User **chỉ trình bày ý tưởng / hướng giải**
-   [ ] AI review & tối ưu theo **Senior mindset**
-   [ ] AI viết **full code hoàn chỉnh** để copy
-   [ ] Code phải **chạy được ngay**, không placeholder

---

## 🏗️ I. STATE MANAGEMENT

### 📌 1. useState Mastery

#### **Basic Rules**

-   [ ] Không lạm dụng useState cho mọi thứ
-   [ ] Nhóm related states thành object
-   [ ] **KHÔNG lưu derived state vào state**

```typescript
// ❌ BAD: Derived state
const [count, setCount] = useState(0);
const [doubled, setDoubled] = useState(0); // Derived!

// ✅ GOOD: Compute on render
const [count, setCount] = useState(0);
const doubled = count * 2;
```

#### **State Grouping**

```typescript
// ❌ BAD: Nhiều useState rời rạc
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');

// ✅ GOOD: Nhóm related data
const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
});
```

#### **State Updates**

```typescript
// ❌ BAD: Direct mutation
state.items.push(newItem);
setState(state);

// ✅ GOOD: Immutable update
setState((prev) => ({
    ...prev,
    items: [...prev.items, newItem],
}));
```

#### **Functional Updates**

```typescript
// ❌ BAD: Closure stale state
setCount(count + 1);

// ✅ GOOD: Function form khi cần previous state
setCount((prev) => prev + 1);
```

---

### 📌 2. useReducer

#### **Khi Nào Dùng useReducer**

-   State logic phức tạp (nhiều sub-values)
-   State transitions có rules rõ ràng
-   Cần test logic tách biệt khỏi component
-   Multiple related state updates

```typescript
// State phức tạp với nhiều actions
type State = {
    past: number[];
    present: number;
    future: number[];
    limits: { min: number; max: number };
};

type Action =
    | { type: 'INCREMENT'; step: number }
    | { type: 'DECREMENT'; step: number }
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'RESET' }
    | { type: 'SET_LIMITS'; limits: { min: number; max: number } };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'INCREMENT':
            const newValue = clamp(
                state.present + action.step,
                state.limits.min,
                state.limits.max
            );
            return {
                ...state,
                past: [...state.past, state.present],
                present: newValue,
                future: [],
            };

        case 'UNDO':
            if (state.past.length === 0) return state;
            return {
                ...state,
                past: state.past.slice(0, -1),
                present: state.past[state.past.length - 1],
                future: [state.present, ...state.future],
            };

        // ... other cases
        default:
            return state;
    }
}

// Usage
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'INCREMENT', step: 5 });
```

#### **Testing Reducer**

```typescript
describe('counterReducer', () => {
    test('should increment value', () => {
        const state = { present: 5, past: [0], future: [] };
        const action = { type: 'INCREMENT', step: 3 };
        const newState = reducer(state, action);

        expect(newState.present).toBe(8);
        expect(newState.past).toEqual([0, 5]);
    });
});
```

---

### 📌 3. useContext

#### **Context Structure**

```typescript
// contexts/ThemeContext.tsx
type Theme = 'light' | 'dark';

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    // PERFORMANCE: Memoize value để tránh unnecessary re-renders
    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
        }),
        [theme, toggleTheme]
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

// Custom hook
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
```

#### **Multiple Contexts Pattern**

```typescript
// Compose multiple providers
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <DataProvider>{children}</DataProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
```

---

### 📌 4. Custom Hooks

#### **Extract Reusable Logic**

```typescript
// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.error('Error writing to localStorage:', error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue] as const;
}

// Usage
const [user, setUser] = useLocalStorage('user', { name: '' });
```

#### **Async Data Fetching Hook**

```typescript
function useAsync<T>(asyncFn: () => Promise<T>, dependencies: any[] = []) {
    const [state, setState] = useState<{
        data: T | null;
        loading: boolean;
        error: Error | null;
    }>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        setState({ data: null, loading: true, error: null });

        asyncFn()
            .then((data) => {
                if (isMounted) {
                    setState({ data, loading: false, error: null });
                }
            })
            .catch((error) => {
                if (isMounted) {
                    setState({ data: null, loading: false, error });
                }
            });

        // EDGE CASE: Cleanup để tránh memory leak
        return () => {
            isMounted = false;
        };
    }, dependencies);

    return state;
}

// Usage
const { data, loading, error } = useAsync(
    () => fetch('/api/users').then((r) => r.json()),
    []
);
```

#### **Form Handling Hook**

```typescript
function useForm<T extends Record<string, any>>(initialValues: T) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(
        {}
    );

    const handleChange = useCallback((name: keyof T, value: any) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleBlur = useCallback((name: keyof T) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        reset,
        setErrors,
    };
}
```

---

## ⚡ II. PERFORMANCE OPTIMIZATION

### 📌 1. useMemo

#### **Khi Nào Dùng**

-   Expensive calculations
-   Reference equality matters (dependencies)
-   Preventing unnecessary child re-renders

```typescript
function ExpensiveComponent({ items, filter }: Props) {
    // PERFORMANCE: Memoize expensive filtering
    const filteredItems = useMemo(() => {
        console.log('Filtering items...');
        return items.filter((item) => item.category === filter);
    }, [items, filter]);

    // ❌ BAD: Compute on every render
    // const filteredItems = items.filter(item => item.category === filter);

    return <List items={filteredItems} />;
}
```

#### **Memoize Objects/Arrays**

```typescript
function Parent() {
    const [count, setCount] = useState(0);

    // ❌ BAD: New object every render
    const config = { theme: 'dark', size: 'large' };

    // ✅ GOOD: Memoized object
    const config = useMemo(
        () => ({
            theme: 'dark',
            size: 'large',
        }),
        []
    );

    return <Child config={config} />;
}
```

---

### 📌 2. useCallback

#### **Memoize Functions**

```typescript
function Parent() {
    const [count, setCount] = useState(0);

    // ❌ BAD: New function every render
    const handleClick = () => {
        console.log('Clicked');
    };

    // ✅ GOOD: Memoized function
    const handleClick = useCallback(() => {
        console.log('Clicked');
    }, []);

    // With dependencies
    const handleIncrement = useCallback(() => {
        setCount((prev) => prev + 1);
    }, []); // No dependencies vì dùng functional update

    return <Child onClick={handleClick} />;
}
```

---

### 📌 3. React.memo

#### **Prevent Unnecessary Re-renders**

```typescript
// Child component
type ChildProps = {
    name: string;
    onClick: () => void;
};

const Child = React.memo(({ name, onClick }: ChildProps) => {
    console.log('Child rendered');
    return <button onClick={onClick}>{name}</button>;
});

// Custom comparison
const Child = React.memo(
    ({ name, onClick }: ChildProps) => {
        return <button onClick={onClick}>{name}</button>;
    },
    (prevProps, nextProps) => {
        // Return true nếu props không thay đổi (skip re-render)
        return prevProps.name === nextProps.name;
    }
);
```

---

### 📌 4. Code Splitting & Lazy Loading

```typescript
// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/settings' element={<Settings />} />
            </Routes>
        </Suspense>
    );
}
```

---

## 🔄 III. SIDE EFFECTS

### 📌 1. useEffect

#### **Basic Rules**

```typescript
// ❌ BAD: Missing dependencies
useEffect(() => {
    console.log(count);
}, []); // count should be in deps

// ✅ GOOD: Correct dependencies
useEffect(() => {
    console.log(count);
}, [count]);

// ❌ BAD: Object in dependencies (recreated every render)
useEffect(() => {
    fetchData(config);
}, [config]); // config is object

// ✅ GOOD: Destructure or memoize
useEffect(() => {
    fetchData({ theme, size });
}, [theme, size]);
```

#### **Cleanup Functions**

```typescript
// Subscription cleanup
useEffect(() => {
    const subscription = dataSource.subscribe(handleData);

    // EDGE CASE: Cleanup để tránh memory leak
    return () => {
        subscription.unsubscribe();
    };
}, []);

// Event listener cleanup
useEffect(() => {
    const handleResize = () => {
        setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

// Abort fetch cleanup
useEffect(() => {
    const controller = new AbortController();

    fetch('/api/data', { signal: controller.signal })
        .then((r) => r.json())
        .then(setData)
        .catch((err) => {
            if (err.name !== 'AbortError') {
                console.error(err);
            }
        });

    return () => {
        controller.abort();
    };
}, []);
```

#### **Effect Patterns**

```typescript
// Mount only (componentDidMount)
useEffect(() => {
    console.log('Mounted');
}, []);

// Update only (componentDidUpdate)
const isFirstRender = useRef(true);
useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }
    console.log('Updated');
}, [dependency]);

// Unmount only (componentWillUnmount)
useEffect(() => {
    return () => {
        console.log('Unmounting');
    };
}, []);
```

---

### 📌 2. useLayoutEffect

#### **Khi Nào Dùng**

-   Đo DOM trước khi paint
-   Sync DOM mutations
-   Avoid visual flicker

```typescript
// Measure DOM element
function Tooltip() {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useLayoutEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setPosition({ x: rect.x, y: rect.y });
        }
    }, []);

    return <div ref={ref} style={{ left: position.x, top: position.y }} />;
}
```

---

## 🎣 IV. REF PATTERNS

### 📌 1. useRef

#### **DOM References**

```typescript
function Input() {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <>
            <input ref={inputRef} />
            <button onClick={focusInput}>Focus</button>
        </>
    );
}
```

#### **Mutable Values (không trigger re-render)**

```typescript
function Timer() {
    const intervalRef = useRef<number | null>(null);
    const [count, setCount] = useState(0);

    const startTimer = () => {
        intervalRef.current = window.setInterval(() => {
            setCount((prev) => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        return () => stopTimer();
    }, []);

    return <div>{count}</div>;
}
```

#### **Previous Value Pattern**

```typescript
function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

// Usage
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);
```

---

### 📌 2. useImperativeHandle

```typescript
// Expose custom ref methods
type InputRef = {
    focus: () => void;
    clear: () => void;
};

const CustomInput = forwardRef<InputRef, InputProps>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
        clear: () => {
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        },
    }));

    return <input ref={inputRef} {...props} />;
});

// Usage
const ref = useRef<InputRef>(null);
<CustomInput ref={ref} />;
ref.current?.focus();
```

---

## 🧩 V. COMPONENT PATTERNS

### 📌 1. Compound Components

```typescript
// Tabs.tsx
type TabsContextType = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({ children, defaultTab }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className='tabs'>{children}</div>
        </TabsContext.Provider>
    );
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
    return <div className='tabs__list'>{children}</div>;
};

Tabs.Tab = function Tab({ id, children }: TabProps) {
    const { activeTab, setActiveTab } = useContext(TabsContext)!;
    return (
        <button
            className={`tabs__tab ${
                activeTab === id ? 'tabs__tab--active' : ''
            }`}
            onClick={() => setActiveTab(id)}
        >
            {children}
        </button>
    );
};

Tabs.Panel = function TabPanel({ id, children }: TabPanelProps) {
    const { activeTab } = useContext(TabsContext)!;
    if (activeTab !== id) return null;
    return <div className='tabs__panel'>{children}</div>;
};

// Usage
<Tabs defaultTab='tab1'>
    <Tabs.List>
        <Tabs.Tab id='tab1'>Tab 1</Tabs.Tab>
        <Tabs.Tab id='tab2'>Tab 2</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel id='tab1'>Content 1</Tabs.Panel>
    <Tabs.Panel id='tab2'>Content 2</Tabs.Panel>
</Tabs>;
```

---

### 📌 2. Render Props

```typescript
type MouseTrackerProps = {
    render: (position: { x: number; y: number }) => ReactNode;
};

function MouseTracker({ render }: MouseTrackerProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return <>{render(position)}</>;
}

// Usage
<MouseTracker
    render={({ x, y }) => (
        <div>
            Mouse at: {x}, {y}
        </div>
    )}
/>;
```

---

### 📌 3. Higher-Order Components (HOC)

```typescript
// withAuth HOC
function withAuth<P extends object>(Component: ComponentType<P>) {
    return function AuthenticatedComponent(props: P) {
        const { user, loading } = useAuth();

        if (loading) return <Spinner />;
        if (!user) return <Navigate to='/login' />;

        return <Component {...props} />;
    };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

---

### 📌 4. Container/Presenter Pattern

```typescript
// UserListContainer.tsx (Logic)
function UserListContainer() {
    const { data, loading, error } = useAsync(fetchUsers);
    const [filter, setFilter] = useState('');

    const filteredUsers = useMemo(() => {
        if (!data) return [];
        return data.filter((user) =>
            user.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [data, filter]);

    return (
        <UserListPresenter
            users={filteredUsers}
            loading={loading}
            error={error}
            filter={filter}
            onFilterChange={setFilter}
        />
    );
}

// UserListPresenter.tsx (UI)
type PresenterProps = {
    users: User[];
    loading: boolean;
    error: Error | null;
    filter: string;
    onFilterChange: (value: string) => void;
};

function UserListPresenter({
    users,
    loading,
    error,
    filter,
    onFilterChange,
}: PresenterProps) {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div className='user-list'>
            <input
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder='Search users...'
            />
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}
```

---

## 🎨 VI. STYLING APPROACHES

### 📌 1. BEM Convention

```typescript
function Button({ variant, size, disabled }: ButtonProps) {
    const className = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        disabled && 'button--disabled',
    ]
        .filter(Boolean)
        .join(' ');

    return <button className={className}>Click me</button>;
}
```

### 📌 2. CSS Modules

```typescript
import styles from './Button.module.css';

function Button() {
    return <button className={styles.button}>Click me</button>;
}
```

### 📌 3. Styled Components (Optional)

```typescript
import styled from 'styled-components';

const StyledButton = styled.button<{ variant: string }>`
    padding: 8px 16px;
    background: ${(props) => (props.variant === 'primary' ? 'blue' : 'gray')};

    &:hover {
        opacity: 0.8;
    }
`;
```

### 📌 4. Tailwind CSS

```typescript
function Button({ variant }: ButtonProps) {
    const baseClasses = 'px-4 py-2 rounded font-semibold';
    const variantClasses =
        variant === 'primary'
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

    return (
        <button className={`${baseClasses} ${variantClasses}`}>Click me</button>
    );
}
```

---

## 🧪 VII. TESTING

### 📌 1. Component Testing

```typescript
describe('Counter', () => {
    test('should increment on button click', () => {
        render(<Counter />);
        const button = screen.getByRole('button', { name: /increment/i });
        const count = screen.getByText('0');

        fireEvent.click(button);

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should handle multiple increments', () => {
        render(<Counter />);
        const button = screen.getByRole('button', { name: /increment/i });

        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);

        expect(screen.getByText('3')).toBeInTheDocument();
    });
});
```

### 📌 2. Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
    test('should increment', () => {
        const { result } = renderHook(() => useCounter(0));

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(1);
    });
});
```

### 📌 3. Async Testing

```typescript
test('should load and display data', async () => {
    render(<UserList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    const users = await screen.findByText('John Doe');
    expect(users).toBeInTheDocument();
});
```

### 📌 4. Mock Testing

```typescript
// Mock API
jest.mock('../api/users', () => ({
    fetchUsers: jest.fn(() => Promise.resolve([{ id: 1, name: 'John' }])),
}));

test('should fetch users on mount', async () => {
    render(<UserList />);

    await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument();
    });

    expect(fetchUsers).toHaveBeenCalledTimes(1);
});
```

---

## 📝 VIII. TYPESCRIPT PATTERNS

### 📌 1. Component Props

```typescript
// Basic props
type ButtonProps = {
    children: ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
};

// Extending HTML props
type InputProps = {
    label: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

// Generic component
type ListProps<T> = {
    items: T[];
    renderItem: (item: T) => ReactNode;
    keyExtractor: (item: T) => string;
};

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
    return (
        <ul>
            {items.map((item) => (
                <li key={keyExtractor(item)}>{renderItem(item)}</li>
            ))}
        </ul>
    );
}
```

### 📌 2. Event Types

```typescript
const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {};
const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {};
const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {};
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {};
```

### 📌 3. Ref Types

```typescript
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const timeoutRef = useRef<number | null>(null);
```

---

## 🎯 IX. ADVANCED PATTERNS

### 📌 1. Error Boundaries

```typescript
type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};

class ErrorBoundary extends Component<
    { children: ReactNode },
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = {
        hasError: false,
        error: null,
    };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

// Usage
<ErrorBoundary>
    <App />
</ErrorBoundary>;
```

### 📌 2. Portal

```typescript
function Modal({ children, isOpen }: ModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className='modal'>
            <div className='modal__backdrop' />
            <div className='modal__content'>{children}</div>
        </div>,
        document.getElementById('modal-root')!
    );
}
```

### 📌 3. Suspense & Concurrent Features

```typescript
// Data fetching with Suspense
const resource = fetchData();

function UserProfile() {
    const user = resource.read(); // Suspend khi loading
    return <div>{user.name}</div>;
}

// Usage
<Suspense fallback={<Spinner />}>
    <UserProfile />
</Suspense>;

// useTransition
function SearchResults() {
    const [query, setQuery] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSearch = (value: string) => {
        startTransition(() => {
            setQuery(value); // Low priority update
        });
    };

    return (
        <>
            <input onChange={(e) => handleSearch(e.target.value)} />
            {isPending && <Spinner />}
            <Results query={query} />
        </>
    );
}
```

---

## 🚀 X. ROUTING (React Router)

### 📌 1. Basic Setup

```typescript
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to='/'>Home</Link>
                <Link to='/about'>About</Link>
                <Link to='/users'>Users</Link>
            </nav>

            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/users' element={<Users />} />
                <Route path='/users/:id' element={<UserDetail />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
```

---

### 📌 2. Nested Routes

```typescript
function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='about' element={<About />} />

                <Route path='dashboard' element={<Dashboard />}>
                    <Route index element={<DashboardHome />} />
                    <Route path='analytics' element={<Analytics />} />
                    <Route path='settings' element={<Settings />} />
                </Route>
            </Route>
        </Routes>
    );
}

// Layout component
function Layout() {
    return (
        <div>
            <header>Header</header>
            <main>
                <Outlet /> {/* Nested routes render here */}
            </main>
            <footer>Footer</footer>
        </div>
    );
}
```

---

### 📌 3. Dynamic Routes & Params

```typescript
import { useParams, useSearchParams } from 'react-router-dom';

function UserDetail() {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    const tab = searchParams.get('tab') || 'profile';

    return (
        <div>
            <h1>User {id}</h1>
            <nav>
                <button onClick={() => setSearchParams({ tab: 'profile' })}>
                    Profile
                </button>
                <button onClick={() => setSearchParams({ tab: 'posts' })}>
                    Posts
                </button>
            </nav>
            {tab === 'profile' && <UserProfile userId={id!} />}
            {tab === 'posts' && <UserPosts userId={id!} />}
        </div>
    );
}
```

---

### 📌 4. Protected Routes

```typescript
type ProtectedRouteProps = {
    children: ReactElement;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return children;
}

// Usage
<Routes>
    <Route path='/login' element={<Login />} />
    <Route
        path='/dashboard'
        element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
    />
</Routes>;
```

---

### 📌 5. Navigation Hooks

```typescript
import { useNavigate, useLocation } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleLogin = async (credentials: Credentials) => {
        await login(credentials);
        navigate(from, { replace: true });
    };

    return <form onSubmit={handleLogin}>...</form>;
}

// Programmatic navigation
function ProductList() {
    const navigate = useNavigate();

    const handleProductClick = (productId: string) => {
        navigate(`/products/${productId}`, {
            state: { from: 'list' },
        });
    };

    return <div>...</div>;
}
```

---

### 📌 6. Route Loaders (v6.4+)

```typescript
import {
    createBrowserRouter,
    RouterProvider,
    useLoaderData,
} from 'react-router-dom';

// Define loader
async function userLoader({ params }: LoaderFunctionArgs) {
    const user = await fetchUser(params.id!);
    if (!user) {
        throw new Response('Not Found', { status: 404 });
    }
    return user;
}

// Create router with loaders
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: 'users/:id',
                element: <UserDetail />,
                loader: userLoader,
                errorElement: <ErrorPage />,
            },
        ],
    },
]);

// Component using loader data
function UserDetail() {
    const user = useLoaderData() as User;

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}

// App
function App() {
    return <RouterProvider router={router} />;
}
```

---

## 📦 XI. FORM HANDLING

### 📌 1. Controlled Components

```typescript
type FormData = {
    username: string;
    email: string;
    password: string;
};

function RegistrationForm() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof FormData, string>>
    >({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error khi user đang typing
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.includes('@')) {
            newErrors.email = 'Invalid email';
        }

        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await registerUser(formData);
            // Success handling
        } catch (error) {
            // Error handling
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && (
                    <span className='error'>{errors.username}</span>
                )}
            </div>

            <div>
                <label>Email</label>
                <input
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <span className='error'>{errors.email}</span>}
            </div>

            <div>
                <label>Password</label>
                <input
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && (
                    <span className='error'>{errors.password}</span>
                )}
            </div>

            <button type='submit'>Register</button>
        </form>
    );
}
```

---

### 📌 2. Uncontrolled Components with Refs

```typescript
function UncontrolledForm() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const formData = {
            username: usernameRef.current?.value,
            email: emailRef.current?.value,
        };

        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input ref={usernameRef} name='username' />
            <input ref={emailRef} name='email' type='email' />
            <button type='submit'>Submit</button>
        </form>
    );
}
```

---

### 📌 3. Form with File Upload

```typescript
function FileUploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', 'My file');

        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type='file' accept='image/*' onChange={handleFileChange} />
            {preview && <img src={preview} alt='Preview' />}
            <button type='submit' disabled={!file}>
                Upload
            </button>
        </form>
    );
}
```

---

### 📌 4. Multi-Step Form

```typescript
type Step1Data = { name: string; email: string };
type Step2Data = { address: string; city: string };
type Step3Data = { cardNumber: string };

type FormData = Step1Data & Step2Data & Step3Data;

function MultiStepForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<FormData>>({});

    const updateFormData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        try {
            await submitForm(formData as FormData);
        } catch (error) {
            console.error('Submission failed:', error);
        }
    };

    return (
        <div>
            {/* Progress indicator */}
            <div className='progress'>Step {step} of 3</div>

            {/* Steps */}
            {step === 1 && (
                <Step1
                    data={formData}
                    onNext={(data) => {
                        updateFormData(data);
                        nextStep();
                    }}
                />
            )}

            {step === 2 && (
                <Step2
                    data={formData}
                    onNext={(data) => {
                        updateFormData(data);
                        nextStep();
                    }}
                    onBack={prevStep}
                />
            )}

            {step === 3 && (
                <Step3
                    data={formData}
                    onSubmit={(data) => {
                        updateFormData(data);
                        handleSubmit();
                    }}
                    onBack={prevStep}
                />
            )}
        </div>
    );
}

// Step components
function Step1({ data, onNext }: Step1Props) {
    const [formData, setFormData] = useState<Step1Data>({
        name: data.name || '',
        email: data.email || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onNext(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={formData.name}
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                placeholder='Name'
            />
            <input
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                placeholder='Email'
                type='email'
            />
            <button type='submit'>Next</button>
        </form>
    );
}
```

---

## 🌐 XII. DATA FETCHING

### 📌 1. Fetch với useState & useEffect

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchUsers() {
            try {
                setLoading(true);
                const response = await fetch('/api/users', {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();

        // EDGE CASE: Cleanup để cancel request khi unmount
        return () => {
            controller.abort();
        };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
```

---

### 📌 2. Custom Fetch Hook

```typescript
type UseFetchResult<T> = {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
};

function useFetch<T>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    const refetch = useCallback(() => {
        setRefetchIndex((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(url, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();
                setData(json);
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url, refetchIndex]);

    return { data, loading, error, refetch };
}

// Usage
function Users() {
    const { data, loading, error, refetch } = useFetch<User[]>('/api/users');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <button onClick={refetch}>Refresh</button>
            <ul>
                {data?.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}
```

---

### 📌 3. Pagination

```typescript
type PaginationState = {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
};

function usePagination<T>(
    fetchFn: (
        page: number,
        pageSize: number
    ) => Promise<{
        items: T[];
        totalPages: number;
        totalItems: number;
    }>,
    initialPageSize = 10
) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        pageSize: initialPageSize,
        totalPages: 0,
        totalItems: 0,
    });

    const fetchPage = useCallback(
        async (page: number) => {
            try {
                setLoading(true);
                const result = await fetchFn(page, pagination.pageSize);

                setItems(result.items);
                setPagination((prev) => ({
                    ...prev,
                    page,
                    totalPages: result.totalPages,
                    totalItems: result.totalItems,
                }));
            } catch (error) {
                console.error('Fetch failed:', error);
            } finally {
                setLoading(false);
            }
        },
        [fetchFn, pagination.pageSize]
    );

    useEffect(() => {
        fetchPage(1);
    }, [fetchPage]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchPage(page);
        }
    };

    const nextPage = () => goToPage(pagination.page + 1);
    const prevPage = () => goToPage(pagination.page - 1);

    return {
        items,
        loading,
        pagination,
        goToPage,
        nextPage,
        prevPage,
    };
}

// Usage
function ProductList() {
    const { items, loading, pagination, nextPage, prevPage } = usePagination(
        async (page, pageSize) => {
            const response = await fetch(
                `/api/products?page=${page}&pageSize=${pageSize}`
            );
            return response.json();
        }
    );

    return (
        <div>
            {loading && <div>Loading...</div>}

            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>

            <div className='pagination'>
                <button onClick={prevPage} disabled={pagination.page === 1}>
                    Previous
                </button>
                <span>
                    Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                    onClick={nextPage}
                    disabled={pagination.page === pagination.totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
```

---

### 📌 4. Infinite Scroll

```typescript
function useInfiniteScroll<T>(
    fetchFn: (page: number) => Promise<T[]>,
    options = { threshold: 0.8 }
) {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            const newItems = await fetchFn(page);

            if (newItems.length === 0) {
                setHasMore(false);
            } else {
                setItems((prev) => [...prev, ...newItems]);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Load more failed:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, page, loading, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: options.threshold }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [loadMore, options.threshold]);

    return { items, loading, hasMore, loaderRef };
}

// Usage
function InfiniteList() {
    const { items, loading, hasMore, loaderRef } = useInfiniteScroll(
        async (page) => {
            const response = await fetch(`/api/items?page=${page}`);
            return response.json();
        }
    );

    return (
        <div>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>

            {hasMore && (
                <div ref={loaderRef}>
                    {loading ? 'Loading...' : 'Load more'}
                </div>
            )}
        </div>
    );
}
```

---

### 📌 5. Optimistic Updates

```typescript
function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = async (text: string) => {
        // Temporary ID cho optimistic update
        const tempId = `temp-${Date.now()}`;
        const newTodo: Todo = {
            id: tempId,
            text,
            completed: false,
        };

        // OPTIMISTIC: Update UI ngay lập tức
        setTodos((prev) => [...prev, newTodo]);

        try {
            // Gọi API
            const response = await fetch('/api/todos', {
                method: 'POST',
                body: JSON.stringify({ text }),
                headers: { 'Content-Type': 'application/json' },
            });

            const savedTodo = await response.json();

            // Replace temp todo với real todo
            setTodos((prev) =>
                prev.map((todo) => (todo.id === tempId ? savedTodo : todo))
            );
        } catch (error) {
            // ROLLBACK: Remove temp todo nếu fail
            setTodos((prev) => prev.filter((todo) => todo.id !== tempId));
            console.error('Failed to add todo:', error);
        }
    };

    const toggleTodo = async (id: string) => {
        // OPTIMISTIC: Toggle ngay
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );

        try {
            await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' });
        } catch (error) {
            // ROLLBACK: Toggle lại nếu fail
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            );
            console.error('Failed to toggle todo:', error);
        }
    };

    return (
        <div>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <input
                            type='checkbox'
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

---

## 🎨 XIII. ANIMATIONS

### 📌 1. CSS Transitions

```typescript
function FadeIn({ children }: { children: ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
            }}
        >
            {children}
        </div>
    );
}
```

---

### 📌 2. Conditional Rendering với Animation

```typescript
function Modal({ isOpen, onClose, children }: ModalProps) {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        }
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) {
            setShouldRender(false);
        }
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`modal ${isOpen ? 'modal--open' : 'modal--closed'}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className='modal__backdrop' onClick={onClose} />
            <div className='modal__content'>{children}</div>
        </div>
    );
}

// CSS
// .modal--open { animation: fadeIn 0.3s; }
// .modal--closed { animation: fadeOut 0.3s; }
```

---

### 📌 3. List Animations

```typescript
function AnimatedList({ items }: { items: Item[] }) {
    return (
        <ul>
            {items.map((item, index) => (
                <li
                    key={item.id}
                    style={{
                        animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
                    }}
                >
                    {item.name}
                </li>
            ))}
        </ul>
    );
}

// CSS
// @keyframes slideIn {
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
```

---

## 🎯 XIV. ACCESSIBILITY (A11Y)

### 📌 1. Keyboard Navigation

```typescript
function Dropdown({ items, onSelect }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < items.length - 1 ? prev + 1 : prev
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;

            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    onSelect(items[selectedIndex]);
                    setIsOpen(false);
                }
                break;

            case 'Escape':
                setIsOpen(false);
                buttonRef.current?.focus();
                break;
        }
    };

    return (
        <div onKeyDown={handleKeyDown}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup='listbox'
                aria-expanded={isOpen}
            >
                Select Item
            </button>

            {isOpen && (
                <ul role='listbox' tabIndex={-1}>
                    {items.map((item, index) => (
                        <li
                            key={item.id}
                            role='option'
                            aria-selected={index === selectedIndex}
                            onClick={() => {
                                onSelect(item);
                                setIsOpen(false);
                            }}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

---

### 📌 2. Focus Management

```typescript
function Dialog({ isOpen, onClose, children }: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Save current focus
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Focus dialog
            dialogRef.current?.focus();

            // Trap focus
            const handleTab = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;

                const focusableElements = dialogRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                if (!focusableElements || focusableElements.length === 0)
                    return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[
                    focusableElements.length - 1
                ] as HTMLElement;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleTab);

            return () => {
                document.removeEventListener('keydown', handleTab);

                // Restore focus
                previousFocusRef.current?.focus();
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div ref={dialogRef} role='dialog' aria-modal='true' tabIndex={-1}>
            <button onClick={onClose} aria-label='Close dialog'>
                ×
            </button>
            {children}
        </div>
    );
}
```

---

### 📌 3. ARIA Labels & Roles

```typescript
function SearchInput() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div role='search'>
            <label htmlFor='search-input'>Search</label>
            <input
                id='search-input'
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label='Search'
                aria-describedby='search-instructions'
                aria-busy={isLoading}
            />

            <div id='search-instructions' className='sr-only'>
                Type to search. Results will appear below.
            </div>

            {results.length > 0 && (
                <ul role='list' aria-label='Search results'>
                    {results.map((result, index) => (
                        <li key={index}>{result}</li>
                    ))}
                </ul>
            )}

            {isLoading && (
                <div role='status' aria-live='polite'>
                    Loading results...
                </div>
            )}
        </div>
    );
}
```

---

## 🔍 XV. DEBUGGING & DEV TOOLS

### 📌 1. Custom DevTools Hook

```typescript
function useDebug(componentName: string, props: any) {
    useEffect(() => {
        console.group(`${componentName} - Props`);
        console.log(props);
        console.groupEnd();
    }, [componentName, props]);

    useEffect(() => {
        console.log(`${componentName} mounted`);

        return () => {
            console.log(`${componentName} unmounted`);
        };
    }, [componentName]);
}

// Usage
function MyComponent(props: Props) {
    useDebug('MyComponent', props);

    return <div>...</div>;
}
```

---

### 📌 2. Why Did You Render Hook

```typescript
function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
    const previousProps = useRef<Record<string, any>>();

    useEffect(() => {
        if (previousProps.current) {
            const allKeys = Object.keys({ ...previousProps.current, ...props });
            const changedProps: Record<string, any> = {};

            allKeys.forEach((key) => {
                if (previousProps.current![key] !== props[key]) {
                    changedProps[key] = {
                        from: previousProps.current![key],
                        to: props[key],
                    };
                }
            });

            if (Object.keys(changedProps).length > 0) {
                console.log('[why-did-you-update]', name, changedProps);
            }
        }

        previousProps.current = props;
    });
}
```

---

### 📌 3. Performance Profiling

```typescript
function useProfiler(componentName: string) {
    const renderCount = useRef(0);
    const renderTime = useRef(0);

    useEffect(() => {
        renderCount.current += 1;
    });

    useEffect(() => {
        const start = performance.now();

        return () => {
            const end = performance.now();
            renderTime.current = end - start;

            console.log(`${componentName} Render #${renderCount.current}:`, {
                time: `${renderTime.current.toFixed(2)}ms`,
            });
        };
    });
}
```

---

## 🏁 XVI. TÓM TẮT BEST PRACTICES

### ✅ NÊN LÀM (DO's)

1. **Quản Lý State**

    - Nhóm các state có liên quan
    - Dùng functional updates khi cần giá trị state trước đó
    - Tránh lưu derived state
    - Memoize các phép tính tốn tài nguyên

2. **Hiệu Năng**

    - Dùng React.memo cho các component nặng
    - Memoize callback bằng useCallback
    - Memoize giá trị bằng useMemo
    - Tách code (code splitting) cho ứng dụng lớn

3. **Effects**

    - Luôn cleanup side effects
    - Khai báo đúng dependencies
    - Tách mối quan tâm (dùng nhiều useEffect)
    - Dùng useLayoutEffect cho đo đạc DOM

4. **Components**

    - Giữ component nhỏ gọn, tập trung một nhiệm vụ
    - Tách logic tái sử dụng vào custom hooks
    - Dùng compound components cho UI liên quan
    - Khai báo kiểu TypeScript đầy đủ, chính xác

5. **Forms**

    - Validate khi blur
    - Xóa lỗi khi giá trị thay đổi
    - Cung cấp thông báo lỗi rõ ràng, hữu ích
    - Disable submit khi form không hợp lệ

6. **Khả Năng Truy Cập (Accessibility)**

    - Dùng Semantic HTML
    - Thêm ARIA labels khi cần
    - Hỗ trợ điều hướng bằng bàn phím
    - Quản lý focus hợp lý

---

### ❌ KHÔNG NÊN LÀM (DON'Ts)

1. **Quản Lý State**

    - ❌ Không lưu derived state
    - ❌ Không mutate state trực tiếp
    - ❌ Không lạm dụng useState

2. **Hiệu Năng**

    - ❌ Không tối ưu quá sớm (premature optimization)
    - ❌ Không memoize mọi thứ
    - ❌ Không tạo object/array trực tiếp trong JSX

3. **Effects**

    - ❌ Không bỏ qua dependencies
    - ❌ Không gọi setState trực tiếp trong render
    - ❌ Không fetch data trong useLayoutEffect

4. **Components**

    - ❌ Không tạo component quá lớn
    - ❌ Không prop drilling quá sâu
    - ❌ Không dùng inline functions trong JSX (nếu component nhạy cảm về hiệu năng)

---

## 📚 XVII. COMMON PATTERNS CHEAT SHEET

```typescript
// 1. Conditional Rendering
{condition && <Component />}
{condition ? <A /> : <B />}

// 2. List Rendering
{items.map(item => <Item key={item.id} {...item} />)}

// 3. Event Handling
<button onClick={handleClick}>Click</button>
<input onChange={e => setValue(e.target.value)} />

// 4. Controlled Input
<input value={value} onChange={e => setValue(e.target.value)} />

// 5. Refs
const ref = useRef<HTMLDivElement>(null);
<div ref={ref} />

// 6. Context
const value = useContext(MyContext);

// 7. Custom Hook
function useCustom() {
  const [state, setState] = useState();
  return { state, setState };
}

// 8. Memoization
const value = useMemo(() => expensive(), [dep]);
const fn = useCallback(() => {}, [dep]);

// 9. Effect
useEffect(() => {
  // side effect
  return () => {
    // cleanup
  };
}, [dependencies]);

// 10. Lazy Loading
const Component = lazy(() => import('./Component'));
<Suspense fallback={<Loading />}>
  <Component />
</Suspense>
```

---

## 🎓 XVIII. MẸO PHỎNG VẤN

### Câu Hỏi Thường Gặp

1. **Virtual DOM là gì?**

    - Bản sao nhẹ của DOM thật
    - React so sánh các thay đổi trên Virtual DOM
    - Gộp (batch) các cập nhật để tối ưu hiệu năng

2. **Reconciliation là gì?**

    - Quá trình React cập nhật DOM
    - Thuật toán so sánh (diffing)
    - Keys rất quan trọng khi render danh sách

3. **useState vs useReducer?**

    - useState: state đơn giản
    - useReducer: logic state phức tạp, nhiều cập nhật liên quan

4. **useEffect vs useLayoutEffect?**

    - useEffect: chạy sau khi render ra màn hình (bất đồng bộ)
    - useLayoutEffect: chạy trước khi render (đồng bộ, chặn render)

5. **Làm sao để tối ưu ứng dụng React?**

    - React.memo, useMemo, useCallback
    - Tách code (code splitting)
    - Tải lười (lazy loading)
    - Virtualization cho danh sách dài

6. **Context vs Redux?**

    - Context: có sẵn trong React, chia sẻ state đơn giản
    - Redux: mạnh mẽ, dễ dự đoán, có DevTools, middleware

7. **Controlled vs Uncontrolled?**

    - Controlled: input được điều khiển bởi state của React
    - Uncontrolled: DOM tự quản lý state

8. **Keys trong danh sách?**

    - Giúp React xác định từng phần tử
    - Phải ổn định và duy nhất
    - Không dùng index nếu danh sách có thay đổi thứ tự

---

**Workflow này bao phủm toàn bộ kiến thức ReactJS từ Basic đến Advanced/Senior level.**

Các chủ đề đã cover:

-   ✅ State Management (useState, useReducer, Context)
-   ✅ Performance (useMemo, useCallback, React.memo)
-   ✅ Side Effects (useEffect, useLayoutEffect)
-   ✅ Refs (useRef, useImperativeHandle)
-   ✅ Component Patterns (Compound, Render Props, HOC)
-   ✅ Routing (React Router)
-   ✅ Forms (Controlled, Multi-step, File upload)
-   ✅ Data Fetching (Custom hooks, Pagination, Infinite scroll)
-   ✅ Animations
-   ✅ Accessibility
-   ✅ TypeScript Patterns
-   ✅ Testing
-   ✅ Debugging
-   ✅ Best Practices
-   ✅ Interview Prep

**Áp dụng workflow này cho React để đảm bảo code quality cao nhất!** 🚀
