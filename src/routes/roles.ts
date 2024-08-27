import express from 'express';

import schemaErrorHandler from 'src/middleware/schema-error';

import { validatePagedRequest } from 'src/validation-schemas/get_request';
import auth from 'src/middleware/auth';
import { createRole, deleteRole, getPagedRoles, getRoleById, updateRole } from 'src/controllers/roles';
import { validateRoleCreate, validateRoleUpdate } from 'src/validation-schemas/roles';

const router = express.Router();


router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getPagedRoles
);

router.get('/:id', auth, getRoleById);

router.post(
  '/',
  auth,
  validateRoleCreate,
  schemaErrorHandler,
  createRole
);

router.put(
  '/',
  auth,
  validateRoleUpdate,
  schemaErrorHandler,
  updateRole
);

router.delete('/:id', auth, deleteRole);
export default router;
