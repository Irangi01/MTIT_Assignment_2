/**
 * E-Commerce Microservice - User Service
 * Member: X
 *
 * Assignment notes:
 * - Uses local in-memory array (no database for now).
 * - Provides 3 required routes: GET all, POST new, GET by ID.
 * - Swagger UI is enabled for API documentation and testing.
 */

const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 4005;

// Parse JSON bodies from incoming requests
app.use(express.json());

// Temporary in-memory user list for assignment purposes
const users = [
  { id: 1, name: 'Amal', email: 'amal@example.com' },
  { id: 2, name: 'Bimal', email: 'bimal@example.com' }
];

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'Simple User microservice API for MTIT Assignment 2'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: [__filename]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 */
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

/**
 * @swagger
 * /users:
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
 *                 example: Kasun
 *               email:
 *                 type: string
 *                 example: kasun@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 */
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'name (string) and email (string) are required.' });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email
  };

  users.push(newUser);
  return res.status(201).json(newUser);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.status(200).json(user);
});

app.listen(PORT, () => {
  console.log(`User Service is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
