
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import MainPage from "./page/MainPage";
import SearchPage from "./page/SearchPage";


function App() {
  const [books, setBooks] = useState([]);
  const [notification, setNotification] = useState(""); // notification message
  
   // Mapping for user-friendly shelf names
   const shelfNames = {
    currentlyReading: "Currently Reading",
    wantToRead: "Want to Read",
    read: "Read",
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await BooksAPI.getAll();
      setBooks(books);
    };
    fetchBooks();
  }, []);

  const handleShelfChange = (book, newShelf) => {
    BooksAPI.update(book, newShelf).then(() => {
      setBooks((prevBooks) => {
        // Check if the book already exists in the library
        const existingBook = prevBooks.find((b) => b.id === book.id);
        
        // Update book's shelf if it exists, or add it if it's new
        const updatedBooks = existingBook
          ? prevBooks.map((b) =>
              b.id === book.id ? { ...b, shelf: newShelf } : b
            )
          : [...prevBooks, { ...book, shelf: newShelf }];

        // Remove book if shelf is set to "none"
        return updatedBooks.filter((b) => newShelf !== "none" || b.id !== book.id);
    });

      const message =
      newShelf === "none"
        ? `"${book.title}" has been removed from your library.`
        : `"${book.title}" has been added to the "${shelfNames[newShelf]}" shelf!`;
    setNotification(message);;

      setTimeout(() => setNotification(""), 3000);
    });
  };

  return (
    <Router>
      <div className="app">
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={<MainPage books={books} onShelfChange={handleShelfChange} />}
          />
          <Route
            path="/search"
            element={<SearchPage books={books} onShelfChange={handleShelfChange} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
