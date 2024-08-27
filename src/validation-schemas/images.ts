import { check, ValidationChain } from 'express-validator';

export const createImageValidation: ValidationChain[] = [
  check('url')
    .isLength({ min: 3 })
    .withMessage('url must be at least 3 characters.')
    .notEmpty()
    .withMessage('url cannot be empty.')
    .isString()
    .withMessage('url must be a string.'),
];
