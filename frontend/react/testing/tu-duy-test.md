# 🧠 Tư Duy Testing - Nghệ Thuật Tìm Test Cases

> **"Không phải test mọi thứ, mà test đúng thứ"**

## 📋 Mục Tiêu

Sau khi học xong tài liệu này, bạn sẽ:

-   ✅ Biết phân tích component để tìm test cases
-   ✅ Phân biệt cái gì cần test, cái gì không cần
-   ✅ Áp dụng framework tư duy cho mọi tình huống
-   ✅ Viết tests hiệu quả, không dư thừa
-   ✅ Tự tin test components phức tạp

---

## 1. 🎯 Mindset Cơ Bản

### 1.1 Nguyên Tắc Vàng

```
┌─────────────────────────────────────────────────┐
│  TEST BEHAVIOR, NOT IMPLEMENTATION              │
│  (Test hành vi, không test cách làm)           │
└─────────────────────────────────────────────────┘

❌ WRONG: Component có state `isOpen` = true
✅ RIGHT: Menu hiển thị khi user click button

❌ WRONG: Hook gọi useEffect với dependency [userId]
✅ RIGHT: Data refresh khi userId thay đổi

❌ WRONG: Function được memoized với useMemo
✅ RIGHT: Kết quả tính toán đúng với input
```

### 1.2 The User Perspective

**Hỏi bản thân:**

```
"Nếu tôi là USER sử dụng feature này,
 tôi QUAN TÂM điều gì?"
```

**Ví dụ: Login Form**

```typescript
// ❌ User KHÔNG quan tâm:
- Form có bao nhiêu state variables
- Validation function được gọi khi nào
- Email được trim() trước khi submit hay không

// ✅ User QUAN TÂM:
- Tôi có thể nhập email/password không?
- Tôi có thể submit form không?
- Tôi thấy error message khi sai không?
- Tôi được chuyển đến trang nào sau khi login?
```

### 1.3 Risk-Based Testing

**Test theo mức độ quan trọng:**

```
┌──────────────────────────────────────┐
│ CRITICAL (Must test 100%)           │
│ - Payment processing                 │
│ - User authentication                │
│ - Data deletion                      │
│ - Security features                  │
├──────────────────────────────────────┤
│ HIGH (Test 90%+)                     │
│ - Form submissions                   │
│ - Data mutations                     │
│ - Business logic                     │
├──────────────────────────────────────┤
│ MEDIUM (Test 70%+)                   │
│ - Display logic                      │
│ - Filtering/Sorting                  │
│ - Navigation                         │
├──────────────────────────────────────┤
│ LOW (Optional)                       │
│ - Visual styling                     │
│ - Animations                         │
│ - Static content                     │
└──────────────────────────────────────┘
```

---

## 2. 🔍 Framework Phân Tích Component

### 2.1 The 5W1H Method

Áp dụng 5W1H để tìm test cases:

**1. WHAT (Cái gì)?**

-   Component làm gì?
-   Hiển thị gì?
-   Tính toán gì?

**2. WHO (Ai)?**

-   Ai sử dụng component này?
-   User roles khác nhau?

**3. WHEN (Khi nào)?**

-   Khi nào component render?
-   Khi nào state thay đổi?
-   Khi nào gọi API?

**4. WHERE (Ở đâu)?**

-   Component xuất hiện ở đâu trong app?
-   Data đến từ đâu?

**5. WHY (Tại sao)?**

-   Tại sao component này tồn tại?
-   Business value là gì?

**6. HOW (Như thế nào)?**

-   User tương tác như thế nào?
-   Data flow như thế nào?

### 2.2 Ví Dụ: Phân Tích Shopping Cart

**Component:**

```typescript
function ShoppingCart() {
    const { items, removeItem, updateQuantity, total } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div>
            {items.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                />
            ))}
            <Total amount={total} />
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
}
```

**Áp dụng 5W1H:**

**WHAT:**

-   Hiển thị danh sách items trong cart
-   Hiển thị tổng tiền
-   Cho phép xóa/update quantity
-   Cho phép checkout

**WHO:**

-   Guest users (chưa login)
-   Logged-in users

**WHEN:**

-   Khi user vào trang cart
-   Khi cart rỗng
-   Khi user chưa login
-   Khi user đã login

**WHERE:**

-   Trang /cart
-   Data từ useCart hook
-   User info từ useAuth

**WHY:**

-   Để user xem và quản lý items trước khi mua
-   Business critical: ảnh hưởng trực tiếp đến revenue

**HOW:**

-   Click remove button
-   Change quantity
-   Click checkout
-   Navigate between pages

**→ Test Cases từ phân tích trên:**

```typescript
describe('ShoppingCart', () => {
    describe('Empty State', () => {
        it('shows empty cart when no items');
    });

    describe('Display Items', () => {
        it('shows all cart items');
        it('shows correct total');
    });

    describe('Remove Item', () => {
        it('removes item when click remove');
        it('updates total after removing');
    });

    describe('Update Quantity', () => {
        it('updates quantity');
        it('recalculates total');
    });

    describe('Checkout Flow', () => {
        it('redirects to login if not authenticated');
        it('goes to checkout if authenticated');
    });
});
```

---

## 3. 📊 Decision Tree - Cái Gì Cần Test?

### 3.1 Flowchart Quyết Định

```
Component/Code
      ↓
   [Is it MY code?]
      ↓ No → DON'T TEST (third-party libs)
      ↓ Yes
   [Does user see/interact with it?]
      ↓ No → [Is it business logic?]
      ↓          ↓ No → MAYBE (low priority)
      ↓          ↓ Yes → TEST IT
      ↓ Yes
   [Can it break user experience?]
      ↓ No → LOW PRIORITY
      ↓ Yes
   [Can it affect data/money/security?]
      ↓ No → MEDIUM PRIORITY
      ↓ Yes
    TEST IT THOROUGHLY!
```

### 3.2 Checklist Chi Tiết

**✅ ALWAYS TEST (Luôn luôn test):**

```typescript
// 1. User-facing behavior
✅ "User có thể click button này không?"
✅ "Form validation hoạt động đúng không?"
✅ "Error message hiển thị khi nào?"

// 2. Business logic
✅ "Tính toán giá đúng không?"
✅ "Discount apply đúng không?"
✅ "Permission checking đúng không?"

// 3. Data mutations
✅ "Data được lưu đúng không?"
✅ "Delete hoạt động không?"
✅ "Update sync với server không?"

// 4. Critical paths
✅ "Payment flow hoạt động không?"
✅ "Login/Signup thành công không?"
✅ "Checkout process smooth không?"

// 5. Error handling
✅ "App handle network error không?"
✅ "Validation errors được show không?"
✅ "Graceful degradation hoạt động không?"
```

**⚠️ MAYBE TEST (Có thể test):**

```typescript
// 1. Computed values (nếu logic phức tạp)
⚠️ "useMemo calculation"
⚠️ "Derived state"

// 2. Helper functions (nếu reused nhiều)
⚠️ "formatCurrency()"
⚠️ "validateEmail()"

// 3. Complex conditions
⚠️ "Conditional rendering với nhiều điều kiện"
⚠️ "Access control logic"
```

**❌ DON'T TEST (Không cần test):**

```typescript
// 1. Third-party libraries
❌ React itself
❌ Lodash functions
❌ Date-fns utilities

// 2. Trivial code
❌ Simple getters/setters
❌ Constants
❌ Type definitions

// 3. Implementation details
❌ State variable names
❌ useEffect dependencies
❌ Internal component structure

// 4. Framework behavior
❌ React re-rendering
❌ Router navigation mechanics
❌ Context propagation

// 5. Styling
❌ CSS classes applied
❌ Inline styles
❌ Animation timing
```

---

## 4. 🎭 Test Scenarios Matrix

### 4.1 Happy Path vs Edge Cases

**Happy Path (70% tests):**

-   Normal user flow
-   Valid inputs
-   Expected behavior

**Edge Cases (20% tests):**

-   Boundary values
-   Empty states
-   Maximum values

**Error Cases (10% tests):**

-   Invalid inputs
-   Network failures
-   Permission errors

### 4.2 Ví Dụ: Search Component

```typescript
function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (query.length < 3) return

    setLoading(true)
    try {
      const data = await api.search(query)
      setResults(data)
    } catch (error) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  return (/* JSX */)
}
```

**Matrix Test Cases:**

| Scenario                    | Type  | Input       | Expected Output     | Priority |
| --------------------------- | ----- | ----------- | ------------------- | -------- |
| User searches valid term    | Happy | "laptop"    | Shows results       | HIGH     |
| User types < 3 chars        | Edge  | "ab"        | No search triggered | MEDIUM   |
| User searches empty term    | Edge  | ""          | No search triggered | MEDIUM   |
| API returns empty           | Edge  | "xyz123"    | Shows "No results"  | MEDIUM   |
| API returns error           | Error | Any         | Shows error message | HIGH     |
| Network timeout             | Error | Any         | Shows timeout error | MEDIUM   |
| User searches special chars | Edge  | "@#$%"      | Handles gracefully  | LOW      |
| Search > 1000 results       | Edge  | Common term | Pagination works    | LOW      |

**Test Implementation:**

```typescript
describe('SearchComponent', () => {
    // HIGH PRIORITY
    it('searches and shows results', async () => {
        /* ... */
    });
    it('shows error on API failure', async () => {
        /* ... */
    });

    // MEDIUM PRIORITY
    it('does not search with < 3 characters', () => {
        /* ... */
    });
    it('shows empty state when no results', async () => {
        /* ... */
    });
    it('handles network timeout', async () => {
        /* ... */
    });

    // LOW PRIORITY (if time permits)
    it('handles special characters', async () => {
        /* ... */
    });
    it('paginates large result sets', async () => {
        /* ... */
    });
});
```

---

## 5. 🧩 Phân Tích Component Phức Tạp

### 5.1 Step-by-Step Breakdown

**Component phức tạp:**

```typescript
function ProductDetail({ productId }: Props) {
  // 1. External data
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // 2. API data
  const { data: product, loading, error } = useQuery(['product', productId],
    () => fetchProduct(productId)
  )

  // 3. Local state
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [reviewsVisible, setReviewsVisible] = useState(false)

  // 4. Computed values
  const price = useMemo(() =>
    calculatePrice(product, selectedVariant, quantity),
    [product, selectedVariant, quantity]
  )

  const inStock = useMemo(() =>
    checkStock(product, selectedVariant),
    [product, selectedVariant]
  )

  // 5. Handlers
  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!inStock) {
      toast.error('Out of stock')
      return
    }

    addToCart({
      productId,
      variantId: selectedVariant?.id,
      quantity
    })
    toast.success('Added to cart')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  // 6. Effects
  useEffect(() => {
    trackView(productId)
  }, [productId])

  // 7. Render logic
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage />
  if (!product) return <NotFound />

  return (/* Complex JSX */)
}
```

### 5.2 Phân Tích Từng Phần

**🔍 Bước 1: Liệt kê tất cả dependencies**

```
1. Props: productId
2. Context: useAuth, useCart, useNavigate
3. API: useQuery → product data
4. State: quantity, selectedVariant, reviewsVisible
5. Computed: price, inStock
6. Handlers: handleAddToCart, handleBuyNow
7. Side effects: trackView
```

**🔍 Bước 2: Phân loại cái gì cần test**

```
✅ MUST TEST:
- User interactions (click add to cart, buy now)
- Different user states (logged in vs not)
- Stock checking logic
- Price calculation
- Error states (loading, error, not found)
- Navigation flows

⚠️ MAYBE TEST:
- Computed values (nếu logic phức tạp)
- Variant selection

❌ DON'T TEST:
- useQuery implementation
- React context propagation
- Toast library
- Analytics tracking
```

**🔍 Bước 3: Tạo Test Scenarios**

```typescript
describe('ProductDetail', () => {
    // === RENDERING STATES ===
    describe('Loading & Error States', () => {
        it('shows loading spinner while fetching');
        it('shows error message on fetch failure');
        it('shows not found when product does not exist');
    });

    // === DISPLAY ===
    describe('Product Display', () => {
        it('displays product name, image, description');
        it('displays correct price');
        it('shows stock status');
    });

    // === USER INTERACTIONS ===
    describe('Quantity Selection', () => {
        it('increases quantity');
        it('decreases quantity');
        it('does not go below 1');
    });

    describe('Variant Selection', () => {
        it('selects variant');
        it('updates price when variant changes');
        it('updates stock status based on variant');
    });

    // === CRITICAL FLOWS ===
    describe('Add to Cart', () => {
        it('adds to cart when logged in and in stock');
        it('redirects to login when not authenticated');
        it('shows error when out of stock');
        it('shows success message');
    });

    describe('Buy Now', () => {
        it('adds to cart and navigates to checkout');
        it('redirects to login if not authenticated');
    });

    // === EDGE CASES ===
    describe('Edge Cases', () => {
        it('handles product without variants');
        it('handles product with 0 stock');
        it('refetches when productId changes');
    });
});
```

---

## 6. 🎨 Patterns & Templates

### 6.1 Form Component Template

**Mọi form component đều test:**

```typescript
describe('FormComponent', () => {
    // 1. RENDERING
    it('renders all form fields');
    it('renders with initial values');

    // 2. VALIDATION
    it('shows error for required fields');
    it('validates email format');
    it('validates password strength');
    it('shows all errors at once');

    // 3. USER INPUT
    it('updates value on user input');
    it('clears error when user fixes input');

    // 4. SUBMISSION
    it('submits with valid data');
    it('does not submit with invalid data');
    it('shows loading during submission');
    it('disables button during submission');

    // 5. SUCCESS/ERROR
    it('shows success message on success');
    it('shows error message on failure');
    it('clears form after success');
});
```

### 6.2 Data Fetching Component Template

```typescript
describe('DataComponent', () => {
    // 1. LOADING STATE
    it('shows loading initially');

    // 2. SUCCESS STATE
    it('displays data after loading');
    it('shows correct number of items');

    // 3. ERROR STATE
    it('shows error message on failure');
    it('shows retry button');

    // 4. EMPTY STATE
    it('shows empty state when no data');

    // 5. REFRESH
    it('refetches when user refreshes');
    it('refetches when deps change');

    // 6. ACTIONS
    it('handles item click');
    it('handles delete');
    it('updates list after mutation');
});
```

### 6.3 Authentication Flow Template

```typescript
describe('AuthFlow', () => {
    // 1. LOGGED OUT
    it('shows login form when not authenticated');
    it('redirects to login on protected route');

    // 2. LOGIN
    it('logs in with valid credentials');
    it('shows error with invalid credentials');
    it('redirects to intended page after login');

    // 3. LOGGED IN
    it('shows user info when authenticated');
    it('shows logout button');

    // 4. LOGOUT
    it('logs out successfully');
    it('clears user data');
    it('redirects to home');

    // 5. SESSION
    it('persists session on refresh');
    it('expires session after timeout');
});
```

---

## 7. 🚫 Anti-Patterns - Tránh Testing Này

### 7.1 Over-Testing

**❌ BAD:**

```typescript
// Testing implementation details
it('calls useState with initial value', () => {
    // WHY? User doesn't care về internal state
});

it('component has useEffect with deps', () => {
    // WHY? Implementation detail
});

it('renders with correct class names', () => {
    // WHY? Styling không ảnh hưởng behavior
});

// Testing trivial code
it('getter returns property value', () => {
    expect(user.getName()).toBe(user.name);
    // WHY? Useless test
});

// Testing library code
it('lodash sum works correctly', () => {
    expect(_.sum([1, 2, 3])).toBe(6);
    // WHY? Don't test third-party libs
});
```

**✅ GOOD:**

```typescript
// Test behavior
it('increments counter when button clicked', () => {
    // User cares about behavior
});

it('shows error when validation fails', () => {
    // User cares about error message
});

it('navigates to dashboard after login', () => {
    // User cares about navigation
});
```

### 7.2 Under-Testing

**❌ BAD:**

```typescript
// Only happy path
it('submits form successfully', () => {
    // What about errors? Edge cases?
});

// No edge cases
it('displays list', () => {
    // What about empty list? Loading? Error?
});

// Missing critical paths
// No tests for:
// - Authentication
// - Payment
// - Data deletion
```

**✅ GOOD:**

```typescript
// Cover all paths
describe('Form', () => {
    it('submits successfully');
    it('shows validation errors');
    it('handles network error');
    it('disables during submission');
});

describe('List', () => {
    it('displays items');
    it('shows empty state');
    it('shows loading state');
    it('shows error state');
    it('handles pagination');
});
```

---

## 8. 💡 Practical Examples

### 8.1 Ví Dụ 1: Todo List - Phân Tích Đầy Đủ

**Component:**

```typescript
function TodoList() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [input, setInput] = useState('')

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed)
      case 'completed': return todos.filter(t => t.completed)
      default: return todos
    }
  }, [todos, filter])

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input, completed: false }])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (/* JSX */)
}
```

**🔍 Phân tích:**

**User cares about:**

1. ✅ Add todo → Appears in list
2. ✅ Toggle todo → Status changes
3. ✅ Delete todo → Removed from list
4. ✅ Filter → Shows correct todos
5. ✅ Empty input → Cannot add
6. ✅ Input clears after add

**User DOESN'T care:**

1. ❌ useState được dùng
2. ❌ useMemo được dùng
3. ❌ Filter implementation details
4. ❌ Date.now() for ID generation

**Test cases:**

```typescript
describe('TodoList', () => {
    // CORE FUNCTIONALITY (Must have)
    it('adds todo when enter text and click add', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        await user.type(screen.getByRole('textbox'), 'Buy milk');
        await user.click(screen.getByRole('button', { name: /add/i }));

        expect(screen.getByText('Buy milk')).toBeInTheDocument();
    });

    it('toggles todo completion', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        // Add todo first
        await user.type(screen.getByRole('textbox'), 'Buy milk');
        await user.click(screen.getByRole('button', { name: /add/i }));

        // Toggle
        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);

        expect(checkbox).toBeChecked();
    });

    it('deletes todo', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        // Add todo
        await user.type(screen.getByRole('textbox'), 'Buy milk');
        await user.click(screen.getByRole('button', { name: /add/i }));

        // Delete
        await user.click(screen.getByRole('button', { name: /delete/i }));

        expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    });

    // FILTERING (Important feature)
    it('filters active todos', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        // Add todos
        await user.type(screen.getByRole('textbox'), 'Task 1');
        await user.click(screen.getByRole('button', { name: /add/i }));

        await user.type(screen.getByRole('textbox'), 'Task 2');
        await user.click(screen.getByRole('button', { name: /add/i }));

        // Complete first
        const checkboxes = screen.getAllByRole('checkbox');
        await user.click(checkboxes[0]);

        // Filter active
        await user.click(screen.getByRole('button', { name: /active/i }));

        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    // EDGE CASES
    it('does not add empty todo', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        await user.click(screen.getByRole('button', { name: /add/i }));

        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('clears input after adding', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'Buy milk');
        await user.click(screen.getByRole('button', { name: /add/i }));

        expect(input).toHaveValue('');
    });
});
```

### 8.2 Ví Dụ 2: E-commerce Product Page

**Phân tích nhanh:**

```typescript
// Component có:
// - Product info display
// - Image gallery
// - Variant selection (size, color)
// - Quantity selector
// - Add to cart
// - Reviews section
// - Related products
```

**Priority Matrix:**

| Feature           | User Impact | Business Impact | Priority | Test?    |
| ----------------- | ----------- | --------------- | -------- | -------- |
| Add to cart       | HIGH        | HIGH            | CRITICAL | ✅ YES   |
| Variant selection | HIGH        | HIGH            | CRITICAL | ✅ YES   |
| Price display     | HIGH        | HIGH            | CRITICAL | ✅ YES   |
| Stock check       | HIGH        | HIGH            | CRITICAL | ✅ YES   |
| Quantity selector | MEDIUM      | MEDIUM          | HIGH     | ✅ YES   |
| Reviews display   | MEDIUM      | LOW             | MEDIUM   | ⚠️ MAYBE |
| Image gallery     | LOW         | LOW             | LOW      | ❌ NO    |
| Related products  | LOW         | MEDIUM          | LOW      | ❌ NO    |

**Test cases chỉ cho HIGH/CRITICAL:**

```typescript
describe('ProductPage - Critical Paths', () => {
    it('displays product info correctly');
    it('selects size variant');
    it('selects color variant');
    it('updates price when variant changes');
    it('shows out of stock for unavailable variants');
    it('adds to cart with correct variant and quantity');
    it('prevents add to cart when out of stock');
    it('updates quantity');
    it('prevents quantity < 1');
    it('prevents quantity > stock');
});
```

---

## 9. 🎓 Exercises - Luyện Tập Tư Duy

### Exercise 1: Phân Tích Component

**Cho component sau, hãy:**

1. Liệt kê tất cả behaviors
2. Phân loại priority (Critical/High/Medium/Low)
3. Viết list test cases
4. Giải thích tại sao test/không test

```typescript
function UserProfile({ userId }: Props) {
    const { data: user, loading } = useQuery(['user', userId], fetchUser);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const { currentUser } = useAuth();

    const canEdit = currentUser?.id === userId;

    const handleSave = async () => {
        await updateUser(userId, formData);
        setIsEditing(false);
    };

    if (loading) return <Spinner />;

    return isEditing ? (
        <EditForm data={formData} onChange={setFormData} onSave={handleSave} />
    ) : (
        <DisplayView
            user={user}
            onEdit={() => setIsEditing(true)}
            canEdit={canEdit}
        />
    );
}
```

**Đáp án:**

<details>
<summary>Click để xem đáp án</summary>

**1. Behaviors:**

-   Display user info
-   Show loading state
-   Toggle edit mode
-   Edit user info
-   Save changes
-   Permission check (can edit)

**2. Priority:**

-   CRITICAL: Permission check, Save changes
-   HIGH: Display user info, Edit mode
-   MEDIUM: Loading state
-   LOW: None

**3. Test cases:**

```typescript
describe('UserProfile', () => {
    // CRITICAL
    it('only allows user to edit own profile');
    it('saves changes successfully');
    it('prevents editing other user profiles');

    // HIGH
    it('displays user information');
    it('enters edit mode when click edit');
    it('exits edit mode after save');

    // MEDIUM
    it('shows loading while fetching user');

    // EDGE CASES
    it('handles save error');
    it('refetches when userId changes');
});
```

**4. Không test:**

-   useQuery implementation
-   State management internals
-   EditForm/DisplayView components (test separately)
</details>

### Exercise 2: Real-World Component

**Dashboard Component với:**

-   Multiple charts
-   Real-time data updates
-   Filters (date range, category)
-   Export CSV
-   Refresh button

**Cho component giả định sau, hãy:**

1. Liệt kê tất cả behaviors
2. Phân loại priority (Critical/High/Medium/Low)
3. Viết list test cases
4. Giải thích tại sao test/không test

```typescript
function AnalyticsDashboard() {
    const { user } = useAuth();
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
    const [category, setCategory] = useState<
        'all' | 'sales' | 'traffic' | 'users'
    >('all');

    const { data, loading, error, refetch } = useQuery(
        ['analytics', dateRange, category],
        () => fetchAnalytics({ dateRange, category })
    );

    // Real-time updates
    useEffect(() => {
        const ws = new WebSocket('/ws/analytics');
        ws.onmessage = (event) => updateRealtimeData(JSON.parse(event.data));
        return () => ws.close();
    }, []);

    const handleExport = () => exportToCSV(data);

    if (loading) return <DashboardSkeleton />;
    if (error) return <ErrorState onRetry={refetch} />;

    return (
        <div>
            <Header onRefresh={refetch} onExport={handleExport} />
            <FilterBar
                dateRange={dateRange}
                onDateChange={setDateRange}
                category={category}
                onCategoryChange={setCategory}
            />
            <Grid>
                <RevenueChart data={data?.revenue} />
                <TrafficChart data={data?.traffic} />
                <RealtimeCard liveData={data?.realtime} />
            </Grid>
        </div>
    );
}
```

**Đáp án:**

<details>
<summary>Click để xem đáp án</summary>

**1. Behaviors (User thấy được & quan tâm):**

-   Hiển thị dashboard chỉ khi user có quyền
-   Hiển thị dữ liệu đúng theo filter ngày + danh mục
-   Tự động cập nhật dữ liệu khi thay đổi filter
-   Cập nhật số liệu real-time (live users, today revenue…)
-   Export ra file CSV đúng với dữ liệu hiện tại
-   Nút Refresh tải lại toàn bộ dữ liệu
-   Hiển thị loading skeleton khi đang fetch
-   Hiển thị lỗi + cho phép retry khi API
-   Các chart hiển thị đúng dữ liệu

**2. Priority:**

| Priority | Features                                                              |
| -------- | --------------------------------------------------------------------- |
| CRITICAL | Permission check, Export CSV đúng dữ liệu, Real-time update chính xác |
| HIGH     | Filter thay đổi → dữ liệu cập nhật đúng, Error + retry, Loading state |
| MEDIUM   | Nút Refresh hoạt động, Chart hiển thị dữ liệu đúng                    |
| LOW      | Animation chart, tooltip, màu sắc, responsive chi tiết                |

**3. Test cases:**

```typescript
describe('AnalyticsDashboard', () => {
    // CRITICAL
    describe('Access Control', () => {
        it('redirects or hides dashboard if user has no analytics permission');
        it('shows dashboard for authorized roles only');
    });

    describe('Export CSV', () => {
        it('downloads CSV containing current filtered data');
        it('includes correct columns and rows matching current view');
    });

    describe('Real-time Updates', () => {
        it('updates live metrics when WebSocket message arrives');
    });

    // HIGH
    describe('Filtering', () => {
        it('refetches and displays data for selected date range', async () => {});
        it('refetches and displays data for selected category', async () => {});
        it('combines both filters correctly', async () => {});
    });

    describe('Error Handling', () => {
        it('shows error state when query fails');
        it('refetches data when clicking Retry', async () => {});
    });

    describe('Loading State', () => {
        it('renders skeleton while loading');
    });

    // MEDIUM
    describe('Manual Refresh', () => {
        it('refetches all data when clicking refresh button', async () => {});
    });

    describe('Charts Display', () => {
        it('passes correct data to RevenueChart');
        it('passes correct data to TrafficChart');
    });

    // EDGE CASES (nên có)
    it('handles empty data gracefully');
    it('handles WebSocket connection error');
});
```

**4. Không test (và lý do):**

| Không test                                              | Lý do                                                |
| ------------------------------------------------------- | ---------------------------------------------------- |
| Chi tiết vẽ chart (Recharts/Victory/Nivo)               | Test riêng ở component Chart hoặc tin tưởng thư viện |
| Animation, transition, hover tooltip                    | Visual only – dùng snapshot/visual testing nếu cần   |
| Màu sắc, font, spacing, responsive breakpoints chi tiết | Không ảnh hưởng business logic                       |
| WebSocket connection/reconnection logic chi tiết        | Test trong custom hook `useRealtimeAnalytics` riêng  |
| Hàm `exportToCSV` implementation                        | Test unit riêng ở utils/csv.ts                       |
| useQuery internals, cache behavior                      | Đã được React Query test kỹ                          |
| Exact skeleton shimmer animation                        | Low value                                            |

</details>

---

## 📚 Tổng kết nội dung:

### ✅ Phần 1: Foundations

1. **Mindset Cơ Bản**

    - Test behavior, not implementation
    - User perspective
    - Risk-based testing

2. **Framework 5W1H**
    - What, Who, When, Where, Why, How
    - Áp dụng để phân tích component
    - Ví dụ Shopping Cart chi tiết

### ✅ Phần 2: Decision Making

3. **Decision Tree**

    - Flowchart quyết định test gì
    - Checklist: Always/Maybe/Don't test
    - Examples cụ thể

4. **Test Scenarios Matrix**
    - Happy path vs Edge cases
    - Priority matrix
    - Ví dụ Search component

### ✅ Phần 3: Complex Analysis

5. **Phân Tích Component Phức Tạp**

    - Step-by-step breakdown
    - ProductDetail example
    - Từ dependencies → test cases

6. **Patterns & Templates**
    - Form testing template
    - Data fetching template
    - Auth flow template

### ✅ Phần 4: Anti-Patterns

7. **Over-Testing & Under-Testing**
    - Bad examples với giải thích
    - Good examples
    - Common mistakes

### ✅ Phần 5: Real World

8. **Complete Examples**

    - TodoList analysis đầy đủ
    - E-commerce product page
    - Priority matrix thực tế

9. **Exercises**
    - UserProfile analysis
    - Dashboard challenge
    - Với đáp án chi tiết

### ✅ Phần 6: Advanced

10. **Tools & Checklists**

    -   Quick decision tree
    -   Testing scorecard
    -   Pre/Post test checklists

11. **Advanced Patterns**
    -   State transition testing
    -   Data flow testing
    -   Dependency chain
    -   Permission matrix

### ✅ Phần 7: Case Studies

12. **Real-World Cases**
    -   Payment form (critical)
    -   Social feed (complex)
    -   Admin dashboard (permissions)

### ✅ Phần 8: Action Plan

13. **Summary & Action Plan**

    -   Core principles
    -   Decision framework
    -   Common patterns
    -   Red flags
    -   30-day plan

14. **Final Exercise**
    -   Booking system challenge
    -   Complete test plan example

## 🎯 Điểm nổi bật:

-   ✅ **Practical frameworks** - 5W1H, Decision Tree, Priority Matrix
-   ✅ **Real examples** - TodoList, Shopping Cart, Payment, etc.
-   ✅ **Visual aids** - Tables, diagrams, checklists
-   ✅ **Interactive exercises** - Với detailed answers
-   ✅ **Action plan** - 30-day roadmap
-   ✅ **Copy-paste templates** - Cho mọi loại component
