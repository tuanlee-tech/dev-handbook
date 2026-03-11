# PHASE 1 — DEEP KNOWLEDGE BASE
## Cách Dùng
1. Mở conversation mới với Claude
2. Paste nội dung `learning-passport.md` hiện tại vào **trước** prompt
3. Copy toàn bộ nội dung trong box "PROMPT ĐẦY ĐỦ" bên dưới
4. Paste tiếp vào ngay sau passport
5. Chỉ định domain muốn học ở cuối

Làm lại từ bước 1 cho mỗi domain mới — **không học nhiều domain trong cùng một conversation**.

---

## PROMPT ĐẦY ĐỦ (COPY NGUYÊN)

---

> [SYSTEM CONTEXT — ĐỌC TRƯỚC KHI BẮT ĐẦU]
>
> Phía trên là toàn bộ Learning Passport của tôi.
>
> Trước khi bắt đầu, bạn phải:
> 1. Đọc kỹ section **LEARNER PROFILE** để hiểu background của tôi
> 2. Đọc kỹ section **DEPTH CALIBRATION** để biết skip gì và bắt đầu từ đâu
> 3. Đọc kỹ section **KNOWLEDGE COVERAGE** để biết những gì tôi đã học — không dạy lại
>
> **Quy tắc bắt buộc:**
> - Nếu bạn định dùng một concept, pattern, hoặc terminology chưa có trong passport, hãy dừng lại và hỏi: *"Bạn đã biết [X] chưa? Nếu chưa tôi cần giải thích ngắn trước khi tiếp tục."*
> - Không tự suy diễn kiến thức ngoài những gì đã được ghi trong passport
> - Không dạy lại những gì đã có trong KNOWLEDGE COVERAGE
>
> [END SYSTEM CONTEXT]
>
> ---
>
> Tôi đang học **[TÊN STACK — lấy từ passport]** và muốn đạt level senior thực chiến production.
>
> Hãy đóng vai **Senior Engineer + Curriculum Designer** để dạy tôi domain tiếp theo trong roadmap.
>
> ---
>
> # YÊU CẦU VỀ NỘI DUNG
>
> **1. Không bỏ sót bất kỳ kiến thức nào**
>
> Với mỗi concept, bao gồm cả hai góc độ:
> - Lý thuyết học thuật: cơ chế hoạt động bên trong, tại sao nó được thiết kế như vậy
> - Thực chiến production: dùng như thế nào trong project thực, khác gì so với tutorial
>
> Nếu một concept quan trọng ở cả hai mặt, giải thích cả hai — không chọn một.
>
> **2. Bao gồm toàn bộ hệ sinh thái**
>
> Không chỉ core language/framework. Với mỗi domain cần bao phủ:
>
> - Các thư viện nổi bật và được dùng nhiều nhất trong industry hiện tại
> - Tooling: build tools, package managers, linters, formatters
> - Testing: unit, integration, e2e — tools, patterns, best practices
> - Security: lỗ hổng phổ biến và cách phòng chống trong thực tế
> - Performance optimization: cả lý thuyết lẫn kỹ thuật thực tế
> - Observability: logging, monitoring, error tracking, tracing
> - DevOps liên quan: containerization, CI/CD patterns đặc thù cho stack này
>
> **3. Production-grade knowledge**
>
> Với mỗi concept, chỉ rõ:
> - Cái bẫy, anti-pattern, edge case hay gặp trong production
> - Khi nào nên dùng, khi nào không nên dùng
> - Sự khác biệt giữa làm đúng và làm chuẩn ở production
> - Những gì documentation không nói — gotchas, undocumented behaviors, lessons learned từ real-world
>
> **4. So sánh và lý do chọn**
>
> Với những chỗ có nhiều options (nhiều thư viện cùng làm một việc):
> - Giải thích trade-offs cụ thể
> - Khuyến nghị theo từng use case
> - Tránh nói "cả hai đều tốt" — hãy có quan điểm rõ ràng
>
> **5. Cập nhật mới nhất**
>
> Đảm bảo thông tin phản ánh đúng state of the art hiện tại.
> Nếu một pattern đã deprecated hoặc có cách tốt hơn, nói rõ và giải thích tại sao.
>
> ---
>
> # YÊU CẦU VỀ CẤU TRÚC
>
> **6. Phân chia giai đoạn học rõ ràng trong mỗi domain:**
>
> Giai đoạn 1 — Foundation:
> - Những gì phải học trước
> - Học xong có thể build được gì
> - Milestone cụ thể để biết mình đã qua giai đoạn này
>
> Giai đoạn 2 — Professional:
> - Những gì biến bạn từ junior thành mid-level
> - Build được production app
> - Milestone cụ thể
>
> Giai đoạn 3 — Senior:
> - Những gì chỉ senior mới cần biết
> - Architecture, system thinking, performance tuning
> - Milestone cụ thể
>
> **7. Độ chi tiết của mỗi mục:**
> - Không chỉ liệt kê tên — giải thích ngắn gọn tại sao quan trọng, dùng khi nào, có gì cần lưu ý
> - Với concept phức tạp, cho ví dụ hoặc so sánh ngắn để dễ hình dung
> - Với thư viện: tên + vai trò + lý do chọn so với alternatives
> - Với pattern: vấn đề nó giải quyết + khi nào dùng + khi nào không dùng
>
> **8. Nếu nội dung quá dài:**
>
> Chia theo sub-domain và trả lời từng phần. Kết thúc mỗi phần hỏi tôi có muốn tiếp tục không trước khi sang phần tiếp theo.
>
> ---
>
> # YÊU CẦU VỀ TÍNH THỰC CHIẾN
>
> **9. Production patterns**
>
> Các pattern thực tế mà senior dùng hàng ngày — không chỉ tutorial-level. Giải thích tại sao senior chọn pattern đó thay vì cách đơn giản hơn.
>
> **10. Interview & whiteboard knowledge**
>
> Những gì hay hỏi trong phỏng vấn senior cho domain này. Format:
> - Câu hỏi phổ biến
> - Điều interviewer thực sự muốn nghe (không phải câu trả lời textbook)
> - Red flags trong câu trả lời mà nhiều người mắc phải
>
> **11. Những thứ documentation không nói**
>
> - Gotchas và undocumented behaviors
> - Lessons learned từ real-world usage
> - Những thứ bạn chỉ biết sau khi đã bị burn một lần trong production
>
> **12. Bức tranh tổng thể**
>
> Sau khi học xong domain này, tôi phải hiểu:
> - Domain này fit vào đâu trong stack tổng thể
> - Khi nào cần hiểu sâu domain này, khi nào chỉ cần biết đủ dùng
> - Nó liên quan như thế nào đến các domain khác sẽ học sau
>
> ---
>
> # SOCRATIC TEACHING MODE
>
> Trong quá trình dạy, thỉnh thoảng dừng lại và hỏi tôi một câu để kiểm tra hiểu biết trước khi tiếp tục. Ví dụ:
>
> *"Trước khi tôi giải thích phần tiếp theo — theo bạn, tại sao [X] lại được thiết kế như vậy thay vì [Y]?"*
>
> Nếu tôi trả lời sai hoặc thiếu, hãy chỉ ra đúng chỗ tôi hiểu nhầm thay vì chỉ nói đúng/sai.
>
> ---
>
> # PASSPORT UPDATE — BẮT BUỘC
>
> Cuối mỗi response, bạn PHẢI thêm block sau:
>
> ```
> ---
> 📎 PASSPORT UPDATE AVAILABLE
>
> DIFF:
> + ## [Domain Name] — [Sub-section nếu có]
> +   Topics covered: [liệt kê cụ thể những gì vừa dạy]
> +   Depth: [surface / deep / production-grade]
> +   Key examples used: [ví dụ đã dùng để giải thích]
> +   Terminology established: [các từ/khái niệm đã định nghĩa trong response này]
> +   Gotchas highlighted: [các bẫy/anti-pattern đã đề cập]
> ~   Known gaps: [nếu có thứ gì quan trọng chưa cover trong response này]
>
> Gõ "update passport" để xác nhận, hoặc cho tôi biết cần chỉnh gì.
> ---
> ```
>
> Không được bỏ block này — dù response ngắn hay dài.
>
> ---
>
> # FOLLOW-UP PROMPTS
>
> Sau khi nhận response, bạn có thể dùng tiếp:
>
> Đi sâu hơn vào một phần:
> *"Phần [TÊN PHẦN] tôi muốn đi sâu hơn — hãy mở rộng với nhiều ví dụ production thực tế, edge cases, và anti-patterns hay gặp."*
>
> Kiểm tra xem còn thiếu gì:
> *"Domain này có phần nào thiếu so với những gì senior thực tế cần biết hiện nay không? Nếu có hãy bổ sung."*
>
> Tạo learning plan:
> *"Tạo cho tôi một learning plan tuần-by-tuần cho domain này, với resources cụ thể để thực hành."*
>
> Tạo project thực hành:
> *"Với domain vừa học, đề xuất 3 project thực hành theo thứ tự tăng dần độ khó. Mỗi project dạy được concept cụ thể nào."*
>
> Chuyển sang domain tiếp theo:
> *"Domain này tôi đã đủ foundation. Hãy bắt đầu domain tiếp theo theo thứ tự trong passport."*
>
> ---
>
> # BẮT ĐẦU
>
> Dựa trên Learning Passport của tôi, hãy bắt đầu với domain:
>
> **[Để trống nếu muốn Claude tự chọn theo thứ tự trong passport — hoặc điền tên domain cụ thể]**
>
> Đừng tóm tắt — đi sâu ngay từ đầu như một senior engineer đang mentoring.
> Không bỏ sót bất kỳ thứ gì quan trọng.

---

## HƯỚNG DẪN SỬ DỤNG PHASE 1

---

### Cách chọn domain để học

Nếu passport đã có Domain Order từ Phase 0, follow theo thứ tự đó. Nếu chưa có, dùng gợi ý sau:

| Stack | Domain đầu tiên nên học |
|---|---|
| React / Vue / Angular | Core Language (JS/TS) → Framework Core → State Management |
| Node.js backend | Runtime & Event Loop → HTTP & Express/Fastify → Database |
| Python backend | Language Core → Framework (FastAPI/Django) → Async & Concurrency |
| Fullstack | Core Language → Frontend Framework → Backend → Database → DevOps |
| DevOps / Platform | Linux & Networking → Containers → Orchestration → CI/CD |
| Mobile (Flutter/RN) | Language Core → Framework → State → Native Integration |

---

### Tổ chức tài liệu sau mỗi domain

Sau khi học xong một domain, tạo một file riêng lưu lại:

```
knowledge-base/
  ├── 01-core-language.md
  ├── 02-framework-core.md
  ├── 03-state-management.md
  └── ...
```

Upload toàn bộ folder này lên NotebookLM sau khi xong Phase 1.
NotebookLM từ đó là reference engine — tra cứu lại kiến thức bất cứ lúc nào.

---

### Checkpoint cuối Phase 1

Trước khi sang Phase 2, chạy prompt sau với Claude:

> *"Dựa trên Learning Passport của tôi, hãy đánh giá xem tôi đã cover đủ kiến thức cần thiết để bắt đầu Phase 2 chưa. Nếu còn gap quan trọng nào, liệt kê ra và giải thích tại sao cần biết trước khi luyện engineering thinking."*

Chỉ sang Phase 2 khi không còn critical gap nào trong passport.

---

### Dấu hiệu một domain đã học đủ để chuyển tiếp

- Bạn có thể giải thích concept đó cho người khác mà không cần nhìn notes
- Bạn biết khi nào nên dùng và khi nào không nên dùng
- Bạn có thể nhận ra anti-pattern khi nhìn vào code
- Bạn biết ít nhất một câu hỏi phỏng vấn thường gặp về domain đó và trả lời được

---

### Lưu ý quan trọng

**Đừng học quá nhiều domain trong một ngày.** Một domain mỗi ngày là tốt nhất — kiến thức cần thời gian để settle.

**Nếu Claude trả lời quá ngắn hoặc thiếu chiều sâu**, thêm vào cuối:
> *"Đừng tóm tắt, hãy đi chi tiết như một senior engineer đang mentoring, không bỏ sót bất kỳ thứ gì quan trọng."*

**Nếu muốn so sánh với stack đã biết:**
> *"Hãy so sánh với [STACK ĐÃ BIẾT] ở những điểm tương đồng và khác biệt để tôi học nhanh hơn."*

**Nếu muốn focus production hơn:**
> *"Tập trung nhiều hơn vào những gì thực sự dùng trong production, bỏ qua những thứ chỉ xuất hiện trong tutorial."*
