/**
 * Order Service - Routes
 */

const express = require('express');
const orderController = require('../controllers/orderController');
const { validateCreateOrder, validateUpdateOrder, validateOrderId } = require('../validators/orderValidator');

const createOrderRoutes = (Order) => {
  const router = express.Router();

  /**
   * @swagger
   * /orders:
   *   get:
   *     summary: Get all orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: List of all orders
   *   post:
   *     summary: Create a new order
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - customerName
   *               - totalAmount
   *             properties:
   *               customerName:
   *                 type: string
   *               totalAmount:
   *                 type: number
   *               status:
   *                 type: string
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
   *     responses:
   *       200:
   *         description: Order found
   *   put:
   *     summary: Update order by ID
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               customerName:
   *                 type: string
   *               totalAmount:
   *                 type: number
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Order updated
   *   delete:
   *     summary: Delete order by ID
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order deleted
   */

  router.get('/orders', orderController.getAllOrders(Order));
  router.post('/orders', validateCreateOrder, orderController.createOrder(Order));
  router.get('/orders/:id', validateOrderId, orderController.getOrderById(Order));
  router.put('/orders/:id', validateOrderId, validateUpdateOrder, orderController.updateOrder(Order));
  router.delete('/orders/:id', validateOrderId, orderController.deleteOrder(Order));

  return router;
};

module.exports = createOrderRoutes;
