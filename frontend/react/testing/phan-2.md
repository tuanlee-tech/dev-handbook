# 🎓 Hướng Dẫn Testing cho React TypeScript - Phần 2

> **Unit Tests & Integration Tests - Từ Cơ Bản Đến Thành Thạo**

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
├─ PHẦN 2: UNIT & INTEGRATION TESTS (Phần này) 📍
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
└─ PHẦN 3: ADVANCED TESTING (Tiếp theo)
   ├─ Test Coverage
   ├─ E2E Testing (Playwright/Cypress)
   ├─ TDD (Test-Driven Development)
   └─ CI/CD Automation
```

---

## 📋 Mục Tiêu Phần 2

Sau khi hoàn thành phần này, bạn sẽ:

-   ✅ Thành thạo test React components phức tạp
-   ✅ Test forms, async operations, error handling
-   ✅ Mock APIs, modules, và external dependencies
-   ✅ Test Context API và React Router
-   ✅ Test state management (Redux/Zustand)
-   ✅ Viết Integration Tests
-   ✅ Apply best practices trong testing

---

## 1. 🧩 Testing React Components Nâng Cao

### 1.1 Testing Complex Forms với Validation

**RegistrationForm.tsx:**

```typescript
import { useState, FormEvent } from 'react';

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
}

interface RegistrationFormProps {
    onSubmit: (data: FormData) => Promise<void>;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Username validation
        if (!formData.username) {
            newErrors.username = 'Username là bắt buộc';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username phải có ít nhất 3 ký tự';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password là bắt buộc';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password phải có ít nhất 8 ký tự';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password không khớp';
        }

        // Terms validation
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await onSubmit(formData);
            setSuccess(true);
        } catch (err) {
            setSubmitError('Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div role='alert'>
                <h2>Đăng ký thành công!</h2>
                <p>Chào mừng, {formData.username}!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='username'>Username</label>
                <input
                    id='username'
                    type='text'
                    value={formData.username}
                    onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                    }
                    aria-invalid={!!errors.username}
                    aria-describedby={
                        errors.username ? 'username-error' : undefined
                    }
                />
                {errors.username && (
                    <span id='username-error' role='alert'>
                        {errors.username}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor='email'>Email</label>
                <input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                    <span id='email-error' role='alert'>
                        {errors.email}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor='password'>Password</label>
                <input
                    id='password'
                    type='password'
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    aria-invalid={!!errors.password}
                    aria-describedby={
                        errors.password ? 'password-error' : undefined
                    }
                />
                {errors.password && (
                    <span id='password-error' role='alert'>
                        {errors.password}
                    </span>
                )}
            </div>

            <div>
                <label htmlFor='confirmPassword'>Xác nhận Password</label>
                <input
                    id='confirmPassword'
                    type='password'
                    value={formData.confirmPassword}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                        })
                    }
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                        errors.confirmPassword ? 'confirm-error' : undefined
                    }
                />
                {errors.confirmPassword && (
                    <span id='confirm-error' role='alert'>
                        {errors.confirmPassword}
                    </span>
                )}
            </div>

            <div>
                <label>
                    <input
                        type='checkbox'
                        checked={formData.agreeTerms}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                agreeTerms: e.target.checked,
                            })
                        }
                        aria-invalid={!!errors.agreeTerms}
                        aria-describedby={
                            errors.agreeTerms ? 'terms-error' : undefined
                        }
                    />
                    Tôi đồng ý với điều khoản
                </label>
                {errors.agreeTerms && (
                    <span id='terms-error' role='alert'>
                        {errors.agreeTerms}
                    </span>
                )}
            </div>

            {submitError && <div role='alert'>{submitError}</div>}

            <button type='submit' disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
        </form>
    );
}
```

**RegistrationForm.test.tsx:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from './RegistrationForm';

describe('RegistrationForm', () => {
    describe('Rendering', () => {
        it('renders all form fields', () => {
            render(<RegistrationForm onSubmit={vi.fn()} />);

            expect(screen.getByLabelText('Username')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(
                screen.getByLabelText('Xác nhận Password')
            ).toBeInTheDocument();
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: /đăng ký/i })
            ).toBeInTheDocument();
        });
    });

    describe('Validation - Username', () => {
        it('shows error khi username rỗng', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            // Submit form mà không điền gì
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(
                screen.getByText('Username là bắt buộc')
            ).toBeInTheDocument();
        });

        it('shows error khi username quá ngắn', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            await user.type(screen.getByLabelText('Username'), 'ab');
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(
                screen.getByText('Username phải có ít nhất 3 ký tự')
            ).toBeInTheDocument();
        });

        it('no error khi username hợp lệ', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            await user.type(screen.getByLabelText('Username'), 'validuser');
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(screen.queryByText(/username/i)).not.toBeInTheDocument();
        });
    });

    describe('Validation - Email', () => {
        it('shows error khi email không hợp lệ', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            await user.type(screen.getByLabelText('Email'), 'invalid-email');
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
        });

        it('no error với email hợp lệ', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            await user.type(screen.getByLabelText('Email'), 'test@example.com');
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(
                screen.queryByText('Email không hợp lệ')
            ).not.toBeInTheDocument();
        });
    });

    describe('Validation - Password', () => {
        it('shows error khi password quá ngắn', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            await user.type(screen.getByLabelText('Password'), '1234567');
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(
                screen.getByText('Password phải có ít nhất 8 ký tự')
            ).toBeInTheDocument();
        });

        it('shows error khi passwords không khớp', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            await user.type(screen.getByLabelText('Password'), 'password123');
            await user.type(
                screen.getByLabelText('Xác nhận Password'),
                'different123'
            );
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(screen.getByText('Password không khớp')).toBeInTheDocument();
        });
    });

    describe('Validation - Terms', () => {
        it('shows error khi chưa đồng ý điều khoản', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(
                screen.getByText('Bạn phải đồng ý với điều khoản')
            ).toBeInTheDocument();
        });
    });

    describe('Submission', () => {
        it('calls onSubmit với data đúng khi form hợp lệ', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn().mockResolvedValue(undefined);

            render(<RegistrationForm onSubmit={mockSubmit} />);

            // Fill form
            await user.type(screen.getByLabelText('Username'), 'testuser');
            await user.type(screen.getByLabelText('Email'), 'test@example.com');
            await user.type(screen.getByLabelText('Password'), 'password123');
            await user.type(
                screen.getByLabelText('Xác nhận Password'),
                'password123'
            );
            await user.click(screen.getByRole('checkbox'));

            // Submit
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(mockSubmit).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                agreeTerms: true,
            });
        });

        it('shows loading state during submission', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn(
                () => new Promise((resolve) => setTimeout(resolve, 100))
            );

            render(<RegistrationForm onSubmit={mockSubmit} />);

            // Fill form hợp lệ
            await user.type(screen.getByLabelText('Username'), 'testuser');
            await user.type(screen.getByLabelText('Email'), 'test@example.com');
            await user.type(screen.getByLabelText('Password'), 'password123');
            await user.type(
                screen.getByLabelText('Xác nhận Password'),
                'password123'
            );
            await user.click(screen.getByRole('checkbox'));

            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(screen.getByRole('button')).toHaveTextContent(
                'Đang xử lý...'
            );
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('shows success message sau khi submit thành công', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi.fn().mockResolvedValue(undefined);

            render(<RegistrationForm onSubmit={mockSubmit} />);

            // Fill form
            await user.type(screen.getByLabelText('Username'), 'testuser');
            await user.type(screen.getByLabelText('Email'), 'test@example.com');
            await user.type(screen.getByLabelText('Password'), 'password123');
            await user.type(
                screen.getByLabelText('Xác nhận Password'),
                'password123'
            );
            await user.click(screen.getByRole('checkbox'));

            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            // Wait for success message
            expect(
                await screen.findByText('Đăng ký thành công!')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Chào mừng, testuser!')
            ).toBeInTheDocument();
        });

        it('shows error message khi submission fails', async () => {
            const user = userEvent.setup();
            const mockSubmit = vi
                .fn()
                .mockRejectedValue(new Error('Server error'));

            render(<RegistrationForm onSubmit={mockSubmit} />);

            // Fill form
            await user.type(screen.getByLabelText('Username'), 'testuser');
            await user.type(screen.getByLabelText('Email'), 'test@example.com');
            await user.type(screen.getByLabelText('Password'), 'password123');
            await user.type(
                screen.getByLabelText('Xác nhận Password'),
                'password123'
            );
            await user.click(screen.getByRole('checkbox'));

            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            expect(
                await screen.findByText('Đăng ký thất bại. Vui lòng thử lại.')
            ).toBeInTheDocument();
        });
    });

    describe('Error Clearing', () => {
        it('clears errors khi user sửa input', async () => {
            const user = userEvent.setup();
            render(<RegistrationForm onSubmit={vi.fn()} />);

            // Trigger validation error
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));
            expect(
                screen.getByText('Username là bắt buộc')
            ).toBeInTheDocument();

            // Type vào username
            await user.type(screen.getByLabelText('Username'), 'test');

            // Submit lại để trigger validation
            await user.click(screen.getByRole('button', { name: /đăng ký/i }));

            // Error về username đã biến mất
            expect(
                screen.queryByText('Username là bắt buộc')
            ).not.toBeInTheDocument();
        });
    });
});
```

---

## 2. 🎣 Testing Custom Hooks Nâng Cao

### 2.1 Hook với Complex State Logic

**useForm.ts:**

```typescript
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormConfig<T> {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
    onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit,
}: FormConfig<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>(
        {}
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        if (validate) {
            const fieldErrors = validate(values);
            setErrors(fieldErrors);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key as keyof T] = true;
            return acc;
        }, {} as Record<keyof T, boolean>);
        setTouched(allTouched);

        // Validate
        if (validate) {
            const fieldErrors = validate(values);
            setErrors(fieldErrors);

            if (Object.keys(fieldErrors).length > 0) {
                return;
            }
        }

        // Submit
        try {
            setIsSubmitting(true);
            await onSubmit(values);
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
    };
}
```

**useForm.test.ts:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';
import { ChangeEvent, FormEvent } from 'react';

describe('useForm Hook', () => {
    const createMockEvent = (
        name: string,
        value: any,
        type = 'text'
    ): ChangeEvent<HTMLInputElement> =>
        ({
            target: { name, value, type, checked: value } as any,
        } as ChangeEvent<HTMLInputElement>);

    const createMockSubmitEvent = (): FormEvent =>
        ({
            preventDefault: vi.fn(),
        } as any);

    describe('Initialization', () => {
        it('initializes với initial values', () => {
            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: '', email: '' },
                    onSubmit: vi.fn(),
                })
            );

            expect(result.current.values).toEqual({ username: '', email: '' });
            expect(result.current.errors).toEqual({});
            expect(result.current.touched).toEqual({});
            expect(result.current.isSubmitting).toBe(false);
        });
    });

    describe('handleChange', () => {
        it('updates text input value', () => {
            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: '' },
                    onSubmit: vi.fn(),
                })
            );

            act(() => {
                result.current.handleChange(
                    createMockEvent('username', 'john')
                );
            });

            expect(result.current.values.username).toBe('john');
        });

        it('updates checkbox value', () => {
            const { result } = renderHook(() =>
                useForm({
                    initialValues: { agree: false },
                    onSubmit: vi.fn(),
                })
            );

            act(() => {
                result.current.handleChange(
                    createMockEvent('agree', true, 'checkbox')
                );
            });

            expect(result.current.values.agree).toBe(true);
        });
    });

    describe('handleBlur', () => {
        it('marks field as touched', () => {
            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: '' },
                    onSubmit: vi.fn(),
                })
            );

            act(() => {
                result.current.handleBlur(createMockEvent('username', ''));
            });

            expect(result.current.touched.username).toBe(true);
        });

        it('triggers validation on blur', () => {
            const mockValidate = vi.fn(() => ({ username: 'Required' }));

            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: '' },
                    validate: mockValidate,
                    onSubmit: vi.fn(),
                })
            );

            act(() => {
                result.current.handleBlur(createMockEvent('username', ''));
            });

            expect(mockValidate).toHaveBeenCalled();
            expect(result.current.errors.username).toBe('Required');
        });
    });

    describe('handleSubmit', () => {
        it('calls onSubmit với valid data', async () => {
            const mockSubmit = vi.fn();

            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: 'john' },
                    onSubmit: mockSubmit,
                })
            );

            await act(async () => {
                await result.current.handleSubmit(createMockSubmitEvent());
            });

            expect(mockSubmit).toHaveBeenCalledWith({ username: 'john' });
        });

        it('does not call onSubmit khi có validation errors', async () => {
            const mockSubmit = vi.fn();
            const mockValidate = vi.fn(() => ({ username: 'Required' }));

            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: '' },
                    validate: mockValidate,
                    onSubmit: mockSubmit,
                })
            );

            await act(async () => {
                await result.current.handleSubmit(createMockSubmitEvent());
            });

            expect(mockSubmit).not.toHaveBeenCalled();
            expect(result.current.errors.username).toBe('Required');
        });

        it('sets isSubmitting during submission', async () => {
            const mockSubmit = vi.fn(
                () => new Promise((resolve) => setTimeout(resolve, 100))
            );

            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: 'john' },
                    onSubmit: mockSubmit,
                })
            );

            const submitPromise = act(async () => {
                await result.current.handleSubmit(createMockSubmitEvent());
            });

            // During submission
            expect(result.current.isSubmitting).toBe(true);

            await submitPromise;

            // After submission
            expect(result.current.isSubmitting).toBe(false);
        });

        it('marks all fields as touched on submit', async () => {
            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: '', email: '' },
                    onSubmit: vi.fn(),
                })
            );

            await act(async () => {
                await result.current.handleSubmit(createMockSubmitEvent());
            });

            expect(result.current.touched.username).toBe(true);
            expect(result.current.touched.email).toBe(true);
        });
    });

    describe('reset', () => {
        it('resets form to initial state', () => {
            const { result } = renderHook(() =>
                useForm({
                    initialValues: { username: '' },
                    onSubmit: vi.fn(),
                })
            );

            // Change values
            act(() => {
                result.current.handleChange(
                    createMockEvent('username', 'john')
                );
                result.current.handleBlur(createMockEvent('username', 'john'));
            });

            // Reset
            act(() => {
                result.current.reset();
            });

            expect(result.current.values).toEqual({ username: '' });
            expect(result.current.errors).toEqual({});
            expect(result.current.touched).toEqual({});
        });
    });
});
```

### 2.2 Hook với API Calls và Caching

**useQuery.ts:**

```typescript
import { useState, useEffect, useRef } from 'react';

interface UseQueryOptions<T> {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    cacheTime?: number; // milliseconds
}

interface UseQueryResult<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => void;
}

// Simple cache
const cache = new Map<string, { data: any; timestamp: number }>();

export function useQuery<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: UseQueryOptions<T> = {}
): UseQueryResult<T> {
    const {
        enabled = true,
        onSuccess,
        onError,
        cacheTime = 5 * 60 * 1000,
    } = options;

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const fetchCount = useRef(0);

    const fetchData = async () => {
        // Check cache
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < cacheTime) {
            setData(cached.data);
            return;
        }

        try {
            fetchCount.current += 1;
            setIsFetching(true);
            const result = await fetcher();

            // Update cache
            cache.set(key, { data: result, timestamp: Date.now() });

            setData(result);
            setError(null);
            onSuccess?.(result);
        } catch (err) {
            const error = err as Error;
            setError(error);
            onError?.(error);
        } finally {
            setIsFetching(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!enabled) return;

        setIsLoading(true);
        fetchData();
    }, [key, enabled]);

    const refetch = () => {
        // Clear cache for this key
        cache.delete(key);
        setIsLoading(true);
        fetchData();
    };

    return { data, error, isLoading, isFetching, refetch };
}
```

**useQuery.test.ts:**

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from './useQuery';

describe('useQuery Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('fetches data successfully', async () => {
        const mockFetcher = vi.fn().mockResolvedValue({ id: 1, name: 'Test' });

        const { result } = renderHook(() => useQuery('test-key', mockFetcher));

        // Initially loading
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBe(null);

        // Wait for data
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual({ id: 1, name: 'Test' });
        expect(result.current.error).toBe(null);
        expect(mockFetcher).toHaveBeenCalledTimes(1);
    });

    it('handles fetch error', async () => {
        const mockError = new Error('Fetch failed');
        const mockFetcher = vi.fn().mockRejectedValue(mockError);

        const { result } = renderHook(() => useQuery('test-key', mockFetcher));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toEqual(mockError);
        expect(result.current.data).toBe(null);
    });

    it('calls onSuccess callback', async () => {
        const mockData = { id: 1 };
        const mockFetcher = vi.fn().mockResolvedValue(mockData);
        const mockOnSuccess = vi.fn();

        renderHook(() =>
            useQuery('test-key', mockFetcher, { onSuccess: mockOnSuccess })
        );

        await waitFor(() => {
            expect(mockOnSuccess).toHaveBeenCalledWith(mockData);
        });
    });

    it('calls onError callback', async () => {
        const mockError = new Error('Failed');
        const mockFetcher = vi.fn().mockRejectedValue(mockError);
        const mockOnError = vi.fn();

        renderHook(() =>
            useQuery('test-key', mockFetcher, { onError: mockOnError })
        );

        await waitFor(() => {
            expect(mockOnError).toHaveBeenCalledWith(mockError);
        });
    });

    it('does not fetch khi enabled = false', async () => {
        const mockFetcher = vi.fn().mockResolvedValue({ id: 1 });

        const { result } = renderHook(() =>
            useQuery('test-key', mockFetcher, { enabled: false })
        );

        expect(result.current.isLoading).toBe(false);
        expect(mockFetcher).not.toHaveBeenCalled();
    });

    it('uses cached data within cache time', async () => {
        const mockFetcher = vi
            .fn()
            .mockResolvedValueOnce({ id: 1, name: 'First' })
            .mockResolvedValueOnce({ id: 2, name: 'Second' });

        // First render
        const { result: result1, unmount } = renderHook(() =>
            useQuery('cache-key', mockFetcher, { cacheTime: 60000 })
        );

        await waitFor(() => {
            expect(result1.current.data).toEqual({ id: 1, name: 'First' });
        });

        unmount();

        // Second render within cache time
        const { result: result2 } = renderHook(() =>
            useQuery('cache-key', mockFetcher, { cacheTime: 60000 })
        );

        // Should use cached data
        expect(result2.current.data).toEqual({ id: 1, name: 'First' });
        expect(mockFetcher).toHaveBeenCalledTimes(1); // Not called again
    });

    it('refetches data bypassing cache', async () => {
        const mockFetcher = vi
            .fn()
            .mockResolvedValueOnce({ id: 1 })
            .mockResolvedValueOnce({ id: 2 });

        const { result } = renderHook(() =>
            useQuery('refetch-key', mockFetcher)
        );

        await waitFor(() => {
            expect(result.current.data).toEqual({ id: 1 });
        });

        // Refetch
        result.current.refetch();

        await waitFor(() => {
            expect(result.current.data).toEqual({ id: 2 });
        });

        expect(mockFetcher).toHaveBeenCalledTimes(2);
    });

    it('refetches khi key changes', async () => {
        const mockFetcher = vi
            .fn()
            .mockResolvedValueOnce({ id: 1 })
            .mockResolvedValueOnce({ id: 2 });

        const { result, rerender } = renderHook(
            ({ key }) => useQuery(key, mockFetcher),
            { initialProps: { key: 'key-1' } }
        );

        await waitFor(() => {
            expect(result.current.data).toEqual({ id: 1 });
        });

        // Change key
        rerender({ key: 'key-2' });

        await waitFor(() => {
            expect(result.current.data).toEqual({ id: 2 });
        });

        expect(mockFetcher).toHaveBeenCalledTimes(2);
    });
});
```

---

## 3. 🔗 Integration Tests

### 3.1 Integration Test là gì?

**Khác biệt:**

```
Unit Test:       Test 1 component riêng lẻ
                 [Button] ✓

Integration:     Test nhiều components tương tác
                 [Form + Button + API + State] ✓
```

### 3.2 Test Component với Context API

**AuthContext.tsx:**

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        // Simulate API call
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const userData = await response.json();
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
```

**LoginPage.tsx:**

```typescript
import { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label='Email'
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label='Password'
                />
                {error && <div role='alert'>{error}</div>}
                <button type='submit' disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
```

**Dashboard.tsx:**

```typescript
import { useAuth } from './AuthContext';

export function Dashboard() {
    const { user, logout } = useAuth();

    if (!user) {
        return <div>Please login</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <p>Email: {user.email}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

**Integration Test:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { LoginPage } from './LoginPage';
import { Dashboard } from './Dashboard';

// Mock fetch
global.fetch = vi.fn();

// Helper để render với all providers
function renderWithProviders(ui: React.ReactElement) {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<LoginPage />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
                {ui}
            </AuthProvider>
        </BrowserRouter>
    );
}

describe('Auth Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('complete login flow - success', async () => {
        const user = userEvent.setup();

        // Mock successful login
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
            }),
        });

        renderWithProviders(<LoginPage />);

        // User fills form
        await user.type(screen.getByLabelText('Email'), 'john@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');

        // User submits
        await user.click(screen.getByRole('button', { name: /login/i }));

        // Should navigate to dashboard
        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
        });

        // Should display user info
        expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
        expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    });

    it('login flow - handles error', async () => {
        const user = userEvent.setup();

        // Mock failed login
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        renderWithProviders(<LoginPage />);

        await user.type(screen.getByLabelText('Email'), 'wrong@example.com');
        await user.type(screen.getByLabelText('Password'), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /login/i }));

        // Should show error
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Login failed');
        });

        // Should still be on login page
        expect(
            screen.getByRole('heading', { name: 'Login' })
        ).toBeInTheDocument();
    });

    it('logout flow', async () => {
        const user = userEvent.setup();

        // Mock successful login
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
            }),
        });

        renderWithProviders(
            <>
                <LoginPage />
                <Dashboard />
            </>
        );

        // Login
        await user.type(screen.getByLabelText('Email'), 'john@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
        });

        // Logout
        await user.click(screen.getByRole('button', { name: /logout/i }));

        // Should clear user data
        await waitFor(() => {
            expect(
                screen.queryByText('Welcome, John Doe!')
            ).not.toBeInTheDocument();
        });
    });
});
```

### 3.3 Test với React Router

**test-utils.tsx (Custom render với Router):**

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    initialRoute?: string;
}

function AllProviders({ children }: { children: React.ReactNode }) {
    return (
        <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
    );
}

export function renderWithRouter(
    ui: ReactElement,
    { initialRoute = '/', ...options }: CustomRenderOptions = {}
) {
    // Set initial route
    window.history.pushState({}, 'Test page', initialRoute);

    return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
```

**Navigation.test.tsx:**

```typescript
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './test-utils';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
    return (
        <div>
            <nav>
                <Link to='/'>Home</Link>
                <Link to='/about'>About</Link>
                <Link to='/contact'>Contact</Link>
            </nav>

            <Routes>
                <Route path='/' element={<h1>Home Page</h1>} />
                <Route path='/about' element={<h1>About Page</h1>} />
                <Route path='/contact' element={<h1>Contact Page</h1>} />
            </Routes>
        </div>
    );
}

describe('Navigation Integration', () => {
    it('renders home page by default', () => {
        renderWithRouter(<App />);

        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('navigates to about page', async () => {
        const user = userEvent.setup();
        renderWithRouter(<App />);

        await user.click(screen.getByText('About'));

        expect(screen.getByText('About Page')).toBeInTheDocument();
    });

    it('navigates to contact page', async () => {
        const user = userEvent.setup();
        renderWithRouter(<App />);

        await user.click(screen.getByText('Contact'));

        expect(screen.getByText('Contact Page')).toBeInTheDocument();
    });

    it('starts at specific route', () => {
        renderWithRouter(<App />, { initialRoute: '/about' });

        expect(screen.getByText('About Page')).toBeInTheDocument();
    });
});
```

---

## 4. 🗃️ Testing State Management

### 4.1 Test với Zustand

**store.ts:**

```typescript
import { create } from 'zustand';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

interface TodoStore {
    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
    clearCompleted: () => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
    todos: [],

    addTodo: (text) =>
        set((state) => ({
            todos: [...state.todos, { id: Date.now(), text, completed: false }],
        })),

    toggleTodo: (id) =>
        set((state) => ({
            todos: state.todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
        })),

    deleteTodo: (id) =>
        set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
        })),

    clearCompleted: () =>
        set((state) => ({
            todos: state.todos.filter((todo) => !todo.completed),
        })),
}));
```

**TodoList.tsx:**

```typescript
import { useTodoStore } from './store';

export function TodoList() {
    const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } =
        useTodoStore();
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim()) {
            addTodo(inputValue);
            setInputValue('');
        }
    };

    return (
        <div>
            <div>
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='Add todo'
                    aria-label='New todo'
                />
                <button onClick={handleAdd}>Add</button>
            </div>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <input
                            type='checkbox'
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            aria-label={`Toggle ${todo.text}`}
                        />
                        <span
                            style={{
                                textDecoration: todo.completed
                                    ? 'line-through'
                                    : 'none',
                            }}
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {todos.some((t) => t.completed) && (
                <button onClick={clearCompleted}>Clear Completed</button>
            )}
        </div>
    );
}
```

**TodoList.test.tsx:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from './TodoList';
import { useTodoStore } from './store';

describe('TodoList with Zustand', () => {
    beforeEach(() => {
        // Reset store trước mỗi test
        useTodoStore.setState({ todos: [] });
    });

    it('adds new todo', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        await user.type(screen.getByLabelText('New todo'), 'Buy milk');
        await user.click(screen.getByText('Add'));

        expect(screen.getByText('Buy milk')).toBeInTheDocument();
    });

    it('toggles todo completion', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        // Add todo
        await user.type(screen.getByLabelText('New todo'), 'Buy milk');
        await user.click(screen.getByText('Add'));

        const checkbox = screen.getByLabelText('Toggle Buy milk');
        const todoText = screen.getByText('Buy milk');

        // Not completed initially
        expect(checkbox).not.toBeChecked();
        expect(todoText).not.toHaveStyle({ textDecoration: 'line-through' });

        // Toggle
        await user.click(checkbox);

        expect(checkbox).toBeChecked();
        expect(todoText).toHaveStyle({ textDecoration: 'line-through' });
    });

    it('deletes todo', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        // Add todo
        await user.type(screen.getByLabelText('New todo'), 'Buy milk');
        await user.click(screen.getByText('Add'));

        expect(screen.getByText('Buy milk')).toBeInTheDocument();

        // Delete
        await user.click(screen.getByText('Delete'));

        expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    });

    it('clears completed todos', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        // Add multiple todos
        await user.type(screen.getByLabelText('New todo'), 'Task 1');
        await user.click(screen.getByText('Add'));

        await user.type(screen.getByLabelText('New todo'), 'Task 2');
        await user.click(screen.getByText('Add'));

        // Complete first todo
        await user.click(screen.getByLabelText('Toggle Task 1'));

        // Clear completed should appear
        expect(screen.getByText('Clear Completed')).toBeInTheDocument();

        await user.click(screen.getByText('Clear Completed'));

        // Task 1 should be gone
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
        // Task 2 should remain
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('store updates reflect across multiple components', async () => {
        const user = userEvent.setup();

        // Render 2 instances
        const { container } = render(
            <div>
                <TodoList />
                <TodoList />
            </div>
        );

        const inputs = screen.getAllByLabelText('New todo');
        const addButtons = screen.getAllByText('Add');

        // Add from first component
        await user.type(inputs[0], 'Shared todo');
        await user.click(addButtons[0]);

        // Both components should show the todo
        const todoTexts = screen.getAllByText('Shared todo');
        expect(todoTexts).toHaveLength(2);
    });
});
```

---

## 5. 📡 Testing API Integration

### 5.1 Mock Service Worker (MSW) Setup

**Cài đặt:**

```bash
npm install -D msw
```

**mocks/handlers.ts:**

```typescript
import { rest } from 'msw';

export const handlers = [
    // GET /api/users
    rest.get('/api/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            ])
        );
    }),

    // GET /api/users/:id
    rest.get('/api/users/:id', (req, res, ctx) => {
        const { id } = req.params;
        return res(
            ctx.status(200),
            ctx.json({
                id: Number(id),
                name: 'John Doe',
                email: 'john@example.com',
            })
        );
    }),

    // POST /api/users
    rest.post('/api/users', async (req, res, ctx) => {
        const body = await req.json();
        return res(
            ctx.status(201),
            ctx.json({
                id: 3,
                ...body,
            })
        );
    }),

    // DELETE /api/users/:id
    rest.delete('/api/users/:id', (req, res, ctx) => {
        return res(ctx.status(204));
    }),
];
```

**mocks/server.ts:**

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**test/setup.ts (update):**

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from '../mocks/server';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Start MSW server
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());
```

### 5.2 Test Component với API

**UserList.tsx:**

```typescript
import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

export function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/users')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(setUsers)
            .catch(() => setError('Failed to load users'))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');

            setUsers(users.filter((u) => u.id !== id));
        } catch {
            setError('Failed to delete user');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div role='alert'>{error}</div>;

    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <button onClick={() => handleDelete(user.id)}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

**UserList.test.tsx:**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { UserList } from './UserList';

describe('UserList with MSW', () => {
    it('fetches and displays users', async () => {
        render(<UserList />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText('Delete');
        await user.click(deleteButtons[0]);

        // Error message should appear
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(
                'Failed to delete user'
            );
        });
    });
});
```

---

## 6. 🎨 Testing Conditional Rendering

### 6.1 Test Loading States

**ProductCard.tsx:**

```typescript
import { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

export function ProductCard({ productId }: { productId: number }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);

        fetch(`/api/products/${productId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(setProduct)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [productId]);

    if (loading) {
        return <div data-testid='loading'>Loading product...</div>;
    }

    if (error) {
        return (
            <div role='alert'>
                Failed to load product
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div data-testid='product-card'>
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <button>Add to Cart</button>
        </div>
    );
}
```

**ProductCard.test.tsx:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { ProductCard } from './ProductCard';

describe('ProductCard Conditional Rendering', () => {
    beforeEach(() => {
        // Setup default successful response
        server.use(
            rest.get('/api/products/:id', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        id: 1,
                        name: 'iPhone 15',
                        price: 999,
                        image: '/images/iphone.jpg',
                    })
                );
            })
        );
    });

    it('shows loading state initially', () => {
        render(<ProductCard productId={1} />);

        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.getByText('Loading product...')).toBeInTheDocument();
    });

    it('shows product after loading', async () => {
        render(<ProductCard productId={1} />);

        // Initially loading
        expect(screen.getByTestId('loading')).toBeInTheDocument();

        // Wait for product to load
        await waitFor(() => {
            expect(screen.getByTestId('product-card')).toBeInTheDocument();
        });

        expect(screen.getByText('iPhone 15')).toBeInTheDocument();
        expect(screen.getByText('$999')).toBeInTheDocument();
        expect(
            screen.getByRole('img', { name: 'iPhone 15' })
        ).toBeInTheDocument();
    });

    it('shows error state on fetch failure', async () => {
        // Mock error response
        server.use(
            rest.get('/api/products/:id', (req, res, ctx) => {
                return res(ctx.status(500));
            })
        );

        render(<ProductCard productId={1} />);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.getByText('Failed to load product')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Retry' })
        ).toBeInTheDocument();
    });

    it('shows not found when product is null', async () => {
        server.use(
            rest.get('/api/products/:id', (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(null));
            })
        );

        render(<ProductCard productId={999} />);

        await waitFor(() => {
            expect(screen.getByText('Product not found')).toBeInTheDocument();
        });
    });

    it('refetches when productId changes', async () => {
        const { rerender } = render(<ProductCard productId={1} />);

        await waitFor(() => {
            expect(screen.getByText('iPhone 15')).toBeInTheDocument();
        });

        // Change product ID
        server.use(
            rest.get('/api/products/2', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        id: 2,
                        name: 'MacBook Pro',
                        price: 1999,
                        image: '/images/macbook.jpg',
                    })
                );
            })
        );

        rerender(<ProductCard productId={2} />);

        // Should show loading again
        expect(screen.getByTestId('loading')).toBeInTheDocument();

        // Then new product
        await waitFor(() => {
            expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
        });
    });
});
```

---

## 7. 🧪 Testing Error Boundaries

**ErrorBoundary.tsx:**

```typescript
import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div role='alert'>
                    <h2>Something went wrong</h2>
                    <details>
                        <summary>Error details</summary>
                        <pre>{this.state.error?.message}</pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
```

**BuggyComponent.tsx:**

```typescript
export function BuggyComponent({ shouldThrow }: { shouldThrow?: boolean }) {
    if (shouldThrow) {
        throw new Error('Component crashed!');
    }

    return <div>Working fine</div>;
}
```

**ErrorBoundary.test.tsx:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { BuggyComponent } from './BuggyComponent';

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // Suppress console.error for these tests
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <BuggyComponent shouldThrow={false} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Working fine')).toBeInTheDocument();
    });

    it('catches error and shows fallback', () => {
        render(
            <ErrorBoundary>
                <BuggyComponent shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Component crashed!')).toBeInTheDocument();
    });

    it('renders custom fallback', () => {
        render(
            <ErrorBoundary fallback={<div>Custom error message</div>}>
                <BuggyComponent shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
});
```

---

## 8. 🎯 Best Practices

### 8.1 Test Organization

```typescript
describe('Component/Feature Name', () => {
    describe('Rendering', () => {
        it('renders correctly with default props');
        it('renders with custom props');
        it('renders different variants');
    });

    describe('User Interactions', () => {
        it('handles click events');
        it('handles form submission');
        it('handles keyboard navigation');
    });

    describe('State Management', () => {
        it('updates state on user action');
        it('syncs with external state');
    });

    describe('API Integration', () => {
        it('fetches data on mount');
        it('handles loading state');
        it('handles error state');
    });

    describe('Edge Cases', () => {
        it('handles empty data');
        it('handles invalid props');
        it('handles network errors');
    });
});
```

### 8.2 Testing Checklist

**Cho mỗi Component, test:**

-   [ ] **Rendering**
    -   Renders với props mặc định
    -   Renders với props khác nhau
    -   Renders children correctly
-   [ ] **User Interactions**
    -   Click handlers work
    -   Form submissions work
    -   Keyboard navigation works
-   [ ] **State Changes**
    -   Local state updates correctly
    -   Global state syncs
    -   Props changes trigger re-render
-   [ ] **Async Operations**
    -   Loading states
    -   Success states
    -   Error states
-   [ ] **Edge Cases**
    -   Empty data
    -   Invalid input
    -   Network failures
-   [ ] **Accessibility**
    -   Screen reader labels
    -   Keyboard navigation
    -   ARIA attributes

### 8.3 Common Patterns

**Pattern 1: Setup và Teardown**

```typescript
describe('Component', () => {
    let mockFn: any;

    beforeEach(() => {
        // Setup trước mỗi test
        mockFn = vi.fn();
        // Reset mocks
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Cleanup sau mỗi test
        vi.restoreAllMocks();
    });

    it('test case', () => {
        // Test code
    });
});
```

**Pattern 2: Shared Test Data**

```typescript
describe('UserProfile', () => {
    const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
    };

    const renderWithUser = (user = mockUser) => {
        return render(<UserProfile user={user} />);
    };

    it('displays user name', () => {
        renderWithUser();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays user email', () => {
        renderWithUser();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
});
```

**Pattern 3: Test Utilities**

```typescript
// test-utils.ts
export function fillLoginForm(email: string, password: string) {
    return async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(screen.getByLabelText('Email'), email);
        await user.type(screen.getByLabelText('Password'), password);
        await user.click(screen.getByRole('button', { name: /login/i }));
    };
}

// Sử dụng:
it('logs in user', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await fillLoginForm('test@example.com', 'password123')(user);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
});
```

### 8.4 Tránh Anti-patterns

**❌ DON'T:**

```typescript
// 1. Test implementation details
it('updates state variable', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0); // Testing internal state
});

// 2. Test multiple things in one test
it('does everything', async () => {
    // Adds item
    // Edits item
    // Deletes item
    // Too much in one test!
});

// 3. Use brittle selectors
expect(container.querySelector('.some-class > div:nth-child(2)')).toBeTruthy();

// 4. Not clean up
it('test 1', () => {
    const spy = vi.spyOn(console, 'log');
    // Forgot to restore!
});

// 5. Không wait for async
it('fetches data', () => {
    render(<Component />);
    expect(screen.getByText('Data')).toBeInTheDocument(); // Will fail!
});
```

**✅ DO:**

```typescript
// 1. Test behavior
it('increments count when button clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByText('Increment'));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

// 2. One behavior per test
it('adds item to list', async () => {
    // Just test adding
});

it('edits item in list', async () => {
    // Just test editing
});

// 3. Use semantic queries
expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();

// 4. Clean up properly
afterEach(() => {
    vi.restoreAllMocks();
});

// 5. Wait for async operations
it('fetches data', async () => {
    render(<Component />);

    expect(await screen.findByText('Data')).toBeInTheDocument();
});
```

---

## 9. 📊 Code Examples - Complete Integration Test

### 9.1 E-commerce Cart Flow

**Full integration test cho shopping cart:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { App } from './App'; // Main app component

describe('E-commerce Cart Integration', () => {
    beforeEach(() => {
        // Setup products API
        server.use(
            rest.get('/api/products', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json([
                        { id: 1, name: 'iPhone 15', price: 999, stock: 10 },
                        { id: 2, name: 'MacBook Pro', price: 1999, stock: 5 },
                        { id: 3, name: 'AirPods Pro', price: 249, stock: 20 },
                    ])
                );
            }),

            rest.post('/api/cart', async (req, res, ctx) => {
                const body = await req.json();
                return res(ctx.status(200), ctx.json(body));
            }),

            rest.post('/api/checkout', async (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({ orderId: '12345', status: 'success' })
                );
            })
        );
    });

    it('complete shopping flow: browse → add to cart → checkout', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Step 1: Browse products
        await waitFor(() => {
            expect(screen.getByText('iPhone 15')).toBeInTheDocument();
        });

        expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
        expect(screen.getByText('AirPods Pro')).toBeInTheDocument();

        // Step 2: Add items to cart
        const iphoneCard = screen.getByText('iPhone 15').closest('div')!;
        const addButton1 = within(iphoneCard).getByRole('button', {
            name: /add to cart/i,
        });
        await user.click(addButton1);

        // Cart badge should update
        expect(screen.getByTestId('cart-badge')).toHaveTextContent('1');

        // Add another item
        const macbookCard = screen.getByText('MacBook Pro').closest('div')!;
        const addButton2 = within(macbookCard).getByRole('button', {
            name: /add to cart/i,
        });
        await user.click(addButton2);

        expect(screen.getByTestId('cart-badge')).toHaveTextContent('2');

        // Step 3: Go to cart
        await user.click(screen.getByLabelText('Cart'));

        // Verify cart items
        expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
        expect(screen.getByText('iPhone 15')).toBeInTheDocument();
        expect(screen.getByText('MacBook Pro')).toBeInTheDocument();

        // Verify prices
        expect(screen.getByText('$999')).toBeInTheDocument();
        expect(screen.getByText('$1999')).toBeInTheDocument();

        // Verify total
        expect(screen.getByText('Total: $2998')).toBeInTheDocument();

        // Step 4: Update quantity
        const quantityInput = within(
            screen.getByText('iPhone 15').closest('div')!
        ).getByRole('spinbutton');

        await user.clear(quantityInput);
        await user.type(quantityInput, '2');

        // Total should update
        await waitFor(() => {
            expect(screen.getByText('Total: $3997')).toBeInTheDocument();
        });

        // Step 5: Proceed to checkout
        await user.click(screen.getByRole('button', { name: /checkout/i }));

        // Step 6: Fill shipping info
        expect(screen.getByText('Checkout')).toBeInTheDocument();

        await user.type(screen.getByLabelText('Full Name'), 'John Doe');
        await user.type(screen.getByLabelText('Email'), 'john@example.com');
        await user.type(screen.getByLabelText('Address'), '123 Main St');
        await user.type(screen.getByLabelText('City'), 'New York');
        await user.selectOptions(screen.getByLabelText('Country'), 'US');

        // Step 7: Fill payment info
        await user.type(
            screen.getByLabelText('Card Number'),
            '4242424242424242'
        );
        await user.type(screen.getByLabelText('Expiry'), '12/25');
        await user.type(screen.getByLabelText('CVV'), '123');

        // Step 8: Place order
        await user.click(screen.getByRole('button', { name: /place order/i }));

        // Step 9: Verify success
        await waitFor(() => {
            expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
        });

        expect(screen.getByText(/order #12345/i)).toBeInTheDocument();

        // Cart should be empty
        expect(screen.getByTestId('cart-badge')).toHaveTextContent('0');
    });

    it('handles out of stock items', async () => {
        const user = userEvent.setup();

        // Mock out of stock product
        server.use(
            rest.get('/api/products', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json([
                        { id: 1, name: 'iPhone 15', price: 999, stock: 0 },
                    ])
                );
            })
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('iPhone 15')).toBeInTheDocument();
        });

        // Add to cart button should be disabled
        const addButton = screen.getByRole('button', { name: /add to cart/i });
        expect(addButton).toBeDisabled();
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('applies discount code', async () => {
        const user = userEvent.setup();

        server.use(
            rest.post('/api/validate-coupon', async (req, res, ctx) => {
                const { code } = await req.json();
                if (code === 'SAVE10') {
                    return res(ctx.status(200), ctx.json({ discount: 10 }));
                }
                return res(
                    ctx.status(400),
                    ctx.json({ error: 'Invalid code' })
                );
            })
        );

        render(<App />);

        // Add item and go to cart
        await waitFor(() => {
            expect(screen.getByText('iPhone 15')).toBeInTheDocument();
        });

        await user.click(screen.getByRole('button', { name: /add to cart/i }));
        await user.click(screen.getByLabelText('Cart'));

        // Apply coupon
        await user.type(screen.getByPlaceholderText('Coupon code'), 'SAVE10');
        await user.click(screen.getByRole('button', { name: /apply/i }));

        // Verify discount
        await waitFor(() => {
            expect(screen.getByText('Discount: -$99.90')).toBeInTheDocument();
        });

        expect(screen.getByText('Total: $899.10')).toBeInTheDocument();
    });
});
```

---

## 10. 📚 Tổng Kết & Next Steps

### 10.1 Kiến Thức Đã Học

✅ **Unit Tests:**

-   Test React components phức tạp
-   Test forms với validation
-   Test custom hooks
-   Test async operations
-   Mock APIs và modules

✅ **Integration Tests:**

-   Test component interactions
-   Test với Context API
-   Test với React Router
-   Test state management (Zustand/Redux)
-   Test full user flows

✅ **Best Practices:**

-   Test organization
-   Error handling
-   Conditional rendering
-   MSW cho API mocking
-   Test utilities và patterns

### 10.2 Checklist Hoàn Chỉnh

**Cho mỗi feature, đảm bảo:**

-   [ ] Unit tests cho tất cả components
-   [ ] Unit tests cho tất cả hooks
-   [ ] Unit tests cho utilities
-   [ ] Integration tests cho user flows
-   [ ] API mocking với MSW
-   [ ] Error boundary tests
-   [ ] Loading state tests
-   [ ] Edge case tests
-   [ ] Accessibility tests

### 10.3 Bài Tập Thực Hành

**Project: Todo App với Full Testing**

Tạo Todo App với:

1. Add/Edit/Delete todos
2. Mark as complete
3. Filter (All/Active/Completed)
4. Persist to API
5. User authentication

**Requirements:**

-   [ ] 30+ unit tests
-   [ ] 10+ integration tests
-   [ ] Test coverage > 80%
-   [ ] MSW cho API mocking
-   [ ] Error handling tests
-   [ ] Loading state tests

### 10.4 Resources

**Đọc thêm:**

-   [Testing Library Docs](https://testing-library.com/)
-   [React Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
-   [MSW Documentation](https://mswjs.io/)

---

Hoàn thành! 🎉 Đã chuyển đổi tài liệu gốc thành **Phần 2** của khóa học testing.

## 📚 Tổng kết những gì đã làm:

### ✅ Cấu trúc:

-   **Phần 1**: Foundations (đã học trước đó)
-   **Phần 2**: Unit & Integration Tests (tài liệu này) 📍
-   **Phần 3**: Advanced Testing (tiếp theo)

### ✅ Nội dung Phần 2 bao gồm:

1. **Testing React Components Nâng Cao**

    - Complex forms với multi-field validation
    - Conditional rendering states
    - Error boundaries

2. **Testing Custom Hooks Nâng Cao**

    - `useForm` hook với validation
    - `useQuery` hook với caching
    - Hooks với dependencies

3. **Integration Tests**

    - Component + Context API
    - Component + React Router
    - Multiple components working together

4. **State Management Testing**

    - Zustand store tests
    - Multi-component state sync

5. **API Integration Testing**

    - MSW (Mock Service Worker) setup
    - Mock API handlers
    - Test loading/error states

6. **Advanced Patterns**

    - Error boundary testing
    - Conditional rendering tests
    - Full e-commerce flow integration test

7. **Best Practices**
    - Test organization
    - Common patterns
    - Anti-patterns to avoid
    - Testing checklist

### 🎯 Điểm nổi bật:

-   ✅ Real-world examples (Registration form, Shopping cart)
-   ✅ Complete integration test (E-commerce flow)
-   ✅ MSW setup chi tiết
-   ✅ Testing checklist đầy đủ
-   ✅ Bài tập thực hành
