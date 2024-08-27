import express from 'express';

import schemaErrorHandler from 'src/middleware/schema-error';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import { createCurrencyValidation } from 'src/validation-schemas/currencies';
import auth from 'src/middleware/auth';
import { createSeller, getPagedSellers, getSellerById, toggleSeller, updateSeller } from 'src/controllers/seller';
import { sellerCreateValidation, sellerUpdateValidation } from 'src/validation-schemas/seller';

const router = express.Router();

// TODO: add role to be only admins :)
router.get('/status/:id', auth, toggleSeller);

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getPagedSellers
);

router.get('/:id', auth, getSellerById);

router.post(
  '/',
  auth,
  sellerCreateValidation,
  schemaErrorHandler,
  createSeller
);

router.put(
  '/',
  auth,
  sellerUpdateValidation,
  schemaErrorHandler,
  updateSeller
);

// router.delete('/:id', auth, deleteBankCurrency);
export default router;
