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
  genres: string; // Multiple genres for contextual filtering
  page_count: number;
  series?: string; // e.g., "A Song of Ice and Fire (1)"
}

export interface UserHistory {
  user_id: number;
  book_id: number;
}

export interface Recommendation {
  book_id: number;
  title: string;
  author: string;
  genre: string;
  similarity: number;
  reason?: string; // Why this book was recommended
  isSequential?: boolean;
}

export type ContextFilter = 'none' | 'light_read' | 'long_epic' | 'fantasy' | 'sci-fi' | 'classic';

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

// Book catalog with enhanced metadata
export const books: Book[] = [
  { id: 101, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic Fiction", genres: "Classic, Drama", page_count: 180 },
  { id: 102, title: "1984", author: "George Orwell", genre: "Dystopian", genres: "Sci-Fi, Dystopian", page_count: 328 },
  { id: 103, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic Fiction", genres: "Classic, Legal Drama", page_count: 281 },
  { id: 104, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", genres: "Romance, Classic", page_count: 400 },
  { id: 105, title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Coming-of-age", genres: "Coming-of-Age, Drama", page_count: 234 },
  { id: 106, title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", genres: "Fantasy, Epic", page_count: 694, series: "A Song of Ice and Fire (1)" },
  { id: 107, title: "A Clash of Kings", author: "George R.R. Martin", genre: "Fantasy", genres: "Fantasy, Epic", page_count: 768, series: "A Song of Ice and Fire (2)" },
  { id: 108, title: "Small Gods", author: "Terry Pratchett", genre: "Fantasy", genres: "Fantasy, Comedy", page_count: 400, series: "Discworld (13)" },
  { id: 109, title: "The Long Way to a Small, Angry Planet", author: "Becky Chambers", genre: "Science Fiction", genres: "Sci-Fi, Adventure", page_count: 518, series: "Wayfarers (1)" },
  { id: 110, title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", genre: "Science Fiction", genres: "Sci-Fi, Comedy", page_count: 224, series: "Hitchhiker's Guide (1)" },
  { id: 111, title: "Dune", author: "Frank Herbert", genre: "Science Fiction", genres: "Sci-Fi, Epic", page_count: 688 },
  { id: 112, title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", genre: "Fantasy", genres: "Fantasy, Epic", page_count: 423, series: "The Lord of the Rings (1)" },
  { id: 113, title: "The Two Towers", author: "J.R.R. Tolkien", genre: "Fantasy", genres: "Fantasy, Epic", page_count: 352, series: "The Lord of the Rings (2)" },
  { id: 114, title: "The Return of the King", author: "J.R.R. Tolkien", genre: "Fantasy", genres: "Fantasy, Epic", page_count: 416, series: "The Lord of the Rings (3)" },
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

// Sequential recommendation: check if next book in series should be recommended
function getSequentialRecommendation(userId: number, bookId: number, userHistory: UserHistory[]): number | null {
  const book = books.find(b => b.id === bookId);
  if (!book || !book.series) return null;

  // Parse series info
  const seriesMatch = book.series.match(/^(.+)\s\((\d+)\)$/);
  if (!seriesMatch) return null;

  const seriesName = seriesMatch[1];
  const currentNum = parseInt(seriesMatch[2]);

  // Check if user has read this book
  const hasReadCurrent = userHistory.some(h => h.user_id === userId && h.book_id === bookId);
  
  if (hasReadCurrent) {
    // Look for next book in series
    const nextNum = currentNum + 1;
    const nextBook = books.find(b => b.series === `${seriesName} (${nextNum})`);
    if (nextBook) return nextBook.id;
  }

  // If current book is not Book 1, check if user read previous book
  if (currentNum > 1) {
    const prevNum = currentNum - 1;
    const prevBook = books.find(b => b.series === `${seriesName} (${prevNum})`);
    if (prevBook && userHistory.some(h => h.user_id === userId && h.book_id === prevBook.id)) {
      return bookId; // User read previous book, recommend current
    }
  }

  return null;
}

// Apply contextual/mood-based filtering
function applyContextualFilter(recommendations: Recommendation[], contextFilter: ContextFilter): Recommendation[] {
  if (contextFilter === 'none') return recommendations;

  return recommendations.filter(rec => {
    const book = books.find(b => b.id === rec.book_id);
    if (!book) return false;

    switch (contextFilter) {
      case 'light_read':
        return book.page_count < 300 || book.genres.includes('Comedy');
      case 'long_epic':
        return book.page_count > 500 || book.genres.includes('Epic');
      case 'fantasy':
        return book.genres.toLowerCase().includes('fantasy');
      case 'sci-fi':
        return book.genres.toLowerCase().includes('sci-fi');
      case 'classic':
        return book.genres.toLowerCase().includes('classic');
      default:
        return true;
    }
  });
}

// Standard CF recommendation function
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

// Enhanced recommendation function with sequential and contextual filtering
export function enhancedRecommendBooks(
  userId: number,
  targetBookId: number,
  userHistory: UserHistory[],
  contextFilter: ContextFilter = 'none',
  nRecommendations: number = 5
): Recommendation[] {
  const finalRecommendations: Recommendation[] = [];

  // 1. Check for sequential recommendation
  const sequentialBookId = getSequentialRecommendation(userId, targetBookId, userHistory);
  
  if (sequentialBookId && sequentialBookId !== targetBookId) {
    const sequentialBook = books.find(b => b.id === sequentialBookId);
    if (sequentialBook && sequentialBook.series) {
      const seriesName = sequentialBook.series.split('(')[0].trim();
      finalRecommendations.push({
        book_id: sequentialBook.id,
        title: sequentialBook.title,
        author: sequentialBook.author,
        genre: sequentialBook.genre,
        similarity: 1.0,
        reason: `Next in '${seriesName}' series`,
        isSequential: true,
      });
    }
  }

  // 2. Get CF recommendations
  const cfRecommendations = recommendBooks(targetBookId, nRecommendations * 2);

  // 3. Apply contextual filter
  const filteredRecommendations = applyContextualFilter(cfRecommendations, contextFilter);

  // 4. Add filtered CF recommendations (excluding sequential ones)
  const sequentialIds = new Set(finalRecommendations.map(r => r.book_id));
  
  for (const rec of filteredRecommendations) {
    if (!sequentialIds.has(rec.book_id) && finalRecommendations.length < nRecommendations) {
      const contextDesc = contextFilter !== 'none' ? ` (${contextFilter.replace('_', ' ')})` : '';
      finalRecommendations.push({
        ...rec,
        reason: `Similar book${contextDesc}`,
        isSequential: false,
      });
    }
  }

  return finalRecommendations;
}

// Get book by ID
export function getBookById(id: number): Book | undefined {
  return books.find(book => book.id === id);
}
