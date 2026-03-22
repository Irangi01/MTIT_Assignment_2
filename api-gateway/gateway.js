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

const app = express();
const PORT = 3000;

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

// Product service proxy: localhost:3000/products -> localhost:4001/products
app.use(
  '/products',
  createProxyMiddleware({
    target: 'http://localhost:4001',
    changeOrigin: true,
    onError: proxyErrorHandler('Product Service')
  })
);

// User service proxy: localhost:3000/users -> localhost:4002/users
app.use(
  '/users',
  createProxyMiddleware({
    target: 'http://localhost:4002',
    changeOrigin: true,
    onError: proxyErrorHandler('User Service')
  })
);

// Order service proxy: localhost:3000/orders -> localhost:4003/orders
app.use(
  '/orders',
  createProxyMiddleware({
    target: 'http://localhost:4003',
    changeOrigin: true,
    onError: proxyErrorHandler('Order Service')
  })
);

// Payment service proxy: localhost:3000/payments -> localhost:4004/payments
app.use(
  '/payments',
  createProxyMiddleware({
    target: 'http://localhost:4004',
    changeOrigin: true,
    onError: proxyErrorHandler('Payment Service')
  })
);

// Review service proxy: localhost:3000/reviews -> localhost:4005/reviews
app.use(
  '/reviews',
  createProxyMiddleware({
    target: 'http://localhost:4005',
    changeOrigin: true,
    onError: proxyErrorHandler('Review Service')
  })
);

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
