# PHASE 1

## Deep Knowledge Roadmap

# MASTER PROMPT — SENIOR ROADMAP CHO BẤT KỲ TECH STACK NÀO

---

## PROMPT ĐẦY ĐỦ (copy nguyên)

---

> Tôi muốn học **[TÊN CÔNG NGHỆ / FRAMEWORK / NGÔN NGỮ]** từ đầu đến level senior thực chiến production.
>
> Hãy tạo cho tôi một roadmap đầy đủ nhất có thể theo các yêu cầu sau:
>
> ---
>
> **YÊU CẦU VỀ NỘI DUNG:**
>
> 1. **Không bỏ sót bất kỳ kiến thức nào** — bao gồm cả lý thuyết học thuật deep-dive lẫn thực chiến production. Nếu một khái niệm quan trọng ở cả hai mặt, hãy giải thích cả hai góc độ.
> 2. **Bao gồm toàn bộ hệ sinh thái** — không chỉ core language/framework mà còn:
>    - Các thư viện nổi bật và được dùng nhiều nhất trong industry hiện tại (cập nhật đến năm hiện tại)
>    - Tooling, build tools, package managers, linters, formatters
>    - Testing (unit, integration, e2e) — tools, patterns, best practices
>    - Security — các lỗ hổng phổ biến và cách phòng chống trong thực tế
>    - Performance optimization — cả lý thuyết lẫn kỹ thuật thực tế
>    - Observability — logging, monitoring, error tracking, tracing
>    - DevOps liên quan — containerization, CI/CD patterns đặc thù cho stack này
> 3. **Production-grade knowledge** — với mỗi kiến thức, hãy chỉ rõ:
>    - Cái bẫy, anti-pattern, edge case hay gặp trong production
>    - Khi nào nên dùng, khi nào không nên dùng
>    - Sự khác biệt giữa làm đúng và làm chuẩn ở production
> 4. **So sánh và lý do chọn** — với những chỗ có nhiều options (ví dụ nhiều thư viện cùng làm một việc), hãy giải thích trade-off và khuyến nghị cụ thể theo từng use case.
> 5. **Cập nhật mới nhất** — hãy search và đảm bảo thông tin phản ánh đúng state of the art năm hiện tại, không dùng kiến thức cũ hoặc deprecated patterns.
>
> ---
>
> **YÊU CẦU VỀ CẤU TRÚC:**
>
> 6. **Phân chia giai đoạn học rõ ràng:**
>    - Giai đoạn 1 — Foundation (0–3 tháng hoặc 0–6 tháng tuỳ độ phức tạp): những gì phải học trước, học xong có thể build được app thực tế cơ bản
>    - Giai đoạn 2 — Professional (tiếp theo): những gì biến bạn từ junior thành mid-level, build được production app
>    - Giai đoạn 3 — Senior (tiếp theo): những gì chỉ senior mới cần biết, architecture, system thinking, leading
>    - Với mỗi giai đoạn: nêu rõ mục tiêu đầu ra (bạn sẽ làm được gì sau khi hoàn thành)
> 7. **Nếu nội dung quá dài**, hãy tự động chia theo domain (ví dụ: Core Language, Framework, Database, DevOps, Architecture...) và trả lời từng domain một. Kết thúc mỗi domain hãy gợi ý domain tiếp theo.
> 8. **Độ chi tiết của mỗi mục:**
>    - Không chỉ liệt kê tên — giải thích ngắn gọn tại sao quan trọng, dùng khi nào, có gì cần lưu ý
>    - Với các concept phức tạp, cho ví dụ hoặc so sánh ngắn để dễ hình dung
>    - Với thư viện: tên + vai trò + lý do chọn so với alternatives
>
> ---
>
> **YÊU CẦU VỀ TÍNH THỰC CHIẾN:**
>
> 9. **Production patterns** — các pattern thực tế mà senior dùng hàng ngày, không chỉ tutorial-level
> 10. **Interview & whiteboard knowledge** — những gì hay hỏi trong phỏng vấn senior cho stack này
> 11. **Những thứ documentation không nói** — gotchas, undocumented behaviors, lessons learned từ real-world usage
> 12. **Bức tranh tổng thể** — sau khi học xong, tôi phải hiểu được stack này fit vào đâu trong bức tranh lớn của software engineering, khi nào nên chọn stack này, khi nào không
>
> ---
>
> **THÔNG TIN BỔ SUNG (điền nếu có):**
>
> - Tôi đã biết: **[liệt kê ngôn ngữ/framework đã biết]**
> - Mục tiêu dùng stack này để làm: **[web app / mobile / backend API / data processing / CLI / khác]**
> - Thời gian dự kiến học: **[X tháng / full-time / part-time]**
> - Ưu tiên: **[muốn đi nhanh vào production / muốn hiểu sâu lý thuyết / cân bằng cả hai]**
>
> ---
>
> Bắt đầu với **Domain đầu tiên quan trọng nhất** của stack này. Đừng tóm tắt — hãy đi sâu ngay từ đầu.

---

## HƯỚNG DẪN SỬ DỤNG PROMPT

---

**Điền vào chỗ trống, ví dụ:**

| Bạn muốn học          | Điền vào                                                          |
| --------------------- | ----------------------------------------------------------------- |
| Vue.js fullstack      | `Vue.js 3 + Nuxt.js + Pinia + Vite ecosystem`                     |
| Java backend          | `Java Spring Boot + Spring ecosystem + microservices`             |
| Python backend        | `Python FastAPI + SQLAlchemy + Celery + Python ecosystem`         |
| Laravel               | `PHP Laravel + Livewire + Inertia.js + Laravel ecosystem`         |
| Android               | `Kotlin + Jetpack Compose + Android ecosystem`                    |
| DevOps                | `Kubernetes + Docker + CI/CD + Cloud infrastructure (AWS/GCP)`    |
| Data Engineering      | `Python + Apache Spark + Airflow + dbt + data pipeline ecosystem` |
| Mobile cross-platform | `Flutter + Dart + state management + mobile ecosystem`            |

---

**Với phần "Tôi đã biết", ví dụ:**

- Nếu bạn biết React → AI sẽ draw parallels, giải thích khác biệt thay vì dạy từ số 0
- Nếu bạn biết JS → AI sẽ skip JS basics, focus vào paradigm mới
- Nếu bạn đã là senior một stack khác → AI sẽ đi nhanh hơn vào architecture level

---

**Các follow-up prompt sau khi nhận roadmap:**

Sau mỗi domain AI trả lời, bạn có thể dùng tiếp:

> _"Domain này có phần nào thiếu so với những gì senior thực tế cần biết trong năm hiện tại không? Nếu có hãy bổ sung, nếu không hãy viết lại full domain đó kèm giai đoạn học."_

> _"Phần [TÊN PHẦN] tôi muốn đi sâu hơn — hãy mở rộng với nhiều ví dụ production thực tế, edge cases, và anti-patterns hay gặp."_

> _"Tạo cho tôi một learning plan tuần-by-tuần cho giai đoạn 1 của roadmap này, với resources cụ thể (docs, repo, project ideas) để thực hành."_

> _"Với stack [TÊN STACK], hãy liệt kê 10 project thực tế theo thứ tự tăng dần độ khó — từ beginner đến senior level — mỗi project phải dạy được những concept cụ thể nào."_

---

**Lưu ý khi dùng:**

- Nếu AI trả lời quá ngắn hoặc thiếu chiều sâu, thêm vào cuối: _"Đừng tóm tắt, hãy đi chi tiết như một senior engineer đang mentoring, không bỏ sót bất kỳ thứ gì quan trọng."_
- Nếu muốn so sánh với stack bạn đã biết: _"Hãy so sánh với [STACK ĐÃ BIẾT] ở những điểm tương đồng và khác biệt để tôi học nhanh hơn."_
- Nếu muốn focus production hơn: _"Tập trung nhiều hơn vào những gì thực sự dùng trong production, bỏ qua những thứ chỉ dùng trong tutorial."_

---
