import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface BookRatingProps {
  bookId: number;
}

export const BookRating = ({ bookId }: BookRatingProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadExistingRating();
    }
  }, [user, bookId]);

  const loadExistingRating = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_book_ratings")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .maybeSingle();

    if (data) {
      setExistingRating(data);
      setRating(data.rating);
      setReview(data.review || "");
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to rate books");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("user_book_ratings")
        .upsert({
          user_id: user.id,
          book_id: bookId,
          rating,
          review: review.trim() || null,
        });

      if (error) throw error;

      toast.success(existingRating ? "Rating updated!" : "Rating submitted!");
      loadExistingRating();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold">Rate This Book</h3>
      
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Write a review (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="min-h-[100px]"
      />

      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Saving..." : existingRating ? "Update Rating" : "Submit Rating"}
      </Button>
    </div>
  );
};