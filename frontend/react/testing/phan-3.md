# 🚀 Testing Nâng Cao - Coverage, E2E, TDD & CI/CD

## 📚 Mục Lục

1. [Test Coverage - Đo lường chất lượng test](#1-test-coverage)
2. [E2E Testing với Playwright](#2-e2e-testing-playwright)
3. [E2E Testing với Cypress](#3-e2e-testing-cypress)
4. [Test-Driven Development (TDD)](#4-test-driven-development)
5. [CI/CD - Tự động hóa testing](#5-cicd-automation)

---

## 📚 Cấu Trúc Khóa Học

```
├─ PHẦN 1: FOUNDATIONS ✅ (Đã học)
│  ├─ Testing là gì & Tại sao cần
│  ├─ Setup Vitest/Jest
│  ├─ Các hàm cơ bản (describe, it, expect)
│  ├─ Matchers & Assertions
│  ├─ Test components đơn giản
│  └─ Test hooks cơ bản
│
├─ PHẦN 2: UNIT & INTEGRATION TESTS ✅ (Đã học)
│  ├─ Testing React Components nâng cao
│  ├─ Testing Custom Hooks
│  ├─ Testing Async Operations
│  ├─ Mocking & Spying
│  ├─ Testing Context API
│  ├─ Testing React Router
│  ├─ Testing State Management (Redux/Zustand)
│  ├─ Integration Tests
│  └─ Best Practices
│
└─ PHẦN 3: ADVANCED TESTING (Phần này) 📍
   ├─ Test Coverage
   ├─ E2E Testing (Playwright/Cypress)
   ├─ TDD (Test-Driven Development)
   └─ CI/CD Automation
```

---

## 1. Test Coverage

### 1.1 Coverage là gì?

**Coverage** (Độ phủ) = Đo lường bao nhiêu % code được test

**Tại sao quan trọng?**

-   ✅ Biết phần nào chưa test
-   ✅ Tìm dead code
-   ✅ Đảm bảo quality
-   ❌ **KHÔNG** đồng nghĩa với code quality tốt

### 1.2 Các loại Coverage

```
┌─────────────────────────────────────────┐
│ 1. Statement Coverage (Độ phủ câu lệnh) │
│    → % dòng code được chạy              │
│                                         │
│ 2. Branch Coverage (Độ phủ nhánh)       │
│    → % if/else được test                │
│                                         │
│ 3. Function Coverage (Độ phủ hàm)       │
│    → % functions được gọi               │
│                                         │
│ 4. Line Coverage (Độ phủ dòng)          │
│    → % dòng code được execute           │
└─────────────────────────────────────────┘
```

### 1.3 Ví dụ minh họa

**Code cần test:**

```typescript
// src/utils/discount.ts
export function calculateDiscount(price: number, customerType: string): number {
    // Dòng 2
    if (price < 0) {
        // Dòng 3
        throw new Error('Price cannot be negative');
    }

    // Dòng 6
    let discount = 0;

    // Dòng 8
    if (customerType === 'vip') {
        // Dòng 9
        discount = price * 0.2; // 20% off
    } else if (customerType === 'member') {
        // Dòng 11
        discount = price * 0.1; // 10% off
    } else {
        // Dòng 13
        discount = 0; // No discount
    }

    // Dòng 16
    return price - discount;
}
```

**Test không đủ coverage:**

```typescript
// ❌ Coverage thấp
describe('calculateDiscount', () => {
    it('calculates VIP discount', () => {
        const result = calculateDiscount(100, 'vip');
        expect(result).toBe(80); // 100 - 20% = 80
    });
});
```

**Coverage report:**

```
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
discount.ts      |   57.14 |    33.33 |     100 |   57.14 |
```

**Giải thích:**

-   **% Stmts (Statements): 57.14%** - Chỉ 4/7 statements được chạy
-   **% Branch: 33.33%** - Chỉ 1/3 nhánh được test (vip, không test member & regular)
-   **% Funcs: 100%** - Function được gọi
-   **% Lines: 57.14%** - 4/7 dòng được chạy

**Test đầy đủ coverage:**

```typescript
// ✅ Coverage cao
describe('calculateDiscount', () => {
    it('calculates VIP discount (20%)', () => {
        expect(calculateDiscount(100, 'vip')).toBe(80);
    });

    it('calculates member discount (10%)', () => {
        expect(calculateDiscount(100, 'member')).toBe(90);
    });

    it('no discount for regular customer', () => {
        expect(calculateDiscount(100, 'regular')).toBe(100);
    });

    it('throws error for negative price', () => {
        expect(() => calculateDiscount(-10, 'vip')).toThrow(
            'Price cannot be negative'
        );
    });
});
```

**Coverage report:**

```
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
discount.ts      |     100 |      100 |     100 |     100 |
```

### 1.4 Setup Coverage với Vitest

**Bước 1: Cài đặt**

```bash
npm install -D @vitest/coverage-v8
```

**Bước 2: Config `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',

        // ↓ Coverage config
        coverage: {
            provider: 'v8', // Coverage provider
            reporter: ['text', 'html', 'json'], // Output formats

            // Thresholds - Test fail nếu coverage < ngưỡng này
            thresholds: {
                lines: 80, // 80% dòng code
                functions: 80, // 80% functions
                branches: 75, // 75% nhánh
                statements: 80, // 80% statements
            },

            // Include/Exclude files
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'node_modules/',
                'src/**/*.test.{ts,tsx}',
                'src/**/*.spec.{ts,tsx}',
                'src/test/',
            ],
        },
    },
});
```

**Giải thích config:**

```typescript
coverage: {
  // provider: 'v8'
  // → Engine đo coverage (v8 nhanh hơn, c8 chi tiết hơn)
  provider: 'v8',

  // reporter: [...]
  // → Định dạng report
  // 'text' → Hiện trong terminal
  // 'html' → Tạo file HTML xem chi tiết
  // 'json' → Export JSON
  reporter: ['text', 'html', 'json'],

  // thresholds
  // → Ngưỡng tối thiểu
  // Test FAIL nếu coverage thấp hơn
  thresholds: {
    lines: 80,        // Tối thiểu 80% dòng
    functions: 80,    // Tối thiểu 80% functions
    branches: 75,     // Tối thiểu 75% branches
    statements: 80,   // Tối thiểu 80% statements
  },

  // include: [...]
  // → Files cần đo coverage
  include: ['src/**/*.{ts,tsx}'],

  // exclude: [...]
  // → Files bỏ qua (test files, config...)
  exclude: [
    'node_modules/',
    'src/**/*.test.{ts,tsx}',
  ],
}
```

**Bước 3: Chạy coverage**

```bash
# Chạy tests và xem coverage
npm run test:coverage

# Hoặc thêm vào package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:coverage:ui": "vitest --coverage --ui"
  }
}
```

**Output trong terminal:**

```
 % Coverage report from v8
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.71 |    83.33 |     100 |   85.71 |
 src/               |   85.71 |    83.33 |     100 |   85.71 |
  Button.tsx        |     100 |      100 |     100 |     100 |
  Counter.tsx       |      90 |       80 |     100 |      90 |
  LoginForm.tsx     |   76.47 |    66.66 |     100 |   76.47 |
--------------------|---------|----------|---------|---------|
```

**Xem HTML report:**

```bash
# Sau khi chạy coverage
open coverage/index.html

# Hoặc
npx serve coverage
```

HTML report cho thấy:

-   Files nào chưa đủ coverage (đỏ)
-   Dòng code nào chưa test (highlight đỏ)
-   Branches nào chưa test

### 1.5 Đọc Coverage Report

**Ví dụ HTML report:**

```
┌─────────────────────────────────────────┐
│ File: LoginForm.tsx                     │
├─────────────────────────────────────────┤
│ 1  export function LoginForm() {        │ ✅ Covered
│ 2    const [email, setEmail] = ...      │ ✅ Covered
│ 3    if (!email) {                      │ ⚠️ Branch not covered
│ 4      setError('Required')             │ ❌ Not covered
│ 5    }                                  │
│ 6    return <form>...</form>            │ ✅ Covered
└─────────────────────────────────────────┘
```

**Màu sắc:**

-   🟢 **Xanh**: Dòng được test
-   🔴 **Đỏ**: Dòng chưa test
-   🟡 **Vàng**: Branch chỉ test 1 phần (if có, else không)

### 1.6 Coverage Best Practices

**✅ DO:**

```typescript
// 1. Focus vào critical paths
describe('Payment Processing', () => {
    it('handles successful payment');
    it('handles payment failure');
    it('validates card number');
    it('handles network timeout');
});

// 2. Test edge cases
describe('calculateAge', () => {
    it('handles future birthdate');
    it('handles leap year');
    it('handles invalid date');
});

// 3. Test error scenarios
describe('API call', () => {
    it('handles 404');
    it('handles 500');
    it('handles network error');
});
```

**❌ DON'T:**

```typescript
// 1. Đừng chase 100% coverage vô nghĩa
it('getters return correct values', () => {
    expect(user.getName()).toBe(user.name); // Useless test
});

// 2. Đừng test third-party code
it('lodash works correctly', () => {
    expect(_.sum([1, 2, 3])).toBe(6); // Don't test libraries
});

// 3. Đừng test implementation details
it('component uses useState', () => {
    // Don't test HOW, test WHAT
});
```

**Coverage targets:**

| Code Type               | Target Coverage |
| ----------------------- | --------------- |
| Critical business logic | 90-100%         |
| Components              | 80-90%          |
| Utilities               | 85-95%          |
| Config files            | 0-20%           |
| Overall project         | 70-80%          |

**Nguyên tắc quan trọng:**

> **High coverage ≠ Good tests**  
> **Good tests → High coverage**

100% coverage nhưng test kém = Vô dụng  
80% coverage nhưng test tốt = Tốt hơn

---

## 2. E2E Testing với Playwright

### 2.1 Playwright là gì?

**Playwright** = E2E testing framework của Microsoft

**End-to-End Testing** = Test toàn bộ user flow từ đầu đến cuối

```
Unit Tests:     Test 1 function      ⚙️
Integration:    Test nhiều parts     ⚙️⚙️⚙️
E2E Tests:      Test toàn bộ app    🌐 → 💻 → 🗄️
```

**Ví dụ E2E test:**

```
1. User mở trang login
2. Nhập email/password
3. Click Login
4. Chuyển đến dashboard
5. Click "New Post"
6. Điền form
7. Click Submit
8. Verify post xuất hiện
```

**Playwright features:**

-   ✅ Support Chrome, Firefox, Safari
-   ✅ Auto-wait cho elements
-   ✅ Screenshot & video recording
-   ✅ Network interception
-   ✅ Mobile emulation
-   ✅ Parallel testing

### 2.2 Cài đặt Playwright

```bash
# Cài đặt
npm init playwright@latest

# Chọn options:
# - TypeScript? Yes
# - Test folder? tests
# - GitHub Actions? Yes
# - Install browsers? Yes
```

**Cấu trúc project sau khi cài:**

```
my-app/
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
├── package.json
└── src/
```

**File `playwright.config.ts`:**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Test directory
    testDir: './tests',

    // Timeout cho mỗi test
    timeout: 30 * 1000, // 30 seconds

    // Retry khi test fail
    retries: process.env.CI ? 2 : 0,

    // Số workers (parallel tests)
    workers: process.env.CI ? 1 : undefined,

    // Reporter (output format)
    reporter: 'html',

    // Shared settings cho tất cả tests
    use: {
        // Base URL cho navigation
        baseURL: 'http://localhost:3000',

        // Screenshot khi fail
        screenshot: 'only-on-failure',

        // Video khi fail
        video: 'retain-on-failure',

        // Trace khi fail (debug)
        trace: 'on-first-retry',
    },

    // Test trên nhiều browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        // Mobile
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],

    // Dev server (tự động start khi chạy test)
    webServer: {
        command: 'npm run dev',
        port: 3000,
        reuseExistingServer: !process.env.CI,
    },
});
```

**Giải thích config quan trọng:**

```typescript
// baseURL: 'http://localhost:3000'
// → Mọi navigation sẽ bắt đầu từ URL này
// page.goto('/login') → http://localhost:3000/login

// screenshot: 'only-on-failure'
// → Chụp màn hình khi test fail
// Options: 'on', 'off', 'only-on-failure'

// video: 'retain-on-failure'
// → Record video khi test fail
// Options: 'on', 'off', 'retain-on-failure', 'on-first-retry'

// trace: 'on-first-retry'
// → Ghi trace (timeline, network, console) khi retry
// Dùng để debug

// projects: [...]
// → Chạy tests trên nhiều browsers/devices
// Playwright sẽ chạy mỗi test trên tất cả projects

// webServer: {...}
// → Auto start dev server trước khi chạy tests
// Kill server sau khi tests xong
```

### 2.3 Test đầu tiên với Playwright

**Test file: `tests/login.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
    // test() - Định nghĩa một test
    test('user can login successfully', async ({ page }) => {
        // page - Browser page instance

        // 1. Navigate to login page
        await page.goto('/login');

        // 2. Fill form
        await page.fill('input[name="email"]', 'user@example.com');
        await page.fill('input[name="password"]', 'password123');

        // 3. Click login button
        await page.click('button[type="submit"]');

        // 4. Verify redirect to dashboard
        await expect(page).toHaveURL('/dashboard');

        // 5. Verify welcome message
        await expect(page.locator('h1')).toHaveText('Welcome');
    });

    test('shows error for invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[name="email"]', 'wrong@example.com');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Verify error message appears
        await expect(page.locator('.error')).toHaveText('Invalid credentials');

        // Still on login page
        await expect(page).toHaveURL('/login');
    });
});
```

**Giải thích API:**

```typescript
// page.goto(url)
// → Navigate đến URL
await page.goto('/login');

// page.fill(selector, value)
// → Điền text vào input
await page.fill('input[name="email"]', 'test@example.com');

// page.click(selector)
// → Click vào element
await page.click('button[type="submit"]');

// page.locator(selector)
// → Tìm element (trả về Locator)
const heading = page.locator('h1');

// expect(page).toHaveURL(url)
// → Kiểm tra URL hiện tại
await expect(page).toHaveURL('/dashboard');

// expect(locator).toHaveText(text)
// → Kiểm tra text của element
await expect(page.locator('h1')).toHaveText('Welcome');
```

### 2.4 Locators - Tìm elements

**Playwright Locators (recommended):**

```typescript
// 1. By Role (BEST - accessible)
page.getByRole('button', { name: 'Submit' });
page.getByRole('textbox', { name: 'Email' });
page.getByRole('link', { name: 'Home' });

// 2. By Text
page.getByText('Welcome');
page.getByText(/hello/i); // Regex

// 3. By Label
page.getByLabel('Email');
page.getByLabel('Password');

// 4. By Placeholder
page.getByPlaceholder('Enter email');

// 5. By Test ID
page.getByTestId('submit-button');

// 6. By CSS Selector
page.locator('.btn-primary');
page.locator('#login-form');

// 7. By XPath
page.locator('xpath=//button[@type="submit"]');
```

**Chaining locators:**

```typescript
// Tìm trong container
const form = page.locator('#login-form');
await form.getByLabel('Email').fill('test@example.com');
await form.getByRole('button').click();

// First/Last/Nth
await page.locator('.item').first().click();
await page.locator('.item').last().click();
await page.locator('.item').nth(2).click();

// Filter
await page.locator('li').filter({ hasText: 'Active' }).click();
```

### 2.5 Actions - Tương tác

```typescript
// Click
await page.click('button');
await page.dblclick('button'); // Double click
await page.click('button', { button: 'right' }); // Right click

// Type/Fill
await page.fill('input', 'text'); // Xóa rồi điền mới
await page.type('input', 'text'); // Gõ từng ký tự
await page.type('input', 'text', { delay: 100 }); // Delay giữa các ký tự

// Select
await page.selectOption('select', 'value');
await page.selectOption('select', { label: 'Option 1' });

// Check/Uncheck
await page.check('input[type="checkbox"]');
await page.uncheck('input[type="checkbox"]');

// Upload file
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');

// Hover
await page.hover('.tooltip-trigger');

// Focus/Blur
await page.focus('input');
await page.blur('input');

// Press keys
await page.press('input', 'Enter');
await page.press('input', 'Control+A');

// Screenshot
await page.screenshot({ path: 'screenshot.png' });
await page.locator('.element').screenshot({ path: 'element.png' });
```

### 2.6 Assertions

```typescript
// Page assertions
await expect(page).toHaveURL('https://example.com');
await expect(page).toHaveTitle('My Page');

// Element visibility
await expect(page.locator('.element')).toBeVisible();
await expect(page.locator('.element')).toBeHidden();

// Element state
await expect(page.locator('button')).toBeEnabled();
await expect(page.locator('button')).toBeDisabled();
await expect(page.locator('input')).toBeChecked();
await expect(page.locator('input')).toBeFocused();

// Text content
await expect(page.locator('h1')).toHaveText('Welcome');
await expect(page.locator('h1')).toContainText('Welcome');

// Attributes
await expect(page.locator('a')).toHaveAttribute('href', '/home');
await expect(page.locator('button')).toHaveClass('btn-primary');

// Count
await expect(page.locator('.item')).toHaveCount(5);

// Value
await expect(page.locator('input')).toHaveValue('test@example.com');
```

### 2.7 Test phức tạp - Todo App

```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo App E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate trước mỗi test
        await page.goto('/todos');
    });

    test('complete todo workflow', async ({ page }) => {
        // 1. Add new todo
        await page
            .getByPlaceholder('What needs to be done?')
            .fill('Buy groceries');
        await page.keyboard.press('Enter');

        // Verify todo appears
        await expect(page.getByText('Buy groceries')).toBeVisible();

        // 2. Add second todo
        await page
            .getByPlaceholder('What needs to be done?')
            .fill('Clean house');
        await page.keyboard.press('Enter');

        // Verify count
        await expect(page.locator('.todo-item')).toHaveCount(2);

        // 3. Mark first todo as complete
        await page.locator('.todo-item').first().getByRole('checkbox').check();

        // Verify completed style
        await expect(page.locator('.todo-item').first()).toHaveClass(
            /completed/
        );

        // 4. Filter completed todos
        await page.getByRole('button', { name: 'Completed' }).click();

        // Only see 1 todo
        await expect(page.locator('.todo-item')).toHaveCount(1);
        await expect(page.getByText('Buy groceries')).toBeVisible();

        // 5. Delete completed todo
        await page.locator('.todo-item').first().hover();
        await page.locator('.delete-btn').click();

        // Verify deleted
        await expect(page.locator('.todo-item')).toHaveCount(0);

        // 6. Go back to All filter
        await page.getByRole('button', { name: 'All' }).click();

        // Only 1 todo left
        await expect(page.locator('.todo-item')).toHaveCount(1);
        await expect(page.getByText('Clean house')).toBeVisible();
    });

    test('validates empty todo', async ({ page }) => {
        // Try to submit empty
        await page.getByPlaceholder('What needs to be done?').press('Enter');

        // No todo added
        await expect(page.locator('.todo-item')).toHaveCount(0);
    });
});
```

### 2.8 Chạy Playwright tests

```bash
# Chạy tất cả tests
npx playwright test

# Chạy 1 file
npx playwright test tests/login.spec.ts

# Chạy với UI mode (xem visual)
npx playwright test --ui

# Chạy với debug mode
npx playwright test --debug

# Chạy trên browser cụ thể
npx playwright test --project=chromium
npx playwright test --project=firefox

# Xem HTML report
npx playwright show-report
```

---

## 3. E2E Testing với Cypress

### 3.1 Cypress là gì?

**Cypress** = E2E testing framework phổ biến nhất

**Playwright vs Cypress:**

| Feature          | Playwright              | Cypress                 |
| ---------------- | ----------------------- | ----------------------- |
| Browsers         | Chrome, Firefox, Safari | Chrome, Firefox, Edge   |
| Speed            | Nhanh hơn               | Chậm hơn                |
| API              | Modern async/await      | Chaining commands       |
| Learning curve   | Dễ hơn                  | Khó hơn (cú pháp riêng) |
| Community        | Mới, đang lớn           | Lớn, nhiều plugins      |
| Network stubbing | Built-in                | Built-in                |

### 3.2 Cài đặt Cypress

```bash
# Cài đặt
npm install -D cypress

# Mở Cypress lần đầu (tạo folders)
npx cypress open
```

**Cấu trúc sau khi cài:**

```
my-app/
├── cypress/
│   ├── e2e/           ← Test files
│   ├── fixtures/      ← Test data
│   ├── support/       ← Commands, config
│   └── downloads/
├── cypress.config.ts
└── package.json
```

**File `cypress.config.ts`:**

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        // Base URL
        baseUrl: 'http://localhost:3000',

        // Viewport size
        viewportWidth: 1280,
        viewportHeight: 720,

        // Timeouts
        defaultCommandTimeout: 10000, // 10s
        pageLoadTimeout: 60000, // 60s

        // Video & Screenshots
        video: true,
        screenshotOnRunFailure: true,

        // Setup function
        setupNodeEvents(on, config) {
            // Plugin events
        },
    },
});
```

### 3.3 Test đầu tiên với Cypress

**Test file: `cypress/e2e/login.cy.ts`**

```typescript
describe('Login Flow', () => {
    beforeEach(() => {
        // Visit trang login trước mỗi test
        cy.visit('/login');
    });

    it('user can login successfully', () => {
        // 1. Fill form
        cy.get('input[name="email"]').type('user@example.com');
        cy.get('input[name="password"]').type('password123');

        // 2. Submit
        cy.get('button[type="submit"]').click();

        // 3. Verify redirect
        cy.url().should('include', '/dashboard');

        // 4. Verify content
        cy.contains('h1', 'Welcome').should('be.visible');
    });

    it('shows error for invalid credentials', () => {
        cy.get('input[name="email"]').type('wrong@example.com');
        cy.get('input[name="password"]').type('wrongpass');
        cy.get('button[type="submit"]').click();

        // Verify error
        cy.get('.error').should('contain', 'Invalid credentials');

        // Still on login page
        cy.url().should('include', '/login');
    });

    it('validates required fields', () => {
        // Click submit without filling
        cy.get('button[type="submit"]').click();

        // Check validation messages
        cy.get('input[name="email"]:invalid').should('exist');
        cy.get('input[name="password"]:invalid').should('exist');
    });
});
```

**Giải thích Cypress syntax:**

```typescript
// cy.visit(url)
// → Navigate đến URL
cy.visit('/login');

// cy.get(selector)
// → Tìm element (trả về Chainable)
cy.get('input[name="email"]');

// .type(text)
// → Gõ text vào input
cy.get('input').type('hello');

// .click()
// → Click element
cy.get('button').click();

// .should(assertion)
// → Assert element
cy.get('h1').should('be.visible');
cy.get('h1').should('have.text', 'Welcome');

// cy.contains(selector, text)
// → Tìm element chứa text
cy.contains('button', 'Submit');

// cy.url()
// → Get URL hiện tại
cy.url().should('include', '/dashboard');
```

### 3.4 Cypress Commands

**Navigation:**

```typescript
cy.visit('/home');
cy.go('back');
cy.go('forward');
cy.reload();
```

**Querying:**

```typescript
// Get elements
cy.get('.btn');
cy.get('#login');
cy.get('[data-testid="submit"]');

// Contains
cy.contains('Submit');
cy.contains('button', 'Submit');

// Within scope
cy.get('.form').within(() => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password');
});

// First/Last
cy.get('.item').first();
cy.get('.item').last();
cy.get('.item').eq(2); // Index 2

// Filter
cy.get('li').filter('.active');
cy.get('li').not('.disabled');

// Find children
cy.get('.parent').find('.child');
cy.get('.parent').children();

// Parent
cy.get('.child').parent();
cy.get('.child').parents('.ancestor');
```

**Actions:**

```typescript
// Type
cy.get('input').type('Hello');
cy.get('input').type('Hello{enter}'); // Type + Enter
cy.get('input').type('{ctrl}A'); // Keyboard shortcuts

// Clear
cy.get('input').clear();

// Click
cy.get('button').click();
cy.get('button').dblclick();
cy.get('button').rightclick();
cy.get('button').click({ force: true }); // Click even if covered

// Check/Uncheck
cy.get('input[type="checkbox"]').check();
cy.get('input[type="checkbox"]').uncheck();
cy.get('input[type="radio"]').check('value');

// Select
cy.get('select').select('Option 1');
cy.get('select').select(['opt1', 'opt2']); // Multiple

// Upload
cy.get('input[type="file"]').selectFile('path/to/file.pdf');

// Trigger events
cy.get('.element').trigger('mouseover');
cy.get('.element').trigger('change');
```

**Assertions:**

```typescript
// Visibility
cy.get('.element').should('be.visible');
cy.get('.element').should('not.be.visible');
cy.get('.element').should('exist');
cy.get('.element').should('not.exist');

// Text
cy.get('h1').should('have.text', 'Welcome');
cy.get('h1').should('contain', 'Welcome');
cy.get('p').should('have.html', '<strong>Bold</strong>');

// Attributes
cy.get('a').should('have.attr', 'href', '/home');
cy.get('button').should('have.class', 'btn-primary');
cy.get('input').should('have.value', 'test');
cy.get('input').should('be.disabled');
cy.get('input').should('be.enabled');

// CSS
cy.get('.element').should('have.css', 'color', 'rgb(255, 0, 0)');

// Length
cy.get('.item').should('have.length', 5);
cy.get('.item').should('have.length.gt', 3); // Greater than
cy.get('.item').should('have.length.lt', 10); // Less than

// Multiple assertions
cy.get('input')
    .should('be.visible')
    .and('have.value', 'test')
    .and('not.be.disabled');
```

### 3.5 Custom Commands

**File: `cypress/support/commands.ts`**

```typescript
// Declare type
declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
            createTodo(text: string): Chainable<void>;
            getBySel(dataTestId: string): Chainable<JQuery<HTMLElement>>;
        }
    }
}

// Define custom command
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('createTodo', (text: string) => {
    cy.get('input[placeholder*="What needs"]').type(`${text}{enter}`);
    cy.contains('.todo-item', text).should('be.visible');
});

Cypress.Commands.add('getBySel', (dataTestId: string) => {
    return cy.get(`[data-testid="${dataTestId}"]`);
});

export {};
```

**Sử dụng custom commands:**

```typescript
describe('Todo App', () => {
    beforeEach(() => {
        // Use custom login command
        cy.login('user@example.com', 'password123');
        cy.visit('/todos');
    });

    it('creates multiple todos', () => {
        cy.createTodo('Buy milk');
        cy.createTodo('Clean house');
        cy.createTodo('Walk dog');

        cy.get('.todo-item').should('have.length', 3);
    });

    it('uses custom selector', () => {
        cy.getBySel('add-button').click();
        cy.getBySel('todo-form').should('be.visible');
    });
});
```

### 3.6 Intercept API Calls

```typescript
describe('API Intercepting', () => {
    it('stubs API response', () => {
        // Intercept GET request
        cy.intercept('GET', '/api/users', {
            statusCode: 200,
            body: [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
            ],
        }).as('getUsers');

        cy.visit('/users');

        // Wait for request
        cy.wait('@getUsers');

        // Verify UI shows data
        cy.contains('John').should('be.visible');
        cy.contains('Jane').should('be.visible');
    });

    it('tests error handling', () => {
        // Stub with error
        cy.intercept('GET', '/api/users', {
            statusCode: 500,
            body: { error: 'Server error' },
        }).as('getUsersError');

        cy.visit('/users');
        cy.wait('@getUsersError');

        // Verify error message
        cy.contains('Failed to load users').should('be.visible');
    });

    it('delays response', () => {
        cy.intercept('GET', '/api/users', {
            delay: 2000, // 2 seconds delay
            statusCode: 200,
            body: [],
        }).as('slowRequest');

        cy.visit('/users');

        // Verify loading state
        cy.contains('Loading...').should('be.visible');

        cy.wait('@slowRequest');

        // Loading gone
        cy.contains('Loading...').should('not.exist');
    });

    it('modifies request', () => {
        cy.intercept('POST', '/api/users', (req) => {
            // Modify request body
            req.body.role = 'admin';
            req.continue();
        }).as('createUser');

        cy.visit('/users/new');
        cy.get('input[name="name"]').type('John');
        cy.get('button[type="submit"]').click();

        cy.wait('@createUser').its('request.body').should('deep.include', {
            name: 'John',
            role: 'admin',
        });
    });
});
```

### 3.7 Test phức tạp - E-commerce

```typescript
describe('E-commerce Checkout Flow', () => {
    beforeEach(() => {
        // Login
        cy.login('user@example.com', 'password');

        // Stub API
        cy.intercept('GET', '/api/products', { fixture: 'products.json' });
        cy.intercept('POST', '/api/orders', { fixture: 'order-success.json' });
    });

    it('completes full purchase flow', () => {
        // 1. Browse products
        cy.visit('/shop');
        cy.get('.product-card').should('have.length.gt', 0);

        // 2. Add to cart
        cy.contains('.product-card', 'iPhone 15')
            .find('button')
            .contains('Add to Cart')
            .click();

        // Verify cart badge updates
        cy.get('.cart-badge').should('have.text', '1');

        // 3. Add another product
        cy.contains('.product-card', 'MacBook Pro')
            .find('button')
            .contains('Add to Cart')
            .click();

        cy.get('.cart-badge').should('have.text', '2');

        // 4. Go to cart
        cy.get('.cart-icon').click();
        cy.url().should('include', '/cart');

        // Verify cart items
        cy.get('.cart-item').should('have.length', 2);
        cy.contains('.cart-item', 'iPhone 15');
        cy.contains('.cart-item', 'MacBook Pro');

        // 5. Update quantity
        cy.contains('.cart-item', 'iPhone 15')
            .find('input[type="number"]')
            .clear()
            .type('2');

        // Verify total updates
        cy.get('.total-price').should('not.contain', '$0');

        // 6. Proceed to checkout
        cy.contains('button', 'Checkout').click();
        cy.url().should('include', '/checkout');

        // 7. Fill shipping info
        cy.get('input[name="fullName"]').type('John Doe');
        cy.get('input[name="address"]').type('123 Main St');
        cy.get('input[name="city"]').type('New York');
        cy.get('select[name="country"]').select('United States');
        cy.get('input[name="zipCode"]').type('10001');

        // 8. Fill payment info
        cy.get('input[name="cardNumber"]').type('4242424242424242');
        cy.get('input[name="expiry"]').type('12/25');
        cy.get('input[name="cvv"]').type('123');

        // 9. Review order
        cy.contains('button', 'Review Order').click();

        // Verify order summary
        cy.contains('Order Summary').should('be.visible');
        cy.contains('iPhone 15 × 2');
        cy.contains('MacBook Pro × 1');

        // 10. Place order
        cy.contains('button', 'Place Order').click();

        // 11. Verify success
        cy.contains('Order Confirmed').should('be.visible');
        cy.contains('Order #').should('be.visible');

        // 12. Cart should be empty
        cy.get('.cart-badge').should('not.exist');
    });

    it('applies discount code', () => {
        // Add item to cart
        cy.visit('/shop');
        cy.get('.product-card').first().find('button').click();

        // Go to cart
        cy.get('.cart-icon').click();

        // Apply coupon
        cy.get('input[name="coupon"]').type('SAVE10');
        cy.contains('button', 'Apply').click();

        // Verify discount applied
        cy.contains('Discount').should('be.visible');
        cy.contains('-10%').should('be.visible');
    });

    it('handles payment error', () => {
        // Stub payment error
        cy.intercept('POST', '/api/orders', {
            statusCode: 400,
            body: { error: 'Payment declined' },
        });

        // Add item and checkout
        cy.visit('/shop');
        cy.get('.product-card').first().find('button').click();
        cy.get('.cart-icon').click();
        cy.contains('button', 'Checkout').click();

        // Fill forms...
        cy.get('input[name="cardNumber"]').type('4000000000000002'); // Declined card
        // ... fill other fields

        cy.contains('button', 'Place Order').click();

        // Verify error message
        cy.contains('Payment declined').should('be.visible');
        cy.url().should('include', '/checkout');
    });
});
```

### 3.8 Chạy Cypress tests

```bash
# Mở Cypress UI (interactive)
npx cypress open

# Chạy headless (CI)
npx cypress run

# Chạy file cụ thể
npx cypress run --spec "cypress/e2e/login.cy.ts"

# Chạy trên browser cụ thể
npx cypress run --browser chrome
npx cypress run --browser firefox

# Record video
npx cypress run --record --key <key>
```

---

## 4. Test-Driven Development (TDD)

### 4.1 TDD là gì?

**TDD** = Viết test TRƯỚC khi viết code

**Flow:**

```
1. 🔴 RED   → Viết test (fail)
2. 🟢 GREEN → Viết code đủ để pass
3. 🔵 REFACTOR → Cải thiện code
↻ Repeat
```

**Lợi ích:**

-   ✅ Design tốt hơn (think trước khi code)
-   ✅ Code đơn giản hơn (chỉ viết đủ để pass test)
-   ✅ Confidence cao hơn (code đã tested)
-   ✅ Ít bugs hơn
-   ✅ Documentation tự nhiên

### 4.2 TDD Example: Calculator

**Bước 1: 🔴 Write failing test**

```typescript
// calculator.test.ts
import { describe, it, expect } from 'vitest';
import { Calculator } from './calculator';

describe('Calculator', () => {
    it('adds two numbers', () => {
        const calc = new Calculator();
        const result = calc.add(2, 3);
        expect(result).toBe(5);
    });
});
```

**Chạy test → ❌ FAIL** (Calculator chưa tồn tại)

```
Error: Cannot find module './calculator'
```

**Bước 2: 🟢 Write minimal code to pass**

```typescript
// calculator.ts
export class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
}
```

**Chạy test → ✅ PASS**

**Bước 3: 🔵 Refactor (nếu cần)**

Code đã đơn giản rồi, không cần refactor.

**Tiếp tục với feature mới:**

**Bước 4: 🔴 Add subtract test**

```typescript
it('subtracts two numbers', () => {
    const calc = new Calculator();
    expect(calc.subtract(5, 3)).toBe(2);
});
```

**Chạy → ❌ FAIL** (method subtract không tồn tại)

**Bước 5: 🟢 Implement subtract**

```typescript
export class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }
}
```

**Chạy → ✅ PASS**

**Continue pattern...**

### 4.3 TDD Example: Todo List

**🔴 Test 1: Create empty list**

```typescript
// todo-list.test.ts
import { describe, it, expect } from 'vitest';
import { TodoList } from './todo-list';

describe('TodoList', () => {
    it('starts with empty list', () => {
        const todos = new TodoList();
        expect(todos.getAll()).toEqual([]);
    });
});
```

**🟢 Implementation:**

```typescript
// todo-list.ts
export class TodoList {
    private items: string[] = [];

    getAll(): string[] {
        return this.items;
    }
}
```

**🔴 Test 2: Add todo**

```typescript
it('adds a todo', () => {
    const todos = new TodoList();
    todos.add('Buy milk');
    expect(todos.getAll()).toEqual(['Buy milk']);
});
```

**🟢 Implementation:**

```typescript
export class TodoList {
    private items: string[] = [];

    getAll(): string[] {
        return this.items;
    }

    add(text: string): void {
        this.items.push(text);
    }
}
```

**🔴 Test 3: Remove todo**

```typescript
it('removes a todo by index', () => {
    const todos = new TodoList();
    todos.add('Buy milk');
    todos.add('Clean house');
    todos.remove(0);
    expect(todos.getAll()).toEqual(['Clean house']);
});
```

**🟢 Implementation:**

```typescript
export class TodoList {
    private items: string[] = [];

    getAll(): string[] {
        return this.items;
    }

    add(text: string): void {
        this.items.push(text);
    }

    remove(index: number): void {
        this.items.splice(index, 1);
    }
}
```

**🔴 Test 4: Mark as complete**

```typescript
interface Todo {
    text: string;
    completed: boolean;
}

it('marks todo as complete', () => {
    const todos = new TodoList();
    todos.add('Buy milk');
    todos.complete(0);

    const all = todos.getAll();
    expect(all[0].completed).toBe(true);
});
```

**🟢 Implementation:**

```typescript
interface Todo {
    text: string;
    completed: boolean;
}

export class TodoList {
    private items: Todo[] = [];

    getAll(): Todo[] {
        return this.items;
    }

    add(text: string): void {
        this.items.push({ text, completed: false });
    }

    remove(index: number): void {
        this.items.splice(index, 1);
    }

    complete(index: number): void {
        this.items[index].completed = true;
    }
}
```

**🔵 Refactor: Add validation**

```typescript
it('throws error for invalid index', () => {
    const todos = new TodoList();
    expect(() => todos.complete(-1)).toThrow('Invalid index');
    expect(() => todos.complete(99)).toThrow('Invalid index');
});
```

**Implementation:**

```typescript
export class TodoList {
    // ... previous code

    private validateIndex(index: number): void {
        if (index < 0 || index >= this.items.length) {
            throw new Error('Invalid index');
        }
    }

    remove(index: number): void {
        this.validateIndex(index);
        this.items.splice(index, 1);
    }

    complete(index: number): void {
        this.validateIndex(index);
        this.items[index].completed = true;
    }
}
```

### 4.4 TDD Best Practices

**✅ DO:**

```typescript
// 1. Write simplest test first
it('returns empty array initially', () => {
    expect(new List().getAll()).toEqual([]);
});

// 2. One assertion per test (ideally)
it('adds item', () => {
    const list = new List();
    list.add('item');
    expect(list.getAll()).toContain('item');
});

// 3. Test behavior, not implementation
it('user can login', () => {
    // Test the outcome, not HOW it's done
    expect(login('email', 'pass')).toBe(true);
});

// 4. Use descriptive test names
it('throws error when email is invalid', () => {});
it('calculates discount for VIP members', () => {});
```

**❌ DON'T:**

```typescript
// 1. Don't write complex test first
it('complex scenario with 10 steps', () => {
    // Too complex to start
});

// 2. Don't test multiple things
it('adds, removes, and updates item', () => {
    // Should be 3 separate tests
});

// 3. Don't skip refactor step
// Code might pass but be messy

// 4. Don't write all tests at once
// Write 1 test → implement → repeat
```

**TDD Cycle timing:**

```
Each cycle should take: 2-10 minutes
  - Write test: 1-3 min
  - Implement: 1-5 min
  - Refactor: 0-2 min

If longer → break problem into smaller pieces
```

### 4.5 TDD với React Components

**🔴 Test: Button renders**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
    it('renders with label', () => {
        render(<Button label='Click me' />);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });
});
```

**🟢 Implementation:**

```typescript
interface ButtonProps {
    label: string;
}

export function Button({ label }: ButtonProps) {
    return <button>{label}</button>;
}
```

**🔴 Test: Button calls onClick**

```typescript
it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button label='Click' onClick={handleClick} />);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**🟢 Implementation:**

```typescript
interface ButtonProps {
    label: string;
    onClick?: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
    return <button onClick={onClick}>{label}</button>;
}
```

**🔴 Test: Button can be disabled**

```typescript
it('is disabled when disabled prop is true', () => {
    render(<Button label='Click' disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
});
```

**🟢 Implementation:**

```typescript
interface ButtonProps {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function Button({ label, onClick, disabled }: ButtonProps) {
    return (
        <button onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
}
```

---

## 5. CI/CD Automation

### 5.1 CI/CD là gì?

**CI (Continuous Integration)** = Tự động test khi push code

**CD (Continuous Deployment)** = Tự động deploy khi tests pass

**Flow:**

```
1. Developer push code to GitHub
2. CI server pull code
3. Run tests automatically
4. If pass → Deploy to production
5. If fail → Notify developer
```

**Lợi ích:**

-   ✅ Catch bugs sớm
-   ✅ Không merge code hỏng
-   ✅ Deploy tự động
-   ✅ Consistent testing environment

### 5.2 GitHub Actions - Setup cơ bản

**File: `.github/workflows/test.yml`**

```yaml
name: Run Tests

# Khi nào chạy workflow này
on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

# Jobs cần chạy
jobs:
    test:
        # Chạy trên Ubuntu
        runs-on: ubuntu-latest

        steps:
            # 1. Checkout code
            - name: Checkout code
              uses: actions/checkout@v4

            # 2. Setup Node.js
            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm'

            # 3. Install dependencies
            - name: Install dependencies
              run: npm ci

            # 4. Run tests
            - name: Run tests
              run: npm test

            # 5. Run coverage
            - name: Generate coverage
              run: npm run test:coverage

            # 6. Upload coverage report
            - name: Upload coverage
              uses: codecov/codecov-action@v3
              with:
                  files: ./coverage/coverage-final.json
```

**Giải thích:**

```yaml
# name: Tên workflow hiển thị trên GitHub
name: Run Tests

# on: Trigger conditions
on:
    push: # Khi push code
        branches: [main] # Vào branch main
    pull_request: # Khi tạo PR
        branches: [main] # Vào main

# jobs: Các công việc cần làm
jobs:
    test: # Job name
        runs-on: ubuntu-latest # OS

        steps: # Các bước
            - uses: actions/checkout@v4
              # → Action có sẵn để checkout code

            - uses: actions/setup-node@v4
              # → Setup Node.js
              with:
                  node-version: '20' # Version
                  cache: 'npm' # Cache npm packages

            - run: npm ci
              # → Install dependencies (ci = clean install)

            - run: npm test
              # → Chạy tests
```

### 5.3 Vitest + GitHub Actions

**File: `.github/workflows/test.yml`**

```yaml
name: Vitest Tests

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v4

            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm'

            - name: Install dependencies
              run: npm ci

            - name: Run Vitest
              run: npm run test:run # vitest run (không watch mode)

            - name: Coverage
              run: npm run test:coverage

            - name: Upload coverage to Codecov
              uses: codecov/codecov-action@v3
              with:
                  file: ./coverage/coverage-final.json
                  fail_ci_if_error: true
```

### 5.4 Playwright + GitHub Actions

**File: `.github/workflows/playwright.yml`**

```yaml
name: Playwright Tests

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v4

            - uses: actions/setup-node@v4
              with:
                  node-version: '20'

            - name: Install dependencies
              run: npm ci

            - name: Install Playwright Browsers
              run: npx playwright install --with-deps

            - name: Run Playwright tests
              run: npx playwright test

            - name: Upload test results
              if: always() # Upload even if tests fail
              uses: actions/upload-artifact@v3
              with:
                  name: playwright-report
                  path: playwright-report/
                  retention-days: 30
```

### 5.5 Cypress + GitHub Actions

**File: `.github/workflows/cypress.yml`**

```yaml
name: Cypress Tests

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v4

            - name: Cypress run
              uses: cypress-io/github-action@v6
              with:
                  build: npm run build
                  start: npm start
                  wait-on: 'http://localhost:3000'
                  wait-on-timeout: 120

            - name: Upload screenshots
              if: failure()
              uses: actions/upload-artifact@v3
              with:
                  name: cypress-screenshots
                  path: cypress/screenshots

            - name: Upload videos
              if: always()
              uses: actions/upload-artifact@v3
              with:
                  name: cypress-videos
                  path: cypress/videos
```

### 5.6 Matrix Testing - Test nhiều versions

```yaml
name: Matrix Tests

on: [push, pull_request]

jobs:
    test:
        runs-on: ${{ matrix.os }}

        strategy:
            matrix:
                # Test trên nhiều OS
                os: [ubuntu-latest, windows-latest, macos-latest]
                # Test nhiều Node versions
                node-version: [18, 20, 21]

        steps:
            - uses: actions/checkout@v4

            - name: Setup Node.js ${{ matrix.node-version }}
              uses: actions/setup-node@v4
              with:
                  node-version: ${{ matrix.node-version }}

            - run: npm ci
            - run: npm test
```

**Giải thích:**

```yaml
strategy:
    matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18, 20, 21]
# → Tạo 9 jobs (3 OS × 3 Node versions)
# 1. Ubuntu + Node 18
# 2. Ubuntu + Node 20
# 3. Ubuntu + Node 21
# 4. Windows + Node 18
# ... và tiếp tục
```

### 5.7 Caching để tăng tốc

```yaml
name: Tests with Caching

on: [push]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v4

            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm' # Cache npm packages

            # Cache Playwright browsers
            - name: Cache Playwright browsers
              uses: actions/cache@v3
              with:
                  path: ~/.cache/ms-playwright
                  key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}

            - run: npm ci
            - run: npx playwright install
            - run: npx playwright test
```

### 5.8 Conditional Jobs - Chỉ deploy khi tests pass

```yaml
name: Test and Deploy

on:
    push:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
            - run: npm ci
            - run: npm test
            - run: npm run test:coverage

    deploy:
        # Chỉ chạy nếu job test thành công
        needs: test
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - name: Deploy to production
              run: |
                  echo "Deploying to production..."
                  # Deploy commands here
```

### 5.9 Environment Variables & Secrets

```yaml
name: Tests with Secrets

on: [push]

jobs:
    test:
        runs-on: ubuntu-latest

        # Environment variables
        env:
            NODE_ENV: test
            API_URL: https://api.example.com

        steps:
            - uses: actions/checkout@v4

            - uses: actions/setup-node@v4
              with:
                  node-version: '20'

            - name: Install dependencies
              run: npm ci

            - name: Run tests
              env:
                  # Secrets từ GitHub Settings
                  DATABASE_URL: ${{ secrets.DATABASE_URL }}
                  API_KEY: ${{ secrets.API_KEY }}
              run: npm test
```

**Setup secrets trên GitHub:**

```
1. Vào repository trên GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Thêm:
   - Name: DATABASE_URL
   - Value: postgresql://...
5. Save
```

### 5.10 Status Badge - Hiển thị status trên README

**Thêm vào `README.md`:**

```markdown
# My Project

![Tests](https://github.com/username/repo/actions/workflows/test.yml/badge.svg)
![Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)

## Description

...
```

**Kết quả:**

```
My Project

[✓ Tests passing]  [Coverage 85%]
```

### 5.11 Prevent merge nếu tests fail

**GitHub Settings:**

```
1. Repository Settings
2. Branches
3. Add branch protection rule
4. Branch name pattern: main
5. Check:
   ☑ Require status checks to pass before merging
   ☑ Require branches to be up to date before merging
6. Select status checks:
   ☑ test
   ☑ coverage
7. Save changes
```

**Kết quả:**

-   Pull Request không thể merge nếu tests fail
-   Buộc phải fix tests trước khi merge

### 5.12 Workflow phức tạp - Full CI/CD

**File: `.github/workflows/ci-cd.yml`**

```yaml
name: CI/CD Pipeline

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

# Define environment URLs
env:
    STAGING_URL: https://staging.example.com
    PRODUCTION_URL: https://example.com

jobs:
    # Job 1: Lint code
    lint:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm'
            - run: npm ci
            - run: npm run lint

    # Job 2: Unit tests
    unit-test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm'
            - run: npm ci
            - run: npm run test:run
            - name: Upload coverage
              uses: codecov/codecov-action@v3

    # Job 3: E2E tests
    e2e-test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
            - run: npm ci
            - run: npx playwright install --with-deps
            - run: npx playwright test
            - name: Upload test results
              if: always()
              uses: actions/upload-artifact@v3
              with:
                  name: playwright-report
                  path: playwright-report/

    # Job 4: Build
    build:
        needs: [lint, unit-test, e2e-test]
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm'
            - run: npm ci
            - run: npm run build
            - name: Upload build artifacts
              uses: actions/upload-artifact@v3
              with:
                  name: build
                  path: dist/

    # Job 5: Deploy to Staging
    deploy-staging:
        needs: build
        if: github.ref == 'refs/heads/develop'
        runs-on: ubuntu-latest
        environment:
            name: staging
            url: ${{ env.STAGING_URL }}
        steps:
            - uses: actions/checkout@v4
            - name: Download build
              uses: actions/download-artifact@v3
              with:
                  name: build
                  path: dist/
            - name: Deploy to Staging
              env:
                  DEPLOY_KEY: ${{ secrets.STAGING_DEPLOY_KEY }}
              run: |
                  echo "Deploying to staging..."
                  # rsync, scp, or deployment tool commands

    # Job 6: Deploy to Production
    deploy-production:
        needs: build
        if: github.ref == 'refs/heads/main'
        runs-on: ubuntu-latest
        environment:
            name: production
            url: ${{ env.PRODUCTION_URL }}
        steps:
            - uses: actions/checkout@v4
            - name: Download build
              uses: actions/download-artifact@v3
              with:
                  name: build
                  path: dist/
            - name: Deploy to Production
              env:
                  DEPLOY_KEY: ${{ secrets.PRODUCTION_DEPLOY_KEY }}
              run: |
                  echo "Deploying to production..."
                  # Deployment commands

    # Job 7: Notify on Slack
    notify:
        needs: [deploy-staging, deploy-production]
        if: always()
        runs-on: ubuntu-latest
        steps:
            - name: Send Slack notification
              uses: 8398a7/action-slack@v3
              with:
                  status: ${{ job.status }}
                  webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**Flow diagram:**

```
Push code
    ↓
┌───┴───┬────────┬──────────┐
│ Lint  │ Unit   │   E2E    │ ← Parallel
└───┬───┴────┬───┴─────┬────┘
    └────────┴─────────┘
           ↓
         Build
           ↓
    ┌──────┴──────┐
    │             │
Staging      Production  ← Based on branch
    │             │
    └──────┬──────┘
           ↓
        Notify
```

### 5.13 Local CI Testing với act

**act** = Chạy GitHub Actions locally

**Cài đặt:**

```bash
# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Windows
choco install act-cli
```

**Sử dụng:**

```bash
# List workflows
act -l

# Run workflow locally
act push

# Run specific job
act -j test

# Dry run (không chạy thật)
act -n

# Run với secrets
act -s GITHUB_TOKEN=your_token
```

**File `.actrc` (config act):**

```
-P ubuntu-latest=catthehacker/ubuntu:act-latest
--secret-file .secrets
```

**File `.secrets`:**

```
DATABASE_URL=postgresql://localhost/test
API_KEY=test_key_123
```

---

## 6. Best Practices Tổng Hợp

### 6.1 Testing Pyramid

```
        /\
       /E2E\          10% - Slow, expensive
      /------\              Test critical flows
     /Integr.\       20% - Medium speed
    /----------\           Test module interactions
   /  Unit Test \    70% - Fast, cheap
  /--------------\        Test individual functions
```

**Phân bổ tests:**

-   **70%** Unit tests - Fast, nhiều
-   **20%** Integration tests - Medium
-   **10%** E2E tests - Slow, ít

### 6.2 Khi nào dùng loại test nào?

| Scenario                | Test Type        |
| ----------------------- | ---------------- |
| Function logic đơn giản | Unit test        |
| Component rendering     | Unit test (RTL)  |
| Custom hooks            | Unit test        |
| API integration         | Integration test |
| Component + API         | Integration test |
| Full user flow          | E2E test         |
| Multi-page flow         | E2E test         |
| Critical business flow  | E2E test         |

### 6.3 Coverage Goals

| Code Type      | Min Coverage | Ideal Coverage |
| -------------- | ------------ | -------------- |
| Utils/Helpers  | 90%          | 95-100%        |
| Business logic | 85%          | 90-95%         |
| Components     | 75%          | 80-90%         |
| Pages          | 60%          | 70-80%         |
| Config files   | 0%           | 0-20%          |
| **Overall**    | **70%**      | **80-85%**     |

**Nhớ:** 100% coverage ≠ Good tests

### 6.4 CI/CD Best Practices

**✅ DO:**

```yaml
# 1. Cache dependencies
- uses: actions/setup-node@v4
  with:
    cache: 'npm'

# 2. Parallel jobs
jobs:
  lint: ...
  test: ...
  e2e: ...  # Chạy đồng thời

# 3. Fail fast
strategy:
  fail-fast: true  # Stop nếu 1 job fail

# 4. Matrix testing
strategy:
  matrix:
    node: [18, 20]
    os: [ubuntu, windows]

# 5. Upload artifacts
- uses: actions/upload-artifact@v3
  if: failure()  # Upload khi fail để debug
```

**❌ DON'T:**

```yaml
# 1. Không cache
- run: npm install  # Slow mỗi lần

# 2. Sequential jobs khi không cần
jobs:
  test:
    needs: lint  # Chỉ cần khi thật sự depend

# 3. Hardcode secrets
env:
  API_KEY: abc123  # BAD! Dùng secrets

# 4. Run mọi tests trên mọi branch
on:
  push:
    branches: '*'  # Waste resources

# 5. Không timeout
jobs:
  test:
    timeout-minutes: 60  # Cần có timeout
```

### 6.5 Test Naming Conventions

**Unit tests:**

```typescript
// Pattern: [Function/Method] [scenario] [expected result]

describe('calculateDiscount', () => {
    it('returns 0 for regular customers', () => {});
    it('returns 10% for members', () => {});
    it('returns 20% for VIP customers', () => {});
    it('throws error for negative price', () => {});
});
```

**Component tests:**

```typescript
// Pattern: [Component] [behavior] [condition]

describe('LoginForm', () => {
    it('renders all form fields', () => {});
    it('validates email format', () => {});
    it('disables submit button while loading', () => {});
    it('shows error message when login fails', () => {});
});
```

**E2E tests:**

```typescript
// Pattern: [User] [action] [expected outcome]

describe('E-commerce Checkout', () => {
    it('user can complete purchase flow', () => {});
    it('user receives error for invalid card', () => {});
    it('user can apply discount code', () => {});
});
```

### 6.6 Khi nào KHÔNG cần test?

**Không test:**

-   ❌ Third-party libraries (đã có tests)
-   ❌ Trivial getters/setters
-   ❌ Constants/Config
-   ❌ Types/Interfaces (TypeScript tự check)
-   ❌ Auto-generated code

**Example:**

```typescript
// ❌ KHÔNG cần test
export const API_URL = 'https://api.example.com';

// ❌ KHÔNG cần test
interface User {
    id: number;
    name: string;
}

// ❌ KHÔNG cần test
class User {
    getName() {
        return this.name; // Trivial getter
    }
}

// ✅ CẦN test
class User {
    getFullName() {
        return `${this.firstName} ${this.lastName}`.trim(); // Logic
    }
}
```

---

## 7. Troubleshooting - Xử Lý Lỗi Thường Gặp

### 7.1 Vitest Issues

**Lỗi: "Cannot find module"**

```typescript
// Lỗi
Error: Cannot find module '@/components/Button'

// Fix: Thêm vào vite.config.ts
export default defineConfig({
  test: {
    // ...
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Lỗi: "ReferenceError: document is not defined"**

```typescript
// Lỗi
ReferenceError: document is not defined

// Fix: Đảm bảo environment = 'jsdom'
export default defineConfig({
  test: {
    environment: 'jsdom',  // ← Cần có
  },
})
```

**Lỗi: "toBeInTheDocument is not a function"**

```typescript
// Lỗi
expect(...).toBeInTheDocument is not a function

// Fix: Import jest-dom trong setup.ts
import '@testing-library/jest-dom'
```

### 7.2 Playwright Issues

**Lỗi: "Executable doesn't exist"**

```bash
# Lỗi
browserType.launch: Executable doesn't exist

# Fix: Install browsers
npx playwright install
npx playwright install chromium
```

**Lỗi: "Timeout 30000ms exceeded"**

```typescript
// Lỗi
Timeout 30000ms exceeded

// Fix 1: Tăng timeout
test.setTimeout(60000)  // 60 seconds

// Fix 2: Use waitFor
await page.waitForSelector('.element', { timeout: 60000 })

// Fix 3: Check element exists
await expect(page.locator('.element')).toBeVisible({ timeout: 60000 })
```

**Lỗi: "Element is not visible"**

```typescript
// Lỗi
Element is not visible

// Fix: Wait for element
await page.waitForSelector('.element', { state: 'visible' })
await page.click('.element')

// Or use force
await page.click('.element', { force: true })
```

### 7.3 Cypress Issues

**Lỗi: "Timed out retrying"**

```typescript
// Lỗi
Timed out retrying: Expected to find element '.element'

// Fix: Increase timeout
cy.get('.element', { timeout: 10000 })

// Or wait explicitly
cy.wait(1000)
cy.get('.element')
```

**Lỗi: "element is detached from the DOM"**

```typescript
// Lỗi
Element is detached from the DOM

// Fix: Re-query element
cy.get('.parent').within(() => {
  cy.get('.child').click()  // Query mỗi lần dùng
})

// Not
const el = cy.get('.element')  // Don't store
el.click()  // Might be detached
```

### 7.4 GitHub Actions Issues

**Lỗi: "npm ERR! code ELIFECYCLE"**

```yaml
# Lỗi
npm ERR! Test failed

# Fix: Check logs
- run: npm test -- --reporter=verbose

# Or run locally
act push -j test
```

**Lỗi: "Secrets not found"**

```yaml
# Lỗi
Error: Secret DATABASE_URL not found
# Fix: Add secret in GitHub Settings
# Repository → Settings → Secrets → New secret
```

**Lỗi: "out of memory"**

```yaml
# Lỗi
JavaScript heap out of memory

# Fix: Increase memory
- run: NODE_OPTIONS=--max_old_space_size=4096 npm test
```

---

## 8. Resources & Tools

### 8.1 Documentation

**Testing Frameworks:**

-   [Vitest](https://vitest.dev/) - Modern test runner
-   [Jest](https://jestjs.io/) - Popular test framework
-   [Testing Library](https://testing-library.com/) - Component testing
-   [Playwright](https://playwright.dev/) - E2E testing
-   [Cypress](https://www.cypress.io/) - E2E testing

**CI/CD:**

-   [GitHub Actions](https://docs.github.com/en/actions)
-   [GitLab CI](https://docs.gitlab.com/ee/ci/)
-   [CircleCI](https://circleci.com/docs/)

### 8.2 Tools

**Coverage:**

-   [Codecov](https://codecov.io/) - Coverage reports
-   [Coveralls](https://coveralls.io/) - Coverage tracking

**Visual Testing:**

-   [Percy](https://percy.io/) - Visual regression testing
-   [Chromatic](https://www.chromatic.com/) - Storybook visual testing

**Performance:**

-   [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
-   [WebPageTest](https://www.webpagetest.org/)

**Debugging:**

-   [Playwright Inspector](https://playwright.dev/docs/debug)
-   [Cypress Dashboard](https://www.cypress.io/dashboard/)

### 8.3 Cheat Sheets

**Quick Reference:**

```bash
# Vitest
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # Coverage
npm run test:ui           # UI mode

# Playwright
npx playwright test       # Run all
npx playwright test --ui  # UI mode
npx playwright test --debug  # Debug
npx playwright show-report   # View report

# Cypress
npx cypress open          # Interactive
npx cypress run           # Headless
npx cypress run --spec "path/to/spec"

# GitHub Actions
git push                  # Trigger workflow
act push                  # Test locally
act -j test              # Run specific job
```

---

## 9. Tổng Kết

### 9.1 Checklist - Dự Án Testing Hoàn Chỉnh

**Setup:**

-   [ ] Cài đặt Vitest/Jest
-   [ ] Setup test environment (jsdom)
-   [ ] Configure coverage thresholds
-   [ ] Setup E2E tool (Playwright/Cypress)
-   [ ] Create GitHub Actions workflows

**Unit Tests:**

-   [ ] Test utilities/helpers (90%+ coverage)
-   [ ] Test business logic (85%+ coverage)
-   [ ] Test components (80%+ coverage)
-   [ ] Test custom hooks

**Integration Tests:**

-   [ ] Test API integrations
-   [ ] Test component + state management
-   [ ] Test forms với validation

**E2E Tests:**

-   [ ] Test critical user flows
-   [ ] Test authentication
-   [ ] Test checkout/payment flows
-   [ ] Test error scenarios

**CI/CD:**

-   [ ] Tests chạy tự động trên PR
-   [ ] Coverage reports uploaded
-   [ ] Branch protection rules enabled
-   [ ] Deploy automation setup

**Documentation:**

-   [ ] README có testing instructions
-   [ ] Status badges hiển thị
-   [ ] Contributing guide có test requirements

### 9.2 Learning Path

**Tuần 1-2: Foundations**

-   ✅ Học Unit testing với Vitest
-   ✅ Hiểu Coverage metrics
-   ✅ Practice test utilities và components

**Tuần 3-4: Advanced Unit Testing**

-   ✅ Test hooks và context
-   ✅ Mocking và spying
-   ✅ TDD practice

**Tuần 5-6: E2E Testing**

-   ✅ Học Playwright hoặc Cypress
-   ✅ Viết E2E tests cho critical flows
-   ✅ Debug và troubleshoot

**Tuần 7-8: CI/CD**

-   ✅ Setup GitHub Actions
-   ✅ Configure workflows
-   ✅ Optimize CI pipeline
-   ✅ Monitor và maintain

### 9.3 Key Takeaways

**Testing Strategy:**

```
70% Unit Tests    → Fast, nhiều, test logic
20% Integration   → Medium, test interactions
10% E2E Tests     → Slow, ít, test flows
```

**Coverage Goals:**

-   Critical code: 90-100%
-   Overall project: 70-85%
-   Quality > Quantity

**TDD Benefits:**

-   Better design
-   Fewer bugs
-   Confidence
-   Documentation

**CI/CD Advantages:**

-   Catch bugs early
-   Automated deployment
-   Consistent quality
-   Team productivity

### 9.4 Next Steps

**Nâng cao:**

1. **Performance Testing** - Lighthouse, WebPageTest
2. **Security Testing** - OWASP ZAP, Snyk
3. **A/B Testing** - Optimizely, Google Optimize
4. **Load Testing** - k6, Artillery
5. **Monitoring** - Sentry, LogRocket

**Best Practices:**

-   Test behavior, not implementation
-   Keep tests simple và maintainable
-   Write tests như user sử dụng
-   Mock sensibly
-   Review test coverage regularly

---

## 🎯 Bài Tập Cuối Khóa

### Project: E-commerce Testing Suite

**Requirements:**

1. **Unit Tests (70%)**

    - Test cart logic (add, remove, update quantity)
    - Test discount calculations
    - Test form validations
    - Test custom hooks (useCart, useAuth)

2. **Integration Tests (20%)**

    - Test checkout flow với API
    - Test user authentication
    - Test product search + filters

3. **E2E Tests (10%)**

    - Complete purchase flow
    - User registration + login
    - Password reset flow

4. **CI/CD**

    - Setup GitHub Actions
    - Run tests automatically
    - Deploy to staging/production
    - Coverage reports

5. **Coverage Target**
    - Overall: 75%+
    - Critical paths: 90%+

**Deliverables:**

-   [ ] Test suite với 50+ tests
-   [ ] Coverage report > 75%
-   [ ] Working CI/CD pipeline
-   [ ] README với test instructions
-   [ ] GitHub status badges

---

**Chúc bạn thành công với Advanced Testing! 🚀**
Hoàn thành hành trình từ basic testing đến advanced topics bao gồm Coverage, E2E, TDD và CI/CD. Tiếp tục practice và apply vào dự án thực tế!

Tài liệu đầy đủ về **Testing Nâng Cao** bao gồm:

## 📚 Nội dung đã cover:

### 1. **Test Coverage** ✅

-   Giải thích 4 loại coverage (Statement, Branch, Function, Line)
-   Ví dụ minh họa cụ thể
-   Setup với Vitest
-   Cách đọc coverage report
-   Best practices và targets

### 2. **E2E Testing với Playwright** ✅

-   Giới thiệu và so sánh
-   Cài đặt và config chi tiết
-   Locators và Actions
-   Assertions
-   Ví dụ Todo App và E-commerce flow
-   Commands để chạy tests

### 3. **E2E Testing với Cypress** ✅

-   Cài đặt và setup
-   Cypress syntax và commands
-   Custom commands
-   API intercepting (mock/stub)
-   Ví dụ E-commerce checkout
-   Troubleshooting

### 4. **Test-Driven Development (TDD)** ✅

-   Giải thích Red-Green-Refactor cycle
-   Ví dụ từ đơn giản (Calculator) đến phức tạp (Todo List)
-   TDD với React components
-   Best practices
-   Khi nào nên/không nên dùng TDD

### 5. **CI/CD Automation** ✅

-   GitHub Actions setup cơ bản
-   Workflows cho Vitest, Playwright, Cypress
-   Matrix testing (nhiều OS/Node versions)
-   Caching để tăng tốc
-   Secrets management
-   Workflow phức tạp (lint → test → build → deploy)
-   Status badges
-   Branch protection rules

### 6. **Best Practices Tổng Hợp** ✅

-   Testing pyramid (70-20-10)
-   Coverage goals theo loại code
-   Naming conventions
-   Troubleshooting common issues
-   Resources và tools

### 7. **Bài Tập Thực Hành** ✅

-   Project E-commerce testing suite
-   Checklist đầy đủ
-   Learning path 8 tuần

## 🎯 Điểm nổi bật:

-   ✅ Giải thích bằng tiếng Việt dễ hiểu
-   ✅ Code examples chi tiết với comments
-   ✅ Diagrams và visualizations
-   ✅ Troubleshooting section
-   ✅ Real-world examples (Todo, E-commerce)
-   ✅ Complete CI/CD workflows
-   ✅ Best practices và anti-patterns

Bây giờ bạn có thể:

1. Đo lường coverage và cải thiện chất lượng tests
2. Viết E2E tests với Playwright hoặc Cypress
3. Áp dụng TDD trong development
4. Setup CI/CD pipeline tự động test và deploy
