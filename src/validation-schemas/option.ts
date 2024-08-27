import { check, ValidationChain } from 'express-validator';

export const createOptionValidation: ValidationChain[] = [
  check('text')
    .isLength({ min: 3 })
    .withMessage('Text must be at least 3 characters.')
    .notEmpty()
    .withMessage('Text cannot be empty.')
    .isString()
    .withMessage('Text must be a string.'),
  check('id').optional().isInt({ gt: 0 }).withMessage('ID must be a number.'),
];
