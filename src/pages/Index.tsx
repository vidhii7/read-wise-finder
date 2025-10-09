import { useState } from "react";
import { books, recommendBooks, getBookById } from "@/lib/recommender";
import { BookCard } from "@/components/BookCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { BookMarked, Sparkles } from "lucide-react";

const Index = () => {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const recommendations = selectedBookId ? recommendBooks(selectedBookId, 3) : [];
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
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
                  <p className="text-muted-foreground">
                    Based on collaborative filtering with cosine similarity
                  </p>
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
            Using collaborative filtering with K-Nearest Neighbors & cosine similarity
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
