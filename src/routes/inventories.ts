import express from 'express';
import { createOptionValidation } from 'src/validation-schemas/option';

import schemaErrorHandler from 'src/middleware/schema-error';
import {
  createInventory,
  deleteInventory,
  getAllInventories,
  getInventoryById,
  getPagedInventories,
  updateInventory,
} from 'src/controllers/inventories';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import auth from 'src/middleware/auth';

const router = express.Router();

router.get('/', auth, getAllInventories);

router.get('/:id', auth, getInventoryById);

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getPagedInventories
);

router.post('/', auth, createOptionValidation, schemaErrorHandler, createInventory);

router.put('/', auth, createOptionValidation, schemaErrorHandler, updateInventory);

router.delete('/:id', auth, deleteInventory);
export default router;
