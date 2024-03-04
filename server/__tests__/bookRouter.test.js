import request from 'supertest';
import server from '../server.js';
import { jest } from '@jest/globals';
import { Book } from '../models/bookModel.js';

// Assuming jest.unstable_mockModule() is available and working with your Jest version
jest.unstable_mockModule('../models/bookModel.js', () => ({
	Book: {
		find: jest.fn(),
	},
}));


describe('GET /books', () => {
	it('should return an array of books', async () => {
		const mockedBooks = [
			{ title: 'Book 1', author: 'Author 1', publicationYear: 2001 },
			{ title: 'Book 2', author: 'Author 2', publicationYear: 2002 },
		];

		Book.find(mockedBooks);

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