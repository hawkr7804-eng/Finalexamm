import React, { useState } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import auth from './auth.js';
import api from './api.js';

const ReviewForm = ({ bookId }) => {
  const [formData, setFormData] = useState({ rating: '', comment: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isAuthenticated = auth.isAuthenticated();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      window.location.href = '/authform.html'; // Redirect to login if not authenticated
      return;
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      setError('Please select a rating between 1 and 5');
      return;
    }

    setLoading(true);
    try {
      const response = await api(
        `routes.php?action=submitReview&bookId=${bookId}`,
        {
          rating: parseInt(formData.rating),
          comment: formData.comment,
        },
        'POST'
      );

      if (response.success) {
        setSuccess(true);
        setFormData({ rating: '', comment: '' });
        setError(null);
      } else {
        setError(response.error || 'Failed to submit review');
      }
    } catch (err) {
      setError(err.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Write a Review</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded text-sm">
          Review submitted successfully!
        </div>
      )}

      {!isAuthenticated ? (
        <p className="text-gray-600">
          Please{' '}
          <a href="/authform.html" className="text-blue-500 hover:underline">
            log in
          </a>{' '}
          to submit a review.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-700 text-sm font-medium mb-1">
              Rating (1-5)
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700 text-sm font-medium mb-1">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Write your review..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;