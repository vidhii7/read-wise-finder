// Book recommendation system using collaborative filtering

export interface Rating {
  user_id: number;
  book_id: number;
  rating: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

export interface Recommendation {
  book_id: number;
  title: string;
  author: string;
  genre: string;
  similarity: number;
}

// Sample data - user ratings
export const ratings: Rating[] = [
  { user_id: 1, book_id: 101, rating: 5 },
  { user_id: 1, book_id: 102, rating: 4 },
  { user_id: 1, book_id: 106, rating: 5 },
  { user_id: 2, book_id: 101, rating: 4 },
  { user_id: 2, book_id: 103, rating: 5 },
  { user_id: 2, book_id: 107, rating: 4 },
  { user_id: 3, book_id: 102, rating: 5 },
  { user_id: 3, book_id: 104, rating: 3 },
  { user_id: 3, book_id: 108, rating: 5 },
  { user_id: 4, book_id: 101, rating: 5 },
  { user_id: 4, book_id: 105, rating: 4 },
  { user_id: 4, book_id: 109, rating: 5 },
  { user_id: 5, book_id: 103, rating: 4 },
  { user_id: 5, book_id: 104, rating: 5 },
  { user_id: 5, book_id: 110, rating: 3 },
  { user_id: 6, book_id: 106, rating: 5 },
  { user_id: 6, book_id: 107, rating: 4 },
  { user_id: 6, book_id: 111, rating: 5 },
  { user_id: 7, book_id: 108, rating: 4 },
  { user_id: 7, book_id: 109, rating: 5 },
  { user_id: 7, book_id: 112, rating: 4 },
  { user_id: 8, book_id: 110, rating: 4 },
  { user_id: 8, book_id: 111, rating: 5 },
  { user_id: 8, book_id: 102, rating: 4 },
];

// Book catalog
export const books: Book[] = [
  { id: 101, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic Fiction" },
  { id: 102, title: "1984", author: "George Orwell", genre: "Dystopian" },
  { id: 103, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic Fiction" },
  { id: 104, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance" },
  { id: 105, title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Coming-of-age" },
  { id: 106, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" },
  { id: 107, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy" },
  { id: 108, title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian" },
  { id: 109, title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy" },
  { id: 110, title: "Jane Eyre", author: "Charlotte Brontë", genre: "Romance" },
  { id: 111, title: "Dune", author: "Frank Herbert", genre: "Science Fiction" },
  { id: 112, title: "The Chronicles of Narnia", author: "C.S. Lewis", genre: "Fantasy" },
];

// Create user-item matrix
function createUserItemMatrix(ratings: Rating[]): Map<number, Map<number, number>> {
  const matrix = new Map<number, Map<number, number>>();
  
  ratings.forEach(({ book_id, user_id, rating }) => {
    if (!matrix.has(book_id)) {
      matrix.set(book_id, new Map());
    }
    matrix.get(book_id)!.set(user_id, rating);
  });
  
  return matrix;
}

// Calculate cosine similarity between two books
function cosineSimilarity(
  book1Ratings: Map<number, number>,
  book2Ratings: Map<number, number>,
  allUserIds: Set<number>
): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  allUserIds.forEach((userId) => {
    const rating1 = book1Ratings.get(userId) || 0;
    const rating2 = book2Ratings.get(userId) || 0;
    
    dotProduct += rating1 * rating2;
    norm1 += rating1 * rating1;
    norm2 += rating2 * rating2;
  });
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Get all unique user IDs
function getAllUserIds(ratings: Rating[]): Set<number> {
  return new Set(ratings.map(r => r.user_id));
}

// Main recommendation function
export function recommendBooks(targetBookId: number, nRecommendations: number = 3): Recommendation[] {
  const userItemMatrix = createUserItemMatrix(ratings);
  const allUserIds = getAllUserIds(ratings);
  
  // Get the target book's ratings
  const targetBookRatings = userItemMatrix.get(targetBookId);
  if (!targetBookRatings) {
    return [];
  }
  
  // Calculate similarities with all other books
  const similarities: Array<{ bookId: number; similarity: number }> = [];
  
  userItemMatrix.forEach((bookRatings, bookId) => {
    if (bookId !== targetBookId) {
      const similarity = cosineSimilarity(targetBookRatings, bookRatings, allUserIds);
      similarities.push({ bookId, similarity });
    }
  });
  
  // Sort by similarity (descending) and take top N
  similarities.sort((a, b) => b.similarity - a.similarity);
  const topSimilar = similarities.slice(0, nRecommendations);
  
  // Map to book details
  return topSimilar.map(({ bookId, similarity }) => {
    const book = books.find(b => b.id === bookId)!;
    return {
      book_id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      similarity: similarity,
    };
  });
}

// Get book by ID
export function getBookById(id: number): Book | undefined {
  return books.find(book => book.id === id);
}
