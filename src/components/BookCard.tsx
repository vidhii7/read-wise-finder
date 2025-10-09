import { Book } from "@/lib/recommender";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  onClick: () => void;
  isSelected?: boolean;
}

export const BookCard = ({ book, onClick, isSelected = false }: BookCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-elegant)] ${
        isSelected 
          ? "ring-2 ring-primary shadow-[var(--shadow-glow)] scale-105" 
          : "hover:scale-105"
      }`}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground transition-transform duration-300 group-hover:scale-110">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {book.genre}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {book.author}
          </p>
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Click to see recommendations
          </p>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10 pointer-events-none" />
      )}
    </Card>
  );
};
