import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { News } from "../../services/newsService";
import { getNewsById } from "../../services/newsService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!id) return;
        const data = await getNewsById(parseInt(id));
        setNews(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px] text-lg text-gray-600">
      Loading...
    </div>
  );
  
  if (error) return (
    <div className="text-center p-5 text-red-500 text-base">
      {error}
    </div>
  );
  
  if (!news) return (
    <div className="text-center p-5 text-red-500 text-base">
      News not found
    </div>
  );

  return (
    <> 
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="w-full h-[400px] object-cover" 
          />
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              {news.title}
            </h1>
            <div className="flex gap-6 mb-6 text-gray-600">
              <p className="text-sm">
                By {news.author}
              </p>
              <p className="text-sm">
                {new Date(news.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {news.content}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewsDetail; 