import React, { useState, useEffect } from 'react';

const BookList = () => {
    const [availableBooks, setAvailableBooks] = useState([]);
    const [checkedOutBooks, setCheckedOutBooks] = useState([]);

    useEffect(() => {
        // Fetch available books
        fetch('http://localhost:3000/books?avail=true')
            .then(response => response.json())
            .then(data => setAvailableBooks(data))
            .catch(error => console.error('Error fetching available books:', error));

        // Fetch checked-out books
        fetch('http://localhost:3000/books?avail=false')
            .then(response => response.json())
            .then(data => setCheckedOutBooks(data))
            .catch(error => console.error('Error fetching checked-out books:', error));
    }, []); // Empty dependency array to fetch data only once on mount

    const handleCheckOut = (bookId) => {
        // Make a fetch call to the new route for check-out
        fetch(`http://localhost:3000/books/${bookId}/check-out`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(updatedBook => {
                // Remove the book from available books and add it to checked-out books
                setAvailableBooks(prevAvailableBooks => prevAvailableBooks.filter(book => book.id !== updatedBook.id));
                setCheckedOutBooks(prevCheckedOutBooks => [...prevCheckedOutBooks, updatedBook]);
            })
            .catch(error => console.error('Error checking out book:', error));
    };

    const handleCheckIn = (bookId) => {
        // Make a fetch call to the new route for check-out
        fetch(`http://localhost:3000/books/${bookId}/check-in`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(updatedBook => {
                // Remove the book from available books and add it to checked-out books
                setAvailableBooks(prevAvailableBooks => [...prevAvailableBooks, updatedBook]);
                setCheckedOutBooks(prevCheckedOutBooks => prevCheckedOutBooks.filter(book => book.id !== updatedBook.id));
            })
            .catch(error => console.error('Error checking in book:', error));
    };


    return (
        <div>
            <h2>Available Books</h2>
            <ul>
                {availableBooks.map(book => (
                    <li key={book.id}>
                        {book.title} by {book.author}
                        <button onClick={() => handleCheckOut(book.id)}>Check Out</button>
                    </li>
                ))}
            </ul>

            <h2>Checked Out Books</h2>
            <ul>
                {checkedOutBooks.map(book => (
                    <li key={book.id}>
                        {book.title} by {book.author}
                        <button onClick={() => handleCheckIn(book.id)}>Check In</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;
