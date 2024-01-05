const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    id: {type: String},
    title: {type: String},
    author: {type: String},
    publisher: {type: String},
    isbn: {type: String},
    avail: {type: Boolean},
    who: {type: String},
    due: {type: String},
}, {timestamps: true});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
