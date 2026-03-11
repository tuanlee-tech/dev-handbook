# 🧠 Công Thức Cốt Lõi — Data Fetching (Ngày 19 & 20)

> Tài liệu này là **bộ công thức chung**, trích từ toàn bộ bài tập Ngày 19–20.
> Mỗi pattern = 1 vấn đề thực tế + bản chất + công thức áp dụng.

---

## CÔNG THỨC 1 — Fetch Cơ Bản (3-State Pattern)

### Bản chất
Mọi thao tác fetch đều có 3 trạng thái: **đang chờ → thành công → thất bại**.
UI phải phản ánh đúng từng trạng thái, không được bỏ sót.

### Công thức
```jsx
// KHAI BÁO — luôn 3 state này
const [data, setData]       = useState(null);   // hoặc []
const [loading, setLoading] = useState(true);
const [error, setError]     = useState(null);

// FETCH — trong useEffect, KHÔNG trong render
useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);   // ← reset trước mỗi lần fetch
      setError(null);     // ← reset error cũ

      const res = await fetch(URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`); // ← BẮT BUỘC check

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [dependency]);

// RENDER — conditional, đúng thứ tự
if (loading) return <Loading />;
if (error)   return <Error message={error} />;
return <Success data={data} />;
```

### Quy tắc cứng
| ❌ Sai | ✅ Đúng |
|--------|---------|
| `fetch()` trực tiếp trong render | `fetch()` trong `useEffect` |
| Không check `response.ok` | `if (!res.ok) throw new Error(...)` |
| `useEffect(async () => ...)` | Tạo `async function` bên trong rồi gọi |
| Không reset loading/error khi refetch | `setLoading(true); setError(null)` đầu mỗi fetch |

---

## CÔNG THỨC 2 — Refetch Khi Dependency Thay Đổi

### Bản chất
Khi data phụ thuộc vào một giá trị bên ngoài (userId, page, category…),
**dependency array là cơ chế duy nhất** để trigger refetch đúng lúc.

### Công thức
```jsx
// Giá trị thay đổi → effect chạy lại → fetch mới
useEffect(() => {
  setLoading(true);   // ← reset state TRƯỚC khi fetch mới
  setError(null);

  async function fetchData() { /* ... */ }
  fetchData();
}, [selectedId, currentPage, category]); // ← liệt kê tất cả giá trị ảnh hưởng đến URL
```

### Khi nào deps là gì?
```
Fetch 1 lần khi mount      → []
Fetch lại khi id đổi       → [id]
Fetch lại khi page đổi     → [currentPage]
Fetch lại khi filter đổi   → [category, searchQuery]
Retry thủ công             → [retryCount]  // tăng retryCount để trigger lại
Refresh thủ công           → [refreshKey]  // tăng refreshKey để trigger lại
```

---

## CÔNG THỨC 3 — Debounce (Trì Hoãn Fetch)

### Bản chất
Mỗi keystroke không nên gọi 1 request. Đợi user gõ xong (sau Xms không gõ nữa)
rồi mới fetch. Thực hiện bằng cách **delay cập nhật một giá trị trung gian**.

### Công thức
```jsx
const [inputValue, setInputValue]       = useState(""); // raw — cập nhật ngay
const [debouncedValue, setDebouncedValue] = useState(""); // delayed — dùng để fetch

// Effect debounce
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedValue(inputValue); // chỉ cập nhật sau X ms không thay đổi
  }, 500); // ← thường 300–500ms

  return () => clearTimeout(timer); // cleanup: hủy timer nếu inputValue đổi trước khi hết giờ
}, [inputValue]);

// Effect fetch: chỉ chạy theo debouncedValue
useEffect(() => {
  if (!debouncedValue || debouncedValue.length < 2) return; // guard
  // fetch(debouncedValue)...
}, [debouncedValue]);
```

### Luồng dữ liệu
```
User gõ "r"  → setInputValue("r")  → timer bắt đầu
User gõ "re" → setInputValue("re") → timer RESET
User gõ "react" → setInputValue("react") → timer bắt đầu
--- 500ms trôi qua, không gõ thêm ---
→ setDebouncedValue("react") → useEffect fetch chạy → 1 request duy nhất
```

---

## CÔNG THỨC 4 — Hủy Request (AbortController)

### Bản chất
Khi dependency thay đổi trước khi request cũ hoàn thành → **race condition**.
`AbortController` cho phép chủ động hủy request đang bay để chỉ xử lý kết quả mới nhất.

### Công thức
```jsx
useEffect(() => {
  const controller = new AbortController(); // ← tạo mới mỗi lần effect chạy

  async function fetchData() {
    try {
      const res = await fetch(URL, {
        signal: controller.signal // ← gắn signal vào fetch
      });
      const data = await res.json();
      setData(data);
    } catch (err) {
      if (err.name === "AbortError") return; // ← im lặng, KHÔNG hiện lỗi
      setError(err.message);                 // ← chỉ xử lý lỗi thật
    }
  }

  fetchData();

  return () => controller.abort(); // ← cleanup: hủy request khi effect chạy lại hoặc unmount
}, [dependency]);
```

### Vòng đời với AbortController
```
dependency = "A" → Effect chạy → controller_A tạo → fetch("A") bắt đầu
dependency = "B" → Cleanup: controller_A.abort() → fetch("A") bị hủy
               → Effect chạy lại → controller_B tạo → fetch("B") bắt đầu
fetch("B") trả về → setData(result_B) ✅

// Nếu KHÔNG có abort:
// fetch("A") vẫn đang chạy → trả về sau → setData(result_A) ❌ ghi đè result_B
```

---

## CÔNG THỨC 5 — Dependent Requests (Fetch Tuần Tự)

### Bản chất
Khi Request B cần data từ Request A → không thể chạy song song.
Dùng **2 useEffect riêng biệt**, Effect 2 có guard clause chặn lại cho đến khi Effect 1 xong.

### Công thức
```jsx
// Effect 1: fetch data đầu tiên
useEffect(() => {
  const controller = new AbortController();
  async function fetchA() {
    setALoading(true);
    try {
      const res = await fetch(URL_A, { signal: controller.signal });
      const data = await res.json();
      setDataA(data); // ← khi set xong, Effect 2 sẽ tự kích hoạt
    } catch (err) {
      if (err.name !== "AbortError") setErrorA(err.message);
    } finally { setALoading(false); }
  }
  fetchA();
  return () => controller.abort();
}, [idA]);

// Effect 2: fetch data phụ thuộc
useEffect(() => {
  if (!dataA || aLoading) return; // ← GUARD CLAUSE: chặn nếu A chưa sẵn sàng

  const controller = new AbortController();
  async function fetchB() {
    setBLoading(true);
    try {
      const res = await fetch(`${URL_B}?refId=${dataA.id}`, { signal: controller.signal });
      const data = await res.json();
      setDataB(data);
    } catch (err) {
      if (err.name !== "AbortError") setErrorB(err.message);
    } finally { setBLoading(false); }
  }
  fetchB();
  return () => controller.abort();
}, [dataA, aLoading]); // ← trigger khi dataA có giá trị
```

### Khi nào dùng sequential vs parallel?
```
Request B cần ID/tọa độ từ Request A   → SEQUENTIAL (dependent)
Fetch user rồi fetch posts của user      → SEQUENTIAL
Fetch nhiều endpoint độc lập nhau       → PARALLEL (xem Công thức 6)
```

---

## CÔNG THỨC 6 — Parallel Requests (Promise.allSettled)

### Bản chất
Các request độc lập nhau nên chạy **đồng thời** thay vì tuần tự.
`Promise.all` fail nếu 1 request lỗi → dùng `Promise.allSettled` để show được kết quả từng phần.

### Công thức
```jsx
useEffect(() => {
  async function fetchAll() {
    // Tất cả bắt đầu cùng lúc — không await từng cái một
    const results = await Promise.allSettled([
      fetch(URL_1).then(r => r.json()),
      fetch(URL_2).then(r => r.json()),
      fetch(URL_3).then(r => r.json()),
    ]);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        // thành công → dùng result.value
        updateState(index, result.value);
      } else {
        // thất bại → dùng result.reason
        updateError(index, result.reason.message);
      }
    });
    // ↑ Một request fail KHÔNG ảnh hưởng các request khác
  }
  fetchAll();
}, [refreshTrigger]);
```

### Promise.all vs Promise.allSettled
```
Promise.all([A, B, C])         → Nếu C fail → toàn bộ fail, A và B mất sạch ❌
Promise.allSettled([A, B, C])  → C fail → chỉ C lỗi, A và B vẫn show ✅
```
→ **Rule**: Dashboard/stats hiển thị từng phần → dùng `allSettled`.

---

## CÔNG THỨC 7 — Lazy Load + Cache Theo Tab

### Bản chất
Không fetch trước khi cần. Fetch khi tab được mở lần đầu (lazy).
Khi quay lại tab cũ → dùng cache, không fetch lại (tiết kiệm request).

### Công thức
```jsx
// Parent: giữ cache tập trung
const [cache, setCache] = useState({ tabA: null, tabB: null, tabC: null });

// Khi render tab, truyền cache xuống
{activeTab === "tabA" && (
  <TabComponent
    cachedData={cache.tabA}
    onDataLoad={(data) => setCache(p => ({ ...p, tabA: data }))}
  />
)}

// Trong TabComponent: kiểm tra cache trước khi fetch
useEffect(() => {
  if (cachedData) {         // ← đã có cache → không fetch
    setData(cachedData);
    setLoading(false);
    return;
  }
  fetchData();              // ← chưa có cache → fetch và lưu lên parent
}, []);
// ↑ Empty deps: chạy 1 lần khi tab mount (= lần đầu tab được chọn)
```

### Vì sao hoạt động?
```
Tab chưa chọn → component chưa mount → useEffect chưa chạy → chưa fetch ✅
Tab lần đầu chọn → mount → useEffect → cache = null → fetch → lưu cache
Tab quay lại   → mount lại → useEffect → cache có data → skip fetch ✅
Nhấn Refresh  → xóa cache ở parent → re-mount → fetch lại ✅
```

---

## CÔNG THỨC 8 — Polling (Fetch Định Kỳ)

### Bản chất
Cập nhật data tự động sau mỗi N giây bằng `setInterval`.
**Bắt buộc cleanup** khi component unmount, nếu không interval chạy mãi → memory leak.

### Công thức
```jsx
useEffect(() => {
  if (!pollingEnabled) return; // ← guard: bật/tắt polling

  const intervalId = setInterval(async () => {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setData(data);
    } catch (err) {
      console.error("Polling error:", err);
    }
  }, INTERVAL_MS); // ← thường 5000–10000ms

  return () => clearInterval(intervalId); // ← KHÔNG được bỏ dòng này
}, [pollingEnabled]); // ← re-run khi toggle bật/tắt
```

---

## CÔNG THỨC 9 — Infinite Scroll (IntersectionObserver)

### Bản chất
Load thêm data khi user cuộn đến phần tử cuối cùng trong danh sách.
Dùng `IntersectionObserver` thay vì lắng nghe scroll event (hiệu quả hơn).

### Công thức
```jsx
const observerRef = useRef(null);

// Callback ref gắn vào phần tử cuối cùng trong list
const lastItemRef = (node) => {
  if (observerRef.current) observerRef.current.disconnect(); // cleanup observer cũ

  observerRef.current = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasMore && !loading) {
      loadMoreData(); // ← trigger khi phần tử cuối vào viewport
    }
  }, { threshold: 1.0 }); // ← 1.0 = phải hoàn toàn visible mới trigger

  if (node) observerRef.current.observe(node);
};

// Gắn ref vào phần tử cuối của list
return items.map((item, index) => (
  <div
    key={item.id}
    ref={index === items.length - 1 ? lastItemRef : null} // ← chỉ phần tử CUỐI
  >
    {/* content */}
  </div>
));
```

---

## BẢNG QUYẾT ĐỊNH — Chọn Pattern Nào?

```
Cần fetch data?
│
├─ Fetch 1 lần, không phụ thuộc gì
│  → Công thức 1 + deps = []
│
├─ Fetch lại khi props/state đổi
│  → Công thức 2 + deps = [giá trị thay đổi]
│
├─ User gõ text → fetch theo input
│  → Công thức 3 (debounce) + Công thức 4 (abort)
│
├─ Request B cần data từ Request A
│  → Công thức 5 (sequential + guard clause)
│
├─ Nhiều endpoint độc lập, muốn hiện partial result
│  → Công thức 6 (Promise.allSettled)
│
├─ Nhiều tab, không muốn refetch khi quay lại tab cũ
│  → Công thức 7 (lazy load + cache)
│
├─ Tự động cập nhật định kỳ
│  → Công thức 8 (polling + clearInterval cleanup)
│
└─ Danh sách dài, load thêm khi cuộn
   → Công thức 9 (IntersectionObserver)
```

---

## CHECKLIST TRƯỚC KHI SUBMIT CODE

```
Fetch cơ bản:
  [ ] fetch trong useEffect, KHÔNG trong render
  [ ] check response.ok trước khi .json()
  [ ] try/catch bao quanh toàn bộ async logic
  [ ] 3 states: data + loading + error
  [ ] setLoading(true) + setError(null) đầu mỗi lần fetch

Dependency:
  [ ] deps array có đủ tất cả giá trị ảnh hưởng đến URL không?
  [ ] reset states khi deps thay đổi

Cleanup:
  [ ] AbortController.abort() trong return của useEffect
  [ ] clearInterval() trong return của useEffect (nếu có polling)
  [ ] clearTimeout() trong return của useEffect (nếu có debounce)

AbortError:
  [ ] catch riêng AbortError (không hiện lỗi cho user)
  [ ] AbortError không set loading = false (để UI không nhảy)

Edge cases:
  [ ] Guard clause nếu có dependent requests
  [ ] Empty state khi không có data
  [ ] Disable button/input trong khi loading
```
