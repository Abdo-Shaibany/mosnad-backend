import express from 'express';
import { createOptionValidation } from 'src/validation-schemas/option';

import schemaErrorHandler from 'src/middleware/schema-error';
import {
  createBankLocation,
  deleteBankLocation,
  getAllBanksLocations,
  getBankLocationById,
  getPagedBanksLocations,
  updateBankLocation,
} from 'src/controllers/banks_locations';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import auth from 'src/middleware/auth';

const router = express.Router();

router.get('/', auth, getAllBanksLocations);

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getPagedBanksLocations
);

router.get('/:id', auth, getBankLocationById);

router.post(
  '/',
  auth,
  createOptionValidation,
  schemaErrorHandler,
  createBankLocation
);
router.put('/', auth, createOptionValidation, schemaErrorHandler, updateBankLocation);

router.delete('/:id', auth, deleteBankLocation);
export default router;
