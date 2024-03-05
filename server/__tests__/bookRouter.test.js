import request from 'supertest';
import server from '../server.js';
import { jest } from '@jest/globals';
import { Book } from '../models/bookModel.js';

// Assuming jest.unstable_mockModule() is available and working with your Jest version
jest.unstable_mockModule('../models/bookModel.js', () => ({
	Book: {
		find: jest.fn(),
		limit: jest.fn(),
		skip: jest.fn(),
	},
}));

const getData = () => {

}

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
		const id = '65e547eb27770bd1653352c3';
		const response = await request(server).get(`/books/${id}`);
		
		console.log(response.body)
    
		expect(response.statusCode).toBe(200);
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body).toHaveProperty('title');
		expect(response.body).toHaveProperty('author');
		expect(response.body).toHaveProperty('publicationYear');
	});
});


/*
[
    {
        "_id": "65e547eb27770bd1653352c3",
        "title": "The Silver Chair",
        "author": "C.S. Lewis",
        "publicationYear": 1953,
        "__v": 0
    }
]
*/