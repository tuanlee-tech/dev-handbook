# HƯỚNG DẪN CẤU HÌNH HỆ THỐNG WEB PRODUCTION

## ReactJS (SPA) & Next.js (SSR) + Backend Node.js/Express

> **Mục tiêu:** Xây dựng hệ thống đạt chuẩn Production với 3 trụ cột: **Bảo mật (Security)**, **Hiệu năng (Performance)**, **Môi trường Network (Zero-Trust Networking)**.

---

## MỤC LỤC

1. [Kiến trúc tổng quan & Luồng dữ liệu](#1-kiến-trúc-tổng-quan)
2. [Mô hình 1: ReactJS (Vite) + Backend + Nginx](#2-mô-hình-1-reactjs--backend)
   - 2.1. Cấu trúc dự án
   - 2.2. Backend (Node.js/Express) - Code đầy đủ
   - 2.3. Frontend (React + Vite) - Code đầy đủ
   - 2.4. Nginx Production Config
   - 2.5. Docker & Docker Compose
   - 2.6. PM2 Ecosystem
3. [Mô hình 2: Next.js 14 (App Router) + Backend](#3-mô-hình-2-nextjs--backend)
   - 3.1. Cấu trúc dự án
   - 3.2. Backend (Internal API)
   - 3.3. Next.js Server/Client Components
   - 3.4. Route Handlers & Middleware
   - 3.5. Auth Flow qua Server Actions
   - 3.6. `next.config.js` hoàn chỉnh
4. [Checklist Go-Live Production](#4-checklist-go-live)
   - 4.1. Security Headers & CSP
   - 4.2. SSL/TLS Let's Encrypt
   - 4.3. PM2 Cluster Mode
   - 4.4. CDN & Caching
   - 4.5. Database & Connection Pool
   - 4.6. Logging & Monitoring
5. [PostgreSQL + Prisma ORM](#5-postgresql--prisma-orm)
   - 5.1. Schema & Migration
   - 5.2. Repository Pattern
   - 5.3. Connection Pool & Transaction
   - 5.4. Seeding & Backup
6. [Redis Session Store](#6-redis-session-store)
   - 6.1. Redis cho Session & Token Blacklist
   - 6.2. Redis Cache Layer
   - 6.3. Rate Limiting với Redis
7. [WebSocket (Socket.io) Production](#7-websocket-socketio-production)
   - 7.1. Socket.io với Redis Adapter
   - 7.2. Auth qua WebSocket
   - 7.3. Scale horizontally
8. [CI/CD với GitHub Actions](#8-cicd-với-github-actions)
   - 8.1. Backend CI Pipeline
   - 8.2. Frontend CI Pipeline
   - 8.3. Auto Deploy với SSH/Docker
   - 8.4. Semantic Versioning & Changelog
9. [Kubernetes Deployment](#9-kubernetes-deployment)
   - 9.1. K8s Architecture Overview
   - 9.2. Namespace & ConfigMap/Secret
   - 9.3. Deployments & Services
   - 9.4. Ingress Controller (Nginx)
   - 9.5. Horizontal Pod Autoscaler (HPA)
   - 9.6. Cert-Manager (Let's Encrypt)
   - 9.7. Helm Chart
10. [Monitoring & Observability](#10-monitoring--observability)
    - 10.1. Prometheus + Grafana
    - 10.2. Loki (Log Aggregation)
    - 10.3. Jaeger/Zipkin (Distributed Tracing)
    - 10.4. Uptime Alert (PagerDuty/Opsgenie)

---

## 1. Kiến trúc tổng quan

### Sơ đồ luồng dữ liệu

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET / USER                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS (443)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  REVERSE PROXY (Nginx)                                           │
│  - SSL Termination                                               │
│  - Rate Limiting                                                 │
│  - Static File Serving                                           │
│  - API Proxy Pass                                                │
└──────────┬─────────────────────────────┬──────────────────────────┘
           │                             │
           ▼                             ▼
┌──────────────────┐         ┌──────────────────────────────┐
│  ReactJS SPA     │         │  Backend API (Node.js)       │
│  (Vite Build)    │         │  - Auth (HttpOnly Cookie)    │
│  /var/www/dist   │         │  - Business Logic            │
│                  │         │  - Database                  │
└──────────────────┘         └──────────────────────────────┘
```

### Nguyên tắc vàng

| #   | Nguyên tắc                                        | Giải thích                                                                                 |
| --- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | **Không bao giờ expose Backend port ra Internet** | Chỉ mở port 80/443 của Nginx. Backend chỉ listen `127.0.0.1` hoặc internal Docker network. |
| 2   | **Không lưu JWT vào LocalStorage**                | Dùng `HttpOnly`, `Secure`, `SameSite=Strict` Cookie để chống XSS 100%.                     |
| 3   | **Không dùng `Access-Control-Allow-Origin: *`**   | Chỉ whitelist domain chính xác.                                                            |
| 4   | **Không để secret lộ ra client**                  | Mọi API Key, DB_URL, JWT_SECRET chỉ tồn tại trên Server.                                   |
| 5   | **HTTPS everywhere**                              | Ép buộc redirect HTTP→HTTPS. HSTS header bật.                                              |

---

## 2. Mô hình 1: ReactJS (Vite) + Backend

> **Đặc điểm:** React chạy 100% client-side. Không có lớp server trung gian. Mọi secret đều phải giấu qua Nginx Proxy.

### 2.1. Cấu trúc thư mục dự án

```
my-production-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── users.js
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   └── app.js
│   ├── .env.production
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js
│   │   ├── components/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── router/
│   │   │   └── index.jsx
│   │   └── main.jsx
│   ├── .env.production
│   ├── vite.config.js
│   └── package.json
├── nginx/
│   └── my-app.conf
├── docker-compose.yml
└── ecosystem.config.js
```

### 2.2. Backend - Node.js/Express (Code đầy đủ)

#### `backend/package.json`

```json
{
  "name": "backend-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "cookie-parser": "^1.4.6",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0"
  }
}
```

#### `backend/.env.production`

```
# ===== SERVER =====
PORT=5000
NODE_ENV=production

# ===== SECURITY =====
JWT_SECRET=your-super-secret-long-random-key-min-32-chars
JWT_REFRESH_SECRET=another-super-secret-refresh-key-here
COOKIE_SECRET=cookie-signing-secret-here

# CORS - Chỉ cho phép domain chính thức
ALLOWED_ORIGINS=https://domain.com,https://www.domain.com

# ===== DATABASE (Ví dụ PostgreSQL qua connection pool) =====
# DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
```

#### `backend/src/utils/jwt.js`

```javascript
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRY = '15m'; // Ngắn hạn
const REFRESH_TOKEN_EXPIRY = '7d'; // Dài hạn

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'my-app-backend',
    audience: 'my-app-frontend',
  });

  const refreshToken = jwt.sign(
    { sub: payload.sub, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'my-app-backend',
    audience: 'my-app-frontend',
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
```

#### `backend/src/middleware/auth.js`

```javascript
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Middleware xác thực JWT từ HttpOnly Cookie
 * Không đọc từ Header Authorization (vì SPA dùng cookie)
 */
export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    // Token hết hạn hoặc không hợp lệ
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      code: 'TOKEN_EXPIRED',
    });
  }
};

/**
 * Middleware phân quyền đơn giản
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions',
      });
    }
    next();
  };
};
```

#### `backend/src/middleware/rateLimiter.js`

```javascript
import rateLimit from 'express-rate-limit';

// Giới hạn API chung: 100 request / 15 phút / IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  // Bỏ qua rate limit cho health check
  skip: (req) => req.path === '/api/health',
});

// Giới hạn Auth endpoint nghiêm ngặt hơn: 10 request / 15 phút
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});
```

#### `backend/src/middleware/errorHandler.js`

```javascript
import winston from 'winston';

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console(),
  ],
});

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?.sub || 'anonymous',
  });

  // Không leak stack trace ra client trong production
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};

export { logger };
```

#### `backend/src/routes/auth.js`

```javascript
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../utils/jwt.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Mock database - Thay bằng PostgreSQL/MySQL thực tế
const users = [
  {
    id: 1,
    email: 'admin@domain.com',
    password: '$2a$10$...', // bcrypt hash của 'password123'
    role: 'admin',
    name: 'Administrator',
  },
];

/**
 * POST /api/auth/login
 * Đăng nhập → Set HttpOnly Cookie
 */
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' });
    }

    // Tìm user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // So sánh password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Tạo token
    const { accessToken, refreshToken } = generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Set Cookie BẢO MẬT
    const cookieOptions = {
      httpOnly: true, // Không thể đọc bằng JavaScript (chống XSS)
      secure: true, // Chỉ gửi qua HTTPS
      sameSite: 'strict', // Chống CSRF
      maxAge: 15 * 60 * 1000, // 15 phút (match với access token expiry)
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    // Trả về thông tin user (KHÔNG trả token trong body)
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh
 * Làm mới access token bằng refresh token
 */
router.post('/refresh', (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: 'No refresh token' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = users.find((u) => u.id === decoded.sub);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid refresh token' });
    }

    const tokens = generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

/**
 * POST /api/auth/logout
 * Xóa cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

export default router;
```

#### `backend/src/routes/users.js`

```javascript
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Protected route - Chỉ admin mới truy cập được
router.get('/', authenticate, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    users: [
      { id: 1, name: 'Admin', email: 'admin@domain.com' },
      { id: 2, name: 'User', email: 'user@domain.com' },
    ],
    requestedBy: req.user,
  });
});

// Route công khai nhưng vẫn cần đăng nhập
router.get('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    profile: {
      id: req.user.sub,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

export default router;
```

#### `backend/src/app.js`

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

const app = express();

// Trust proxy (vì đứng sau Nginx)
app.set('trust proxy', 1);

// ===== SECURITY MIDDLEWARE =====
app.use(
  helmet({
    contentSecurityPolicy: false, // Để Nginx xử lý CSP
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS - Chỉ cho phép domain chính thức
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (như Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // BẮT BUỘC để gửi/nhận cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json({ limit: '10kb' })); // Giới hạn payload chống DoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate Limiting
app.use('/api/', apiLimiter);

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
```

#### `backend/server.js`

```javascript
import dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });

import app from './src/app.js';

const PORT = process.env.PORT || 5000;
const HOST = '127.0.0.1'; // Chỉ listen localhost, không expose ra ngoài

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
```

---

### 2.3. Frontend - React + Vite (Code đầy đủ)

#### `frontend/package.json`

```json
{
  "name": "frontend-react",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

#### `frontend/.env.production`

```
# Không có secret ở đây!
# Tất cả API calls đều đi qua relative path /api/* (do Nginx proxy)
VITE_API_BASE_URL=/api
```

#### `frontend/src/api/axiosClient.js`

```javascript
import axios from 'axios';

/**
 * Axios Client cho Production
 * - credentials: 'include' → Gửi kèm HttpOnly Cookie
 * - Không cần thêm Authorization header vì auth nằm trong cookie
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // 🔴 BẮT BUỘC để gửi cookie
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Không cần thêm token vào header vì dùng cookie!
    // Nếu muốn log request:
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - Xử lý token hết hạn
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi refresh token endpoint
        await axios.post(
          '/api/auth/refresh',
          {},
          {
            withCredentials: true,
          },
        );

        // Thử lại request gốc
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại → Đăng xuất
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
```

#### `frontend/src/contexts/AuthContext.jsx`

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra đăng nhập khi load app
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      // Chưa đăng nhập hoặc token hết hạn
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    if (response.data.success) {
      setUser(response.data.user);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### `frontend/src/router/index.jsx`

```javascript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Nên thay bằng spinner component
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <Navigate
        to='/'
        replace
      />
    ),
  },
]);
```

#### `frontend/src/pages/Login.jsx`

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          type='submit'
          disabled={isLoading}
          style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

#### `frontend/src/pages/Dashboard.jsx`

```javascript
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Dashboard</h1>
        <button
          onClick={logout}
          style={{ padding: '10px 20px' }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '5px',
        }}
      >
        <h3>Welcome, {user?.name}!</h3>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Users List</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} ({u.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
```

#### `frontend/src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
```

#### `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Tắt sourcemap trong production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Xóa console.log trong production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách vendor ra chunk riêng để cache lâu dài
          vendor: ['react', 'react-dom', 'react-router-dom'],
          api: ['axios'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Proxy trong development (không dùng trong production)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

#### `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <!-- Không để sensitive info trong HTML -->
    <title>My Production App</title>
  </head>
  <body>
    <div id="root"></div>
    <script
      type="module"
      src="/src/main.jsx"
    ></script>
  </body>
</html>
```

---

### 2.4. Nginx Production Config (Đầy đủ & Tối ưu)

#### `nginx/my-app.conf`

```nginx
# /etc/nginx/sites-available/my-app.conf
# Symlink: ln -s /etc/nginx/sites-available/my-app.conf /etc/nginx/sites-enabled/

# ===== UPSTREAM (Backend Cluster) =====

# KIẾN TRÚC A: Để PM2 tự quản lý Cluster (Khuyên dùng vì tinh gọn nhất)
upstream backend_api {
    # Bỏ least_conn; (Vì PM2 Cluster sẽ tự chia tải bằng thuật toán Round-Robin nội bộ)
    server 127.0.0.1:5000; # 👈 CHỈ để duy nhất cổng 5000
    keepalive 32;
}

# KIẾN TRÚC B: Để Nginx trực tiếp quản lý (Tối ưu bảo mật và kháng lỗi cao nhất)
# upstream backend_api {
#    least_conn;
#    server 127.0.0.1:5000 max_fails=3 fail_timeout=30s;
#    server 127.0.0.1:5001 max_fails=3 fail_timeout=30s; # 👈 Mở thêm cổng 5001
#    server 127.0.0.1:5002 max_fails=3 fail_timeout=30s; # 👈 Mở thêm cổng 5002 (nếu CPU nhiều nhân)
#    keepalive 32;
# }

# ===== HTTP → HTTPS REDIRECT =====
server {
    listen 80;
    listen [::]:80;
    server_name domain.com www.domain.com;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# ===== HTTPS SERVER =====
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name domain.com www.domain.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;

    # SSL Optimization
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/domain.com/chain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Content Security Policy (CSP) - Điều chỉnh theo nhu cầu
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://domain.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;

    # Logs
    access_log /var/log/nginx/my-app-access.log;
    error_log /var/log/nginx/my-app-error.log;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # ===== FRONTEND: ReactJS Static Files =====
    location / {
        root /var/www/my-react-app/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Tối ưu cache cho các file tĩnh đã được Vite chia nhỏ bằng manualChunks có hash trong tên file (ví dụ: main.a3f2b1c.js)
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
    }

    # ===== BACKEND PROXY =====
    location /api/ {
        proxy_pass http://backend_api/;
        proxy_http_version 1.1;
        proxy_set_header Connection ""; # 👈 THÊM DÒNG NÀY: Để ngăn Nginx đóng socket sau mỗi request

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # WebSocket support (nếu cần)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffer
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;

        # Hide backend server info
        proxy_hide_header X-Powered-By;
        proxy_hide_header Server;
    }

    # ===== HEALTH CHECK (Optional) =====
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

---

### 2.5. Docker & Docker Compose

#### `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend-api
    restart: unless-stopped
    env_file:
      - ./backend/.env.production
    expose:
      - '5000'
    networks:
      - app-network
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:5000/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend-react
    restart: unless-stopped
    volumes:
      - frontend-build:/app/dist
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx/my-app.conf:/etc/nginx/conf.d/default.conf:ro
      - frontend-build:/var/www/my-react-app/dist:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    networks:
      - app-network
    depends_on:
      - backend
      - frontend
    command: '/bin/sh -c ''while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g "daemon off;"'''

  certbot:
    image: certbot/certbot
    container_name: certbot
    restart: unless-stopped
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  app-network:
    driver: bridge

volumes:
  frontend-build:
```

#### `backend/Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app

# Cài dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Tạo thư mục logs
RUN mkdir -p logs

# Không chạy root
USER node

EXPOSE 5000
CMD ["node", "server.js"]
```

#### `frontend/Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - chỉ copy dist
FROM alpine:latest AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
# Volume này sẽ được mount vào Nginx container
VOLUME /app/dist
```

---

### 2.6. PM2 Ecosystem Config

#### `ecosystem.config.js` (Đặt ở root hoặc backend)

**Tạo thư mục logs**:

```md
mkdir -p logs
```

**🚀 KIẾN TRÚC A: Để PM2 tự quản lý Cluster (Khuyên dùng vì tinh gọn nhất)**

```javascript
module.exports = {
  apps: [
    {
      name: 'backend-api',
      script: './backend/server.js',
      instances: 'max', // Chạy bằng số CPU core
      exec_mode: 'cluster', // Cluster mode
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/backend-err.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M', // Restart nếu leak memory
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Health check
      // wait_ready: true,
      // node_args: '--max-old-space-size=512'
    },
  ],
};
```

**🛡️ KIẾN TRÚC B: Để Nginx trực tiếp quản lý (Tối ưu bảo mật và kháng lỗi cao nhất)**

Nếu bạn muốn giữ nguyên cụm Upstream của Nginx (5000, 5001, 5002) để tận dụng các tính năng cao cấp của Nginx như
least_conn hay ngắt mạch tự động khi có cổng lỗi, bạn phải sửa lại PM2 để nó thò ra các cổng độc lập.

Sửa lại `ecosystem.config.js` thành chế độ chạy Fork (từng cổng riêng biệt):

```javascript
module.exports = {
  apps: [
    {
      name: 'backend-api-5000',
      script: './backend/server.js',
      exec_mode: 'fork', // Chạy độc lập
      env_production: { NODE_ENV: 'production', PORT: 5000 },
      // ... giữ nguyên các cấu hình log, memory của bạn
    },
    {
      name: 'backend-api-5001',
      script: './backend/server.js',
      exec_mode: 'fork',
      env_production: { NODE_ENV: 'production', PORT: 5001 },
      // ... các cấu hình khác giống hệt bên trên
    },
  ],
};
```

**Lệnh khởi động:**

```bash
# Cài PM2 global
npm install -g pm2

# Khởi chạy production
pm2 start ecosystem.config.js --env production

# Lưu config để tự khởi động khi reboot
pm2 save
pm2 startup systemd

# Giám sát
pm2 monit
pm2 logs backend-api

# Zero-downtime reload

pm2 reload backend-api

# Thông thường, khi cập nhật code mới cho Backend và gõ lệnh restart (pm2 restart),
# PM2 sẽ giết chết (Kill) tiến trình (Process) cũ đang chạy, sau đó mới khởi động (Start) một tiến trình mới lên.
# Hậu quả: Trong khoảng thời gian vài giây chờ code mới khởi động,
# nếu có người dùng bấm mua hàng hoặc gửi dữ liệu, họ sẽ nhận ngay lỗi 502 Bad Gateway hoặc Connection Refused.
# Trang web của bạn bị "sập" tạm thời (Downtime).

# Khi dùng lệnh pm2 reload backend-api, PM2 sẽ xử lý theo cơ chế Rolling Update
# (Cập nhật cuốn chiếu) với điều kiện bạn chạy ứng dụng ở Cụm Server Backend (Cluster).
# Cluster Mode (chạy nhiều bản sao/instance của Backend cùng lúc)
# Ví dụ có 4 bản sao (Process 1, 2, 3, 4) để gánh tải
# PM2 sẽ giữ nguyên Process 2, 3, 4 để tiếp tục phục vụ người dùng bình thường.
# Nó chỉ bí mật "giết" thằng Process 1 và nạp code mới vào đó.
# Khi Process 1 (mới) báo cáo đã khởi động thành công và sẵn sàng nhận request,
# PM2 mới tiếp tục làm tương tự với Process 2, rồi đến Process 3, Process 4.
# Hệ thống luôn luôn có ít nhất vài bản sao hoạt động để tiếp nhận request.
# Người dùng lướt web hoàn toàn không hề hay biết bạn vừa cập nhật code.
# Đó gọi là Zero-downtime (Thời gian chết bằng 0).

```

---

## 3. Mô hình 2: Next.js 14 (App Router) + Backend

> **Đặc điểm:** Next.js có lớp Server trung gian. Có thể dùng Server Components để fetch data trực tiếp, hoặc dùng Route Handlers làm BFF (Backend for Frontend).

### 3.1. Cấu trúc dự án

```
nextjs-production-app/
├── backend/                    # Backend độc lập (giống Mô hình 1)
│   ├── src/
│   │   └── ...
│   └── server.js
├── frontend-next/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.jsx      # Server Component
│   │   │   ├── users/
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.js   # Route Handler
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.js
│   │   │   │   ├── refresh/
│   │   │   │   │   └── route.js
│   │   │   │   └── me/
│   │   │   │       └── route.js
│   │   │   └── proxy/
│   │   │       └── [...path]/
│   │   │           └── route.js   # Proxy tất cả API
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── ui/
│   │   └── auth/
│   │       └── LoginForm.jsx      # Client Component
│   ├── lib/
│   │   ├── auth.js                # Server-side auth utils
│   │   ├── api.js                 # Internal API client
│   │   └── constants.js
│   ├── middleware.ts              # Next.js Middleware
│   ├── next.config.js
│   ├── .env.local                 # Dev
│   ├── .env.production            # Production
│   └── package.json
├── nginx/
│   └── nextjs.conf
└── docker-compose.yml
```

### 3.2. Backend (Internal API)

Backend giống Mô hình 1, nhưng **chỉ listen internal IP** (không public):

```javascript
// backend/server.js
const HOST = process.env.BIND_HOST || '10.0.0.5'; // Internal network only
const PORT = 8080;
```

Backend **KHÔNG CẦN CORS** vì chỉ Next.js server gọi đến (same internal network).

### 3.3. Next.js - Auth Flow qua Server

#### `frontend-next/.env.production`

```
# ===== SERVER ONLY (Không bao giờ lộ ra client) =====
INTERNAL_BACKEND_URL=http://10.0.0.5:8080
JWT_SECRET_KEY=super-secret-key-production
ENCRYPTION_KEY=another-secret-for-encrypting-cookies

# ===== PUBLIC (Lộ ra browser, chỉ dùng cho non-sensitive) =====
NEXT_PUBLIC_APP_NAME=MyApp
NEXT_PUBLIC_APP_URL=https://domain.com
```

#### `frontend-next/lib/auth.js` (Server-side utilities)

```javascript
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

/**
 * Tạo session token (JWE/JWT) để lưu vào cookie
 * Dùng jose thay vì jsonwebtoken vì jose hỗ trợ Edge Runtime
 */
export async function createSession(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .setIssuer('nextjs-app')
    .setAudience('nextjs-app')
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verify session từ cookie
 */
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      issuer: 'nextjs-app',
      audience: 'nextjs-app',
      clockTolerance: 60,
    });
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Lấy current user từ cookie (Server-side only)
 */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  const payload = await verifySession(token);
  if (!payload) return null;

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

/**
 * Set session cookie (Server Action hoặc Route Handler)
 */
export async function setSessionCookie(token) {
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 phút
    path: '/',
  });
}

export async function clearSessionCookie() {
  cookies().delete('session');
}
```

#### `frontend-next/lib/api.js` (Internal API Client)

```javascript
/**
 * Server-side API client
 * Gọi trực tiếp đến Backend internal URL (KHÔNG qua public internet)
 */
const BACKEND_URL = process.env.INTERNAL_BACKEND_URL;

export async function internalFetch(endpoint, options = {}) {
  const url = `${BACKEND_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Không cần withCredentials vì đây là server-to-server
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

### 3.4. Route Handlers (App Router API)

#### `frontend-next/app/api/auth/login/route.js`

```javascript
import { NextResponse } from 'next/server';
import { internalFetch } from '@/lib/api';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Gọi Backend internal API để xác thực
    const backendResponse = await internalFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.success) {
      return NextResponse.json(
        { success: false, message: backendResponse.message },
        { status: 401 },
      );
    }

    // Tạo session cho Next.js
    const sessionToken = await createSession({
      sub: backendResponse.user.id,
      email: backendResponse.user.email,
      name: backendResponse.user.name,
      role: backendResponse.user.role,
    });

    // Set HttpOnly Cookie
    await setSessionCookie(sessionToken);

    // Trả về user info (không trả token)
    return NextResponse.json({
      success: true,
      user: backendResponse.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
```

#### `frontend-next/app/api/auth/me/route.js`

```javascript
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  return NextResponse.json({ success: true, user });
}
```

#### `frontend-next/app/api/auth/logout/route.js`

```javascript
import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
```

#### `frontend-next/app/api/proxy/[...path]/route.js`

```javascript
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

/**
 * Proxy tất cả API calls sang Backend internal
 * Tự động gắn Authorization header từ session
 */
const BACKEND_URL = process.env.INTERNAL_BACKEND_URL;

export async function GET(request, { params }) {
  return handleProxy(request, params.path, 'GET');
}

export async function POST(request, { params }) {
  return handleProxy(request, params.path, 'POST');
}

export async function PUT(request, { params }) {
  return handleProxy(request, params.path, 'PUT');
}

export async function DELETE(request, { params }) {
  return handleProxy(request, params.path, 'DELETE');
}

async function handleProxy(request, pathSegments, method) {
  try {
    // Lấy user hiện tại
    const user = await getCurrentUser();

    // Construct backend URL
    const path = pathSegments.join('/');
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_URL}/api/${path}${url.search}`;

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };

    // Nếu có user, gắn Bearer token (Server-to-Server auth)
    if (user) {
      // Trong thực tế, bạn có thể dùng service account token
      // hoặc re-sign JWT với secret khác
      headers['X-User-Id'] = user.id;
      headers['X-User-Role'] = user.role;
    }

    // Forward body nếu là POST/PUT/PATCH
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.text();
    }

    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      // Có thể thêm timeout
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Proxy error' },
      { status: 500 },
    );
  }
}
```

### 3.5. Middleware & Client Components

#### `frontend-next/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// Các route cần auth
const PROTECTED_ROUTES = ['/dashboard', '/users', '/profile'];
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra session từ cookie
  const sessionCookie = request.cookies.get('session')?.value;
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie, SECRET_KEY, {
        issuer: 'nextjs-app',
        audience: 'nextjs-app',
      });
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect logic
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Thêm security headers cho mọi response
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
```

#### `frontend-next/components/auth/LoginForm.jsx` (Client Component)

```javascript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
        router.refresh(); // Refresh server components
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 max-w-md mx-auto mt-10'
    >
      <h2 className='text-2xl font-bold'>Login</h2>
      {error && (
        <div className='text-red-500 p-2 bg-red-50 rounded'>{error}</div>
      )}

      <div>
        <label className='block text-sm font-medium'>Email</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full p-2 border rounded'
        />
      </div>

      <div>
        <label className='block text-sm font-medium'>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='w-full p-2 border rounded'
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### `frontend-next/app/dashboard/page.jsx` (Server Component)

```javascript
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { internalFetch } from '@/lib/api';

export default async function DashboardPage() {
  // Auth check server-side
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch data trực tiếp từ Backend (Server Component)
  let users = [];
  try {
    const response = await internalFetch('/users');
    users = response.users || [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>

      <div className='bg-gray-100 p-4 rounded-lg mb-6'>
        <h2 className='text-xl font-semibold mb-2'>Welcome, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-3'>Users List</h3>
        <ul className='space-y-2'>
          {users.map((u) => (
            <li
              key={u.id}
              className='p-2 bg-white border rounded'
            >
              {u.name} ({u.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### 3.6. `next.config.js` hoàn chỉnh

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ===== OUTPUT =====
  output: 'standalone', // Tối ưu cho Docker deployment

  // ===== IMAGES =====
  images: {
    domains: ['domain.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // ===== REWRITES (Proxy API) =====
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: `${process.env.INTERNAL_BACKEND_URL}/api/:path*`,
      },
    ];
  },

  // ===== SECURITY HEADERS =====
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://domain.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // HSTS chỉ nên set ở Nginx, nhưng có thể backup ở đây
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=63072000; includeSubDomains; preload'
          // }
        ],
      },
      {
        // Cache static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ===== COMPRESSION =====
  compress: true,

  // ===== POWERED BY HEADER =====
  poweredByHeader: false, // Ẩn X-Powered-By: Next.js

  // ===== TRAILING SLASH =====
  trailingSlash: false,

  // ===== EXPERIMENTAL (Next 14) =====
  experimental: {
    // serverActions: {
    //   bodySizeLimit: '1mb'
    // }
  },
};

module.exports = nextConfig;
```

---

## 4. Checklist Go-Live Production

### 4.1. Security Headers (Tổng hợp)

| Header                      | Giá trị khuyến nghị                            | Mục đích                       |
| --------------------------- | ---------------------------------------------- | ------------------------------ |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Ép buộc HTTPS, chống SSL Strip |
| `X-Frame-Options`           | `SAMEORIGIN`                                   | Chống Clickjacking             |
| `X-Content-Type-Options`    | `nosniff`                                      | Chống MIME sniffing            |
| `Content-Security-Policy`   | `default-src 'self'`                           | Chống XSS, chèn script độc     |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Giới hạn leak referrer         |
| `Permissions-Policy`        | `camera=(), microphone=()`                     | Vô hiệu hóa API nhạy cảm       |

### 4.2. SSL/TLS Let's Encrypt (Certbot)

```bash
# Cài certbot
sudo apt install certbot python3-certbot-nginx

# Tạo chứng chỉ
sudo certbot --nginx -d domain.com -d www.domain.com

# Tự động renew (đã có trong docker-compose.yml hoặc cron)
sudo certbot renew --dry-run
```

### 4.3. PM2 Cluster Mode (Chi tiết)

```bash
# Khởi chạy với tối đa CPU core
pm2 start ecosystem.config.js --env production

# Scale manually
pm2 scale backend-api 4

# Zero-downtime deploy
pm2 reload backend-api

# Log rotation (cài thêm)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 10

# Monitoring dashboard
pm2 plus
```

### 4.4. CDN & Caching Strategy

```nginx
# Trong Nginx config

# Cache static assets vĩnh viễn (vì có hash trong filename)
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}

# Cache images
location ~* \.(png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 6M;
    add_header Cache-Control "public";
    access_log off;
}

# Không cache HTML (để cập nhật app)
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

**Cloudflare Settings:**

- SSL/TLS mode: **Full (strict)**
- Always Use HTTPS: **ON**
- Security Level: **High**
- Browser Cache TTL: **1 month** (cho static assets)
- Auto Minify: JS, CSS, HTML
- Brotli: **ON**

### 4.5. Database Connection Pool

#### PostgreSQL với `pg` pool:

```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  // Pool settings
  max: 20, // Tối đa 20 connections
  idleTimeoutMillis: 30000, // Đóng connection idle sau 30s
  connectionTimeoutMillis: 2000, // Timeout kết nối sau 2s
});

// Health check
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

export default pool;
```

### 4.6. Logging & Monitoring

#### Winston Logger (đã có trong backend)

```javascript
// Thêm structured logging
logger.info('User login', {
  userId: user.id,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString(),
});
```

#### Health Check Endpoint

```javascript
// Backend
app.get('/api/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };

  const isHealthy = checks.database.status === 'ok';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
  });
});
```

#### Prometheus + Grafana (Optional)

```javascript
import promClient from 'prom-client';

// Collect default metrics
promClient.collectDefaultMetrics();

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

// Middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

---

## PHỤ LỤC: So sánh ReactJS vs Next.js

| Tiêu chí         | ReactJS (SPA)                                | Next.js (SSR/SSG)                    |
| ---------------- | -------------------------------------------- | ------------------------------------ |
| **Lớp Server**   | Không có                                     | Có (Node.js Server)                  |
| **Auth Token**   | HttpOnly Cookie qua Nginx                    | HttpOnly Cookie + Server-side verify |
| **CORS**         | Cần cấu hình (qua Nginx proxy thì không cần) | Không cần (Server-to-Server)         |
| **SEO**          | Kém (Client-rendered)                        | Tốt (Server-rendered)                |
| **Initial Load** | Chậm (tải JS rồi render)                     | Nhanh (HTML sẵn)                     |
| **Complexity**   | Thấp                                         | Cao hơn                              |
| **Scale**        | Dễ scale static                              | Cần quản lý Server                   |
| **Use Case**     | Dashboard, Admin Panel                       | Marketing Site, E-commerce, Blog     |

---

## KẾT LUẬN

1. **ReactJS SPA** phù hợp cho ứng dụng nội bộ, dashboard, admin panel - nơi SEO không quan trọng.
2. **Next.js** phù hợp cho public-facing apps cần SEO, performance tối ưu, hoặc khi cần lớp BFF (Backend for Frontend).
3. **Luôn luôn** dùng `HttpOnly Cookie` thay vì `localStorage` cho auth token.
4. **Luôn luôn** đặt backend sau Reverse Proxy (Nginx), không expose port trực tiếp.
5. **Luôn luôn** bật HTTPS, HSTS, CSP, và các security headers.

---

## 5. PostgreSQL + Prisma ORM

### 5.1. Cài đặt & Cấu hình Prisma

#### `backend/package.json` (cập nhật)

```json
{
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0"
  }
}
```

#### `backend/prisma/schema.prisma`

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===== USER MODEL =====
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  role      Role     @default(USER)
  isActive  Boolean  @default(true)

  // Relations
  sessions  Session[]
  posts     Post[]

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([role])
  @@map("users")
}

// ===== SESSION MODEL (cho refresh token tracking) =====
model Session {
  id           String   @id @default(uuid())
  refreshToken String   @unique @map("refresh_token")
  userAgent    String?  @map("user_agent")
  ipAddress    String?  @map("ip_address")
  expiresAt    DateTime @map("expires_at")
  isRevoked    Boolean  @default(false) @map("is_revoked")

  // Relations
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([refreshToken])
  @@index([expiresAt])
  @@map("sessions")
}

// ===== POST MODEL (ví dụ business entity) =====
model Post {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  published   Boolean  @default(false)
  viewCount   Int      @default(0) @map("view_count")

  // Relations
  authorId String @map("author_id")
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([slug])
  @@index([published])
  @@index([authorId])
  @@map("posts")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

#### `backend/prisma/migrations/.../migration.sql` (tự động generate)

```bash
# Generate migration
npx prisma migrate dev --name init

# Deploy migration trong production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

#### `backend/src/config/database.js` (Prisma Client Singleton)

```javascript
import { PrismaClient } from '@prisma/client';
import { logger } from '../middleware/errorHandler.js';

// Prisma Client Singleton Pattern
// Tránh tạo nhiều instance trong development (Hot Reload)
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],

    // Connection pool settings
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Middleware: Log slow queries
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  if (duration > 1000) {
    // Log queries > 1s
    logger.warn(
      `Slow query detected: ${params.model}.${params.action} took ${duration}ms`,
    );
  }

  return result;
});

// Middleware: Soft delete (ví dụ)
prisma.$use(async (params, next) => {
  // Tự động filter isActive = true cho User
  if (params.model === 'User' && params.action === 'findUnique') {
    params.args.where = {
      ...params.args.where,
      isActive: true,
    };
  }
  return next(params);
});
```

### 5.2. Repository Pattern

#### `backend/src/repositories/base.repository.js`

```javascript
/**
 * Generic Repository Pattern
 * Cung cấp CRUD cơ bản, các repository cụ thể extend class này
 */
export class BaseRepository {
  constructor(prismaModel) {
    this.model = prismaModel;
  }

  async findById(id, options = {}) {
    return this.model.findUnique({
      where: { id },
      ...options,
    });
  }

  async findOne(where, options = {}) {
    return this.model.findFirst({
      where,
      ...options,
    });
  }

  async findMany(where = {}, options = {}) {
    const {
      page = 1,
      limit = 20,
      orderBy = { createdAt: 'desc' },
      ...rest
    } = options;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        ...rest,
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async create(data, options = {}) {
    return this.model.create({
      data,
      ...options,
    });
  }

  async update(id, data, options = {}) {
    return this.model.update({
      where: { id },
      data,
      ...options,
    });
  }

  async delete(id) {
    return this.model.delete({ where: { id } });
  }

  async upsert(where, create, update) {
    return this.model.upsert({
      where,
      create,
      update,
    });
  }

  async transaction(operations) {
    return prisma.$transaction(operations);
  }
}
```

#### `backend/src/repositories/user.repository.js`

```javascript
import { BaseRepository } from './base.repository.js';
import { prisma } from '../config/database.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email, options = {}) {
    return this.model.findUnique({
      where: { email },
      ...options,
    });
  }

  async findByEmailWithSessions(email) {
    return this.model.findUnique({
      where: { email },
      include: {
        sessions: {
          where: {
            isRevoked: false,
            expiresAt: { gt: new Date() },
          },
        },
      },
    });
  }

  async updatePassword(id, hashedPassword) {
    return this.model.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async deactivate(id) {
    return this.model.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getStats() {
    const [total, active, admins] = await Promise.all([
      this.model.count(),
      this.model.count({ where: { isActive: true } }),
      this.model.count({ where: { role: 'ADMIN' } }),
    ]);

    return { total, active, admins };
  }
}

export const userRepository = new UserRepository();
```

#### `backend/src/repositories/session.repository.js`

```javascript
import { BaseRepository } from './base.repository.js';
import { prisma } from '../config/database.js';

class SessionRepository extends BaseRepository {
  constructor() {
    super(prisma.session);
  }

  async findByRefreshToken(token) {
    return this.model.findUnique({
      where: { refreshToken: token },
      include: { user: true },
    });
  }

  async revokeAllUserSessions(userId) {
    return this.model.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  async revokeSession(refreshToken) {
    return this.model.update({
      where: { refreshToken },
      data: { isRevoked: true },
    });
  }

  async cleanupExpiredSessions() {
    return this.model.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }],
      },
    });
  }
}

export const sessionRepository = new SessionRepository();
```

### 5.3. Transaction & Connection Pool

#### `backend/src/services/auth.service.js`

```javascript
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { userRepository } from '../repositories/user.repository.js';
import { sessionRepository } from '../repositories/session.repository.js';
import { generateTokens } from '../utils/jwt.js';
import { logger } from '../middleware/errorHandler.js';

export class AuthService {
  async login(email, password, metadata = {}) {
    // Transaction: Đảm bảo atomicity
    return prisma.$transaction(async (tx) => {
      // 1. Tìm user
      const user = await tx.user.findUnique({
        where: { email },
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }

      // 2. Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        // Log failed attempt
        logger.warn(`Failed login attempt for ${email} from ${metadata.ip}`);
        throw new Error('Invalid credentials');
      }

      // 3. Generate tokens
      const { accessToken, refreshToken } = generateTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      // 4. Create session record
      await tx.session.create({
        data: {
          refreshToken,
          userId: user.id,
          userAgent: metadata.userAgent,
          ipAddress: metadata.ip,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // 5. Update last login (optional)
      await tx.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    });
  }

  async logout(refreshToken) {
    return prisma.$transaction(async (tx) => {
      const session = await tx.session.findUnique({
        where: { refreshToken },
      });

      if (session) {
        await tx.session.update({
          where: { id: session.id },
          data: { isRevoked: true },
        });
      }

      return { success: true };
    });
  }

  async refreshToken(refreshToken) {
    const session = await sessionRepository.findByRefreshToken(refreshToken);

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = generateTokens({
      sub: session.user.id,
      email: session.user.email,
      role: session.user.role,
      name: session.user.name,
    });

    // Update session với refresh token mới (Rotation)
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }
}

export const authService = new AuthService();
```

### 5.4. Seeding & Backup

#### `backend/prisma/seed.js`

```javascript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@domain.com' },
    update: {},
    create: {
      email: 'admin@domain.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  console.log('Seeded admin user:', admin.email);

  // Create sample posts
  await prisma.post.createMany({
    data: [
      {
        title: 'Getting Started with Production Deployment',
        slug: 'getting-started-production',
        content: 'This is a comprehensive guide...',
        published: true,
        authorId: admin.id,
      },
      {
        title: 'Security Best Practices',
        slug: 'security-best-practices',
        content: 'Security is paramount...',
        published: true,
        authorId: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### `backend/package.json` (scripts)

```json
{
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:migrate:prod": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:seed": "node prisma/seed.js",
    "db:studio": "prisma studio",
    "db:backup": "pg_dump $DATABASE_URL > backups/backup_$(date +%Y%m%d_%H%M%S).sql"
  }
}
```

#### Backup Script (`scripts/backup.sh`)

```bash
#!/bin/bash
# PostgreSQL Backup Script

BACKUP_DIR="/var/backups/postgres"
DB_URL="$DATABASE_URL"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup
pg_dump "$DB_URL" | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Upload to S3 (optional)
# aws s3 cp "$BACKUP_DIR/backup_$DATE.sql.gz" s3://my-backup-bucket/postgres/

# Clean old backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

---

## 6. Redis Session Store

### 6.1. Redis cho Session & Token Blacklist

#### `docker-compose.yml` (thêm Redis)

```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: redis-cache
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    networks:
      - app-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 5

  # ... other services

volumes:
  redis-data:
```

#### `backend/package.json` (thêm Redis client)

```json
{
  "dependencies": {
    "ioredis": "^5.3.2"
  }
}
```

#### `backend/src/config/redis.js`

```javascript
import Redis from 'ioredis';
import { logger } from '../middleware/errorHandler.js';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB) || 0,

  // Connection pool
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,

  // Retry strategy
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },

  // Reconnect on error
  reconnectOnError(err) {
    const targetErrors = ['READONLY', 'ECONNREFUSED', 'ETIMEDOUT'];
    return targetErrors.some((e) => err.message.includes(e));
  },
};

export const redis = new Redis(redisConfig);

// Connection events
redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redis.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redis.quit();
});

// ===== REDIS KEY PATTERNS =====
export const RedisKeys = {
  session: (userId) => `session:${userId}`,
  refreshToken: (token) => `refresh:${token}`,
  blacklistedToken: (token) => `blacklist:${token}`,
  rateLimit: (ip) => `ratelimit:${ip}`,
  cache: (key) => `cache:${key}`,
  userOnline: (userId) => `online:${userId}`,
};
```

#### `backend/src/services/session.service.js`

```javascript
import { redis, RedisKeys } from '../config/redis.js';

export class SessionService {
  /**
   * Luu refresh token vao Redis (thay the hoac bo sung Database)
   * TTL tu dong expire
   */
  async storeRefreshToken(userId, refreshToken, ttl = 7 * 24 * 60 * 60) {
    const key = RedisKeys.refreshToken(refreshToken);
    await redis.setex(
      key,
      ttl,
      JSON.stringify({
        userId,
        createdAt: new Date().toISOString(),
      }),
    );

    // Them vao set cua user (de query all sessions)
    await redis.sadd(RedisKeys.session(userId), refreshToken);
  }

  async validateRefreshToken(refreshToken) {
    const key = RedisKeys.refreshToken(refreshToken);
    const data = await redis.get(key);

    if (!data) return null;

    return JSON.parse(data);
  }

  async revokeRefreshToken(refreshToken) {
    const key = RedisKeys.refreshToken(refreshToken);
    const data = await redis.get(key);

    if (data) {
      const { userId } = JSON.parse(data);
      await redis.del(key);
      await redis.srem(RedisKeys.session(userId), refreshToken);

      // Them vao blacklist (ngan han, de phong token dang duoc su dung)
      await redis.setex(
        RedisKeys.blacklistedToken(refreshToken),
        900,
        'revoked',
      );
    }
  }

  async revokeAllUserSessions(userId) {
    const tokens = await redis.smembers(RedisKeys.session(userId));

    const pipeline = redis.pipeline();

    tokens.forEach((token) => {
      pipeline.del(RedisKeys.refreshToken(token));
      pipeline.setex(RedisKeys.blacklistedToken(token), 900, 'revoked');
    });

    pipeline.del(RedisKeys.session(userId));

    await pipeline.exec();
  }

  async isTokenBlacklisted(token) {
    const exists = await redis.exists(RedisKeys.blacklistedToken(token));
    return exists === 1;
  }

  async getUserSessionCount(userId) {
    return redis.scard(RedisKeys.session(userId));
  }
}

export const sessionService = new SessionService();
```

### 6.2. Redis Cache Layer

#### `backend/src/middleware/cache.js`

```javascript
import { redis, RedisKeys } from '../config/redis.js';

/**
 * Cache middleware
 * @param {number} ttl - Time to live in seconds
 * @param {Function} keyGenerator - Ham tao cache key tu request
 */
export const cacheMiddleware = (ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    // Skip cache cho non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = keyGenerator
      ? keyGenerator(req)
      : RedisKeys.cache(`${req.originalUrl}:${JSON.stringify(req.query)}`);

    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Override res.json de cache response
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        redis.setex(cacheKey, ttl, JSON.stringify(data));
        return originalJson(data);
      };

      next();
    } catch (error) {
      // Neu Redis loi, skip cache
      next();
    }
  };
};

/**
 * Invalidate cache by pattern
 */
export const invalidateCache = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

/**
 * Cache-aside pattern helper
 */
export const getOrSetCache = async (key, factory, ttl = 300) => {
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const data = await factory();
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
};
```

#### Su dung Cache trong Routes

```javascript
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

// Cache GET /api/users trong 5 phut
router.get(
  '/',
  authenticate,
  authorize('admin'),
  cacheMiddleware(
    300,
    (req) => `cache:users:page:${req.query.page}:limit:${req.query.limit}`,
  ),
  async (req, res) => {
    const result = await userRepository.findMany(
      {},
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      },
    );
    res.json(result);
  },
);

// Invalidate cache khi create/update/delete
router.post('/', authenticate, async (req, res) => {
  const user = await userRepository.create(req.body);
  await invalidateCache('cache:users:*');
  res.status(201).json(user);
});
```

### 6.3. Rate Limiting voi Redis

#### `backend/src/middleware/rateLimiter.js` (nang cap voi Redis)

```javascript
import { redis } from '../config/redis.js';

export const redisRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 phut
    max = 100, // 100 requests
    keyPrefix = 'ratelimit',
    keyGenerator = (req) => req.ip,
  } = options;

  return async (req, res, next) => {
    const key = `${keyPrefix}:${keyGenerator(req)}`;
    const windowSeconds = Math.ceil(windowMs / 1000);

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }

      const ttl = await redis.ttl(key);

      // Set headers
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current));
      res.setHeader(
        'X-RateLimit-Reset',
        new Date(Date.now() + ttl * 1000).toISOString(),
      );

      if (current > max) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
          retryAfter: ttl,
        });
      }

      next();
    } catch (error) {
      // Neu Redis loi, cho phep request qua
      next();
    }
  };
};

// Predefined limiters
export const strictLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyPrefix: 'ratelimit:strict',
});

export const apiLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyPrefix: 'ratelimit:api',
});

export const authLimiter = redisRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 gio
  max: 10,
  keyPrefix: 'ratelimit:auth',
  keyGenerator: (req) => req.body?.email || req.ip, // Rate limit theo email
});
```

---

## 7. WebSocket (Socket.io) Production

### 7.1. Socket.io voi Redis Adapter

#### `docker-compose.yml` (them Redis cho Socket.io)

```yaml
services:
  redis-socketio:
    image: redis:7-alpine
    container_name: redis-socketio
    restart: unless-stopped
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-socketio-data:/data
    networks:
      - app-network

volumes:
  redis-socketio-data:
```

#### `backend/package.json`

```json
{
  "dependencies": {
    "socket.io": "^4.7.4",
    "@socket.io/redis-adapter": "^8.2.1"
  }
}
```

#### `backend/src/config/socket.js`

```javascript
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redis } from './redis.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { logger } from '../middleware/errorHandler.js';

let io = null;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
      credentials: true,
    },

    // Production settings
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],

    // Connection limits
    maxHttpBufferSize: 1e6, // 1MB
    perMessageDeflate: {
      threshold: 1024, // Compress messages > 1KB
    },
  });

  // Redis Adapter cho multi-server scaling
  const pubClient = redis.duplicate();
  const subClient = redis.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  // ===== AUTH MIDDLEWARE =====
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.cookie?.match(/accessToken=([^;]+)/)?.[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.sub;
      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  // ===== CONNECTION HANDLER =====
  io.on('connection', (socket) => {
    logger.info(`User ${socket.userId} connected: ${socket.id}`);

    // Join personal room
    socket.join(`user:${socket.userId}`);

    // Update online status
    redis.setex(`online:${socket.userId}`, 300, socket.id);

    // Broadcast user online
    socket.broadcast.emit('user:online', { userId: socket.userId });

    // ===== EVENT HANDLERS =====
    socket.on('message:send', async (data) => {
      try {
        // Validate & save message
        const message = await saveMessage({
          content: data.content,
          senderId: socket.userId,
          roomId: data.roomId,
        });

        // Broadcast to room
        io.to(`room:${data.roomId}`).emit('message:received', message);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('room:join', (roomId) => {
      socket.join(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit('user:joined', {
        userId: socket.userId,
        name: socket.user.name,
      });
    });

    socket.on('room:leave', (roomId) => {
      socket.leave(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit('user:left', {
        userId: socket.userId,
      });
    });

    socket.on('typing:start', (roomId) => {
      socket.to(`room:${roomId}`).emit('typing:start', {
        userId: socket.userId,
        name: socket.user.name,
      });
    });

    socket.on('typing:stop', (roomId) => {
      socket.to(`room:${roomId}`).emit('typing:stop', {
        userId: socket.userId,
      });
    });

    // ===== DISCONNECT =====
    socket.on('disconnect', async (reason) => {
      logger.info(`User ${socket.userId} disconnected: ${reason}`);

      await redis.del(`online:${socket.userId}`);

      socket.broadcast.emit('user:offline', { userId: socket.userId });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Helper: Emit to specific user across all servers
export const emitToUser = (userId, event, data) => {
  io.to(`user:${userId}`).emit(event, data);
};

// Helper: Emit to room
export const emitToRoom = (roomId, event, data) => {
  io.to(`room:${roomId}`).emit(event, data);
};

// Helper: Broadcast to all
export const broadcast = (event, data) => {
  io.emit(event, data);
};
```

#### `backend/server.js` (cap nhat voi Socket.io)

```javascript
import { createServer } from 'http';
import app from './src/app.js';
import { initializeSocket } from './src/config/socket.js';

const PORT = process.env.PORT || 5000;
const HOST = '127.0.0.1';

// Tao HTTP server tu Express app
const httpServer = createServer(app);

// Khoi tao Socket.io
initializeSocket(httpServer);

const server = httpServer.listen(PORT, HOST, () => {
  console.log(`Server + WebSocket running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

### 7.2. Nginx Config cho WebSocket

```nginx
# Them vao Nginx config
location /socket.io/ {
    proxy_pass http://backend_api;
    proxy_http_version 1.1;

    # WebSocket headers
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket timeouts
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;

    # Disable buffering for real-time
    proxy_buffering off;
}
```

### 7.3. Frontend React voi Socket.io Client

#### `frontend/src/hooks/useSocket.js`

```javascript
import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Ket noi voi auth token tu cookie (tu dong gui qua withCredentials)
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true, // Gui cookie
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event, callback) => {
    socketRef.current?.on(event, callback);
    return () => socketRef.current?.off(event, callback);
  }, []);

  const joinRoom = useCallback((roomId) => {
    socketRef.current?.emit('room:join', roomId);
  }, []);

  const leaveRoom = useCallback((roomId) => {
    socketRef.current?.emit('room:leave', roomId);
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    joinRoom,
    leaveRoom,
    isConnected: socketRef.current?.connected || false,
  };
};
```

---

## 8. CI/CD voi GitHub Actions

### 8.1. Backend CI Pipeline

#### `.github/workflows/backend-ci.yml`

```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main]
    paths:
      - 'backend/**'

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/backend

jobs:
  # ===== STAGE 1: TEST =====
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: ./backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          REDIS_HOST: localhost
          REDIS_PORT: 6379
          JWT_SECRET: test-secret-key
          NODE_ENV: test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
          flags: backend

  # ===== STAGE 2: SECURITY SCAN =====
  security:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run npm audit
        working-directory: ./backend
        run: npm audit --audit-level=moderate

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # ===== STAGE 3: BUILD & PUSH DOCKER =====
  build:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

  # ===== STAGE 4: DEPLOY =====
  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment: production
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/my-app

            # Pull latest images
            docker-compose pull backend

            # Run migrations
            docker-compose run --rm backend npx prisma migrate deploy

            # Restart with zero-downtime
            docker-compose up -d --no-deps --build backend

            # Health check
            sleep 10
            curl -f http://localhost:5000/api/health || exit 1

            # Cleanup old images
            docker image prune -f
```

### 8.2. Frontend CI Pipeline

#### `.github/workflows/frontend-ci.yml`

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-ci.yml'

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/frontend

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: ./frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run tests
        run: npm run test -- --coverage

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: /api

  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment: production
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/my-app
            docker-compose pull frontend
            docker-compose up -d --no-deps frontend
            docker image prune -f
```

### 8.3. Semantic Versioning & Changelog

#### `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate changelog
        id: changelog
        uses: mikepenz/release-changelog-builder-action@v4
        with:
          configuration: .github/changelog-config.json
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false
```

---

## 9. Kubernetes Deployment

### 9.1. K8s Architecture Overview

```
Ingress Controller (Nginx + Cert-Manager)
    |
    +-- /api/*     --> Backend Service (3 pods)
    +-- /socket.io --> WebSocket Service (2 pods)
    +-- /*         --> Frontend Service (2 pods)

Backend pods --> Redis Cluster --> PostgreSQL StatefulSet
```

### 9.2. Namespace & ConfigMap/Secret

#### `k8s/namespace.yml`

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
  labels:
    name: my-app
    environment: production
```

#### `k8s/configmap.yml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: my-app
data:
  NODE_ENV: 'production'
  PORT: '5000'
  REDIS_HOST: 'redis-service'
  REDIS_PORT: '6379'
  REDIS_DB: '0'
  ALLOWED_ORIGINS: 'https://domain.com,https://www.domain.com'
```

#### `k8s/secrets.yml` (Tao bang lenh, KHONG commit file nay!)

```bash
# Tao secrets bang command line
kubectl create secret generic app-secrets   --namespace=my-app   --from-literal=DATABASE_URL="postgresql://user:pass@postgres-service:5432/mydb"   --from-literal=JWT_SECRET="super-secret-key"   --from-literal=JWT_REFRESH_SECRET="another-secret"   --from-literal=COOKIE_SECRET="cookie-signing-secret"   --from-literal=REDIS_PASSWORD="redis-password"
```

### 9.3. Deployments & Services

#### `k8s/backend-deployment.yml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: my-app
  labels:
    app: backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: ghcr.io/username/repo/backend:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 5000
              name: http
          envFrom:
            - configMapRef:
                name: app-config
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: DATABASE_URL
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: JWT_SECRET
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /api/health
              port: 5000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/health
              port: 5000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: my-app
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
  type: ClusterIP
```

#### `k8s/frontend-deployment.yml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: my-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: ghcr.io/username/repo/frontend:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: '64Mi'
              cpu: '100m'
            limits:
              memory: '128Mi'
              cpu: '200m'
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: my-app
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

#### `k8s/redis-deployment.yml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          ports:
            - containerPort: 6379
          command:
            - redis-server
            - --appendonly
            - 'yes'
            - --maxmemory
            - '256mb'
            - --maxmemory-policy
            - allkeys-lru
          volumeMounts:
            - name: redis-data
              mountPath: /data
      volumes:
        - name: redis-data
          persistentVolumeClaim:
            claimName: redis-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: my-app
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
  type: ClusterIP
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: my-app
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

#### `k8s/postgres-statefulset.yml`

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: my-app
spec:
  serviceName: postgres-service
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: 'myapp'
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: DB_USER
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: DB_PASSWORD
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: postgres-data
      spec:
        accessModes: ['ReadWriteOnce']
        resources:
          requests:
            storage: 10Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: my-app
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  type: ClusterIP
```

### 9.4. Ingress Controller (Nginx)

#### `k8s/ingress.yml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: my-app
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: 'true'
    nginx.ingress.kubernetes.io/force-ssl-redirect: 'true'
    nginx.ingress.kubernetes.io/limit-rps: '10'
    nginx.ingress.kubernetes.io/enable-cors: 'true'
    nginx.ingress.kubernetes.io/cors-allow-origin: 'https://domain.com'
    nginx.ingress.kubernetes.io/cors-allow-credentials: 'true'
    nginx.ingress.kubernetes.io/proxy-read-timeout: '3600'
    nginx.ingress.kubernetes.io/proxy-send-timeout: '3600'
    cert-manager.io/cluster-issuer: 'letsencrypt-prod'
spec:
  tls:
    - hosts:
        - domain.com
        - www.domain.com
      secretName: domain-tls
  rules:
    - host: domain.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 5000
          - path: /socket.io
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 5000
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
```

### 9.5. Horizontal Pod Autoscaler (HPA)

#### `k8s/hpa.yml`

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: my-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
  namespace: my-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 2
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### 9.6. Cert-Manager (Let's Encrypt)

#### `k8s/cert-manager-issuer.yml`

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@domain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```

### 9.7. Helm Chart

#### `helm/my-app/Chart.yaml`

```yaml
apiVersion: v2
name: my-app
description: A Helm chart for my production app
type: application
version: 1.0.0
appVersion: '1.0.0'
dependencies:
  - name: postgresql
    version: '13.2.0'
    repository: 'https://charts.bitnami.com/bitnami'
    condition: postgresql.enabled
  - name: redis
    version: '18.6.0'
    repository: 'https://charts.bitnami.com/bitnami'
    condition: redis.enabled
```

#### `helm/my-app/values.yaml`

```yaml
replicaCount: 3
image:
  repository: ghcr.io/username/repo
  pullPolicy: IfNotPresent
  tag: 'latest'

imagePullSecrets:
  - name: ghcr-secret

backend:
  enabled: true
  replicas: 3
  image:
    repository: ghcr.io/username/repo/backend
    tag: latest
  service:
    type: ClusterIP
    port: 5000
  resources:
    requests:
      memory: 256Mi
      cpu: 250m
    limits:
      memory: 512Mi
      cpu: 500m

frontend:
  enabled: true
  replicas: 2
  image:
    repository: ghcr.io/username/repo/frontend
    tag: latest
  service:
    type: ClusterIP
    port: 80
  resources:
    requests:
      memory: 64Mi
      cpu: 100m
    limits:
      memory: 128Mi
      cpu: 200m

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: 'true'
  hosts:
    - host: domain.com
      paths:
        - path: /api
          pathType: Prefix
          service: backend
          port: 5000
        - path: /
          pathType: Prefix
          service: frontend
          port: 80
  tls:
    - secretName: domain-tls
      hosts:
        - domain.com

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

postgresql:
  enabled: true
  auth:
    username: myapp
    database: myapp
    existingSecret: app-secrets
    secretKeys:
      userPasswordKey: DB_PASSWORD
  primary:
    persistence:
      enabled: true
      size: 10Gi

redis:
  enabled: true
  auth:
    enabled: true
    existingSecret: app-secrets
    existingSecretPasswordKey: REDIS_PASSWORD
  master:
    persistence:
      enabled: true
      size: 1Gi
```

#### Deploy voi Helm

```bash
# Add repos
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install dependencies
helm dependency update ./helm/my-app

# Install/Upgrade
helm upgrade --install my-app ./helm/my-app   --namespace my-app   --create-namespace   --values ./helm/my-app/values-production.yaml   --wait

# Rollback neu loi
helm rollback my-app 1
```

---

## 10. Monitoring & Observability

### 10.1. Prometheus + Grafana

#### Backend metrics endpoint

```javascript
import promClient from 'prom-client';

// Collect default metrics
promClient.collectDefaultMetrics();

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const activeUsers = new promClient.Gauge({
  name: 'active_users',
  help: 'Number of currently active users',
});

// Middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    };
    end(labels);
    httpRequestsTotal.inc(labels);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

### 10.2. Loki (Log Aggregation)

```yaml
# docker-compose.yml them Loki
services:
  loki:
    image: grafana/loki:2.9.0
    ports:
      - '3100:3100'
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml
    command: -config.file=/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:2.9.0
    volumes:
      - /var/log:/var/log:ro
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
```

### 10.3. Distributed Tracing (Jaeger)

```javascript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

### 10.4. Uptime Alert

```yaml
# Uptime Kuma hoac Pingdom config
# Alert qua Slack/PagerDuty khi service down
```

---

## TONG KET MO RONG

| Cong nghe                 | Muc dich                                          | File chinh                       |
| ------------------------- | ------------------------------------------------- | -------------------------------- |
| PostgreSQL + Prisma       | Database ORM, Migration, Transaction              | `schema.prisma`, `database.js`   |
| Redis                     | Session store, Cache, Rate limit, Pub/Sub         | `redis.js`, `session.service.js` |
| Socket.io + Redis Adapter | Real-time communication, Multi-server scale       | `socket.js`                      |
| GitHub Actions            | CI/CD, Test, Build, Deploy                        | `.github/workflows/*.yml`        |
| Kubernetes                | Container orchestration, Auto-scale, Self-healing | `k8s/*.yml`, `helm/`             |
| Prometheus + Grafana      | Metrics, Monitoring, Alerting                     | `/metrics` endpoint              |

_Document version: 1.0 | Last updated: 2026-05-25_
