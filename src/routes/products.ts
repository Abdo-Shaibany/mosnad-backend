import express from 'express';

import schemaErrorHandler from 'src/middleware/schema-error';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getPagedProducts,
  updateProduct,
} from 'src/controllers/products';
import { createProductValidationSchema } from 'src/validation-schemas/products';
import {
  validatePagedRequest,
} from 'src/validation-schemas/get_request';
import auth from 'src/middleware/auth';

const router = express.Router();

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getPagedProducts
);
router.get('/:id', auth, getProductById);

router.post(
  '/',
  auth,
  createProductValidationSchema,
  schemaErrorHandler,
  createProduct
);

router.put(
  '/',
  auth,
  createProductValidationSchema,
  schemaErrorHandler,
  updateProduct
);

router.delete('/:id', auth, deleteProduct);

export default router;
