import express from 'express';
import { checkSchema } from 'express-validator';
import { createOptionValidation } from 'src/validation-schemas/option';

import schemaErrorHandler from 'src/middleware/schema-error';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getPagedCategories,
  updateCategory,
} from 'src/controllers/categories';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import auth from 'src/middleware/auth';

const router = express.Router();

router.get('/', auth, getAllCategories);
router.get('/:id', auth, getCategoryById);

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getPagedCategories
);

router.post('/', auth, createOptionValidation, schemaErrorHandler, createCategory);
router.put('/', auth, createOptionValidation, schemaErrorHandler, updateCategory);

router.delete('/:id', auth, deleteCategory);

export default router;
