/**
 * Product Service - Routes
 * Defines all product endpoints
 */

const express = require('express');
const productController = require('../controllers/productController');
const { validateCreateProduct, validateUpdateProduct, validateProductId } = require('../validators/productValidator');

const createProductRoutes = (Product) => {
  const router = express.Router();

  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Get all products
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: List of all products
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - price
   *             properties:
   *               name:
   *                 type: string
   *               price:
   *                 type: number
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
   *     responses:
   *       200:
   *         description: Product found
   *   put:
   *     summary: Update product by ID
   *     tags: [Products]
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
   *               name:
   *                 type: string
   *               price:
   *                 type: number
   *     responses:
   *       200:
   *         description: Product updated
   *   delete:
   *     summary: Delete product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Product deleted
   */
  
  router.get('/products', productController.getAllProducts(Product));
  router.post('/products', validateCreateProduct, productController.createProduct(Product));
  router.get('/products/:id', validateProductId, productController.getProductById(Product));
  router.put('/products/:id', validateProductId, validateUpdateProduct, productController.updateProduct(Product));
  router.delete('/products/:id', validateProductId, productController.deleteProduct(Product));

  return router;
};

module.exports = createProductRoutes;
