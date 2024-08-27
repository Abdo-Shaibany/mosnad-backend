import express from 'express';
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  getPagedSuppliers,
  updateSupplier,
} from '../controllers/suppliers';
import { validateCreateSupplier } from 'src/validation-schemas/suppliers';
import schemaErrorHandler from 'src/middleware/schema-error';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import auth from 'src/middleware/auth';
import { authorizeRoles } from 'src/middleware/role';

const router = express.Router();

router.post(
  '/getPaged',
  auth,
  authorizeRoles(['admin']),
  validatePagedRequest,
  schemaErrorHandler,
  getPagedSuppliers
);
router.get('/:id', auth, getSupplierById);
router.get('/', auth, getAllSuppliers);

router.post('/', auth, validateCreateSupplier, schemaErrorHandler, createSupplier);
router.put('/', auth, validateCreateSupplier, schemaErrorHandler, updateSupplier);

router.delete('/:id', auth, deleteSupplier);

export default router;
