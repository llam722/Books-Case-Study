import request from 'supertest';
import server from '../server/server.js';

//passed onto delete test
let bookId;

//shortcut to create a book and get its id for the delete request
beforeAll(async () => {
	const app = request(server);
	await app.post('/books').send({
		title: 'The Stranger',
		author: 'Albert Camus',
		publicationYear: 1942,
	});
	const book2 = await app.get('/books/search?q=camus');
	bookId = book2.body[1]._id;
});

	
describe('GET /books', () => {
	it('should return an array of books', async () => {
		const response = await request(server).get('/books');

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(5);
		expect(response.statusCode).toBe(200);
		expect(response.body).toBeInstanceOf(Array);
		expect(response.body.length).toBeGreaterThan(0);
	});
});

describe('GET /books/stats', () => {
	it('should return book collection stats', async () => {
		const response = await request(server).get('/books/stats');

		expect(response.statusCode).toBe(200);
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty('totalBooks');
		expect(response.body).toHaveProperty('numOfAuthors');
		expect(response.body).toHaveProperty('earliestPublicationYear');
		expect(response.body).toHaveProperty('latestPublicationYear');
		expect(response.body).toHaveProperty('booksByAuthor');
		expect(response.body.booksByAuthor).toBeInstanceOf(Array);
	});
});

describe('GET /books/:id', () => {
	it('should return book at id', async () => {
		const id = '65e6df5d74fd952ecf1ad178';
		const response = await request(server).get(`/books/${id}`);

		expect(response.statusCode).toBe(200);
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty('title');
		expect(response.body).toHaveProperty('author');
		expect(response.body).toHaveProperty('publicationYear');
	});

	describe('GET /books/search', () => {
		it('should return books matching search query', async () => {
			const query = 'jacques';
			const response = await request(server).get(`/books/search?q=${query}`);

			expect(response.statusCode).toBe(200);
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body).toHaveLength(7);
		});
	});

	describe('POST /books', () => {
		it('should add a new book to the collection', async () => {
			const newBook = {
				title: 'New Book',
				author: 'New Author',
				publicationYear: 2021,
			};
			const response = await request(server).post('/books').send(newBook);

			expect(response.statusCode).toBe(201);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toHaveProperty('title', newBook.title);
			expect(response.body).toHaveProperty('author', newBook.author);
			expect(response.body).toHaveProperty('publicationYear', newBook.publicationYear);
		});
	});

	describe('PUT /books/:id', () => {
		it('should update a book in the collection', async () => {
			const id = '65e6df5d74fd952ecf1ad178';
			const updatedBook = {
				title: 'Updated Book',
				author: 'Updated Author',
				publicationYear: 2022,
			};
			const response = await request(server).put(`/books/${id}`).send(updatedBook);

			const { title, author, publicationYear } = updatedBook;

			expect(response.statusCode).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			// Check optional fields were updated if they existed in request body
			if (title) expect(response.body).toHaveProperty('title', title);
			if (author) expect(response.body).toHaveProperty('author', author);
			if (publicationYear) expect(response.body).toHaveProperty('publicationYear', publicationYear);
		});
	});

	describe('DELETE /books/:id', () => {
		it('should delete a book from the collection', async () => {
			const response = await request(server).delete(`/books/${bookId}`);

			//expecting the deleted object to be returned
			expect(response.statusCode).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toHaveProperty('title');
			expect(response.body).toHaveProperty('author');
			expect(response.body).toHaveProperty('publicationYear');
		});
	});
});
