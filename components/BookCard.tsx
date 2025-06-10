import React from "react";
import BookCover from "./BookCover";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

const BookCard = ({
  id,
  title,
  genre,
  author,
  coverColor,
  coverUrl,
  isLoanedBook = false,
}: Book) => (
  <li key={id} className={cn(isLoanedBook && 'xs-w-52 w-full')}>
    <Link href={`book/${id}`} className={cn(isLoanedBook && 'w-full flex flex-col items-center')}>
      <BookCover variant="medium" coverColor={coverColor} coverUrl={coverUrl} />
      <div className="flex flex-col w-[144px]">
        <p className="book-title">{`${title} - By ${author}`}</p>
        <p className="book-genre">{`${genre}`}</p>
      </div>
      {isLoanedBook && (
        <div className="mt-3 w-full">
            <div className="book-loaned">
                <Image src='/icons/calendar.svg' alt='times' width={18} height={18} className="object-contain" />
                <p className="text-light-100">11 days left to return</p>
            </div>
            <Button className='book-btn'>Download receipt</Button>
        </div>
      )}
    </Link>
  </li>
);

export default BookCard;
