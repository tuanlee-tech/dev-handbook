# Xây Dựng Client-Side Analytics Engine Hiệu Năng Cao Trong Browser

> **Đối tượng:** Frontend Developer muốn hiểu sâu về performance, architecture, và system design  
> **Mục tiêu:** Thiết kế một analytics engine trong browser xử lý hàng triệu records với latency thấp  
> **Context thực tế:** Fintech dashboard, Ecommerce reporting, Realtime trading monitor

---

## Mục Lục

1. [Vấn đề nền tảng — Tại sao UI bị lag?](#1-vấn-đề-nền-tảng)
2. [Web Worker — Luồng tính toán nền](#2-web-worker)
3. [Data Architecture — Thiết kế cấu trúc dữ liệu](#3-data-architecture)
4. [Data Transfer Optimization — Truyền dữ liệu nhanh](#4-data-transfer-optimization)
5. [Compute Optimization — 5 kỹ thuật tăng tốc tính toán](#5-compute-optimization)
6. [Parallelism — Xử lý song song](#6-parallelism)
7. [WASM Compute — Khi JavaScript không đủ nhanh](#7-wasm-compute)
8. [Shared Memory — Bộ nhớ chia sẻ giữa các luồng](#8-shared-memory)
9. [Memo Graph — Tránh tính toán lặp lại](#9-memo-graph)
10. [Query Engine — Bộ máy truy vấn nội bộ](#10-query-engine)
11. [Kiến trúc hoàn chỉnh](#11-kiến-trúc-hoàn-chỉnh)
12. [Bottleneck thực tế — GC, Memory, Browser Constraints](#12-bottleneck-thực-tế)
13. [Trade-offs — Khi nào dùng, khi nào không](#13-trade-offs)
14. [So sánh với hệ thống production](#14-so-sánh-với-hệ-thống-production)

---

## 1. Vấn Đề Nền Tảng

### 1.1 Event Loop (Vòng lặp sự kiện) là gì?

Browser JavaScript chạy trên **single-threaded model** (mô hình đơn luồng) — tức là chỉ có **một luồng thực thi** duy nhất gọi là **main thread** (luồng chính). Mọi thứ đều chạy trên luồng này: render UI, xử lý event click, chạy JavaScript.

**Event Loop** là cơ chế điều phối: nó liên tục kiểm tra **call stack** (ngăn xếp gọi hàm) và **task queue** (hàng đợi tác vụ), sau đó đẩy task vào call stack khi stack trống.

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER PROCESS                     │
│                                                         │
│   ┌─────────────┐    ┌──────────────┐                   │
│   │ Call Stack  │    │  Task Queue  │                   │
│   │             │    │              │                   │
│   │ [JS Code]   │◄───│ [onClick]    │                   │
│   │ [renderUI]  │    │ [setTimeout] │                   │
│   └─────────────┘    └──────────────┘                   │
│          │                                              │
│          ▼                                              │
│   ┌─────────────┐                                       │
│   │  Rendering  │  ← Chỉ chạy khi call stack RỖNG       │
│   │  Pipeline   │                                       │
│   └─────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

**Insight quan trọng:** Browser chỉ render frame mới (60fps = mỗi 16.67ms) khi call stack **rỗng hoàn toàn**. Nếu JS chiếm call stack quá 16ms → frame bị drop → UI lag.

---

### 1.2 Main Thread Blocking (Chặn luồng chính)

**Ví dụ thực tế — Ecommerce Dashboard:**

Giả sử bạn có 500,000 đơn hàng cần tính tổng doanh thu 30 ngày gần nhất:

```javascript
// Dataset giả lập — 500K orders
const orders = Array.from({ length: 500_000 }, (_, i) => ({
  id: i + 1,
  amount: Math.random() * 1000 + 10,
  category: ['tech', 'fashion', 'food', 'book'][i % 4],
  createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 3600 * 1000)
    .toISOString().split('T')[0]
}));

// ❌ CÁCH NAIVE — chạy thẳng trên main thread
function calcRevenueLast30Days(orders) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  let total = 0;
  for (const order of orders) {           // ← 500K iterations
    if (new Date(order.createdAt) >= cutoff) {  // ← new Date() mỗi lần = expensive
      total += order.amount;
    }
  }
  return total;
}

// Gọi khi user click "Refresh"
button.addEventListener('click', () => {
  const result = calcRevenueLast30Days(orders); // ← BLOCK main thread ~200-800ms
  displayResult(result);
});
```

**Tại sao gây lag?**

| Vấn đề | Chi tiết | Chi phí |
|--------|----------|---------|
| `new Date(string)` trong vòng lặp | Parse string → Object mỗi lần | ~5-10ns × 500K = 2.5-5ms |
| 500K iterations tuần tự | CPU bound, không nhường | ~100-300ms trên mid-range device |
| GC pressure | Tạo 500K Date objects tạm | GC pause ~50-150ms bất ngờ |
| **Tổng cộng** | Main thread bị block | **200-800ms freeze UI** |

**Profiler Output (Chrome DevTools giả lập):**

```
Main Thread Timeline:
─────────────────────────────────────────────────────────
[Click Handler]──────────────────────────────[300ms block]
                                              ↑
                              Rendering SKIPPED trong thời gian này
                              → User thấy UI "đơ"
─────────────────────────────────────────────────────────
```

> **System Thinking:** Vấn đề không phải là code "xấu". Vấn đề là bạn đang đặt **CPU-intensive work** (tính toán nặng về CPU) vào đúng nơi mà browser cần để render UI. Giải pháp không phải là "optimize vòng lặp" — mà là **offload sang thread khác**.

---

## 2. Web Worker

### 2.1 Web Worker (Luồng nền) là gì?

**Web Worker** là một thread thực sự tách biệt, chạy JavaScript trong background mà **không block main thread**. Worker có JavaScript engine riêng, call stack riêng, nhưng **không có quyền truy cập DOM** (Document Object Model — cây phần tử HTML).

```
┌──────────────────────────────────────────────────────────────┐
│                       BROWSER                                │
│                                                              │
│  Main Thread              Worker Thread                      │
│  ┌───────────────┐        ┌───────────────┐                 │
│  │ UI Events     │        │ Heavy Compute │                 │
│  │ DOM Updates   │        │ Data Process  │                 │
│  │ Animations    │        │ Aggregations  │                 │
│  └──────┬────────┘        └───────┬───────┘                 │
│         │                         │                          │
│         │   postMessage(data)     │                          │
│         │────────────────────────►│                          │
│         │                         │  [compute]               │
│         │   postMessage(result)   │                          │
│         │◄────────────────────────│                          │
│         │                         │                          │
│  [render result]          [continue next task]               │
└──────────────────────────────────────────────────────────────┘
```

**Message Passing (Truyền message):** Worker và main thread không share memory thông thường. Chúng giao tiếp qua `postMessage()` — dữ liệu được **clone** (sao chép) sang thread kia (structured clone algorithm).

---

### 2.2 Ví dụ thực tế — Fintech: Tính volume giao dịch theo symbol

**Dataset:**
```javascript
// 1M transactions
const transactions = Array.from({ length: 1_000_000 }, (_, i) => ({
  id: i + 1,
  amount: Math.random() * 10000,
  type: ['buy', 'sell'][i % 2],
  symbol: ['BTC', 'ETH', 'SOL', 'BNBUSDT', 'XRPUSDT'][i % 5],
  timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 3600 * 1000)
}));
```

**Cách 1: Chạy trên main thread (❌)**
```javascript
// main.js
function calcVolumeBySymbol(transactions) {
  const result = {};
  for (const tx of transactions) {  // 1M iterations = ~400ms block
    result[tx.symbol] = (result[tx.symbol] || 0) + tx.amount;
  }
  return result;
}

// UI freeze 400ms
const volumes = calcVolumeBySymbol(transactions);
```

**Cách 2: Chạy trong Worker (✅)**

```javascript
// analytics.worker.js
self.onmessage = function(event) {
  const { type, payload } = event.data;

  if (type === 'CALC_VOLUME_BY_SYMBOL') {
    const { transactions } = payload;
    const result = {};

    for (const tx of transactions) {
      result[tx.symbol] = (result[tx.symbol] || 0) + tx.amount;
    }

    self.postMessage({ type: 'VOLUME_RESULT', payload: result });
  }
};
```

```javascript
// main.js
const worker = new Worker('./analytics.worker.js');

worker.onmessage = function(event) {
  if (event.data.type === 'VOLUME_RESULT') {
    renderVolumeChart(event.data.payload); // UI update sau khi có kết quả
  }
};

// Gửi data sang worker — main thread không bị block
worker.postMessage({
  type: 'CALC_VOLUME_BY_SYMBOL',
  payload: { transactions }
});
// ← Return ngay lập tức. User vẫn tương tác được với UI.
```

**So sánh timeline:**

```
❌ Main Thread approach:
──[Click]──[400ms FREEZE]──[render]──[user can interact again]

✅ Worker approach:
──[Click]──[postMessage]──────────────────[render result]──
           ↑ return immediately            ↑ callback sau ~400ms
           UI vẫn smooth 60fps trong suốt quá trình này
```

**Độ phức tạp:** O(N) trong cả hai case, nhưng Worker approach **không block rendering pipeline**.

> **Lưu ý quan trọng cho Middle Dev:** Worker không làm code chạy NHANH hơn. Nó làm main thread RẢNH hơn. Đây là sự khác biệt cốt lõi.

---

## 3. Data Architecture (Kiến Trúc Dữ Liệu)

### 3.1 Vấn đề với Row-oriented Storage (Lưu trữ dạng hàng)

Cách thông thường lưu data là mảng các object:

```javascript
// Row-oriented (dạng hàng) — cách thông thường
const orders = [
  { id: 1, amount: 100, category: 'tech', date: '2026-04-01' },
  { id: 2, amount: 250, category: 'fashion', date: '2026-04-02' },
  // ... 1M records
];
```

Khi chỉ cần tính `SUM(amount)` — bạn vẫn phải **load toàn bộ object** vào cache CPU cho mỗi row.

### 3.2 TypedArray (Mảng kiểu cố định)

**TypedArray** là mảng JavaScript với kiểu dữ liệu cố định, được lưu trong **contiguous memory** (bộ nhớ liên tục). Khác với Array thông thường (mảng các pointer tới object rải rác trong heap), TypedArray lưu số trực tiếp cạnh nhau trong RAM.

```javascript
// Regular Array — số float64 rải rác trong heap (mỗi phần tử là pointer)
const amounts = [100.5, 250.3, 75.8, ...]; // ~56 bytes/phần tử (boxing overhead)

// Float64Array — số float64 liên tục trong memory
const amounts = new Float64Array([100.5, 250.3, 75.8, ...]); // 8 bytes/phần tử
```

**Memory layout so sánh:**

```
Regular Array (heap-scattered):
Stack: [ptr1] [ptr2] [ptr3] [ptr4]
Heap:   ↓       ↓       ↓       ↓
       [100.5] ...  [250.3] ... [75.8] ...  ← rải rác, cache miss cao

Float64Array (contiguous):
Buffer: [100.5][250.3][75.8][180.0][...] ← liên tục, CPU prefetch hiệu quả
         8B     8B     8B    8B
```

### 3.3 Columnar Storage (Lưu trữ dạng cột)

Ý tưởng: thay vì lưu từng row đầy đủ, tách mỗi field thành một mảng riêng.

```javascript
// ❌ Row-oriented (cách thông thường)
const orders = [
  { id: 1, amount: 100, categoryId: 0, dateTs: 1743465600 },
  { id: 2, amount: 250, categoryId: 1, dateTs: 1743552000 },
  // ...
];

// ✅ Columnar Storage — tách ra từng cột
class OrdersColumnar {
  constructor(size) {
    this.ids       = new Int32Array(size);     // 4 bytes × N
    this.amounts   = new Float64Array(size);   // 8 bytes × N
    this.categories = new Uint8Array(size);    // 1 byte × N (encoded)
    this.timestamps = new Float64Array(size);  // 8 bytes × N (epoch ms)
    this.length    = 0;
  }

  // Convert từ row format sang columnar
  static fromRows(rows) {
    const store = new OrdersColumnar(rows.length);
    const categoryMap = { 'tech': 0, 'fashion': 1, 'food': 2, 'book': 3 };

    for (let i = 0; i < rows.length; i++) {
      store.ids[i]         = rows[i].id;
      store.amounts[i]     = rows[i].amount;
      store.categories[i]  = categoryMap[rows[i].category] ?? 255;
      store.timestamps[i]  = new Date(rows[i].createdAt).getTime(); // parse 1 lần duy nhất
    }
    store.length = rows.length;
    return store;
  }

  // SUM(amount) — chỉ đọc cột amounts, cực kỳ cache-friendly
  sumAmount() {
    let total = 0;
    const { amounts, length } = this;
    for (let i = 0; i < length; i++) {
      total += amounts[i]; // ← sequential memory access, CPU prefetch hiệu quả
    }
    return total;
  }

  // SUM(amount) WHERE category = 'tech'
  sumAmountByCategory(categoryCode) {
    let total = 0;
    const { amounts, categories, length } = this;
    for (let i = 0; i < length; i++) {
      if (categories[i] === categoryCode) {
        total += amounts[i];
      }
    }
    return total;
  }
}
```

**Phân tích cache locality:**

```
Query: SUM(amount) trên 1M records

Row-oriented:
  Mỗi iteration: load 1 object (~64 bytes) → chỉ dùng 8 bytes (amount)
  Cache line (64 bytes) chứa ~1 record → cache utilization: 12.5%
  Cache misses cao → nhiều lần đọc RAM

Columnar (Float64Array):
  Mỗi iteration: load từ contiguous buffer
  Cache line (64 bytes) chứa 8 float64 values → cache utilization: 100%
  CPU prefetcher hoạt động hiệu quả → ít cache miss hơn ~5-10×
```

**Benchmark thực tế (giả lập trên 1M records):**

| Approach | SUM(amount) | Memory | Cache Miss Rate |
|----------|-------------|--------|----------------|
| Array of Objects | ~180ms | ~280MB | ~65% |
| Columnar TypedArray | ~20ms | ~22MB | ~8% |
| **Tốc độ tăng** | **~9×** | **~12× nhỏ hơn** | |

> **Insight:** Đây chính xác là lý do tại sao các database analytics như DuckDB, ClickHouse dùng **columnar storage** làm foundation. Bạn đang áp dụng nguyên lý giống hệt nhưng trong browser.

---

## 4. Data Transfer Optimization (Tối Ưu Truyền Dữ Liệu)

### 4.1 Structured Clone Algorithm

Khi bạn `postMessage(data)` sang Worker, browser dùng **Structured Clone** để serialize + copy data sang thread kia. Chi phí là **O(N)** về cả thời gian lẫn memory.

```javascript
// Truyền 1M orders dạng object array — chậm
const orders = Array.from({ length: 1_000_000 }, (_, i) => ({
  id: i, amount: Math.random() * 1000
}));

// ❌ Structured clone — copy toàn bộ
worker.postMessage({ orders }); // ~300-500ms serialize + copy
```

### 4.2 Transferable Objects (Đối tượng có thể chuyển quyền sở hữu)

**Transferable Objects** cho phép bạn **transfer ownership** (chuyển quyền sở hữu) của buffer sang thread khác thay vì copy. Sau khi transfer, bộ nhớ thuộc về thread nhận — thread gửi **mất quyền truy cập** (buffer bị detach).

```javascript
// ✅ Encode data vào ArrayBuffer trước, rồi transfer

// Bước 1: Encode 1M orders vào columnar ArrayBuffer
function encodeOrdersToBuffer(orders) {
  const n = orders.length;
  // Layout: [ids: Int32 × N][amounts: Float64 × N][categories: Uint8 × N][timestamps: Float64 × N]
  const bufferSize = n * (4 + 8 + 1 + 8);  // bytes per record
  const buffer = new ArrayBuffer(bufferSize);

  const ids        = new Int32Array(buffer, 0, n);
  const amounts    = new Float64Array(buffer, n * 4, n);
  const categories = new Uint8Array(buffer, n * 4 + n * 8, n);
  const timestamps = new Float64Array(buffer, n * 4 + n * 8 + n, n);

  const catMap = { tech: 0, fashion: 1, food: 2, book: 3 };
  for (let i = 0; i < n; i++) {
    ids[i]         = orders[i].id;
    amounts[i]     = orders[i].amount;
    categories[i]  = catMap[orders[i].category] ?? 255;
    timestamps[i]  = new Date(orders[i].createdAt).getTime();
  }

  return buffer;
}

const buffer = encodeOrdersToBuffer(orders);

// Bước 2: Transfer buffer — O(1) operation!
worker.postMessage(
  { type: 'LOAD_DATA', buffer, count: orders.length },
  [buffer]  // ← transferable list — buffer bị detach ở main thread sau đây
);

// Sau lệnh này: buffer.byteLength === 0 (đã bị detach)
console.log(buffer.byteLength); // 0
```

```javascript
// analytics.worker.js — nhận buffer
self.onmessage = function(e) {
  if (e.data.type === 'LOAD_DATA') {
    const { buffer, count } = e.data;

    // Reconstruct views từ buffer đã nhận
    const ids        = new Int32Array(buffer, 0, count);
    const amounts    = new Float64Array(buffer, count * 4, count);
    const categories = new Uint8Array(buffer, count * 4 + count * 8, count);
    const timestamps = new Float64Array(buffer, count * 4 + count * 8 + count, count);

    // Bây giờ worker sở hữu buffer — có thể process nhanh
  }
};
```

**So sánh hiệu năng:**

```
Dataset: 1M orders (~21MB data)

❌ JSON stringify/parse:
  Serialize: ~450ms
  Transfer:  ~120ms (network copy qua thread boundary)
  Parse:     ~380ms
  Total:     ~950ms

❌ Structured Clone (object array):
  Clone:     ~320ms
  Total:     ~320ms

✅ ArrayBuffer Transfer:
  Encode:    ~45ms (một lần, có thể precompute)
  Transfer:  ~0.1ms (pointer swap, O(1))
  Total:     ~45ms
```

> **Lưu ý thực tế:** Sau khi transfer, main thread **không còn data**. Đây là trade-off: bạn đổi memory isolation lấy zero-copy transfer speed. Trong analytics use case, thường chấp nhận được vì data ở worker là "source of truth" còn main thread chỉ cần kết quả.

---

## 5. Compute Optimization (Tối Ưu Tính Toán)

### 5.1 Chunk Processing (Xử lý theo khối)

**Vấn đề:** Dù trong Worker, nếu bạn xử lý 10M records trong một vòng lặp duy nhất, Worker sẽ bị block và không thể nhận message mới (e.g., user cancel request).

**Giải pháp:** Chia nhỏ công việc thành chunks, yield giữa các chunk.

```javascript
// analytics.worker.js

// Task: Build inverted index cho 1M orders theo category
async function buildIndexChunked(store, chunkSize = 50_000) {
  const { categories, length } = store;
  const index = new Map(); // categoryCode → Int32Array of indices

  // Pre-allocate buckets
  const buckets = [[], [], [], []]; // 4 categories

  let processed = 0;

  while (processed < length) {
    const end = Math.min(processed + chunkSize, length);

    // Xử lý một chunk
    for (let i = processed; i < end; i++) {
      buckets[categories[i]].push(i);
    }

    processed = end;

    // Báo cáo progress về main thread
    self.postMessage({
      type: 'INDEX_PROGRESS',
      payload: { processed, total: length, pct: (processed / length * 100).toFixed(1) }
    });

    // Yield — cho event loop của Worker xử lý message mới (e.g., cancel)
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  // Convert buckets sang TypedArrays
  for (let c = 0; c < buckets.length; c++) {
    index.set(c, new Int32Array(buckets[c]));
  }

  return index;
}
```

**Complexity:**
- Tổng: O(N) — không thay đổi
- Latency cho cancel: O(chunkSize) thay vì O(N) — có thể interrupt sau mỗi chunk

### 5.2 Incremental Aggregation (Tổng hợp tăng dần)

**Vấn đề:** Có transaction mới liên tục (fintech stream) → recompute từ đầu = O(N) mỗi lần.

**Giải pháp:** Duy trì **running aggregates** (tổng hợp đang chạy), cập nhật O(1) khi có data mới.

```javascript
// Fintech: Realtime volume tracker
class IncrementalVolumeAggregator {
  constructor() {
    // Running state — cập nhật incremental
    this.volumeBySymbol = new Map();   // symbol → total volume
    this.countBySymbol  = new Map();   // symbol → count
    this.totalVolume    = 0;
    this.txCount        = 0;
  }

  // O(1) — không scan lại history
  addTransaction(tx) {
    const prev = this.volumeBySymbol.get(tx.symbol) || 0;
    this.volumeBySymbol.set(tx.symbol, prev + tx.amount);

    const prevCount = this.countBySymbol.get(tx.symbol) || 0;
    this.countBySymbol.set(tx.symbol, prevCount + 1);

    this.totalVolume += tx.amount;
    this.txCount++;
  }

  // O(1) — chỉ lookup
  getVolumeFor(symbol) {
    return this.volumeBySymbol.get(symbol) || 0;
  }

  // Snapshot để render dashboard
  getSnapshot() {
    return {
      bySymbol: Object.fromEntries(this.volumeBySymbol),
      total: this.totalVolume,
      count: this.txCount
    };
  }
}

// Usage trong Worker
const aggregator = new IncrementalVolumeAggregator();

// Load historical data — O(N) lần đầu tiên
for (const tx of historicalTransactions) {
  aggregator.addTransaction(tx);
}

// Sau đó: mỗi tx mới chỉ là O(1)
self.onmessage = (e) => {
  if (e.data.type === 'NEW_TX') {
    aggregator.addTransaction(e.data.payload);
    // Push snapshot update mỗi 100ms (throttled)
  }
};
```

### 5.3 Indexed Filtering (Lọc bằng chỉ mục)

**Vấn đề:** `filter(category === 'tech')` trên 1M records = O(N) scan mỗi lần.

**Giải pháp:** Build **inverted index** (chỉ mục đảo ngược) một lần → filter thành O(K) với K là số kết quả.

```javascript
class CategoryIndex {
  constructor(categoriesArray) {
    // Build một lần — O(N)
    this.index = new Map(); // categoryCode → Int32Array(indices)
    const buckets = new Map();

    for (let i = 0; i < categoriesArray.length; i++) {
      const cat = categoriesArray[i];
      if (!buckets.has(cat)) buckets.set(cat, []);
      buckets.get(cat).push(i);
    }

    // Convert to TypedArray cho performance
    for (const [cat, indices] of buckets) {
      this.index.set(cat, new Int32Array(indices));
    }
  }

  // O(K) với K = số records thuộc category đó
  getIndices(categoryCode) {
    return this.index.get(categoryCode) || new Int32Array(0);
  }
}

// Build index một lần khi load data
const catIndex = new CategoryIndex(store.categories);

// Query: SUM(amount) WHERE category = 'tech' — O(K) thay vì O(N)
function sumAmountByCategory(store, catIndex, categoryCode) {
  const indices = catIndex.getIndices(categoryCode); // Int32Array
  let total = 0;
  for (let j = 0; j < indices.length; j++) {
    total += store.amounts[indices[j]];
  }
  return total;
}
```

**Complexity so sánh:**

```
Full scan:   O(N)  = 1,000,000 ops
Index scan:  O(K)  = 250,000 ops (nếu 25% là tech)

Thực tế: index scan nhanh hơn ~4× cho uniform distribution
         index scan nhanh hơn ~100× nếu category rất selective (1%)
```

**Trade-off:** Index chiếm thêm memory. Với 1M records, 4 category buckets (Int32Array × 4 × 250K × 4 bytes) = ~4MB. Hoàn toàn chấp nhận được.

### 5.4 Prefix Sum (Tổng tích lũy)

**Vấn đề:** Query "tổng doanh thu từ ngày D1 đến D2" — nếu data đã sort theo ngày, mỗi query cần O(D2-D1) iterations.

**Giải pháp:** **Prefix Sum Array** (mảng tổng tích lũy) — precompute một lần, query range bất kỳ là O(1).

```javascript
// Giả sử orders đã sort theo ngày, mỗi ngày là một bucket
class DailyRevenuePrefixSum {
  constructor(dailyRevenue) {
    // dailyRevenue[i] = doanh thu ngày i (Float64Array, 365 phần tử)
    this.n = dailyRevenue.length;
    this.prefix = new Float64Array(this.n + 1);

    // Build prefix sum — O(N) một lần
    for (let i = 0; i < this.n; i++) {
      this.prefix[i + 1] = this.prefix[i] + dailyRevenue[i];
    }
  }

  // O(1) — query doanh thu từ ngày start đến end (inclusive, 0-indexed)
  queryRange(start, end) {
    if (start > end || start < 0 || end >= this.n) return 0;
    return this.prefix[end + 1] - this.prefix[start];
  }
}

// Ví dụ sử dụng
const dailyRevenue = new Float64Array(365);
// ... fill từ columnar store

const prefixSum = new DailyRevenuePrefixSum(dailyRevenue);

// Query: doanh thu 30 ngày gần nhất (ngày 335 → 364)
const last30Days = prefixSum.queryRange(335, 364); // O(1)!

// Query: doanh thu Q1 (ngày 0 → 89)
const q1Revenue = prefixSum.queryRange(0, 89);     // O(1)!
```

**Minh họa prefix sum:**

```
Daily Revenue: [100, 200, 150, 300, 250]
Prefix Sum:    [  0, 100, 300, 450, 750, 1000]
               ↑index 0 là sentinel

Query range(1, 3) = prefix[4] - prefix[1] = 750 - 100 = 650
= 200 + 150 + 300 ✓ (O(1) thay vì O(3))
```

### 5.5 Windowed Filtering (Lọc theo cửa sổ thời gian)

**Use case Trading:** "Last 7 days volume" — query thay đổi mỗi ngày, cần hiệu quả.

```javascript
// Data đã sort theo timestamp ascending
class SortedTimeSeriesStore {
  constructor(timestamps, amounts) {
    this.timestamps = timestamps; // Float64Array, sorted ascending
    this.amounts    = amounts;    // Float64Array
    this.n          = timestamps.length;
  }

  // Binary search — O(log N) tìm vị trí bắt đầu của time window
  lowerBound(targetTs) {
    let lo = 0, hi = this.n;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (this.timestamps[mid] < targetTs) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  // Query: sum volume trong [startTs, endTs] — O(log N + K)
  sumVolumeInWindow(startTs, endTs) {
    const lo = this.lowerBound(startTs);
    const hi = this.lowerBound(endTs + 1);

    let total = 0;
    for (let i = lo; i < hi; i++) {
      total += this.amounts[i];
    }
    return total;
  }
}

// Kết hợp với prefix sum cho O(log N) hoàn toàn:
// prefix[hi] - prefix[lo] sau khi binary search positions

// Trading dashboard query:
const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
const last7DaysVolume = store.sumVolumeInWindow(sevenDaysAgo, Date.now());
// O(log N + K) thay vì O(N)
```

---

## 6. Parallelism (Xử Lý Song Song)

### 6.1 Worker Pool (Nhóm Worker)

Thay vì một Worker duy nhất, tạo pool gồm nhiều Worker chạy song song thực sự (multi-core).

```
10M Orders → Chia 4 shards → 4 Workers → Merge kết quả

Worker 1: orders[0..2.5M]      ─────────────────┐
Worker 2: orders[2.5M..5M]     ─────────────────┤ → Merge → Final Result
Worker 3: orders[5M..7.5M]     ─────────────────┤    O(W)
Worker 4: orders[7.5M..10M]    ─────────────────┘

Thời gian: O(N/W) thay vì O(N), với W = số worker
```

```javascript
// worker-pool.js
class AnalyticsWorkerPool {
  constructor(workerCount = navigator.hardwareConcurrency || 4) {
    this.workers = Array.from({ length: workerCount }, () =>
      new Worker('./analytics.worker.js')
    );
    this.pendingTasks = new Map(); // taskId → { resolve, reject }
    this.taskCounter = 0;

    this.workers.forEach((w, idx) => {
      w.onmessage = (e) => {
        const { taskId, result, error } = e.data;
        const pending = this.pendingTasks.get(taskId);
        if (!pending) return;
        this.pendingTasks.delete(taskId);
        error ? pending.reject(new Error(error)) : pending.resolve(result);
      };
    });
  }

  // Dispatch task tới worker cụ thể
  dispatch(workerIndex, type, payload, transferables = []) {
    return new Promise((resolve, reject) => {
      const taskId = this.taskCounter++;
      this.pendingTasks.set(taskId, { resolve, reject });
      this.workers[workerIndex].postMessage(
        { taskId, type, payload },
        transferables
      );
    });
  }

  // Sharding: chia columnar store thành W phần, map-reduce
  async parallelAggregate(store, aggregateFn) {
    const W = this.workers.length;
    const chunkSize = Math.ceil(store.length / W);

    // Chia buffer thành W slices (zero-copy via subarray view)
    const tasks = Array.from({ length: W }, (_, i) => {
      const start = i * chunkSize;
      const end   = Math.min(start + chunkSize, store.length);

      // Slice buffer — tạo view, không copy
      const sliceBuffer = store.buffer.slice(
        start * store.bytesPerRecord,
        end   * store.bytesPerRecord
      );

      return this.dispatch(i, 'PARTIAL_AGGREGATE', {
        buffer: sliceBuffer,
        count: end - start
      }, [sliceBuffer]);
    });

    // Chờ tất cả workers hoàn thành — parallel execution
    const partialResults = await Promise.all(tasks);

    // Merge O(W) — rất nhanh
    return aggregateFn.merge(partialResults);
  }
}
```

```javascript
// analytics.worker.js — partial aggregate
self.onmessage = (e) => {
  const { taskId, type, payload } = e.data;

  if (type === 'PARTIAL_AGGREGATE') {
    const { buffer, count } = payload;
    const amounts = new Float64Array(buffer, 0, count);

    let sum = 0;
    for (let i = 0; i < count; i++) sum += amounts[i];

    self.postMessage({ taskId, result: { sum, count } });
  }
};
```

**Tốc độ tăng thực tế:**

```
1 Worker (single):  10M records → ~800ms
4 Workers (pool):   10M records → ~220ms (3.6× speedup)
8 Workers (pool):   10M records → ~130ms (6.1× speedup)

Lý do không linear: overhead postMessage + merge + OS scheduling
```

> **Cẩn thận:** `navigator.hardwareConcurrency` trả về số logical cores, thường 4-16. Nhưng browser cũng có overhead quản lý Worker. Từ thực nghiệm: 4 workers thường là sweet spot cho hầu hết use cases.

---

## 7. WASM Compute (WebAssembly)

### 7.1 Khi nào cần WASM?

**WebAssembly (WASM)** là định dạng bytecode chạy gần tốc độ native trong browser. Dùng khi:
- Có thuật toán tính toán nặng (FFT, matrix ops, crypto)
- JavaScript JIT không đủ tối ưu cho một pattern cụ thể
- Cần SIMD (Single Instruction Multiple Data — xử lý nhiều data song song trong một CPU instruction)

### 7.2 Ví dụ: Moving Average 5M data points

**Moving Average (đường trung bình động)** là chỉ số kỹ thuật phổ biến trong trading.

```c
// moving_average.c — compile sang WASM
#include <emscripten.h>

// Tính Simple Moving Average window=W trên array
EMSCRIPTEN_KEEPALIVE
void sma(
  const double* prices, int n,
  double* result,        int window
) {
  // Tính sum của window đầu tiên
  double windowSum = 0;
  for (int i = 0; i < window; i++) windowSum += prices[i];

  result[window - 1] = windowSum / window;

  // Sliding window — O(N) tổng thể
  for (int i = window; i < n; i++) {
    windowSum += prices[i] - prices[i - window];
    result[i] = windowSum / window;
  }
}
```

```javascript
// main.js — gọi WASM từ JavaScript
async function initWASM() {
  const module = await WebAssembly.instantiateStreaming(
    fetch('/analytics.wasm'),
    { env: { memory: new WebAssembly.Memory({ initial: 256 }) } }
  );

  return module.instance.exports;
}

async function calcMovingAverage(pricesArray, window = 20) {
  const wasm = await initWASM();

  const n = pricesArray.length;
  // WASM linear memory — cấp phát buffer
  const pricesPtr = wasm.malloc(n * 8);   // Float64 = 8 bytes
  const resultPtr = wasm.malloc(n * 8);

  // Copy data vào WASM memory
  const wasmMemory = new Float64Array(wasm.memory.buffer);
  wasmMemory.set(pricesArray, pricesPtr / 8);

  // Gọi WASM function — chạy near-native speed
  wasm.sma(pricesPtr, n, resultPtr, window);

  // Đọc kết quả
  const result = new Float64Array(wasm.memory.buffer, resultPtr, n);
  const output = new Float64Array(result); // copy ra

  wasm.free(pricesPtr);
  wasm.free(resultPtr);

  return output;
}
```

**SIMD trong WASM** (nếu target hỗ trợ):

```c
// Với WASM SIMD — xử lý 4 float64 cùng lúc (AVX2 instruction)
#include <wasm_simd128.h>

void sma_simd(const double* prices, int n, double* result, int window) {
  // Vectorized operations — 4× throughput trên CPU hỗ trợ SIMD
  // ... implementation dùng v128_t ops
}
```

**Benchmark: Moving Average trên 5M data points**

```
JavaScript (naive loop):     ~850ms
JavaScript (optimized):      ~320ms
WASM (scalar):               ~120ms
WASM (SIMD):                 ~35ms
```

> **Khi nào KHÔNG cần WASM:** Nếu bottleneck là I/O (data transfer, network), không phải CPU — WASM không giúp gì. WASM chỉ win khi bottleneck thực sự là **compute-bound** (giới hạn bởi tốc độ tính toán CPU).

---

## 8. Shared Memory (Bộ Nhớ Chia Sẻ)

### 8.1 SharedArrayBuffer và Atomics

**SharedArrayBuffer** cho phép nhiều threads (main + workers) cùng **đọc/ghi một vùng memory** mà không cần copy. **Atomics** cung cấp các **atomic operations** (toán tử nguyên tử) — đảm bảo thread-safety (an toàn đa luồng).

> ⚠️ **Browser requirement:** SharedArrayBuffer yêu cầu **Cross-Origin Isolation** (headers `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp`). Đây là yêu cầu bảo mật sau Spectre vulnerability.

### 8.2 Ví dụ: Realtime BTC Price Stream

```javascript
// Shared memory layout cho BTC price feed:
// [0]: latest price (Float64)
// [1]: price 1m ago (Float64)
// [2]: update count (Int32, dùng Atomics)
// [3]: write lock (Int32, 0 = free, 1 = locked)

const PRICE_BUFFER_SIZE = 4;
const sharedBuffer = new SharedArrayBuffer(PRICE_BUFFER_SIZE * 8);
const priceView    = new Float64Array(sharedBuffer);
const controlView  = new Int32Array(sharedBuffer);

// Truyền shared buffer cho worker (không cần transfer — đây là SHARE)
priceWorker.postMessage({ type: 'INIT', sharedBuffer });
```

```javascript
// price-worker.js — writer
let priceView, controlView;

self.onmessage = (e) => {
  if (e.data.type === 'INIT') {
    priceView   = new Float64Array(e.data.sharedBuffer);
    controlView = new Int32Array(e.data.sharedBuffer);
  }

  if (e.data.type === 'PRICE_UPDATE') {
    const newPrice = e.data.price;

    // Acquire lock bằng compareExchange — spin lock đơn giản
    // CAS (Compare-And-Swap): if(controlView[3] === 0) set to 1
    while (Atomics.compareExchange(controlView, 3, 0, 1) !== 0) {
      // spin wait — busy-wait ngắn
    }

    // Critical section — write price
    priceView[1] = priceView[0];  // shift: current → prev
    priceView[0] = newPrice;       // update current
    Atomics.add(controlView, 2, 1); // atomic increment count

    // Release lock
    Atomics.store(controlView, 3, 0);

    // Notify main thread
    Atomics.notify(controlView, 2, 1); // wake up 1 waiter
  }
};
```

```javascript
// main.js — reader (polling pattern cho UI)
function pollPrice() {
  // Đọc không cần lock cho single Float64 trên aligned address
  // (atomic read vẫn recommended cho consistency)
  const price = priceView[0];
  const count = Atomics.load(controlView, 2);

  updatePriceDisplay(price, count);
  requestAnimationFrame(pollPrice); // đọc mỗi frame (~60fps)
}
```

**Diagram luồng data:**

```
WebSocket (BTC feed)
        │
        ▼
  Price Worker  ──write──►  SharedArrayBuffer
                               [price: 45230.50]
                               [count: 1842]
                                    │
                                    │ (reads mỗi rAF, ~16ms)
                                    ▼
                              Main Thread
                           (renders price UI)
```

> **Trade-off:** SharedArrayBuffer mạnh nhưng phức tạp. Race conditions (điều kiện tranh đua), deadlocks (bế tắc) là rủi ro thực sự. Chỉ dùng khi latency thực sự critical (< 1ms) và `postMessage` overhead không chấp nhận được.

---

## 9. Memo Graph (Đồ Thị Ghi Nhớ Kết Quả)

### 9.1 Dependency Graph (Đồ thị phụ thuộc)

Trong dashboard analytics, các metric thường phụ thuộc nhau theo cây:

```
                   ┌──────────────────┐
                   │  Total Revenue   │  ← root metric
                   └────────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Revenue │  │  Revenue │  │  Revenue │
        │  by Cat. │  │  by Date │  │  by Cust │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │              │              │
        ┌────▼─────┐  ┌─────▼─────┐       │
        │Filtered  │  │Date Range │       │
        │Orders    │  │Filter     │       │
        └──────────┘  └───────────┘       │
                                    ┌─────▼─────┐
                                    │ Top 10    │
                                    │ Customers │
                                    └───────────┘
```

Nếu user filter theo date range → chỉ cần recompute các node phụ thuộc vào date filter. **Revenue by Category** không thay đổi nếu không đổi category filter.

### 9.2 Memoization Engine

```javascript
class MemoGraph {
  constructor() {
    this.nodes     = new Map(); // nodeId → { compute, deps, cache, version }
    this.versions  = new Map(); // inputId → version number
  }

  // Đăng ký một computation node
  register(nodeId, deps, computeFn) {
    this.nodes.set(nodeId, {
      compute: computeFn,
      deps,              // array of dep nodeIds
      cache: null,       // kết quả cached
      cacheVersion: -1   // version khi cache được tạo
    });
  }

  // Tính toán version hash của tất cả deps
  _depsVersion(deps) {
    return deps.map(d => this.versions.get(d) || 0).join(':');
  }

  // Get kết quả — recompute nếu deps thay đổi
  async get(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Unknown node: ${nodeId}`);

    const currentVersion = this._depsVersion(node.deps);

    if (node.cache !== null && node.cacheVersion === currentVersion) {
      return node.cache; // Cache hit — O(1)
    }

    // Cache miss — recompute
    // Recursively resolve dependencies
    const depValues = {};
    for (const dep of node.deps) {
      depValues[dep] = await this.get(dep);
    }

    const result = await node.compute(depValues);
    node.cache = result;
    node.cacheVersion = currentVersion;
    return result;
  }

  // Invalidate khi input thay đổi
  invalidate(inputId) {
    const prev = this.versions.get(inputId) || 0;
    this.versions.set(inputId, prev + 1);
    // Nodes phụ thuộc vào inputId sẽ tự detect khi get() được gọi
  }
}

// Dashboard Example
const graph = new MemoGraph();

graph.register('filteredOrders', ['rawOrders', 'dateFilter', 'categoryFilter'],
  async ({ rawOrders, dateFilter, categoryFilter }) => {
    return rawOrders.filter(/* ... */);
  }
);

graph.register('revenueByCategory', ['filteredOrders'],
  async ({ filteredOrders }) => {
    return calcRevenueByCategory(filteredOrders);
  }
);

graph.register('totalRevenue', ['filteredOrders'],
  async ({ filteredOrders }) => {
    return filteredOrders.reduce((sum, o) => sum + o.amount, 0);
  }
);

graph.register('top10Customers', ['filteredOrders'],
  async ({ filteredOrders }) => {
    return calcTop10Customers(filteredOrders);
  }
);

// Khi user thay đổi date range:
graph.invalidate('dateFilter');

// Chỉ 'filteredOrders' và descendants recompute
// 'rawOrders' không recompute
const total = await graph.get('totalRevenue'); // recompute từ filteredOrders
const bycat = await graph.get('revenueByCategory'); // dùng lại filteredOrders cache
```

---

## 10. Query Engine (Bộ Máy Truy Vấn Nội Bộ)

### 10.1 Logical Plan → Physical Plan

Khi analytics engine đủ phức tạp, bạn cần **query planner** để chọn execution strategy tối ưu.

**Logical Plan** (kế hoạch logic) — mô tả *what* cần làm:
```
SELECT SUM(amount), category
FROM orders
WHERE date BETWEEN '2026-01-01' AND '2026-04-17'
  AND category = 'tech'
GROUP BY category
```

**Physical Plan** (kế hoạch thực thi) — mô tả *how* thực hiện:
```
Option A: Full Scan
  Scan all 1M rows → Filter date → Filter category → Aggregate
  Cost: O(N) = 1,000,000 ops

Option B: Index + Scan
  CategoryIndex.get('tech') → K rows → Filter date → Aggregate
  Cost: O(K) = 250,000 ops  ← nếu 25% là tech

Option C: Prefix Sum + Index
  CategoryIndex.get('tech') → date prefix → O(1) aggregate
  Cost: O(log N) để tìm date range → O(K) filter → O(1) sum
  Best case nếu có cả hai index
```

### 10.2 Cost-Based Optimizer

```javascript
class QueryPlanner {
  constructor(store, indices) {
    this.store   = store;
    this.indices = indices; // { category: CategoryIndex, date: DateIndex, ... }

    // Statistics (thống kê) cho cost estimation
    this.stats = {
      totalRows: store.length,
      categorySelectivity: new Map(), // categoryCode → fraction
      dateRange: { min: 0, max: 0 }
    };
  }

  // Ước tính số row sau filter
  estimateSelectivity(filter) {
    if (filter.type === 'CATEGORY') {
      return this.stats.categorySelectivity.get(filter.value) || 0.25;
    }
    if (filter.type === 'DATE_RANGE') {
      const totalDays = (this.stats.dateRange.max - this.stats.dateRange.min) / 86400000;
      const queryDays = (filter.end - filter.start) / 86400000;
      return Math.min(queryDays / totalDays, 1);
    }
    return 1.0; // unknown → assume full scan
  }

  // Chọn plan tối ưu dựa trên estimated cost
  plan(query) {
    const { filters, aggregation } = query;
    const N = this.stats.totalRows;

    // Tìm filter có selectivity thấp nhất (most selective first)
    const rankedFilters = filters
      .map(f => ({ filter: f, sel: this.estimateSelectivity(f) }))
      .sort((a, b) => a.sel - b.sel);

    const plans = [];

    // Plan 1: Full Scan
    plans.push({
      type: 'FULL_SCAN',
      estimatedCost: N,
      execute: () => this._fullScan(query)
    });

    // Plan 2: Index Scan (nếu có index cho filter selective nhất)
    const topFilter = rankedFilters[0];
    if (topFilter && this.indices[topFilter.filter.field]) {
      const indexedRows = Math.ceil(N * topFilter.sel);
      plans.push({
        type: 'INDEX_SCAN',
        estimatedCost: indexedRows + Math.log2(N), // index lookup + scan
        execute: () => this._indexScan(query, topFilter.filter)
      });
    }

    // Plan 3: Prefix Sum (nếu là date range aggregation)
    const dateFilter = filters.find(f => f.type === 'DATE_RANGE');
    if (dateFilter && this.indices.datePrefix && aggregation === 'SUM') {
      plans.push({
        type: 'PREFIX_SUM',
        estimatedCost: Math.log2(N) + 1, // binary search + O(1)
        execute: () => this._prefixSumQuery(query, dateFilter)
      });
    }

    // Chọn plan có cost thấp nhất
    plans.sort((a, b) => a.estimatedCost - b.estimatedCost);
    return plans[0];
  }

  execute(query) {
    const plan = this.plan(query);
    console.log(`[QueryPlanner] Chose: ${plan.type}, est. cost: ${plan.estimatedCost}`);
    return plan.execute();
  }
}

// Usage
const planner = new QueryPlanner(columnarStore, { category: catIndex, datePrefix: prefixStore });

const result = planner.execute({
  filters: [
    { type: 'CATEGORY', field: 'category', value: 0 /* tech */ },
    { type: 'DATE_RANGE', field: 'timestamp', start: thirtyDaysAgo, end: now }
  ],
  aggregation: 'SUM',
  field: 'amount'
});
```

---

## 11. Kiến Trúc Hoàn Chỉnh

### Full Pipeline

```
API Response (JSON)
        │
        ▼
   [Data Ingestion Layer]
   • Parse JSON một lần
   • Validate & normalize
   • Encode timestamps thành epoch numbers
        │
        ▼ (ArrayBuffer transfer)
   [Worker: Data Store]
   • Columnar TypedArrays (amounts, timestamps, categories...)
   • In-memory — không serialize lại
        │
        ▼
   [Worker: Index Builder]  ←─── chạy asynchronous, chunk-based
   • CategoryIndex (inverted index)
   • DatePrefixSum (prefix sum array)
   • CustomerIndex (hash map)
        │
        ▼
   [Worker: Query Engine]
   • QueryPlanner (cost-based)
   • Memo Graph (dependency cache)
        │
        ▼ (postMessage với kết quả nhỏ)
   [Main Thread: UI Layer]
   • Nhận kết quả aggregated (số, không phải raw data)
   • Render charts, tables
   • Handle user interactions
        │
        ▼ (user filter thay đổi)
   [Cycle: Invalidate Memo → Re-query → Re-render]
```

### Component Interaction Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        BROWSER                                 │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Main Thread                                             │ │
│  │  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │ │
│  │  │  UI Layer  │  │ Memo Graph   │  │ Query Facade   │  │ │
│  │  │ (React/Vue)│  │ (invalidate) │  │ (high-level    │  │ │
│  │  └────────────┘  └──────────────┘  │  query API)    │  │ │
│  │         ▲                          └───────┬────────┘  │ │
│  │         │ results                          │ postMsg   │ │
│  └─────────┼──────────────────────────────────┼───────────┘ │
│            │                                  │              │
│  ┌─────────┼──────────────────────────────────▼───────────┐ │
│  │  Worker Pool (2-4 workers)                              │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │  Columnar Store (TypedArrays)                   │   │ │
│  │  │  amounts[] | timestamps[] | categories[]        │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  │  ┌──────────────┐  ┌───────────────┐                   │ │
│  │  │CategoryIndex │  │DatePrefixSum  │  ← indices        │ │
│  │  └──────────────┘  └───────────────┘                   │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  QueryPlanner (cost-based optimizer)             │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## 12. Bottleneck Thực Tế

### 12.1 GC (Garbage Collection — Thu gom rác) Pressure

**GC** là quá trình JavaScript engine tự động giải phóng memory không còn được tham chiếu. Vấn đề: GC **stop-the-world pause** (dừng toàn bộ execution) từ vài ms đến vài trăm ms.

**Nguồn gây GC pressure trong analytics:**

```javascript
// ❌ Tạo objects tạm trong vòng lặp = GC hell
function badAggregation(orders) {
  return orders
    .filter(o => new Date(o.createdAt) > cutoff)  // tạo Date object cho mỗi row
    .map(o => ({ ...o, normalizedAmount: o.amount * 1.1 }))  // tạo object mới mỗi row
    .reduce((acc, o) => {                          // tạo object mới mỗi reduce step
      return { ...acc, [o.category]: (acc[o.category] || 0) + o.normalizedAmount };
    }, {});
}
// 1M rows = 3M objects tạm → GC chạy nhiều lần trong quá trình này
```

**Giải pháp:**

```javascript
// ✅ Object reuse, no temporary allocations
function goodAggregation(store) {
  const result = new Float64Array(4); // pre-allocated, reusable
  const cutoffTs = cutoff.getTime();  // tính một lần trước vòng lặp

  const { amounts, timestamps, categories, length } = store; // destructure ra ngoài

  for (let i = 0; i < length; i++) {
    if (timestamps[i] > cutoffTs) {   // số nguyên so sánh số nguyên — không tạo object
      result[categories[i]] += amounts[i] * 1.1; // in-place update
    }
  }

  return result; // trả về 1 TypedArray, không phải nhiều objects
}
// 0 temporary objects → GC không bị trigger
```

**GC Monitoring (Chrome DevTools):**
```javascript
// Phát hiện GC pause bằng performance.now() delta
let lastFrame = performance.now();
function detectGCPause() {
  const now = performance.now();
  const delta = now - lastFrame;
  if (delta > 50) {
    console.warn(`Possible GC pause: ${delta.toFixed(1)}ms`);
  }
  lastFrame = now;
  requestAnimationFrame(detectGCPause);
}
```

### 12.2 Memory Limits (Giới hạn bộ nhớ)

Browser không có giới hạn cứng được document chính thức, nhưng thực tế:

```
Desktop Chrome:   ~2-4GB per tab trước khi OOM crash
Mobile Chrome:    ~512MB - 1GB (vary by device)
Safari iOS:       ~200-400MB (strict, jetsam kills tab)
Firefox:          ~2GB typical
```

**Ước tính memory cho columnar store:**

```
1M orders, 4 columns:
  ids:        Int32Array  × 1M = 4MB
  amounts:    Float64Array × 1M = 8MB
  categories: Uint8Array  × 1M = 1MB
  timestamps: Float64Array × 1M = 8MB
  ────────────────────────────────
  Store total:                   21MB

Indexes:
  CategoryIndex (4 buckets × ~250K × 4B): ~4MB
  DatePrefixSum (365 × 8B):               ~3KB

Worker memory overhead:
  JS engine per worker:                   ~5-10MB
  ────────────────────────────────
  Grand total (4 workers):                ~65MB

10M orders → ~650MB — bắt đầu nguy hiểm trên mobile
```

**Chiến lược quản lý memory:**

```javascript
class MemoryManager {
  constructor(maxBytes = 200 * 1024 * 1024) { // 200MB limit
    this.maxBytes = maxBytes;
    this.allocations = new Map(); // key → { buffer, bytes }
  }

  // Track allocations
  allocate(key, byteLength) {
    const current = this._totalAllocated();
    if (current + byteLength > this.maxBytes) {
      this._evictLRU(); // evict least recently used
    }
    const buffer = new ArrayBuffer(byteLength);
    this.allocations.set(key, { buffer, bytes: byteLength, lastUsed: Date.now() });
    return buffer;
  }

  _totalAllocated() {
    let total = 0;
    for (const { bytes } of this.allocations.values()) total += bytes;
    return total;
  }

  _evictLRU() {
    let oldest = Infinity, oldestKey = null;
    for (const [key, { lastUsed }] of this.allocations) {
      if (lastUsed < oldest) { oldest = lastUsed; oldestKey = key; }
    }
    if (oldestKey) {
      console.log(`[MemoryManager] Evicting: ${oldestKey}`);
      this.allocations.delete(oldestKey);
      // Explicit GC hint (không đảm bảo nhưng giúp ích)
    }
  }
}
```

### 12.3 Browser Constraints (Giới hạn trình duyệt)

**1. Worker startup time:**
```
First Worker creation: ~50-150ms (cold start)
→ Giải pháp: tạo worker pool lúc app init, không phải lúc query
```

**2. postMessage serialization overhead:**
```
Gửi object 1MB qua postMessage: ~10-50ms
→ Giải pháp: dùng Transferable (đã trình bày ở mục 4)
→ Giải pháp: chỉ gửi kết quả nhỏ (aggregated) về main thread, không gửi raw data
```

**3. Worker không có access:**
```
❌ Worker không thể: DOM, window.location, localStorage, cookies
✅ Worker có thể:    fetch(), WebSocket, IndexedDB, crypto, WASM
```

**4. SharedArrayBuffer CORS requirements:**
```http
# Phải có trên tất cả responses:
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**5. Memory per Worker:**
```
Mỗi Worker có JS heap riêng (~10-20MB overhead)
4 Workers = ~40-80MB overhead trước khi lưu data
→ Không spawn quá nhiều Worker
```

**6. Throttling trong background tab:**
```
Browser throttle timers/workers khi tab bị ẩn
→ Realtime analytics có thể miss updates khi user switch tab
→ Giải pháp: dùng Page Visibility API để pause/resume updates
```

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    worker.postMessage({ type: 'PAUSE_STREAM' });
  } else {
    worker.postMessage({ type: 'RESUME_STREAM' });
    worker.postMessage({ type: 'SYNC_LATEST' }); // catch up
  }
});
```

**7. IndexedDB cho persistence (bộ nhớ lâu dài):**
```
Worker → IndexedDB → persist data qua sessions
Read/Write: async, nhưng nhanh hơn re-fetch từ API
Limit: ~50% disk space (vary by browser)
```

---

## 13. Trade-offs — Khi Nào Dùng, Khi Nào Không

### Dataset Size → Approach Mapping

```
Dataset Size    │ Approach                          │ Why
────────────────┼───────────────────────────────────┼────────────────────
< 10K records   │ Sync, main thread, plain arrays   │ Không đáng phức tạp
10K - 100K      │ Web Worker + plain arrays          │ Offload blocking
100K - 1M       │ Worker + TypedArray columnar       │ Cache locality quan trọng
1M - 10M        │ + Indexes + Prefix Sum             │ O(N) scan quá chậm
10M+            │ + Worker Pool + WASM               │ Cần parallelism + SIMD
Realtime stream │ + Incremental Aggregation          │ Không thể re-scan toàn bộ
Multi-user collab│ + SharedArrayBuffer               │ Sync state không qua copies
```

### Khi KHÔNG nên dùng các kỹ thuật này

| Kỹ thuật | Đừng dùng khi |
|----------|---------------|
| Web Worker | Dataset < 10K, query < 5ms — overhead postMessage lớn hơn lợi ích |
| Columnar TypedArray | Data thường xuyên update từng field lẻ — overhead rebuild cao |
| Worker Pool | I/O-bound (network fetch) — thêm worker không giúp gì |
| WASM | Logic đơn giản, JS JIT đủ nhanh — complexity không đáng |
| SharedArrayBuffer | Server có thể cung cấp pre-aggregated data — không cần client compute |
| Prefix Sum | Data insert/delete liên tục — rebuild O(N) mỗi lần |

### Memory vs CPU Trade-off

```
Kỹ thuật          │ Memory overhead │ CPU saving │ Khi nào worth it
──────────────────┼─────────────────┼────────────┼─────────────────────
CategoryIndex     │ +4MB / 1M rows  │ ~4-100×    │ Query category > 3×/min
DatePrefixSum     │ +3KB / 365 days │ O(N) → O(1)│ Luôn worth it
Worker pool (4)   │ +40MB overhead  │ ~3-6×      │ Queries > 200ms
WASM module       │ +1-5MB          │ ~3-20×     │ Math-heavy ops > 50ms
Full columnar     │ ~12× nhỏ hơn   │ ~5-10×     │ Dataset > 500K rows
```

---

## 14. So Sánh Với Hệ Thống Production

### Kiến trúc chúng ta vừa build ↔ Database production

| Concept trong bài | Tương đương production |
|-------------------|------------------------|
| Columnar TypedArray | ClickHouse / DuckDB columnar storage format |
| Prefix Sum Array | B-tree range index trong PostgreSQL |
| CategoryIndex (inverted) | Bitmap index trong Oracle / ClickHouse |
| Worker Pool sharding | Parallel query execution trong BigQuery |
| Memo Graph | Materialized Views trong SQL databases |
| Incremental Aggregation | Streaming aggregation trong Apache Flink / Kafka Streams |
| Query Planner (cost-based) | PostgreSQL Query Planner (EXPLAIN ANALYZE) |
| WASM SIMD | AVX2/AVX-512 vectorized execution trong DuckDB |

### Điểm khác biệt quan trọng

```
Production DB:
  ✅ Persistence (disk storage)
  ✅ Distributed across machines
  ✅ ACID transactions
  ✅ Handles 100B+ rows
  ✅ Query language (SQL)
  ❌ Network roundtrip latency (~10-100ms)
  ❌ Server cost

Browser Analytics Engine:
  ✅ Zero network latency sau lần load đầu
  ✅ Chạy offline
  ✅ Không server cost
  ✅ User data không rời khỏi device (privacy)
  ❌ Limited RAM (< 2GB)
  ❌ Limited CPU (single device)
  ❌ Mất data khi reload (cần IndexedDB cho persistence)
```

**Use case phù hợp nhất cho browser analytics engine:**

```
✅ Trading dashboard realtime (latency < 100ms bắt buộc)
✅ Offline-capable analytics app (field work, poor connectivity)
✅ Privacy-sensitive data (health data, personal finance)
✅ Client-heavy SaaS (data đã có ở client, không muốn round-trip)
✅ Interactive data exploration với filter thay đổi nhanh

❌ Data warehouse queries (hundreds of GB)
❌ Multi-user aggregations (cần central compute)
❌ Complex joins giữa nhiều large tables
```

---

## Tổng Kết

Bạn vừa đi qua toàn bộ stack của một **browser-native analytics engine**:

```
Layer 1 (Foundation):    Event Loop hiểu đúng → biết khi nào cần offload
Layer 2 (Threading):     Web Workers → non-blocking compute
Layer 3 (Data format):   Columnar TypedArrays → cache-friendly, memory-efficient
Layer 4 (Transfer):      Transferable ArrayBuffers → zero-copy IPC
Layer 5 (Algorithms):    Chunk / Incremental / Index / Prefix / Window → O(1) queries
Layer 6 (Parallelism):   Worker Pool + Sharding → linear scaling với cores
Layer 7 (WASM):          Near-native compute cho math-heavy ops
Layer 8 (Memory model):  SharedArrayBuffer + Atomics → true shared state
Layer 9 (Caching):       Memo Graph → avoid redundant computation
Layer 10 (Planning):     Query Planner → automatic strategy selection
Layer 11 (Resilience):   GC avoidance + Memory budgets + Browser constraints
```

Mỗi layer giải quyết một bottleneck cụ thể. Không layer nào "phải có" — **chọn theo dataset size và latency requirement** của bạn.

> **Nguyên tắc cuối:** Đừng tối ưu premature. Bắt đầu với Layer 1-3. Profile thực tế. Chỉ thêm layer khi profiler chỉ ra bottleneck cụ thể.
