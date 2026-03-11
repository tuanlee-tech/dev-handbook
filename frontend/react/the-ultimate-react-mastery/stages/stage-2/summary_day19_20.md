# 📚 Tổng Hợp Bài Tập - Ngày 19 & 20: Data Fetching

---

## 🗓️ NGÀY 19: Data Fetching Basics

### 📌 Các Khái Niệm Cốt Lõi

| Vấn đề | Giải pháp |
|--------|-----------|
| Fetch trong render → Infinite loop | Fetch trong `useEffect` |
| HTTP 404/500 không được catch | Check `response.ok` trước khi parse |
| `async` trong `useEffect` trực tiếp | Tạo `async function` bên trong rồi gọi |
| setState sau unmount → Warning | Dùng `isCancelled` flag |

---

### ⭐ Level 1 — TodoList (Basic Fetch)

**Yêu cầu:** Fetch todos, hiển thị loading/error/success, show completed status.

```jsx
import { useState, useEffect } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTodos(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchTodos();
  }, []); // Empty deps → fetch once

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Todo List (first 20)</h2>
      <ul>
        {todos.slice(0, 20).map((todo) => (
          <li key={todo.id}>
            {todo.completed ? "✅" : "⭕"} {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### ⭐⭐ Level 2 — PhotoGallery (Fetch với Dependencies)

**Yêu cầu:** Phân trang, refetch khi page thay đổi, loading mỗi lần fetch.

```jsx
import { useState, useEffect } from "react";

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const PHOTOS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/photos?_page=${currentPage}&_limit=${PHOTOS_PER_PAGE}`
        );
        if (!response.ok) throw new Error(`Failed: ${response.status}`);

        const data = await response.json();
        setPhotos(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchPhotos();
  }, [currentPage]); // ← Refetch khi page thay đổi

  if (loading) return <div>Loading photos (page {currentPage})...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Photo Gallery - Page {currentPage}</h2>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}>← Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={() => setCurrentPage((p) => p + 1)}>Next →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ border: "1px solid #ddd", borderRadius: "4px" }}>
            <img src={photo.thumbnailUrl} alt={photo.title} style={{ width: "100%" }} />
            <div style={{ padding: "0.5rem", fontSize: "0.875rem" }}>
              {photo.title.substring(0, 40)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### ⭐⭐⭐ Level 3 — UserSearch (Debounce + Client-side Filter)

**Yêu cầu:** Fetch once on mount, debounce 500ms, filter client-side, min 2 ký tự.

```jsx
import { useState, useEffect } from "react";

function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Effect 1: Fetch all users once
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error(`Failed: ${response.status}`);
        const data = await response.json();
        setAllUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Effect 2: Debounce 500ms
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Effect 3: Filter khi debounced query đổi
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setFilteredUsers(allUsers);
      return;
    }
    const lowerQuery = debouncedQuery.toLowerCase();
    setFilteredUsers(
      allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(lowerQuery) ||
          u.email.toLowerCase().includes(lowerQuery)
      )
    );
  }, [debouncedQuery, allUsers]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Search</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name or email..."
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />
      <div style={{ marginBottom: "16px", color: "#555" }}>
        {isSearching ? "Searching..." : `Found ${filteredUsers.length} user(s)`}
        {searchQuery && searchQuery.length < 2 && (
          <span style={{ color: "#e67e22", marginLeft: "12px" }}>
            (Type at least 2 characters)
          </span>
        )}
      </div>
      {filteredUsers.length === 0 && debouncedQuery.length >= 2 ? (
        <div>No users found matching "{debouncedQuery}"</div>
      ) : (
        filteredUsers.map((user) => (
          <div key={user.id} style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "12px" }}>
            <strong>{user.name}</strong>
            <div style={{ color: "#555" }}>{user.email}</div>
            <div style={{ color: "#777" }}>{user.company.name}</div>
          </div>
        ))
      )}
    </div>
  );
}
```

---

### ⭐⭐⭐⭐ Level 4 — CommentSystem (Nested Fetch)

**Yêu cầu:** PostList + CommentList tách biệt, lazy load comments khi click post.

```jsx
import { useState, useEffect } from "react";

const POSTS_API = "https://jsonplaceholder.typicode.com/posts";
const COMMENTS_API = "https://jsonplaceholder.typicode.com/comments";

function PostList({ onSelectPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${POSTS_API}?_limit=10`);
        if (!response.ok) throw new Error(`Failed (${response.status})`);
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h3>Posts</h3>
      {posts.map((post) => (
        <div key={post.id} onClick={() => onSelectPost(post.id)}
          style={{ padding: "12px", marginBottom: "8px", border: "1px solid #ddd", cursor: "pointer" }}>
          <h4 style={{ margin: "0 0 6px 0" }}>{post.title}</h4>
          <p style={{ margin: 0, color: "#666" }}>{post.body.substring(0, 80)}...</p>
          <small style={{ color: "#4CAF50" }}>Click to view comments →</small>
        </div>
      ))}
    </div>
  );
}

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    setError(null);

    async function fetchComments() {
      try {
        const response = await fetch(`${COMMENTS_API}?postId=${postId}`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId]); // ← Refetch khi postId đổi

  if (!postId) return <div>Select a post to view comments</div>;
  if (loading) return <div>Loading comments...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h3>Comments ({comments.length})</h3>
      {comments.map((comment) => (
        <div key={comment.id} style={{ padding: "12px", marginBottom: "12px", border: "1px solid #eee" }}>
          <strong style={{ color: "#1976d2" }}>{comment.name}</strong>
          <small style={{ color: "#888", marginLeft: "12px" }}>{comment.email}</small>
          <p style={{ margin: "6px 0 0" }}>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}

function CommentSystem() {
  const [selectedPostId, setSelectedPostId] = useState(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <PostList onSelectPost={setSelectedPostId} />
      <CommentList postId={selectedPostId} />
    </div>
  );
}
```

---

### ⭐⭐⭐⭐⭐ Level 5 — AnalyticsDashboard (Parallel Fetch + Cache)

**Yêu cầu:** 5 endpoints song song, individual loading/error, retry per stat, localStorage cache 5 phút, refresh all.

```jsx
import { useState, useEffect } from "react";

const API_BASE = "https://jsonplaceholder.typicode.com";

function StatCard({ title, value, icon, loading, error, onRetry }) {
  if (loading) return (
    <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px", textAlign: "center" }}>
      Loading {title}...
    </div>
  );
  if (error) return (
    <div style={{ padding: "20px", background: "#fff0f0", border: "1px solid #f44336", borderRadius: "8px", textAlign: "center" }}>
      <div style={{ color: "#f44336", marginBottom: "8px" }}>Error loading {title}</div>
      <button onClick={onRetry}
        style={{ padding: "6px 16px", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Retry
      </button>
    </div>
  );
  return (
    <div style={{ padding: "20px", background: "white", border: "1px solid #4CAF50", borderRadius: "8px", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "4px" }}>{title}</div>
      <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#4CAF50" }}>
        {value !== null ? value.toLocaleString() : "—"}
      </div>
    </div>
  );
}

function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    users: { value: null, loading: true, error: null },
    posts: { value: null, loading: true, error: null },
    comments: { value: null, loading: true, error: null },
    todos: { value: null, loading: true, error: null },
    albums: { value: null, loading: true, error: null },
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStat = async (endpoint, key) => {
    try {
      setStats((prev) => ({ ...prev, [key]: { ...prev[key], loading: true, error: null } }));
      const response = await fetch(`${API_BASE}/${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const count = Array.isArray(data) ? data.length : 0;
      setStats((prev) => ({ ...prev, [key]: { value: count, loading: false, error: null } }));
      // Cache 5 phút
      try {
        localStorage.setItem(`stat_${key}`, JSON.stringify({ value: count, timestamp: Date.now() }));
      } catch (e) { /* silent */ }
    } catch (err) {
      setStats((prev) => ({ ...prev, [key]: { value: null, loading: false, error: err.message } }));
    }
  };

  useEffect(() => {
    // Load from cache first
    ["users", "posts", "comments", "todos", "albums"].forEach((key) => {
      try {
        const cached = localStorage.getItem(`stat_${key}`);
        if (cached) {
          const { value, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setStats((prev) => ({ ...prev, [key]: { value, loading: false, error: null } }));
          }
        }
      } catch (e) { /* ignore */ }
    });

    // Fetch fresh in parallel
    Promise.all([
      fetchStat("users", "users"),
      fetchStat("posts", "posts"),
      fetchStat("comments", "comments"),
      fetchStat("todos", "todos"),
      fetchStat("albums", "albums"),
    ]).then(() => setLastUpdated(new Date()));
  }, [refreshTrigger]);

  const allLoaded = Object.values(stats).every((s) => !s.loading);
  const hasError = Object.values(stats).some((s) => s.error !== null);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2>Analytics Dashboard</h2>
          {lastUpdated && <p style={{ color: "#666", margin: 0 }}>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
        </div>
        <button onClick={() => setRefreshTrigger((p) => p + 1)}
          style={{ padding: "10px 20px", background: "#2196F3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Refresh All
        </button>
      </div>
      <div style={{ padding: "12px", marginBottom: "24px", background: allLoaded ? (hasError ? "#fff3cd" : "#e8f5e9") : "#e3f2fd",
        border: `1px solid ${allLoaded ? (hasError ? "#ffb74d" : "#81c784") : "#64b5f6"}`, borderRadius: "6px", textAlign: "center" }}>
        {!allLoaded && "Loading dashboard data..."}
        {allLoaded && !hasError && "All statistics loaded successfully"}
        {allLoaded && hasError && "Some statistics failed to load"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        <StatCard title="Total Users" value={stats.users.value} icon="👤"
          loading={stats.users.loading} error={stats.users.error} onRetry={() => fetchStat("users", "users")} />
        <StatCard title="Total Posts" value={stats.posts.value} icon="📝"
          loading={stats.posts.loading} error={stats.posts.error} onRetry={() => fetchStat("posts", "posts")} />
        <StatCard title="Total Comments" value={stats.comments.value} icon="💬"
          loading={stats.comments.loading} error={stats.comments.error} onRetry={() => fetchStat("comments", "comments")} />
        <StatCard title="Total Todos" value={stats.todos.value} icon="✓"
          loading={stats.todos.loading} error={stats.todos.error} onRetry={() => fetchStat("todos", "todos")} />
        <StatCard title="Total Albums" value={stats.albums.value} icon="📀"
          loading={stats.albums.loading} error={stats.albums.error} onRetry={() => fetchStat("albums", "albums")} />
      </div>
    </div>
  );
}
```

---

## 🗓️ NGÀY 20: Data Fetching Advanced Patterns

### 📌 Các Khái Niệm Cốt Lõi

| Vấn đề | Giải pháp |
|--------|-----------|
| Race condition | `AbortController` hoặc `isCancelled` flag |
| Multiple requests, 1 fail → all fail | `Promise.allSettled()` thay vì `Promise.all()` |
| Request B cần data từ Request A | Sequential (guard clause + deps) |
| Nhiều request độc lập | `Promise.all()` chạy song song |
| Polling không cleanup | `clearInterval` trong cleanup |

---

### ⭐ Level 1 — SearchWithAbort

**Yêu cầu:** Search input, cancel request khi query đổi, handle AbortError riêng.

```jsx
import { useState, useEffect } from "react";

function SearchWithAbort() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function searchUsers() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?name_like=${query}`,
          { signal: controller.signal } // ← Truyền signal
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        if (!controller.signal.aborted) {
          setResults(data);
          setLoading(false);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Search aborted for query:", query); // Silent abort
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    searchUsers();

    return () => controller.abort(); // ← Cleanup: abort khi query đổi
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users (min 2 chars)..."
        style={{ width: "100%", padding: "12px" }}
      />
      {loading && <p>Searching...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {results.map((user) => (
        <div key={user.id} style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
          <strong>{user.name}</strong>
          <p style={{ margin: "5px 0 0", color: "#666" }}>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### ⭐⭐ Level 2 — AlbumPhotosViewer (Dependent Requests)

**Yêu cầu:** Fetch album → Fetch photos (chỉ khi có album), guard clause, abort cả 2.

```jsx
import { useState, useEffect } from "react";

function AlbumPhotosViewer() {
  const [albumId, setAlbumId] = useState(1);

  // Album state
  const [album, setAlbum] = useState(null);
  const [albumLoading, setAlbumLoading] = useState(true);
  const [albumError, setAlbumError] = useState(null);

  // Photos state
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState(null);

  // Effect 1: Fetch album
  useEffect(() => {
    const controller = new AbortController();

    async function fetchAlbum() {
      setAlbumLoading(true);
      setAlbumError(null);
      setPhotos([]);

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/albums/${albumId}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`Album not found (HTTP ${response.status})`);
        const data = await response.json();
        setAlbum(data);
      } catch (err) {
        if (err.name !== "AbortError") setAlbumError(err.message);
      } finally {
        setAlbumLoading(false);
      }
    }

    fetchAlbum();
    return () => controller.abort();
  }, [albumId]);

  // Effect 2: Fetch photos (dependent)
  useEffect(() => {
    if (!album || albumLoading) return; // ← Guard clause

    const controller = new AbortController();

    async function fetchPhotos() {
      setPhotosLoading(true);
      setPhotosError(null);

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/photos?albumId=${album.id}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Failed to fetch photos");
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        if (err.name !== "AbortError") setPhotosError(err.message);
      } finally {
        setPhotosLoading(false);
      }
    }

    fetchPhotos();
    return () => controller.abort();
  }, [album, albumLoading]); // ← Depend on album data

  return (
    <div>
      <select value={albumId} onChange={(e) => setAlbumId(Number(e.target.value))}>
        {[1,2,3,4,5].map((id) => <option key={id} value={id}>Album {id}</option>)}
      </select>
      {/* Album Details */}
      {albumLoading && <div>Loading album...</div>}
      {albumError && <div style={{ color: "red" }}>{albumError}</div>}
      {album && <div><h3>{album.title}</h3></div>}
      {/* Photos */}
      {photosLoading && <div>Loading photos...</div>}
      {photosError && <div style={{ color: "red" }}>{photosError}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ border: "1px solid #eee", borderRadius: "6px" }}>
            <img src={photo.thumbnailUrl} alt={photo.title} style={{ width: "100%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### ⭐⭐⭐ Level 3 — ProductBrowser (4 Effects + Abort All)

**Yêu cầu:** Fetch categories, fetch products (category/search), fetch details khi click, debounce, abort mọi nơi.

```jsx
import { useState, useEffect } from "react";

const API_BASE = "https://fakestoreapi.com";

function ProductBrowser() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Effect 1: Fetch categories once
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/products/categories`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setCategories(["all", ...data]))
      .catch((err) => err.name !== "AbortError" && console.error(err));
    return () => controller.abort();
  }, []);

  // Effect 2: Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Effect 3: Fetch products
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setProductsLoading(true);
      setProductsError(null);
      setProducts([]);
      try {
        let endpoint =
          selectedCategory !== "all"
            ? `${API_BASE}/products/category/${selectedCategory}`
            : `${API_BASE}/products`;
        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch products");
        let data = await res.json();
        if (debouncedQuery) {
          data = data.filter((p) =>
            p.title.toLowerCase().includes(debouncedQuery.toLowerCase())
          );
        }
        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") setProductsError(err.message);
      } finally {
        setProductsLoading(false);
      }
    }
    fetchProducts();
    return () => controller.abort();
  }, [selectedCategory, debouncedQuery]);

  // Effect 4: Fetch product details
  useEffect(() => {
    if (!selectedProduct) { setProductDetails(null); return; }
    const controller = new AbortController();
    async function fetchDetails() {
      setDetailsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products/${selectedProduct}`, { signal: controller.signal });
        const data = await res.json();
        setProductDetails(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setDetailsLoading(false);
      }
    }
    fetchDetails();
    return () => controller.abort();
  }, [selectedProduct]);

  // Category change → clear search + selected product
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setSelectedProduct(null);
  };

  return (
    <div>
      <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..." />
      {productsLoading && <div>Loading products...</div>}
      {productsError && <div style={{ color: "red" }}>{productsError}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
        {products.map((product) => (
          <div key={product.id} onClick={() => setSelectedProduct(product.id)}
            style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", cursor: "pointer" }}>
            <img src={product.image} alt={product.title}
              style={{ width: "100%", height: "140px", objectFit: "contain" }} />
            <h4 style={{ fontSize: "14px" }}>{product.title}</h4>
            <span style={{ color: "#4CAF50", fontWeight: "bold" }}>${product.price}</span>
          </div>
        ))}
      </div>
      {selectedProduct && productDetails && !detailsLoading && (
        <div style={{ position: "fixed", right: "20px", top: "20px", width: "300px",
          background: "white", border: "1px solid #ddd", borderRadius: "8px", padding: "20px" }}>
          <img src={productDetails.image} style={{ width: "100%", height: "200px", objectFit: "contain" }} />
          <h4>{productDetails.title}</h4>
          <div style={{ fontSize: "22px", color: "#4CAF50" }}>${productDetails.price}</div>
          <button onClick={() => setSelectedProduct(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
```

---

## 🏠 NGÀY 19 — Bài Tập Về Nhà

### 🏠 Bắt buộc — Bài 1: WeatherApp (Fetch on Submit)

**Yêu cầu:** Input city → fetch khi submit, display thời tiết, handle lỗi city not found.
**API:** Open-Meteo (miễn phí, không cần key) + Nominatim geocoding.

```jsx
import { useState } from "react";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      // Step 1: Geocode city → lat/lon (Nominatim)
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
      );
      if (!geoRes.ok) throw new Error("Không tìm thấy thành phố");
      const geoData = await geoRes.json();
      if (geoData.length === 0) throw new Error(`Không tìm thấy "${cityName}"`);

      const { lat, lon } = geoData[0];

      // Step 2: Fetch weather (Open-Meteo)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
      );
      if (!weatherRes.ok) throw new Error("Lỗi khi lấy dữ liệu thời tiết");
      const weatherData = await weatherRes.json();
      const current = weatherData.current;

      setWeather({
        city: geoData[0].display_name.split(",")[0],
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        time: new Date(current.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
          placeholder="Nhập tên thành phố (Hanoi, Saigon, London)"
          style={{ width: "100%", padding: "12px", fontSize: "16px", marginBottom: "12px" }} />
        <button type="submit" disabled={loading || !city.trim()}
          style={{ padding: "12px 24px", background: loading ? "#ccc" : "#2196F3",
            color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          {loading ? "Đang tải..." : "Xem thời tiết"}
        </button>
      </form>

      {error && <div style={{ color: "red", padding: "12px", background: "#ffebee", borderRadius: "6px" }}>{error}</div>}

      {weather && (
        <div style={{ padding: "24px", background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", borderRadius: "12px" }}>
          <h2>{weather.city}</h2>
          <p style={{ color: "#555" }}>Cập nhật lúc: {weather.time}</p>
          <div style={{ fontSize: "3.5rem", fontWeight: "bold" }}>{weather.temperature}°C</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
            <div><strong>Cảm giác:</strong> {weather.feelsLike}°C</div>
            <div><strong>Độ ẩm:</strong> {weather.humidity}%</div>
            <div><strong>Gió:</strong> {weather.windSpeed} km/h</div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 🏠 Bắt buộc — Bài 2: ProductCatalog (Filter by Category)

**Yêu cầu:** Fetch categories on mount, dropdown filter, refetch products khi đổi category.
**API:** `https://fakestoreapi.com`

```jsx
import { useState, useEffect } from "react";

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories once on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(["all", ...data]);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products khi selectedCategory đổi
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const url = selectedCategory === "all"
          ? "https://fakestoreapi.com/products"
          : `https://fakestoreapi.com/products/category/${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory]); // ← Refetch khi category đổi

  if (error) return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>Product Catalog</h1>
      <div style={{ marginBottom: "24px" }}>
        <label style={{ marginRight: "12px", fontWeight: "500" }}>Filter by category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={loading} style={{ padding: "8px 12px", fontSize: "16px", minWidth: "220px" }}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>Loading products...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {products.map((product) => (
            <div key={product.id} style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", background: "white" }}>
              <img src={product.image} alt={product.title}
                style={{ width: "100%", height: "220px", objectFit: "contain", padding: "16px", background: "#f9f9f9" }} />
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px" }}>{product.title}</h3>
                <p style={{ color: "#555", fontSize: "0.95rem", margin: "0 0 12px" }}>
                  {product.description.substring(0, 120)}...
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#2e7d32" }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span style={{ color: "#757575", fontSize: "0.9rem" }}>{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### 🏠 Nâng cao — Bài 3: GitHubUserSearch (Debounce + Real API)

**Yêu cầu:** Search GitHub user by username, debounce 500ms, display profile, handle 404/403/rate limit.
**API:** `https://api.github.com/users/{username}`

```jsx
import { useState, useEffect } from "react";

function GitHubUserSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch user khi debounced query đổi
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setUser(null);
      setError(null);
      return;
    }

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.github.com/users/${debouncedQuery}`);
        if (response.status === 404) throw new Error("User not found");
        if (response.status === 403) throw new Error("Rate limit exceeded. Please try again later.");
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const data = await response.json();
        setUser({
          login: data.login,
          name: data.name,
          avatar: data.avatar_url,
          bio: data.bio,
          followers: data.followers,
          repos: data.public_repos,
          location: data.location,
          profileUrl: data.html_url,
          created: new Date(data.created_at).toLocaleDateString(),
        });
      } catch (err) {
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [debouncedQuery]);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>GitHub User Search</h1>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter GitHub username (e.g. torvalds, octocat)"
        style={{ width: "100%", padding: "12px", fontSize: "16px", marginBottom: "16px" }} />

      {loading && <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
        Searching for @{debouncedQuery}...
      </div>}

      {error && <div style={{ padding: "16px", background: "#ffebee", color: "#c62828",
        borderRadius: "6px", textAlign: "center" }}>{error}</div>}

      {user && (
        <div style={{ border: "1px solid #ddd", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ background: "#0366d6", padding: "20px", textAlign: "center" }}>
            <img src={user.avatar} alt={`${user.login} avatar`}
              style={{ width: "120px", height: "120px", borderRadius: "50%", border: "4px solid white" }} />
          </div>
          <div style={{ padding: "24px" }}>
            <h2 style={{ margin: "0 0 8px" }}>
              {user.name || user.login}
              <small style={{ color: "#666", fontSize: "0.9rem", marginLeft: "12px" }}>@{user.login}</small>
            </h2>
            {user.bio && <p style={{ color: "#444", lineHeight: "1.5" }}>{user.bio}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "20px 0" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#2e7d32" }}>
                  {user.followers.toLocaleString()}
                </div>
                <div style={{ color: "#666" }}>Followers</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#1976d2" }}>{user.repos}</div>
                <div style={{ color: "#666" }}>Public Repos</div>
              </div>
            </div>
            {user.location && <p style={{ color: "#555" }}>📍 {user.location}</p>}
            <p style={{ color: "#777", fontSize: "0.9rem" }}>Joined: {user.created}</p>
            <a href={user.profileUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", padding: "12px 24px", background: "#24292e",
                color: "white", textDecoration: "none", borderRadius: "6px", marginTop: "8px" }}>
              View Profile on GitHub →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 🏠 Nâng cao — Bài 4: MultiTabDataManager (Lazy Load + Cache)

**Yêu cầu:** 3 tabs (Users/Posts/Comments), lazy load (chỉ fetch khi tab được chọn lần đầu), cache (không refetch khi quay lại), refresh riêng từng tab.

```jsx
import { useState, useEffect } from "react";

const API_BASE = "https://jsonplaceholder.typicode.com";

// Component tái sử dụng cho mỗi tab
// Lazy load: useEffect với empty deps chạy khi component mount (= khi tab được chọn lần đầu)
// Cache: component bị unmount khi chuyển tab, nhưng dữ liệu được lưu ở parent
function DataTab({ endpoint, title, cachedData, onDataLoad, renderItem }) {
  const [data, setData] = useState(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}?_limit=8`);
      if (!res.ok) throw new Error(`Failed to load ${title.toLowerCase()}`);
      const result = await res.json();
      setData(result);
      onDataLoad(result); // ← Lưu lên parent cache
      setLastFetched(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Chỉ fetch nếu chưa có cache
  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading {title}...</div>;
  if (error) return (
    <div style={{ padding: "20px", textAlign: "center", color: "#c62828" }}>
      <p>Error: {error}</p>
      <button onClick={fetchData}
        style={{ padding: "10px 20px", background: "#d32f2f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
        Retry
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>{title} ({data.length})</h2>
        <div>
          {lastFetched && <small style={{ color: "#666", marginRight: "16px" }}>
            Last updated: {lastFetched.toLocaleTimeString()}
          </small>}
          <button onClick={fetchData}
            style={{ padding: "8px 16px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Refresh
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gap: "16px" }}>
        {data.map((item) => renderItem(item))}
      </div>
    </div>
  );
}

function MultiTabDataManager() {
  const [activeTab, setActiveTab] = useState("users");
  // Cache lưu ở parent → không mất khi chuyển tab
  const [cache, setCache] = useState({ users: null, posts: null, comments: null });

  const tabs = [
    { id: "users", label: "Users" },
    { id: "posts", label: "Posts" },
    { id: "comments", label: "Comments" },
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <h1>Multi-Tab Data Manager</h1>
      <div style={{ display: "flex", marginBottom: "24px", borderBottom: "2px solid #ddd" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: "12px 24px", marginRight: "4px", background: activeTab === tab.id ? "#1976d2" : "#e0e0e0",
              color: activeTab === tab.id ? "white" : "#333", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px", background: "#f9f9f9", borderRadius: "0 8px 8px 8px" }}>
        {activeTab === "users" && (
          <DataTab endpoint="users" title="Users"
            cachedData={cache.users}
            onDataLoad={(data) => setCache((p) => ({ ...p, users: data }))}
            renderItem={(user) => (
              <div key={user.id} style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px", background: "white" }}>
                <h3 style={{ margin: "0 0 8px" }}>{user.name}</h3>
                <p style={{ margin: "0 0 4px", color: "#555" }}>{user.email}</p>
                <p style={{ margin: 0, color: "#777" }}>{user.company.name}</p>
              </div>
            )} />
        )}
        {activeTab === "posts" && (
          <DataTab endpoint="posts" title="Posts"
            cachedData={cache.posts}
            onDataLoad={(data) => setCache((p) => ({ ...p, posts: data }))}
            renderItem={(post) => (
              <div key={post.id} style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px", background: "white" }}>
                <h3 style={{ margin: "0 0 8px" }}>{post.title}</h3>
                <p style={{ margin: 0, color: "#444" }}>{post.body.substring(0, 150)}...</p>
              </div>
            )} />
        )}
        {activeTab === "comments" && (
          <DataTab endpoint="comments" title="Comments"
            cachedData={cache.comments}
            onDataLoad={(data) => setCache((p) => ({ ...p, comments: data }))}
            renderItem={(comment) => (
              <div key={comment.id} style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px", background: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <strong style={{ color: "#1976d2" }}>{comment.name}</strong>
                  <small style={{ color: "#777" }}>{comment.email}</small>
                </div>
                <p style={{ margin: 0, color: "#444" }}>{comment.body}</p>
              </div>
            )} />
        )}
      </div>
    </div>
  );
}
```

---

## 🏠 NGÀY 20 — Bài Tập Về Nhà

### 🏠 Bắt buộc — Bài 1: GitHubReposBrowser (Search Org + Abort)

**Yêu cầu:** Search organizations (debounce 400ms), chọn org → fetch repos, AbortController cho cả 2 request.
**API:** `https://api.github.com`

```jsx
import { useState, useEffect } from "react";

function GitHubReposBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [repos, setRepos] = useState([]);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [reposLoading, setReposLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search organizations (debounce 400ms + AbortController)
  useEffect(() => {
    if (searchQuery.length < 2) {
      setOrgs([]);
      setSelectedOrg(null);
      setRepos([]);
      return;
    }

    const controller = new AbortController();

    async function searchOrgs() {
      setOrgsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.github.com/search/users?q=${searchQuery}+type:org`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const data = await res.json();
        const orgItems = data.items || [];
        setOrgs(orgItems);
        if (orgItems.length === 1) setSelectedOrg(orgItems[0].login);
        else { setSelectedOrg(null); setRepos([]); }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setOrgsLoading(false);
      }
    }

    const timer = setTimeout(() => searchOrgs(), 400);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [searchQuery]);

  // Fetch repos khi chọn org (AbortController)
  useEffect(() => {
    if (!selectedOrg) { setRepos([]); return; }

    const controller = new AbortController();

    async function fetchRepos() {
      setReposLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.github.com/orgs/${selectedOrg}/repos?per_page=30&sort=updated`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Cannot load repos: ${res.status}`);
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setReposLoading(false);
      }
    }

    fetchRepos();
    return () => controller.abort();
  }, [selectedOrg]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2>GitHub Organization Repositories</h2>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.trim())}
        placeholder="Tìm organization (tối thiểu 2 ký tự)..."
        style={{ width: "100%", padding: "12px", fontSize: "16px", marginBottom: "16px" }} />

      {orgsLoading && <p>Đang tìm tổ chức...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {orgs.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            Kết quả ({orgs.length} tổ chức):
          </label>
          <select value={selectedOrg || ""} onChange={(e) => setSelectedOrg(e.target.value || null)}
            style={{ width: "100%", padding: "10px", fontSize: "15px" }}>
            <option value="">— Chọn một organization —</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.login}>{org.login}</option>
            ))}
          </select>
        </div>
      )}

      {selectedOrg && (
        <>
          <h3>Repositories của {selectedOrg}</h3>
          {reposLoading && <p>Đang tải repositories...</p>}
          {repos.length === 0 && !reposLoading && <p style={{ color: "#666" }}>Không có repository công khai nào</p>}
          {repos.length > 0 && (
            <div style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "6px" }}>
              {repos.map((repo) => (
                <div key={repo.id} style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontWeight: "bold", color: "#0366d6", textDecoration: "none" }}>
                    {repo.name}
                  </a>
                  <p style={{ margin: "6px 0 0", color: "#586069", fontSize: "14px" }}>
                    {repo.description || "Không có mô tả"}
                  </p>
                  <div style={{ marginTop: "8px", fontSize: "13px", color: "#586069" }}>
                    ⭐ {repo.stargazers_count} • 🍴 {repo.forks_count} • {repo.language || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

### 🏠 Bắt buộc — Bài 2: WeatherWithForecast (Dependent Requests)

**Yêu cầu:** Fetch current weather → tự động fetch 5-day forecast (dựa vào tọa độ), AbortController riêng cho mỗi bước, error handling độc lập.
**API:** OpenWeatherMap (cần API key miễn phí từ openweathermap.org).

```jsx
import { useState, useEffect } from "react";

// ⚠️ Thay bằng key thật từ openweathermap.org (free tier)
const API_KEY = "YOUR_API_KEY_HERE";

function WeatherWithForecast() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const [forecastError, setForecastError] = useState(null);

  // Effect 1: Fetch current weather (debounce 500ms + abort)
  useEffect(() => {
    if (!city.trim()) {
      setCurrentWeather(null);
      setForecast([]);
      return;
    }

    const controller = new AbortController();

    async function fetchCurrent() {
      setCurrentLoading(true);
      setCurrentError(null);
      setForecast([]);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(res.status === 404 ? "Không tìm thấy thành phố" : "Lỗi API thời tiết");
        const data = await res.json();
        setCurrentWeather(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setCurrentError(err.message);
          setCurrentLoading(false);
        }
      } finally {
        setCurrentLoading(false);
      }
    }

    const timer = setTimeout(() => fetchCurrent(), 500);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [city]);

  // Effect 2: Fetch forecast (dependent on currentWeather)
  useEffect(() => {
    if (!currentWeather?.coord) { setForecast([]); return; } // ← Guard clause

    const controller = new AbortController();

    async function fetchForecast() {
      setForecastLoading(true);
      setForecastError(null);
      try {
        const { lat, lon } = currentWeather.coord;
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${API_KEY}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Không thể tải dự báo");
        const data = await res.json();
        // Lấy 1 item mỗi ngày (8 item/ngày)
        const daily = [];
        for (let i = 0; i < data.list.length; i += 8) daily.push(data.list[i]);
        setForecast(daily.slice(0, 5));
      } catch (err) {
        if (err.name !== "AbortError") setForecastError(err.message);
      } finally {
        setForecastLoading(false);
      }
    }

    fetchForecast();
    return () => controller.abort();
  }, [currentWeather]); // ← Depends on currentWeather

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h2>Thời tiết & Dự báo 5 ngày</h2>
      <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
        placeholder="Nhập tên thành phố..."
        style={{ width: "100%", padding: "12px", fontSize: "16px", marginBottom: "20px" }} />

      {/* Request flow indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{ padding: "10px 20px", borderRadius: "4px", flex: 1, textAlign: "center",
          background: currentLoading ? "#2196F3" : currentError ? "#f44336" : currentWeather ? "#4CAF50" : "#ccc",
          color: "white" }}>
          {currentLoading ? "⏳ Loading City" : currentError ? "❌ Failed" : currentWeather ? "✅ City Loaded" : "⏸️ Enter city"}
        </div>
        <span>→</span>
        <div style={{ padding: "10px 20px", borderRadius: "4px", flex: 1, textAlign: "center",
          background: !currentWeather ? "#ccc" : forecastLoading ? "#2196F3" : forecastError ? "#f44336" : "#4CAF50",
          color: "white" }}>
          {!currentWeather ? "⏸️ Waiting" : forecastLoading ? "⏳ Forecast" : forecastError ? "❌ Failed" : "✅ Forecast"}
        </div>
      </div>

      {currentLoading && <p>Đang tải thời tiết hiện tại...</p>}
      {currentError && <p style={{ color: "red" }}>{currentError}</p>}

      {currentWeather && !currentLoading && (
        <div style={{ padding: "16px", background: "#e3f2fd", borderRadius: "8px", marginBottom: "24px" }}>
          <h3>{currentWeather.name}</h3>
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>{Math.round(currentWeather.main.temp)}°C</div>
          <div style={{ textTransform: "capitalize" }}>{currentWeather.weather[0].description}</div>
          <div style={{ color: "#555", marginTop: "8px" }}>
            Cảm giác: {Math.round(currentWeather.main.feels_like)}°C •
            Độ ẩm: {currentWeather.main.humidity}% •
            Gió: {currentWeather.wind.speed} m/s
          </div>
        </div>
      )}

      {forecastLoading && <p>Đang tải dự báo...</p>}
      {forecastError && <p style={{ color: "red" }}>{forecastError}</p>}

      {forecast.length > 0 && (
        <>
          <h3>Dự báo 5 ngày</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
            {forecast.map((day, i) => (
              <div key={i} style={{ padding: "12px", background: "#f5f5f5", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontWeight: "bold" }}>
                  {i === 0 ? "Hôm nay" : new Date(day.dt * 1000).toLocaleDateString("vi-VN", { weekday: "short" })}
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold", margin: "8px 0" }}>
                  {Math.round(day.main.temp)}°C
                </div>
                <div style={{ fontSize: "14px", color: "#555", textTransform: "capitalize" }}>
                  {day.weather[0].description}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

---

### 🏠 Nâng cao — Bài 3: RedditCloneFeed (Infinite Scroll + Polling + Abort)

**Yêu cầu:** Infinite scroll dùng IntersectionObserver, polling cập nhật score mỗi 10s, filter by subreddit, abort tất cả khi đổi filter.

```jsx
import { useState, useEffect, useRef } from "react";

const API_BASE = "https://jsonplaceholder.typicode.com";
const POSTS_PER_PAGE = 10;
const SUBREDDITS = [
  { id: "all", name: "All", color: "#FF4500" },
  { id: "react", name: "r/react", color: "#61DAFB" },
  { id: "javascript", name: "r/javascript", color: "#F7DF1E" },
  { id: "webdev", name: "r/webdev", color: "#4CAF50" },
];

function enhancePost(post) {
  return {
    ...post,
    subreddit: SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)],
    score: Math.floor(Math.random() * 10000) + 100,
    comments: Math.floor(Math.random() * 500) + 10,
    author: `u/user${post.userId}`,
  };
}

function RedditCloneFeed() {
  const [selectedSubreddit, setSelectedSubreddit] = useState("all");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [polling, setPolling] = useState(true);

  const observerRef = useRef(null);
  const abortRef = useRef(null);

  // Initial load & filter change
  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function loadInitial() {
      setLoading(true);
      setPosts([]);
      setPage(1);
      setHasMore(true);
      try {
        const res = await fetch(`${API_BASE}/posts?_page=1&_limit=${POSTS_PER_PAGE}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let enhanced = data.map(enhancePost);
        if (selectedSubreddit !== "all")
          enhanced = enhanced.filter((p) => p.subreddit.id === selectedSubreddit);
        setPosts(enhanced);
        setHasMore(data.length === POSTS_PER_PAGE);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
    return () => controller.abort();
  }, [selectedSubreddit]);

  // Infinite scroll: load more
  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`${API_BASE}/posts?_page=${page + 1}&_limit=${POSTS_PER_PAGE}`);
      const data = await res.json();
      if (data.length === 0) { setHasMore(false); return; }
      let enhanced = data.map(enhancePost);
      if (selectedSubreddit !== "all")
        enhanced = enhanced.filter((p) => p.subreddit.id === selectedSubreddit);
      setPosts((prev) => [...prev, ...enhanced]);
      setPage((p) => p + 1);
    } catch (err) { console.error(err); }
    finally { setLoadingMore(false); }
  }

  // IntersectionObserver for infinite scroll
  const lastPostRef = (node) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading && !loadingMore) loadMore();
    }, { threshold: 1 });
    if (node) observerRef.current.observe(node);
  };

  // Polling: update scores every 10s
  useEffect(() => {
    if (!polling || posts.length === 0) return;
    const id = setInterval(() => {
      setPosts((prev) => prev.map((p) => ({ ...p, score: p.score + Math.floor(Math.random() * 20) - 5 })));
    }, 10000);
    return () => clearInterval(id); // ← Cleanup interval
  }, [polling, posts.length]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", background: "#DAE0E6", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "16px 20px", borderRadius: "8px", marginBottom: "16px",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, color: "#FF4500" }}>Reddit Clone</h2>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
          <input type="checkbox" checked={polling} onChange={(e) => setPolling(e.target.checked)} />
          Live scores
        </label>
      </div>

      {/* Subreddit filter */}
      <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "16px", display: "flex", gap: "8px" }}>
        {SUBREDDITS.map((sub) => (
          <button key={sub.id} onClick={() => setSelectedSubreddit(sub.id)}
            style={{ padding: "8px 16px", border: "2px solid #ddd", borderRadius: "20px", cursor: "pointer",
              background: selectedSubreddit === sub.id ? sub.color : "white",
              color: selectedSubreddit === sub.id ? "white" : "#333", fontWeight: selectedSubreddit === sub.id ? "bold" : "normal" }}>
            {sub.name}
          </button>
        ))}
      </div>

      {/* Posts */}
      {posts.map((post, i) => (
        <div key={post.id} ref={i === posts.length - 1 ? lastPostRef : null}
          style={{ background: "white", borderRadius: "8px", padding: "12px", marginBottom: "12px", display: "flex", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "40px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>⬆️</button>
            <span style={{ fontWeight: "bold" }}>{post.score > 999 ? `${(post.score/1000).toFixed(1)}k` : post.score}</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>⬇️</button>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
              <span style={{ padding: "2px 8px", borderRadius: "12px", color: "white", background: post.subreddit.color, fontWeight: "bold" }}>
                {post.subreddit.name}
              </span>
              <span style={{ marginLeft: "8px" }}>{post.author}</span>
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: "17px" }}>{post.title}</h3>
            <p style={{ margin: "0 0 8px", color: "#444", fontSize: "14px" }}>{post.body.substring(0, 120)}...</p>
            <span style={{ fontSize: "12px", color: "#777" }}>💬 {post.comments} comments</span>
          </div>
        </div>
      ))}

      {loadingMore && <div style={{ textAlign: "center", padding: "20px" }}>Loading more...</div>}
      {!hasMore && posts.length > 0 && <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
        🏁 End of feed ({posts.length} posts)
      </div>}
    </div>
  );
}
```

---

### 🏠 Nâng cao — Bài 4: MultiCurrencyConverter (Promise.allSettled)

**Yêu cầu:** Parallel fetch 8 tỷ giá cùng lúc, hiển thị partial success (cái nào thành công thì show), retry từng cặp, refresh all.
**API:** `https://v6.exchangerate-api.com` (free tier, cần key).

```jsx
import { useState, useEffect } from "react";

// ⚠️ Đăng ký key miễn phí tại exchangerate-api.com
const API_KEY = "YOUR_API_KEY_HERE";
const API_BASE = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

const TARGET_CURRENCIES = ["EUR", "GBP", "JPY", "VND", "CAD", "AUD", "CHF", "CNY"];

function MultiCurrencyConverter() {
  const [baseAmount, setBaseAmount] = useState(100);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [rates, setRates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch all rates in parallel
  const fetchAllRates = async (abortSignal) => {
    // Set all to loading
    const newLoading = {};
    TARGET_CURRENCIES.forEach((c) => (newLoading[c] = true));
    setLoadingStates(newLoading);
    setErrors({});

    const promises = TARGET_CURRENCIES.map(async (target) => {
      try {
        const res = await fetch(`${API_BASE}/${baseCurrency}`, { signal: abortSignal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.result !== "success") throw new Error(data["error-type"] || "API error");
        const rate = data.conversion_rates?.[target];
        if (!rate) throw new Error(`No rate for ${target}`);
        return { target, rate, success: true };
      } catch (err) {
        if (err.name === "AbortError") return { target, aborted: true };
        return { target, error: err.message, success: false };
      }
    });

    // Promise.allSettled: không bị chặn nếu 1 request fail
    const results = await Promise.allSettled(promises);

    const newRates = {};
    const finalLoading = {};
    const finalErrors = {};

    results.forEach((result, i) => {
      const target = TARGET_CURRENCIES[i];
      finalLoading[target] = false;
      if (result.status === "fulfilled" && !result.value.aborted) {
        if (result.value.success) newRates[target] = result.value.rate;
        else finalErrors[target] = result.value.error;
      }
    });

    setRates((prev) => ({ ...prev, ...newRates }));
    setLoadingStates((prev) => ({ ...prev, ...finalLoading }));
    setErrors((prev) => ({ ...prev, ...finalErrors }));
  };

  // Retry single rate
  const retrySingle = async (target) => {
    setLoadingStates((prev) => ({ ...prev, [target]: true }));
    setErrors((prev) => ({ ...prev, [target]: null }));
    try {
      const res = await fetch(`${API_BASE}/${baseCurrency}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rate = data.conversion_rates?.[target];
      if (!rate) throw new Error("No rate");
      setRates((prev) => ({ ...prev, [target]: rate }));
      setErrors((prev) => ({ ...prev, [target]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [target]: err.message }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [target]: false }));
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchAllRates(controller.signal);
    return () => controller.abort();
  }, [baseCurrency]);

  const formatNum = (n) => n.toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 4 });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2>Multi-Currency Converter</h2>

      {/* Controls */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Số tiền</label>
          <input type="number" value={baseAmount} onChange={(e) => setBaseAmount(Number(e.target.value) || 0)}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Từ đơn vị</label>
          <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}>
            {["USD", "EUR", "GBP", "JPY", "VND"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => { const c = new AbortController(); fetchAllRates(c.signal); }}
          style={{ padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Refresh All
        </button>
      </div>

      {/* Rate Cards — show partial results as they arrive */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {TARGET_CURRENCIES.map((target) => {
          const rate = rates[target];
          const loading = loadingStates[target];
          const err = errors[target];

          return (
            <div key={target} style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px",
              background: err ? "#fff5f5" : rate ? "#f9fff9" : "#f8f9fa" }}>
              <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
                {baseCurrency} → {target}
              </div>

              {loading ? <div>Đang tải tỷ giá...</div>
                : err ? (
                  <div>
                    <div style={{ color: "red", marginBottom: "8px" }}>{err}</div>
                    <button onClick={() => retrySingle(target)}
                      style={{ padding: "4px 12px", background: "#ff9800", color: "white",
                        border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Thử lại
                    </button>
                  </div>
                ) : rate ? (
                  <>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#2e7d32" }}>
                      {formatNum(baseAmount * rate)} {target}
                    </div>
                    <div style={{ color: "#555", marginTop: "4px" }}>
                      1 {baseCurrency} = {formatNum(rate)} {target}
                    </div>
                    <button onClick={() => retrySingle(target)}
                      style={{ marginTop: "12px", padding: "6px 12px", background: "#2196F3",
                        color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Refresh {target}
                    </button>
                  </>
                ) : <div>Chưa có dữ liệu</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 🔑 BẢNG TỔNG HỢP PATTERNS

### Ngày 19 — Basic Patterns

```jsx
// ✅ Pattern chuẩn: 3 states + fetch trong useEffect
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`); // ← Không quên!
      const data = await res.json();
      setData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }
  fetchData();
}, [dependency]); // ← Reset states ở đầu effect khi có deps
```

### Ngày 20 — Advanced Patterns

```jsx
// ✅ AbortController pattern
useEffect(() => {
  const controller = new AbortController();
  
  async function fetchData() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      const data = await res.json();
      setData(data);
    } catch (err) {
      if (err.name === "AbortError") return; // ← Silent, không hiện lỗi
      setError(err.message);
    }
  }
  fetchData();
  
  return () => controller.abort(); // ← Cleanup
}, [deps]);

// ✅ Dependent requests
useEffect(() => {
  if (!firstData || firstLoading) return; // ← Guard clause
  // Fetch second request using firstData...
}, [firstData, firstLoading]);

// ✅ Parallel fetch (graceful failure)
Promise.allSettled([fetch(url1), fetch(url2), fetch(url3)])
  .then(results => results.forEach(r => {
    if (r.status === "fulfilled") { /* success */ }
    else { /* handle error individually */ }
  }));

// ✅ Cleanup polling
useEffect(() => {
  const id = setInterval(() => { /* poll */ }, 5000);
  return () => clearInterval(id); // ← Không quên!
}, [deps]);
```

---

## 🐛 Các Bug Phổ Biến Cần Nhớ

| Bug | Nguyên nhân | Fix |
|-----|-------------|-----|
| Fetch infinite loop | Fetch trong render body | Dùng `useEffect` |
| 404 không bắt được | Không check `response.ok` | `if (!res.ok) throw new Error(...)` |
| Async useEffect trực tiếp | `useEffect(async () => ...)` | Tạo async fn bên trong rồi gọi |
| setState sau unmount | Không cleanup async | `isCancelled` flag hoặc `AbortController` |
| Race condition | Nhiều request đồng thời | `AbortController` trong cleanup |
| Object trong deps → re-fetch | Object ref thay đổi mỗi render | Dùng primitive (string, number) |
| Promise.all 1 fail → all fail | `Promise.all()` | Dùng `Promise.allSettled()` |
| Polling sau unmount | Không clear interval | `clearInterval` trong cleanup |
