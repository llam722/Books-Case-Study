import { jest } from '@jest/globals';
import bookController from '../controllers/bookController';
import { Book } from '../models/bookModel';

describe('Book Controller', () => {
	let container;
	let req = {
		params: {},
		query: {
			page: 1,
			limit: 5,
		},
	};

	let res = {
		status: jest.fn(),
		json: jest.fn(),
		locals: {},
	};

	const next = jest.fn();

	jest.unstable_mockModule('mongoose', () => ({
		connect: jest.fn(),
		Schema: jest.fn(),
	}));

	beforeEach(() => {
		container = bookController;
		// console.log(container, 'container');
	});

	afterEach(() => {
		jest.clearAllMocks();
  });
  
  describe('getBooks', () => {

    it('should grab all books', async () => {
      jest.spyOn(Book, 'find').mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest
            .fn()
            .mockResolvedValue([{ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 }]),
        }),
      });
  
      await container.getBooks(req, res, next);
      const expected = [{ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 }];
  
      expect(res.locals.books).toEqual(expected);
    });
  
    it('should return no books', async () => {
      res = {
        status: jest.fn().mockReturnValue({
          json: jest.fn().mockReturnValue({ message: 'No books found...' }),
        }),
        locals: {},
      };
      const spy = jest.spyOn(res.status(), 'json');
      jest.spyOn(Book, 'find').mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockResolvedValue([]),
        }),
      });
  
      await container.getBooks(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(204);
      expect(spy).toHaveBeenCalled();
    });
    
    it('returns a 204 status code if books are not found', async () => {
      loadData.mockResolvedValue({
        find: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue([]),
      });
      const req = {
        query: {
          page: '1',
          limit: '5',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {},
      };
      const next = jest.fn();
  
      // Act
      await getBooks(req, res, next);
  
      // Assert
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'No books found...' });
    });
  
    it('should throw an error', async () => {
      res = {
        status: jest.fn().mockReturnValue({
          json: jest.fn().mockReturnValue({ message: 'Error retrieving books...' }),
        }),
        locals: {},
      };
      const spy = jest.spyOn(res, 'status');
      jest.spyOn(res.status(), 'json');
      jest.spyOn(Book, 'find').mockImplementation(() => {
        throw new Error('error');
      });
  
      await container.getBooks(req, res, next);
  
      expect(spy).toHaveBeenCalledWith(500);
    });

  });


	it('grabs book by ID', async () => {
	  req.params.id = 1;

	  const getBookById = await container.getBookById(req, res, next);
		console.log(getBookById);

		// Arrange
		const expected = 'expected result';

	  // Act

		// Assert
		expect(getBookById).toEqual(expected);
	});

});
