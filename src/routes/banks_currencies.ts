import express from 'express';

import schemaErrorHandler from 'src/middleware/schema-error';
import {
  createBankCurrency,
  deleteBankCurrency,
  getAllCurrencies,
  getBankCurrencies,
  getBankCurrencyById,
  updateBankCurrency,
} from 'src/controllers/banks_currencies';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import { createOptionValidation } from 'src/validation-schemas/option';
import { createCurrencyValidation } from 'src/validation-schemas/currencies';
import auth from 'src/middleware/auth';

const router = express.Router();

router.get('/', auth, getAllCurrencies);

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getBankCurrencies
);

router.get('/:id', auth, getBankCurrencyById);

router.post(
  '/',
  auth,
  createCurrencyValidation,
  schemaErrorHandler,
  createBankCurrency
);

router.put(
  '/',
  auth,
  createCurrencyValidation,
  schemaErrorHandler,
  updateBankCurrency
);

router.delete('/:id', auth, deleteBankCurrency);
export default router;
