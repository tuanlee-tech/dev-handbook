# 🛒 KIẾN TRÚC BACKEND CHO SÀN THƯƠNG MẠI ĐIỆN TỬ

> **Hành trình từ Anti-pattern → Production-ready Architecture**
>
> **Context:** Sàn e-commerce phát triển từ 0 → 1 triệu users

---

## 📋 MỤC LỤC

1. [Tổng quan các mức độ kiến trúc](#tổng-quan)
2. [Chi tiết từng giai đoạn](#chi-tiết-giai-đoạn)
3. [Modular Monolith - Kiến trúc khuyến nghị](#modular-monolith)
4. [Flow quan trọng nhất: Đặt hàng](#order-flow)
5. [Logic đặt ở đâu](#logic-placement)
6. [Database Design](#database-design)
7. [Redis - Sống còn cho E-commerce](#redis-usage)
8. [Queue - Bắt buộc phải có](#queue-system)
9. [Performance & Scale](#performance-scale)
10. [Khi nào tách Microservices](#microservices-migration)
11. [Polyglot Architecture](#polyglot-architecture)
12. [Flash Sale - Test thực sự](#flash-sale)
13. [Dấu hiệu cần Scale ngay](#scale-signals)
14. [Roadmap thực tế](#roadmap)

---

## 📊 TỔNG QUAN CÁC MỨC ĐỘ KIẾN TRÚC {#tổng-quan}

| Giai đoạn                  | Traffic      | Team    | Chi phí refactor        | Độ phức tạp         | Khả năng scale |
| -------------------------- | ------------ | ------- | ----------------------- | ------------------- | -------------- |
| **Node Route + SQL Logic** | < 10k/day    | 1-3 dev | ⚠️ Cao (2-3 tháng)      | ⭐ Thấp             | ❌ Kém         |
| **Monolith bẩn**           | 10k-30k/day  | 3-5 dev | ⚠️ Trung bình (1 tháng) | ⭐⭐ Trung bình     | ⚠️ Hạn chế     |
| **Modular Monolith**       | 30k-100k/day | 5-8 dev | ✅ Thấp                 | ⭐⭐⭐ Vừa phải     | ✅ Tốt         |
| **Microservices**          | > 100k/day   | > 8 dev | 🔴 Rất cao              | ⭐⭐⭐⭐⭐ Phức tạp | ✅ Xuất sắc    |

---

## 🔴 MỨC 0: NODE ROUTE + SQL LOGIC {#chi-tiết-giai-đoạn}

### 📝 Đặc điểm

```javascript
// NodeJS chỉ làm router
app.post('/api/order', async (req, res) => {
  const result = await db.query('CALL sp_create_order(?, ?, ?)', [
    userId,
    productId,
    quantity,
  ]);
  res.json(result);
});
```

```sql
-- Toàn bộ logic trong SQL
CREATE PROCEDURE sp_create_order(...)
BEGIN
  -- Validate user
  -- Check stock
  -- Calculate price
  -- Update stock
  -- Create order
  -- Send notification (trigger)
END;
```

### ✅ Ưu điểm

- Dev cực nhanh (ít code backend)
- Performance tốt (logic gần data)
- Transaction dễ quản lý

### ❌ Nhược điểm nghiêm trọng

**1. Vendor Lock-in**

```
MySQL → PostgreSQL?
→ Viết lại 100% stored procedures
→ Mất 2-3 tháng
```

**2. Không tách được service**

```
Muốn tách microservices?
→ Logic dính chặt DB
→ KHÔNG THỂ
```

**3. Không áp dụng được Queue**

```
Cần async task (email, image processing)?
→ SQL trigger? Quá phức tạp
→ Phải refactor lên NodeJS
```

**4. Testing nightmare**

```javascript
// Không unit test được
// Phải integration test với DB thật
// Chạy chậm, khó maintain
```

**5. Team scaling issue**

```
Dev mới vào → phải học SQL procedure
Backend dev → không làm được gì ngoài route
```

### 🎯 Khi nào chấp nhận được?

- ✅ POC/MVP < 2 tuần
- ✅ App rất đơn giản, chỉ CRUD
- ✅ Team 1-2 người, mạnh SQL
- ❌ **KHÔNG BAO GIỜ** cho production lâu dài

### 💰 Chi phí migrate ra

- **Thời gian:** 1-2 tháng
- **Risk:** Cao
- **Phải viết lại:** 70-80% logic

---

## 🟡 MỨC 1: MONOLITH BẨN

### 📝 Đặc điểm

```javascript
// Tất cả trong 1 file app.js (hoặc vài file)
const express = require('express');
const app = express();

// Controller + Service + DB lẫn lộn
app.post('/api/order', async (req, res) => {
  // Validate ở đây
  if (!req.body.userId) return res.status(400).json({...});

  // Business logic ở đây
  const product = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
  if (product.stock < quantity) return res.status(400).json({...});

  // DB ở đây
  await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId]);
  await db.query('INSERT INTO orders...', [...]);

  // Response
  res.json({ success: true });
});
```

### ❌ Vấn đề

**1. Spaghetti code**

```
- 1 file > 1000 dòng
- Sửa 1 chỗ → bug 3 chỗ
- Không thể tái sử dụng code
```

**2. Không có layer**

```
Controller = Service = Repository
→ Không test được
→ Không tách được
```

**3. Race condition**

```javascript
// Không có transaction đúng
// 2 user mua cùng lúc → oversell
```

**4. Không scale về code**

```
Dev A sửa order
Dev B sửa payment
→ Conflict liên tục
```

### 🎯 Khi nào chấp nhận được?

- ✅ MVP trong 1-2 tháng
- ✅ Team < 3 người
- ❌ **PHẢI refactor trước khi > 10k users**

### 💰 Chi phí migrate ra

- **Thời gian:** 2-4 tuần
- **Risk:** Trung bình
- **Strategy:** Refactor dần theo module

---

## 🟢 MỨC 2: MODULAR MONOLITH (KHUYẾN NGHỊ) {#modular-monolith}

### 📝 Folder Structure chuẩn cho E-commerce

```
ecommerce-backend/
├── src/
│   ├── modules/
│   │   ├── auth/                    ← Authentication & Authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts
│   │   │   └── auth.middleware.ts
│   │   ├── user/                    ← User management
│   │   ├── product/                 ← Product catalog
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.repository.ts
│   │   │   └── product.queue.ts
│   │   ├── inventory/               ← Stock management (QUAN TRỌNG)
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   ├── inventory.repository.ts
│   │   │   └── inventory.lock.ts    ← Redis locking
│   │   ├── cart/                    ← Shopping cart
│   │   ├── order/                   ← Order processing (CORE)
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   ├── order.repository.ts
│   │   │   ├── order.queue.ts
│   │   │   └── order.events.ts
│   │   ├── payment/                 ← Payment integration
│   │   ├── shipping/                ← Shipping & delivery
│   │   ├── promotion/               ← Discounts & vouchers
│   │   ├── review/                  ← Product reviews
│   │   ├── notification/            ← Email, SMS, Push
│   │   └── admin/                   ← Admin panel
│   ├── shared/
│   │   ├── database/
│   │   ├── redis/
│   │   ├── queue/
│   │   ├── events/                  ← Event bus
│   │   ├── utils/
│   │   └── middlewares/
│   └── app.ts
├── workers/                          ← Background jobs
│   ├── email.worker.ts
│   ├── image.worker.ts
│   ├── inventory-sync.worker.ts
│   ├── payment-webhook.worker.ts
│   └── analytics.worker.ts
└── tests/
    ├── unit/
    └── integration/
```

### 🔥 FLOW QUAN TRỌNG NHẤT: ĐẶT HÀNG {#order-flow}

```
Client
  ↓
API (NodeJS)
  ↓
Order Service
  ↓
────────────────────────────────────
1. Validate cart
2. Check inventory (concurrent-safe)
3. Apply promotion
4. Calculate total
5. Reserve stock (Redis lock + DB)
6. Create order
7. Create payment
────────────────────────────────────
  ↓
Queue (async tasks)
  ↓
Workers
  ├─ Send confirmation email
  ├─ Update analytics
  ├─ Notify shipping
  └─ Sync warehouse
```

### 💡 Implementation chi tiết

```typescript
// 1. CONTROLLER (HTTP Layer)
export class OrderController {
  constructor(private orderService: OrderService) {}

  async create(req: Request, res: Response) {
    // Chỉ validate & parse
    const dto = new CreateOrderDTO(req.body);
    await dto.validate();

    // Gọi service
    const order = await this.orderService.create({
      userId: req.user.id,
      ...dto,
    });

    res.json({ success: true, data: order });
  }
}

// 2. SERVICE (Business Logic) - CORE CỦA E-COMMERCE
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private promotionService: PromotionService,
    private paymentService: PaymentService,
    private orderQueue: OrderQueue,
    private eventBus: EventBus
  ) {}

  async create(data: CreateOrderInput): Promise<Order> {
    // 1. Validate user
    const user = await this.userService.findById(data.userId);
    if (!user.isActive) throw new BusinessError('User inactive');

    // 2. Validate cart items
    const cartItems = await this.validateCartItems(data.items);

    // 3. Check stock (với Redis lock để tránh race condition)
    for (const item of cartItems) {
      const hasStock = await this.inventoryService.checkAndReserve({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      });

      if (!hasStock) {
        throw new BusinessError(`Out of stock: ${item.productName}`);
      }
    }

    // 4. Calculate pricing
    let subtotal = 0;
    for (const item of cartItems) {
      const product = await this.productService.findById(item.productId);
      subtotal += product.price * item.quantity;
    }

    // 5. Apply promotions
    const discount = await this.promotionService.calculate({
      userId: data.userId,
      items: cartItems,
      subtotal,
    });

    const total = subtotal - discount;

    // 6. Create order (with transaction)
    const order = await this.orderRepo.transaction(async (trx) => {
      // Create order
      const createdOrder = await this.orderRepo.create(
        {
          userId: data.userId,
          items: cartItems,
          subtotal,
          discount,
          total,
          status: 'pending',
        },
        trx
      );

      // Confirm stock reservation
      for (const item of cartItems) {
        await this.inventoryService.confirmReservation(item.reservationId, trx);
      }

      return createdOrder;
    });

    // 7. Async tasks (KHÔNG chờ, return ngay)
    await this.orderQueue.add('send-confirmation-email', {
      orderId: order.id,
      email: user.email,
    });

    await this.orderQueue.add('update-analytics', {
      orderId: order.id,
      userId: user.id,
      total,
    });

    // 8. Emit event cho các services khác
    await this.eventBus.emit('order.created', {
      orderId: order.id,
      userId: user.id,
      total,
    });

    return order;
  }

  private async validateCartItems(items: CartItem[]) {
    // Validate logic
    // ...
  }
}

// 3. REPOSITORY (Data Layer)
export class OrderRepository {
  async create(data: CreateOrderData, trx?): Promise<Order> {
    const conn = trx || db;

    // Insert order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, subtotal, discount, total, status, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [data.userId, data.subtotal, data.discount, data.total, data.status]
    );

    // Insert order items
    for (const item of data.items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          item.productId,
          item.variantId,
          item.quantity,
          item.price,
        ]
      );
    }

    return this.findById(orderResult.insertId);
  }

  async transaction<T>(callback: (trx) => Promise<T>): Promise<T> {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

// 4. INVENTORY SERVICE (Cực kỳ quan trọng cho E-commerce)
export class InventoryService {
  constructor(
    private inventoryRepo: InventoryRepository,
    private redis: Redis
  ) {}

  async checkAndReserve(data: ReserveStockInput): Promise<boolean> {
    const lockKey = `inventory:lock:${data.productId}:${data.variantId}`;
    const lock = await this.redis.set(lockKey, '1', 'EX', 10, 'NX');

    if (!lock) {
      // Đợi 100ms và retry
      await this.sleep(100);
      return this.checkAndReserve(data);
    }

    try {
      // Check available stock
      const inventory = await this.inventoryRepo.findByProductVariant(
        data.productId,
        data.variantId
      );

      if (inventory.available < data.quantity) {
        return false;
      }

      // Reserve stock (chưa confirm)
      await this.inventoryRepo.reserve({
        productId: data.productId,
        variantId: data.variantId,
        quantity: data.quantity,
        reservationId: uuidv4(), // Trả về để confirm sau
      });

      return true;
    } finally {
      await this.redis.del(lockKey);
    }
  }

  async confirmReservation(reservationId: string, trx?) {
    // Move từ reserved → sold
    await this.inventoryRepo.confirmReservation(reservationId, trx);
  }

  async releaseReservation(reservationId: string) {
    // Move từ reserved → available (khi payment fail)
    await this.inventoryRepo.releaseReservation(reservationId);
  }
}
```

### ✅ Rule quan trọng

#### ✔️ ĐƯỢC PHÉP

```typescript
// Module A gọi Service của Module B
class OrderService {
  constructor(
    private productService: ProductService, // OK
    private userService: UserService // OK
  ) {}
}

// Giao tiếp qua Event
eventBus.emit('order.created', { orderId });
```

#### ❌ KHÔNG ĐƯỢC PHÉP

```typescript
// Module A import Repository của Module B
class OrderService {
  constructor(
    private productRepo: ProductRepository // ❌ KHÔNG!!!
  ) {}
}

// Truy cập DB của module khác
await db.query('SELECT * FROM users...'); // ❌ KHÔNG!!!
```

### 🎯 Ưu điểm Modular Monolith

- ✅ Cấu trúc rõ ràng theo domain
- ✅ Dễ test (unit + integration)
- ✅ Team scale tốt (5-8 devs)
- ✅ Deploy đơn giản (1 artifact)
- ✅ Dễ debug (1 codebase)
- ✅ Chuẩn bị sẵn cho microservices

### 💰 Chi phí vận hành

- Infrastructure: $500-1,200/tháng (100k users/day)
- Đơn giản hơn microservices nhiều

---

## 🎯 LOGIC ĐẶT Ở ĐÂU? {#logic-placement}

| Loại logic            | Nên để ở             | Lý do                     |
| --------------------- | -------------------- | ------------------------- |
| **Validate input**    | Controller / DTO     | Gần HTTP layer, fail fast |
| **Business rules**    | Service              | Core logic, dễ test       |
| **Flow điều phối**    | Service              | Orchestration             |
| **Query đơn giản**    | Repository           | Data access               |
| **Join phức tạp**     | SQL / Repository     | Performance               |
| **Aggregate**         | SQL                  | Database mạnh hơn         |
| **Transaction**       | Service + Repository | ACID guarantee            |
| **Tính toán nặng**    | Worker / Queue       | Không block API           |
| **External API call** | Service              | Business logic            |
| **Caching logic**     | Service              | Business decision         |

### ❌ Anti-patterns cần tránh (ĐẶC BIỆT QUAN TRỌNG CHO E-COMMERCE)

```typescript
// ❌ Business logic trong Controller
app.post('/order', async (req, res) => {
  if (product.stock < quantity) {  // ❌ Logic ở đây
    return res.status(400).json({...});
  }
});

// ❌ Business logic trong Repository
class OrderRepo {
  async create(data) {
    if (data.total > 10000000) {  // ❌ Logic ở đây
      throw new Error('Order too large');
    }
  }
}

// ❌ SQL logic trong Service
class OrderService {
  async getOrders() {
    return await db.query(`
      SELECT o.*, u.name, p.title
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN products p ON p.id = o.product_id
      WHERE o.status = 'active'
    `);  // ❌ SQL ở đây, phải ở Repository
  }
}

// ❌ NGHIÊM TRỌNG: Trừ kho trong SQL trigger
CREATE TRIGGER after_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  UPDATE inventory SET stock = stock - NEW.quantity;  -- ❌ KHÔNG!!!
END;

// ❌ Payment logic trong Stored Procedure
CREATE PROCEDURE process_payment(...)  -- ❌ KHÔNG!!!
```

### ✅ Đúng cách cho E-commerce

```typescript
// ✅ Controller: chỉ HTTP concerns
class OrderController {
  async create(req, res) {
    const dto = new CreateOrderDTO(req.body);
    await dto.validate(); // ✓ Validate ở đây

    const order = await this.service.create(dto);
    res.json({ data: order });
  }
}

// ✅ Service: business logic
class OrderService {
  async create(data) {
    // ✓ Business rules
    if (data.total > this.MAX_ORDER_VALUE) {
      throw new BusinessError('Order too large');
    }

    // ✓ Orchestration
    await this.inventoryService.reserve(data.items);
    const order = await this.orderRepo.create(data);
    await this.emailQueue.add('order-created', order);

    return order;
  }
}

// ✅ Repository: chỉ data access
class OrderRepository {
  async create(data) {
    // ✓ Chỉ SQL
    return await db.query('INSERT INTO orders...', [data]);
  }

  async findWithDetails(orderId) {
    // ✓ SQL phức tạp OK ở đây
    return await db.query(
      `
      SELECT o.*, u.name, p.title
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN products p ON p.id = o.product_id
      WHERE o.id = ?
    `,
      [orderId]
    );
  }
}
```

---

## 💾 DATABASE DESIGN CHO E-COMMERCE {#database-design}

### Tables chính

```sql
-- Users
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);

-- Products
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id BIGINT,
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category_id),
  INDEX idx_slug (slug),
  INDEX idx_is_active (is_active)
);

-- Product Variants (size, color, etc.)
CREATE TABLE product_variants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255),  -- e.g., "Red - XL"
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_product_id (product_id),
  INDEX idx_sku (sku)
);

-- Inventory (CỰC KỲ QUAN TRỌNG)
CREATE TABLE inventory (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  variant_id BIGINT,
  available INT NOT NULL DEFAULT 0,      -- Có thể bán
  reserved INT NOT NULL DEFAULT 0,       -- Đang giữ cho orders pending
  sold INT NOT NULL DEFAULT 0,           -- Đã bán
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (variant_id) REFERENCES product_variants(id),
  UNIQUE KEY uk_product_variant (product_id, variant_id),
  INDEX idx_updated_at (updated_at)
);

-- Inventory Reservations (để track)
CREATE TABLE inventory_reservations (
  id VARCHAR(36) PRIMARY KEY,  -- UUID
  product_id BIGINT NOT NULL,
  variant_id BIGINT,
  quantity INT NOT NULL,
  order_id BIGINT,
  status ENUM('pending', 'confirmed', 'released') DEFAULT 'pending',
  expires_at TIMESTAMP,  -- Auto release sau X phút
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status_expires (status, expires_at)
);

-- Orders
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,  -- ORD-2024-000001
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  shipping_address_id BIGINT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Order Items
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  variant_id BIGINT,
  product_name VARCHAR(255) NOT NULL,  -- Snapshot
  variant_name VARCHAR(255),           -- Snapshot
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,        -- Price tại thời điểm order
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);

-- Payments
CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  payment_method ENUM('card', 'bank_transfer', 'cod', 'wallet') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'success', 'failed') DEFAULT 'pending',
  gateway VARCHAR(50),  -- stripe, paypal, vnpay
  transaction_id VARCHAR(255),
  gateway_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_order_id (order_id),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_status (status)
);

-- Shipments
CREATE TABLE shipments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  carrier VARCHAR(100),
  tracking_number VARCHAR(255),
  status ENUM('pending', 'picked_up', 'in_transit', 'delivered', 'failed') DEFAULT 'pending',
  estimated_delivery TIMESTAMP,
  actual_delivery TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_order_id (order_id),
  INDEX idx_tracking_number (tracking_number)
);

-- Promotions / Vouchers
CREATE TABLE promotions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('percentage', 'fixed_amount', 'free_shipping') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_valid_dates (valid_from, valid_to)
);
```

### Inventory Logic (Quan trọng nhất)

```typescript
// Khi user checkout:
// 1. available ↓, reserved ↑
UPDATE inventory
SET available = available - ?,
    reserved = reserved + ?
WHERE product_id = ? AND variant_id = ?
  AND available >= ?;  -- Atomic check

// 2. Khi payment success:
// reserved ↓, sold ↑
UPDATE inventory
SET reserved = reserved - ?,
    sold = sold + ?
WHERE product_id = ? AND variant_id = ?;

// 3. Khi payment fail hoặc timeout:
// reserved ↓, available ↑ (release)
UPDATE inventory
SET reserved = reserved - ?,
    available = available + ?
WHERE product_id = ? AND variant_id = ?;
```

---

## 🔴 REDIS - SỐNG CÒN CHO E-COMMERCE {#redis-usage}

### Các use case BẮT BUỘC

| Use case                | Lý do                           | TTL        |
| ----------------------- | ------------------------------- | ---------- |
| **Cart**                | Tốc độ, không cần persist ngay  | 7 days     |
| **Session**             | Scale horizontal                | 1 day      |
| **Rate limit**          | Chống bot, API abuse            | 1 hour     |
| **Hot products**        | Giảm DB load                    | 1 hour     |
| **Inventory lock**      | Tránh oversell (race condition) | 10 seconds |
| **Flash sale queue**    | Fair order processing           | 1 hour     |
| **Product cache**       | Giảm DB queries                 | 1 hour     |
| **Search autocomplete** | Tốc độ                          | 1 day      |

### Implementation Examples

```typescript
// 1. CART (Redis Hash)
class CartService {
  async addItem(userId: string, item: CartItem) {
    const key = `cart:${userId}`;

    await redis.hset(key, item.productId, JSON.stringify(item));
    await redis.expire(key, 7 * 24 * 60 * 60); // 7 days
  }

  async getCart(userId: string): Promise<CartItem[]> {
    const key = `cart:${userId}`;
    const items = await redis.hgetall(key);

    return Object.values(items).map((i) => JSON.parse(i));
  }

  async clearCart(userId: string) {
    await redis.del(`cart:${userId}`);
  }
}

// 2. INVENTORY LOCK (Redis SET NX)
class InventoryLockService {
  async acquireLock(productId: string, variantId: string): Promise<boolean> {
    const lockKey = `lock:inventory:${productId}:${variantId}`;
    const lockValue = uuidv4();

    const acquired = await redis.set(
      lockKey,
      lockValue,
      'EX',
      10, // 10 seconds TTL
      'NX' // Only set if not exists
    );

    return !!acquired;
  }

  async releaseLock(productId: string, variantId: string) {
    const lockKey = `lock:inventory:${productId}:${variantId}`;
    await redis.del(lockKey);
  }
}

// 3. HOT PRODUCTS CACHE (Redis String)
class ProductCacheService {
  async getProduct(productId: string): Promise<Product | null> {
    const cacheKey = `product:${productId}`;

    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Cache miss - query DB
    const product = await db.query('SELECT * FROM products WHERE id = ?', [
      productId,
    ]);

    // Cache it
    await redis.setex(
      cacheKey,
      3600, // 1 hour
      JSON.stringify(product)
    );

    return product;
  }

  async invalidateProduct(productId: string) {
    await redis.del(`product:${productId}`);
  }
}

// 4. RATE LIMITING (Redis INCR)
class RateLimitService {
  async checkLimit(ip: string, endpoint: string): Promise<boolean> {
    const key = `rate:${endpoint}:${ip}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60); // 1 minute window
    }

    const limit = 100; // 100 requests per minute
    return count <= limit;
  }
}

// 5. FLASH SALE QUEUE (Redis List)
class FlashSaleService {
  async joinQueue(userId: string, productId: string): Promise<number> {
    const queueKey = `flash:${productId}:queue`;

    // Add to queue
    const position = await redis.rpush(queueKey, userId);
    await redis.expire(queueKey, 3600); // 1 hour

    return position;
  }

  async processQueue(productId: string, batchSize: number = 10) {
    const queueKey = `flash:${productId}:queue`;

    // Get first N users
    const users = await redis.lrange(queueKey, 0, batchSize - 1);

    // Remove processed users
    await redis.ltrim(queueKey, batchSize, -1);

    // Process orders for these users
    for (const userId of users) {
      await this.processFlashOrder(userId, productId);
    }
  }
}
```

### Redis Configuration cho Production

```javascript
const redis = new Redis({
  host: 'redis-cluster.example.com',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  db: 0,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  // Connection pool
  lazyConnect: false,
  keepAlive: 30000,
});

// Redis Cluster cho high availability
const cluster = new Redis.Cluster(
  [
    { host: 'redis-1.example.com', port: 6379 },
    { host: 'redis-2.example.com', port: 6379 },
    { host: 'redis-3.example.com', port: 6379 },
  ],
  {
    redisOptions: {
      password: process.env.REDIS_PASSWORD,
    },
  }
);
```

---

## 📨 QUEUE - BẮT BUỘC PHẢI CÓ {#queue-system}

### Những task ĐẶT VÀO QUEUE (Không làm đồng bộ)

| Task                   | Lý do                               | Priority |
| ---------------------- | ----------------------------------- | -------- |
| **Send email**         | Chậm (SMTP), không cần kết quả ngay | Low      |
| **Process images**     | CPU-heavy                           | Medium   |
| **Sync warehouse**     | External API, có thể fail           | Low      |
| **Payment webhook**    | Retry logic phức tạp                | High     |
| **Generate reports**   | Chậm, không urgent                  | Low      |
| **Update analytics**   | Không critical                      | Low      |
| **Send notifications** | Batch processing hiệu quả hơn       | Medium   |

### BullMQ Setup (Recommended)

```typescript
// queue.config.ts
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
});

// Email Queue
export const emailQueue = new Queue('email', { connection });

// Email Worker
const emailWorker = new Worker(
  'email',
  async (job) => {
    const { to, subject, template, data } = job.data;

    console.log(`Processing email job ${job.id}`);

    await emailService.send({
      to,
      subject,
      html: renderTemplate(template, data),
    });

    console.log(`Email sent to ${to}`);
  },
  {
    connection,
    concurrency: 5, // 5 emails đồng thời
  }
);

// Error handling
emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});
```

### Queue Usage trong Order Service

```typescript
class OrderService {
  async create(data: CreateOrderInput): Promise<Order> {
    // ... create order logic ...

    const order = await this.orderRepo.create(orderData);

    // ✅ Queue async tasks - KHÔNG CHỜ

    // 1. Email confirmation (low priority)
    await emailQueue.add(
      'order-confirmation',
      {
        orderId: order.id,
        email: user.email,
        orderNumber: order.orderNumber,
      },
      {
        priority: 3,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );

    // 2. Update analytics (low priority)
    await analyticsQueue.add(
      'track-order',
      {
        orderId: order.id,
        userId: user.id,
        total: order.total,
        items: order.items,
      },
      {
        priority: 5,
        attempts: 2,
      }
    );

    // 3. Sync warehouse (medium priority)
    await warehouseQueue.add(
      'sync-order',
      {
        orderId: order.id,
        items: order.items,
      },
      {
        priority: 2,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );

    // Return ngay, không chờ queue xử lý
    return order;
  }
}
```

### Multiple Queue Workers

```typescript
// workers/email.worker.ts
const emailWorker = new Worker(
  'email',
  async (job) => {
    switch (job.name) {
      case 'order-confirmation':
        await sendOrderConfirmation(job.data);
        break;
      case 'password-reset':
        await sendPasswordReset(job.data);
        break;
      case 'promotional':
        await sendPromotional(job.data);
        break;
    }
  },
  { connection, concurrency: 10 }
);

// workers/image.worker.ts
const imageWorker = new Worker(
  'image-processing',
  async (job) => {
    const { imageUrl, productId } = job.data;

    // Resize, optimize, generate thumbnails
    const processed = await sharp(imageUrl)
      .resize(800, 800)
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to S3
    await s3.upload({
      Bucket: 'products',
      Key: `${productId}/main.jpg`,
      Body: processed,
    });
  },
  { connection, concurrency: 3 }
); // CPU-heavy, giới hạn concurrency

// workers/webhook.worker.ts
const webhookWorker = new Worker(
  'payment-webhook',
  async (job) => {
    const { orderId, paymentData } = job.data;

    // Process payment webhook
    await paymentService.processWebhook(orderId, paymentData);
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 100, // Max 100 jobs
      duration: 1000, // per 1 second
    },
  }
);
```

### Queue Monitoring Dashboard

```typescript
// Setup BullMQ Board (UI dashboard)
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(imageQueue),
    new BullMQAdapter(webhookQueue),
    new BullMQAdapter(analyticsQueue),
  ],
  serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

// Truy cập: http://localhost:3000/admin/queues
```

---

## ⚡ PERFORMANCE & SCALE {#performance-scale}

### 1. Horizontal Scaling với PM2

```bash
# Production deployment
pm2 start ecosystem.config.js --env production

# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ecommerce-api',
    script: './dist/app.js',
    instances: 'max',        // Sử dụng hết CPU cores
    exec_mode: 'cluster',    // Cluster mode
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    // Health check
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000,
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Restart strategy
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
  }]
};
```

### 2. Database Optimization

#### Connection Pooling

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 100, // Max connections
  queueLimit: 0, // Unlimited queue
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Health check
setInterval(async () => {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
}, 30000);
```

#### Essential Indexes

```sql
-- Orders: Most queried
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Products: Search & filter
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE FULLTEXT INDEX idx_products_search ON products(name, description);

-- Inventory: Critical for stock checks
CREATE UNIQUE INDEX idx_inventory_product_variant ON inventory(product_id, variant_id);

-- Order items: Analytics
CREATE INDEX idx_order_items_product ON order_items(product_id, created_at);

-- Composite index cho query thường xuyên
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
```

#### Query Optimization

```typescript
// ❌ N+1 Query Problem
async getOrdersWithUser() {
  const orders = await db.query('SELECT * FROM orders');

  for (const order of orders) {
    // N queries!!!
    order.user = await db.query('SELECT * FROM users WHERE id = ?', [order.user_id]);
  }
}

// ✅ JOIN Solution
async getOrdersWithUser() {
  return await db.query(`
    SELECT
      o.*,
      u.name as user_name,
      u.email as user_email
    FROM orders o
    INNER JOIN users u ON u.id = o.user_id
    WHERE o.status = 'active'
    ORDER BY o.created_at DESC
    LIMIT 100
  `);
}

// ✅ hoặc Batch Fetch
async getOrdersWithUser() {
  const orders = await db.query('SELECT * FROM orders LIMIT 100');
  const userIds = [...new Set(orders.map(o => o.user_id))];

  const users = await db.query(
    'SELECT * FROM users WHERE id IN (?)',
    [userIds]
  );

  const userMap = new Map(users.map(u => [u.id, u]));

  return orders.map(o => ({
    ...o,
    user: userMap.get(o.user_id)
  }));
}
```

### 3. Caching Strategy (Multi-layer)

```typescript
class ProductService {
  private memoryCache = new Map();

  async findById(id: number): Promise<Product> {
    // Layer 1: Memory cache (fastest)
    if (this.memoryCache.has(id)) {
      return this.memoryCache.get(id);
    }

    // Layer 2: Redis (fast)
    const cached = await redis.get(`product:${id}`);
    if (cached) {
      const product = JSON.parse(cached);
      this.memoryCache.set(id, product);
      return product;
    }

    // Layer 3: Database (slow)
    const product = await this.productRepo.findById(id);

    // Cache lại
    await redis.setex(`product:${id}`, 3600, JSON.stringify(product));
    this.memoryCache.set(id, product);

    return product;
  }

  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    // Update DB
    const product = await this.productRepo.update(id, data);

    // Invalidate all cache layers
    this.memoryCache.delete(id);
    await redis.del(`product:${id}`);

    // Optional: Warm cache immediately
    await redis.setex(`product:${id}`, 3600, JSON.stringify(product));

    return product;
  }
}
```

### 4. Load Balancing

```nginx
# nginx.conf
upstream backend {
    least_conn;  # Balance based on active connections

    server 10.0.1.10:3000 weight=3;
    server 10.0.1.11:3000 weight=3;
    server 10.0.1.12:3000 weight=2;  # Slower server

    keepalive 32;
}

server {
    listen 80;
    server_name api.ecommerce.com;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Headers
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

---

## 🔥 FLASH SALE - TEST THỰC SỰ {#flash-sale}

> **Nhiều app chết ở đây!** Flash sale là test case khắc nghiệt nhất.

### ❌ Kiến trúc SAI (App sẽ chết)

```typescript
// ❌ KHÔNG BAO GIỜ LÀM NHƯ NÀY
app.post('/flash-sale/buy', async (req, res) => {
  // Check stock trực tiếp DB
  const product = await db.query('SELECT stock FROM products WHERE id = ?');

  if (product.stock > 0) {
    // Race condition!!!
    // 1000 requests cùng lúc → oversell
    await db.query('UPDATE products SET stock = stock - 1');
    await db.query('INSERT INTO orders...');
  }

  res.json({ success: true });
});
```

**Vấn đề:**

- 10,000 requests/second → Database chết
- Race condition → Oversell (bán quá số lượng)
- Không fair (người sau có thể mua được)

### ✅ Kiến trúc ĐÚNG

```
Client (100k users)
  ↓
API Gateway (Rate limit: 1000 req/s per IP)
  ↓
Load Balancer
  ↓
NodeJS API (Multiple instances)
  ↓
Redis (Atomic operations)
  ↓
Queue (Fair processing)
  ↓
Workers (Process orders)
  ↓
Database (Final confirmation)
```

### Implementation chi tiết

```typescript
// 1. Flash Sale Setup
class FlashSaleService {
  async setupFlashSale(productId: number, stock: number, startTime: Date) {
    const saleKey = `flash:${productId}`;

    // Set available stock in Redis
    await redis.set(`${saleKey}:stock`, stock);
    await redis.set(`${saleKey}:start`, startTime.getTime());

    // Initialize queue
    await redis.del(`${saleKey}:queue`);
  }

  // 2. User joins flash sale
  async joinFlashSale(userId: number, productId: number): Promise<JoinResult> {
    const saleKey = `flash:${productId}`;

    // Check if started
    const startTime = await redis.get(`${saleKey}:start`);
    if (Date.now() < parseInt(startTime)) {
      throw new Error('Flash sale not started');
    }

    // Check if user already in queue
    const inQueue = await redis.sismember(`${saleKey}:users`, userId);
    if (inQueue) {
      throw new Error('Already in queue');
    }

    // Atomic stock check and reserve
    const script = `
      local stock = redis.call('GET', KEYS[1])
      if tonumber(stock) > 0 then
        redis.call('DECR', KEYS[1])
        redis.call('SADD', KEYS[2], ARGV[1])
        redis.call('RPUSH', KEYS[3], ARGV[1])
        return 1
      else
        return 0
      end
    `;

    const result = await redis.eval(
      script,
      3,
      `${saleKey}:stock`, // KEYS[1]
      `${saleKey}:users`, // KEYS[2]
      `${saleKey}:queue`, // KEYS[3]
      userId.toString() // ARGV[1]
    );

    if (result === 0) {
      throw new Error('Sold out');
    }

    // Get position in queue
    const position = await redis.llen(`${saleKey}:queue`);

    // Add to processing queue (BullMQ)
    await flashSaleQueue.add(
      'process-order',
      {
        userId,
        productId,
        saleKey,
      },
      {
        priority: position, // FIFO
        attempts: 3,
      }
    );

    return {
      success: true,
      position,
      message: 'In queue for processing',
    };
  }
}

// 3. Worker processes orders
const flashSaleWorker = new Worker(
  'flash-sale',
  async (job) => {
    const { userId, productId, saleKey } = job.data;

    try {
      // Create actual order in DB
      const order = await orderService.createFlashSaleOrder({
        userId,
        productId,
        saleKey,
      });

      // Send confirmation
      await emailQueue.add('flash-sale-success', {
        userId,
        orderId: order.id,
      });

      // Remove from queue
      await redis.lrem(`${saleKey}:queue`, 1, userId);
    } catch (error) {
      // Failed - return stock
      await redis.incr(`${saleKey}:stock`);
      await redis.srem(`${saleKey}:users`, userId);

      // Notify user
      await emailQueue.add('flash-sale-failed', {
        userId,
        reason: error.message,
      });
    }
  },
  {
    connection: redis,
    concurrency: 10, // Process 10 orders at a time
    limiter: {
      max: 100,
      duration: 1000, // Max 100 orders per second
    },
  }
);

// 4. Client polling for status
app.get('/flash-sale/:productId/status', async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const saleKey = `flash:${productId}`;

  // Check if in queue
  const inQueue = await redis.sismember(`${saleKey}:users`, userId);

  if (!inQueue) {
    return res.json({ status: 'not_in_queue' });
  }

  // Find position
  const queue = await redis.lrange(`${saleKey}:queue`, 0, -1);
  const position = queue.indexOf(userId.toString()) + 1;

  // Check if order created
  const order = await orderService.findByUserAndSale(userId, productId);

  if (order) {
    return res.json({
      status: 'completed',
      order,
    });
  }

  return res.json({
    status: 'processing',
    position,
    estimatedTime: position * 2, // 2 seconds per order
  });
});
```

### Rate Limiting cho Flash Sale

```typescript
// API-level rate limiting
import rateLimit from 'express-rate-limit';

const flashSaleLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Max 5 requests per second per IP
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Redis store for distributed rate limiting
  store: new RedisStore({
    client: redis,
    prefix: 'rl:flash:',
  }),
});

app.use('/flash-sale', flashSaleLimiter);
```

### Monitoring Flash Sale

```typescript
// Real-time metrics
class FlashSaleMonitor {
  async getMetrics(productId: number) {
    const saleKey = `flash:${productId}`;

    const [stock, queueLength, totalUsers] = await Promise.all([
      redis.get(`${saleKey}:stock`),
      redis.llen(`${saleKey}:queue`),
      redis.scard(`${saleKey}:users`),
    ]);

    return {
      remainingStock: parseInt(stock),
      queueLength,
      totalParticipants: totalUsers,
      soldOut: parseInt(stock) === 0,
    };
  }

  // WebSocket for real-time updates
  broadcastMetrics(productId: number) {
    setInterval(async () => {
      const metrics = await this.getMetrics(productId);
      io.to(`flash:${productId}`).emit('metrics', metrics);
    }, 1000); // Update every second
  }
}
```

---

## 🚨 DẤU HIỆU CẦN SCALE NGAY {#scale-signals}

### ⚠️ Technical Signals

**1. Deploy & Build Issues**

- [ ] Deploy time > 10 phút
- [ ] Build/test suite > 20 phút
- [ ] CI/CD pipeline thường xuyên fail
- [ ] Rollback ảnh hưởng toàn bộ app

**2. Performance Issues (E-commerce specific)**

- [ ] ✅ **Order spike khi sale** → API timeout
- [ ] ✅ **DB CPU > 70%** liên tục
- [ ] ✅ **Timeout khi checkout** (> 3 giây)
- [ ] ✅ **Oversell xảy ra** (bán quá stock)
- [ ] ✅ **Payment webhook delay** > 5 phút
- [ ] Một module chậm → toàn bộ app chậm
- [ ] Không scale riêng được module hot
- [ ] Resource usage không đều (CPU/Memory)

**3. Code & Team Issues**

- [ ] Một module crash → sập cả app
- [ ] Git conflicts liên tục
- [ ] Code review mất > 2 ngày
- [ ] Refactor sợ ảnh hưởng modules khác
- [ ] Team > 8 backend devs làm chung repo

**4. Business Requirements**

- [ ] Cần SLA khác nhau cho từng module
- [ ] Compliance riêng biệt (PCI-DSS cho payment)
- [ ] Multi-region deployment
- [ ] Partner cần API riêng

### 🎯 Scoring System

| Số dấu hiệu | Hành động                                      |
| ----------- | ---------------------------------------------- |
| **0-2**     | ✅ Modular Monolith là đủ                      |
| **3-4**     | ⚠️ Chuẩn bị tách 1-2 service                   |
| **5-7**     | 🔴 NÊN tách services ngay                      |
| **8+**      | 🚨 PHẢI tách, đang technical debt nghiêm trọng |

---

## 🔵 TÁCH MICROSERVICES {#microservices-migration}

### ❌ SAI: Tách hết cùng lúc

```
Ngày 1: 1 monolith
Ngày 30: 10 microservices
→ Disaster!
```

### ✅ ĐÚNG: Tách từng service có vấn đề

#### Ưu tiên tách theo thứ tự (E-commerce specific)

**1️⃣ Payment Service** (Ưu tiên cao nhất)

- **Lý do:** PCI-DSS compliance, isolation
- **Tech:** NodeJS hoặc Java Spring Boot
- **Communication:** HTTP/REST + Webhooks

**2️⃣ Inventory Service** (Performance critical)

- **Lý do:** CPU-heavy, real-time stock updates
- **Tech:** Go (high performance)
- **Communication:** gRPC (fast)

**3️⃣ Order Service** (Business logic trọng)

- **Lý do:** Complex workflows, cần scale riêng
- **Tech:** NodeJS
- **Communication:** Event-driven (Kafka)

**4️⃣ Search/Catalog Service**

- **Lý do:** Read-heavy, cần tech khác
- **Tech:** Elasticsearch + NodeJS
- **Communication:** HTTP/REST

### Timeline Migration

```
Tháng 1: Tách Payment Service
         ├── NodeJS Monolith (giữ nguyên)
         └── Payment Service (NodeJS/Java - mới)

Tháng 3: Tách Inventory Service
         ├── NodeJS Monolith (còn lại)
         ├── Payment Service
         └── Inventory Service (Go - mới)

Tháng 6: Tách Search Service
         ├── Core Monolith (user, product, order core)
         ├── Payment Service
         ├── Inventory Service (Go)
         └── Search Service (Elasticsearch + NodeJS - mới)
```

### Kiến trúc sau khi tách

```
[Client]
   ↓
[CDN - Cloudflare]
   ↓
[Load Balancer]
   ↓
[API Gateway - NodeJS + Kong]
   ↓
┌──────────────────────────────────────────┐
│  CORE MONOLITH (NodeJS)                  │
│  - User Management                       │
│  - Product Catalog                       │
│  - Order Orchestration                   │
│  - Admin Panel                           │
└──────────────────────────────────────────┘
   ↓ HTTP/gRPC
┌──────────────────┬──────────────────┬──────────────────┐
│ Payment Service  │ Inventory Svc    │ Search Service   │
│ (NodeJS/Java)    │ (Go) ⚡          │ (Elastic + Node) │
├──────────────────┼──────────────────┼──────────────────┤
│ - Process payment│ - Stock check    │ - Full-text      │
│ - Refunds        │ - Reserve/release│ - Autocomplete   │
│ - Webhooks       │ - Real-time sync │ - Filters        │
│                  │                  │                  │
│ PostgreSQL       │ PostgreSQL       │ Elasticsearch    │
│ (encrypted)      │ + Redis (lock)   │                  │
└──────────────────┴──────────────────┴──────────────────┘
   ↓
┌──────────────────────────────────────────┐
│  Event Bus (Kafka / RabbitMQ)            │
│                                          │
│  Topics:                                 │
│  - order.created                         │
│  - payment.completed                     │
│  - inventory.updated                     │
└──────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────┐
│  Workers (NodeJS + Go + Python)          │
│  - Email (Node)                          │
│  - Image processing (Go)                 │
│  - Analytics (Python)                    │
└──────────────────────────────────────────┘
```

### Communication Patterns

**Synchronous (gRPC) - Khi cần response ngay**

```typescript
// Order Service → Inventory Service (gRPC)
const inventoryClient = new InventoryServiceClient(
  'inventory-service:50051',
  grpc.credentials.createInsecure()
);

const checkStock = promisify(inventoryClient.checkStock.bind(inventoryClient));

const response = await checkStock({
  productId: 123,
  variantId: 456,
  quantity: 2,
});

if (!response.available) {
  throw new Error('Out of stock');
}
```

**Asynchronous (Event-driven) - Fire and forget**

```typescript
// Order created → Emit event
await eventBus.publish('order.created', {
  orderId: order.id,
  userId: user.id,
  total: order.total,
  items: order.items,
});

// Multiple services listen
// - Payment Service: Create payment intent
// - Inventory Service: Confirm reservation
// - Analytics Service: Track metrics
// - Notification Service: Send emails
```

---

## 🌍 POLYGLOT ARCHITECTURE {#polyglot-architecture}

> **"Use the right tool for the right job"**

### 📊 NodeJS vs Go vs Java vs Python

| Tiêu chí              | NodeJS     | Go         | Java       | Python     |
| --------------------- | ---------- | ---------- | ---------- | ---------- |
| **I/O Performance**   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | ⭐⭐⭐     |
| **CPU Performance**   | ⭐⭐       | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐       |
| **Development Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     | ⭐⭐       | ⭐⭐⭐⭐⭐ |
| **Memory Usage**      | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐       | ⭐⭐⭐     |
| **Concurrency**       | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐       |
| **Ecosystem**         | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 🎯 Khi nào dùng từng ngôn ngữ?

**NodeJS - Core API & BFF**

```
✅ Rất phù hợp:
- API Gateway / BFF
- User-facing APIs
- Real-time (WebSocket)
- Order orchestration
- CRUD operations

⚠️ OK nhưng có lựa chọn tốt hơn:
- CPU-heavy → Go tốt hơn
- Batch processing → Java tốt hơn

❌ Không nên:
- Video encoding
- Image processing (large scale)
- Scientific computing
```

**Go - High Performance Services**

```
✅ Rất phù hợp:
- Inventory Service (10k concurrent checks)
- Real-time pricing engine
- WebSocket gateway
- Stock reservation
- CLI tools

Case study: Flash Sale
NodeJS: 10k req/s → 500ms (p95)
Go:     10k req/s → 50ms (p95)
```

**Java - Enterprise & Complex Logic**

```
✅ Rất phù hợp:
- Payment gateway integration
- Order processing (complex rules)
- Batch jobs (billing, settlement)
- Legacy integration (SAP, Oracle)
- Banking/Financial systems

Ưu điểm:
- Ecosystem mature nhất
- Enterprise support
- Thread model ổn định
```

**Python - ML & Data**

```
✅ Rất phù hợp:
- Recommendation engine
- Fraud detection
- Data analytics
- Image processing (với libraries)
- ETL pipelines

Example: Recommendation Service
from sklearn.neighbors import NearestNeighbors

def get_similar_products(user_id, k=10):
    user_vector = model.get_user_embedding(user_id)
    neighbors = model.kneighbors([user_vector], k)
    return get_products_by_ids(neighbors[1][0])
```

---

## 🗺️ ROADMAP THỰC TẾ {#roadmap}

### Timeline cho E-commerce Startup (6-12 tháng)

#### 🚀 Tháng 1-2: MVP (Modular Monolith)

**Goal:** Launch sản phẩm nhanh

**Architecture:**

- Modular Monolith (NodeJS + TypeScript)
- PostgreSQL
- Redis cache
- BullMQ queue
- PM2 deploy

**Team:** 2-3 devs

**Features:**

- User auth (JWT)
- Product catalog
- Shopping cart (Redis)
- Basic checkout
- Payment integration (Stripe/VNPay)
- Email notifications

**Infrastructure:**

```
- VPS/EC2: $50/month
- Database: $20/month
- Redis: $10/month
Total: ~$80/month
```

---

#### 📊 Tháng 3-4: Growth (Optimize Monolith)

**Goal:** 10k → 50k users/day

**Improvements:**

- Database indexing
- Redis caching strategy
- Queue cho async tasks
- Basic monitoring (PM2 + logs)
- CDN cho static assets
- Image optimization

**Team:** 3-5 devs

**Infrastructure:**

```
- Load balancer: $20/month
- CDN (Cloudflare): Free tier
- Monitoring (basic): $20/month
Total: ~$150/month
```

---

#### 🔧 Tháng 5-6: Scale Preparation

**Goal:** 50k → 100k users/day

**Actions:**

- Refactor modules rõ ràng
- API documentation (Swagger)
- Load testing (k6, Artillery)
- Database query optimization
- Multi-layer caching
- Monitoring dashboards (Grafana)
- Error tracking (Sentry)

**Team:** 5-8 devs

**Infrastructure:**

```
- Multiple app servers: $200/month
- Database (managed): $100/month
- Redis (managed): $50/month
- Monitoring (Datadog): $100/month
Total: ~$500/month
```

---

#### 🏗️ Tháng 7-9: First Microservice

**Goal:** Tách service đầu tiên

**Tách service nào?**

**Option 1: Inventory Service** (nếu có vấn đề performance)

- Viết lại bằng Go
- gRPC API
- Independent scaling
- Redis locking

**Option 2: Payment Service** (nếu cần compliance)

- Java Spring Boot hoặc NodeJS
- PCI-DSS compliant
- Isolated infrastructure

**Infrastructure cần thêm:**

- API Gateway (Kong): $50/month
- Message queue (Kafka/RabbitMQ): $100/month
- Monitoring upgrade: $150/month
  Total: ~$800/month

**Team:** 8-10 devs (có thể chia squad)

---

#### 📈 Tháng 10-12+: Full Microservices (if needed)

**Goal:** > 100k users/day, multi-team

**Architecture:**

- 5-8 microservices
- Kubernetes orchestration
- Full observability stack
- Multi-region (if needed)

**Services:**

1. Core Monolith (User, Product, Order core)
2. Payment Service
3. Inventory Service
4. Search Service
5. Analytics Service
6. Notification Service

**Infrastructure:**

```
- Kubernetes cluster: $500/month
- Databases (multiple): $400/month
- Redis clusters: $200/month
- Message queue: $150/month
- Monitoring & logging: $300/month
- CDN & storage: $150/month
Total: ~$1,700/month
```

**Team:** 10+ devs, chia thành squads:

- User & Auth squad (2-3 devs)
- Product & Inventory squad (2-3 devs)
- Order & Payment squad (2-3 devs)
- Platform squad (2-3 devs)

---

## 💡 KẾT LUẬN & KHUYẾN NGHỊ

### 🎯 Quy tắc vàng

**1. Không vội vàng**

```
❌ Ngày 1: "Làm microservices đi"
✅ Ngày 1: "Làm Modular Monolith tốt"
```

**2. Trade-off thông minh**

```
Speed vs Quality:
- MVP: Ưu tiên speed (nhưng có structure)
- Growth: Balance
- Scale: Ưu tiên quality + architecture
```

**3. Measure before optimize**

```
❌ "Node chậm, chuyển sang Go"
✅ "API này chậm vì query N+1, fix query trước"
```

**4. Tách service khi có lý do rõ ràng**

```
Bad reasons:
- "Nghe microservices cool"
- "Big company đang làm vậy"

Good reasons (E-commerce):
- Payment service: PCI-DSS compliance
- Inventory service: Performance issue không fix được
- Team > 8 devs, cần tách squad
- Flash sale cần scale riêng
```

### 🚦 Decision Tree

```
Bắt đầu project mới?
├─ YES → Modular Monolith
│
Đang có Monolith bẩn?
├─ YES → Refactor thành Modular Monolith
│
Traffic > 100k/day + Team > 8 devs + Có ≥4 signals?
├─ YES → Cân nhắc Microservices
│        ├─ Có infrastructure ready? → YES → Tách từ từ
│        └─ Chưa → Prepare infrastructure trước
│
Còn lại?
└─ STAY với Modular Monolith (đủ cho 80% trường hợp)
```

---

## 📚 TÓM TẮT NHANH

### Phase 0: ❌ Node Route + SQL Logic

- Ưu tiên: ⭐⭐ (chỉ cho POC)
- Dev speed: Nhanh
- Technical debt: Rất cao
- Chi phí refactor: 2-3 tháng

### Phase 1: ⚠️ Monolith bẩn

- Ưu tiên: ⭐⭐⭐ (MVP < 3 tháng)
- Dev speed: Nhanh
- Technical debt: Cao
- Chi phí refactor: 1-2 tháng

### Phase 2: ✅ Modular Monolith (RECOMMENDED)

- Ưu tiên: ⭐⭐⭐⭐⭐
- Dev speed: Tốt
- Technical debt: Thấp
- Chi phí refactor: Thấp
- **→ Đủ cho 80% ứng dụng e-commerce**

### Phase 3: 🏢 Microservices

- Ưu tiên: ⭐⭐⭐⭐ (khi thực sự cần)
- Dev speed: Chậm hơn
- Technical debt: Thấp
- Complexity: Rất cao
- **→ Chỉ khi traffic > 100k/day + team > 8 devs**

---

## 🎓 E-commerce Specific Checklist

### ✅ Must Have (Giai đoạn 1-3 tháng)

- [ ] User authentication & authorization – xác thực người dùng, phân quyền user/admin
- [ ] Product catalog với variants – quản lý sản phẩm có nhiều biến thể (size, màu, SKU)
- [ ] Shopping cart (Redis) – giỏ hàng lưu tạm bằng Redis để tăng hiệu năng
- [ ] Order flow hoàn chỉnh – quy trình tạo đơn, thanh toán, cập nhật trạng thái
- [ ] Payment integration – tích hợp cổng thanh toán và xử lý webhook
- [ ] Inventory management (basic) – kiểm tra và trừ tồn kho cơ bản
- [ ] Email notifications – gửi email xác nhận đơn hàng và trạng thái
- [ ] Admin panel – trang quản trị cho sản phẩm, đơn hàng, người dùng

### ✅ Should Have (Giai đoạn 3-6 tháng)

- [ ] Search & filters – tìm kiếm và lọc theo danh mục, giá, thuộc tính
- [ ] Product reviews – đánh giá và nhận xét từ khách hàng
- [ ] Promotions/vouchers – quản lý mã giảm giá và khuyến mãi
- [ ] Order tracking – theo dõi trạng thái và tiến trình giao hàng
- [ ] Multiple payment methods – hỗ trợ nhiều hình thức thanh toán
- [ ] Inventory locking (Redis) – khóa tồn kho để tránh oversell
- [ ] Queue system (BullMQ) – xử lý tác vụ nền như email, webhook
- [ ] Basic analytics – thống kê doanh thu, đơn hàng, sản phẩm bán chạy

### ✅ Nice to Have (Giai đoạn 6-12 tháng)

- [ ] Recommendation engine – gợi ý sản phẩm theo hành vi người dùng
- [ ] Flash sale support – hỗ trợ bán hàng giảm giá theo thời gian
- [ ] Multi-warehouse – quản lý tồn kho theo nhiều kho
- [ ] Advanced analytics – phân tích hành vi, funnel, cohort
- [ ] Fraud detection – phát hiện giao dịch và đơn hàng bất thường
- [ ] Multi-region deployment – triển khai đa khu vực để giảm độ trễ
- [ ] Mobile app APIs – API tối ưu cho ứng dụng mobile

---

## 📖 Resources để học thêm

**Modular Monolith:**

- "Modular Monolith: A Primer" - Kamil Grzybek
- NestJS documentation

**Microservices:**

- "Building Microservices" - Sam Newman
- "Microservices Patterns" - Chris Richardson

**E-commerce Specific:**

- "Building Scalable E-commerce" - Various case studies
- Shopify Engineering Blog
- Amazon Architecture Papers

**Performance:**

- "High Performance Browser Networking"
- NodeJS Performance Best Practices
- Database Performance Tuning

**Distributed Systems:**

- "Designing Data-Intensive Applications" - Martin Kleppmann

---

**Tài liệu được tạo bởi:** Tổng hợp từ kinh nghiệm thực tế

## 🎯 GỢI Ý NHỮNG THỨ CẦN BỔ SUNG

Dựa trên tài liệu hiện tại, dưới đây là các hạng mục còn thiếu hoặc cần được mở rộng thêm để hoàn thiện hệ thống:

### 1. **Bảo mật & Xác thực (Security & Authentication)** (QUAN TRỌNG)

- [ ] Triển khai JWT chi tiết (access token, payload, thời hạn)
- [ ] Chiến lược refresh token (rotation, revoke)
- [ ] Tích hợp OAuth2 (đăng nhập Google, Facebook)
- [ ] Chiến lược giới hạn tần suất (rate limiting)
- [ ] Phòng chống SQL injection (ORM, prepared statements)
- [ ] Bảo vệ XSS (sanitize input, HTTP headers)
- [ ] Bảo vệ CSRF (CSRF token, SameSite cookie)
- [ ] Quản lý API key (rotate, scope)
- [ ] Phân quyền theo vai trò (RBAC)

### 2. **Upload File & Quản lý Media**

- [ ] Tích hợp S3/Cloud Storage
- [ ] Pipeline tối ưu ảnh (resize, compress)
- [ ] Presigned URL để upload/download an toàn
- [ ] Nhiều kích thước ảnh (thumbnail, medium, large)
- [ ] Xử lý video (nếu có)
- [ ] Cấu hình CDN (CloudFront, Cloudflare)

### 3. **Triển khai Tìm kiếm (Search Implementation)**

- [ ] Cấu hình Elasticsearch chi tiết
- [ ] Tìm kiếm toàn văn (full-text search)
- [ ] Tìm kiếm theo bộ lọc (faceted search)
- [ ] Gợi ý tự động (autocomplete)
- [ ] Xếp hạng/kết quả tìm kiếm (scoring)
- [ ] Xử lý từ đồng nghĩa
- [ ] Chấp nhận lỗi chính tả (typo tolerance)

### 4. **Chiến lược Kiểm thử (Testing Strategy)**

- [ ] Unit test (Jest)
- [ ] Integration test
- [ ] Kiểm thử E2E (Playwright/Cypress)
- [ ] Kiểm thử tải (k6, Artillery)
- [ ] Contract testing (Pact)
- [ ] Mục tiêu độ bao phủ test
- [ ] Chiến lược mock dữ liệu/dịch vụ

### 5. **Pipeline CI/CD**

- [ ] GitHub Actions / GitLab CI
- [ ] Tối ưu build Docker
- [ ] Migration database trong CI/CD
- [ ] Triển khai blue-green
- [ ] Triển khai canary
- [ ] Chiến lược rollback
- [ ] Quản lý môi trường (dev, staging, prod)

### 6. **Giám sát & Quan sát hệ thống (Monitoring & Observability)** (CHI TIẾT HƠN)

- [ ] Chiến lược logging (ELK Stack, Datadog)
- [ ] Thu thập metrics (Prometheus)
- [ ] Distributed tracing (Jaeger, Zipkin)
- [ ] Theo dõi lỗi (Sentry)
- [ ] APM (giám sát hiệu năng ứng dụng)
- [ ] Cấu hình cảnh báo & ngưỡng
- [ ] Dashboard (Grafana)
- [ ] Theo dõi chỉ số kinh doanh

### 7. **Tích hợp Cổng thanh toán (Payment Gateway Integration)**

- [ ] Tích hợp Stripe chi tiết
- [ ] VNPay / MoMo (Việt Nam)
- [ ] PayPal
- [ ] Xử lý webhook thanh toán
- [ ] Logic retry thanh toán
- [ ] Quy trình hoàn tiền
- [ ] 3D Secure
- [ ] Checklist tuân thủ PCI-DSS

### 8. **Tích hợp Vận chuyển (Shipping Integration)**

- [ ] Tích hợp GHN / GHTK / Ninja Van
- [ ] Tính phí vận chuyển
- [ ] Xác thực địa chỉ
- [ ] Cập nhật trạng thái đơn hàng
- [ ] Webhook từ đối tác vận chuyển

### 9. **Hệ thống Email & Thông báo**

- [ ] Template email (Handlebars, Pug)
- [ ] Cấu hình SendGrid / AWS SES
- [ ] SMS gateway (Twilio, esms.vn)
- [ ] Push notification (Firebase)
- [ ] Chiến lược queue email
- [ ] Xử lý unsubscribe

### 10. **Phân tích & Báo cáo (Analytics & Reporting)**

- [ ] Tích hợp Google Analytics
- [ ] Theo dõi sự kiện tuỳ chỉnh
- [ ] Báo cáo doanh thu
- [ ] Báo cáo tồn kho
- [ ] Theo dõi hành vi người dùng
- [ ] Phễu chuyển đổi (conversion funnel)
- [ ] Thiết lập A/B testing

### 11. **Tính năng Nâng cao (Advanced Features)**

- [ ] Danh sách yêu thích (Wishlist)
- [ ] So sánh sản phẩm
- [ ] Sản phẩm đã xem gần đây
- [ ] Thuật toán gợi ý sản phẩm liên quan
- [ ] Hỗ trợ khách hàng (Live chat, Ticket)
- [ ] Đa ngôn ngữ (i18n)
- [ ] Đa tiền tệ
- [ ] Chương trình khách hàng thân thiết / tích điểm

### 12. **Di chuyển & Khởi tạo Dữ liệu (Data Migration & Seeding)**

- [ ] Chiến lược seeding database
- [ ] Import từ CSV/Excel
- [ ] Script migration
- [ ] Xác thực dữ liệu
- [ ] Quy trình rollback

### 13. **Tài liệu API (API Documentation)**

- [ ] Cấu hình Swagger / OpenAPI
- [ ] Chiến lược version API
- [ ] Bộ sưu tập Postman
- [ ] GraphQL (nếu sử dụng)

### 14. **Tối ưu cho Mobile (Mobile-Specific Optimizations)**

- [ ] Giảm kích thước response API
- [ ] Lazy loading hình ảnh
- [ ] Chiến lược hỗ trợ offline
- [ ] Deep linking
- [ ] Xử lý push notification

### 15. **Tối ưu Chi phí (Cost Optimization)**

- [ ] Phân tích chi phí truy vấn database
- [ ] Tối ưu chi phí CDN
- [ ] Serverless cho tác vụ nhẹ (Lambda)
- [ ] Chiến lược reserved instances
- [ ] Chính sách auto-scaling

---

## 🚀 Ưu tiên triển khai theo thứ tự

### Phase 1 (Tháng 1–2): BẮT BUỘC

1. Bảo mật & Xác thực
2. Upload file & CDN
3. Kiểm thử cơ bản
4. Pipeline CI/CD
5. Cổng thanh toán (1–2 phương thức)
6. Thông báo qua email

### Phase 2 (Tháng 3–4): QUAN TRỌNG

7. Tìm kiếm (Elasticsearch)
8. Monitoring & Logging
9. Tích hợp vận chuyển
10. Hoàn thiện chiến lược kiểm thử

### Phase 3 (Tháng 5–6): NÂNG CAO

11. Phân tích nâng cao
12. SMS & Push notification
13. Tài liệu API
14. Tính năng nâng cao (Wishlist, v.v.)

### Phase 4 (Tháng 7+): TỐI ƯU

15. Tối ưu chi phí
16. Tối ưu cho mobile
17. Đa ngôn ngữ / đa tiền tệ
18. A/B testing

---
