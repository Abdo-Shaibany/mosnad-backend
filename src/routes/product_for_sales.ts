import express from 'express';


import {
  getProductForSaleById,
  getProductsForSales,
  updateProductForSales,
} from 'src/controllers/product_for_sales';
import auth from 'src/middleware/auth';

import schemaErrorHandler from 'src/middleware/schema-error';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import { updateProductForSaleValidation } from 'src/validation-schemas/product_for_sales';

const router = express.Router();

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getProductsForSales
);

router.get('/:id', auth, getProductForSaleById);

router.put(
  '/',
  auth,
  updateProductForSaleValidation,
  schemaErrorHandler,
  updateProductForSales
);

export default router;
