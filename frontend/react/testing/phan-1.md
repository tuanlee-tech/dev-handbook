# 🎓 Hướng Dẫn Testing cho React TypeScript - Dành Cho Người Mới Bắt Đầu

## 📚 Mục Lục

1. [Testing là gì?](#1-testing-là-gì)
2. [Cài đặt và cấu hình](#2-cài-đặt-và-cấu-hình)
3. [Các hàm cơ bản](#3-các-hàm-cơ-bản)
4. [Viết test đầu tiên](#4-viết-test-đầu-tiên)
5. [Testing components](#5-testing-components)
6. [Testing hooks](#6-testing-hooks)
7. [Mocking](#7-mocking)
8. [Best practices](#8-best-practices)

---

## 1. Testing là gì?

### 1.1 Khái niệm cơ bản

**Testing** = Kiểm tra code của bạn có hoạt động đúng không

Ví dụ đời thường:

```
Bạn viết function cộng 2 số:
function add(a, b) {
  return a + b
}

Testing là viết code để kiểm tra:
- add(2, 3) có = 5 không?
- add(0, 0) có = 0 không?
- add(-1, 1) có = 0 không?
```

### 1.2 Tại sao cần testing?

✅ **Phát hiện lỗi sớm** - Tìm bug trước khi user thấy  
✅ **Refactor an toàn** - Sửa code không sợ làm hỏng  
✅ **Tài liệu sống** - Tests giải thích code làm gì  
✅ **Tự tin deploy** - Biết code đang hoạt động tốt

### 1.3 Các loại test

```
┌─────────────────────────────────┐
│  E2E Tests (Ít)                 │ ← Test toàn bộ app (chậm, đắt)
│  - Test như user thật           │
├─────────────────────────────────┤
│  Integration Tests (Vừa)        │ ← Test nhiều phần cùng lúc
│  - Test components + API        │
├─────────────────────────────────┤
│  Unit Tests (Nhiều)             │ ← Test từng phần nhỏ (nhanh, rẻ)
│  - Test functions, components   │
└─────────────────────────────────┘
```

**Trong khóa này:** Chúng ta tập trung vào **Unit Tests** và **Integration Tests**

---

## 2. Cài Đặt và Cấu Hình

### 2.1 Vitest là gì? Jest là gì?

**Vitest** và **Jest** là 2 công cụ (test runners) giúp bạn chạy tests.

**Giống nhau:**

-   Cùng mục đích: chạy tests
-   Syntax gần giống nhau (học 1 biết 2)
-   Đều dùng cho React

**Khác nhau:**

-   **Vitest**: Mới hơn, nhanh hơn, tích hợp tốt với Vite
-   **Jest**: Cũ hơn, phổ biến hơn, nhiều tài liệu hơn

**Nên chọn cái nào?**

-   Dùng Vite → chọn Vitest
-   Dùng Create React App → chọn Jest
-   Không biết chọn gì → chọn Vitest (xu hướng hiện tại)

### 2.2 Cài đặt Vitest (Khuyên dùng)

**Bước 1: Cài packages**

```bash
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jsdom
```

**Giải thích các packages:**

-   `vitest` - Công cụ chạy tests
-   `@vitest/ui` - Giao diện web xem kết quả tests
-   `@testing-library/react` - Thư viện test React components
-   `@testing-library/jest-dom` - Thêm các hàm kiểm tra cho DOM
-   `@testing-library/user-event` - Giả lập user click, type...
-   `jsdom` - Giả lập browser trong Node.js

**Bước 2: Tạo file cấu hình `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],

    // ↓ Phần này dành cho testing
    test: {
        globals: true, // Cho phép dùng describe, it, expect không cần import
        environment: 'jsdom', // Giả lập browser
        setupFiles: './src/test/setup.ts', // File chạy trước mỗi test
        css: true, // Support CSS trong tests
    },
});
```

**Giải thích từng dòng:**

```typescript
test: {
  // globals: true
  // → Có thể dùng describe(), it(), expect() mà không cần import
  // Nếu false: phải import { describe, it, expect } from 'vitest'
  globals: true,

  // environment: 'jsdom'
  // → Tạo môi trường giả browser (có window, document...)
  // Vì Node.js không có DOM
  environment: 'jsdom',

  // setupFiles: './src/test/setup.ts'
  // → File này chạy TRƯỚC MỖI test
  // Thường dùng để setup chung cho tất cả tests
  setupFiles: './src/test/setup.ts',

  // css: true
  // → Cho phép import CSS trong components khi test
  css: true,
}
```

**Bước 3: Tạo file `src/test/setup.ts`**

```typescript
// Import thư viện này để có thêm nhiều hàm kiểm tra
// Ví dụ: toBeInTheDocument(), toHaveClass()...
import '@testing-library/jest-dom';

// Import hàm cleanup để dọn dẹp sau mỗi test
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// afterEach() = sau mỗi test
// cleanup() = xóa components đã render trong test trước
afterEach(() => {
    cleanup();
});
```

**Bước 4: Thêm scripts vào `package.json`**

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build",

        "test": "vitest", // ← Chạy tests (watch mode)
        "test:ui": "vitest --ui", // ← Mở giao diện web
        "test:run": "vitest run", // ← Chạy 1 lần rồi thoát
        "test:coverage": "vitest --coverage" // ← Xem độ phủ code
    }
}
```

**Giải thích:**

-   `npm run test` - Chạy tests và tự động chạy lại khi sửa code
-   `npm run test:ui` - Mở browser xem kết quả tests đẹp hơn
-   `npm run test:run` - Chạy 1 lần (dùng trong CI/CD)
-   `npm run test:coverage` - Xem % code được test

### 2.3 Cài đặt Jest (Tùy chọn)

**Bước 1: Cài packages**

```bash
npm install -D jest @types/jest ts-jest
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jest-environment-jsdom
```

**Bước 2: Tạo file `jest.config.js`**

```javascript
module.exports = {
    // preset: 'ts-jest'
    // → Cho Jest hiểu TypeScript
    preset: 'ts-jest',

    // testEnvironment: 'jsdom'
    // → Giả lập browser
    testEnvironment: 'jsdom',

    // setupFilesAfterEnv
    // → File chạy sau khi setup môi trường test
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

    // moduleNameMapper
    // → Xử lý CSS imports (vì Jest không hiểu CSS)
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },

    // transform
    // → Chuyển .ts/.tsx sang JavaScript
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
```

**Bước 3: File setup giống Vitest**

**Bước 4: Scripts trong `package.json`**

```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
    }
}
```

---

## 3. Các Hàm Cơ Bản

### 3.1 Cấu trúc một test

```typescript
// Import từ vitest
import { describe, it, expect } from 'vitest';

// describe() = Nhóm các tests liên quan
// ↓ Tham số 1: Tên nhóm (string)
// ↓ Tham số 2: Function chứa các tests
describe('Tên nhóm tests', () => {
    // it() hoặc test() = Một test case
    // ↓ Tham số 1: Mô tả test làm gì (string)
    // ↓ Tham số 2: Function chứa test logic
    it('mô tả test này làm gì', () => {
        // expect() = Kiểm tra giá trị
        // ↓ Tham số: Giá trị cần kiểm tra
        expect(giá_trị).toBe(giá_trị_mong_đợi);
    });
});
```

**Ví dụ thực tế:**

```typescript
import { describe, it, expect } from 'vitest';

// Nhóm tests cho phép tính toán
describe('Math operations', () => {
    // Test cộng
    it('cộng 2 số đúng', () => {
        const result = 2 + 3;
        expect(result).toBe(5); // Kiểm tra result = 5
    });

    // Test nhân
    it('nhân 2 số đúng', () => {
        const result = 2 * 3;
        expect(result).toBe(6); // Kiểm tra result = 6
    });
});
```

### 3.2 Các hàm chính trong Vitest/Jest

#### A. Tổ chức tests

```typescript
// describe(name, fn)
// Mục đích: Nhóm các tests lại với nhau
// Khi dùng: Khi có nhiều tests liên quan đến 1 component/function
describe('Button Component', () => {
    // Các tests về Button
});

// it(name, fn) hoặc test(name, fn)
// Mục đích: Định nghĩa 1 test case
// Khi dùng: Mỗi behavior cần test
it('hiển thị text đúng', () => {
    // Test code
});

// it.only() - Chỉ chạy test này, skip các tests khác
// Khi dùng: Debug 1 test cụ thể
it.only('test này chạy thôi', () => {});

// it.skip() - Bỏ qua test này
// Khi dùng: Test đang bị lỗi, chưa fix được
it.skip('test này skip', () => {});

// it.todo() - Đánh dấu test cần viết
// Khi dùng: Nhắc mình phải viết test này
it.todo('cần viết test cho feature X');
```

#### B. Lifecycle hooks (Chạy trước/sau tests)

```typescript
import { beforeAll, beforeEach, afterEach, afterAll } from 'vitest';

describe('User API', () => {
    // beforeAll(fn)
    // Chạy 1 LẦN TRƯỚC TẤT CẢ tests trong describe này
    // Khi dùng: Setup database, khởi tạo connection...
    beforeAll(() => {
        console.log('Chạy 1 lần trước tất cả tests');
        // Ví dụ: Connect database
    });

    // beforeEach(fn)
    // Chạy TRƯỚC MỖI test
    // Khi dùng: Reset data, tạo fresh state...
    beforeEach(() => {
        console.log('Chạy trước MỖI test');
        // Ví dụ: Clear localStorage, reset mocks
    });

    // afterEach(fn)
    // Chạy SAU MỖI test
    // Khi dùng: Cleanup, xóa dữ liệu test...
    afterEach(() => {
        console.log('Chạy sau MỖI test');
        // Ví dụ: Unmount components, clear timers
    });

    // afterAll(fn)
    // Chạy 1 LẦN SAU TẤT CẢ tests
    // Khi dùng: Đóng connections, cleanup toàn bộ...
    afterAll(() => {
        console.log('Chạy 1 lần sau tất cả tests');
        // Ví dụ: Close database connection
    });

    it('test 1', () => {});
    it('test 2', () => {});
});
```

**Thứ tự chạy:**

```
beforeAll()
  → beforeEach() → test 1 → afterEach()
  → beforeEach() → test 2 → afterEach()
afterAll()
```

#### C. Assertions (Kiểm tra giá trị)

```typescript
import { expect } from 'vitest';

// ============ SO SÁNH GIÁ TRỊ ============

// toBe(value) - So sánh bằng === (strict equality)
// Khi dùng: Numbers, strings, booleans
expect(5).toBe(5); // ✅ Pass
expect('hello').toBe('hello'); // ✅ Pass
expect({ a: 1 }).toBe({ a: 1 }); // ❌ Fail (khác object reference)

// toEqual(value) - So sánh deep equality (nội dung giống nhau)
// Khi dùng: Objects, arrays
expect({ a: 1 }).toEqual({ a: 1 }); // ✅ Pass
expect([1, 2]).toEqual([1, 2]); // ✅ Pass

// not.toBe() - Phủ định (không bằng)
expect(5).not.toBe(10); // ✅ Pass

// ============ KIỂM TRA TRUTHY/FALSY ============

// toBeTruthy() - Giá trị truthy (true, 1, 'text', []...)
expect(true).toBeTruthy(); // ✅
expect(1).toBeTruthy(); // ✅
expect('hello').toBeTruthy(); // ✅

// toBeFalsy() - Giá trị falsy (false, 0, '', null, undefined)
expect(false).toBeFalsy(); // ✅
expect(0).toBeFalsy(); // ✅
expect('').toBeFalsy(); // ✅

// toBeNull() - Giá trị null
expect(null).toBeNull(); // ✅

// toBeUndefined() - Giá trị undefined
expect(undefined).toBeUndefined(); // ✅

// toBeDefined() - Giá trị khác undefined
expect(5).toBeDefined(); // ✅
expect(null).toBeDefined(); // ✅ (null khác undefined)

// ============ SO SÁNH SỐ ============

// toBeGreaterThan(number) - Lớn hơn
expect(10).toBeGreaterThan(5); // ✅

// toBeGreaterThanOrEqual(number) - Lớn hơn hoặc bằng
expect(10).toBeGreaterThanOrEqual(10); // ✅

// toBeLessThan(number) - Nhỏ hơn
expect(5).toBeLessThan(10); // ✅

// toBeLessThanOrEqual(number) - Nhỏ hơn hoặc bằng
expect(5).toBeLessThanOrEqual(5); // ✅

// toBeCloseTo(number, digits) - Gần bằng (cho số thập phân)
// Khi dùng: Tính toán floating point
expect(0.1 + 0.2).toBeCloseTo(0.3); // ✅

// ============ STRINGS ============

// toMatch(regex) - Khớp với regex
expect('hello world').toMatch(/world/); // ✅
expect('abc123').toMatch(/\d+/); // ✅

// toContain(substring) - Chứa chuỗi con
expect('hello world').toContain('world'); // ✅

// ============ ARRAYS ============

// toContain(item) - Array chứa item
expect([1, 2, 3]).toContain(2); // ✅

// toHaveLength(number) - Array có độ dài
expect([1, 2, 3]).toHaveLength(3); // ✅

// ============ OBJECTS ============

// toHaveProperty(key) - Object có key
expect({ name: 'John' }).toHaveProperty('name'); // ✅

// toHaveProperty(key, value) - Object có key với value
expect({ name: 'John' }).toHaveProperty('name', 'John'); // ✅

// toMatchObject(object) - Object chứa các properties
expect({ name: 'John', age: 30 }).toMatchObject({ name: 'John' }); // ✅ (không cần check hết keys)

// ============ FUNCTIONS ============

// toThrow() - Function throw error
const errorFn = () => {
    throw new Error('Lỗi!');
};
expect(errorFn).toThrow(); // ✅
expect(errorFn).toThrow('Lỗi!'); // ✅ Check message

// toHaveBeenCalled() - Function đã được gọi (dùng với mock)
const mockFn = vi.fn();
mockFn();
expect(mockFn).toHaveBeenCalled(); // ✅

// toHaveBeenCalledTimes(number) - Function được gọi n lần
mockFn();
mockFn();
expect(mockFn).toHaveBeenCalledTimes(2); // ✅

// toHaveBeenCalledWith(args) - Function được gọi với args
mockFn('hello', 123);
expect(mockFn).toHaveBeenCalledWith('hello', 123); // ✅
```

**Khi nào dùng cái nào?**

| Tình huống                  | Hàm dùng                              |
| --------------------------- | ------------------------------------- |
| So sánh số, string, boolean | `toBe()`                              |
| So sánh object, array       | `toEqual()`                           |
| Check null/undefined        | `toBeNull()`, `toBeUndefined()`       |
| Check có value hay không    | `toBeDefined()`, `toBeTruthy()`       |
| So sánh số (>, <, >=, <=)   | `toBeGreaterThan()`, `toBeLessThan()` |
| Check số thập phân          | `toBeCloseTo()`                       |
| Check string chứa text      | `toContain()`, `toMatch()`            |
| Check array chứa item       | `toContain()`                         |
| Check object có property    | `toHaveProperty()`                    |
| Check function throw error  | `toThrow()`                           |
| Check function đã gọi chưa  | `toHaveBeenCalled()`                  |

### 3.3 Mock Functions

```typescript
import { vi } from 'vitest'; // hoặc { jest } từ '@jest/globals' với Jest

// vi.fn() - Tạo mock function
// Mục đích: Theo dõi function được gọi như thế nào
// Khi dùng: Test callbacks, event handlers

const mockFn = vi.fn();

// Gọi function
mockFn('arg1', 'arg2');
mockFn('arg3');

// Kiểm tra
expect(mockFn).toHaveBeenCalled(); // Đã được gọi
expect(mockFn).toHaveBeenCalledTimes(2); // Gọi 2 lần
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2'); // Gọi với args này
expect(mockFn).toHaveBeenLastCalledWith('arg3'); // Lần cuối gọi với arg3

// mockReturnValue() - Set giá trị return
// Khi dùng: Function cần return giá trị cụ thể
const mockFn2 = vi.fn().mockReturnValue(42);
console.log(mockFn2()); // 42

// mockReturnValueOnce() - Set return cho lần gọi kế tiếp
// Khi dùng: Return khác nhau mỗi lần gọi
const mockFn3 = vi
    .fn()
    .mockReturnValueOnce(1) // Lần 1 return 1
    .mockReturnValueOnce(2) // Lần 2 return 2
    .mockReturnValue(3); // Các lần sau return 3

console.log(mockFn3()); // 1
console.log(mockFn3()); // 2
console.log(mockFn3()); // 3

// mockResolvedValue() - Return Promise resolved
// Khi dùng: Mock async functions thành công
const mockAsync = vi.fn().mockResolvedValue('success');
await mockAsync(); // Promise -> 'success'

// mockRejectedValue() - Return Promise rejected
// Khi dùng: Mock async functions thất bại
const mockAsyncError = vi.fn().mockRejectedValue(new Error('Fail'));
await mockAsyncError(); // Promise -> Error

// mockImplementation() - Tự định nghĩa logic
// Khi dùng: Mock function phức tạp
const mockFn4 = vi.fn().mockImplementation((x) => x * 2);
console.log(mockFn4(5)); // 10

// mockClear() - Xóa lịch sử gọi function
mockFn.mockClear();

// mockReset() - Xóa lịch sử + implementation
mockFn.mockReset();

// mockRestore() - Khôi phục function gốc (dùng với spy)
```

**Ví dụ thực tế:**

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Mock Function Examples', () => {
    it('tracks button clicks', () => {
        const handleClick = vi.fn();

        // Giả sử component gọi handleClick 3 lần
        handleClick();
        handleClick();
        handleClick();

        expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('mocks API call success', async () => {
        const fetchUser = vi.fn().mockResolvedValue({
            id: 1,
            name: 'John',
        });

        const user = await fetchUser(1);

        expect(user.name).toBe('John');
        expect(fetchUser).toHaveBeenCalledWith(1);
    });

    it('mocks API call failure', async () => {
        const fetchUser = vi.fn().mockRejectedValue(new Error('404'));

        await expect(fetchUser(999)).rejects.toThrow('404');
    });
});
```

---

## 4. Viết Test Đầu Tiên

### 4.1 Test function đơn giản

**Tạo file `src/utils/math.ts`:**

```typescript
// Function cộng 2 số
export function add(a: number, b: number): number {
    return a + b;
}

// Function trừ 2 số
export function subtract(a: number, b: number): number {
    return a - b;
}

// Function kiểm tra số chẵn
export function isEven(num: number): boolean {
    return num % 2 === 0;
}
```

**Tạo file test `src/utils/math.test.ts`:**

```typescript
// Import các hàm cần test
import { describe, it, expect } from 'vitest';
import { add, subtract, isEven } from './math';

// Nhóm tests cho math utils
describe('Math Utils', () => {
    // Test function add
    describe('add()', () => {
        it('cộng 2 số dương', () => {
            const result = add(2, 3);
            expect(result).toBe(5);
        });

        it('cộng số âm', () => {
            expect(add(-1, -2)).toBe(-3);
        });

        it('cộng với 0', () => {
            expect(add(5, 0)).toBe(5);
        });
    });

    // Test function subtract
    describe('subtract()', () => {
        it('trừ 2 số', () => {
            expect(subtract(5, 3)).toBe(2);
        });

        it('trừ ra số âm', () => {
            expect(subtract(3, 5)).toBe(-2);
        });
    });

    // Test function isEven
    describe('isEven()', () => {
        it('trả về true cho số chẵn', () => {
            expect(isEven(2)).toBe(true);
            expect(isEven(4)).toBe(true);
            expect(isEven(0)).toBe(true);
        });

        it('trả về false cho số lẻ', () => {
            expect(isEven(1)).toBe(false);
            expect(isEven(3)).toBe(false);
        });
    });
});
```

**Chạy test:**

```bash
npm run test
```

**Kết quả:**

```
✓ Math Utils (6)
  ✓ add()
    ✓ cộng 2 số dương
    ✓ cộng số âm
    ✓ cộng với 0
  ✓ subtract()
    ✓ trừ 2 số
    ✓ trừ ra số âm
  ✓ isEven()
    ✓ trả về true cho số chẵn
    ✓ trả về false cho số lẻ

Test Files  1 passed (1)
     Tests  6 passed (6)
```

---

## 5. Testing Components

### 5.1 Testing Library là gì?

**Testing Library** giúp bạn test React components như user sử dụng:

-   Tìm elements bằng text, label, role...
-   Giả lập click, type, submit...
-   Kiểm tra element có hiển thị không

**Các hàm chính:**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// render(component)
// Mục đích: Render component vào DOM ảo
// Khi dùng: Đầu mỗi test component
render(<Button label='Click' />);

// screen - Object để tìm elements
// Có 3 loại queries:

// 1. getBy* - Tìm element, throw error nếu không có
// Khi dùng: Element PHẢI có trong DOM
screen.getByText('Hello'); // Tìm theo text
screen.getByRole('button'); // Tìm theo role (button, link...)
screen.getByLabelText('Email'); // Tìm theo label của input
screen.getByPlaceholderText('Enter email'); // Tìm theo placeholder
screen.getByTestId('custom-element'); // Tìm theo data-testid

// 2. queryBy* - Tìm element, return null nếu không có
// Khi dùng: Kiểm tra element KHÔNG tồn tại
const button = screen.queryByText('Not exist'); // null nếu không có

// 3. findBy* - Tìm element async (đợi element xuất hiện)
// Khi dùng: Element xuất hiện sau (loading, async...)
const button = await screen.findByText('Loaded'); // Đợi tối đa 1s

// userEvent - Giả lập user interactions
const user = userEvent.setup();

// click(element) - Click vào element
await user.click(screen.getByRole('button'));

// type(element, text) - Gõ text vào input
await user.type(screen.getByRole('textbox'), 'Hello');

// clear(element) - Xóa text trong input
await user.clear(screen.getByRole('textbox'));

// selectOptions(select, value) - Chọn option trong select
await user.selectOptions(screen.getByRole('combobox'), 'option1');

// upload(input, file) - Upload file
const file = new File(['content'], 'test.png');
await user.upload(screen.getByLabelText('Upload'), file);
```

### 5.2 Test component đơn giản

**Component: `src/components/Button.tsx`**

```typescript
interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
    return (
        <button onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
}
```

**Test: `src/components/Button.test.tsx`**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
    // Test 1: Component hiển thị đúng text
    it('hiển thị label đúng', () => {
        // Render component
        render(<Button label='Click me' onClick={() => {}} />);

        // Tìm button và kiểm tra text
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Click me');

        // Hoặc tìm trực tiếp bằng text
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    // Test 2: Click vào button
    it('gọi onClick khi click', async () => {
        // Tạo mock function để theo dõi
        const handleClick = vi.fn();

        // Setup user event
        const user = userEvent.setup();

        // Render component với mock function
        render(<Button label='Click me' onClick={handleClick} />);

        // Tìm button
        const button = screen.getByRole('button');

        // Click vào button
        await user.click(button);

        // Kiểm tra onClick đã được gọi
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test 3: Button disabled
    it('bị disabled khi truyền prop disabled', () => {
        render(<Button label='Click me' onClick={() => {}} disabled />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    // Test 4: Button không gọi onClick khi disabled
    it('không gọi onClick khi disabled', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button label='Click' onClick={handleClick} disabled />);

        const button = screen.getByRole('button');
        await user.click(button);

        // onClick KHÔNG được gọi vì button bị disabled
        expect(handleClick).not.toHaveBeenCalled();
    });
});
```

**Giải thích từng bước:**

```typescript
// Bước 1: Import
import { describe, it, expect, vi } from 'vitest';
// → Import testing functions

import { render, screen } from '@testing-library/react';
// → render: render component
// → screen: tìm elements trong DOM

import userEvent from '@testing-library/user-event';
// → Giả lập user interactions (click, type...)

import { Button } from './Button';
// → Import component cần test

// Bước 2: Describe block
describe('Button Component', () => {
    // Nhóm tất cả tests về Button
});

// Bước 3: Test case
it('hiển thị label đúng', () => {
    // 3.1 Arrange (Chuẩn bị)
    render(<Button label='Click me' onClick={() => {}} />);

    // 3.2 Act (Thực hiện - không có trong test này)

    // 3.3 Assert (Kiểm tra)
    expect(screen.getByText('Click me')).toBeInTheDocument();
});

// Bước 4: Test với interaction
it('gọi onClick khi click', async () => {
    // ← Lưu ý: async function vì user.click() là async

    // 4.1 Chuẩn bị mock function
    const handleClick = vi.fn();

    // 4.2 Chuẩn bị user event
    const user = userEvent.setup();

    // 4.3 Render component
    render(<Button label='Click me' onClick={handleClick} />);

    // 4.4 Tìm element
    const button = screen.getByRole('button');

    // 4.5 Thực hiện action
    await user.click(button);
    // ← Lưu ý: await vì user.click() return Promise

    // 4.6 Kiểm tra kết quả
    expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 5.3 Test component có state

**Component: `src/components/Counter.tsx`**

```typescript
import { useState } from 'react';

interface CounterProps {
    initialCount?: number;
}

export function Counter({ initialCount = 0 }: CounterProps) {
    const [count, setCount] = useState(initialCount);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Tăng</button>
            <button onClick={() => setCount(count - 1)}>Giảm</button>
            <button onClick={() => setCount(initialCount)}>Reset</button>
        </div>
    );
}
```

**Test: `src/components/Counter.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter Component', () => {
    it('hiển thị count ban đầu', () => {
        render(<Counter initialCount={5} />);

        // Tìm element chứa text "Count: 5"
        expect(screen.getByText('Count: 5')).toBeInTheDocument();
    });

    it('tăng count khi click nút Tăng', async () => {
        const user = userEvent.setup();

        render(<Counter initialCount={0} />);

        // Tìm nút Tăng
        const increaseBtn = screen.getByText('Tăng');

        // Click 1 lần
        await user.click(increaseBtn);

        // Kiểm tra count = 1
        expect(screen.getByText('Count: 1')).toBeInTheDocument();

        // Click thêm 1 lần nữa
        await user.click(increaseBtn);

        // Kiểm tra count = 2
        expect(screen.getByText('Count: 2')).toBeInTheDocument();
    });

    it('giảm count khi click nút Giảm', async () => {
        const user = userEvent.setup();

        render(<Counter initialCount={10} />);

        const decreaseBtn = screen.getByText('Giảm');
        await user.click(decreaseBtn);

        expect(screen.getByText('Count: 9')).toBeInTheDocument();
    });

    it('reset về giá trị ban đầu', async () => {
        const user = userEvent.setup();

        render(<Counter initialCount={5} />);

        // Tăng count lên
        const increaseBtn = screen.getByText('Tăng');
        await user.click(increaseBtn);
        await user.click(increaseBtn);

        // Lúc này count = 7
        expect(screen.getByText('Count: 7')).toBeInTheDocument();

        // Click reset
        const resetBtn = screen.getByText('Reset');
        await user.click(resetBtn);

        // Count trở về 5
        expect(screen.getByText('Count: 5')).toBeInTheDocument();
    });
});
```

### 5.4 Test form với input

**Component: `src/components/LoginForm.tsx`**

```typescript
import { useState, FormEvent } from 'react';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Validation đơn giản
        if (!email || !password) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!email.includes('@')) {
            setError('Email không hợp lệ');
            return;
        }

        // Clear error và gọi onSubmit
        setError('');
        onSubmit(email, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='email'>Email</label>
                <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor='password'>Password</label>
                <input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <div role='alert'>{error}</div>}

            <button type='submit'>Đăng nhập</button>
        </form>
    );
}
```

**Test: `src/components/LoginForm.test.tsx`**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm Component', () => {
    it('render form fields', () => {
        render(<LoginForm onSubmit={() => {}} />);

        // Kiểm tra có input email
        expect(screen.getByLabelText('Email')).toBeInTheDocument();

        // Kiểm tra có input password
        expect(screen.getByLabelText('Password')).toBeInTheDocument();

        // Kiểm tra có button submit
        expect(
            screen.getByRole('button', { name: /đăng nhập/i })
        ).toBeInTheDocument();
    });

    it('hiển thị lỗi khi submit form rỗng', async () => {
        const user = userEvent.setup();

        render(<LoginForm onSubmit={() => {}} />);

        // Click submit mà không điền gì
        const submitBtn = screen.getByRole('button', { name: /đăng nhập/i });
        await user.click(submitBtn);

        // Kiểm tra error xuất hiện
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Vui lòng điền đầy đủ'
        );
    });

    it('hiển thị lỗi khi email không hợp lệ', async () => {
        const user = userEvent.setup();

        render(<LoginForm onSubmit={() => {}} />);

        // Nhập email không có @
        const emailInput = screen.getByLabelText('Email');
        await user.type(emailInput, 'invalid-email');

        // Nhập password
        const passwordInput = screen.getByLabelText('Password');
        await user.type(passwordInput, 'password123');

        // Submit
        await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

        // Kiểm tra error
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Email không hợp lệ'
        );
    });

    it('gọi onSubmit với data đúng khi form hợp lệ', async () => {
        const user = userEvent.setup();
        const mockSubmit = vi.fn();

        render(<LoginForm onSubmit={mockSubmit} />);

        // Nhập email
        await user.type(screen.getByLabelText('Email'), 'test@example.com');

        // Nhập password
        await user.type(screen.getByLabelText('Password'), 'password123');

        // Submit
        await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

        // Kiểm tra onSubmit được gọi với đúng args
        expect(mockSubmit).toHaveBeenCalledTimes(1);
        expect(mockSubmit).toHaveBeenCalledWith(
            'test@example.com',
            'password123'
        );

        // Không có error
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('user có thể xóa và nhập lại', async () => {
        const user = userEvent.setup();

        render(<LoginForm onSubmit={() => {}} />);

        const emailInput = screen.getByLabelText('Email');

        // Nhập text
        await user.type(emailInput, 'wrong@email.com');
        expect(emailInput).toHaveValue('wrong@email.com');

        // Xóa hết
        await user.clear(emailInput);
        expect(emailInput).toHaveValue('');

        // Nhập lại
        await user.type(emailInput, 'correct@email.com');
        expect(emailInput).toHaveValue('correct@email.com');
    });
});
```

**Các queries quan trọng:**

```typescript
// ============ TÌM THEO ROLE ============
// Ưu tiên cao nhất - giống cách user nhìn thấy

screen.getByRole('button'); // <button>
screen.getByRole('button', { name: 'Submit' }); // Button có text "Submit"
screen.getByRole('textbox'); // <input type="text">
screen.getByRole('checkbox'); // <input type="checkbox">
screen.getByRole('combobox'); // <select>
screen.getByRole('link'); // <a>
screen.getByRole('heading'); // <h1>, <h2>...
screen.getByRole('alert'); // Element có role="alert"

// ============ TÌM THEO LABEL ============
// Dùng cho form inputs

screen.getByLabelText('Email'); // Input có label "Email"
// → Tìm <input> được link với <label>Email</label>

// ============ TÌM THEO TEXT ============
// Dùng cho text content

screen.getByText('Hello'); // Element chứa text "Hello"
screen.getByText(/hello/i); // Regex, case insensitive

// ============ TÌM THEO PLACEHOLDER ============
screen.getByPlaceholderText('Enter email');

// ============ TÌM THEO TEST ID ============
// Dùng cuối cùng khi không tìm được cách khác

screen.getByTestId('custom-element');
// → Cần thêm data-testid="custom-element" vào JSX
```

---

## 6. Testing Hooks

### 6.1 renderHook - Test custom hooks

**Hook: `src/hooks/useToggle.ts`**

```typescript
import { useState, useCallback } from 'react';

export function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue((v) => !v);
    }, []);

    const setTrue = useCallback(() => {
        setValue(true);
    }, []);

    const setFalse = useCallback(() => {
        setValue(false);
    }, []);

    return { value, toggle, setTrue, setFalse };
}
```

**Test: `src/hooks/useToggle.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

describe('useToggle Hook', () => {
    it('khởi tạo với giá trị mặc định false', () => {
        // renderHook() - Render hook trong test environment
        // Trả về { result } chứa giá trị return của hook
        const { result } = renderHook(() => useToggle());

        // result.current - Giá trị hiện tại của hook
        expect(result.current.value).toBe(false);
    });

    it('khởi tạo với giá trị custom', () => {
        const { result } = renderHook(() => useToggle(true));

        expect(result.current.value).toBe(true);
    });

    it('toggle value từ false sang true', () => {
        const { result } = renderHook(() => useToggle(false));

        // act() - Wrap code thay đổi state
        // Đảm bảo React cập nhật state trước khi kiểm tra
        act(() => {
            result.current.toggle();
        });

        expect(result.current.value).toBe(true);
    });

    it('toggle value từ true sang false', () => {
        const { result } = renderHook(() => useToggle(true));

        act(() => {
            result.current.toggle();
        });

        expect(result.current.value).toBe(false);
    });

    it('toggle nhiều lần', () => {
        const { result } = renderHook(() => useToggle(false));

        // false → true
        act(() => {
            result.current.toggle();
        });
        expect(result.current.value).toBe(true);

        // true → false
        act(() => {
            result.current.toggle();
        });
        expect(result.current.value).toBe(false);

        // false → true
        act(() => {
            result.current.toggle();
        });
        expect(result.current.value).toBe(true);
    });

    it('set value thành true', () => {
        const { result } = renderHook(() => useToggle(false));

        act(() => {
            result.current.setTrue();
        });

        expect(result.current.value).toBe(true);
    });

    it('set value thành false', () => {
        const { result } = renderHook(() => useToggle(true));

        act(() => {
            result.current.setFalse();
        });

        expect(result.current.value).toBe(false);
    });
});
```

**Giải thích:**

```typescript
// renderHook(() => useToggle())
// ↓
// Tạo component ẩn để chạy hook:
// function TestComponent() {
//   const result = useToggle()
//   return null
// }

const { result } = renderHook(() => useToggle());
// result.current = giá trị return của hook

// act(() => { ... })
// ↓
// Wrap code làm thay đổi state
// React sẽ:
// 1. Chạy code trong act()
// 2. Cập nhật state
// 3. Re-render
// 4. Sau đó mới tiếp tục test

act(() => {
    result.current.toggle(); // Thay đổi state
});
// State đã updated ở đây ↓
expect(result.current.value).toBe(true);
```

### 6.2 Test hook với dependencies

**Hook: `src/hooks/useCounter.ts`**

```typescript
import { useState, useCallback } from 'react';

export function useCounter(initialValue = 0, step = 1) {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => {
        setCount((c) => c + step);
    }, [step]);

    const decrement = useCallback(() => {
        setCount((c) => c - step);
    }, [step]);

    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);

    return { count, increment, decrement, reset };
}
```

**Test: `src/hooks/useCounter.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter Hook', () => {
    it('increment theo step', () => {
        const { result } = renderHook(() => useCounter(0, 5));

        act(() => {
            result.current.increment();
        });

        // Tăng 5 (step = 5)
        expect(result.current.count).toBe(5);

        act(() => {
            result.current.increment();
        });

        // Tăng thêm 5 nữa
        expect(result.current.count).toBe(10);
    });

    it('decrement theo step', () => {
        const { result } = renderHook(() => useCounter(10, 3));

        act(() => {
            result.current.decrement();
        });

        expect(result.current.count).toBe(7); // 10 - 3
    });

    it('reset về initial value', () => {
        const { result } = renderHook(() => useCounter(5));

        // Tăng count lên
        act(() => {
            result.current.increment();
            result.current.increment();
        });

        expect(result.current.count).toBe(7); // 5 + 1 + 1

        // Reset
        act(() => {
            result.current.reset();
        });

        expect(result.current.count).toBe(5); // Trở về initial
    });

    it('update khi props thay đổi', () => {
        // rerender() - Render lại hook với props mới
        const { result, rerender } = renderHook(
            // ↓ Props của hook
            ({ initial, step }) => useCounter(initial, step),
            // ↓ Initial props
            { initialProps: { initial: 0, step: 1 } }
        );

        act(() => {
            result.current.increment();
        });
        expect(result.current.count).toBe(1); // 0 + 1

        // Thay đổi step thành 10
        rerender({ initial: 0, step: 10 });

        act(() => {
            result.current.increment();
        });
        expect(result.current.count).toBe(11); // 1 + 10
    });
});
```

---

## 7. Mocking

### 7.1 Mock là gì?

**Mock** = Giả lập (fake) một phần code để test dễ hơn

**Tại sao cần mock?**

-   API calls → Không muốn gọi API thật mỗi lần test
-   Database → Không muốn đụng database thật
-   External services → Google Analytics, Payment...
-   Timers → Không muốn đợi thật

### 7.2 Mock functions

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Mock Functions', () => {
    it('theo dõi function được gọi', () => {
        // Tạo mock function
        const mockFn = vi.fn();

        // Gọi function
        mockFn('arg1');
        mockFn('arg2');

        // Kiểm tra
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenCalledWith('arg1');
        expect(mockFn).toHaveBeenLastCalledWith('arg2');
    });

    it('mock return value', () => {
        const mockFn = vi.fn().mockReturnValue(42);

        const result = mockFn();
        expect(result).toBe(42);
    });

    it('mock return values khác nhau', () => {
        const mockFn = vi
            .fn()
            .mockReturnValueOnce(1)
            .mockReturnValueOnce(2)
            .mockReturnValue(3);

        expect(mockFn()).toBe(1); // Lần 1
        expect(mockFn()).toBe(2); // Lần 2
        expect(mockFn()).toBe(3); // Lần 3+
    });

    it('mock async function', async () => {
        const mockFn = vi.fn().mockResolvedValue('success');

        const result = await mockFn();
        expect(result).toBe('success');
    });
});
```

### 7.3 Mock modules

**File API: `src/api/users.ts`**

```typescript
export async function fetchUser(id: number) {
    const response = await fetch(`https://api.example.com/users/${id}`);
    return response.json();
}

export async function createUser(name: string, email: string) {
    const response = await fetch('https://api.example.com/users', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
    });
    return response.json();
}
```

**Component: `src/components/UserProfile.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { fetchUser } from '../api/users';

interface User {
    id: number;
    name: string;
    email: string;
}

export function UserProfile({ userId }: { userId: number }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUser(userId)
            .then(setUser)
            .catch(() => setError('Không tải được user'))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>Không tìm thấy user</div>;

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}
```

**Test: `src/components/UserProfile.test.tsx`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import * as usersAPI from '../api/users';

// Mock toàn bộ module users.ts
vi.mock('../api/users');

describe('UserProfile Component', () => {
    beforeEach(() => {
        // Reset mocks trước mỗi test
        vi.clearAllMocks();
    });

    it('hiển thị loading state', () => {
        // Mock API chậm
        vi.mocked(usersAPI.fetchUser).mockImplementation(
            () => new Promise(() => {}) // Promise không bao giờ resolve
        );

        render(<UserProfile userId={1} />);

        expect(screen.getByText('Đang tải...')).toBeInTheDocument();
    });

    it('hiển thị user data khi load thành công', async () => {
        // Mock API trả về data
        const mockUser = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
        };

        vi.mocked(usersAPI.fetchUser).mockResolvedValue(mockUser);

        render(<UserProfile userId={1} />);

        // Đợi cho đến khi tên xuất hiện
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        expect(screen.getByText('john@example.com')).toBeInTheDocument();

        // Kiểm tra API được gọi đúng
        expect(usersAPI.fetchUser).toHaveBeenCalledWith(1);
    });

    it('hiển thị error khi load thất bại', async () => {
        // Mock API throw error
        vi.mocked(usersAPI.fetchUser).mockRejectedValue(
            new Error('Network error')
        );

        render(<UserProfile userId={1} />);

        await waitFor(() => {
            expect(screen.getByText('Không tải được user')).toBeInTheDocument();
        });
    });

    it('reload khi userId thay đổi', async () => {
        const user1 = { id: 1, name: 'User 1', email: 'user1@test.com' };
        const user2 = { id: 2, name: 'User 2', email: 'user2@test.com' };

        vi.mocked(usersAPI.fetchUser)
            .mockResolvedValueOnce(user1)
            .mockResolvedValueOnce(user2);

        // Render với userId=1
        const { rerender } = render(<UserProfile userId={1} />);

        // Đợi user 1 load
        await waitFor(() => {
            expect(screen.getByText('User 1')).toBeInTheDocument();
        });

        // Thay đổi userId thành 2
        rerender(<UserProfile userId={2} />);

        // Đợi user 2 load
        await waitFor(() => {
            expect(screen.getByText('User 2')).toBeInTheDocument();
        });

        // Kiểm tra API gọi 2 lần
        expect(usersAPI.fetchUser).toHaveBeenCalledTimes(2);
        expect(usersAPI.fetchUser).toHaveBeenNthCalledWith(1, 1);
        expect(usersAPI.fetchUser).toHaveBeenNthCalledWith(2, 2);
    });
});
```

**Giải thích:**

```typescript
// vi.mock('../api/users')
// ↓
// Thay thế toàn bộ module bằng mock
// Tất cả functions trong module trở thành mock functions

// vi.mocked(usersAPI.fetchUser)
// ↓
// Cast function thành mock để có type safety
// Giờ có thể dùng .mockResolvedValue(), .mockRejectedValue()...

vi.mocked(usersAPI.fetchUser).mockResolvedValue(mockUser);
// ↓
// Khi fetchUser() được gọi, nó sẽ return Promise resolve với mockUser

// waitFor(() => { ... })
// ↓
// Đợi cho đến khi condition trong callback = true
// Timeout mặc định: 1000ms
// Dùng cho async operations (API calls, setTimeout...)

await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
});
// ↓
// Đợi cho đến khi text "John Doe" xuất hiện
// Nếu không xuất hiện sau 1s → test fail
```

### 7.4 Mock global fetch

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global fetch
global.fetch = vi.fn();

describe('Fetch Tests', () => {
    beforeEach(() => {
        // Reset mock trước mỗi test
        vi.clearAllMocks();
    });

    it('mock fetch success', async () => {
        const mockData = { id: 1, name: 'John' };

        // Mock fetch return success response
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const response = await fetch('/api/users/1');
        const data = await response.json();

        expect(data).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith('/api/users/1');
    });

    it('mock fetch error', async () => {
        // Mock fetch return error response
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 404,
        });

        const response = await fetch('/api/users/999');

        expect(response.ok).toBe(false);
        expect(response.status).toBe(404);
    });

    it('mock fetch network error', async () => {
        // Mock fetch throw error
        (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

        await expect(fetch('/api/users/1')).rejects.toThrow('Network error');
    });
});
```

### 7.5 Spy on methods

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Spying', () => {
    it('spy console.log', () => {
        // Spy console.log
        const spy = vi.spyOn(console, 'log');

        console.log('Hello', 'World');

        expect(spy).toHaveBeenCalledWith('Hello', 'World');

        // Restore về function gốc
        spy.mockRestore();
    });

    it('spy và mock implementation', () => {
        const obj = {
            getName: () => 'Original',
        };

        // Spy và thay đổi implementation
        const spy = vi.spyOn(obj, 'getName').mockImplementation(() => 'Mocked');

        expect(obj.getName()).toBe('Mocked');
        expect(spy).toHaveBeenCalled();

        // Restore
        spy.mockRestore();
        expect(obj.getName()).toBe('Original');
    });
});
```

---

## 8. 🧪 Advanced Testing Patterns

### 8.1 Testing Context

**ThemeContext.tsx:**

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [theme, setTheme] = useState<Theme>('light');

    const toggleTheme = () => {
        setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
```

**ThemedButton.tsx:**

```typescript
import { useTheme } from './ThemeContext';

export const ThemedButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{ background: theme === 'light' ? '#fff' : '#000' }}
        >
            Current theme: {theme}
        </button>
    );
};
```

**ThemedButton.test.tsx:**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './ThemeContext';
import { ThemedButton } from './ThemedButton';

describe('ThemedButton', () => {
    it('renders with light theme by default', () => {
        render(
            <ThemeProvider>
                <ThemedButton />
            </ThemeProvider>
        );

        expect(screen.getByText(/current theme: light/i)).toBeInTheDocument();
    });

    it('toggles theme on click', async () => {
        const user = userEvent.setup();

        render(
            <ThemeProvider>
                <ThemedButton />
            </ThemeProvider>
        );

        const button = screen.getByRole('button');

        expect(button).toHaveTextContent('Current theme: light');

        await user.click(button);

        expect(button).toHaveTextContent('Current theme: dark');

        await user.click(button);

        expect(button).toHaveTextContent('Current theme: light');
    });

    it('throws error when used outside provider', () => {
        // Suppress console.error for this test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<ThemedButton />)).toThrow(
            'useTheme must be used within ThemeProvider'
        );

        spy.mockRestore();
    });
});
```

### 8.2 Custom Render với Providers

**test-utils.tsx:**

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from './ThemeContext';

interface AllProvidersProps {
    children: React.ReactNode;
}

const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
    return <ThemeProvider>{children}</ThemeProvider>;
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

**Sử dụng:**

```typescript
import { render, screen } from './test-utils'; // custom render
import { ThemedButton } from './ThemedButton';

it('works with custom render', () => {
    render(<ThemedButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
});
```

---

## 9. Best Practices

### 9.1 Nguyên tắc AAA

```typescript
it('example test', () => {
    // ====== ARRANGE (Chuẩn bị) ======
    // Setup: tạo data, mock functions, render components...
    const mockData = { id: 1, name: 'Test' };
    const mockFn = vi.fn();
    render(<Component data={mockData} onClick={mockFn} />);

    // ====== ACT (Thực hiện) ======
    // Thực hiện hành động cần test
    const button = screen.getByRole('button');
    await user.click(button);

    // ====== ASSERT (Kiểm tra) ======
    // Kiểm tra kết quả
    expect(mockFn).toHaveBeenCalled();
    expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### 9.2 Test behavior, không phải implementation

❌ **SAI - Test implementation:**

```typescript
it('bad test - test implementation', () => {
    const { result } = renderHook(() => useCounter());

    // Test implementation detail: state internal
    expect(result.current).toHaveProperty('count');
    expect(result.current).toHaveProperty('increment');
});
```

✅ **ĐÚNG - Test behavior:**

```typescript
it('good test - test behavior', () => {
    const { result } = renderHook(() => useCounter());

    // Test behavior: increment làm tăng count
    act(() => {
        result.current.increment();
    });

    expect(result.current.count).toBe(1);
});
```

### 9.3 Thứ tự ưu tiên queries

```typescript
// 1. ✅ BEST - Accessible by everyone
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByPlaceholderText('Enter email');
screen.getByText('Hello');

// 2. ✅ GOOD - Semantic queries
screen.getByAltText('Avatar');
screen.getByTitle('Close');

// 3. ⚠️ LAST RESORT - Test IDs
screen.getByTestId('custom-element');
```

**Tại sao?**

-   `getByRole`, `getByLabelText` → Test như user nhìn thấy
-   `getByTestId` → Không liên quan đến UI, chỉ dùng khi không có cách khác

### 9.4 Tránh những sai lầm thường gặp

#### Sai lầm 1: Quên await với async operations

```typescript
// ❌ SAI
it('bad - forgot await', () => {
    const user = userEvent.setup();
    render(<Button onClick={mockFn} />);

    user.click(screen.getByRole('button')); // ← Thiếu await!

    expect(mockFn).toHaveBeenCalled(); // Có thể fail
});

// ✅ ĐÚNG
it('good - with await', async () => {
    const user = userEvent.setup();
    render(<Button onClick={mockFn} />);

    await user.click(screen.getByRole('button')); // ← Có await

    expect(mockFn).toHaveBeenCalled();
});
```

#### Sai lầm 2: Không cleanup mock

```typescript
// ❌ SAI
describe('Tests', () => {
    it('test 1', () => {
        vi.mocked(api.fetch).mockResolvedValue(data1);
        // Test...
    });

    it('test 2', () => {
        // Mock từ test 1 vẫn còn! → Test có thể sai
    });
});

// ✅ ĐÚNG
describe('Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Clear trước mỗi test
    });

    it('test 1', () => {
        vi.mocked(api.fetch).mockResolvedValue(data1);
        // Test...
    });

    it('test 2', () => {
        // Fresh mock, không bị ảnh hưởng test 1
    });
});
```

#### Sai lầm 3: Query element không tồn tại

```typescript
// ❌ SAI
it('bad - element might not exist', () => {
    render(<Component />);

    // Nếu element không có → Test crash
    const element = screen.getByText('Maybe not exist');
});

// ✅ ĐÚNG - Khi check element KHÔNG tồn tại
it('good - check element not exist', () => {
    render(<Component />);

    // queryBy* return null nếu không tìm thấy
    expect(screen.queryByText('Not exist')).not.toBeInTheDocument();
});

// ✅ ĐÚNG - Khi đợi element xuất hiện
it('good - wait for element', async () => {
    render(<Component />);

    // findBy* đợi element xuất hiện
    const element = await screen.findByText('Async loaded');
    expect(element).toBeInTheDocument();
});
```

#### Sai lầm 4: Test quá nhiều thứ trong 1 test

```typescript
// ❌ SAI - Test quá nhiều
it('bad - tests too many things', async () => {
    render(<TodoApp />);

    // Add todo
    await user.type(screen.getByRole('textbox'), 'Task 1');
    await user.click(screen.getByText('Add'));

    // Mark complete
    await user.click(screen.getByRole('checkbox'));

    // Edit todo
    await user.click(screen.getByText('Edit'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Updated');

    // Delete todo
    await user.click(screen.getByText('Delete'));

    // Expectations...
});

// ✅ ĐÚNG - Tách thành nhiều tests
describe('TodoApp', () => {
    it('adds new todo', async () => {
        // Test add
    });

    it('marks todo as complete', async () => {
        // Test complete
    });

    it('edits todo', async () => {
        // Test edit
    });

    it('deletes todo', async () => {
        // Test delete
    });
});
```

### 9.5 Naming conventions

```typescript
// ✅ Tên file test
Button.test.tsx;
Button.spec.tsx;
useCounter.test.ts;

// ✅ Tên describe và it rõ ràng
describe('Button Component', () => {
    it('renders label correctly', () => {});
    it('calls onClick when clicked', () => {});
    it('is disabled when disabled prop is true', () => {});
});

// ✅ Hoặc dùng tiếng Việt
describe('Button Component', () => {
    it('hiển thị label đúng', () => {});
    it('gọi onClick khi click', () => {});
    it('bị disable khi prop disabled = true', () => {});
});
```

### 9.6 Tổ chức tests

```typescript
describe('LoginForm', () => {
    describe('Rendering', () => {
        it('renders all form fields', () => {});
        it('renders submit button', () => {});
    });

    describe('Validation', () => {
        it('shows error for empty email', () => {});
        it('shows error for invalid email', () => {});
        it('shows error for empty password', () => {});
    });

    describe('Submission', () => {
        it('calls onSubmit with correct data', () => {});
        it('shows loading state during submission', () => {});
        it('clears form after successful submission', () => {});
    });

    describe('Error Handling', () => {
        it('displays server error message', () => {});
        it('clears error on retry', () => {});
    });
});
```

---

## 10. Bài Tập Thực Hành

### Bài 1: Todo List (Cơ bản)

**Yêu cầu:**
Tạo TodoList component với features:

-   Add todo item
-   Mark todo as completed
-   Delete todo
-   Show todo count

**Component cần tạo:**

```typescript
// TodoList.tsx
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export function TodoList() {
    // Your code here
}
```

**Tests cần viết:**

```typescript
describe('TodoList', () => {
    it('adds new todo');
    it('marks todo as completed');
    it('deletes todo');
    it('shows correct todo count');
    it('shows empty state when no todos');
});
```

### Bài 2: Search Component (Trung bình)

**Yêu cầu:**
Tạo SearchBar với:

-   Input field
-   Search button
-   Display results
-   Loading state
-   Mock API call

**Tests cần viết:**

```typescript
describe('SearchBar', () => {
    it('displays search results');
    it('shows loading state');
    it('shows error message on failure');
    it('clears results on new search');
});
```

### Bài 3: User Registration Form (Nâng cao)

**Yêu cầu:**
Tạo form đăng ký với:

-   Multiple input fields (name, email, password, confirm password)
-   Validation rules
-   Submit button
-   Success/error messages

**Validation rules:**

-   Name: required, min 3 characters
-   Email: required, valid email format
-   Password: required, min 8 characters
-   Confirm password: must match password

**Tests cần viết:**

```typescript
describe('RegistrationForm', () => {
    describe('Validation', () => {
        it('validates name length');
        it('validates email format');
        it('validates password length');
        it('validates password match');
        it('shows all errors at once');
    });

    describe('Submission', () => {
        it('submits form with valid data');
        it('does not submit with invalid data');
        it('shows success message');
        it('clears form after success');
    });
});
```

---

## 11. Cheat Sheet - Tóm Tắt Nhanh

### Cài đặt Vitest

```bash
npm i -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Test cơ bản

```typescript
import { describe, it, expect } from 'vitest';

describe('Group name', () => {
    it('test description', () => {
        expect(value).toBe(expected);
    });
});
```

### Test component

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Render
render(<Component />);

// Find elements
screen.getByRole('button');
screen.getByText('Hello');
screen.getByLabelText('Email');

// User interactions
const user = userEvent.setup();
await user.click(element);
await user.type(element, 'text');

// Assertions
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent('text');
expect(mockFn).toHaveBeenCalled();
```

### Test hooks

```typescript
import { renderHook, act } from '@testing-library/react';

const { result } = renderHook(() => useHook());

act(() => {
    result.current.action();
});

expect(result.current.value).toBe(expected);
```

### Mocking

```typescript
// Mock function
const mockFn = vi.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue('async');

// Mock module
vi.mock('./module');
vi.mocked(module.fn).mockResolvedValue(data);

// Spy
const spy = vi.spyOn(obj, 'method');
spy.mockRestore();
```

### Async tests

```typescript
// Wait for element
await screen.findByText('text');

// Wait for condition
await waitFor(() => {
    expect(element).toBeInTheDocument();
});
```

### Common matchers

```typescript
// Values
expect(value).toBe(5);
expect(obj).toEqual({ a: 1 });
expect(value).toBeTruthy();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(10);

// Strings
expect(text).toContain('hello');
expect(text).toMatch(/pattern/);

// Arrays
expect(arr).toContain(item);
expect(arr).toHaveLength(3);

// Functions
expect(fn).toThrow();
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg);

// DOM
expect(element).toBeInTheDocument();
expect(element).toBeDisabled();
expect(element).toHaveClass('className');
expect(element).toHaveTextContent('text');
```

---

## 12. Tài Nguyên Học Thêm

### Documentation

-   [Vitest](https://vitest.dev/) - Official docs
-   [Testing Library](https://testing-library.com/) - Testing utilities
-   [Jest](https://jestjs.io/) - Alternative test runner

### Videos & Courses

-   [Testing React with Vitest](https://www.youtube.com/results?search_query=vitest+react+tutorial)
-   [Kent C. Dodds - Testing Workshop](https://testingjavascript.com/)

### Tools

-   [Testing Playground](https://testing-playground.com/) - Find best queries
-   [MSW](https://mswjs.io/) - Mock API calls
-   [Faker](https://fakerjs.dev/) - Generate test data

---

## 13. Tổng Kết

### ✅ Bạn đã học được:

1. **Cơ bản về testing**

    - Testing là gì và tại sao cần
    - Cài đặt Vitest/Jest
    - Hiểu config files

2. **Các hàm chính**

    - describe, it, expect
    - beforeEach, afterEach
    - Tất cả matchers (toBe, toEqual, toHaveBeenCalled...)

3. **Test components**

    - render, screen
    - userEvent
    - Test forms, buttons, inputs

4. **Test hooks**

    - renderHook
    - act
    - Test custom hooks

5. **Mocking**

    - Mock functions
    - Mock modules
    - Spy methods

6. **Best practices**
    - AAA pattern
    - Test behavior
    - Query priority
    - Tránh sai lầm thường gặp

### 🎯 Bước tiếp theo:

1. **Practice** - Làm 3 bài tập ở trên
2. **Test dự án thật** - Viết tests cho project của bạn
3. **Learn E2E testing** - Playwright/Cypress cho integration tests
4. **TDD** - Học Test-Driven Development
5. **CI/CD** - Setup tests chạy tự động

### 💡 Tips cuối cùng:

-   Bắt đầu với tests đơn giản trước
-   Không cần 100% coverage, focus vào critical paths
-   Viết tests như user sử dụng app
-   Mock sensibly - không mock mọi thứ
-   Keep tests simple và maintainable

**Chúc bạn thành công với testing! 🚀**

---

## FAQ - Câu Hỏi Thường Gặp

**Q: Vitest hay Jest tốt hơn?**
A: Vitest nhanh hơn và modern hơn. Nếu dùng Vite → chọn Vitest. Nếu dùng Create React App → chọn Jest.

**Q: Cần test bao nhiêu % code?**
A: Không cần 100%. Aim for 70-80% overall, 90%+ cho critical features.

**Q: Khi nào dùng getBy vs queryBy vs findBy?**
A:

-   `getBy`: Element PHẢI có (throw error nếu không)
-   `queryBy`: Check element KHÔNG có (return null)
-   `findBy`: Đợi element xuất hiện (async)

**Q: Có cần test third-party libraries không?**
A: Không. Chỉ test code của bạn. Libraries đã được test rồi.

**Q: Test async code như thế nào?**
A: Dùng `async/await` với `findBy*` hoặc `waitFor()`.

**Q: Mock hay không mock?**
A: Mock external dependencies (API, localStorage...). Không mock component logic của bạn.

**Q: Viết test trước hay code trước?**
A: Tùy preference. TDD = test trước. Hoặc code trước rồi test sau cũng OK.
