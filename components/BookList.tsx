import React from "react";
import BookCard from "./BookCard";

const BookList = ({ title, books, containerClassName }: BookListProps) => {
  return (
    <section className={containerClassName}>
      <h2 className="font-semibold text-light-100 text-3xl uppercase">
        {title}
      </h2>
      <ul className="book-list">
        {books.map((book)=>(
          <BookCard key={book.title} {...book}/>
        ))}
      </ul>
    </section>
  );
};

export default BookList;
