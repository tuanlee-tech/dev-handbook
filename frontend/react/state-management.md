# Phân Tích Kỹ Thuật: Hệ Sinh Thái State Management trong React

> **Phạm vi tài liệu:** `use-context-selector` · `Zustand` · `Redux` · `Redux Toolkit` · `RTK Query` · `redux-thunk` · `redux-saga`  
> Tài liệu trình bày theo trục thời gian tiến hóa, lý giải tại sao từng công nghệ xuất hiện, giải quyết vấn đề gì, và khi nào hợp lý để thay thế cái kia.

---

## Phần 1 — Bối Cảnh: Vì Sao State Management Là Vấn Đề Khó

React ra đời với triết lý **unidirectional data flow**: state đi từ cha xuống con qua props. Mô hình này hoạt động tốt ở quy mô nhỏ, nhưng khi ứng dụng phức tạp lên, hai vấn đề cấu trúc xuất hiện:

**Prop drilling** — state phải truyền qua nhiều tầng component trung gian không thực sự cần nó. Component trung gian bị ô nhiễm với props chỉ để chuyển tiếp xuống sâu hơn.

**Shared mutable state** — nhiều component cần đọc và ghi cùng một state, nhưng React không có cơ chế native để share state ngang hàng (sibling components) mà không đưa state lên ancestor chung.

Toàn bộ hệ sinh thái state management sinh ra để giải quyết hai vấn đề này. Mỗi thư viện tiếp cận từ một góc độ khác nhau, với trade-off khác nhau.

---

## Phần 2 — React Context và Giới Hạn Của Nó

### 2.1 Context API Hoạt Động Như Thế Nào

Context API (React 16.3+) cho phép truyền dữ liệu xuống toàn bộ cây component mà không cần prop drilling. Cơ chế hoạt động:

1. `React.createContext()` tạo một Context object với `Provider` và `Consumer`.
2. `Provider` bọc bên ngoài cây component, nhận `value` prop.
3. Bất kỳ component con nào gọi `useContext(MyContext)` sẽ nhận được giá trị `value` hiện tại.
4. Khi `value` của Provider thay đổi, **tất cả** component đang subscribe sẽ re-render.

```tsx
const ThemeContext = React.createContext<'light' | 'dark'>('light');

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function DeepComponent() {
  const theme = useContext(ThemeContext); // Không cần prop drilling
  return <div className={theme}>...</div>;
}
```

### 2.2 Vấn Đề Cốt Lõi: Re-render Cascade

Đây là điểm yếu chết người của Context API thuần túy. React so sánh `value` bằng **referential equality** (`Object.is`). Nếu `value` là một object:

```tsx
// BAD: Object literal mới được tạo mỗi lần App re-render
<UserContext.Provider value={{ user, setUser }}>

// Mọi consumer của UserContext sẽ re-render dù user không thay đổi
// Vì { user, setUser } là object reference mới mỗi lần
```

Ngay cả khi fix bằng `useMemo`, vấn đề sâu hơn vẫn còn: **không có cơ chế selective subscription**. Nếu Context chứa `{ user, cart, theme }`, một component chỉ cần `theme` vẫn sẽ re-render khi `user` thay đổi.

Đây chính là lý do `use-context-selector` ra đời.

### 2.3 `use-context-selector` — Surgical Subscription

**Tác giả:** Daishi Kato (cũng là tác giả của Jotai, Valtio)  
**Vấn đề giải quyết:** Re-render không cần thiết khi dùng Context với state phức tạp

`use-context-selector` thay thế `useContext` bằng `useContextSelector`, cho phép chỉ subscribe vào một slice cụ thể của Context value:

```tsx
import { createContext, useContextSelector } from 'use-context-selector';

// Thay vì React.createContext
const StoreContext = createContext<StoreState>(null!);

function UserAvatar() {
  // Chỉ re-render khi user.name thay đổi, KHÔNG re-render khi cart thay đổi
  const userName = useContextSelector(StoreContext, (state) => state.user.name);
  return <img alt={userName} />;
}

function CartBadge() {
  // Chỉ re-render khi cart.count thay đổi
  const cartCount = useContextSelector(
    StoreContext,
    (state) => state.cart.count,
  );
  return <span>{cartCount}</span>;
}
```

**Cơ chế hoạt động:** Thư viện sử dụng `useReducer` với custom equality check. Mỗi consumer lưu trữ selector function và giá trị đã chọn trước đó. Khi Context value thay đổi, nó chạy lại selector và so sánh kết quả — chỉ trigger re-render nếu kết quả khác.

**Khi nào dùng `use-context-selector`:**

- Bạn muốn giữ nguyên pattern Context (không muốn thêm thư viện state management mới)
- State global không quá phức tạp nhưng Context thuần gây re-render performance issues
- Team quen với Context API, muốn nâng cấp tối thiểu

**Khi nào nên chuyển sang Zustand thay vì dùng `use-context-selector`:**

- Cần middleware (persist, devtools, immer)
- State có nhiều actions phức tạp
- Team muốn một API nhất quán hơn thay vì Context pattern

---

## Phần 3 — Zustand: Minimalist Global State

### 3.1 Triết Lý Thiết Kế

Zustand được xây dựng trên một nguyên tắc: **state là một store đơn giản bên ngoài React**, và components subscribe vào nó thông qua hooks. Không có Provider, không có boilerplate, không có action creators.

```tsx
import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: () => void;
  reset: () => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  reset: () => set({ bears: 0 }),
}));

// Trong component — không cần Provider
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears} bears</h1>;
}

function Controls() {
  const increase = useBearStore((state) => state.increase);
  return <button onClick={increase}>Add Bear</button>;
}
```

### 3.2 Selective Subscription — Tính Năng Cốt Lõi

Zustand giải quyết vấn đề re-render ngay trong thiết kế lõi. Mỗi `useBearStore(selector)` chỉ subscribe vào phần state mà selector trả về. Re-render chỉ xảy ra khi giá trị selector thay đổi (so sánh bằng `Object.is` mặc định).

```tsx
// Component A chỉ re-render khi bears thay đổi
const bears = useStore((s) => s.bears);

// Component B chỉ re-render khi user.name thay đổi
const userName = useStore((s) => s.user.name);

// Component C lấy nhiều values — dùng shallow để tránh re-render không cần thiết
import { useShallow } from 'zustand/react/shallow';
const { bears, increase } = useStore(
  useShallow((s) => ({ bears: s.bears, increase: s.increase })),
);
```

### 3.3 Middleware Architecture

Zustand theo kiến trúc middleware composable — wrap store bằng các middleware để thêm tính năng:

```tsx
import { create } from 'zustand';
import { persist, devtools, immer } from 'zustand/middleware';

const useStore = create<State>()(
  devtools(
    // Redux DevTools integration
    persist(
      // Persist to localStorage/sessionStorage
      immer(
        // Immer for mutable update syntax
        (set) => ({
          items: [],
          addItem: (item) =>
            set((state) => {
              state.items.push(item); // Immer cho phép "mutate" trực tiếp
            }),
        }),
      ),
      { name: 'app-storage' },
    ),
    { name: 'AppStore' },
  ),
);
```

**Các middleware quan trọng:**

| Middleware              | Chức năng                                                        |
| ----------------------- | ---------------------------------------------------------------- |
| `persist`               | Sync state với localStorage, sessionStorage, hoặc custom storage |
| `devtools`              | Tích hợp Redux DevTools — xem state history, time-travel         |
| `immer`                 | Dùng Immer để viết update state theo cú pháp mutate              |
| `subscribeWithSelector` | Cho phép subscribe vào state changes bên ngoài React             |

### 3.4 Zustand vs Context + `use-context-selector`

| Tiêu chí       | Context + use-context-selector | Zustand                          |
| -------------- | ------------------------------ | -------------------------------- |
| Setup          | Cần Provider, boilerplate nhẹ  | Không cần Provider               |
| Persist        | Tự implement                   | Middleware `persist` có sẵn      |
| DevTools       | Không có                       | Middleware `devtools`            |
| Async actions  | Tự xử lý trong component       | Định nghĩa trực tiếp trong store |
| Bundle size    | ~1KB                           | ~1KB                             |
| Learning curve | Thấp (biết Context là biết)    | Thấp                             |

**Kết luận:** `use-context-selector` là nâng cấp nhẹ cho Context. Zustand là lựa chọn mạnh hơn khi cần middleware, devtools, hoặc async logic trong store. Với project mới, Zustand thường là lựa chọn hợp lý hơn.

---

## Phần 4 — Redux: Kiến Trúc Và Tiến Hóa

### 4.1 Redux Vanilla (2015) — Nền Tảng

Redux ra đời từ hai khái niệm: **Flux architecture** của Facebook và **Elm architecture**. Ba nguyên tắc cốt lõi:

**Single source of truth** — Toàn bộ application state nằm trong một store duy nhất.

**State is read-only** — Không được mutate state trực tiếp. Mọi thay đổi phải thông qua dispatching actions.

**Changes via pure functions** — Reducers là pure functions: `(state, action) => newState`. Không có side effects.

```javascript
// Action types (constants)
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

// Action creators
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// Reducer — pure function
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 }; // Immutable update
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// Store
const store = createStore(counterReducer);

// Dispatch
store.dispatch(increment());
```

**Lý do Redux trở nên phổ biến (2015–2019):**

- Predictable state — dễ debug, dễ test
- Devtools time-travel — xem lại mọi action và state transition
- Ecosystem phong phú — middleware, enhancers
- Pattern rõ ràng cho team lớn

**Vấn đề của Redux vanilla:**

- Boilerplate cực kỳ nhiều: action types, action creators, reducers, selectors — tất cả phải viết tay
- Immutable updates verbose: spread operator lồng nhau sâu rất dễ sai
- Không có cách chuẩn để xử lý async
- Mọi thứ đều phải tự thiết lập

### 4.2 `redux-thunk` — Giải Pháp Đầu Tiên Cho Async

Redux thuần chỉ xử lý synchronous actions. Để fetch API, cần middleware.

`redux-thunk` là middleware đơn giản nhất: nếu action creator trả về một **function** thay vì object, thunk middleware sẽ gọi function đó với `(dispatch, getState)`.

```javascript
// Thunk action creator — trả về function thay vì object
const fetchUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: 'FETCH_USER_REQUEST' });

  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
  } catch (error) {
    dispatch({ type: 'FETCH_USER_FAILURE', payload: error.message });
  }
};

// Dispatch như bình thường
store.dispatch(fetchUser(123));
```

**Giới hạn của redux-thunk:**

- Logic async phức tạp (race conditions, cancellation, sequencing) rất khó quản lý
- Test khó hơn vì phải mock dispatch và getState
- Không có declarative way để mô tả luồng async

### 4.3 `redux-saga` — Async Phức Tạp Với Generator

`redux-saga` ra đời để giải quyết những gì `redux-thunk` không làm được tốt: **orchestrating complex async flows**.

Saga dùng ES6 generators (`function*`) và effect descriptors — plain objects mô tả side effects. Saga middleware interpret những objects này và thực thi effect thực sự.

```javascript
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';

// Worker saga — xử lý một async flow
function* fetchUserSaga(action) {
  try {
    // call() trả về plain object mô tả "gọi fetchUser với userId"
    // Saga middleware thực sự gọi hàm này
    const user = yield call(fetchUserApi, action.payload.userId);

    // put() mô tả "dispatch action này"
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user });
  } catch (error) {
    yield put({ type: 'FETCH_USER_FAILURE', payload: error.message });
  }
}

// Watcher saga — lắng nghe actions
function* watchFetchUser() {
  // takeLatest: cancel saga đang chạy nếu action mới đến (tránh race condition)
  yield takeLatest('FETCH_USER_REQUEST', fetchUserSaga);
}

// Root saga
function* rootSaga() {
  yield all([
    watchFetchUser(),
    watchSaveProfile(),
    // ... các saga khác
  ]);
}
```

**Saga mạnh ở những use case nào:**

```javascript
// Channel — giao tiếp real-time
function* websocketSaga() {
  const channel = yield call(createWebSocketChannel, 'ws://localhost:3000');
  while (true) {
    const message = yield take(channel); // Chờ message mới
    yield put(receiveMessageAction(message));
  }
}

// Race condition — hủy saga nếu timeout
function* fetchWithTimeout() {
  const { data, timeout } = yield race({
    data: call(fetchApi),
    timeout: delay(5000),
  });
  if (timeout) yield put(timeoutAction());
}

// Sequential async — step 1 xong rồi mới step 2
function* checkoutFlow() {
  yield call(validateCart);
  yield call(processPayment);
  yield call(confirmOrder);
  yield put(checkoutSuccess());
}
```

**Điểm mạnh của redux-saga:**

- Testable: yield effect descriptors là plain objects, dễ assert mà không cần mock
- Cancellation: cancel saga đang chạy là native
- Complex orchestration: race, sequence, parallel, channel

**Điểm yếu:**

- Learning curve rất cao: generators, effect model, channel
- Boilerplate nhiều
- Overengineered cho phần lớn use cases

**Khi nào dùng redux-saga thay vì redux-thunk:**

- Cần cancellation (user navigate đi trước response về)
- Long-running processes (WebSocket, polling)
- Complex sequencing với error handling phức tạp
- Team có kinh nghiệm với generators và functional programming

### 4.4 Redux Toolkit (RTK) — Modern Redux (2019)

Redux Toolkit ra đời từ nhận thức của Redux maintainers rằng vanilla Redux có quá nhiều boilerplate và quá nhiều pitfalls. RTK là **opinionated toolkit** biến Redux thành thứ gì đó dễ dùng hơn nhiều.

#### `createSlice` — Xóa Bỏ Boilerplate

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, status: 'idle' } as CounterState,

  reducers: {
    // RTK dùng Immer — được phép "mutate" state trực tiếp
    increment: (state) => {
      state.value += 1; // Immer convert sang immutable update thực sự
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Action creators được generate tự động
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

**So sánh boilerplate:**

Vanilla Redux cần viết riêng: action type constants, action creator functions, reducer với switch/case, selector functions. Redux Toolkit với `createSlice` generate tất cả từ một định nghĩa duy nhất.

#### `createAsyncThunk` — Async Chuẩn Hóa

```typescript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Thunk với lifecycle actions tự động: pending/fulfilled/rejected
const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId: string, thunkAPI) => {
    const response = await userAPI.fetchById(userId);
    return response.data; // Trở thành payload của fulfilled action
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { user: null, loading: false, error: null },
  reducers: {},

  // Xử lý async lifecycle trong extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});
```

#### `configureStore` — Setup Đơn Giản

```typescript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: usersReducer,
    auth: authReducer,
  },
  // Redux DevTools tự động enabled trong development
  // redux-thunk tự động included
  // Serializable check middleware tự động
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 4.5 RTK Query — Server State Tích Hợp Vào Redux

RTK Query là layer cao nhất trong Redux Toolkit ecosystem, được add vào RTK v1.6 (2021). Nó giải quyết vấn đề mà nhiều team Redux mắc phải: **dùng Redux để store API responses và tự quản lý loading/error/cache thủ công**.

RTK Query cung cấp caching, background refetching, và optimistic updates built-in.

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Định nghĩa API service
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),

  tagTypes: ['Product'], // Dùng để invalidate cache

  endpoints: (builder) => ({
    // Query endpoint — fetch data
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Product'], // Cache được tag là 'Product'
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Mutation endpoint — thay đổi data
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      // Invalidate cache sau khi add — tự động refetch getProducts
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: number; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
} = productsApi;
```

```typescript
// Trong component
function ProductList() {
  const { data, isLoading, error } = useGetProductsQuery()
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation()

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage />

  return (
    <ul>
      {data?.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

**Tính năng quan trọng của RTK Query:**

**Tag-based cache invalidation:** Mutations invalidate specific cache entries, triggering automatic refetch của queries liên quan. Không cần dispatch action thủ công.

**Polling:** `useGetProductsQuery(undefined, { pollingInterval: 3000 })` — tự động refetch mỗi 3 giây.

**Optimistic updates:** Update UI ngay trước khi server response, rollback nếu lỗi.

**Prefetching:** Fetch data trước khi user navigate đến page.

**RTK Query vs TanStack Query:**

|                   | RTK Query                           | TanStack Query                       |
| ----------------- | ----------------------------------- | ------------------------------------ |
| Tích hợp Redux    | Native — data nằm trong Redux store | Không cần Redux                      |
| Bundle size       | Nếu đã dùng Redux: nhỏ hơn          | Thư viện độc lập                     |
| DevTools          | Redux DevTools                      | React Query Devtools riêng           |
| API definition    | Centralized `createApi`             | Phân tán `useQuery` trong components |
| Framework support | React chính                         | React, Vue, Solid, Svelte            |
| Flexibility       | Ít linh hoạt hơn                    | Linh hoạt hơn                        |

**Lựa chọn:**

- Project đã dùng Redux → RTK Query là lựa chọn tự nhiên, tránh thêm dependency
- Project mới không có Redux → TanStack Query có DX tốt hơn, ít boilerplate hơn

---

## Phần 5 — Trục Tiến Hóa Và Các Điểm Thay Thế

### 5.1 Lịch Sử Tuyến Tính

```
2015  Redux ra đời — giải quyết shared state cho SPA phức tạp
        │
        ├── redux-thunk (đã bundled với Redux từ đầu)
        │   → Giải quyết: async actions cơ bản
        │
2017  redux-saga
        │   → Giải quyết: complex async orchestration mà thunk không handle tốt
        │
2018  React Context API chính thức (React 16.3)
        │   → Redux bắt đầu bị đặt câu hỏi "có cần thiết không?"
        │
2019  Redux Toolkit
        │   → Giải quyết: boilerplate của Redux vanilla
        │   → redux-thunk được integrate, trở thành default middleware
        │
2020  use-context-selector
        │   → Giải quyết: re-render cascade của Context thuần
        │
2020  Zustand 3.x stable
        │   → Alternative nhẹ hơn Redux cho client state
        │
2021  RTK Query (Redux Toolkit 1.6)
        │   → Giải quyết: server state management tích hợp Redux
        │   → Cạnh tranh trực tiếp với React Query
        │
2022–2025  TanStack Query v5, Zustand v4/5
            → Ecosystem ổn định, pattern rõ ràng
```

### 5.2 Khi Nào Cái Này Thay Thế Cái Kia

**`redux-thunk` → `redux-saga` (khi async phức tạp hơn)**

Thunk đủ dùng cho 80% use case. Chuyển sang saga khi:

- Cần cancel inflight requests (user navigate đi trong khi đang fetch)
- Long-running processes (WebSocket, SSE polling với reconnect logic)
- Complex sequencing: bước A phải xong trước bước B, bước B thất bại thì retry bước A
- Cần debounce/throttle ở level saga (không phải UI)

**`redux-saga` → `createAsyncThunk` (khi RTK simplifies đủ rồi)**

RTK's `createAsyncThunk` + `AbortController` xử lý được phần lớn những gì saga làm, với ít boilerplate hơn nhiều. Saga chỉ còn justified khi genuinely cần generator-based orchestration.

**Redux vanilla → Redux Toolkit (không có lý do không dùng RTK)**

Với project mới, không có lý do nào để không dùng RTK. Với project cũ dùng Redux vanilla, migrate từng slice sang RTK là hoàn toàn khả thi và được khuyến nghị.

**Redux + self-managed server state → RTK Query hoặc TanStack Query**

Nếu đang nhét API response vào Redux và tự quản lý `loading`, `error`, `lastFetched`, `isCacheValid` — đây là anti-pattern. Chuyển sang RTK Query (nếu đang trong Redux ecosystem) hoặc TanStack Query (nếu muốn tách khỏi Redux).

**Redux → Zustand (khi không cần Redux features)**

Zustand phù hợp thay thế Redux khi:

- Project không quá lớn (< 10 developers, < 50 slices)
- Không cần Redux DevTools time-travel (Zustand devtools ít powerful hơn)
- Team không quen với Redux mental model
- Không dùng RTK Query (nếu đã dùng RTK Query, gắn với Redux là hợp lý)

**Context → `use-context-selector` → Zustand (escalation path)**

Đây là escalation path tự nhiên cho client state không đến từ server:

1. Dùng Context thuần cho state ít update (theme, language, auth)
2. Nếu re-render trở thành vấn đề, thêm `use-context-selector`
3. Nếu cần middleware, devtools, persist — chuyển sang Zustand

---

## Phần 6 — Decision Matrix Cuối

### 6.1 Chọn Async Middleware Cho Redux

```
Async logic có phức tạp không?
│
├── Không (fetch + loading/error state đơn giản)
│   └── createAsyncThunk (RTK) — đủ dùng, ít code
│
├── Phức tạp vừa (race condition, retry, timeout)
│   └── createAsyncThunk + AbortController — vẫn manage được
│
└── Rất phức tạp (long-running, WebSocket, complex orchestration)
    └── redux-saga — justified khi genuinely cần generator model
```

### 6.2 Chọn Giữa Zustand và Redux

```
Cần predictable audit trail với DevTools time-travel?         → Redux
Team lớn, cần enforce strict patterns?                        → Redux
Đã có Redux trong project, thêm server state?                 → RTK Query
Project mới, team nhỏ-vừa, client state global?              → Zustand
Muốn lightweight, ít boilerplate, không cần strict pattern?  → Zustand
```

### 6.3 Stack Phân Tầng Theo Trách Nhiệm

```
SERVER STATE (data từ API)
  └── RTK Query           — nếu project đang dùng Redux
  └── TanStack Query      — nếu project không dùng Redux

CLIENT STATE GLOBAL (cart, UI state phức tạp)
  └── Zustand             — cho project mới hoặc không cần Redux ecosystem
  └── Redux Toolkit       — cho team lớn, enterprise, cần strict predictability

CLIENT STATE LOCAL (chỉ 1-2 component)
  └── useState / useReducer

SHARED STATE ÍT UPDATE (theme, auth, i18n)
  └── Context + use-context-selector (nếu performance là vấn đề)
  └── Context thuần (nếu update rất hiếm)

ASYNC SIDE EFFECTS (trong Redux ecosystem)
  └── createAsyncThunk    — default choice
  └── redux-saga          — khi genuinely cần complex orchestration
```

---

## Tóm Lược

Hệ sinh thái này không có "winner takes all". Mỗi thư viện giải quyết một vấn đề cụ thể ở một thời điểm cụ thể:

- **redux-thunk** đặt nền tảng cho async trong Redux, vẫn đủ dùng cho phần lớn cases.
- **redux-saga** giải quyết complexity mà thunk không handle được, nhưng learning curve cao.
- **Redux Toolkit** là Redux đúng cách — loại bỏ boilerplate, tích hợp Immer và devtools.
- **RTK Query** là server state management cho Redux ecosystem — không cần TanStack Query nếu đã trong RTK.
- **Zustand** là client global state nhẹ hơn Redux, phù hợp khi không cần toàn bộ Redux ecosystem.
- **use-context-selector** là nâng cấp Context thuần, giải quyết re-render mà không cần thêm thư viện lớn.

Quyết định đúng không phải là chọn cái "tốt nhất" — mà là chọn cái **đủ mạnh cho vấn đề hiện tại**, không over-engineer, và không under-engineer đến mức phải refactor lại sau.

---

# Curriculum Toàn Diện: State Management Trong React

> **Mục tiêu:** Hiểu đủ sâu để đưa ra quyết định tech stack và kiến trúc — không phải chỉ biết dùng API.  
> **Cấu trúc:** 8 Module, từ nền tảng JavaScript đến architecture-level decisions.

---

# MODULE 1 — Nền Tảng: State Là Gì Và Tại Sao Nó Khó

## 1.1 State Là Gì (Định Nghĩa Kỹ Thuật)

State là dữ liệu có hai đặc điểm:

1. Nó **thay đổi theo thời gian**
2. Khi nó thay đổi, **UI cần phản ánh sự thay đổi đó**

Phân biệt với:

- **Props:** Dữ liệu đọc vào từ bên ngoài, component không sở hữu
- **Derived data:** Tính toán từ state, không cần lưu riêng
- **Constants:** Không thay đổi, không phải state
- **Refs:** Thay đổi nhưng không trigger re-render

```tsx
// State — thay đổi và trigger re-render
const [count, setCount] = useState(0);

// Derived data — ĐỪNG lưu vào state, tính từ state
const doubled = count * 2; // Không cần useState

// Ref — thay đổi nhưng không render
const timerRef = useRef<NodeJS.Timeout>();

// Constant — không phải state
const MAX_COUNT = 100;
```

**Sai lầm phổ biến nhất:** Lưu derived data vào state.

```tsx
// ❌ Anti-pattern: derived state
const [firstName, setFirstName] = useState('John');
const [lastName, setLastName] = useState('Doe');
const [fullName, setFullName] = useState('John Doe'); // BUG: có thể out of sync

// ✅ Đúng: tính toán khi render
const [firstName, setFirstName] = useState('John');
const [lastName, setLastName] = useState('Doe');
const fullName = `${firstName} ${lastName}`; // Luôn đúng
```

## 1.2 Hai Loại State — Phân Loại Cốt Lõi

Đây là nền tảng của mọi quyết định architecture. Hiểu sai điều này thì mọi thứ sau đều sai.

### Client State (UI State)

- **Sở hữu bởi:** Frontend
- **Server có biết không:** Không, và không cần biết
- **Nguồn gốc:** Do user interaction sinh ra
- **Ví dụ:** Modal đang mở/đóng, tab đang active, theme dark/light, form chưa submit, selected items, sidebar collapsed

Đặc điểm kỹ thuật:

- Synchronous — thay đổi ngay lập tức
- No staleness — không có khái niệm "outdated"
- No caching concern — không cần cache
- No background sync

### Server State (Remote State)

- **Sở hữu bởi:** Server/database
- **Frontend chỉ:** Hiển thị một bản copy tại một thời điểm
- **Nguồn gốc:** Fetch từ API
- **Ví dụ:** User profile, danh sách sản phẩm, orders, comments

Đặc điểm kỹ thuật:

- Asynchronous — phải chờ network
- **Có thể stale** — bản copy trên client có thể cũ hơn server
- Cần caching — tránh fetch lại không cần thiết
- Cần background sync — tự động refresh
- Cần deduplication — nhiều component cùng cần data, chỉ fetch một lần

```
Server State problems mà Frontend phải giải quyết:
┌────────────────────────────────────────────────────┐
│  Loading state    → Đang fetch, show spinner        │
│  Error state      → Fetch thất bại, show error      │
│  Stale data       → Khi nào refetch?                │
│  Cache            → Lưu bao lâu?                    │
│  Deduplication    → Nhiều component cùng fetch?     │
│  Background sync  → Tự động update khi focus lại?   │
│  Pagination       → Fetch page tiếp theo thế nào?   │
│  Optimistic UI    → Update trước khi server xác nhận│
└────────────────────────────────────────────────────┘
```

**Đây là lý do** không dùng Redux (tool cho client state) để quản lý server state — Redux không có cơ chế native nào cho tất cả các vấn đề trên.

## 1.3 Tại Sao React State Management Không Trivial

React có `useState` — tại sao cần thêm gì?

**Vấn đề 1: Prop Drilling**

```
App
└── Dashboard
    └── Sidebar
        └── UserMenu
            └── Avatar  ← component này cần `user`
```

Không có state management: `user` phải đi qua Dashboard → Sidebar → UserMenu → Avatar dù các tầng trung gian không cần nó. Mỗi tầng trung gian bị "ô nhiễm" với props chỉ để chuyển tiếp.

**Vấn đề 2: Sibling State Sharing**

```
App
├── ProductList ← cần biết filters đang active
└── FilterPanel ← user thay đổi filters ở đây
```

Hai component không có quan hệ cha-con trực tiếp. Để share state, phải "lift state up" lên App — nhưng nếu App có hàng trăm state? App trở thành God Component.

**Vấn đề 3: State Consistency**

```
Header (hiển thị cart count)
ProductPage (có thể add to cart)
CartPage (hiển thị và modify cart)
```

Ba component cần đọc và modify cùng một cart data. Làm sao đảm bảo mọi nơi đều thấy giá trị mới nhất sau khi modify?

State management libraries giải quyết những vấn đề này bằng cách tạo một "global store" nằm ngoài component tree — mọi component có thể đọc và ghi vào đó.

---

# MODULE 2 — Local State: useState và useReducer

## 2.1 useState — Cơ Bản Nhưng Có Nhiều Subtlety

```tsx
const [state, setState] = useState(initialValue);
```

### Functional Update — Quan Trọng Hơn Bạn Nghĩ

```tsx
// ❌ Bug tiềm ẩn khi updates bất đồng bộ hoặc stale closure
setCount(count + 1); // Đọc count từ closure — có thể stale

// ✅ Functional update — luôn nhận current state
setCount((prev) => prev + 1); // prev là giá trị thực sự mới nhất

// Ví dụ bug thực tế:
function handleTripleClick() {
  setCount(count + 1); // count = 0, set 1
  setCount(count + 1); // count = 0 (stale!), set 1 again
  setCount(count + 1); // count = 0 (stale!), set 1 again
  // Kết quả: count = 1, không phải 3

  // ✅ Fix:
  setCount((prev) => prev + 1); // 0 → 1
  setCount((prev) => prev + 1); // 1 → 2
  setCount((prev) => prev + 1); // 2 → 3
  // Kết quả: count = 3
}
```

### Lazy Initialization — Tránh Tính Toán Đắt Tiền Mỗi Render

```tsx
// ❌ Hàm được gọi mỗi lần render dù chỉ cần kết quả lần đầu
const [data, setData] = useState(expensiveComputation());

// ✅ Lazy initializer — chỉ gọi một lần
const [data, setData] = useState(() => expensiveComputation());

// Ví dụ thực tế: đọc localStorage
const [theme, setTheme] = useState(
  () => localStorage.getItem('theme') ?? 'light',
);
```

### State Batching

React 18 automatic batching — nhiều setState trong cùng event handler chỉ trigger một re-render:

```tsx
function handleClick() {
  setCount((c) => c + 1); // Không re-render ngay
  setName('Alice'); // Không re-render ngay
  setVisible(true); // Không re-render ngay
  // Chỉ một re-render duy nhất sau tất cả
}

// Trước React 18, batching chỉ hoạt động trong event handlers
// Trong setTimeout, Promise, native event handlers — không batch
// React 18: tất cả đều được batch
```

## 2.2 useReducer — Khi State Logic Phức Tạp

`useReducer` phù hợp khi:

- State là object có nhiều sub-fields liên quan
- State tiếp theo phụ thuộc vào state trước
- Nhiều actions dẫn đến cùng kiểu update

```tsx
type State = {
  count: number;
  step: number;
  history: number[];
};

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, state.count + state.step],
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - state.step,
        history: [...state.history, state.count - state.step],
      };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'RESET':
      return { count: 0, step: 1, history: [] };
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    step: 1,
    history: [],
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

**Lợi ích của useReducer so với useState:**

- State transitions tường minh — đọc reducer là hiểu được tất cả cách state thay đổi
- Testable — reducer là pure function, test không cần React
- Centralized logic — không rải setState khắp nơi trong component

```tsx
// Test reducer — không cần mount component
describe('counterReducer', () => {
  it('increments by step', () => {
    const state = { count: 5, step: 3, history: [] };
    const newState = reducer(state, { type: 'INCREMENT' });
    expect(newState.count).toBe(8);
    expect(newState.history).toContain(8);
  });
});
```

## 2.3 Khi Nào Dùng useState vs useReducer

```
State là primitive (number, string, boolean)?          → useState
State là object với nhiều fields độc lập?              → useState (nhiều useState)
State là object với nhiều fields liên quan nhau?        → useReducer
Nhiều actions dẫn đến update phức tạp?                 → useReducer
Cần audit trail (lịch sử thay đổi)?                    → useReducer
State logic cần tách ra và test riêng?                  → useReducer
```

---

# MODULE 3 — React Context: Đúng Dùng, Đúng Chỗ

## 3.1 Context API — Cơ Chế Hoạt Động

Context là cơ chế "broadcast" — Provider phát dữ liệu, Consumer nhận. Không có data transformation, không có caching, không có middleware.

```tsx
// 1. Tạo Context
const AuthContext = React.createContext<AuthState | null>(null);

// 2. Custom hook để access
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

// 3. Provider
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: Credentials) => {
    const user = await authAPI.login(credentials);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
  }, []);

  // useMemo tránh tạo object mới mỗi lần render
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Sử dụng
function UserMenu() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>Logout {user?.name}</button>;
}
```

## 3.2 Re-render Cascade — Vấn Đề Cốt Lõi Của Context

Đây là điều quan trọng nhất khi hiểu giới hạn của Context.

**Quy tắc của React:** Khi `value` của Provider thay đổi (so sánh bằng `Object.is`), **mọi component đang gọi `useContext` với context đó đều re-render**, bất kể component đó có dùng phần nào của value không.

```tsx
const StoreContext = createContext({
  user: null,
  cart: [],
  theme: 'light',
  notifications: [],
});

function ProfilePic() {
  const { user } = useContext(StoreContext);
  // Component này chỉ cần user
  // Nhưng sẽ re-render khi cart, theme, hoặc notifications thay đổi
  return <img src={user?.avatar} />;
}
```

**Tại sao `useMemo` trên value không đủ:**

```tsx
// Provider với useMemo
const value = useMemo(() => ({ user, cart, theme }), [user, cart, theme]);

// Vẫn re-render tất cả consumers khi cart thay đổi
// Dù ProfilePic chỉ cần user
// useMemo chỉ tránh tạo object mới, không tránh được re-render cascade
```

**Giải pháp 1: Tách Context**

```tsx
// Tách thành nhiều Context — mỗi Context chỉ chứa data liên quan
const UserContext = createContext<User | null>(null);
const CartContext = createContext<Cart>({ items: [] });
const ThemeContext = createContext<'light' | 'dark'>('light');

// ProfilePic chỉ subscribe UserContext — không re-render khi cart thay đổi
function ProfilePic() {
  const user = useContext(UserContext); // Chỉ re-render khi user thay đổi
  return <img src={user?.avatar} />;
}
```

Vấn đề: Nếu có 10 loại state, cần 10 Context và 10 Provider lồng nhau — messy.

**Giải pháp 2: `use-context-selector`**

## 3.3 use-context-selector — Selective Subscription

`use-context-selector` cho phép chỉ subscribe vào một phần của Context value mà không cần tách Context:

```tsx
import { createContext, useContextSelector } from 'use-context-selector';

// Thay React.createContext bằng createContext từ use-context-selector
interface AppState {
  user: User | null;
  cart: CartItem[];
  theme: 'light' | 'dark';
  notifications: Notification[];
}

const AppContext = createContext<AppState>({
  user: null,
  cart: [],
  theme: 'light',
  notifications: [],
});

function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

// Chỉ re-render khi user.name thay đổi
function UserGreeting() {
  const userName = useContextSelector(AppContext, (s) => s.user?.name);
  return <span>Hello, {userName}</span>;
}

// Chỉ re-render khi cart.length thay đổi
function CartBadge() {
  const cartCount = useContextSelector(AppContext, (s) => s.cart.length);
  return <span>{cartCount}</span>;
}

// Chỉ re-render khi theme thay đổi
function ThemeToggle() {
  const theme = useContextSelector(AppContext, (s) => s.theme);
  return <button>{theme}</button>;
}
```

**Cơ chế hoạt động bên trong:**

```
Context value thay đổi
    │
    ▼
use-context-selector chạy lại selector của mỗi consumer
    │
    ├── selector(newValue) === selector(oldValue)?
    │   Yes → Không re-render component này
    │
    └── selector(newValue) !== selector(oldValue)?
        Yes → Re-render component này
```

So sánh được thực hiện bằng `Object.is` mặc định. Nếu selector trả về object, cần custom equality hoặc memoize selector:

```tsx
// ❌ Object mới mỗi lần — luôn re-render
const userInfo = useContextSelector(ctx, (s) => ({
  name: s.user?.name,
  avatar: s.user?.avatar,
}));

// ✅ Selector ổn định hoặc dùng useCallback
const selectUserInfo = useCallback(
  (s: AppState) => ({ name: s.user?.name, avatar: s.user?.avatar }),
  [],
);
// use-context-selector sẽ so sánh shallow cho object selectors
```

**Khi nào dùng `use-context-selector` thay vì tách Context:**

- State logic gắn chặt nhau, không muốn tách thành nhiều Provider
- Muốn giữ một dispatch function duy nhất
- Performance issue với Context thuần nhưng không muốn thêm Zustand/Redux

---

# MODULE 4 — Zustand: Modern Client State

## 4.1 Mental Model

Zustand không phải là Context wrapper hay Redux lite. Nó là một mô hình khác hoàn toàn:

```
Redux model:     Component → dispatch(action) → reducer → store → component re-render
Context model:   Component → setState → Provider value changes → consumers re-render
Zustand model:   Store là một closure JavaScript.
                 Components subscribe trực tiếp.
                 Không có dispatch, không có reducer bắt buộc, không có Provider.
```

Store của Zustand tồn tại độc lập với React. Có thể đọc và ghi từ bất kỳ đâu — trong component, trong event handlers thuần, trong utility functions.

## 4.2 Core API — Từng Khái Niệm

### `create` — Tạo Store

```tsx
import { create } from 'zustand';

// Signature: create<StateType>()(stateCreator)
// Lưu ý cặp ngoặc kép ()() khi dùng TypeScript — required cho inference
const useStore = create<State>()((set, get) => ({
  // State fields
  count: 0,
  user: null,

  // Actions — hàm thay đổi state
  increment: () => set((state) => ({ count: state.count + 1 })),

  // Action dùng state hiện tại (dùng get() thay vì set nếu chỉ đọc)
  doubleCount: () => set({ count: get().count * 2 }),

  // Async action — không cần middleware đặc biệt
  fetchUser: async (id: string) => {
    const user = await userAPI.getById(id);
    set({ user });
  },
}));
```

**`set` function — hiểu sâu:**

```tsx
// set(partial) — merge partial state với state hiện tại (shallow merge)
set({ count: 5 }); // { count: 5, user: ..., ... } — user không đổi

// set(updater) — functional update nhận state hiện tại
set((state) => ({ count: state.count + 1 }));

// set(partial, replace=true) — replace toàn bộ state (không merge)
set({ count: 0 }, true); // Mất toàn bộ các fields khác!
```

### Selectors — Selective Subscription

```tsx
// Selector function quyết định component subscribe vào gì
const count = useStore((state) => state.count);
// Component chỉ re-render khi count thay đổi

// Không dùng selector — re-render mỗi khi ANY state thay đổi
const state = useStore(); // Anti-pattern

// Multiple values với shallow equality
import { useShallow } from 'zustand/react/shallow';

const { count, user } = useStore(
  useShallow((state) => ({ count: state.count, user: state.user })),
);
// Re-render khi count hoặc user thay đổi
// Nhưng không re-render khi chỉ các fields khác thay đổi
// shallow so sánh từng field của object — không re-render nếu giá trị như cũ
```

**Custom equality function:**

```tsx
// Kiểm soát hoàn toàn khi nào re-render
const items = useStore(
  (state) => state.items,
  (prevItems, nextItems) => prevItems.length === nextItems.length,
  // Chỉ re-render khi số lượng items thay đổi, không quan tâm nội dung
);
```

## 4.3 Middleware — Extend Store

Middleware trong Zustand là **higher-order function** — nhận state creator và trả về state creator đã được enhance.

### `persist` Middleware

```tsx
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'shopping-cart', // Key trong storage
      storage: createJSONStorage(() => localStorage), // Default

      // Chỉ persist một phần state
      partialize: (state) => ({ items: state.items }),
      // Actions không được persist (và không cần — chúng là functions)

      // Migration khi state shape thay đổi
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          // Migrate từ v1 sang v2
          return {
            ...persistedState,
            items: persistedState.items.map((item: any) => ({
              ...item,
              addedAt: item.addedAt ?? Date.now(), // Field mới
            })),
          };
        }
        return persistedState;
      },
    },
  ),
);
```

### `immer` Middleware — Mutable Syntax

```tsx
import { immer } from 'zustand/middleware/immer';

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}

const useTodoStore = create<TodoState>()(
  immer((set) => ({
    todos: [],

    addTodo: (text) =>
      set((state) => {
        // Với immer, được phép mutate directly — Immer tạo immutable copy
        state.todos.push({ id: crypto.randomUUID(), text, done: false });
      }),

    toggleTodo: (id) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === id);
        if (todo) todo.done = !todo.done; // Mutate trực tiếp
      }),

    updateTodo: (id, updates) =>
      set((state) => {
        const idx = state.todos.findIndex((t) => t.id === id);
        if (idx !== -1) {
          state.todos[idx] = { ...state.todos[idx], ...updates };
        }
      }),
  })),
);
```

So sánh Immer vs không Immer cho nested update:

```tsx
// Không Immer — phải spread từng level
set((s) => ({
  user: {
    ...s.user,
    address: {
      ...s.user.address,
      city: 'New City',
    },
  },
}));

// Với Immer — đọc như mutable code
set((s) => {
  s.user.address.city = 'New City';
});
```

### `devtools` Middleware — Redux DevTools Integration

```tsx
import { devtools } from 'zustand/middleware';

const useStore = create<State>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () =>
        set(
          (s) => ({ count: s.count + 1 }),
          false, // replace=false (merge)
          'increment', // Action name trong DevTools
        ),
    }),
    {
      name: 'MyStore', // Store name trong DevTools
    },
  ),
);
```

### Kết Hợp Nhiều Middleware

```tsx
// Thứ tự quan trọng — devtools phải ở ngoài cùng để capture mọi thứ
const useStore = create<State>()(
  devtools(
    persist(
      immer((set, get) => ({
        // state và actions
      })),
      { name: 'app-storage' },
    ),
    { name: 'AppStore' },
  ),
);
```

## 4.4 Slice Pattern — Tổ Chức Store Lớn

Khi store phình to, dùng slice pattern để chia theo domain:

```tsx
// slices/userSlice.ts
import { StateCreator } from 'zustand';
import type { StoreState } from '../store';

export interface UserSlice {
  user: User | null;
  isLoggedIn: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const createUserSlice: StateCreator<
  StoreState, // Toàn bộ store state
  [],
  [],
  UserSlice // Chỉ phần này
> = (set) => ({
  user: null,
  isLoggedIn: false,
  login: async (credentials) => {
    const user = await authAPI.login(credentials);
    set({ user, isLoggedIn: true });
  },
  logout: () => set({ user: null, isLoggedIn: false }),
});

// slices/cartSlice.ts
export interface CartSlice {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

export const createCartSlice: StateCreator<StoreState, [], [], CartSlice> = (
  set,
) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
});

// store.ts
import { create } from 'zustand';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createCartSlice, CartSlice } from './slices/cartSlice';

export type StoreState = UserSlice & CartSlice;

export const useStore = create<StoreState>()((...args) => ({
  ...createUserSlice(...args),
  ...createCartSlice(...args),
}));
```

## 4.5 Subscribe Bên Ngoài React

Zustand store có thể được subscribe và đọc bên ngoài React component — hữu ích cho utility functions, event listeners:

```tsx
const useStore = create<State>()(...)

// Đọc state hiện tại bất kỳ lúc nào
const currentCount = useStore.getState().count

// Subscribe vào changes bên ngoài component
const unsubscribe = useStore.subscribe(
  (state) => state.count,        // Selector
  (count) => {
    console.log('Count changed:', count)
    analytics.track('count_changed', { count })
  }
)

// Hủy subscribe khi không cần
unsubscribe()

// Dispatch action bên ngoài component
function handleSocketMessage(data: CartUpdate) {
  useStore.getState().updateCart(data)
}
```

---

# MODULE 5 — Redux Ecosystem: Từ Vanilla Đến RTK

## 5.1 Redux Core Concepts — Nền Tảng Không Thể Bỏ Qua

Dù sẽ dùng Redux Toolkit thay vì vanilla Redux, cần hiểu những khái niệm nền tảng vì RTK build trên chúng.

### The Three Laws

**Law 1: Single Source of Truth**

Toàn bộ application state nằm trong một object tree duy nhất, trong một store duy nhất. Lợi ích: dễ debug (một nơi để xem toàn bộ state), dễ serialize/deserialize, dễ time-travel debugging.

**Law 2: State Is Read-Only**

State không bao giờ được mutate trực tiếp. Cách duy nhất để thay đổi là dispatch action. Action là plain JavaScript object mô tả "điều gì đó đã xảy ra".

```tsx
// ❌ KHÔNG BAO GIỜ làm thế này
store.getState().user.name = 'Alice'; // Direct mutation — breaks everything

// ✅ Dispatch action
store.dispatch({ type: 'user/nameChanged', payload: 'Alice' });
```

**Law 3: Changes via Pure Reducers**

Reducer nhận state hiện tại và action, trả về state mới. Pure function — không có side effects, không có API calls, không có randomness, không modify arguments.

```tsx
function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'user/nameChanged':
      return { ...state, name: action.payload }; // Immutable — không mutate state
    default:
      return state;
  }
}
```

### Data Flow Unidirectional

```
User interaction (click button)
        ↓
Component calls dispatch(action)
        ↓
Redux calls reducer(currentState, action)
        ↓
Reducer returns new state
        ↓
Store notifies subscribed components
        ↓
Components re-render với new state
```

### Selectors

Selectors là functions tính toán derived data từ Redux state. Quan trọng vì:

1. Tách component khỏi state shape — refactor store không break components
2. Memoization với `reselect` — tránh tính toán lại khi state không liên quan thay đổi

```tsx
// Simple selector
const selectUser = (state: RootState) => state.user;

// Derived selector
const selectUserFullName = (state: RootState) =>
  `${state.user.firstName} ${state.user.lastName}`;

// Memoized selector với createSelector (reselect)
import { createSelector } from '@reduxjs/toolkit';

const selectItems = (state: RootState) => state.cart.items;
const selectTaxRate = (state: RootState) => state.settings.taxRate;

const selectCartTotal = createSelector(
  [selectItems, selectTaxRate],
  (items, taxRate) => {
    // Hàm này CHỈ chạy lại khi items hoặc taxRate thay đổi
    // Nếu không đổi → trả về cached result
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    return subtotal * (1 + taxRate);
  },
);
```

## 5.2 Middleware Trong Redux — Cơ Chế

Middleware là extension point của Redux — can thiệp vào dispatch pipeline:

```
dispatch(action)
    ↓
[middleware 1] → [middleware 2] → [middleware 3] → [reducer]
```

Mỗi middleware có signature: `store => next => action => ...`

```tsx
// Custom logger middleware
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Before:', store.getState());
  console.log('Action:', action);
  const result = next(action); // Chuyển cho middleware tiếp theo
  console.log('After:', store.getState());
  return result;
};

// Thunk middleware (đơn giản đến bất ngờ — chỉ 14 lines)
const thunkMiddleware = (store) => (next) => (action) => {
  // Nếu action là function → gọi nó với dispatch và getState
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  // Nếu là plain object → chuyển như bình thường
  return next(action);
};
```

## 5.3 redux-thunk — Async Actions

`redux-thunk` cho phép action creators trả về function thay vì plain object. Function đó nhận `dispatch` và `getState`.

```tsx
// Thunk action creator — function trả về function
const fetchUserThunk =
  (userId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    // Kiểm tra cache trước khi fetch
    const existingUser = getState().users.cache[userId];
    if (existingUser) return; // Đã có, không cần fetch

    dispatch({ type: 'users/fetchStart', payload: userId });

    try {
      const user = await userAPI.getById(userId);
      dispatch({ type: 'users/fetchSuccess', payload: user });
    } catch (error) {
      dispatch({
        type: 'users/fetchFailure',
        payload: { userId, error: String(error) },
      });
    }
  };

// Sử dụng
dispatch(fetchUserThunk('user-123'));
```

**Thunk với TypeScript — typed dispatch:**

```tsx
// Tạo typed dispatch
import { useDispatch } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Trong component
const dispatch = useAppDispatch();
dispatch(fetchUserThunk('user-123')); // TypeScript hiểu đây là thunk
```

**Giới hạn của thunk:**

```tsx
// Complex orchestration với thunk — rất verbose
const complexFlowThunk = () => async (dispatch, getState) => {
  dispatch({ type: 'flow/start' });
  try {
    const result1 = await api.step1();
    dispatch({ type: 'flow/step1Done', payload: result1 });

    const result2 = await api.step2(result1.id);
    dispatch({ type: 'flow/step2Done', payload: result2 });

    // Nếu user navigate away trong khi đang chạy?
    // Nếu cần cancel? Thunk không có built-in cancellation
    // Nếu cần retry với exponential backoff? Phải tự implement

    dispatch({ type: 'flow/done' });
  } catch (error) {
    dispatch({ type: 'flow/error', payload: error });
  }
};
```

## 5.4 redux-saga — Orchestrating Complex Async

### Generator Functions — Nền Tảng Cần Hiểu

Saga dùng generator functions. Generator là function có thể pause và resume:

```javascript
function* counter() {
  yield 1; // Pause, trả về { value: 1, done: false }
  yield 2; // Pause, trả về { value: 2, done: false }
  yield 3; // Pause, trả về { value: 3, done: false }
  return 4; // End, trả về { value: 4, done: true }
}

const gen = counter();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: 4, done: true }
```

Saga middleware **controls** việc chạy generator. Mỗi `yield` là một điểm pause — saga middleware nhìn vào "effect descriptor" được yield ra và thực hiện side effect thực sự.

### Effect Descriptors — Trái Tim Của Saga

Effect descriptors là **plain JavaScript objects** mô tả side effects. Saga middleware interpret chúng:

```tsx
import {
  call,
  put,
  take,
  select,
  fork,
  all,
  race,
  delay,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

function* exampleSaga() {
  // call() — gọi function (async hoặc sync), chờ result
  const user = yield call(userAPI.getById, 'user-123');
  //           ↑ trả về plain object: { type: 'CALL', fn: userAPI.getById, args: ['user-123'] }
  //             Saga middleware thực sự gọi hàm và trả result về cho generator

  // put() — dispatch action
  yield put({ type: 'users/loaded', payload: user });
  //    ↑ trả về: { type: 'PUT', action: { type: 'users/loaded', payload: user } }

  // select() — đọc từ Redux state
  const currentUser = yield select((state) => state.auth.user);

  // take() — chờ action
  const action = yield take('user/updateRequest');

  // delay() — chờ milliseconds
  yield delay(1000);
}
```

**Tại sao plain objects quan trọng:** Dễ test. Test không phải call API thật, chỉ assert rằng saga yield đúng effect descriptor:

```tsx
import { call, put } from 'redux-saga/effects';

function* fetchUserSaga(action) {
  const user = yield call(userAPI.getById, action.payload);
  yield put({ type: 'users/loaded', payload: user });
}

// TEST — không cần mock API, không cần Redux store
it('fetches user', () => {
  const gen = fetchUserSaga({ payload: 'user-123' });

  // Assert step 1: phải call đúng function với đúng args
  expect(gen.next().value).toEqual(call(userAPI.getById, 'user-123'));

  // Inject fake user (không cần gọi API thật)
  const fakeUser = { id: 'user-123', name: 'Alice' };

  // Assert step 2: phải dispatch đúng action với đúng payload
  expect(gen.next(fakeUser).value).toEqual(
    put({ type: 'users/loaded', payload: fakeUser }),
  );

  // Done
  expect(gen.next().done).toBe(true);
});
```

### Watcher Patterns

```tsx
// takeEvery — xử lý mọi action, không cancel cái đang chạy
function* watchFetch() {
  yield takeEvery('fetch/request', fetchSaga);
  // Nếu 3 fetch/request đến → 3 saga chạy song song
}

// takeLatest — cancel saga đang chạy, chỉ giữ cái mới nhất
function* watchSearch() {
  yield takeLatest('search/changed', searchSaga);
  // User gõ 'a', 'ab', 'abc' → chỉ 'abc' được xử lý
  // Quan trọng cho search-as-you-type, tránh race condition
}

// takeLeading — bỏ qua action nếu đang có saga chạy
function* watchSubmit() {
  yield takeLeading('form/submit', submitSaga);
  // Tránh double submit khi user click nhanh
}
```

### Complex Patterns

```tsx
// Race — cái nào xong trước, cancel cái kia
function* fetchWithTimeout(action) {
  const { data, timeout } = yield race({
    data: call(api.fetchData, action.payload),
    timeout: delay(5000),
  });

  if (timeout) {
    yield put({ type: 'fetch/timeout' });
  } else {
    yield put({ type: 'fetch/success', payload: data });
  }
}

// Channel — WebSocket / event stream
import { eventChannel, END } from 'redux-saga';

function createWebSocketChannel(url) {
  return eventChannel((emit) => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => emit(JSON.parse(event.data));
    ws.onerror = (error) => emit(new Error(error));
    ws.onclose = () => emit(END); // Đóng channel

    // Cleanup function
    return () => ws.close();
  });
}

function* websocketSaga() {
  const channel = yield call(createWebSocketChannel, 'wss://api.example.com');

  try {
    while (true) {
      const message = yield take(channel);
      yield put({ type: 'ws/messageReceived', payload: message });
    }
  } finally {
    // Cleanup khi saga bị cancel
    channel.close();
  }
}

// Complex sequential flow với cancellation
function* checkoutFlowSaga() {
  yield put({ type: 'checkout/started' });

  try {
    // Bước 1: Validate cart
    const cart = yield select((s) => s.cart);
    yield call(validateCart, cart);
    yield put({ type: 'checkout/cartValidated' });

    // Bước 2: Chờ user confirm
    const { confirmed, cancelled } = yield race({
      confirmed: take('checkout/confirmed'),
      cancelled: take('checkout/cancelled'),
    });

    if (cancelled) {
      yield put({ type: 'checkout/aborted' });
      return;
    }

    // Bước 3: Process payment
    yield call(processPayment, confirmed.payload);
    yield put({ type: 'checkout/paymentProcessed' });

    // Bước 4: Confirm order
    const order = yield call(confirmOrder);
    yield put({ type: 'checkout/completed', payload: order });
  } catch (error) {
    yield put({ type: 'checkout/failed', payload: error.message });
    yield call(rollbackTransaction);
  }
}
```

## 5.5 Redux Toolkit — Modern Redux

### createSlice — Xóa Boilerplate

`createSlice` là core API của RTK. Nó generate action types, action creators, và reducer từ một định nghĩa duy nhất, sử dụng Immer để cho phép "mutable" syntax:

```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: User | null;
  preferences: UserPreferences;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  preferences: { theme: 'light', language: 'en' },
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user', // Prefix cho action types
  initialState,

  reducers: {
    // Immer cho phép "mutate" — thực ra tạo immutable copy
    profileUpdated: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        Object.assign(state.profile, action.payload);
      }
    },

    themeChanged: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.preferences.theme = action.payload; // "Mutation" với Immer
    },

    loggedOut: (state) => {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

// Action types generated: 'user/profileUpdated', 'user/themeChanged', 'user/loggedOut'
// Action creators generated: userSlice.actions.profileUpdated, etc.
export const { profileUpdated, themeChanged, loggedOut } = userSlice.actions;
export default userSlice.reducer;
```

### createAsyncThunk — Chuẩn Hóa Async

```tsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// createAsyncThunk tự động tạo 3 action types:
// 'users/fetchById/pending'
// 'users/fetchById/fulfilled'
// 'users/fetchById/rejected'

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId: string, thunkAPI) => {
    // thunkAPI cung cấp: dispatch, getState, rejectWithValue, signal (AbortSignal)

    // Kiểm tra state trước khi fetch
    const { users } = thunkAPI.getState() as RootState;
    if (users.entities[userId]) {
      return users.entities[userId]; // Return cached data
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: thunkAPI.signal, // Cho phép cancel khi component unmount
      });
      if (!response.ok) throw new Error('Server error');
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      throw error;
    }
  },
  {
    // Condition function — không dispatch nếu điều kiện không thỏa
    condition: (userId, { getState }) => {
      const { users } = getState() as RootState;
      if (users.status === 'loading') return false; // Đang load rồi, bỏ qua
    },
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    entities: {} as Record<string, User>,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
  },
  reducers: {},

  // Xử lý async thunk lifecycle
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities[action.payload.id] = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) ?? action.error.message ?? 'Unknown error';
      });
  },
});
```

**Cancellation với createAsyncThunk:**

```tsx
// Trong component — cancel khi unmount
useEffect(() => {
  const promise = dispatch(fetchUserById('user-123'));

  return () => {
    promise.abort(); // Cancel inflight request
  };
}, []);
```

### createEntityAdapter — Normalized State

Khi store collections (arrays của entities), `createEntityAdapter` cung cấp normalized state structure và CRUD operations:

```tsx
import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  price: number;
}

// Adapter tạo normalized state: { ids: [...], entities: { id: Product } }
const productsAdapter = createEntityAdapter<Product>({
  sortComparer: (a, b) => a.name.localeCompare(b.name), // Sort khi add
});

const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await fetch('/api/products');
  return res.json() as Promise<Product[]>;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState({
    status: 'idle' as const,
  }),
  reducers: {
    productAdded: productsAdapter.addOne, // Thêm một
    productsAdded: productsAdapter.addMany, // Thêm nhiều
    productUpdated: productsAdapter.updateOne, // Update: { id, changes }
    productRemoved: productsAdapter.removeOne, // Xóa bằng id
    productsCleared: productsAdapter.removeAll, // Xóa hết
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload); // Replace tất cả
      state.status = 'succeeded';
    });
  },
});

// Selectors được generate từ adapter
export const {
  selectAll: selectAllProducts, // Trả về array
  selectById: selectProductById, // Trả về entity hoặc undefined
  selectIds: selectProductIds, // Trả về array of ids
  selectTotal: selectProductTotal, // Trả về count
} = productsAdapter.getSelectors((state: RootState) => state.products);
```

## 5.6 RTK Query — Server State Trong Redux

RTK Query là answer của Redux cho TanStack Query — caching, background fetching, automatic invalidation, tất cả tích hợp vào Redux store.

### Định Nghĩa API Service

```tsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi', // Key trong Redux state

  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Tự động thêm auth token
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ['Product', 'User', 'Order'], // Tags cho cache invalidation

  endpoints: (builder) => ({
    // Query endpoint — fetch data
    getProducts: builder.query<Product[], { category?: string }>({
      query: ({ category } = {}) => ({
        url: '/products',
        params: category ? { category } : undefined,
      }),
      // Cache tag — khi Product tag bị invalidate, query này refetch
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],

      // Transform response trước khi cache
      transformResponse: (response: ApiResponse<Product[]>) => response.data,

      // Stale time — sau bao lâu refetch khi component mount
      keepUnusedDataFor: 60, // Giây — giữ cache 60s sau khi không còn subscriber
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Mutation endpoint — thay đổi data
    createProduct: builder.mutation<Product, Omit<Product, 'id'>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      // Invalidate LIST tag → getProducts tự động refetch
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<
      Product,
      Pick<Product, 'id'> & Partial<Product>
    >({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],

      // Optimistic update — update UI trước, rollback nếu lỗi
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Patch cache ngay lập tức
        const patchResult = dispatch(
          productsApi.util.updateQueryData('getProductById', id, (draft) => {
            Object.assign(draft, patch); // Immer draft
          }),
        );
        try {
          await queryFulfilled; // Chờ server response
        } catch {
          patchResult.undo(); // Rollback nếu server error
        }
      },
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // Lazy queries — chỉ fetch khi gọi trigger
  useLazyGetProductsQuery,
  useLazyGetProductByIdQuery,
} = productsApi;
```

### Sử Dụng Trong Component

```tsx
function ProductList() {
  const [category, setCategory] = useState<string>();

  // Query — tự động fetch, cache, refetch
  const {
    data: products,
    isLoading, // True chỉ khi không có data và đang fetch
    isFetching, // True bất kỳ khi nào đang fetch (kể cả background)
    isError,
    error,
    refetch, // Manual refetch
  } = useGetProductsQuery(
    { category },
    {
      pollingInterval: 30000, // Refetch mỗi 30s
      skipPollingIfUnfocused: true, // Pause polling khi tab không focused
      refetchOnMountOrArgChange: true, // Refetch khi component mount
    },
  );

  const [createProduct, { isLoading: isCreating, error: createError }] =
    useCreateProductMutation();

  const handleCreate = async () => {
    try {
      const newProduct = await createProduct({
        name: 'New Product',
        price: 99,
      }).unwrap();
      // unwrap() throw nếu mutation failed — dễ xử lý với try/catch
      console.log('Created:', newProduct);
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div>
      {isFetching && <RefreshIndicator />} {/* Background refresh indicator */}
      {products?.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
        />
      ))}
    </div>
  );
}
```

### Lazy Queries

```tsx
function SearchProducts() {
  const [searchTerm, setSearchTerm] = useState('');

  // Không fetch ngay khi mount
  const [trigger, result] = useLazyGetProductsQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    trigger({ category: searchTerm }); // Fetch khi user submit
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type='submit'>Search</button>
      {result.isLoading && <Spinner />}
      {result.data?.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
        />
      ))}
    </form>
  );
}
```

### Cache Manipulation

```tsx
// Inject vào Redux store từ bên ngoài component
import { store } from './store';

// Prefetch — chuẩn bị cache trước
store.dispatch(
  productsApi.util.prefetch('getProducts', undefined, { force: false }),
);

// Invalidate tags manually
store.dispatch(productsApi.util.invalidateTags(['Product']));

// Update cache manually (không fetch)
store.dispatch(
  productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
    draft.push({ id: 'temp-123', name: 'Optimistic Product', price: 0 });
  }),
);

// Reset toàn bộ cache của API
store.dispatch(productsApi.util.resetApiState());
```

---

# MODULE 6 — Server State: TanStack Query

> **Lưu ý:** TanStack Query không nằm trong yêu cầu gốc nhưng là essential để hiểu quyết định kiến trúc server state — đặc biệt khi so sánh với RTK Query.

## 6.1 Core Concepts

TanStack Query dựa trên một mental model đơn giản: **query keys xác định dữ liệu, và mọi caching/fetching đều driven bởi keys**.

```tsx
// Query key là identifier — mọi thứ cùng key thì share cache
const { data } = useQuery({
  queryKey: ['products'], // Key đơn giản
  queryFn: () => fetchProducts(),
});

const { data: product } = useQuery({
  queryKey: ['products', id], // Key với params
  queryFn: () => fetchProduct(id),
});

const { data: filtered } = useQuery({
  queryKey: ['products', { category, sort }], // Key với object params
  queryFn: () => fetchProducts({ category, sort }),
});
```

**Khi queryKey thay đổi** → tự động fetch lại. Đây là mechanism cho search/filter:

```tsx
function ProductSearch() {
  const [search, setSearch] = useState('');

  const { data, isFetching } = useQuery({
    queryKey: ['products', { search }], // Key thay đổi khi search thay đổi
    queryFn: () => searchProducts(search),
    enabled: search.length > 2, // Chỉ fetch khi search >= 3 chars
    staleTime: 5 * 60 * 1000, // 5 phút — không refetch nếu data chưa stale
    placeholderData: keepPreviousData, // Giữ data cũ trong khi fetch data mới
  });
}
```

## 6.2 Stale Time vs Cache Time — Hiểu Đúng

```
staleTime: Sau bao lâu data được coi là "stale" (cũ)?
           Default: 0 — ngay lập tức stale sau khi fetch

cacheTime: Sau bao lâu cache được xóa khi không còn subscriber?
(gcTime)   Default: 5 phút
```

```
fetch() → data = FRESH (< staleTime)
                ↓ staleTime qua
          data = STALE (cần refetch khi: component mount, window focus, network reconnect)
                ↓ không có subscriber nào
          data = INACTIVE (đang đếm gcTime)
                ↓ gcTime qua
          data = DELETED (cache xóa, fetch lại từ đầu)
```

## 6.3 Mutations và Cache Invalidation

```tsx
const queryClient = useQueryClient();

const createProductMutation = useMutation({
  mutationFn: (newProduct: Omit<Product, 'id'>) =>
    fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(newProduct),
    }).then((r) => r.json()),

  onSuccess: (data, variables, context) => {
    // Invalidate và refetch list
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },

  onError: (error, variables, context) => {
    // Rollback nếu có optimistic update
  },

  // Optimistic update
  onMutate: async (newProduct) => {
    await queryClient.cancelQueries({ queryKey: ['products'] });

    const previousProducts = queryClient.getQueryData<Product[]>(['products']);

    queryClient.setQueryData<Product[]>(['products'], (old) => [
      ...(old ?? []),
      { ...newProduct, id: 'temp-id' },
    ]);

    return { previousProducts }; // Context để rollback
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
});
```

---

# MODULE 7 — Architecture Patterns Và Anti-Patterns

## 7.1 Server State Anti-Patterns

### Anti-pattern: Nhét API Response Vào Redux

```tsx
// ❌ Anti-pattern — tự quản lý server state trong Redux
const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastFetched: null, // Tự implement cache invalidation
    isCacheValid: false,
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.lastFetched = Date.now();
      state.isCacheValid = true;
    },
    fetchError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    invalidateCache: (state) => {
      state.isCacheValid = false;
    },
  },
});

// Phải tự implement: cache strategy, stale detection, background sync,
// deduplication (nhiều component cùng fetch), window focus refetch, ...
```

### Correct Pattern

```tsx
// ✅ Dùng RTK Query hoặc TanStack Query — tất cả đã built-in
const {
  data: user,
  isLoading,
  error,
} = useGetUserQuery(userId, {
  refetchOnFocus: true,
  staleTime: 5 * 60 * 1000,
});
// loading, error, cache, deduplication, background sync — tự động
```

### Anti-pattern: Sync Redux State Từ API Response Thủ Công

```tsx
// ❌ Sau khi mutate, tự dispatch action để update local state
dispatch(createProductThunk(newProduct)).then(() => {
  dispatch(fetchProductsThunk()); // Refetch thủ công
  dispatch(updateProductCount()); // Sync derived state thủ công
});

// ✅ Cache invalidation tự động
createProduct(newProduct); // RTK Query/TanStack Query tự invalidate và refetch
```

## 7.2 Client State Anti-Patterns

### Anti-pattern: Global State Cho Local Concerns

```tsx
// ❌ Đưa lên global những gì không cần global
const appSlice = createSlice({
  name: 'app',
  reducers: {
    modalOpened: ...,
    modalClosed: ...,
    activeTabSet: ...,
    dropdownToggled: ...,
    inputFocused: ...,   // Chỉ 1 component cần biết
    tooltipShown: ...,   // Chỉ 1 component cần biết
  }
})

// ✅ Local state cho local concerns
function Modal({ onClose }) {
  const [isAnimating, setIsAnimating] = useState(false)  // Chỉ Modal cần biết
  // ...
}
```

### Anti-pattern: Derived State Trong Store

```tsx
// ❌ Store derived data
const cartSlice = createSlice({
  initialState: {
    items: [],
    totalPrice: 0, // Derived từ items — out of sync risk
    itemCount: 0, // Derived từ items — out of sync risk
    hasItems: false, // Derived từ items — out of sync risk
  },
});

// ✅ Tính toán derived data trong selector
const selectCartItems = (state: RootState) => state.cart.items;

const selectCartTotals = createSelector([selectCartItems], (items) => ({
  totalPrice: items.reduce((sum, item) => sum + item.price * item.qty, 0),
  itemCount: items.reduce((sum, item) => sum + item.qty, 0),
  hasItems: items.length > 0,
}));
// Reselect memoize — chỉ tính lại khi items thay đổi
```

## 7.3 Colocation Principle

State nên ở gần nhất với nơi nó được dùng:

```
Quy tắc colocation:
1. Chỉ một component dùng? → useState trong component đó
2. Một subtree dùng? → useState trong common ancestor của subtree
3. Nhiều subtrees dùng? → Global state (Context/Zustand/Redux)
4. Đến từ server? → TanStack Query / RTK Query (bất kể scope)
```

Resisting premature globalization là một skill — đừng đưa state lên global chỉ vì "biết đâu sau này cần". Refactor từ local lên global dễ hơn refactor từ global xuống local.

## 7.4 Normalization

Khi store related entities, normalized state tránh duplication và inconsistency:

```tsx
// ❌ Denormalized — duplication
{
  posts: [
    { id: '1', title: 'Hello', author: { id: 'u1', name: 'Alice', avatar: '...' } },
    { id: '2', title: 'World', author: { id: 'u1', name: 'Alice', avatar: '...' } },
    // Alice duplicated — khi Alice đổi avatar, phải update tất cả posts
  ]
}

// ✅ Normalized — single source of truth
{
  posts: {
    ids: ['1', '2'],
    entities: {
      '1': { id: '1', title: 'Hello', authorId: 'u1' },
      '2': { id: '2', title: 'World', authorId: 'u1' },
    }
  },
  users: {
    ids: ['u1'],
    entities: {
      'u1': { id: 'u1', name: 'Alice', avatar: '...' }
    }
  }
}
// Cập nhật Alice một lần → tất cả posts tự động thấy đúng
```

RTK `createEntityAdapter` và `normalizr` library giúp manage normalized state.

---

# MODULE 8 — Architecture Decision Framework

## 8.1 Decision Tree Hoàn Chỉnh

```
State mới xuất hiện — chọn tool như thế nào?
│
├── Data đến từ server/API?
│   ├── Có → Dùng server state solution
│   │        ├── Project đang dùng Redux → RTK Query
│   │        └── Project không dùng Redux → TanStack Query
│   │
│   └── Không → Đây là client state → tiếp tục
│
├── Client state — scope là gì?
│   ├── Chỉ 1 component cần → useState / useReducer (local)
│   │
│   ├── Một subtree nhỏ cần → useState ở common ancestor
│   │                         hoặc useReducer + Context nhỏ
│   │
│   └── Cần share toàn app → Global state → tiếp tục
│
└── Global client state — dùng gì?
    ├── Update rất ít (theme, language, auth user)?
    │   └── React Context (thuần hoặc + use-context-selector)
    │
    ├── Project nhỏ-vừa, team nhỏ, muốn đơn giản?
    │   └── Zustand
    │
    └── Team lớn, logic phức tạp, cần strict predictability?
        └── Redux Toolkit
            ├── Async đơn giản? → createAsyncThunk
            └── Async phức tạp (WebSocket, complex orchestration)?
                └── redux-saga
```

## 8.2 Tech Stack Theo Quy Mô Project

**Solo / Startup / Prototype:**

```
Server State: TanStack Query
Client State: Zustand
Local State:  useState
Async:        Zustand async actions
```

**Medium Team (5-15 devs), Product Stage:**

```
Server State: TanStack Query hoặc RTK Query
Client State: Zustand hoặc Redux Toolkit (tùy team preference)
Local State:  useState / useReducer
Async:        createAsyncThunk (đủ cho phần lớn cases)
Complex Async: redux-saga nếu genuinely cần
```

**Enterprise / Large Team (15+ devs):**

```
Server State: RTK Query (tích hợp Redux DevTools, audit trail)
Client State: Redux Toolkit (strict patterns, code review rõ ràng)
Local State:  useState / useReducer
Async:        createAsyncThunk baseline, saga cho complex flows
Context:      Chỉ cho theme, i18n — không cho business logic
```

## 8.3 Migration Paths

**Từ Redux Vanilla → Redux Toolkit:**

Migration từng slice — không cần rewrite toàn bộ. RTK backward compatible với Redux vanilla. Bắt đầu bằng `configureStore`, sau đó migrate từng reducer sang `createSlice`.

**Từ "Redux for Server State" → RTK Query / TanStack Query:**

Migration từng resource. Bắt đầu với resource ít critical nhất, kiểm tra behavior, sau đó nhân rộng. Redux slice cũ có thể song tồn với RTK Query trong transition period.

**Từ Context → Zustand (khi performance là vấn đề):**

1. Install Zustand
2. Tạo store tương ứng với Context state
3. Swap `useContext` calls sang `useStore` calls trong từng component
4. Xóa Context và Provider sau khi không còn consumers

**Từ Zustand → Redux Toolkit (khi team lớn hơn):**

Khó hơn vì paradigm khác. Thường rewrite theo feature thay vì migrate từng piece. Chỉ làm khi thực sự cần Redux's strict patterns.

## 8.4 Dấu Hiệu Đang Dùng Sai Tool

**Đang dùng Redux cho server state:**

- Có fields `loading`, `error`, `lastFetched` trong Redux slice
- Phải dispatch action để invalidate cache sau mutation
- Có saga chỉ để fetch data và không làm gì phức tạp hơn

**Đang đưa state lên global quá sớm:**

- State global chỉ có một component duy nhất đọc
- Global store có nhiều state chỉ tồn tại trong một user flow ngắn

**Đang dùng saga khi không cần:**

- Saga chỉ làm `call()` rồi `put()` — không có race, channel, complex sequencing
- `createAsyncThunk` + `AbortController` làm được điều tương tự với ít code hơn

**Đang dùng Context cho high-frequency updates:**

- Counter tăng mỗi giây trong Context → tất cả consumers re-render mỗi giây
- Shopping cart trong một Context object lớn → ProfilePic re-render khi add to cart

---

## Tài Liệu Tham Khảo Theo Thứ Tự Học

1. **React docs** — useState, useReducer, Context: https://react.dev/reference/react
2. **Redux Toolkit docs** — createSlice, createAsyncThunk, RTK Query: https://redux-toolkit.js.org
3. **Zustand docs** — store, middleware, patterns: https://docs.pmnd.rs/zustand
4. **TanStack Query docs** — queries, mutations, cache: https://tanstack.com/query
5. **redux-saga docs** — effects, patterns: https://redux-saga.js.org
6. **use-context-selector** — README: https://github.com/dai-shi/use-context-selector
7. **Blogged Answers: Redux Usage Guide** — Mark Erikson: https://blog.isquaredsoftware.com

---

_Curriculum này được thiết kế để học theo thứ tự từ Module 1 đến 8. Mỗi module xây dựng trên module trước. Sau Module 4-5, có thể bắt đầu build side projects để practice, sau đó quay lại Module 6-8 để hiểu kiến trúc ở mức cao hơn._
