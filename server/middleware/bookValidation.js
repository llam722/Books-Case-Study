import { body, param, query, validationResult } from 'express-validator';

export const validateBookId = [
  param('id').isMongoId().withMessage('Invalid book ID, please check and try again...'),
];

export const validateBookInputs = [
  
]