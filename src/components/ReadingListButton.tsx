import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ReadingListButtonProps {
  bookId: number;
}

type ReadingStatus = "want_to_read" | "currently_reading" | "finished" | null;

const statusLabels = {
  want_to_read: "Want to Read",
  currently_reading: "Currently Reading",
  finished: "Finished",
};

export const ReadingListButton = ({ bookId }: ReadingListButtonProps) => {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<ReadingStatus>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadStatus();
    }
  }, [user, bookId]);

  const loadStatus = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("reading_lists")
      .select("status")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .maybeSingle();

    if (data) {
      setCurrentStatus(data.status as ReadingStatus);
    }
  };

  const handleStatusChange = async (status: ReadingStatus) => {
    if (!user) {
      toast.error("Please login to manage reading lists");
      return;
    }

    setIsLoading(true);

    try {
      if (status === null) {
        // Remove from list
        const { error } = await supabase
          .from("reading_lists")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", bookId);

        if (error) throw error;
        toast.success("Removed from reading list");
        setCurrentStatus(null);
      } else {
        // Add or update
        const { error } = await supabase
          .from("reading_lists")
          .upsert({
            user_id: user.id,
            book_id: bookId,
            status,
          });

        if (error) throw error;
        toast.success(`Added to ${statusLabels[status]}`);
        setCurrentStatus(status);
      }
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={currentStatus ? "secondary" : "outline"}
          size="sm"
          disabled={isLoading}
          className="w-full"
        >
          {currentStatus ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              {statusLabels[currentStatus]}
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add to List
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            className={currentStatus === status ? "bg-accent" : ""}
          >
            {currentStatus === status && <Check className="h-4 w-4 mr-2" />}
            {statusLabels[status]}
          </DropdownMenuItem>
        ))}
        {currentStatus && (
          <>
            <DropdownMenuItem className="border-t" onClick={() => handleStatusChange(null)}>
              Remove from List
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};