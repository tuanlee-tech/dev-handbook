# PHASE 0 — DIAGNOSIS
## Cách Dùng
1. Mở conversation mới với Claude
2. Copy toàn bộ nội dung trong box "PROMPT ĐẦY ĐỦ" bên dưới
3. Paste vào Claude và bắt đầu

Không cần điền gì trước — Claude sẽ hỏi từng bước.

---

## PROMPT ĐẦY ĐỦ (COPY NGUYÊN)

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
> Bạn sẽ thực hiện một buổi **Diagnosis Interview** gồm 3 bước:
>
> **Bước 1 — Thu thập thông tin**
>
> Hỏi tôi lần lượt về các thông tin sau (hỏi từng nhóm, không hỏi tất cả cùng lúc):
>
> Nhóm 1 — Background:
> - Tôi đã biết những ngôn ngữ/framework/stack nào? Ở level nào?
> - Tôi đã có kinh nghiệm làm việc thực tế chưa? Nếu có thì làm gì?
> - Tôi học lập trình được bao lâu rồi?
>
> Nhóm 2 — Mục tiêu:
> - Tôi muốn học stack gì, hoặc tôi đang cân nhắc những stack nào?
> - Tôi muốn dùng stack đó để làm gì? (web app, mobile, backend API, data, CLI, khác)
> - Mục tiêu cuối cùng là gì? (đổi việc, freelance, side project, thăng chức, khác)
>
> Nhóm 3 — Constraints:
> - Tôi có bao nhiêu thời gian mỗi ngày để học?
> - Tôi muốn học full-time hay part-time?
> - Deadline nào tôi cần đạt được không? (phỏng vấn, dự án, khác)
>
> ---
>
> **Bước 2 — Phân tích và đề xuất**
>
> Sau khi có đủ thông tin, hãy output một **Diagnosis Report** theo format sau:
>
> ```
> DIAGNOSIS REPORT
>
> Learner Profile:
> [Tóm tắt background và mục tiêu của tôi theo cách bạn hiểu — để tôi confirm lại]
>
> Stack Recommendation:
> [Stack cụ thể bạn đề xuất tôi học, kèm lý do]
>
> Nếu tôi đã có stack trong đầu: đánh giá xem stack đó có phù hợp không, nếu không thì tại sao và đề xuất thay thế.
>
> Nếu tôi chưa biết học gì: đề xuất 2–3 options với trade-offs rõ ràng, sau đó hỏi tôi chọn gì.
>
> Depth Calibration:
> [Dựa trên background của tôi, Phase 1 nên bắt đầu ở đâu và skip gì]
>
> Ví dụ:
> - Nếu tôi đã biết JavaScript → skip JS basics, focus vào React-specific patterns
> - Nếu tôi đã là senior ở stack khác → skip fundamentals, focus vào architecture ngay
> - Nếu tôi là beginner → bắt đầu từ đầu, không skip gì
>
> Learning Path Estimate:
> [Ước tính timeline thực tế cho từng phase dựa trên thời gian tôi có]
>
> Phase 1: X tuần
> Phase 2: X tuần
> Phase 3: X tuần (ongoing)
> Phase 4: Song song với Phase 2, 3
>
> Red Flags:
> [Nếu tôi có kỳ vọng không thực tế hoặc thiếu prerequisite quan trọng, nói thẳng ở đây]
>
> First Week Plan:
> [Tuần đầu tiên tôi nên làm gì cụ thể — domain nào học trước, bao nhiêu tiếng mỗi ngày]
> ```
>
> ---
>
> **Bước 3 — Khởi tạo Learning Passport**
>
> Sau khi tôi confirm Diagnosis Report, hãy generate nội dung khởi tạo cho file `learning-passport.md` của tôi theo format sau:
>
> ```markdown
> # Learning Passport
> Stack: [tên stack]
> Current Phase: Phase 0 — Completed
> Last Updated: [ngày hôm nay]
>
> ---
>
> ## LEARNER PROFILE
> Background: [tóm tắt những gì tôi đã biết]
> Goal: [mục tiêu cụ thể]
> Timeline: [thời gian dự kiến]
> Hours per day: [số giờ học mỗi ngày]
> Seniority Estimate: [Beginner / Junior / Mid / Senior]
>
> ## DEPTH CALIBRATION
> Skip: [những thứ không cần học vì đã biết]
> Start from: [bắt đầu từ đâu trong Phase 1]
> Fast-track: [những thứ có thể học nhanh vì đã có background liên quan]
>
> ## PHASE 1 PLAN
> Domain order: [thứ tự các domain nên học]
> First domain: [domain đầu tiên + lý do]
>
> ## KNOWLEDGE COVERAGE
> [Để trống — sẽ được điền trong Phase 1]
>
> ## PATTERNS LEARNED
> [Để trống — sẽ được điền trong Phase 2]
>
> ## SIMULATION HISTORY
> [Để trống — sẽ được điền trong Phase 3]
>
> ## LEARNER PERFORMANCE
> [Để trống — sẽ được điền trong Phase 4]
> ```
>
> ---
>
> # NGUYÊN TẮC KHI HỎI
>
> - Hỏi từng nhóm một, không dump tất cả câu hỏi vào một lần
> - Nếu tôi trả lời mơ hồ, hỏi thêm để làm rõ
> - Không đưa ra recommendation trước khi có đủ thông tin
> - Nói thẳng nếu tôi có kỳ vọng không thực tế — đừng chỉ đồng ý để làm hài lòng
>
> ---
>
> Bắt đầu bằng **Nhóm câu hỏi 1 — Background**.

---

## SAU KHI CHẠY PHASE 0

**Bạn sẽ có:**
- Diagnosis Report đã confirm
- Nội dung khởi tạo cho `learning-passport.md`

**Việc cần làm:**
1. Tạo file `learning-passport.md`, paste nội dung Claude generate vào
2. Tạo file `company-context.md` để trống — sẽ dùng ở Phase 3
3. Chạy:
```bash
git init
git add .
git commit -m "init: learning passport — phase 0 complete"
```
4. Sang Phase 1 với passport đã có trong tay

---

## LƯU Ý

**Nếu Claude đề xuất stack bạn không đồng ý:**
> *"Tôi muốn học [stack X] vì [lý do]. Với background của tôi, điều chỉnh depth như thế nào để phù hợp nhất?"*

**Nếu muốn so sánh 2 stack trước khi chọn:**
> *"Hãy so sánh [Stack A] và [Stack B] theo background và mục tiêu của tôi — trade-offs cụ thể cho trường hợp của tôi."*

**Nếu Claude hỏi quá nhiều thứ cùng lúc:**
> *"Hỏi từng nhóm một thôi, đừng dump tất cả vào một lần."*
