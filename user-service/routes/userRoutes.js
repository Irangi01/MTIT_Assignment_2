/**
 * User Service - Routes
 */

const express = require('express');
const userController = require('../controllers/userController');
const { validateCreateUser, validateUpdateUser, validateUserId } = require('../validators/userValidator');

const createUserRoutes = (User) => {
  const router = express.Router();

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List of all users
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
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
   *     responses:
   *       200:
   *         description: User found
   *   put:
   *     summary: Update user by ID
   *     tags: [Users]
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
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated
   *   delete:
   *     summary: Delete user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted
   */

  router.get('/users', userController.getAllUsers(User));
  router.post('/users', validateCreateUser, userController.createUser(User));
  router.get('/users/:id', validateUserId, userController.getUserById(User));
  router.put('/users/:id', validateUserId, validateUpdateUser, userController.updateUser(User));
  router.delete('/users/:id', validateUserId, userController.deleteUser(User));

  return router;
};

module.exports = createUserRoutes;
