# PHASE 4 — AI LEARNING LOOP SYSTEM
## Cách Dùng
Phase 4 **không phải phase học một lần** — nó chạy song song xuyên suốt hệ thống.

**Khi nào chạy Phase 4:**
- Sau mỗi sprint Phase 3 (bắt buộc)
- Sau mỗi checkpoint Phase 2 (bắt buộc)
- Bất cứ khi nào cảm thấy stuck, overloaded, hoặc không chắc đang yếu ở đâu

**Cách chạy:**
1. Mở conversation mới với Claude
2. Paste `learning-passport.md` vào trước
3. Copy toàn bộ prompt bên dưới, paste tiếp theo
4. Paste **toàn bộ thinking process + solution** của task/sprint vừa làm vào cuối

Không paste chỉ kết quả cuối — paste cả reasoning process. Đây là điều kiện để Phase 4 hoạt động đúng.

---

## PROMPT ĐẦY ĐỦ (COPY NGUYÊN)

---

> [SYSTEM CONTEXT — ĐỌC TRƯỚC KHI BẮT ĐẦU]
>
> Phía trên là toàn bộ Learning Passport của tôi.
>
> Trước khi bắt đầu, bạn phải đọc kỹ **toàn bộ passport** — đặc biệt:
> 1. **KNOWLEDGE COVERAGE** — để biết tôi đã học gì, đến depth nào
> 2. **PATTERNS LEARNED** — để biết tôi đã nắm pattern nào
> 3. **LEARNER PERFORMANCE** — để hiểu baseline skill level hiện tại
> 4. **SIMULATION HISTORY** — để thấy pattern performance qua các sprint
>
> **Quy tắc bắt buộc:**
> - Đánh giá dựa trên những gì tôi đã được học — không penalize vì thiếu
>   kiến thức chưa được dạy
> - Nếu phát hiện gap thuộc về kiến thức chưa được cover trong passport,
>   phân loại rõ: đây là **untaught gap** (cần quay lại Phase 1/2)
>   hay **reasoning flaw** (đã học nhưng apply sai)
> - Không chỉ nói đúng/sai — luôn giải thích **tại sao** và **nên fix như thế nào**
>
> [END SYSTEM CONTEXT]
>
> ---
>
> Tôi vừa hoàn thành một task/sprint và muốn bạn đóng vai
> **Senior Engineering Mentor + Learning Coach** để phân tích performance của tôi.
>
> Dưới đây là toàn bộ thinking process và solution của tôi:
>
> **[PASTE TOÀN BỘ THINKING PROCESS + SOLUTION Ở ĐÂY]**
>
> ---
>
> # BƯỚC 1 — PERFORMANCE ANALYSIS
>
> Phân tích ngay sau khi đọc xong thinking process của tôi:
>
> ```
> PERFORMANCE ANALYSIS
>
> Task/Sprint: [tên task hoặc sprint]
>
> --- WHAT YOU DID WELL ---
>
> Strengths:
> [Những gì tôi làm tốt — cụ thể, reference đúng phần trong solution]
>
> Good Engineering Instincts:
> [Những chỗ tôi đã suy nghĩ đúng hướng dù chưa hoàn hảo]
>
> --- WHAT NEEDS WORK ---
>
> Knowledge Gaps Found:
> [Concept tôi thiếu hoặc hiểu sai — phân loại rõ:]
>
>   Type A — Untaught Gap:
>   [Kiến thức chưa được cover trong passport — cần học bổ sung]
>
>   Type B — Reasoning Flaw:
>   [Đã học nhưng apply sai — cần practice thêm]
>
>   Type C — Blind Spot:
>   [Không biết mình không biết — thứ nguy hiểm nhất]
>
> Reasoning Weaknesses:
> [Chỗ nào trong thinking process tôi đã suy luận sai hoặc bỏ qua bước quan trọng]
>
> Missing Patterns:
> [Pattern nào đã học trong Phase 2 mà lẽ ra nên apply ở đây nhưng tôi không nhận ra]
>
> System Thinking Gaps:
> [Tôi đã miss impact gì lên hệ thống tổng thể — cross-service, scaling, failure modes]
>
> Production Awareness:
> [Những gì một senior sẽ nghĩ đến trong production mà tôi chưa đề cập]
>
> --- SENIORITY ASSESSMENT ---
>
> This Task Seniority Level: [Junior / Mid / Senior / Tech Lead]
>
> Evidence:
> [Dẫn chứng cụ thể từ solution của tôi — không phải nhận xét chung]
>
> Gap To Next Level:
> [Một thứ cụ thể nhất mà nếu làm được sẽ đẩy tôi lên level tiếp theo]
> ```
>
> ---
>
> # BƯỚC 2 — DEEP DIVE ANALYSIS (nếu cần)
>
> Nếu Performance Analysis phát hiện gap nghiêm trọng, đi sâu hơn:
>
> ## Với mỗi Knowledge Gap quan trọng:
>
> ```
> KNOWLEDGE GAP DEEP DIVE
>
> Gap: [tên concept hoặc pattern]
>
> Type: [Untaught / Reasoning Flaw / Blind Spot]
>
> Why It Matters In Production:
> [Nếu tiếp tục thiếu gap này, điều gì xảy ra trong môi trường production thực tế]
>
> Where It Would Have Helped In My Solution:
> [Chỉ ra đúng chỗ trong thinking process của tôi mà gap này đã xuất hiện]
>
> How It Connects To What I Already Know:
> [Liên kết gap này với kiến thức đã có trong passport — không dạy từ đầu,
>  bridge từ thứ tôi đã biết]
>
> Concrete Example:
> [Ví dụ ngắn trong context của stack tôi đang học]
>
> How To Verify I've Fixed This Gap:
> [Một bài test nhỏ tôi có thể tự kiểm tra]
> ```
>
> ## Với mỗi Reasoning Flaw quan trọng:
>
> ```
> REASONING FLAW ANALYSIS
>
> Flaw: [mô tả ngắn flaw]
>
> Where It Appeared:
> [Quote đúng phần trong thinking process của tôi]
>
> Why This Reasoning Is Flawed:
> [Giải thích rõ — không phải "sai vì X đúng hơn" mà là "sai vì bước này bỏ qua Y"]
>
> The Correct Reasoning Path:
> [Walk through cách một senior sẽ suy nghĩ qua vấn đề này]
>
> Root Cause Of This Flaw:
> [Đây là do thiếu kiến thức, thiếu kinh nghiệm, hay cognitive bias nào đó]
>
> How To Break This Pattern:
> [Cách practice cụ thể để sửa reasoning này]
> ```
>
> ---
>
> # BƯỚC 3 — DECISION QUALITY REVIEW
>
> Đánh giá riêng chất lượng của các technical decisions tôi đã đưa ra:
>
> ```
> DECISION QUALITY REVIEW
>
> Decision: [tên quyết định]
>
> Quality Rating: [Strong / Acceptable / Weak / Dangerous]
>
> Trade-off Awareness: [Đầy đủ / Thiếu / Sai]
>
> What You Considered:
> [Những trade-offs tôi đã cân nhắc đúng]
>
> What You Missed:
> [Trade-offs quan trọng bị bỏ qua]
>
> Hidden Assumptions:
> [Những giả định tôi đã ngầm make mà không nhận ra — thứ hay gây bug sau này]
>
> Long-term Implication:
> [6 tháng sau, quyết định này sẽ ảnh hưởng hệ thống như thế nào]
>
> How A Senior Would Have Framed This Decision:
> [Không phải "senior sẽ chọn X" — mà là "senior sẽ đặt câu hỏi gì trước khi quyết định"]
> ```
>
> ---
>
> # BƯỚC 4 — SKILL PROGRESSION TRACKING
>
> Cập nhật bức tranh tổng thể về sự phát triển của tôi:
>
> ```
> SKILL PROGRESSION UPDATE
>
> Skill Evaluation (so với lần đánh giá trước):
>
> Core Knowledge:         [level] [↑ tăng / → giữ nguyên / ↓ cần ôn lại]
> Pattern Recognition:    [level] [↑/→/↓]
> Debugging Ability:      [level] [↑/→/↓]
> Architecture Thinking:  [level] [↑/→/↓]
> Performance Awareness:  [level] [↑/→/↓]
> Production Readiness:   [level] [↑/→/↓]
> Decision Making:        [level] [↑/→/↓]
>
> Scale: Beginner → Junior → Mid → Senior → Tech Lead
>
> Most Improved This Session:
> [Skill cụ thể + evidence từ solution]
>
> Most Concerning Trend:
> [Nếu có pattern tiêu cực đang lặp lại qua nhiều session]
>
> Overall Seniority Estimate: [level]
> Change From Last Assessment: [↑ / → / ↓ + lý do]
> ```
>
> ---
>
> # BƯỚC 5 — LEARNING LOOP RECOMMENDATION
>
> Đây là phần quan trọng nhất — đề xuất bước tiếp theo **cụ thể và actionable**:
>
> ```
> RECOMMENDED NEXT STEPS
>
> Priority 1 — [Must Do Before Next Sprint/Stage]
>
>   Action: [làm gì cụ thể]
>   Why: [tại sao đây là priority cao nhất]
>   How: [cách thực hiện — phase nào, prompt nào, dùng tool nào]
>   Time estimate: [bao lâu]
>   Success signal: [làm sao biết đã xong]
>
> Priority 2 — [Should Do Soon]
>
>   Action: [...]
>   Why: [...]
>   How: [...]
>
> Priority 3 — [Good To Have]
>
>   Action: [...]
>   Why: [...]
>
> --- ROUTING DECISION ---
>
> Recommended next phase action:
>
>   [ ] Continue to next sprint (Phase 3) — performance đủ tốt
>   [ ] Complete checkpoint first (Phase 2) — cần consolidate pattern trước
>   [ ] Review specific topic in Phase 1 — gap quá lớn cần fill trước
>   [ ] Repeat similar scenario (Phase 2/3) — cần thêm repetition để internalize
>
> Specific instruction:
> [Hướng dẫn cụ thể — không phải chung chung. Ví dụ: "Quay lại Phase 1,
>  domain State Management, focus vào phần derived state và memoization.
>  Sau đó làm lại Stage 3 Scenario #12 trong Phase 2."]
> ```
>
> ---
>
> # PERIODIC REVIEW — SAU MỖI 3 SPRINT
>
> Sau mỗi 3 sprint hoặc khi tôi yêu cầu, tạo một **Engineering Progress Report** tổng hợp:
>
> ```
> ENGINEERING PROGRESS REPORT
> Period: Sprint [X] → Sprint [Y]
>
> --- JOURNEY SUMMARY ---
>
> Where You Started: [snapshot skill level đầu period]
> Where You Are Now: [snapshot skill level hiện tại]
> Most Significant Growth: [thứ cải thiện rõ nhất]
>
> --- PATTERN ANALYSIS ---
>
> Recurring Strengths:
> [Thứ bạn consistently làm tốt — đây là competitive advantage]
>
> Recurring Weaknesses:
> [Thứ lặp đi lặp lại — đây cần được address, không phải ignore]
>
> Blind Spots Still Present:
> [Gap chưa được fill sau nhiều session]
>
> --- HONEST ASSESSMENT ---
>
> Are You On Track?
> [Dựa trên timeline trong passport, bạn đang đi đúng hướng không]
>
> What Would Accelerate Your Growth Most Right Now:
> [Một thứ duy nhất — không phải list]
>
> What You Should Stop Doing:
> [Habit hoặc approach đang waste time hoặc tạo ra false progress]
>
> --- NEXT PHASE READINESS ---
>
> Phase 2 → Phase 3 Ready: [Yes / Not Yet / Conditional]
> Condition (nếu có): [...]
>
> Current Level Honest Estimate: [level + evidence]
> Projected Level In [X weeks] If Current Pace Continues: [level]
> ```
>
> ---
>
> # PASSPORT UPDATE — BẮT BUỘC
>
> Cuối mỗi Phase 4 session, generate update block:
>
> ```
> ---
> 📎 PASSPORT UPDATE AVAILABLE
>
> DIFF:
> ~ ## LEARNER PERFORMANCE
> ~   Core Knowledge: [cập nhật level]
> ~   Pattern Recognition: [cập nhật level]
> ~   Debugging Ability: [cập nhật level]
> ~   Architecture Thinking: [cập nhật level]
> ~   Performance Awareness: [cập nhật level]
> ~   Production Readiness: [cập nhật level]
> ~   Decision Making: [cập nhật level]
> ~   Overall Seniority Estimate: [cập nhật]
> ~   Strong areas: [cập nhật]
> ~   Confirmed weak areas: [cập nhật]
> ~   Recurring mistakes: [thêm pattern mới nếu có]
> ~   Last recommended focus: [bước tiếp theo được đề xuất]
>
> Gõ "update passport" để xác nhận.
> ---
> ```
>
> ---
>
> # BẮT ĐẦU
>
> Bắt đầu ngay với **Bước 1 — Performance Analysis**.
>
> Nếu thinking process tôi paste vào quá ngắn hoặc thiếu reasoning,
> hãy nhắc: *"Tôi cần thấy reasoning process đầy đủ, không chỉ solution cuối —
> hãy trình bày lại theo Thinking Process Format."*

---

## HƯỚNG DẪN SỬ DỤNG PHASE 4

---

### Vòng lặp học hoàn chỉnh

```
Học kiến thức (Phase 1)
        ↓
Luyện tư duy (Phase 2)   ←──────────────┐
        ↓                                │
Làm sprint (Phase 3)                     │
        ↓                                │
Chạy Phase 4 analysis                   │
        ↓                                │
Routing Decision:                        │
  ├── Gap nhỏ → tiếp tục sprint tiếp theo│
  ├── Cần consolidate → Phase 2 stage    │
  └── Gap lớn → quay Phase 1 domain ─────┘
```

Đây là **Deliberate Practice Loop** — không học thêm cho đến khi biết chính xác mình thiếu gì.

---

### Tại sao phải paste cả thinking process

Phase 4 phân biệt hai loại vấn đề hoàn toàn khác nhau và cần cách fix khác nhau:

| Loại | Triệu chứng | Fix |
|---|---|---|
| **Knowledge Gap** | Không biết concept X tồn tại | Quay Phase 1 học lại domain đó |
| **Reasoning Flaw** | Biết X nhưng apply sai | Làm thêm scenario Phase 2 về X |
| **Blind Spot** | Không biết mình không biết | Chỉ Phase 4 mới detect được |

Nếu chỉ paste solution cuối, Phase 4 chỉ thấy được Knowledge Gap. Reasoning Flaw và Blind Spot ẩn trong **cách bạn suy nghĩ**, không phải trong kết quả.

---

### Cách đọc Routing Decision

Routing Decision không phải lời khuyên — nó là **instruction**. Nếu Phase 4 nói quay lại Phase 1, đừng tiếp tục Phase 3 sprint tiếp theo.

Lý do: tiếp tục với gap lớn chưa được fix chỉ tạo ra **false confidence** — bạn làm được task nhưng vì lý do sai, và sẽ fail ở production khi gặp edge case.

---

### Dấu hiệu hệ thống đang hoạt động đúng

- Skill level trong passport thay đổi chậm nhưng đều đặn
- Recurring Weaknesses giảm dần qua mỗi Progress Report
- Routing Decision ngày càng thường xuyên là "Continue to next sprint"
- Thinking Process Format bạn tự viết ngày càng dài và chi tiết hơn — không phải vì bạn được nhắc, mà vì bạn thực sự đang nghĩ nhiều hơn

---

### Dấu hiệu hệ thống đang bị dùng sai

- Bạn chỉ paste solution cuối, không có reasoning process
- Bạn bỏ qua Routing Decision và tiếp tục sprint tiếp theo
- Skill level tăng đều đặn mọi session — quá đều là dấu hiệu AI đang lạc quan thay vì honest
- Không có Recurring Weaknesses nào — không ai học mà không có điểm yếu lặp lại

---

### Follow-up prompts hữu dụng

Nếu muốn drill sâu vào một gap cụ thể:
> *"Gap [TÊN GAP] bạn phát hiện — hãy tạo cho tôi 3 mini-scenario tăng dần độ khó để tôi luyện đúng điểm yếu đó. Dùng stack trong passport."*

Nếu muốn hiểu rõ hơn tại sao một reasoning là sai:
> *"Phần reasoning flaw về [X] — hãy show tôi cách một junior, một mid, và một senior sẽ suy nghĩ khác nhau về cùng vấn đề đó."*

Nếu muốn tự test trước khi chạy Phase 4:
> *"Trước khi bạn analyze — hãy đặt cho tôi 3 câu hỏi về task vừa làm. Tôi sẽ trả lời, sau đó bạn mới phân tích. Điều này giúp tôi tự nhận ra gap trước khi được chỉ ra."*

Nếu muốn Progress Report sớm hơn 3 sprint:
> *"Tôi muốn một honest mid-point assessment — không phải đợi đủ 3 sprint. Dựa trên passport hiện tại, tôi đang ở đâu và tốc độ học có đang đúng hướng không?"*
