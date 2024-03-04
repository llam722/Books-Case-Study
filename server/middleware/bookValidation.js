import { body, param, query, validationResult } from 'express-validator';


//create function that returns validation rules in order to avoid potential side effects from chain mutability

//validates the book ID
export const validateBookId = () => [
	param('id').isMongoId().withMessage('Invalid book ID, please check and try again...'),
];

//validates the input fields for creating a new book
export const validateBookInputs = () => [
	body('title').trim().notEmpty().withMessage('Title is required').escape(),
	body('author').trim().notEmpty().withMessage('Author is required').escape(),
	body('publicationYear')
		.isInt({ min: 1, max: new Date().getFullYear() }) //validates publication year
		.withMessage('Publication year is required and must be a valid year') //error message if invalid
		.toInt(), //converts the value to an integer
];

//only validate the fields that are provided, since we don't want to require all fields to be updated
export const validateOptionalBookInputs = () => [
	body('title').optional().trim().notEmpty().withMessage('Title is required').escape(),
	body('author').optional().trim().notEmpty().withMessage('Author is required').escape(),
	body('publicationYear')
		.optional()
		.isInt({ min: 1, max: new Date().getFullYear() }) //validates publication year
		.withMessage('Publication year is required and must be a valid year') //error message if invalid
		.toInt(), //converts the value to an integer
];

//validate and sanitize the query parameter and limit the length to 100 characters
export const validateQuery = () => [
	query('q')
		.trim()
		.notEmpty()
		.withMessage('Invalid query, please check and try again...')
		.escape()
		.isLength({ min: 1, max: 100 })
		.withMessage('Search query must be between 1 to 100 characters...'),
];

//check for successful validation, if not, return the errors
export const validateCheck = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	return next();
};
