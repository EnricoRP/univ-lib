import React from "react";
import BookCover from "./BookCover";
import Link from "next/link";

const BookCard = ({ id, title, genre, author, coverColor, coverUrl }: Book) => (
  <li key={id} className={``}>
    <Link href={`book/${id}`} className="">
      <BookCover variant="medium" coverColor={coverColor} coverUrl={coverUrl} />
      <div className="flex flex-col w-[144px]">
        <p className="book-title">{`${title} - By ${author}`}</p>
        <p className="book-genre">{`${genre}`}</p>
      </div>
    </Link>
  </li>
);

export default BookCard;
