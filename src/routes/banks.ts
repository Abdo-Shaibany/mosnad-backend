import express from 'express';
import { checkSchema } from 'express-validator';
import { createOptionValidation } from 'src/validation-schemas/option';
import {
  createBank,
  deleteBank,
  getAllBanks,
  getBankById,
  getPagedBanks,
  updateBank,
} from 'src/controllers/banks';
import schemaErrorHandler from 'src/middleware/schema-error';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import auth from 'src/middleware/auth';

const router = express.Router();

router.get('/', auth, getAllBanks);

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getPagedBanks
);

router.get('/:id', auth, getBankById);

router.post('/', auth, createOptionValidation, schemaErrorHandler, createBank);

router.put('/', auth, createOptionValidation, schemaErrorHandler, updateBank);

router.delete('/:id', auth, deleteBank);
export default router;
