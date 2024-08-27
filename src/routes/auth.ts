import express from 'express';

import schemaErrorHandler from 'src/middleware/schema-error';


import { loginValidation, resetPasswordValidation, singupValidation } from 'src/validation-schemas/auth';
import { login, signup } from 'src/controllers/auth';
import { activitylog } from 'src/middleware/activitylog';

const router = express.Router();

router.post(
    '/login',
    loginValidation,
    schemaErrorHandler,
    login,
    activitylog("login user")
);

router.post(
    '/signup',
    singupValidation,
    schemaErrorHandler,
    signup
);

router.post(
    '/resetPassword',
    resetPasswordValidation,
    schemaErrorHandler,
    signup,
    activitylog("reset password")
);

export default router;
