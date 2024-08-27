import { check, ValidationChain } from 'express-validator';

export const validatePagedRequest: ValidationChain[] = [
  // Validate pagination object
  check('pagination')
    .exists()
    .withMessage('Pagination object is required.')
    .isObject()
    .withMessage('Pagination must be an object.'),

  check('pagination.pageSize')
    .exists()
    .withMessage('Page size is required.')
    .isInt({ min: 1 })
    .withMessage('Page size must be a positive integer.'),

  check('pagination.currentPage')
    .exists()
    .withMessage('Current page is required.')
    .isInt({ min: 0 })
    .withMessage('Current page must be a positive integer.'),

  // Optional search string validation
  check('search').optional().isString().withMessage('Search must be a string.'),

  // Validate filters array
  check('filters')
    .optional()
    .isArray()
    .withMessage('Filters must be an array.'),

  // Optional validation for sorts array
  check('sorts').optional().isArray().withMessage('Sorts must be an array.'),

  // Validate each sort object in the array
  check('sorts.*.key')
    .exists()
    .withMessage('Sort key is required.')
    .isString()
    .withMessage('Sort key must be a string.'),

  check('sorts.*.value')
    .exists()
    .withMessage('Sort value is required.')
    .isIn(['asc', 'desc'])
    .withMessage('Sort value must be "asc" or "desc".'),
];
