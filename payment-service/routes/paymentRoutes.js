/**
 * Payment Service - Routes
 */

const express = require('express');
const paymentController = require('../controllers/paymentController');
const { validateCreatePayment, validateUpdatePayment, validatePaymentId } = require('../validators/paymentValidator');

const createPaymentRoutes = (Payment) => {
  const router = express.Router();

  /**
   * @swagger
   * /payments:
   *   get:
   *     summary: Get all payments
   *     tags: [Payments]
   *     responses:
   *       200:
   *         description: List of all payments
   *   post:
   *     summary: Create a new payment
   *     tags: [Payments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - orderId
   *               - amount
   *               - method
   *             properties:
   *               orderId:
   *                 type: number
   *               amount:
   *                 type: number
   *               method:
   *                 type: string
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
   *     responses:
   *       200:
   *         description: Payment found
   *   put:
   *     summary: Update payment by ID
   *     tags: [Payments]
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
   *               orderId:
   *                 type: number
   *               amount:
   *                 type: number
   *               method:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Payment updated
   *   delete:
   *     summary: Delete payment by ID
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Payment deleted
   */

  router.get('/payments', paymentController.getAllPayments(Payment));
  router.post('/payments', validateCreatePayment, paymentController.createPayment(Payment));
  router.get('/payments/:id', validatePaymentId, paymentController.getPaymentById(Payment));
  router.put('/payments/:id', validatePaymentId, validateUpdatePayment, paymentController.updatePayment(Payment));
  router.delete('/payments/:id', validatePaymentId, paymentController.deletePayment(Payment));

  return router;
};

module.exports = createPaymentRoutes;
