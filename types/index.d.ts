interface BookListProps {
  title?: string;
  books: Book[];
  containerClassName?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
  isLoanedBook: boolean | null;
}

interface BookOverviewParams {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string; 
  coverUrl: string;
  videoUrl: string;
  summary: string;
}