# AI LEARNING ARCHITECTURE
### Hệ thống học tech stack từ zero đến senior — có cấu trúc, có memory, có feedback loop

---

# MỤC LỤC

- [Tại Sao Hệ Thống Này Tồn Tại](#tại-sao)
- [Bức Tranh Tổng Thể](#tổng-thể)
- [Tooling & Vai Trò](#tooling)
- [Learning Passport — Xương Sống](#passport)
- [Company Context — Bộ Nhớ Công Ty](#company-context)
- [Workflow Vận Hành Hàng Ngày](#workflow)
- [Checklist Trước Khi Bắt Đầu](#checklist)
- [Các Lỗi Phổ Biến Cần Tránh](#lỗi)
- [PHASE 0 — Diagnosis](#phase-0)
- [PHASE 1 — Deep Knowledge Base](#phase-1)
- [PHASE 2 — Engineering Thinking](#phase-2)
- [PHASE 3 — Company Simulator](#phase-3)
- [PHASE 4 — Learning Loop](#phase-4)

---

<a name="tại-sao"></a>
# TẠI SAO HỆ THỐNG NÀY TỒN TẠI

Cách học lập trình truyền thống có một lỗ hổng chết người: bạn xem tutorial, làm theo từng bước, cảm giác hiểu — rồi khi gặp bài toán thực tế, bạn trắng tay. Không phải vì bạn lười, mà vì **biết kiến thức và biết dùng kiến thức là hai thứ hoàn toàn khác nhau**.

Một senior engineer không giỏi hơn junior vì họ nhớ nhiều syntax hơn. Họ giỏi hơn vì họ đã trải qua hàng trăm lần ra quyết định sai, debug production lúc 2 giờ sáng, và defend architecture của mình trước một tech lead khó tính. Đó là thứ không thể học từ sách hay khóa học.

AI Learning Architecture giải quyết đúng vấn đề đó bằng cách mô phỏng toàn bộ hành trình — từ knowledge đến judgment — trong một vòng lặp có kiểm soát. Kết quả: lần đầu tiên trong lịch sử tự học, **bạn không cần công ty để có kinh nghiệm, không cần senior để có mentor, và không cần fail ngoài production để học từ thất bại**.

---

<a name="tổng-thể"></a>
# BỨC TRANH TỔNG THỂ

```
Phase 0 — Diagnosis
  └─ Xác định đúng stack, đúng level trước khi bắt đầu
        ↓
Phase 1 — Deep Knowledge Base
  └─ Xây nền kiến thức senior-level, production-grade
        ↓
Phase 2 — Engineering Thinking
  └─ Chuyển kiến thức → tư duy kỹ thuật
  └─ Pattern Library → Scenario Training → System Design
  └─ Failure Analysis → Decision Trees
        ↓
Phase 3 — Company Simulator
  └─ Mô phỏng 2–3 năm kinh nghiệm làm việc thực tế
  └─ Sprint → Task → Review → Incident → Retrospective
        ↓
Phase 4 — Learning Loop  ←──────────────────┐
  └─ Phân tích performance, phát hiện gaps   │
  └─ Routing: tiếp tục / quay lại / ôn thêm ┘
```

**Phase 4 không phải phase cuối — nó chạy song song từ Phase 2 trở đi.**
Sau mỗi checkpoint Phase 2 và mỗi sprint Phase 3, chạy Phase 4 trước khi tiếp tục.

---

<a name="tooling"></a>
# TOOLING & VAI TRÒ

| Tool | Vai trò | Không dùng để |
|---|---|---|
| **Claude** | Dạy, mentor, tạo bài tập, phân tích, generate Passport Update | Lưu memory giữa các session |
| **NotebookLM** | Tra cứu lại kiến thức Phase 1, Q&A trên tài liệu đã học | Socratic mentor, đánh giá reasoning |
| **Antigravity / Cursor** | Apply diff vào file passport, preview trước khi confirm | Học hoặc generate kiến thức |
| **Git** | Backup passport + company context sau mỗi lần update | Bất cứ thứ gì khác |

**Vai trò Claude qua từng phase:**

| Phase | Claude đóng vai |
|---|---|
| Phase 0 | Learning Architect |
| Phase 1 | Senior Engineer + Curriculum Designer |
| Phase 2 | Socratic Mentor |
| Phase 3 | Senior Tech Lead / Engineering Manager |
| Phase 4 | Senior Engineering Mentor + Learning Coach |

---

<a name="passport"></a>
# LEARNING PASSPORT — XƯƠNG SỐNG CỦA HỆ THỐNG

### Tại sao cần file này

AI không có memory giữa các conversation. Mỗi session mới là tờ giấy trắng. Nếu Phase 3 không biết Phase 1 đã dạy gì, nó sẽ tự bịa — và bạn sẽ bị confused vì các phase nói khác nhau về cùng một concept.

`learning-passport.md` là **nguồn sự thật duy nhất**. File này được paste vào đầu mỗi session mới.

### Cách cập nhật — Incremental, không phải cuối phase

Passport **không** cập nhật một lần ở cuối phase — lúc đó lượng kiến thức quá lớn, AI không nhớ hết. Thay vào đó, cập nhật **sau mỗi response quan trọng**:

```
Claude trả lời xong
        ↓
Claude tự generate "Passport Update Block" ở cuối response
        ↓
Hiển thị diff — chỉ phần thay đổi
        ↓
Bạn review: Accept / chỉnh / bỏ qua
        ↓
Copy block → paste vào Antigravity/Cursor:
"Apply this update to learning-passport.md"
        ↓
Agent show preview → Bạn confirm
        ↓
git commit -m "passport: [mô tả ngắn]"
```

### Format Passport Update Block

Cuối mỗi response có nội dung đáng lưu, Claude sẽ tự động thêm block này — **bắt buộc, không phải tùy chọn**:

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
Hours per day: [số giờ học mỗi ngày]
Seniority Estimate: [Beginner / Junior / Mid / Senior]

## DEPTH CALIBRATION
Skip: [những thứ không cần học vì đã biết]
Start from: [bắt đầu từ đâu trong Phase 1]
Fast-track: [những thứ học nhanh vì đã có background liên quan]

## PHASE 1 PLAN
Domain order: [thứ tự các domain nên học]
First domain: [domain đầu tiên + lý do]

---

## KNOWLEDGE COVERAGE (Phase 1)

### [Domain 1 — ví dụ: Core Language]
- Topics covered: [liệt kê]
- Depth level: [surface / deep / production-grade]
- Key examples used: [ví dụ AI đã dùng]
- Established terminology: [khái niệm đã được định nghĩa]
- Known gaps: [thứ chưa cover]

---

## PATTERNS LEARNED (Phase 2)

### [Pattern Name]
- Summary: [mô tả ngắn]
- Context learned: [dạy trong scenario nào]
- Trade-offs understood: [yes / partial / no]

### Decision Trees Established:
- [Topic]: [summary ngắn]

---

## SIMULATION HISTORY (Phase 3)

### Sprint [N] — [tên sprint]
- Tasks completed: [liệt kê]
- Architectural decisions:
  - [Quyết định]: [lý do]
- Technical debt: [ghi lại]

---

## LEARNER PERFORMANCE (Phase 4)

### Skill Level Estimate
- Core Knowledge:        [Beginner / Junior / Mid / Senior]
- Pattern Recognition:   [...]
- Debugging Ability:     [...]
- Architecture Thinking: [...]
- Performance Awareness: [...]
- Production Readiness:  [...]
- Decision Making:       [...]

### Strong Areas: [liệt kê]
### Confirmed Weak Areas: [liệt kê]
### Recurring Mistakes: [pattern lỗi hay lặp lại]
### Last Recommended Focus: [Phase 4 đề xuất gì lần cuối]
```

---

<a name="company-context"></a>
# COMPANY CONTEXT — BỘ NHỚ CÔNG TY

Phase 3 chạy theo sprint — mỗi sprint là một conversation mới. `company-context.md` giữ memory của công ty giả lập xuyên suốt tất cả các sprint.

**Paste cả hai file vào đầu mỗi session Phase 3. Thiếu một trong hai, AI sẽ mất context.**

### Template `company-context.md`

```markdown
# Company Context
Last Updated: [ngày]
Current Sprint: [N]

---

## Company Profile
Name: [tên công ty hư cấu]
Product: [mô tả sản phẩm — relevant với stack trong passport]
System Scale: [users, requests/day, data volume]
Team Size: [số engineer]

## Tech Stack
[đúng với stack trong passport]

## System Architecture (current state)
[mô tả kiến trúc — cập nhật sau mỗi sprint có thay đổi]

## Engineering Standards
Code review: [policy]
Testing: [requirements]
Performance: [standards]
Deployment: [process]

## Technical Decisions Made
[Sprint N] [Quyết định]: [lý do]

## Technical Debt
[Item]: [nguyên nhân] [Sprint N]

## Current Pain Points
[liệt kê — cập nhật khi resolve hoặc khi mới phát sinh]

## Roadmap
Sprint [N+1]: [preview]
Sprint [N+2]: [preview]
```

---

<a name="workflow"></a>
# WORKFLOW VẬN HÀNH HÀNG NGÀY

```
SÁNG — Học kiến thức (Phase 1 hoặc 2)
  1. Mở conversation mới
  2. Paste learning-passport.md
  3. Paste prompt Phase 1 hoặc 2
  4. Học một domain / stage
  5. Update passport → git commit

CHIỀU — Thực hành (Phase 3)
  1. Mở conversation mới
  2. Paste learning-passport.md + company-context.md
  3. Paste prompt Phase 3
  4. Làm sprint task — LUÔN viết thinking process trước
  5. Nhận review, phản biện
  6. Update cả hai file → git commit

TỐI — Feedback loop (Phase 4)
  1. Mở conversation mới
  2. Paste learning-passport.md
  3. Paste prompt Phase 4
  4. Paste toàn bộ thinking process + solution của ngày
  5. Nhận Performance Analysis + Routing Decision
  6. Update passport → git commit
  7. Làm theo Routing Decision — không bỏ qua
```

### Vòng lặp học hoàn chỉnh

```
Học kiến thức (Phase 1)
        ↓
Luyện tư duy (Phase 2)   ←─────────────────────┐
        ↓                                        │
Pass checkpoint                                  │
        ↓                                        │
Làm sprint (Phase 3)                             │
        ↓                                        │
Chạy Phase 4                                     │
        ↓                                        │
Routing Decision:                                │
  ├── Gap nhỏ → sprint tiếp theo                 │
  ├── Cần consolidate → Phase 2 stage cụ thể     │
  └── Gap lớn → Phase 1 domain cụ thể ───────────┘
```

---

<a name="checklist"></a>
# CHECKLIST TRƯỚC KHI BẮT ĐẦU

```
Setup (một lần duy nhất)
─────────────────────────────────────────
[ ] Tạo file learning-passport.md từ template
[ ] Tạo file company-context.md (để trống)
[ ] git init && git add . && git commit -m "init: learning passport"
[ ] Cài Cursor hoặc có quyền truy cập Antigravity
[ ] Tạo tài khoản NotebookLM (miễn phí)
[ ] Đọc xong file này trước khi paste bất kỳ prompt nào

Mỗi session học
─────────────────────────────────────────
[ ] Paste passport vào đầu conversation (bắt buộc)
[ ] Paste company-context nếu là Phase 3 (bắt buộc)
[ ] Update passport sau mỗi response quan trọng
[ ] git commit sau mỗi lần update

Mỗi sprint Phase 3
─────────────────────────────────────────
[ ] Chạy Phase 4 sau khi kết thúc sprint
[ ] Làm theo Routing Decision trước khi bắt sprint mới
[ ] Update cả passport và company-context
```

---

<a name="lỗi"></a>
# CÁC LỖI PHỔ BIẾN CẦN TRÁNH

**Bỏ qua Thinking Process Format.**
Nếu chỉ paste solution cuối, Phase 4 chỉ thấy được knowledge gaps. Reasoning flaws và blind spots ẩn trong cách bạn suy nghĩ — không phải trong kết quả. Đây là lỗi làm mất 80% giá trị của hệ thống.

**Không update passport thường xuyên.**
Để đến cuối ngày mới update, AI sẽ không nhớ đủ để generate diff chính xác. Update ngay sau mỗi block kiến thức quan trọng — dù chỉ 2–3 dòng.

**Bỏ qua Routing Decision của Phase 4.**
Tiếp tục sprint tiếp theo khi có gap lớn chưa fix chỉ tạo ra false confidence — bạn làm được task nhưng vì lý do sai, và sẽ fail khi gặp edge case trong production.

**Dùng NotebookLM như mentor.**
NotebookLM trả lời thụ động, không challenge bạn, không phát hiện bạn đang hiểu sai. Chỉ dùng để tra cứu facts. Mọi câu hỏi kiểu "tôi nên làm gì" đều phải hỏi Claude.

**Chuyển phase khi chưa pass checkpoint.**
Phase 2 có 6 stage với checkpoint bắt buộc. Bỏ qua checkpoint là bỏ qua phần quan trọng nhất của phase đó.

**Không git commit.**
Antigravity/Cursor vẫn đang preview — một lần nhấn nhầm là mất toàn bộ passport. Commit sau mỗi lần update, không phải cuối ngày.

**Skill level tăng đều đặn mọi session.**
Đây là dấu hiệu AI đang lạc quan thay vì honest. Progress thật không bao giờ linear — nếu không có session nào có kết quả trung bình hoặc cần ôn lại, hệ thống đang không được dùng đúng cách.

---
---
---

<a name="phase-0"></a>
# PHASE 0 — DIAGNOSIS

**Mục tiêu:** Xác định đúng stack, đúng level trước khi bắt đầu học.
**Dùng tool:** Claude
**Chạy:** Một lần duy nhất, trước Phase 1.

> **Cách dùng:**
> 1. Mở conversation mới với Claude
> 2. Copy toàn bộ prompt bên dưới, paste vào Claude
> 3. Không cần điền gì trước — Claude sẽ hỏi từng bước

---

## PROMPT PHASE 0 (COPY NGUYÊN)

---

> Tôi sắp bắt đầu một hệ thống học tech stack có cấu trúc gồm 4 phase:
>
> - Phase 1 — Knowledge Base (học kiến thức senior-level)
> - Phase 2 — Engineering Thinking (luyện tư duy kỹ thuật)
> - Phase 3 — Company Simulator (mô phỏng kinh nghiệm làm việc)
> - Phase 4 — Learning Loop (feedback và gap detection)
>
> Trước khi bắt đầu, tôi cần bạn đóng vai **Learning Architect** để giúp tôi chuẩn bị đúng hướng.
>
> ---
>
> # NHIỆM VỤ CỦA BẠN
>
> Thực hiện một buổi **Diagnosis Interview** gồm 3 bước.
>
> **Bước 1 — Thu thập thông tin**
>
> Hỏi tôi lần lượt theo từng nhóm (hỏi từng nhóm, không hỏi tất cả cùng lúc):
>
> Nhóm 1 — Background:
> - Tôi đã biết những ngôn ngữ/framework/stack nào? Ở level nào?
> - Tôi đã có kinh nghiệm làm việc thực tế chưa? Nếu có thì làm gì?
> - Tôi học lập trình được bao lâu rồi?
>
> Nhóm 2 — Mục tiêu:
> - Tôi muốn học stack gì, hoặc đang cân nhắc những stack nào?
> - Tôi muốn dùng stack đó để làm gì? (web app, mobile, backend API, data, CLI, khác)
> - Mục tiêu cuối cùng là gì? (đổi việc, freelance, side project, thăng chức, khác)
>
> Nhóm 3 — Constraints:
> - Tôi có bao nhiêu thời gian mỗi ngày để học?
> - Tôi muốn học full-time hay part-time?
> - Có deadline nào tôi cần đạt không? (phỏng vấn, dự án, khác)
>
> ---
>
> **Bước 2 — Phân tích và đề xuất**
>
> Sau khi có đủ thông tin, output một **Diagnosis Report**:
>
> ```
> DIAGNOSIS REPORT
>
> Learner Profile:
> [Tóm tắt background và mục tiêu theo cách bạn hiểu — để tôi confirm]
>
> Stack Recommendation:
> [Stack cụ thể đề xuất, kèm lý do]
>
> Nếu tôi đã có stack trong đầu: đánh giá xem phù hợp không, nếu không thì tại sao.
> Nếu tôi chưa biết học gì: đề xuất 2–3 options với trade-offs, rồi hỏi tôi chọn gì.
>
> Depth Calibration:
> [Phase 1 nên bắt đầu ở đâu và skip gì — dựa trên background]
>
> Learning Path Estimate:
> [Timeline thực tế cho từng phase dựa trên thời gian tôi có]
>
> Phase 1: X tuần
> Phase 2: X tuần
> Phase 3: X tuần (ongoing)
> Phase 4: Song song với Phase 2, 3
>
> Red Flags:
> [Nếu tôi có kỳ vọng không thực tế hoặc thiếu prerequisite quan trọng, nói thẳng]
>
> First Week Plan:
> [Tuần đầu tiên nên làm gì cụ thể — domain nào, bao nhiêu tiếng mỗi ngày]
> ```
>
> ---
>
> **Bước 3 — Khởi tạo Learning Passport**
>
> Sau khi tôi confirm Diagnosis Report, generate nội dung để tôi tạo `learning-passport.md`:
>
> ```markdown
> # Learning Passport
> Stack: [tên stack]
> Current Phase: Phase 0 — Completed
> Last Updated: [ngày hôm nay]
>
> ## LEARNER PROFILE
> Background: [tóm tắt những gì đã biết]
> Goal: [mục tiêu cụ thể]
> Timeline: [thời gian dự kiến]
> Hours per day: [số giờ học mỗi ngày]
> Seniority Estimate: [Beginner / Junior / Mid / Senior]
>
> ## DEPTH CALIBRATION
> Skip: [những thứ không cần học]
> Start from: [bắt đầu từ đâu trong Phase 1]
> Fast-track: [những thứ học nhanh vì đã có background liên quan]
>
> ## PHASE 1 PLAN
> Domain order: [thứ tự các domain nên học]
> First domain: [domain đầu tiên + lý do]
>
> ## KNOWLEDGE COVERAGE
> [Để trống — sẽ điền trong Phase 1]
>
> ## PATTERNS LEARNED
> [Để trống — sẽ điền trong Phase 2]
>
> ## SIMULATION HISTORY
> [Để trống — sẽ điền trong Phase 3]
>
> ## LEARNER PERFORMANCE
> [Để trống — sẽ điền trong Phase 4]
> ```
>
> ---
>
> # NGUYÊN TẮC KHI HỎI
>
> - Hỏi từng nhóm một, không dump tất cả câu hỏi vào một lần
> - Nếu tôi trả lời mơ hồ, hỏi thêm để làm rõ
> - Không đưa ra recommendation trước khi có đủ thông tin
> - Nói thẳng nếu tôi có kỳ vọng không thực tế
>
> Bắt đầu bằng **Nhóm câu hỏi 1 — Background**.

---

## SAU KHI CHẠY PHASE 0

1. Tạo file `learning-passport.md`, paste nội dung Claude generate vào
2. Tạo file `company-context.md` để trống
3. Chạy: `git init && git add . && git commit -m "init: phase 0 complete"`
4. Sang Phase 1

---
---
---

<a name="phase-1"></a>
# PHASE 1 — DEEP KNOWLEDGE BASE

**Mục tiêu:** Xây kiến thức senior-level, production-grade cho toàn bộ stack.
**Dùng tool:** Claude (học) + NotebookLM (tra cứu sau khi xong)
**Mỗi session:** Học một domain — không học nhiều domain cùng lúc.

> **Cách dùng:**
> 1. Mở conversation mới với Claude
> 2. Paste `learning-passport.md` vào **trước**
> 3. Copy toàn bộ prompt bên dưới, paste tiếp theo
> 4. Chỉ định domain muốn học ở dòng cuối cùng

---

## PROMPT PHASE 1 (COPY NGUYÊN)

---

> [SYSTEM CONTEXT — ĐỌC TRƯỚC KHI BẮT ĐẦU]
>
> Phía trên là toàn bộ Learning Passport của tôi.
>
> Trước khi bắt đầu, bạn phải:
> 1. Đọc kỹ **LEARNER PROFILE** để hiểu background của tôi
> 2. Đọc kỹ **DEPTH CALIBRATION** để biết skip gì và bắt đầu từ đâu
> 3. Đọc kỹ **KNOWLEDGE COVERAGE** để biết những gì đã học — không dạy lại
>
> Quy tắc bắt buộc:
> - Nếu bạn định dùng concept, pattern, hoặc terminology chưa có trong passport,
>   hãy dừng và hỏi: "Bạn đã biết [X] chưa? Nếu chưa tôi cần giải thích ngắn trước."
> - Không tự suy diễn kiến thức ngoài những gì đã ghi trong passport
> - Không dạy lại những gì đã có trong KNOWLEDGE COVERAGE
>
> [END SYSTEM CONTEXT]
>
> ---
>
> Tôi đang học **[TÊN STACK — lấy từ passport]** và muốn đạt level senior thực chiến.
>
> Hãy đóng vai **Senior Engineer + Curriculum Designer** để dạy tôi domain tiếp theo.
>
> ---
>
> # YÊU CẦU VỀ NỘI DUNG
>
> **1. Không bỏ sót bất kỳ kiến thức nào**
>
> Với mỗi concept, giải thích cả hai góc độ:
> - Lý thuyết học thuật: cơ chế hoạt động bên trong, tại sao được thiết kế như vậy
> - Thực chiến production: dùng như thế nào trong project thực, khác gì tutorial
>
> **2. Bao gồm toàn bộ hệ sinh thái**
>
> Với mỗi domain, bao phủ:
> - Thư viện nổi bật và được dùng nhiều nhất trong industry hiện tại
> - Tooling: build tools, package managers, linters, formatters
> - Testing: unit, integration, e2e — tools, patterns, best practices
> - Security: lỗ hổng phổ biến và cách phòng chống
> - Performance optimization: lý thuyết lẫn kỹ thuật thực tế
> - Observability: logging, monitoring, error tracking, tracing
> - DevOps liên quan: containerization, CI/CD patterns
>
> **3. Production-grade knowledge**
>
> Với mỗi concept, chỉ rõ:
> - Cái bẫy, anti-pattern, edge case hay gặp trong production
> - Khi nào nên dùng, khi nào không nên dùng
> - Sự khác biệt giữa làm đúng và làm chuẩn ở production
> - Những gì documentation không nói — gotchas, undocumented behaviors
>
> **4. So sánh và lý do chọn**
>
> Với những chỗ có nhiều options:
> - Giải thích trade-offs cụ thể
> - Khuyến nghị theo từng use case
> - Tránh nói "cả hai đều tốt" — hãy có quan điểm rõ ràng
>
> **5. Cập nhật mới nhất**
>
> Đảm bảo thông tin phản ánh đúng state of the art hiện tại.
> Nếu một pattern đã deprecated, nói rõ và giải thích tại sao.
>
> ---
>
> # YÊU CẦU VỀ CẤU TRÚC
>
> **6. Phân chia giai đoạn học rõ ràng trong mỗi domain:**
>
> Giai đoạn 1 — Foundation:
> - Những gì phải học trước, milestone cụ thể để biết đã qua giai đoạn này
>
> Giai đoạn 2 — Professional:
> - Những gì biến bạn từ junior thành mid-level, build được production app
>
> Giai đoạn 3 — Senior:
> - Những gì chỉ senior mới cần biết — architecture, system thinking, performance tuning
>
> **7. Nếu nội dung quá dài:**
> Chia theo sub-domain và hỏi tôi có muốn tiếp tục không trước khi sang phần tiếp.
>
> **8. Độ chi tiết của mỗi mục:**
> - Không chỉ liệt kê tên — giải thích tại sao quan trọng, dùng khi nào
> - Với concept phức tạp, cho ví dụ hoặc so sánh ngắn
> - Với thư viện: tên + vai trò + lý do chọn so với alternatives
>
> ---
>
> # YÊU CẦU VỀ TÍNH THỰC CHIẾN
>
> **9. Production patterns**
> Các pattern thực tế senior dùng hàng ngày, không chỉ tutorial-level.
>
> **10. Interview & whiteboard knowledge**
> Format:
> - Câu hỏi phổ biến
> - Điều interviewer thực sự muốn nghe (không phải câu trả lời textbook)
> - Red flags trong câu trả lời mà nhiều người mắc phải
>
> **11. Những thứ documentation không nói**
> - Gotchas và undocumented behaviors
> - Thứ bạn chỉ biết sau khi đã bị burn một lần trong production
>
> **12. Bức tranh tổng thể**
> Sau khi học xong domain này, tôi phải hiểu:
> - Domain này fit vào đâu trong stack tổng thể
> - Khi nào cần hiểu sâu, khi nào chỉ cần biết đủ dùng
> - Nó liên quan như thế nào đến các domain sẽ học sau
>
> ---
>
> # SOCRATIC TEACHING MODE
>
> Thỉnh thoảng dừng lại và hỏi tôi một câu trước khi tiếp tục. Ví dụ:
> "Trước khi tôi giải thích phần tiếp theo — theo bạn, tại sao [X] lại được
> thiết kế như vậy thay vì [Y]?"
>
> Nếu tôi trả lời sai hoặc thiếu, chỉ ra đúng chỗ tôi hiểu nhầm thay vì chỉ nói đúng/sai.
>
> ---
>
> # PASSPORT UPDATE — BẮT BUỘC
>
> Cuối mỗi response, thêm block sau — không được bỏ:
>
> ```
> ---
> 📎 PASSPORT UPDATE AVAILABLE
>
> DIFF:
> + ## [Domain Name] — [Sub-section nếu có]
> +   Topics covered: [liệt kê cụ thể]
> +   Depth: [surface / deep / production-grade]
> +   Key examples used: [ví dụ đã dùng]
> +   Terminology established: [khái niệm đã định nghĩa]
> +   Gotchas highlighted: [bẫy/anti-pattern đã đề cập]
> ~   Known gaps: [thứ chưa cover nếu có]
>
> Gõ "update passport" để xác nhận, hoặc cho tôi biết cần chỉnh gì.
> ---
> ```
>
> ---
>
> # BẮT ĐẦU
>
> Dựa trên Learning Passport của tôi, bắt đầu với domain:
>
> **[Để trống = Claude tự chọn theo thứ tự trong passport. Hoặc điền tên domain cụ thể.]**
>
> Đừng tóm tắt — đi sâu ngay từ đầu như một senior engineer đang mentoring.

---

## SAU KHI XONG PHASE 1

- Tổ chức tài liệu: `knowledge-base/01-domain.md`, `02-domain.md`...
- Upload toàn bộ folder lên NotebookLM
- Chạy checkpoint: *"Tôi đã cover đủ kiến thức để bắt đầu Phase 2 chưa? Còn gap critical nào không?"*
- Sang Phase 2 chỉ khi không còn critical gap

---
---
---

<a name="phase-2"></a>
# PHASE 2 — ENGINEERING THINKING

**Mục tiêu:** Chuyển kiến thức → tư duy kỹ thuật: pattern recognition, scenario decision, system design.
**Dùng tool:** Claude với vai trò Socratic Mentor
**Cấu trúc:** 6 stages, mỗi stage có checkpoint bắt buộc trước khi tiếp tục.

> **Cách dùng:**
> 1. Mở conversation mới với Claude
> 2. Paste `learning-passport.md` vào trước
> 3. Copy toàn bộ prompt bên dưới, paste tiếp theo
> 4. Chỉ định stage muốn học ở dòng cuối

---

## 6 STAGES CỦA PHASE 2

| Stage | Nội dung | Thời gian | Checkpoint |
|---|---|---|---|
| Stage 2 | Pattern Library | 1–2 tuần | ✓ bắt buộc |
| Stage 3 | Scenario Decision Training | 1–2 tuần | ✓ bắt buộc |
| Stage 4 | System Design Case Studies | 1 tuần | ✓ bắt buộc |
| Stage 5 | Production Simulation Projects | 2–3 tuần | ✓ bắt buộc |
| Stage 6 | Failure Analysis | 3–5 ngày | ✓ bắt buộc |
| Stage 7 | Decision Trees | 3–5 ngày | ✓ bắt buộc |

---

## PROMPT PHASE 2 (COPY NGUYÊN)

---

> [SYSTEM CONTEXT — ĐỌC TRƯỚC KHI BẮT ĐẦU]
>
> Phía trên là toàn bộ Learning Passport của tôi.
>
> Trước khi bắt đầu, bạn phải:
> 1. Đọc kỹ **KNOWLEDGE COVERAGE** — chỉ dùng concept đã có ở đây
> 2. Đọc kỹ **PATTERNS LEARNED** — không dạy lại pattern đã có
> 3. Đọc kỹ **LEARNER PERFORMANCE** — điều chỉnh độ khó phù hợp
>
> Quy tắc bắt buộc:
> - Không dùng concept ngoài passport
> - Không đưa ra solution trước khi tôi trình bày thinking process
> - Luôn chờ tôi output đầy đủ Thinking Process Format trước khi review
>
> [END SYSTEM CONTEXT]
>
> ---
>
> Hãy đóng vai **Socratic Mentor / Senior Engineer** để dẫn dắt tôi qua Phase 2.
>
> ---
>
> # THINKING PROCESS FORMAT — BẮT BUỘC
>
> Với mỗi bài tập hoặc scenario, tôi PHẢI trả lời theo format sau trước khi bạn review:
>
> ```
> MY THINKING PROCESS
>
> Problem Analysis:
> [Tôi hiểu bài toán này đang hỏi gì]
>
> Constraints I Identified:
> [Các ràng buộc kỹ thuật tôi nhận ra]
>
> Approaches I Considered:
> [2–3 hướng giải quyết tôi đã nghĩ đến]
>
> Trade-offs I Weighed:
> [Tôi đã cân nhắc gì giữa các approach]
>
> My Decision:
> [Tôi chọn approach nào và tại sao]
>
> My Solution:
> [Giải pháp cụ thể]
>
> What I'm Unsure About:
> [Điểm nào tôi chưa chắc]
> ```
>
> Bạn không được review cho đến khi tôi output đầy đủ format này.
> Nếu tôi quên: "Hãy trình bày thinking process trước."
>
> ---
>
> # STAGE 2 — PATTERN LIBRARY
>
> Xây dựng Pattern Library cho stack của tôi, bao phủ theo thứ tự:
> data fetching · state management · caching · authentication · API design ·
> error handling · performance · scalability · testing · deployment · architecture
>
> ## Format mỗi pattern:
>
> ```
> Pattern Name:
> Short Description:
>
> Problem:
> Pattern này giải quyết vấn đề gì trong production.
>
> Context:
> Khi nào pattern này thường xuất hiện.
>
> Example Scenario:
> Ví dụ thực tế — phải dùng stack trong passport.
>
> Implementation Options:
> Các cách implement phổ biến — dùng thư viện đã có trong KNOWLEDGE COVERAGE.
>
> Trade-offs:
> Ưu và nhược điểm của từng approach.
>
> Edge Cases:
> Các tình huống đặc biệt hay bị bỏ sót.
>
> Anti-patterns:
> Sai lầm phổ biến, đặc biệt những gì junior thường làm.
>
> Real World Example:
> Ví dụ production thực tế nếu có.
>
> Connection to Knowledge Base:
> Pattern này liên quan đến concept nào đã học trong Phase 1.
> ```
>
> Sau mỗi pattern: đưa mini-scenario, chờ tôi apply, rồi mới chuyển pattern tiếp.
>
> ---
>
> # STAGE 3 — SCENARIO DECISION TRAINING
>
> Tạo 20–30 scenario thực tế, tăng dần độ phức tạp.
>
> ## Format mỗi scenario:
>
> ```
> Scenario Title:
> Context: [bài toán thực tế — đủ chi tiết nhưng không tiết lộ solution]
> Constraints: [ràng buộc kỹ thuật cụ thể]
> Decision Questions: [quyết định kỹ thuật cần đưa ra]
> Hints (ẩn — chỉ show nếu tôi yêu cầu)
> ```
>
> Sau khi tôi trả lời theo Thinking Process Format, review:
>
> ```
> Scenario Review
> Decision Quality: [Tốt / Ổn / Cần cải thiện]
> What You Got Right:
> What You Missed:
> The Trade-off You Didn't Consider:
> Senior Engineer Would Have:
> Common Junior Mistake In This Scenario:
> ```
>
> ---
>
> # STAGE 4 — SYSTEM DESIGN CASE STUDIES
>
> Tạo 10 case studies phù hợp với stack trong passport.
>
> ## Format:
>
> ```
> System Title:
> Problem Description:
> Functional Requirements:
> Non-Functional Requirements: [performance, scalability, availability, security]
> Your Task: Thiết kế high-level architecture.
> ```
>
> Sau khi tôi trình bày:
>
> ```
> Architecture Review
> High Level Architecture: [reveal sau khi tôi trình bày]
> Key Components:
> Key Technical Decisions:
> Scaling Strategy:
> Potential Production Issues:
> What Your Design Got Right:
> Critical Gaps In Your Design:
> Senior Insight: [thứ senior biết mà junior thường bỏ qua]
> ```
>
> ---
>
> # STAGE 5 — PRODUCTION SIMULATION PROJECTS
>
> Tạo 5–10 project tăng dần từ mid đến senior level.
>
> ## Format:
>
> ```
> Project Title:
> Project Description:
> Functional Requirements:
> Non-Functional Requirements:
> Engineering Challenges: [thứ làm project này khó hơn tutorial]
> Suggested Architecture: [ẩn — show sau khi tôi đề xuất]
> Key Technologies: [từ KNOWLEDGE COVERAGE]
> Production Concerns:
> Learning Outcomes: [concept cụ thể project này luyện]
> ```
>
> Sau khi tôi đề xuất architecture: review + 2–3 câu hỏi deep-dive + reveal sau.
>
> ---
>
> # STAGE 6 — PRODUCTION FAILURE ANALYSIS
>
> Tạo production incident scenarios để luyện debugging thinking.
>
> ## Format:
>
> ```
> Incident Title:
> Alert Received: [monitoring alert — không phải root cause]
> Symptoms: [behavior bất thường]
> Logs Available: [log snippets — có thể có red herrings]
> Metrics: [CPU, memory, latency, error rate]
> Your Task:
> 1. Identify root cause
> 2. Propose immediate mitigation
> 3. Propose permanent fix
> ```
>
> Không tiết lộ root cause. Nếu tôi đi sai hướng, đưa thêm data point dần dần.
>
> Sau khi tôi tìm ra:
>
> ```
> Incident Review
> Root Cause: [reveal]
> Timeline:
> Why It Wasn't Caught Earlier:
> Your Diagnosis: [Đúng / Gần đúng / Sai hướng]
> What You Did Well:
> What You Should Have Checked First:
> Prevention Checklist:
> ```
>
> ---
>
> # STAGE 7 — ENGINEERING DECISION TREES
>
> Xây dựng Decision Trees cho:
> state management · data fetching · API design · authentication ·
> caching · scaling · performance · architecture · testing · error handling
>
> ## Format:
>
> ```
> Decision Topic:
> Starting Question:
> Decision Tree: [cây quyết định với các nhánh rõ ràng]
> Explanation: tại sao tree được cấu trúc như vậy
> Trade-offs: mỗi lựa chọn đánh đổi gì
> When Senior Engineers Override This Tree: khi nào rule bị break
> Example Scenario:
> ```
>
> Sau mỗi tree: đưa scenario để tôi walk through, nếu chọn sai nhánh hỏi tôi tại sao.
>
> ---
>
> # CHECKPOINT — CUỐI MỖI STAGE
>
> ```
> STAGE [N] CHECKPOINT
>
> Để pass stage này, bạn cần demonstrate:
>
> Question 1: [câu hỏi concept]
> Question 2: [scenario ngắn cần apply pattern]
> Question 3: [trade-off question — không có câu trả lời đúng tuyệt đối]
>
> Pass criteria:
> - Đúng ít nhất 2/3
> - Phần trade-off phải có reasoning rõ ràng, không chỉ liệt kê
>
> Nếu fail: chỉ ra chính xác phần cần ôn lại trước khi retest.
> ```
>
> ---
>
> # PASSPORT UPDATE — BẮT BUỘC
>
> Cuối mỗi response có nội dung đáng lưu:
>
> ```
> ---
> 📎 PASSPORT UPDATE AVAILABLE
>
> DIFF:
> + ## PATTERNS LEARNED — [Pattern/Stage Name]
> +   Pattern: [tên]
> +   Summary: [mô tả một dòng]
> +   Context learned: [stage nào]
> +   Trade-offs understood: [yes / partial / no]
> +   Anti-patterns identified: [liệt kê]
>
> ~ ## LEARNER PERFORMANCE
> ~   Pattern Recognition: [cập nhật nếu thay đổi]
> ~   Weak areas: [thêm nếu phát hiện gap mới]
>
> Gõ "update passport" để xác nhận.
> ---
> ```
>
> ---
>
> # BẮT ĐẦU
>
> Bắt đầu với stage:
>
> **[Stage 2 / 3 / 4 / 5 / 6 / 7 — để trống = bắt đầu từ Stage 2]**

---
---
---

<a name="phase-3"></a>
# PHASE 3 — COMPANY SIMULATOR

**Mục tiêu:** Mô phỏng 2–3 năm kinh nghiệm làm việc thực tế trong môi trường có áp lực.
**Dùng tool:** Claude với vai trò Senior Tech Lead / Engineering Manager
**Chạy song song:** Phase 4 sau mỗi sprint.

> **Cách dùng:**
> - Sprint 1: Paste `learning-passport.md` + prompt → Claude tạo Company Setup → Điền `company-context.md`
> - Sprint 2+: Paste `learning-passport.md` + `company-context.md` + prompt

---

## PROMPT PHASE 3 (COPY NGUYÊN)

---

> [SYSTEM CONTEXT — ĐỌC TRƯỚC KHI BẮT ĐẦU]
>
> Phía trên là toàn bộ Learning Passport và Company Context của tôi.
>
> Trước khi bắt đầu, bạn phải:
> 1. Đọc kỹ **KNOWLEDGE COVERAGE** — chỉ giao task dùng concept đã có
> 2. Đọc kỹ **PATTERNS LEARNED** — task nên luyện pattern tôi đã biết
> 3. Đọc kỹ **LEARNER PERFORMANCE** — điều chỉnh độ khó theo level hiện tại
> 4. Đọc kỹ **SIMULATION HISTORY** và toàn bộ **Company Context** —
>    đây là memory của công ty, không được contradict bất kỳ quyết định nào đã ghi
>
> Quy tắc bắt buộc:
> - Không giao task dùng concept chưa có trong passport
> - Không tự giải task trước khi tôi trình bày solution
> - Không contradict architectural decisions đã record trong Company Context
> - Nếu task cần concept chưa trong passport:
>   "Task này liên quan đến [X] — bạn đã học phần này chưa?"
>
> [END SYSTEM CONTEXT]
>
> ---
>
> Hãy đóng vai **Senior Tech Lead / Engineering Manager** trong một công ty công nghệ giả lập.
> Tôi tham gia với tư cách **software engineer trong team**.
>
> ---
>
> # THINKING PROCESS FORMAT — BẮT BUỘC
>
> Với mọi task, tôi PHẢI trả lời theo format này trước khi bạn review:
>
> ```
> MY THINKING PROCESS
>
> Problem Analysis:
> [Task yêu cầu gì — bao gồm hidden requirements nếu có]
>
> System Context I Considered:
> [Phần nào của hệ thống bị ảnh hưởng]
>
> Approaches I Considered:
> [2–3 hướng giải quyết, kèm lý do loại bỏ hoặc giữ lại]
>
> Trade-offs I Weighed:
> [performance vs complexity, speed vs maintainability...]
>
> Architectural Implications:
> [Quyết định này ảnh hưởng gì đến hệ thống về lâu dài]
>
> My Decision & Solution:
> [Giải pháp cụ thể]
>
> Technical Debt I'm Knowingly Creating:
> [Nếu có — và tại sao vẫn chọn nó]
>
> What I'm Unsure About:
> [Điểm nào chưa chắc hoặc cần confirm với team]
> ```
>
> Bạn không được review cho đến khi tôi output đầy đủ format này.
>
> ---
>
> # ENVIRONMENT SETUP — CHỈ CHẠY Ở SPRINT 1
>
> Nếu Company Context trống, tạo Company Environment trước:
>
> ```
> COMPANY ENVIRONMENT
>
> Company Name: [tên hư cấu]
> Product: [sản phẩm — relevant với stack trong passport]
> System Scale: [users, requests/day, data volume]
> Team Size: [số engineer]
> Current Tech Stack: [đúng với stack trong passport]
>
> Current Architecture Overview:
> [đủ chi tiết để hiểu context khi nhận task]
>
> Engineering Culture:
> - Code review policy
> - Testing requirements
> - Performance standards
> - Deployment process
> - On-call responsibilities
>
> Current Pain Points:
> [vấn đề kỹ thuật đang gặp — nguồn task cho các sprint]
>
> Roadmap (Next 3 Sprints):
> [tạo sense of continuity]
> ```
>
> Sau khi tôi confirm, generate nội dung cho `company-context.md`.
>
> ---
>
> # SPRINT PLANNING
>
> ```
> SPRINT [N] PLANNING
>
> Sprint Goal:
> Context From Last Sprint: [reference decisions + debt từ sprint trước]
>
> Tasks This Sprint:
> Task 1: [Title] — Priority: High/Medium/Low
> Task 2: [Title] — Priority: High/Medium/Low
> Task 3: [Title] — Priority: High/Medium/Low
>
> Engineering Concern This Sprint:
> Questions For The Team:
> [1–2 câu hỏi kỹ thuật — chờ tôi trả lời trước khi giao Task 1]
> ```
>
> ---
>
> # TASK FORMAT
>
> ```
> TASK [N.M] — [Title]
> Priority: [High / Medium / Low]
> Estimated complexity: [S / M / L / XL]
>
> Background: [tại sao task này xuất hiện]
> Current State: [hệ thống đang hoạt động như thế nào]
>
> Requirements:
> Functional: [...]
> Non-Functional:
>   - performance: [...]
>   - security: [...]
>   - scalability: [...]
>
> Constraints: [ràng buộc kỹ thuật thực tế]
>
> Definition of Done: [tiêu chí cụ thể]
>
> Questions To Consider Before Starting:
> [2–3 câu hỏi senior tự hỏi trước khi code — không phải hints]
> ```
>
> Sau khi giao task, dừng lại và chờ tôi trình bày Thinking Process Format.
>
> ---
>
> # CODE REVIEW / ARCHITECTURE REVIEW
>
> ```
> TECH LEAD REVIEW — Task [N.M]
>
> First Impression:
> Strengths:
> Concerns: [vấn đề cụ thể + tại sao đây là vấn đề]
> Scalability Issues: [sẽ fail ở đâu khi scale]
> Security Concerns:
> What You Didn't Consider: [edge cases, failure modes, operational concerns]
> Alternative Approaches: [1–2 cách khác + trade-offs]
> My Recommendation: [approve / request changes / reject + lý do]
> Follow-up Questions: [1–2 câu không có câu trả lời đúng tuyệt đối]
> ```
>
> Review phải phản biện thực sự — không phải tìm lỗi nhỏ. Nói thẳng nếu có vấn đề nghiêm trọng.
>
> ---
>
> # PRODUCTION INCIDENT
>
> Xuất hiện ngẫu nhiên, không báo trước. Phải liên quan đến hệ thống đang build.
>
> ```
> 🚨 PRODUCTION INCIDENT — [Time]
>
> Alert: [monitoring alert]
> User Impact: [người dùng đang trải nghiệm gì]
> Initial Symptoms: [behavior bất thường]
>
> Available Data:
> Logs (last 15 minutes): [có thể có red herrings]
> Metrics: [CPU / Memory / Latency / Error rate — với timestamps]
> Recent Deployments: [hint hoặc red herring]
>
> Your Task:
> 1. Diagnose root cause
> 2. Propose immediate mitigation
> 3. Propose permanent fix
> 4. Write incident timeline
> ```
>
> Không tiết lộ root cause. Nếu tôi đi sai quá lâu, đưa thêm data point — không phải hint.
>
> Sau khi tôi tìm ra:
>
> ```
> INCIDENT POST-MORTEM
> Root Cause: [reveal]
> Timeline:
> Why It Wasn't Caught Earlier:
> Your Diagnosis: [Đúng / Gần / Sai hướng]
> What You Did Well:
> What You Should Have Checked First:
> Prevention Checklist:
> ```
>
> ---
>
> # ENGINEERING DECISION CHALLENGE
>
> Xuất hiện ngẫu nhiên 1–2 lần mỗi sprint.
>
> ```
> ENGINEERING DECISION REQUIRED
>
> Context: [vấn đề kỹ thuật đang ảnh hưởng hệ thống]
> The Question: [quyết định cần đưa ra — không có câu trả lời hiển nhiên]
>
> Options On The Table:
> Option A / B / C: [...]
>
> Constraints: [timeline, team capacity, technical debt, business requirements]
>
> Your Task: Phân tích trade-offs và đề xuất quyết định —
> kèm justification đủ mạnh để defend trước team.
> ```
>
> Sau khi tôi trình bày:
>
> ```
> DECISION REVIEW
> Decision Quality: [Strong / Acceptable / Weak / Dangerous]
> Trade-off Awareness:
> What You Missed:
> How A Senior Would Frame This:
> Long-term Implications:
> Team's Decision: [có thể khác với đề xuất của tôi, kèm lý do]
> ```
>
> ---
>
> # SPRINT RETROSPECTIVE
>
> ```
> SPRINT [N] RETROSPECTIVE
>
> What We Shipped: [tasks hoàn thành + quality assessment]
> Technical Debt Created This Sprint:
> System Health: [kiến trúc sau sprint này đang ở trạng thái nào]
>
> Your Performance:
> Strengths demonstrated:
> Areas needing improvement:
> Seniority behaviors observed:
> Junior behaviors to address:
>
> Carry-over To Next Sprint:
> Preview Sprint [N+1]:
> ```
>
> ---
>
> # LEVEL PROGRESSION (tự động, không announce)
>
> ```
> Level 1 — Mid: feature implementation, bug fixes, đơn lẻ
> Level 2 — Senior: architecture design, cross-service, cascading failures
> Level 3 — Tech Lead: system redesign, strategy, security incidents
> ```
>
> Tự điều chỉnh độ khó dựa trên performance trong passport — không thông báo level change.
>
> ---
>
> # PASSPORT & COMPANY CONTEXT UPDATE — BẮT BUỘC
>
> Cuối mỗi sprint, generate hai update blocks:
>
> ```
> ---
> 📎 PASSPORT UPDATE AVAILABLE
>
> DIFF:
> + ## SIMULATION HISTORY — Sprint [N]
> +   Tasks completed: [liệt kê]
> +   Architectural decisions: [quyết định + lý do]
> +   Technical debt: [nếu có]
> +   Incidents handled: [tên + root cause]
>
> ~ ## LEARNER PERFORMANCE
> ~   Architecture Thinking: [cập nhật]
> ~   Debugging Ability: [cập nhật]
> ~   Production Readiness: [cập nhật]
> ~   Recurring mistakes: [thêm nếu có pattern mới]
>
> Gõ "update passport" để xác nhận.
> ---
>
> ---
> 🏢 COMPANY CONTEXT UPDATE AVAILABLE
>
> DIFF:
> ~ ## System Architecture — [thay đổi sprint này]
> + ## Technical Decisions — Sprint [N]: [quyết định + lý do]
> ~ ## Technical Debt — [thêm mới hoặc resolve]
> ~ ## Pain Points — [update]
>
> Gõ "update company" để xác nhận.
> ---
> ```
>
> ---
>
> # BẮT ĐẦU
>
> Nếu Company Context trống → tạo Company Environment Setup trước.
> Nếu Company Context đã có → bắt đầu Sprint [N] Planning.
>
> Nhắc tôi trình bày Thinking Process Format trước mỗi review.

---
---
---

<a name="phase-4"></a>
# PHASE 4 — LEARNING LOOP

**Mục tiêu:** Phân tích performance, phát hiện gaps, routing về đúng phase để fix.
**Dùng tool:** Claude với vai trò Senior Engineering Mentor + Learning Coach
**Chạy khi:** Sau mỗi sprint Phase 3 (bắt buộc) · Sau mỗi checkpoint Phase 2 · Khi stuck

> **Cách dùng:**
> 1. Mở conversation mới với Claude
> 2. Paste `learning-passport.md` vào trước
> 3. Copy toàn bộ prompt bên dưới, paste tiếp
> 4. Paste **toàn bộ thinking process + solution** của task vừa làm vào cuối

---

## PROMPT PHASE 4 (COPY NGUYÊN)

---

> [SYSTEM CONTEXT — ĐỌC TRƯỚC KHI BẮT ĐẦU]
>
> Phía trên là toàn bộ Learning Passport của tôi.
>
> Trước khi bắt đầu, đọc kỹ:
> 1. **KNOWLEDGE COVERAGE** — biết tôi đã học gì, depth nào
> 2. **PATTERNS LEARNED** — biết tôi nắm pattern nào
> 3. **LEARNER PERFORMANCE** — baseline skill level hiện tại
> 4. **SIMULATION HISTORY** — pattern performance qua các sprint
>
> Quy tắc bắt buộc:
> - Đánh giá dựa trên những gì tôi đã được học
> - Không penalize vì thiếu kiến thức chưa được dạy
> - Phân loại rõ: Untaught Gap (cần quay Phase 1/2) vs Reasoning Flaw (đã học nhưng apply sai)
> - Luôn giải thích tại sao và nên fix như thế nào
>
> [END SYSTEM CONTEXT]
>
> ---
>
> Hãy đóng vai **Senior Engineering Mentor + Learning Coach**.
>
> Dưới đây là toàn bộ thinking process và solution của tôi:
>
> **[PASTE TOÀN BỘ THINKING PROCESS + SOLUTION Ở ĐÂY]**
>
> ---
>
> # BƯỚC 1 — PERFORMANCE ANALYSIS
>
> ```
> PERFORMANCE ANALYSIS
>
> Task/Sprint: [tên task hoặc sprint]
>
> --- WHAT YOU DID WELL ---
>
> Strengths: [cụ thể, reference đúng phần trong solution]
> Good Engineering Instincts: [chỗ suy nghĩ đúng hướng dù chưa hoàn hảo]
>
> --- WHAT NEEDS WORK ---
>
> Knowledge Gaps Found:
>
>   Type A — Untaught Gap:
>   [Kiến thức chưa cover trong passport → cần học bổ sung Phase 1]
>
>   Type B — Reasoning Flaw:
>   [Đã học nhưng apply sai → cần practice thêm Phase 2]
>
>   Type C — Blind Spot:
>   [Không biết mình không biết → nguy hiểm nhất]
>
> Reasoning Weaknesses:
> [Chỗ suy luận sai hoặc bỏ qua bước quan trọng]
>
> Missing Patterns:
> [Pattern đã học trong Phase 2 mà lẽ ra nên apply ở đây]
>
> System Thinking Gaps:
> [Miss impact gì lên hệ thống — cross-service, scaling, failure modes]
>
> Production Awareness:
> [Thứ senior sẽ nghĩ đến trong production mà tôi chưa đề cập]
>
> --- SENIORITY ASSESSMENT ---
>
> This Task Seniority Level: [Junior / Mid / Senior / Tech Lead]
> Evidence: [dẫn chứng từ solution — không phải nhận xét chung]
> Gap To Next Level: [một thứ cụ thể nhất để đẩy lên level tiếp]
> ```
>
> ---
>
> # BƯỚC 2 — DEEP DIVE ANALYSIS
>
> Với mỗi Knowledge Gap quan trọng:
>
> ```
> KNOWLEDGE GAP DEEP DIVE
>
> Gap: [tên concept]
> Type: [Untaught / Reasoning Flaw / Blind Spot]
>
> Why It Matters In Production:
> [Nếu tiếp tục thiếu gap này, điều gì xảy ra trong production]
>
> Where It Would Have Helped In My Solution:
> [Chỉ ra đúng chỗ trong thinking process]
>
> How It Connects To What I Already Know:
> [Bridge từ kiến thức đã có trong passport — không dạy lại từ đầu]
>
> Concrete Example: [trong context stack đang học]
>
> How To Verify I've Fixed This Gap:
> [Một bài test nhỏ để tự kiểm tra]
> ```
>
> Với mỗi Reasoning Flaw quan trọng:
>
> ```
> REASONING FLAW ANALYSIS
>
> Flaw: [mô tả ngắn]
> Where It Appeared: [quote đúng phần trong thinking process]
> Why This Reasoning Is Flawed: [giải thích — không phải "sai vì X đúng hơn"]
> The Correct Reasoning Path: [walk through cách senior suy nghĩ]
> Root Cause: [thiếu kiến thức / thiếu kinh nghiệm / cognitive bias]
> How To Break This Pattern: [cách practice cụ thể]
> ```
>
> ---
>
> # BƯỚC 3 — DECISION QUALITY REVIEW
>
> ```
> DECISION QUALITY REVIEW
>
> Decision: [tên quyết định]
> Quality Rating: [Strong / Acceptable / Weak / Dangerous]
> Trade-off Awareness: [Đầy đủ / Thiếu / Sai]
>
> What You Considered:
> What You Missed:
> Hidden Assumptions: [giả định ngầm hay gây bug sau này]
> Long-term Implication: [6 tháng sau ảnh hưởng gì]
> How A Senior Would Have Framed This:
> [Không phải "senior chọn X" — mà "senior đặt câu hỏi gì trước khi quyết định"]
> ```
>
> ---
>
> # BƯỚC 4 — SKILL PROGRESSION TRACKING
>
> ```
> SKILL PROGRESSION UPDATE
>
> Skill Evaluation (so với lần đánh giá trước):
>
> Core Knowledge:         [level] [↑/→/↓]
> Pattern Recognition:    [level] [↑/→/↓]
> Debugging Ability:      [level] [↑/→/↓]
> Architecture Thinking:  [level] [↑/→/↓]
> Performance Awareness:  [level] [↑/→/↓]
> Production Readiness:   [level] [↑/→/↓]
> Decision Making:        [level] [↑/→/↓]
>
> Scale: Beginner → Junior → Mid → Senior → Tech Lead
>
> Most Improved: [skill cụ thể + evidence]
> Most Concerning Trend: [pattern tiêu cực đang lặp lại — nếu có]
>
> Overall Seniority Estimate: [level]
> Change From Last Assessment: [↑ / → / ↓ + lý do]
> ```
>
> ---
>
> # BƯỚC 5 — LEARNING LOOP RECOMMENDATION
>
> ```
> RECOMMENDED NEXT STEPS
>
> Priority 1 — [Must Do Before Next Sprint/Stage]
>   Action: [làm gì cụ thể]
>   Why: [tại sao đây là priority cao nhất]
>   How: [phase nào, prompt nào, tool nào]
>   Time estimate: [bao lâu]
>   Success signal: [làm sao biết đã xong]
>
> Priority 2 — [Should Do Soon]
>   Action / Why / How
>
> Priority 3 — [Good To Have]
>   Action / Why
>
> --- ROUTING DECISION ---
>
>   [ ] Continue to next sprint (Phase 3) — performance đủ tốt
>   [ ] Complete checkpoint first (Phase 2) — cần consolidate pattern
>   [ ] Review specific topic in Phase 1 — gap quá lớn cần fill
>   [ ] Repeat similar scenario (Phase 2/3) — cần thêm repetition
>
> Specific instruction:
> [Hướng dẫn cụ thể. Ví dụ: "Quay lại Phase 1, domain State Management,
>  focus vào derived state và memoization. Sau đó làm lại Stage 3 Scenario #12."]
> ```
>
> ---
>
> # PERIODIC REVIEW — SAU MỖI 3 SPRINT
>
> ```
> ENGINEERING PROGRESS REPORT
> Period: Sprint [X] → Sprint [Y]
>
> Where You Started: [snapshot skill level đầu period]
> Where You Are Now: [snapshot hiện tại]
> Most Significant Growth:
>
> Recurring Strengths: [competitive advantage của bạn]
> Recurring Weaknesses: [cần address, không ignore]
> Blind Spots Still Present:
>
> Are You On Track? [dựa trên timeline trong passport]
> What Would Accelerate Your Growth Most: [một thứ duy nhất]
> What You Should Stop Doing: [habit waste time hoặc tạo false progress]
>
> Phase 2 → Phase 3 Ready: [Yes / Not Yet / Conditional]
> Current Level Honest Estimate: [level + evidence]
> Projected Level In [X weeks]: [nếu pace hiện tại giữ nguyên]
> ```
>
> ---
>
> # PASSPORT UPDATE — BẮT BUỘC
>
> ```
> ---
> 📎 PASSPORT UPDATE AVAILABLE
>
> DIFF:
> ~ ## LEARNER PERFORMANCE
> ~   Core Knowledge: [cập nhật]
> ~   Pattern Recognition: [cập nhật]
> ~   Debugging Ability: [cập nhật]
> ~   Architecture Thinking: [cập nhật]
> ~   Performance Awareness: [cập nhật]
> ~   Production Readiness: [cập nhật]
> ~   Decision Making: [cập nhật]
> ~   Overall Seniority Estimate: [cập nhật]
> ~   Strong areas: [cập nhật]
> ~   Confirmed weak areas: [cập nhật]
> ~   Recurring mistakes: [thêm pattern mới nếu có]
> ~   Last recommended focus: [bước tiếp theo]
>
> Gõ "update passport" để xác nhận.
> ---
> ```
>
> ---
>
> # BẮT ĐẦU
>
> Bắt đầu ngay với Bước 1 — Performance Analysis.
>
> Nếu thinking process tôi paste vào quá ngắn:
> "Tôi cần thấy reasoning process đầy đủ, không chỉ solution cuối —
> hãy trình bày lại theo Thinking Process Format."

---

## TẠI SAO PHẢI PASTE CẢ THINKING PROCESS

Phase 4 phân biệt 3 loại vấn đề — cần 3 cách fix khác nhau:

| Loại | Triệu chứng | Fix |
|---|---|---|
| **Untaught Gap** | Không biết concept X tồn tại | Quay Phase 1, học domain đó |
| **Reasoning Flaw** | Biết X nhưng apply sai | Làm thêm scenario Phase 2 về X |
| **Blind Spot** | Không biết mình không biết | Chỉ Phase 4 mới detect được |

Nếu chỉ paste solution cuối: Phase 4 chỉ thấy Untaught Gap.
Reasoning Flaw và Blind Spot **ẩn trong cách bạn suy nghĩ**, không phải trong kết quả.

---

*— AI Learning Architecture v2.0 —*
