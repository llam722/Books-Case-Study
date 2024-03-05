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
		status: jest.fn().mockReturnThis(),
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
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

  //GET BOOKS
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
			jest.spyOn(Book, 'find').mockReturnValue({
				limit: jest.fn().mockReturnValue({
					skip: jest.fn().mockResolvedValue([]),
				}),
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

			await container.getBooks(req, res, next);

			expect(res.status).toHaveBeenCalledWith(204);
			expect(res.json).toHaveBeenCalledWith({ message: 'No books found...' });
		});

		it('returns a 500 status code if an error occurs', async () => {
			res = {
				status: jest.fn().mockReturnValue({
					json: jest.fn().mockReturnValue({ message: 'Error retrieving books...' }),
				}),
				locals: {},
			};
		
			jest.spyOn(Book, 'find').mockImplementation(() => {
				throw new Error('error');
			});

			await container.getBooks(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

  //GET BOOK BY ID
	describe('getBookById', () => {
		it('grabs book by ID', async () => {
			req.params.id = 1;

			jest.spyOn(Book, 'findById').mockReturnValue({
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				publicationYear: 1925,
			});
			const expected = { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 };
			await container.getBookById(req, res, next);

			expect(res.locals.book).toEqual(expected);
		});

		it('returns a 400 status code if no book ID is provided', async () => {
			req.params.id = null;
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			jest.spyOn(Book, 'findById').mockReturnValue(null);
			await container.getBookById(req, res, next);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: 'No book ID provided...' });
		});

		it('returns a 404 status code if book is not found', async () => {
			req.params.id = 1;
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			jest.spyOn(Book, 'findById').mockReturnValue(null);
			await container.getBookById(req, res, next);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: 'Book does not exist, check the ID and try again...' });
		});

		it('returns a 500 status code if an error occurs', async () => {
			req.params.id = 1;
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			jest.spyOn(Book, 'findById').mockImplementation(() => {
				throw new Error('error');
			});
			await container.getBookById(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

  //ADD BOOK
	describe('addBook', () => {
		it('adds a book to the collection', async () => {
			req.body = {
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				publicationYear: 1925,
			};
			const expected = {
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				publicationYear: 1925,
			};

			jest.spyOn(Book, 'create').mockResolvedValue(expected);

			await container.addBook(req, res, next);

			expect(res.locals.newBook).toEqual(expected);
		});

		it('returns an 400 status code if title is missing', async () => {
			req.body = {
				author: 'F. Scott Fitzgerald',
				publicationYear: 1925,
			};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			const spy = jest.spyOn(res.status(), 'json');

			await container.addBook(req, res, next);
			expect(spy).toHaveBeenCalledWith({ errors: ['Title is required or must be a string...'] });
			expect(res.status).toHaveBeenCalledWith(400);
		});
		it('returns a 400 status code if author is missing', async () => {
			req.body = {
				title: 'asdf',
				publicationYear: 1925,
			};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			const spy = jest.spyOn(res.status(), 'json');

			await container.addBook(req, res, next);

			expect(spy).toHaveBeenCalledWith({ errors: ['Author is missing or must be a string...'] });
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns a 400 status code if title is missing', async () => {
			req.body = {
				title: 'asdf',
				author: 'F. Scott Fitzgerald',
			};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			const spy = jest.spyOn(res.status(), 'json');

			await container.addBook(req, res, next);

			expect(spy).toHaveBeenCalledWith({ errors: ['Publication year is missing or must be a number...'] });
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns a 400 status code if publication year in the future', async () => {
			req.body = {
				title: 'asdf',
				author: 'F. Scott Fitzgerald',
				publicationYear: 2026,
			};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			const spy = jest.spyOn(res.status(), 'json');

			await container.addBook(req, res, next);

			expect(spy).toHaveBeenCalledWith({ errors: ['Publication year cannot be in the future or negative...'] });
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns a 400 status code if publication year is negative', async () => {
			req.body = {
				title: 'asdf',
				author: 'F. Scott Fitzgerald',
				publicationYear: -1,
			};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			const spy = jest.spyOn(res.status(), 'json');

			await container.addBook(req, res, next);

			expect(spy).toHaveBeenCalledWith({ errors: ['Publication year cannot be in the future or negative...'] });
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns a 500 status code if an error occurs', async () => {
			req.body = {
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				publicationYear: 1925,
			};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};

			jest.spyOn(Book, 'create').mockImplementation(() => {
				throw new Error('error');
			});

			await container.addBook(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

  //UPDATE BOOK
	describe('updateBook', () => {
		it('updates a book by ID', async () => {
			req.params.id = 1;

			req.body = {
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				publicationYear: 1925,
			};

			jest.spyOn(Book, 'findByIdAndUpdate').mockReturnValue({
				save: jest
					.fn()
					.mockResolvedValue({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 }),
			});

			const expected = {
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				publicationYear: 1925,
			};
			await container.updateBook(req, res, next);

			expect(res.locals.updatedBook).toEqual(expected);
		});

		it('returns a 400 status code if no data is provided', async () => {
			req.params.id = 1;
			req.body = {};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			const spy = jest.spyOn(res.status(), 'json');

			await container.updateBook(req, res, next);

			expect(spy).toHaveBeenCalledWith({ errors: ['No data provided to update book...'] });
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns a 400 status code if publication year in the future ', async () => {
			req.params.id = 1;
			req.body = {
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				publicationYear: 2026,
			};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			const spy = jest.spyOn(res.status(), 'json');

			await container.updateBook(req, res, next);

			expect(spy).toHaveBeenCalledWith({ errors: ['Publication year cannot be in the future or negative...'] });
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('returns a 400 status code if publication year is negative', async () => {
			req.params.id = 1;
			req.body = {
				title: 'The Great Gatsby',
				author: 'F. Scott Fitzgerald',
				publicationYear: -1,
			};
			res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				locals: {},
			};
			const spy = jest.spyOn(res.status(), 'json');

			await container.updateBook(req, res, next);

			expect(spy).toHaveBeenCalledWith({ errors: ['Publication year cannot be in the future or negative...'] });
			expect(res.status).toHaveBeenCalledWith(400);
    });
    
    it('returns a 404 status code if book is not found', async () => {
      req.params.id = 1;
      req.body = {
        title: 'The Great Gatsby', 
        author: 'F. Scott Fitzgerald',
        publicationYear: 1925
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {}
      }

      jest.spyOn(Book, 'findByIdAndUpdate').mockReturnValue(null);

      await container.updateBook(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Book does not exist...'] });
    });

    it('returns a 500 status code if an error occurs', async () => {
      req.params.id = 1;
      req.body = {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        publicationYear: 1925
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {}
      }

      jest.spyOn(Book, 'findByIdAndUpdate').mockImplementation(() => {
        throw new Error('error');
      });

      await container.updateBook(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating book, check the ID and try again...' });
    });

  });
  
  //DELETE BOOK
  describe('deleteBook', () => {

    it('deletes a book by ID', async () => {
      req.params.id = 1;

      jest.spyOn(Book, 'findByIdAndDelete').mockResolvedValue({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 });

      const expected = { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 };
      await container.deleteBook(req, res, next);

      expect(res.locals.deletedBook).toEqual(expected);
    });

    it('returns a 400 status code if no book ID is provided', async () => {
      req.params.id = null;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {}
      }

      await container.deleteBook(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: ['No book ID provided...'] });
    });

    it('returns a 404 status code if book does not exist', async () => {
      req.params.id = 1;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {}
      }

      jest.spyOn(Book, 'findByIdAndDelete').mockReturnValue(null);

      await container.deleteBook(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Book does not exist, check the ID and try again...'] });
    });

    it('returns a 500 status code if an error occurs', async () => {
      req.params.id = 1;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {}
      }

      jest.spyOn(Book, 'findByIdAndDelete').mockImplementation(() => {
        throw new Error('error');
      });

      await container.deleteBook(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting book, check the ID and try again...' });
    });

  });


  //SEARCH BOOKS
  describe('searchBooks', () => {
    it('searches for books by title or author', async () => {
      req.query.q = 'The Great Gatsby';

      jest.spyOn(Book, 'find').mockReturnValue({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 })

      const expected = { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1925 };
      await container.searchBooks(req, res, next);

      expect(res.locals.books).toEqual(expected);
    });

    it('returns a 400 status code if no search parameters are provided', async () => {
      req.query.q = null;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {}
      }

      await container.searchBooks(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: ['No search parameters provided, please enter a query...'] });
    });

    it('returns a 500 status code if an error occurs', async () => {
      req.query.q = 'The Great Gatsby';
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {}
      }

      jest.spyOn(Book, 'find').mockImplementation(() => {
        throw new Error('error');
      });

      await container.searchBooks(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error searching for books...' });
    });

  });

  //GET STATS
  describe('getStats', () => {
    
    it('returns book collection stats', async () => {
      jest.spyOn(Book, 'countDocuments').mockResolvedValue(66);
      jest.spyOn(Book, 'distinct').mockResolvedValue(['Brian Jacques']);
      jest.spyOn(Book, 'find').mockReturnValue({ sort: jest.fn()});

      await container.getStats(req, res, next);
      
      const { totalBooks, booksByAuthor, latestPublicationYear, earliestPublicationYear } = res.locals.stats;
      
      expect(totalBooks).toBe(66);
      expect(booksByAuthor).toBeInstanceOf(Array);
      expect(latestPublicationYear).toBeGreaterThan(earliestPublicationYear);
      expect(booksByAuthor.length).toBeGreaterThan(0);
    });

    it('returns a 500 status code if an error occurs', async () => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {}
      }

      jest.spyOn(Book, 'countDocuments').mockImplementation(() => {
        throw new Error('error');
      });

      await container.getStats(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving stats...' });
    });


  });


});
