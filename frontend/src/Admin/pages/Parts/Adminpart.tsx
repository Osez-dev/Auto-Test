import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Tag,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Check,
  X,
  Save
} from 'lucide-react';
import {
  createSparePart,
  deleteSparePart,
  getAllSparePart,
  updateSparePart,
} from "../../../services/sparePartsService";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
// import "./parts.css";

interface SparePart {
  id?: number;
  name: string;
  description: string;
  keywords: string[];
  stock: number;
  imageUrls: string[];
}

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
}

const initialPartState = {
  name: "",
  description: "",
  keywords: "",
  stock: 0,
  imageUrls: "",
};

const AdminPart: React.FC = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [formData, setFormData] = useState(initialPartState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [showForm, setShowForm] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const parts = await getAllSparePart();
      setSpareParts(parts);
    } catch (error) {
      showNotification('error', 'Failed to fetch spare parts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        imageUrls: [formData.imageUrls],
        stock: Number(formData.stock),
      };

      if (editingId) {
        await updateSparePart(editingId, payload);
        showNotification('success', 'Spare part updated successfully');
      } else {
        await createSparePart(payload);
        showNotification('success', 'Spare part created successfully');
      }

      await fetchSpareParts();
      resetForm();
    } catch (error) {
      showNotification('error', editingId ? 'Failed to update part' : 'Failed to create part');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (part: SparePart) => {
    setEditingId(part.id!);
    setFormData({
      name: part.name,
      description: part.description,
      keywords: part.keywords.join(', '),
      stock: part.stock,
      imageUrls: part.imageUrls[0] || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this part?')) return;

    try {
      setLoading(true);
      await deleteSparePart(id);
      showNotification('success', 'Part deleted successfully');
      await fetchSpareParts();
    } catch (error) {
      showNotification('error', 'Failed to delete part');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialPartState);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
      
      <div className="flex min-h-screen bg-[#f8fafc]">
  <Sidebar />
  <main className="flex-1 ml-[12rem] min-h-screen bg-[#f8fafc] relative">
    <AdminNavbar />
    <div className="max-w-screen-xl mx-auto p-8 pt-[calc(70px+2rem)]">
      <div className="flex justify-between items-center mb-8 p-6">
        <h1 className="text-2xl font-semibold text-[#1e293b]">Spare Parts Management</h1>
        <button 
          className="flex items-center gap-2 py-2 px-6 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transform hover:translate-y-[-1px] shadow-lg transition-all"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Close Form' : 'Add New Part'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow-md mb-8 animate-slide-down">
          <h2 className="text-xl font-semibold text-[#1e293b] mb-6">
            {editingId ? 'Edit Spare Part' : 'Add New Spare Part'}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#64748b]">
                <Package size={16} />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#64748b]">
                <FileText size={16} />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[#64748b]">
                  <Tag size={16} />
                  Keywords
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                  placeholder="Comma separated keywords"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#64748b]">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#64748b]">
                <ImageIcon size={16} />
                Image URL
              </label>
              <input
                type="url"
                name="imageUrls"
                value={formData.imageUrls}
                onChange={handleInputChange}
                className="p-3 border border-[#e2e8f0] rounded-md text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                required
              />
            </div>

            <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 text-[#64748b] border border-[#e2e8f0] rounded-md font-medium hover:bg-[#f1f5f9]"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-[#3b82f6] text-white rounded-md font-medium hover:bg-[#2563eb] disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : <>
                  <Save size={16} />
                  {editingId ? 'Update Part' : 'Create Part'}
                </>}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <div className="text-center py-10 text-[#64748b]">Loading parts...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spareParts.map(part => (
            <div key={part.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="relative pt-[56.25%] bg-[#f1f5f9]">
                <img 
                  src={part.imageUrls[0] || '/placeholder.jpg'}
                  alt={part.name}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#1e293b] mb-2">{part.name}</h3>
                <p className="text-sm text-[#475569] mb-4 line-clamp-3">{part.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {part.keywords.map(keyword => (
                    <span key={keyword} className="px-3 py-1 text-xs bg-[#f1f5f9] text-[#64748b] rounded-full">{keyword}</span>
                  ))}
                </div>
                <div className="text-sm text-[#64748b] mb-4">Stock: {part.stock}</div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(part)}
                    className="px-4 py-2 bg-[#f1f5f9] text-[#3b82f6] border border-[#e2e8f0] rounded-md text-sm font-medium hover:bg-[#e2e8f0]"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(part.id!)}
                    className="px-4 py-2 bg-[#fee2e2] text-[#ef4444] border border-[#fecaca] rounded-md text-sm font-medium hover:bg-[#fecaca] hover:text-[#dc2626]"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </main>

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

export default AdminPart;