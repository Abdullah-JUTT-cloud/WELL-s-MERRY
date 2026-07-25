
import { useState, useEffect, useCallback } from "react";
import { HiOutlineStar, HiStar, HiOutlineCamera, HiXMark } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { canReviewProduct, addProductReview } from "../api/products.js";

// Star rating input component
const StarInput = ({ rating, setRating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className="text-2xl transition-transform hover:scale-110"
        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
      >
        {star <= rating ? (
          <HiStar className="w-7 h-7 text-yellow-400" />
        ) : (
          <HiOutlineStar className="w-7 h-7 text-black/30" />
        )}
      </button>
    ))}
  </div>
);

// Display stars for a given rating
const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star}>
        {star <= Math.round(rating) ? (
          <HiStar className="w-4 h-4 text-yellow-400" />
        ) : (
          <HiOutlineStar className="w-4 h-4 text-black/20" />
        )}
      </span>
    ))}
  </div>
);

// Image lightbox overlay
const Lightbox = ({ src, onClose }) => (
  <div
    className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
      aria-label="Close lightbox"
    >
      <HiXMark className="w-6 h-6" />
    </button>
    <img
      src={src}
      alt="Review photo full size"
      className="max-w-full max-h-[90vh] rounded-xl object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

const ReviewSection = ({ product, onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [canReview, setCanReview] = useState(false);
  const [reviewReason, setReviewReason] = useState("");
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Lightbox state
  const [lightboxSrc, setLightboxSrc] = useState(null);

  // Check eligibility when user/product changes
  useEffect(() => {
    if (!isAuthenticated || !product?._id) {
      setCanReview(false);
      return;
    }

    let ignore = false;
    setCheckingEligibility(true);

    (async () => {
      try {
        const result = await canReviewProduct(product._id);
        if (!ignore) {
          setCanReview(result.canReview);
          setReviewReason(result.reason || "");
        }
      } catch {
        if (!ignore) setCanReview(false);
      } finally {
        if (!ignore) setCheckingEligibility(false);
      }
    })();

    return () => { ignore = true; };
  }, [isAuthenticated, product?._id]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    // Generate previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      selectedImages.forEach((file) => formData.append("images", file));

      await addProductReview(product._id, formData);
      toast.success("Review submitted successfully!");

      // Reset form
      setRating(0);
      setComment("");
      setSelectedImages([]);
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
      setImagePreviews([]);
      setCanReview(false);
      setReviewReason("already_reviewed");

      // Notify parent to refresh product data
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const reviews = product?.reviews || [];
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="mt-16">
      <h2 className="font-body text-2xl font-extrabold text-black uppercase tracking-tight mb-8">
        Customer Reviews
      </h2>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Rating Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-xs">
            <div className="text-center mb-4">
              <p className="text-5xl font-black text-black">
                {product?.rating > 0 ? product.rating.toFixed(1) : "0.0"}
              </p>
              <div className="flex justify-center mt-2">
                <StarDisplay rating={product?.rating || 0} />
              </div>
              <p className="text-xs text-black/60 mt-1">
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating bars */}
            <div className="space-y-2 mt-4">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 font-bold text-black/70">{star}</span>
                  <HiStar className="w-3.5 h-3.5 text-yellow-400" />
                  <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{
                        width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <span className="w-6 text-right text-black/50">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Review Form + List */}
        <div className="lg:col-span-8">
          {/* Review Form */}
          {isAuthenticated && canReview && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 border border-black/5 shadow-xs mb-8"
            >
              <h3 className="font-bold text-sm uppercase tracking-wider text-black mb-4">
                Write a Review
              </h3>

              {/* Star rating */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-black/70 mb-2">
                  Your Rating *
                </label>
                <StarInput rating={rating} setRating={setRating} />
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-black/70 mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black/30 focus:outline-none focus:ring-1 focus:ring-black/10 text-sm resize-none transition"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-black/70 mb-2">
                  Add Photos (up to 5)
                </label>
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-xl border border-black/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove image"
                      >
                        <HiXMark className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {selectedImages.length < 5 && (
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-black/15 flex flex-col items-center justify-center cursor-pointer hover:border-black/30 transition">
                      <HiOutlineCamera className="w-5 h-5 text-black/40" />
                      <span className="text-[9px] text-black/40 mt-1">Add</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-black text-white font-bold uppercase text-xs tracking-wider rounded-full px-8 py-3 hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Eligibility messages */}
          {isAuthenticated && !canReview && !checkingEligibility && (
            <div className="bg-white/80 rounded-2xl p-5 border border-black/5 mb-8">
              <p className="text-sm text-black/60">
                {reviewReason === "already_reviewed"
                  ? "✓ You have already reviewed this product. Thank you!"
                  : "You can only review this product after your order has been delivered."}
              </p>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-white/80 rounded-2xl p-5 border border-black/5 mb-8">
              <p className="text-sm text-black/60">
                Please{" "}
                <a href="/login" className="underline font-medium text-black">
                  log in
                </a>{" "}
                to write a review. Only customers with delivered orders can review.
              </p>
            </div>
          )}

          {/* Reviews List */}
          {sortedReviews.length === 0 ? (
            <div className="text-center py-12 text-black/40">
              <p className="text-sm">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {sortedReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm text-black">{review.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarDisplay rating={review.rating} />
                        <span className="text-[10px] text-black/40">
                          {new Date(review.createdAt).toLocaleDateString("en-PK", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                      ✓ Verified Purchase
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-black/75 mt-3 leading-relaxed">
                      {review.comment}
                    </p>
                  )}

                  {/* Review images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {review.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setLightboxSrc(img)}
                          className="w-16 h-16 rounded-lg overflow-hidden border border-black/10 hover:opacity-80 transition"
                        >
                          <img
                            src={img}
                            alt={`Review photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </section>
  );
};

export default ReviewSection;
