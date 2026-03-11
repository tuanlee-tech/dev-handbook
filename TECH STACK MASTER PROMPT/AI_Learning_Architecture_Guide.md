# AI Learning Architecture — Hướng Dẫn Sử Dụng Toàn Diện

> Hệ thống học tech stack từ zero đến senior bằng AI — có cấu trúc, có memory, có feedback loop.

---

## Tổng Quan Hệ Thống

Hầu hết người tự học lập trình đều gặp cùng một vấn đề: **biết kiến thức nhưng không biết dùng**. Xem tutorial xong cảm giác hiểu, nhưng khi gặp bài toán thực tế thì trắng tay. Lý do không phải vì học ít — mà vì thiếu ba thứ mà chỉ môi trường làm việc thực tế mới cho được: **quyết định kỹ thuật dưới áp lực**, **feedback từ người giỏi hơn**, và **vòng lặp sửa lỗi liên tục**.

AI Learning Architecture được thiết kế để mô phỏng đúng ba thứ đó.

Hệ thống gồm 5 phase nối tiếp nhau, nhưng không độc lập — chúng chia sẻ chung một "bộ nhớ" gọi là **Learning Passport**, đảm bảo mỗi phase hiểu chính xác những gì đã được học trước đó, tránh AI tự suy diễn hay bịa kiến thức không khớp.

```
Phase 0 — Diagnosis
        ↓
Phase 1 — Knowledge Base
        ↓
Phase 2 — Engineering Thinking
        ↓
Phase 3 — Company Simulator
        ↓
Phase 4 — Learning Loop
        ↑_________________↓
           (vòng lặp liên tục)
```

---

## Vai Trò Của Từng Tool

Trước khi đi vào từng phase, cần hiểu rõ mỗi tool làm gì — và quan trọng hơn, **không làm gì**.

| Tool | Vai trò | Không dùng để |
|---|---|---|
| **Claude** | Dạy, mentor, generate bài tập, phân tích, generate Passport Update | Lưu trữ memory giữa các session |
| **NotebookLM** | Tra cứu lại kiến thức Phase 1, Q&A trên tài liệu đã học | Socratic mentor, đánh giá reasoning |
| **Antigravity / Cursor** | Apply diff vào `learning-passport.md`, preview trước khi confirm | Học hoặc generate kiến thức |
| **Git** | Backup passport sau mỗi lần update | Bất cứ thứ gì khác |

---

## Learning Passport — Xương Sống Của Hệ Thống

### Tại sao cần file này

AI không có memory giữa các conversation. Mỗi session mới là tờ giấy trắng. Nếu Phase 3 không biết Phase 1 đã dạy gì, nó sẽ tự bịa — và người học sẽ bị confused vì các phase nói khác nhau về cùng một concept.

`learning-passport.md` là nguồn sự thật duy nhất. File này được **paste vào đầu mỗi session mới** để AI của phase hiện tại hiểu đúng context.

### Cách cập nhật passport

Passport **không** được cập nhật một lần ở cuối phase — vì lúc đó lượng kiến thức quá lớn, AI không nhớ hết. Thay vào đó, passport được cập nhật **sau mỗi response quan trọng**, theo workflow sau:

```
Claude trả lời xong
        ↓
Claude generate "Passport Update Block" ở cuối response
        ↓
Hiển thị diff — chỉ phần thay đổi
        ↓
Bạn review: Accept / chỉnh sửa / bỏ qua
        ↓
Copy block → paste vào Antigravity/Cursor chat:
"Apply this update to learning-passport.md"
        ↓
Agent show preview → Bạn confirm
        ↓
git commit -m "passport: [mô tả ngắn]"
```

### Format Passport Update Block

Cuối mỗi response có nội dung đáng lưu, Claude sẽ tự động thêm:

```
---
📎 PASSPORT UPDATE AVAILABLE

DIFF:
+ [section]: [nội dung mới]
~ [section]: [nội dung chỉnh sửa]
- [section]: [nội dung xóa]

Gõ "update passport" để xác nhận, hoặc cho tôi biết cần chỉnh gì.
---
```

Ký hiệu: `+` thêm mới · `~` chỉnh sửa · `-` xóa

### Template `learning-passport.md`

```markdown
# Learning Passport
Stack: [tên stack đang học]
Current Phase: [Phase 0 / 1 / 2 / 3 / 4]
Last Updated: [ngày]

---

## LEARNER PROFILE
Background: [những gì đã biết trước khi bắt đầu]
Goal: [mục tiêu dùng stack này để làm gì]
Timeline: [thời gian dự kiến]
Seniority Estimate: [Beginner / Junior / Mid / Senior]

---

## KNOWLEDGE COVERAGE (Phase 1)

### [Domain 1 — ví dụ: Core Language]
- Topics covered: [liệt kê]
- Depth level: [surface / deep / production-grade]
- Key examples used: [ví dụ AI đã dùng để giải thích]
- Established terminology: [các từ/khái niệm đã được định nghĩa rõ]
- Known gaps: [thứ đã bỏ qua hoặc chưa cover]

### [Domain 2...]

---

## PATTERNS LEARNED (Phase 2)

### [Pattern Name]
- Summary: [mô tả ngắn]
- Context learned: [dạy trong scenario nào]
- Trade-offs understood: [yes / partial / no]

### Decision Trees Established:
- [Topic]: [summary ngắn của decision tree]

---

## SIMULATION HISTORY (Phase 3)

### Sprint [N] — [tên sprint]
- Tasks completed: [liệt kê]
- Architectural decisions made:
  - [Quyết định]: [lý do]
- Technical debt accumulated: [ghi lại]
- Company context snapshot: [stack, scale, constraints của công ty giả lập]

---

## LEARNER PERFORMANCE (Phase 4)

### Skill Level Estimate
- Core Knowledge: [Beginner / Junior / Mid / Senior]
- Pattern Recognition: [...]
- Debugging Ability: [...]
- Architecture Thinking: [...]
- Performance Awareness: [...]
- Production Readiness: [...]

### Strong Areas: [liệt kê]
### Confirmed Weak Areas: [liệt kê]
### Recurring Mistakes: [pattern lỗi hay lặp lại]
### Last Recommended Focus: [Phase 4 đề xuất gì lần cuối]
```

---

## Hướng Dẫn Từng Phase

---

### Phase 0 — Diagnosis

**Mục tiêu:** Xác định đúng stack, đúng level trước khi bắt đầu học.

**Dùng tool:** Claude

**Làm gì:**
1. Mở conversation mới với Claude, paste prompt Phase 0
2. Claude hỏi về background, mục tiêu, timeline
3. Claude đề xuất stack phù hợp + điều chỉnh depth cho Phase 1
4. Tạo file `learning-passport.md` với template ở trên, điền section LEARNER PROFILE

**Output:** File `learning-passport.md` với section Learner Profile đã điền

**Lưu ý:** Đừng bỏ qua phase này. Bắt đầu sai stack hoặc sai level sẽ lãng phí toàn bộ công sức phía sau.

---

### Phase 1 — Knowledge Base

**Mục tiêu:** Xây dựng kiến thức senior-level từ đầu đến cuối stack, có chiều sâu production.

**Dùng tool:** Claude (học) + NotebookLM (tra cứu lại)

**Làm gì:**

*Mỗi session học:*
1. Mở conversation mới với Claude
2. Paste nội dung `learning-passport.md` hiện tại vào đầu, sau đó paste prompt Phase 1
3. Học một domain (ví dụ: Core Language, Framework, Testing...)
4. Sau mỗi response quan trọng, chạy Passport Update workflow
5. `git commit` sau mỗi lần update passport

*Sau khi xong Phase 1:*
6. Upload toàn bộ tài liệu đã học lên NotebookLM
7. NotebookLM từ đây là reference engine — dùng để tra cứu lại kiến thức, không phải để học mới

**Output:** Tài liệu kiến thức đầy đủ + Passport section KNOWLEDGE COVERAGE đã điền + NotebookLM đã có tài liệu

**Lưu ý quan trọng:**
- Học từng domain, không học tất cả cùng lúc
- NotebookLM dùng để **tra cứu facts**, không dùng như mentor — nó trả lời thụ động, không challenge bạn
- Nếu Claude dùng concept chưa có trong passport, nó sẽ hỏi bạn trước — đây là behavior đúng, đừng skip

---

### Phase 2 — Engineering Thinking

**Mục tiêu:** Chuyển kiến thức thành tư duy kỹ thuật — pattern recognition, scenario decision, system design.

**Dùng tool:** Claude với vai trò Socratic Mentor

**Cấu trúc gồm 6 stage theo thứ tự:**

| Stage | Nội dung | Checkpoint |
|---|---|---|
| Stage 2 | Pattern Library | Pass mini-test trước khi qua Stage 3 |
| Stage 3 | Scenario Decision Training | Pass mini-test |
| Stage 4 | System Design Case Studies | Pass mini-test |
| Stage 5 | Production Simulation Projects | Pass mini-test |
| Stage 6 | Failure Analysis | Pass mini-test |
| Stage 7 | Decision Trees | Pass mini-test |

**Làm gì:**

*Mỗi session:*
1. Paste `learning-passport.md` vào đầu conversation
2. Paste prompt Phase 2, chỉ định stage đang học
3. **Luôn trình bày thinking process trước khi đưa solution:**

```
My Analysis: [phân tích bài toán]
My Approach: [hướng tiếp cận]
Trade-offs I considered: [những gì đã cân nhắc]
My Solution: [giải pháp cụ thể]
```

4. Claude review và Socratic challenge — đừng bỏ qua phần này, đây là giá trị cốt lõi
5. Update passport sau mỗi pattern hoặc scenario quan trọng

**Không chuyển sang stage tiếp theo nếu chưa pass checkpoint của stage hiện tại.**

---

### Phase 3 — Company Simulator

**Mục tiêu:** Mô phỏng 2-3 năm kinh nghiệm làm việc thực tế trong môi trường có áp lực.

**Dùng tool:** Claude với vai trò Tech Lead/Architect

**Thứ quan trọng nhất của phase này: Company Context Document**

Vì mỗi sprint là một conversation mới, bạn cần duy trì "bộ nhớ công ty" riêng. Tạo thêm file `company-context.md`:

```markdown
# Company Context

## Company Profile
- Lĩnh vực: [...]
- Quy mô hệ thống: [...]
- Tech stack: [...]

## System Architecture (hiện tại)
[mô tả kiến trúc đang có]

## Technical Decisions Made
- [Quyết định]: [lý do] [Sprint N]

## Technical Debt
- [Debt item]: [nguyên nhân] [Sprint N]

## Team Engineering Standards
- Code review: [...]
- Testing requirements: [...]
- Performance standards: [...]
```

**Làm gì:**

*Bắt đầu Phase 3 (một lần):*
1. Paste `learning-passport.md` + prompt Phase 3
2. Claude tạo Company Environment Setup
3. Điền thông tin vào `company-context.md`

*Mỗi sprint:*
1. Paste `learning-passport.md` + `company-context.md` + prompt Phase 3
2. Claude giao task theo format Sprint
3. **Luôn viết thinking process trước khi đưa solution**
4. Nhận Tech Lead Review, phản biện, alternative approaches
5. Sau sprint: update cả `learning-passport.md` và `company-context.md`
6. `git commit` cả hai file

**Không để Claude giải bài ngay.** Nếu Claude tự giải trước khi bạn trình bày solution, đó là prompt chưa đúng — nhắc lại: *"Hãy chờ tôi đưa solution trước."*

---

### Phase 4 — Learning Loop

**Mục tiêu:** Phát hiện knowledge gaps, reasoning flaws, tối ưu hướng học tiếp theo.

**Dùng tool:** Claude với vai trò Senior Engineering Mentor + Learning Coach

**Dùng khi nào:**
- Sau mỗi sprint Phase 3
- Sau mỗi checkpoint Phase 2
- Bất cứ khi nào cảm thấy bị stuck hoặc không chắc mình đang yếu ở đâu

**Làm gì:**
1. Paste `learning-passport.md` + prompt Phase 4
2. Paste lại toàn bộ solution + thinking process của task vừa làm
3. Claude phân tích theo format Performance Analysis
4. Nhận Learning Loop Recommendation — **làm theo đúng gợi ý**, đừng bỏ qua để tiếp tục
5. Nếu Phase 4 phát hiện gap ở Phase 1 hoặc 2, **quay lại phase đó** trước khi tiếp tục Phase 3

**Phase 4 không phải phase học một lần — nó chạy song song xuyên suốt hệ thống.**

---

## Workflow Một Ngày Học Điển Hình

```
Sáng — Học kiến thức mới (Phase 1 hoặc 2)
  └─ Paste passport → học → update passport → git commit

Chiều — Thực hành (Phase 3)
  └─ Paste passport + company context → làm sprint task
  └─ Viết thinking process → nhận review → update files → git commit

Tối — Feedback loop (Phase 4)
  └─ Paste passport → phân tích performance → nhận recommendation
  └─ Update passport với skill estimate mới → git commit
```

---

## Các Lỗi Phổ Biến Cần Tránh

**Bỏ qua thinking process format.** Nếu chỉ paste solution cuối mà không có reasoning, Phase 4 sẽ không thể phát hiện reasoning flaws — chỉ thấy được knowledge gaps.

**Không update passport thường xuyên.** Nếu để đến cuối ngày mới update, AI sẽ không nhớ đủ để generate diff chính xác. Update sau mỗi block kiến thức quan trọng.

**Dùng NotebookLM như mentor.** NotebookLM trả lời thụ động — nó sẽ không challenge bạn hay phát hiện bạn đang hiểu sai. Chỉ dùng nó để tra cứu.

**Chuyển phase khi chưa pass checkpoint.** Phase 2 có 6 stage với checkpoint. Bỏ qua checkpoint là bỏ qua phần quan trọng nhất của phase đó.

**Không git commit.** Antigravity đang preview, một lần nhấn nhầm là mất. Commit sau mỗi lần update passport.

---

## Checklist Trước Khi Bắt Đầu

- [ ] Tạo file `learning-passport.md` từ template
- [ ] Tạo file `company-context.md` (để trống, điền ở Phase 3)
- [ ] Init git repo: `git init && git add . && git commit -m "init passport"`
- [ ] Cài Cursor hoặc có quyền truy cập Antigravity
- [ ] Tạo tài khoản NotebookLM (miễn phí)
- [ ] Đọc xong hướng dẫn này trước khi paste bất kỳ prompt nào

---

## Tóm Tắt Nhanh

| Phase | Làm gì | Tool chính | Output |
|---|---|---|---|
| 0 | Xác định stack + level | Claude | Passport Learner Profile |
| 1 | Học kiến thức deep | Claude + NotebookLM | Knowledge Coverage đầy đủ |
| 2 | Luyện tư duy kỹ thuật | Claude (Socratic) | Patterns + Decision Trees |
| 3 | Mô phỏng công ty | Claude (Tech Lead) | 2-3 năm kinh nghiệm giả lập |
| 4 | Feedback + gap detection | Claude (Mentor) | Skill roadmap cá nhân hóa |
