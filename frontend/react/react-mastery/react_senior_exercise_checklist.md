# ✅ REACT SENIOR PRACTICE CHECKLIST (GENERAL & OFFICIAL)

> Checklist này là **tiêu chuẩn chung** cho **MỌI CHỦ ĐỀ REACT** (State, Effect, Context, Form, Performance, Testing, Architecture, v.v.).
> Mục tiêu: **Senior mindset – Interview-ready – Production-ready – Scalable thinking**.

---

## 🧠 A. Cách làm bài (Learning Workflow)
- [ ] Người học **không code trước**, chỉ trình bày:
  - Ý tưởng
  - Hướng tiếp cận
  - Trade-offs nếu có
- [ ] AI đóng vai **Senior / Reviewer / Interviewer**:
  - Phản biện logic
  - Chỉ ra rủi ro
  - Đề xuất hướng tốt hơn
- [ ] AI **viết full code hoàn chỉnh** để copy dùng ngay
- [ ] Không lặp lại yêu cầu đã thống nhất (mặc định áp dụng checklist này)

---

## 🏗️ B. Architecture & Design Thinking (CHUNG)
- [ ] Bài toán được **phân tích trước khi code**
- [ ] Xác định rõ:
  - Source of truth
  - Data flow (one-way / two-way)
- [ ] State / logic **không trộn vai trò** (single responsibility)
- [ ] Derived data **không lưu state**
- [ ] Logic **predictable**, không hack
- [ ] Có khả năng scale / mở rộng

---

## ⚛️ C. React-Specific Practices
- [ ] Chọn hook **phù hợp với bài toán** (`useState`, `useReducer`, `useEffect`, `useContext`, `useMemo`, `useCallback`)
- [ ] Không lạm dụng hook
- [ ] Side-effect được kiểm soát rõ ràng
- [ ] Dependency array được suy nghĩ kỹ
- [ ] Không tạo render loop

---

## 🧾 D. TypeScript Standards (CHUNG)
- [ ] TypeScript `strict`
- [ ] ❌ Không dùng `any`
- [ ] Explicit type cho:
  - function return
  - handler
  - event
- [ ] Type / Interface naming rõ ràng, có domain meaning
- [ ] Không over-engineer type

---

## 🧹 E. ESLint & Code Quality
- [ ] Không unused variables / imports
- [ ] Không mutate state trực tiếp
- [ ] Không magic number
- [ ] JSX dễ đọc, không nhồi logic
- [ ] Function ngắn, dễ test
- [ ] Code format nhất quán

---

## 💬 F. Comment Standards (BẮT BUỘC)
- [ ] Comment **WHY** (tại sao chọn cách này)
- [ ] Comment **WHAT** (đoạn code làm gì)
- [ ] Comment **EDGE CASE / RISK** nếu có
- [ ] Comment **PERFORMANCE / TRADE-OFF** khi cần
- [ ] Không comment kiểu Junior (mô tả lại code)

---

## 🎨 G. Markup & Styling Convention (CHUNG)
- [ ] **Không cần viết CSS** khi luyện logic
- [ ] **BẮT BUỘC có `className` placeholder**
- [ ] `className` phải **chuẩn BEM**
- [ ] Markup semantic, accessible
- [ ] Styling không ảnh hưởng logic hoặc test

---

## 🧪 H. Testing Strategy (CHUNG)
- [ ] Có test cho **pure logic / utils**
- [ ] Có test cho **component behavior**
- [ ] Test theo **user behavior**, không test implementation detail
- [ ] Không snapshot test trừ khi cần thiết
- [ ] Test cover:
  - happy path
  - edge case
  - regression-prone logic
- [ ] Test viết bằng TypeScript, ESLint clean

---

## 🎯 I. Output Quality
- [ ] Code chạy được ngay
- [ ] Production-ready
- [ ] Copy dùng được
- [ ] Đủ chất lượng cho **portfolio / interview**

---

## 🚀 J. Level-Up Thinking (Optional)
- [ ] Có thể refactor sang kiến trúc cao hơn (hook / reducer / abstraction)
- [ ] Biết chỉ ra trade-off giữa các cách làm
- [ ] Suy nghĩ về performance khi scale
- [ ] Suy nghĩ về testability & maintainability

---

> 📌 Checklist này là **chuẩn chung áp dụng cho TẤT CẢ chủ đề React**:
> State • Effect • Form • Context • Performance • Testing • Architecture • Data Fetching • UI Logic

> Nếu không có yêu cầu khác, **luôn mặc định áp dụng checklist này**.

