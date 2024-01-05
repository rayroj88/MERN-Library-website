const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.static('public'));
const dbName = 'Library';
const dbURI = `mongodb+srv://user:password1!@cluster0.lqif3bh.mongodb.net/${dbName}`;
const collectionName = 'Books';

const Book = require('./models/books');

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "MongoDB connection error:"));
connection.once("open", function() { console.log("connected");  });

mongoose.connect(dbURI)
    .then(() => app.listen(3000, () => {
        console.log('Server is running on port 3000');
    }))
    .catch((err) => console.log(err));

//CORS handling
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods',
    'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
     'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
    });

//Full List
app.get('/books', async (req, res) => {
    try {
        //Get all Books from DB
        const books = await Book.find();
        //Check for avail query
        const availParam = req.query.avail;

        //if there is an avail query
        if (availParam !== undefined) {

            //Extract the boolean value of the query
            const availFilter = availParam === 'true';

            // Filter books based on query
            const filteredBooks = books.filter(book => book.avail === availFilter);

            // Return the filtered books as JSON
            res.json(filteredBooks);
        } else {
            // If no avail parameter, return the entire list
            res.json(books);
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

//Find by ID
app.get('/books/:id', async (req, res) => {
    try {
        //Get the ID from the URL
        const bookId = req.params.id;
        //Check all books for ID from URL
        const book = await Book.findOne({ id: bookId });

        //If ID exists in book list
        if (book) {
            // Return the book information as JSON
            res.json(book);
        } else {
            // Return 404 if ID is not in list
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

//Add a book
app.post('/books', async (req, res) => {
    try {
        console.log('Post book');
        // Store json info into newBook
        const newBook = req.body;

        const book = new Book(newBook);
        // Check if the book ID already exists
        const existingBook = await Book.findOne({ id: newBook.id });

        if (existingBook) {
            // If ID is taken return 403
            res.status(403).json({ error: 'Book ID already exists' });
        } else {
            // Book ID does not exist, add the new book
            const savedBook = await book.save();
            res.status(201).json(savedBook);
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

//Check out a book
app.put('/books/:id/check-out', async (req, res) => {
    try {
        const bookId = req.params.id;

        const updatedBook = { avail:false };

        const options = {new: true};

        const query = {id: bookId}

        // Update the book's avail property to false
        const updatedBookResult = await Book.findOneAndUpdate(query, updatedBook, options);

        if (updatedBookResult) {
            res.json(updatedBookResult);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

//Check in a book
app.put('/books/:id/check-in', async (req, res) => {
    try {
        const bookId = req.params.id;

        const updatedBook = { avail:true };

        const options = {new: true};

        const query = {id: bookId}

        // Update the book's avail property to false
        const updatedBookResult = await Book.findOneAndUpdate(query, updatedBook, options);

        if (updatedBookResult) {
            res.json(updatedBookResult);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

//Modify a book
app.put('/books/:id', async (req, res) => {
    try {
        // Pull bookID from URL
        const bookId = req.params.id;

        // Store JSON into updatedBook
        const updatedBook = req.body;

        // Use the findByIdAndUpdate method to update a book by ID
        const query = { id: bookId };
        const options = { new: true }; // To return the modified document
        const updatedBookResult = await Book.findOneAndUpdate(query, updatedBook, options);

        // If the book was updated successfully
        if (updatedBookResult) {
            res.json(updatedBookResult);
        } else {
            // If ID is not found return 404
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

//Delete a book
app.delete('/books/:id', async (req, res) => {
    try {
        console.log('Delete book');
        //Pull ID from URL
        const bookId = req.params.id;

        // Use the findByIdAndDelete method to delete a book by ID
        const query = { id: bookId };
        const deletedBook = await Book.findOneAndDelete(query);

        // If the book was deleted successfully
        if (deletedBook) {
            res.json(deletedBook);
        } else {
            // If Book does not exist return 404
            res.status(204).send('Book not found');
        }
    } catch(error) {
        res.status(500).send('Internal Server Error');
    }
});