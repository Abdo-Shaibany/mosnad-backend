import { check, ValidationChain } from 'express-validator';

export const loginValidation: ValidationChain[] = [
    check('email')
        .notEmpty()
        .withMessage('Email cannot be empty.')
        .isEmail()
        .withMessage('Invalid email format.'),
    check('password')
        .notEmpty()
        .withMessage('Password cannot be empty.')
        .isString()
        .withMessage('Password must be a string.')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
];

export const singupValidation: ValidationChain[] = [
    check('email')
        .notEmpty()
        .withMessage('Email cannot be empty.')
        .isEmail()
        .withMessage('Invalid email format.'),
    check('password')
        .notEmpty()
        .withMessage('Password cannot be empty.')
        .isString()
        .withMessage('Password must be a string.')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
    check('username')
        .notEmpty()
        .withMessage('Username cannot be empty.')
];

export const resetPasswordValidation: ValidationChain[] = [
    check('email')
        .notEmpty()
        .withMessage('Email cannot be empty.')
        .isEmail()
        .withMessage('Invalid email format.'),
];