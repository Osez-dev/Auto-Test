// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./News.css"; // Assumes you have a CSS file for styling

// interface News {
//   id: number;
//   title: string;
//   content: string;
//   imageUrl: string;
//   author: string;
// }

// const News: React.FC = () => {
//   const [newsList, setNewsList] = useState<News[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await fetch("/api/news");
//         if (!response.ok) {
//           throw new Error(`Error: ${response.status}`);
//         }
//         const data = await response.json();
//         setNewsList(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchNews();
//   }, []);

//   const handleNewsClick = (id: number) => {
//     navigate(`/news/${id}`);
//   };

//   if (isLoading) return <p>Loading news...</p>;
//   if (error) return <p>{error}</p>;

//   const truncate = (text: string, length: number) => {
//     if (text.length <= length) return text;
//     return text.slice(0, text.lastIndexOf(" ", length)) + "...";
//   };

//   return (
//     <div className="news-container">
//       <h1>Latest News</h1>
//       {newsList.map((news) => (
//         <div
//           key={news.id}
//           className="news-item"
//           onClick={() => handleNewsClick(news.id)}
//           aria-label={`View details about ${news.title}`}
//           tabIndex={0}
//         >
//           <img
//             src={news.imageUrl || "https://via.placeholder.com/150"}
//             alt={news.title}
//           />
//           <div className="news-content">
//             <h2>{news.title}</h2>
//             <p>{truncate(news.content, 100)}</p>
//             <p className="news-author">By {news.author}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default News;
