import express from 'express';

import {
  createInventorySupply,
  deleteInventorySupply,
  getInventorySupplies,
  getInventorySupplyById,
  updateInventorySupply,
} from 'src/controllers/inventory_supply';
import auth from 'src/middleware/auth';
import schemaErrorHandler from 'src/middleware/schema-error';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import {
  createInventorySupplyValidation,
  updateInventorySupplyValidation,
} from 'src/validation-schemas/inventory_supply';

const router = express.Router();

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getInventorySupplies
);

router.get('/:id', auth, getInventorySupplyById);

router.post(
  '/',
  auth,
  createInventorySupplyValidation,
  schemaErrorHandler,
  createInventorySupply
);

router.put(
  '/',
  auth,
  updateInventorySupplyValidation,
  schemaErrorHandler,
  updateInventorySupply
);

router.delete('/:id', auth, deleteInventorySupply);

export default router;
