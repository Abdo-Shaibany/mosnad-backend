import { check, ValidationChain } from 'express-validator';

export const updateUserValidation: ValidationChain[] = [
  check('email')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .notEmpty()
    .withMessage('Email cannot be empty.'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.')
    .notEmpty()
    .withMessage('Password cannot be empty.'),
  check('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters.')
    .notEmpty()
    .withMessage('Username cannot be empty.')
    .isString()
    .withMessage('Username must be a string.'),
  check('roleId')
    .isInt()
    .withMessage('Role ID must be an integer.')
    .notEmpty()
    .withMessage('Role ID cannot be empty.'),
];
