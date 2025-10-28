import { useState } from "react";
import { books, enhancedRecommendBooks, getBookById, UserHistory, ContextFilter } from "@/lib/recommender";
import { BookCard } from "@/components/BookCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { BookMarked, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simulated user history (user 1 has read these books)
const userHistory: UserHistory[] = [
  { user_id: 1, book_id: 106 }, // Read "A Game of Thrones"
  { user_id: 1, book_id: 112 }, // Read "The Fellowship of the Ring"
  { user_id: 1, book_id: 110 }, // Read "The Hitchhiker's Guide"
];

const Index = () => {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [contextFilter, setContextFilter] = useState<ContextFilter>('none');
  
  const recommendations = selectedBookId 
    ? enhancedRecommendBooks(1, selectedBookId, userHistory, contextFilter, 5) 
    : [];
  const selectedBook = selectedBookId ? getBookById(selectedBookId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              <BookMarked className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">
                Book Recommender
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover your next favorite read
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Browse Books Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Browse Books</h2>
            <p className="text-muted-foreground">
              Select a book to discover similar recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBookId(book.id)}
                isSelected={selectedBookId === book.id}
              />
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        {selectedBook && recommendations.length > 0 && (
          <section className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-8">
            <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary-glow/10 to-accent/10 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Recommendations for "{selectedBook.title}"
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Enhanced with sequential series detection and contextual filtering
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Filter by mood:</label>
                    <Select value={contextFilter} onValueChange={(value) => setContextFilter(value as ContextFilter)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="No filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No filter</SelectItem>
                        <SelectItem value="light_read">Light Read</SelectItem>
                        <SelectItem value="long_epic">Epic/Long Read</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <RecommendationCard
                  key={rec.book_id}
                  recommendation={rec}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!selectedBookId && (
          <section className="py-12 text-center space-y-4 animate-in fade-in-50">
            <div className="inline-flex p-4 rounded-full bg-muted">
              <BookMarked className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Select a book to get started
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Click on any book above to see personalized recommendations based on user ratings and preferences
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Enhanced collaborative filtering with sequential series detection & mood-based filtering
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
