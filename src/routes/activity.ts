import express from 'express';


import auth from 'src/middleware/auth';
import { getPagedActivity } from 'src/controllers/activity';
import { authorizePremissions } from 'src/middleware/premission';
import { activitylog } from 'src/middleware/activitylog';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import schemaErrorHandler from 'src/middleware/schema-error';

const router = express.Router();

router.get('/getPaged', validatePagedRequest,
    schemaErrorHandler, auth, authorizePremissions(['premission.view_many']), getPagedActivity);


export default router;
