import { Recommendation } from "@/lib/recommender";
import { Card } from "@/components/ui/card";
import { Sparkles, Star } from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export const RecommendationCard = ({ recommendation, index }: RecommendationCardProps) => {
  const similarityPercentage = (recommendation.similarity * 100).toFixed(1);
  
  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:scale-102 animate-in fade-in-50 slide-in-from-bottom-4 ${
        recommendation.isSequential ? 'ring-2 ring-accent shadow-[var(--shadow-glow)]' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {recommendation.isSequential ? (
                <Star className="h-4 w-4 text-accent fill-accent" />
              ) : (
                <Sparkles className="h-4 w-4 text-accent" />
              )}
              <h4 className="font-semibold text-card-foreground">
                {recommendation.title}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {recommendation.author}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
              {similarityPercentage}%
            </div>
            <span className="text-xs text-muted-foreground">match</span>
          </div>
        </div>
        
        {recommendation.reason && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-accent font-medium">
              {recommendation.reason}
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
            {recommendation.genre}
          </span>
        </div>
      </div>
    </Card>
  );
};
