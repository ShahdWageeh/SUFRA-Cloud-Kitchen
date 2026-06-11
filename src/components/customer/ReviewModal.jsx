"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import toast from "react-hot-toast";
import { reviewService } from "@/services";
import { Button, Modal } from "@/components/ui";

export default function ReviewModal({ isOpen, onClose, mealId, mealName }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setLoading(true);
    try {
      const result = await reviewService.createReview({
        mealId,
        rating,
        comment,
      });

      if (result.success) {
        toast.success("Review submitted successfully!");
        onClose();
        // Reset state
        setRating(0);
        setComment("");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit review";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review ${mealName}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-semibold text-text-secondary">How was your meal?</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <FontAwesomeIcon
                  icon={(hover || rating) >= star ? faStar : faStarOutline}
                  className={(hover || rating) >= star ? "text-primary" : "text-gray-300"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-bold text-text-primary">
            Your Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="mt-2 w-full rounded-xl border-primary-container bg-background p-4 text-sm focus:border-primary focus:ring-primary"
            placeholder="Share your experience with this meal..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            className="flex-1 rounded-full"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-full bg-primary hover:bg-primary-container"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
