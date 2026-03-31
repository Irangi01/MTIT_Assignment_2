/**
 * API Gateway for E-Commerce Microservices
 *
 * Routes handled by this gateway:
 * - /products  -> Product Service (4001)
 * - /users     -> User Service (4002)
 * - /orders    -> Order Service (4003)
 * - /payments  -> Payment Service (4004)
 * - /reviews   -> Review Service (4005)
 *
 * Gateway runs on port 3000.
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Swagger/OpenAPI setup
const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'E-Commerce Microservices API Gateway',
      version: '1.0.0',
      description: 'API Gateway for E-Commerce Microservices'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ]
  },
  apis: [__filename]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Shared error handler for proxy failures.
 * This is triggered when a target microservice is down or unreachable.
 */
function proxyErrorHandler(serviceName) {
  return (err, req, res) => {
    console.error(`[Gateway] ${serviceName} is unavailable:`, err.message);

    if (!res.headersSent) {
      res.status(503).json({
        message: `${serviceName} is currently unavailable. Please try again later.`
      });
    }
  };
}

// Match both the base route and nested paths (for example: /products and /products/1)
function routeMatcher(basePath) {
  return (pathname, req) => {
    const pathMatch = pathname === basePath || pathname.startsWith(`${basePath}/`);
    const methodMatch = ['GET', 'POST', 'PUT', 'DELETE'].includes(req.method);
    return pathMatch && methodMatch;
  };
}

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     responses:
 *       201:
 *         description: Product created
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
// Product service proxy: localhost:3000/products -> localhost:4001/products
app.use(
  createProxyMiddleware({
    target: 'http://localhost:4001',
    changeOrigin: true,
    pathFilter: routeMatcher('/products'),
    onError: proxyErrorHandler('Product Service')
  })
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: User created
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
// User service proxy: localhost:3000/users -> localhost:4002/users
app.use(
  createProxyMiddleware({
    target: 'http://localhost:4002',
    changeOrigin: true,
    pathFilter: routeMatcher('/users'),
    onError: proxyErrorHandler('User Service')
  })
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Order created
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
// Order service proxy: localhost:3000/orders -> localhost:4003/orders
app.use(
  createProxyMiddleware({
    target: 'http://localhost:4003',
    changeOrigin: true,
    pathFilter: routeMatcher('/orders'),
    onError: proxyErrorHandler('Order Service')
  })
);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payments
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     responses:
 *       201:
 *         description: Payment created
 * /payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
// Payment service proxy: localhost:3000/payments -> localhost:4004/payments
app.use(
  createProxyMiddleware({
    target: 'http://localhost:4004',
    changeOrigin: true,
    pathFilter: routeMatcher('/payments'),
    onError: proxyErrorHandler('Payment Service')
  })
);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     responses:
 *       201:
 *         description: Review created
 * /reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     summary: Delete review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
// Review service proxy: localhost:3000/reviews -> localhost:4005/reviews
app.use(
  createProxyMiddleware({
    target: 'http://localhost:4005',
    changeOrigin: true,
    pathFilter: routeMatcher('/reviews'),
    onError: proxyErrorHandler('Review Service')
  })
);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Gateway health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Gateway is up and running
 */
// Basic gateway status endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    gateway: 'API Gateway',
    status: 'UP',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
