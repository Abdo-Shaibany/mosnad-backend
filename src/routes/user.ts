import express from 'express';

import schemaErrorHandler from 'src/middleware/schema-error';

import { validatePagedRequest } from 'src/validation-schemas/get_request';
import auth from 'src/middleware/auth';
import { deleteUser, getPagedUser, updateUser } from 'src/controllers/user';
import { activitylog } from 'src/middleware/activitylog';
import { updateUserValidation } from 'src/validation-schemas/user';

const router = express.Router();

router.post(
  '/getPaged',
  auth,
  validatePagedRequest,
  schemaErrorHandler,
  getPagedUser
);

router.put('/', auth, updateUserValidation, schemaErrorHandler, updateUser);

router.delete('/:id', auth, deleteUser, activitylog("delete a user"));
export default router;
