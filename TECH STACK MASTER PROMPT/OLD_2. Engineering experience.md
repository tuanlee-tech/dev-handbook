Mục tiêu của phần này:

> Biến **knowledge → engineering judgment**

---

# MASTER PROMPT — PHASE 2

# ENGINEERING EXPERIENCE & DECISION TRAINING

Sau khi hoàn thành **roadmap kiến thức ở Phase 1**, hãy tiếp tục xây dựng các giai đoạn sau để giúp người học:

- chuyển kiến thức thành kinh nghiệm
- hiểu cách kết hợp nhiều concept
- biết ra quyết định kỹ thuật
- có tư duy system design
- hiểu production realities

Nếu nội dung quá dài, hãy chia thành nhiều phần.

---

# STAGE 2 — ENGINEERING PATTERN LIBRARY

Hãy tạo **Pattern Library quan trọng cho stack này**.

Senior engineers không nhớ syntax — họ nhớ **patterns**.

Pattern library phải bao phủ các domain:

```
data fetching
state management
caching
authentication
API design
error handling
performance
scalability
testing
deployment
architecture
```

---

## FORMAT OUTPUT

Mỗi pattern phải theo format sau:

```
Pattern Name:

Short Description:

Problem:
Pattern này giải quyết vấn đề gì trong production.

Context:
Khi nào pattern này thường xuất hiện.

Example Scenario:
Ví dụ thực tế trong project.

Implementation Options:
Các cách implement phổ biến.

Trade-offs:
Ưu và nhược điểm của từng approach.

Edge Cases:
Các tình huống đặc biệt.

Anti-patterns:
Sai lầm phổ biến của developer.

Real World Example:
Ví dụ production thực tế nếu có.
```

---

## EXAMPLE PATTERN

```
Pattern Name:
Server State Management

Short Description:
Quản lý dữ liệu lấy từ server trong frontend application.

Problem:
Nhiều component cần dữ liệu từ API dẫn tới duplicated requests và khó quản lý cache.

Context:
Frontend application có nhiều API calls.

Example Scenario:
Dashboard hiển thị danh sách users được nhiều component truy cập.

Implementation Options:

1. fetch + useEffect
2. React Query
3. SWR
4. GraphQL client cache

Trade-offs:

fetch + useEffect
+ đơn giản
- khó quản lý caching

React Query
+ caching built-in
+ background refetch
- thêm dependency

Edge Cases:

- stale data
- optimistic update conflict

Anti-patterns:

- gọi API trực tiếp trong nhiều component
- không cache request

Real World Example:

GitHub web app sử dụng caching layer để tránh duplicate API calls.
```

---

# STAGE 3 — SCENARIO BASED DECISION TRAINING

Tạo **20–30 scenario thực tế** mà developer thường gặp khi xây dựng production system.

Mục tiêu:

đào tạo **engineering decision making**

---

## FORMAT OUTPUT

```
Scenario Title:

Context:
Mô tả bài toán thực tế.

Constraints:
Các ràng buộc kỹ thuật.

Decision Questions:
Những quyết định kỹ thuật cần đưa ra.

Possible Approaches:
Các giải pháp có thể dùng.

Analysis:
So sánh các approach.

Senior Recommendation:
Senior engineer thường chọn gì và tại sao.

Common Junior Mistakes:
Sai lầm phổ biến của developer ít kinh nghiệm.
```

---

## EXAMPLE SCENARIO

```
Scenario Title:
Design data loading for a large dashboard

Context:
Dashboard hiển thị dữ liệu analytics với hàng chục nghìn records.

Constraints:

- phải load nhanh
- mobile traffic
- nhiều filters

Decision Questions:

- pagination hay infinite scroll
- server filtering hay client filtering
- có cần caching không

Possible Approaches:

Approach 1:
Load toàn bộ data

Approach 2:
Server-side pagination

Approach 3:
Virtualized list

Analysis:

Load all data
+ đơn giản
- không scale

Pagination
+ scalable
- UX đôi khi kém

Virtualization
+ performance tốt
- implementation phức tạp

Senior Recommendation:

Pagination + server filtering + caching.

Common Junior Mistakes:

- load toàn bộ data
- filter phía client
```

---

# STAGE 4 — SYSTEM DESIGN CASE STUDIES

Tạo **10 system design case studies** cho stack này.

---

## FORMAT OUTPUT

```
System Title:

Problem Description:

Functional Requirements:

Non-Functional Requirements:

High Level Architecture:

Key Components:

Key Technical Decisions:

Scaling Strategy:

Potential Production Issues:

Alternative Architectures:

Senior Insight:
```

---

## EXAMPLE

```
System Title:
Realtime Chat System

Problem Description:
Thiết kế hệ thống chat realtime cho hàng triệu user.

Functional Requirements:

- gửi tin nhắn
- nhận tin nhắn realtime
- lưu lịch sử

Non-Functional Requirements:

- low latency
- high availability

High Level Architecture:

Client
↓
Websocket Gateway
↓
Message Service
↓
Database

Key Technical Decisions:

- websocket vs polling
- message queue hay direct DB

Scaling Strategy:

- shard messages
- horizontal scaling gateway

Potential Production Issues:

- connection limits
- message ordering
```

---

# STAGE 5 — PRODUCTION SIMULATION PROJECTS

Tạo **5–10 project mô phỏng môi trường production**.

Các project phải tăng dần độ khó từ **mid → senior level**.

---

## FORMAT OUTPUT

```
Project Title:

Project Description:

Functional Requirements:

Non-Functional Requirements:

Engineering Challenges:

Suggested Architecture:

Key Technologies:

Production Concerns:

Learning Outcomes:
```

---

## EXAMPLE

```
Project Title:
Multi-Tenant SaaS Platform

Project Description:
Xây dựng hệ thống SaaS cho nhiều tổ chức.

Functional Requirements:

- user accounts
- organization management
- billing

Non-Functional Requirements:

- high security
- scalable architecture

Engineering Challenges:

- tenant isolation
- database design
- authentication

Suggested Architecture:

Frontend
↓
API Gateway
↓
Services
↓
Database
```

---

# STAGE 6 — PRODUCTION FAILURE & DEBUGGING TRAINING

Tạo các bài học về **production failures**.

---

## FORMAT OUTPUT

```
Incident Title:

Symptoms:

Root Cause:

System Impact:

How It Was Diagnosed:

How It Was Fixed:

How To Prevent It:

Lessons Learned:
```

---

## EXAMPLE

```
Incident Title:
Cache Stampede

Symptoms:

Server CPU spike
Database overload

Root Cause:

Cache expired simultaneously for many requests.

System Impact:

API latency tăng gấp 10 lần.

How It Was Fixed:

- staggered cache expiry
- request coalescing

How To Prevent It:

- distributed locks
- cache warmup

Lessons Learned:

Không để tất cả cache expire cùng lúc.
```

---

# STAGE 7 — ENGINEERING DECISION TREES (RẤT QUAN TRỌNG)

Tạo **Decision Trees** giúp developer ra quyết định nhanh trong production.

Decision trees phải bao phủ:

```
state management
data fetching
API design
authentication
scaling strategies
performance optimization
architecture choices
```

---

## FORMAT OUTPUT

```
Decision Topic:

Starting Question:

Decision Tree:

If X → choose A
If Y → choose B

Explanation:

Trade-offs:

Example Scenario:
```

---

## EXAMPLE

```
Decision Topic:
Choosing a state management strategy

Starting Question:
Does this state come from the server?

Decision Tree:

If YES

    Is caching required?

        YES → React Query

        NO → simple fetch

If NO

    Is the state shared across many components?

        YES → global state (Redux / Zustand)

        NO → local component state

Explanation:

Server state khác với UI state nên cần tools khác nhau.

Trade-offs:

React Query
+ caching
+ background updates
- dependency

Redux
+ predictable state
- boilerplate

Example Scenario:

Dashboard với nhiều API calls → React Query
```

---

# FINAL GOAL

Sau khi hoàn thành Phase 1 + Phase 2:

Người học phải đạt được:

```
Deep knowledge
+
Pattern recognition
+
Engineering decision making
+
System design thinking
+
Production debugging ability
+
Architecture trade-off understanding
```

---

# KẾT QUẢ

Prompt của bạn giờ có cấu trúc:

```
PHASE 1
Knowledge mastery

PHASE 2
Engineering experience

Stage 2 — Pattern Library
Stage 3 — Scenario Training
Stage 4 — System Design
Stage 5 — Production Simulation
Stage 6 — Failure Analysis
Stage 7 — Decision Trees
```

---
