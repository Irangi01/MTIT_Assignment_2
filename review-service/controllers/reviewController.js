/**
 * Review Service - Controllers
 */

const getAllReviews = (Review) => {
  return (req, res) => {
    Review.find()
      .sort({ createdAt: -1 })
      .then((reviews) => res.status(200).json(reviews))
      .catch((error) => res.status(500).json({ message: 'Failed to fetch reviews.', error: error.message }));
  };
};

const createReview = (Review) => {
  return (req, res) => {
    const { productId, reviewerName, rating, comment } = req.body;
    Review.create({ productId, reviewerName, rating, comment })
      .then((newReview) => res.status(201).json(newReview))
      .catch((error) => res.status(500).json({ message: 'Failed to create review.', error: error.message }));
  };
};

const getReviewById = (Review) => {
  return (req, res) => {
    const { id } = req.params;
    Review.findById(id)
      .then((review) => {
        if (!review) return res.status(404).json({ message: 'Review not found.' });
        return res.status(200).json(review);
      })
      .catch((error) => res.status(500).json({ message: 'Failed to fetch review.', error: error.message }));
  };
};

const updateReview = (Review) => {
  return (req, res) => {
    const { id } = req.params;
    Review.findByIdAndUpdate(id, req.body, { new: true })
      .then((review) => {
        if (!review) return res.status(404).json({ message: 'Review not found.' });
        return res.status(200).json(review);
      })
      .catch((error) => res.status(500).json({ message: 'Failed to update review.', error: error.message }));
  };
};

const deleteReview = (Review) => {
  return (req, res) => {
    const { id } = req.params;
    Review.findByIdAndDelete(id)
      .then((review) => {
        if (!review) return res.status(404).json({ message: 'Review not found.' });
        return res.status(200).json({ message: 'Review deleted successfully.' });
      })
      .catch((error) => res.status(500).json({ message: 'Failed to delete review.', error: error.message }));
  };
};

module.exports = { getAllReviews, createReview, getReviewById, updateReview, deleteReview };
