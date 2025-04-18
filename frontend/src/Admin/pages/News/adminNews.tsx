import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  User,
  Type,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader,
  Search,
  Calendar,
  ChevronDown,
  Filter,
  Grid,
  List,
  Upload,
} from "lucide-react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import { News, CreateNewsDto, getNews, createNews, updateNews, deleteNews } from "../../../services/newsService";
// import "./News.css";

interface NotificationProps {
  type: "success" | "error";
  message: string;
}

const AdminNews: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [newNews, setNewNews] = useState<CreateNewsDto>({
    title: "",
    content: "",
    imageUrl: "",
    author: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState<boolean>(false);
  const [dateFilterLabel, setDateFilterLabel] = useState<string>("All Time");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  // const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  // Fetch initial news data
  useEffect(() => {
    fetchNewsData();
  }, []);

  // Filter news based on search query and date range
  useEffect(() => {
    let filtered = [...newsList];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((news) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filters
    if (startDate && endDate) {
      filtered = filtered.filter((news) => {
        const newsDate = new Date(news.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return newsDate >= start && newsDate <= end;
      });
    } else if (startDate) {
      filtered = filtered.filter((news) => {
        const newsDate = new Date(news.createdAt);
        const start = new Date(startDate);
        return newsDate >= start;
      });
    } else if (endDate) {
      filtered = filtered.filter((news) => {
        const newsDate = new Date(news.createdAt);
        const end = new Date(endDate);
        return newsDate <= end;
      });
    }

    setFilteredNews(filtered);
  }, [newsList, searchQuery, startDate, endDate]);

  // Update date filter label based on selected dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      setDateFilterLabel(`${start} - ${end}`);
    } else if (startDate) {
      setDateFilterLabel(`From ${new Date(startDate).toLocaleDateString()}`);
    } else if (endDate) {
      setDateFilterLabel(`Until ${new Date(endDate).toLocaleDateString()}`);
    } else {
      setDateFilterLabel("All Time");
    }
  }, [startDate, endDate]);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const data = await getNews();
      setNewsList(data);
    } catch (error) {
      showNotification("error", "Failed to fetch news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show notification helper
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Form input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewNews((prev) => ({ ...prev, [name]: value }));

    // Preview image when URL changes
    if (name === "imageUrl" && value) {
      setPreviewImage(value);
    }
  };

  // Handle thumbnail file change
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        setNewNews(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing && newNews.id) {
        // Remove id from the update data
        const { id, ...updateData } = newNews;
        await updateNews(id, updateData);
        showNotification("success", "News updated successfully!");
      } else {
        await createNews(newNews);
        showNotification("success", "News created successfully!");
      }
      resetForm();
      fetchNewsData();
    } catch (error) {
      showNotification("error", `Failed to ${isEditing ? 'update' : 'create'} news. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Edit news handler
  const handleEdit = (news: News) => {
    setNewNews({
      id: news.id,
      title: news.title,
      content: news.content,
      imageUrl: news.imageUrl,
      author: news.author,
    });
    setPreviewImage(news.imageUrl);
    setIsEditing(true);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete news handler
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;

    try {
      setLoading(true);
      await deleteNews(id);
      setNewsList((prev) => prev.filter((item) => item.id !== id));
      showNotification("success", "News deleted successfully!");
    } catch (error) {
      showNotification("error", "Failed to delete news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form helper
  const resetForm = () => {
    setNewNews({
      title: "",
      content: "",
      imageUrl: "",
      author: "",
    });
    setPreviewImage("");
    setIsEditing(false);
    setIsFormVisible(false);
  };

  return (
    <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
  <div className="flex min-h-screen">
  <Sidebar />
  <div className="flex-1 p-5 bg-[#f5f5f5]">
    <AdminNavbar />

    <div className="max-w-screen-xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl text-[#333]">News Management</h1>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 bg-[#f8f9fa] p-2 rounded-lg">
              <button
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white text-[#4CAF50]" : "text-[#666]"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={20} />
              </button>
              <button
                className={`p-2 rounded-md ${viewMode === "table" ? "bg-white text-[#4CAF50]" : "text-[#666]"}`}
                onClick={() => setViewMode("table")}
              >
                <List size={20} />
              </button>
            </div>
            <button
              className="flex items-center gap-2 bg-[#4CAF50] text-white py-2 px-4 rounded-md font-medium hover:bg-[#45a049]"
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              {isFormVisible ? (
                <>
                  <X size={20} />
                  Close Form
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add News
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-4 mb-8 p-4 bg-[#f8f9fa] rounded-lg shadow-sm">
        <div className="flex items-center gap-2 bg-white p-3 rounded-md border border-[#e0e0e0] w-full">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none outline-none text-sm p-2"
          />
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-white p-3 rounded-md border border-[#e0e0e0] text-sm w-full"
            onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
          >
            <Filter size={20} />
            <span>{dateFilterLabel}</span>
            <ChevronDown size={20} className={isDateFilterOpen ? "rotate-180" : ""} />
          </button>
          {isDateFilterOpen && (
            <div className="absolute top-[100%] left-0 w-[300px] bg-white rounded-lg shadow-lg p-4 border border-[#e0e0e0] mt-1 z-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold">Start Date</label>
                  <div className="flex items-center gap-2 p-3 border rounded-md">
                    <Calendar size={20} />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate || undefined}
                      className="w-full border-none outline-none bg-transparent text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold">End Date</label>
                  <div className="flex items-center gap-2 p-3 border rounded-md">
                    <Calendar size={20} />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || undefined}
                      className="w-full border-none outline-none bg-transparent text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="text-sm text-[#666] hover:text-[#333]"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setIsDateFilterOpen(false);
                    }}
                  >
                    Clear Dates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${notification.type === "success" ? "bg-[#dff0d8] text-[#3c763d]" : "bg-[#f2dede] text-[#a94442]"}`}>
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <label htmlFor="title" className="flex items-center gap-2 font-medium text-sm mb-2">
              <Type size={20} />
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newNews.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-[#ddd] rounded-md text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="flex items-center gap-2 font-medium text-sm mb-2">
              <User size={20} />
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={newNews.author}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-[#ddd] rounded-md text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="thumbnail" className="flex items-center gap-2 font-medium text-sm mb-2">
              <ImageIcon size={20} />
              Thumbnail
            </label>
            <div className="flex items-center gap-3 p-3 border border-[#ddd] rounded-md">
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <label htmlFor="thumbnail" className="cursor-pointer bg-[#f8f9fa] py-2 px-4 rounded-md text-sm">
                <Upload size={20} />
                Choose Image
              </label>
            </div>
            {(thumbnailPreview || previewImage) && (
              <div className="mt-4 max-w-[300px]">
                <img src={thumbnailPreview || previewImage} alt="Preview" className="w-full h-auto rounded-md" />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="flex items-center gap-2 font-medium text-sm mb-2">
              <FileText size={20} />
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={newNews.content}
              onChange={handleInputChange}
              required
              rows={10}
              className="w-full p-3 border border-[#ddd] rounded-md text-sm"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button type="submit" className="px-6 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049]" disabled={loading}>
              {loading ? (
                <Loader className="animate-spin mr-2" size={20} />
              ) : isEditing ? (
                "Update News"
              ) : (
                "Add News"
              )}
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-[#f44336] text-white rounded-md hover:bg-[#da190b]"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader size={24} className="animate-spin mr-2" />
            <span>Loading...</span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-8 bg-[#f8f9fa] rounded-lg text-[#6c757d]">
            <p>No news found</p>
          </div>
        ) : viewMode === "grid" ? (
          filteredNews.map((news) => (
            <div key={news.id} className="bg-white rounded-md shadow-md overflow-hidden relative">
              <img src={news.imageUrl} alt={news.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-medium text-[#333]">{news.title}</h3>
                <p className="text-sm text-[#666]">By {news.author}</p>
                <p className="text-xs text-[#999]">{new Date(news.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-[#666] mt-2">{news.content.substring(0, 100)}...</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="p-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049]" onClick={() => handleEdit(news)}>
                  <Edit2 size={20} />
                </button>
                <button className="p-2 bg-[#f44336] text-white rounded-md hover:bg-[#da190b]" onClick={() => handleDelete(news.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-sm text-left border-b">Thumbnail</th>
                  <th className="px-4 py-2 text-sm text-left border-b">Title</th>
                  <th className="px-4 py-2 text-sm text-left border-b">Author</th>
                  <th className="px-4 py-2 text-sm text-left border-b">Date</th>
                  <th className="px-4 py-2 text-sm text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((news) => (
                  <tr key={news.id}>
                    <td className="px-4 py-2">
                      <img src={news.imageUrl} alt={news.title} className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td className="px-4 py-2">{news.title}</td>
                    <td className="px-4 py-2">{news.author}</td>
                    <td className="px-4 py-2">{new Date(news.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button className="p-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049]" onClick={() => handleEdit(news)}>
                          <Edit2 size={20} />
                        </button>
                        <button className="p-2 bg-[#f44336] text-white rounded-md hover:bg-[#da190b]" onClick={() => handleDelete(news.id)}>
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default AdminNews;