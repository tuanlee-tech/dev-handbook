
# TypeScript với React

## Mục lục
1. [TypeScript Cơ bản](#typescript-cơ-bản)
2. [TypeScript với React Components](#typescript-với-react-components)
3. [Quản lý State Thông minh](#quản-lý-state-thông-minh)
4. [TypeScript Nâng cao](#typescript-nâng-cao)
5. [Best Practices](#best-practices)



## TypeScript Cơ bản

### Type Annotations vs Type Inference

**Type Annotations** - khai báo kiểu tường minh:
```typescript
let username: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
```

**Type Inference** - TypeScript tự suy luận kiểu:
```typescript
let message = "Hello"; // TypeScript tự hiểu đây là string
let count = 42; // TypeScript tự hiểu đây là number
```

### Union Types và Any

**Union Types** - cho phép nhiều kiểu cụ thể:
```typescript
type ID = string | number;

function printId(id: ID): void {
  console.log(`Your ID is: ${id}`);
}

printId(12345);     // ✅ Hợp lệ
printId("abc123");  // ✅ Hợp lệ
```

**Any Type** - linh hoạt nhưng nguy hiểm:
```typescript
// ❌ Tránh dùng any
function combineValues(value: any) {
  return value + 10; // Có thể gây lỗi runtime
}

// ✅ Dùng unknown thay thế
function processValue(input: unknown): string {
  if (typeof input === 'string') {
    return `String: ${input}`;
  }
  if (typeof input === 'number') {
    return `Number: ${input}`;
  }
  return 'Unknown type';
}
```

### Objects và Arrays

**Định nghĩa object types**:
```typescript
// Cách 1: Inline type
let car: { model: string; year: number } = {
  model: 'Toyota',
  year: 2024
};

// Cách 2: Type alias (khuyên dùng)
type Car = {
  model: string;
  year: number;
  color?: string; // Optional property
};

let myCar: Car = { model: 'Honda', year: 2023 };
```

**Array với type checking**:
```typescript
let vegetables: { name: string; price?: number }[] = [
  { name: 'Tomato', price: 2 },
  { name: 'Carrot' } // price là optional
];
```

**Readonly modifier**:
```typescript
let products: readonly { name: string; price: number }[] = [
  { name: 'Laptop', price: 1000 }
];

// products.push(...) // ❌ Lỗi - không thể thay đổi
// products[0].price = 500 // ❌ Lỗi - readonly
```

### Functions

**Định nghĩa tham số và return type**:
```typescript
// Explicit return type
function calculatePrice(price: number, discount: number = 0): number {
  return price - discount;
}

// Optional parameters
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}

// Rest parameters
function sumNumbers(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}
```

**Object parameters với destructuring**:
```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

function createUser({ id, name }: User): { id: number; isActive: boolean } {
  return { id, isActive: id % 2 === 0 };
}
```

---

## TypeScript với React Components

### Component Props với TypeScript

**Functional Component cơ bản**:
```tsx
interface UserCardProps {
  name: string;
  age: number;
  email?: string; // Optional
  onEdit?: () => void; // Optional callback
}

const UserCard: React.FC<UserCardProps> = ({ name, age, email, onEdit }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
      {onEdit && <button onClick={onEdit}>Edit</button>}
    </div>
  );
};
```

**Props với children**:
```tsx
interface ContainerProps {
  title: string;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  );
};
```

### Event Handlers

**Typing events đúng cách**:
```tsx
interface FormProps {
  onSubmit: (data: { username: string; password: string }) => void;
}

const LoginForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleInputChange} />
      <input name="password" type="password" onChange={handleInputChange} />
      <button type="submit">Login</button>
    </form>
  );
};
```

### Hooks với TypeScript

**useState**:
```tsx
// Primitive types - TypeScript tự infer
const [count, setCount] = useState(0);
const [name, setName] = useState("");

// Complex types - cần explicit type
interface User {
  id: number;
  name: string;
}

const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);
```

**useEffect**:
```tsx
useEffect(() => {
  const fetchUser = async () => {
    const response = await fetch(`/api/users/${userId}`);
    const data: User = await response.json();
    setUser(data);
  };

  fetchUser();
}, [userId]);
```

**useRef**:
```tsx
// DOM element ref
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

// Mutable value ref
const timerRef = useRef<NodeJS.Timeout | null>(null);

const startTimer = () => {
  timerRef.current = setInterval(() => {
    console.log('tick');
  }, 1000);
};
```

**Custom Hooks**:
```tsx
interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
}

function useUser(userId: string): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
```

---

## Quản lý State Thông minh

### Derived State - Không lạm dụng useState

**❌ Anti-pattern: Lưu derived values trong state**:
```tsx
const DetailForm = ({ email }: { email: string }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // ❌ Không nên - fullName được tính từ firstName và lastName
  const [fullName, setFullName] = useState("");
  
  // ❌ Cần useEffect để sync - gây thêm re-renders
  useEffect(() => {
    setFullName(`${firstName} ${lastName}`.trim());
  }, [firstName, lastName]);
  
  // ❌ Duplicate email prop trong state
  const [localEmail, setLocalEmail] = useState(email);
  
  useEffect(() => {
    setLocalEmail(email);
  }, [email]);
};
```

**✅ Best practice: Derive trực tiếp**:
```tsx
const DetailForm = ({ email }: { email: string }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  
  // ✅ Derive trực tiếp - không cần useState
  const fullName = `${firstName} ${lastName}`.trim();
  const isAdult = age > 18;
  
  // ✅ Dùng prop trực tiếp - không cần local state
  // email đã có sẵn từ props
  
  return (
    <div>
      <p>Full name: {fullName}</p>
      <p>Email: {email}</p>
      <p>{isAdult ? "Adult" : "Minor"}</p>
    </div>
  );
};
```

### Derived State từ URL Parameters

**❌ Anti-pattern: Sync URL với useState**:
```tsx
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  
  // ❌ useEffect để sync - nhiều re-renders
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update state
    setSearchParams({ search: query }); // Update URL
    // 2 lần re-render!
  };
};
```

**✅ Best practice: Derive từ URL**:
```tsx
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ✅ Derive trực tiếp từ URL
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  
  const updateFilter = (key: string, value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      return params;
    });
    // Chỉ 1 lần re-render!
  };
  
  return (
    <input 
      value={searchQuery}
      onChange={(e) => updateFilter("search", e.target.value)}
    />
  );
};
```

### Derived State từ React Query

**❌ Anti-pattern: Duplicate React Query state**:
```tsx
const UserDetail = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  });
  
  // ❌ Không cần - data đã có từ React Query
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  
  // ❌ useEffect để sync - gây thêm re-renders
  useEffect(() => {
    setUser(data);
    setLoading(isLoading);
  }, [data, isLoading]);
};
```

**✅ Best practice: Dùng React Query trực tiếp**:
```tsx
const UserDetail = () => {
  const { 
    data: user, 
    isLoading: loading, 
    error 
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  });
  
  // ✅ Dùng trực tiếp - không cần local state
  if (error) return <div>Error!</div>;
  if (loading) return <div>Loading...</div>;
  if (user) return <div>{user.name}</div>;
  
  return null;
};
```

### Khi nào NÊN dùng useState

**1. Controlled Inputs**:
```tsx
const Form = () => {
  // ✅ Cần useState cho controlled input
  const [username, setUsername] = useState("");
  
  return (
    <input 
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  );
};
```

**2. Independent State Changes**:
```tsx
const Modal = () => {
  // ✅ State độc lập, không derive từ đâu
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <ModalContent onClose={() => setIsOpen(false)} />}
    </>
  );
};
```

### Tối ưu với useMemo

**Khi tính toán expensive**:
```tsx
const ProductList = () => {
  const { data: products } = useQuery(['products']);
  const { data: categories } = useQuery(['categories']);
  
  // ✅ useMemo cho expensive calculation
  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      // Complex filtering logic
      return someExpensiveOperation(product);
    });
  }, [products]); // Chỉ tính lại khi products thay đổi
  
  return <ProductGrid products={filteredProducts} />;
};
```

---

## TypeScript Nâng cao

### Type Aliases vs Interfaces

**Type Aliases**:
```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

// Union types - chỉ type alias làm được
type Status = "pending" | "success" | "error";

// Intersection types
type Admin = User & { role: "admin"; permissions: string[] };
```

**Interfaces**:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Extending interfaces
interface Admin extends User {
  role: "admin";
  permissions: string[];
}

// Declaration merging - chỉ interface làm được
interface Window {
  customProperty: string;
}
```

**Khi nào dùng gì?**
- **Type Alias**: Union types, intersection types, tuple types
- **Interface**: Định nghĩa object shapes, cần extend, declaration merging

### Generics

**Basic Generics**:
```typescript
function identity<T>(value: T): T {
  return value;
}

const result1 = identity<string>("hello"); // string
const result2 = identity<number>(42);      // number
```

**Generics với React Components**:
```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Sử dụng
interface User {
  id: number;
  name: string;
}

<List<User>
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
/>
```

**Generic Constraints**:
```typescript
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// T phải có property 'id'
```

**Utility Types phổ biến**:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - tất cả properties thành optional
type PartialUser = Partial<User>;

// Pick - chọn một số properties
type UserPreview = Pick<User, "id" | "name">;

// Omit - loại bỏ một số properties
type UserWithoutPassword = Omit<User, "password">;

// Required - tất cả properties thành required
type RequiredUser = Required<PartialUser>;

// Readonly - tất cả properties thành readonly
type ImmutableUser = Readonly<User>;

// Record - tạo object type với key và value type
type UserRoles = Record<string, "admin" | "user" | "guest">;
```

### Enums và Literal Types

**Enums**:
```typescript
enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED"
}

function updateOrderStatus(orderId: number, status: OrderStatus) {
  console.log(`Order ${orderId} is now ${status}`);
}

updateOrderStatus(123, OrderStatus.Shipped);
```

**Literal Types (thường tốt hơn Enums)**:
```typescript
type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

// Với const object
const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered"
} as const;

type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
```

### Type Guards

**typeof guards**:
```typescript
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript biết đây là string
  }
  return value.toFixed(2); // TypeScript biết đây là number
}
```

**instanceof guards**:
```typescript
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript biết đây là Dog
  } else {
    animal.meow(); // TypeScript biết đây là Cat
  }
}
```

**Custom type guards**:
```typescript
interface User {
  type: "user";
  name: string;
}

interface Admin {
  type: "admin";
  name: string;
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return user.type === "admin";
}

function greet(user: User | Admin) {
  if (isAdmin(user)) {
    console.log(`Admin ${user.name} with ${user.permissions.length} permissions`);
  } else {
    console.log(`User ${user.name}`);
  }
}
```

---

## Best Practices

### 1. Tránh lạm dụng `any`

```typescript
// ❌ Bad
function process(data: any) {
  return data.value;
}

// ✅ Good - dùng unknown và type guard
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}

// ✅ Better - dùng generics
function process<T extends { value: string }>(data: T) {
  return data.value;
}
```

### 2. Prefer Type Inference

```typescript
// ❌ Verbose
const numbers: number[] = [1, 2, 3];
const user: User = { id: 1, name: "Alice" };

// ✅ Concise - TypeScript tự infer
const numbers = [1, 2, 3];
const user: User = { id: 1, name: "Alice" }; // Cần type khi structure phức tạp
```

### 3. Strict Mode Configuration

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 4. Organize Types

```typescript
// types/user.types.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserRole = "admin" | "user" | "guest";

export interface UserWithRole extends User {
  role: UserRole;
}

// components/UserCard.tsx
import type { UserWithRole } from '@/types/user.types';
```

### 5. Props Naming Conventions

```tsx
// ✅ Good - rõ ràng, consistent
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
  className?: string;
}

// ❌ Bad - không rõ ràng
interface UserCardProps {
  data: any;
  edit: Function;
  delete: Function;
  loading: boolean;
}
```

### 6. Error Handling

```typescript
// ✅ Type-safe error handling
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: number): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Usage
const result = await fetchUser(1);
if (result.success) {
  console.log(result.data.name); // TypeScript biết data tồn tại
} else {
  console.error(result.error.message); // TypeScript biết error tồn tại
}
```

### 7. Component Patterns

**Compound Components**:
```tsx
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabProps {
  value: string;
  children: React.ReactNode;
}

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> & {
  Tab: React.FC<TabProps>;
  Panel: React.FC<TabProps>;
} = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.Tab = ({ value, children }) => {
  const context = useContext(TabsContext);
  return (
    <button onClick={() => context?.setActiveTab(value)}>
      {children}
    </button>
  );
};

Tabs.Panel = ({ value, children }) => {
  const context = useContext(TabsContext);
  return context?.activeTab === value ? <div>{children}</div> : null;
};

// Usage
<Tabs defaultValue="tab1">
  <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
  <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
</Tabs>
```

---

## Tổng kết

### Key Takeaways

1. **Type Safety**: Luôn ưu tiên type safety, tránh `any`
2. **Derived State**: Chỉ lưu state cần thiết, derive phần còn lại
3. **Single Source of Truth**: Tránh duplicate data giữa các states
4. **Type Inference**: Để TypeScript tự infer khi có thể
5. **Explicit Types**: Dùng explicit types cho props, API responses
6. **Generics**: Sử dụng generics cho reusable components
7. **Type Guards**: Viết custom type guards cho complex types
8. **Utility Types**: Tận dụng built-in utility types

### Resources để học thêm

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Total TypeScript](https://www.totaltypescript.com/)

---

**Lưu ý**: Tài liệu này tổng hợp kiến thức và tập trung vào patterns thực tế và best practices trong production.