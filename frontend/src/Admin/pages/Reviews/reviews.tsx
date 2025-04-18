import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  // Image as ImageIcon,
  User,
  X,
  // Save,
  AlertCircle,
  Check
} from 'lucide-react';
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
} from "../../../services/reviewsService";

interface Review {
  id?: number;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
  createdAt?: string;
}

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
}

const Reviews: React.FC = () => {
  // States for managing reviews and UI
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  const initialReviewState: Review = {
    title: "",
    content: "",
    author: "",
    imageUrl: "",
  };

  const [formData, setFormData] = useState<Review>(initialReviewState);

  // Show notification helper
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      showNotification('error', 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  // Filter reviews based on search term
  const filteredReviews = reviews.filter(review =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedReview?.id) {
        await updateReview(selectedReview.id, formData);
        showNotification('success', 'Review updated successfully');
      } else {
        await createReview(formData);
        showNotification('success', 'Review created successfully');
      }
      await fetchReviews();
      closeModal();
    } catch (error) {
      showNotification('error', selectedReview ? 'Failed to update review' : 'Failed to create review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      setLoading(true);
      await deleteReview(id);
      await fetchReviews();
      showNotification('success', 'Review deleted successfully');
    } catch (error) {
      showNotification('error', 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setFormData(review);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
    setFormData(initialReviewState);
  };

  return (
    <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
    <div className="flex min-h-screen bg-[#f8fafc]">
  <Sidebar />
  <main className="flex-1 ml-[12rem] min-h-screen bg-[#f8fafc] relative mr-[90px]">
    <AdminNavbar />
    <div className="max-w-screen-xl mx-auto p-8 pt-[calc(70px+2rem)]">
      <div className="flex justify-between items-center mb-8 p-6">
        <h1 className="text-2xl font-semibold text-[#1e293b]">Reviews Management</h1>
        <button
          className="flex items-center gap-2 py-2 px-6 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transform hover:translate-y-[-1px] shadow-lg transition-all"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add New Review
        </button>
      </div>

      <div className="mb-8">
        <div className="relative max-w-[500px]">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#64748b]" size={20} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 py-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center py-10 text-[#64748b]">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-10 text-[#64748b] bg-white rounded-xl">No reviews found</div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="relative pt-[56.25%] bg-[#f1f5f9]">
                <img
                  src={review.imageUrl || '/placeholder.jpg'}
                  alt={review.title}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#1e293b] mb-2">{review.title}</h3>
                <p className="text-sm text-[#475569] line-clamp-3 mb-4">{review.content}</p>
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <span className="flex items-center gap-2 text-[#64748b] text-sm">
                    <User size={16} />
                    {review.author}
                  </span>
                  {review.createdAt && (
                    <span className="text-sm text-[#64748b]">{new Date(review.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(review)}
                    className="px-4 py-2 bg-[#f1f5f9] text-[#3b82f6] border border-[#e2e8f0] rounded-md text-sm font-medium hover:bg-[#e2e8f0] hover:text-[#2563eb]"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id!)}
                    className="px-4 py-2 bg-[#fee2e2] text-[#ef4444] border border-[#fecaca] rounded-md text-sm font-medium hover:bg-[#fecaca] hover:text-[#dc2626]"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </main>

  {showModal && (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-[90%] max-w-lg max-h-[90vh] overflow-auto p-8 shadow-lg animate-slide-down" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-[#1e293b]">{selectedReview ? 'Edit Review' : 'Add New Review'}</h2>
          <button className="p-2 bg-none border-none text-[#64748b] rounded-md cursor-pointer hover:bg-[#f1f5f9]" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#64748b]">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#64748b]">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#64748b]">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#64748b]">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-[#e2e8f0]">
            <button type="button" onClick={closeModal} className="px-6 py-3 text-[#64748b] border border-[#e2e8f0] rounded-md font-medium hover:bg-[#f1f5f9]">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#3b82f6] text-white rounded-md font-medium hover:bg-[#2563eb] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : selectedReview ? 'Update Review' : 'Create Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {notification && (
    <div className={`fixed bottom-8 right-8 p-4 rounded-md flex items-center gap-4 z-50 shadow-lg transition-all ${notification.type === 'success' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'}`}>
      {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
      {notification.message}
    </div>
  )}
</div>

  </div>
  );
};

export default Reviews;