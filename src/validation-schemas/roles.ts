import { check, validationResult } from 'express-validator';

// Validation for creating a role without an ID
export const validateRoleCreate = [
  check('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters.')
    .notEmpty()
    .withMessage('Name cannot be empty.')
    .isString()
    .withMessage('Name must be a string.'),
  check('premissions')
    .isArray()
    .withMessage('Permissions must be an array.')
    .notEmpty()
    .withMessage('Permissions cannot be empty.')
    .custom((value) => {
      for (const permission of value) {
        if (typeof permission.id !== 'number') {
          throw new Error('Each permission must have a numeric ID.');
        }
      }
      return true;
    }),
];

// Validation for creating a role with an ID
export const validateRoleUpdate = [
  check('id')
    .isInt()
    .withMessage('ID must be an integer.')
    .notEmpty()
    .withMessage('ID cannot be empty.'),
  check('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters.')
    .notEmpty()
    .withMessage('Name cannot be empty.')
    .isString()
    .withMessage('Name must be a string.'),
  check('premissions')
    .isArray()
    .withMessage('Permissions must be an array.')
    .notEmpty()
    .withMessage('Permissions cannot be empty.')
    .custom((value) => {
      for (const permission of value) {
        if (typeof permission.id !== 'number') {
          throw new Error('Each permission must have a numeric ID.');
        }
      }
      return true;
    }),
];

// Middleware to handle validation results
export const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};