const express = require('express');
const UsersService = require('./../services/users.service');
const validatorHandler = require('./../middleware/validator.handler');

const {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
} = require('./../schemas/user.schema');

const { checkRoles, checkApiKey } = require('./../middleware/auth.handler');

const router = express.Router();
const userService = new UsersService();

router.get('/', checkApiKey, async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  checkApiKey,
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  checkApiKey,
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  checkApiKey,
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await userService.updateUser(id, body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  checkApiKey,
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const resp = await userService.deleteUser(id);
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
