import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { News } from "../../services/newsService";
import { getNews } from "../../services/newsService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNewsList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (id: number) => {
    navigate(`/news/${id}`);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[400px] text-lg text-gray-600">Loading...</div>;
  if (error) return <div className="text-center p-5 text-red-500 text-base">{error}</div>;

  return (
    <>
    <Navbar />
      <div className="max-w-7xl mx-auto px-5 py-5">
        
        <h1 className="text-center text-gray-800 text-3xl mb-8">Auto News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              onClick={() => handleNewsClick(news.id)}
            >
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h2 className="text-gray-800 text-lg font-medium mb-2">{news.title}</h2>
                <p className="text-gray-600 text-sm mb-1">By {news.author}</p>
                <p className="text-gray-400 text-xs mb-3">
                  {new Date(news.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {news.content.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default News;
