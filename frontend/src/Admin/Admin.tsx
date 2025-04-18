import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./Admin.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import AdminNavbar from "./Components/AdminNavbar/AdminNavbar";

const Admin: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("E-commerce");
  const [activeSocialMedia, setActiveSocialMedia] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = [
    "E-commerce", "Listing", "Media", "News", "Reviews", "Social Media",
    "Contacts", "Value My Car", "Subscription", "Dealer POS", "Hotel/Tourism",
    "Parts", "Solar"
  ];

  const socialMediaData = [
    { name: "Instagram", campaigns: 50, views: 1200, likes: 800, followers: 5000 },
    { name: "Facebook", campaigns: 40, views: 900, likes: 700, followers: 4000 },
    { name: "Twitter", campaigns: 30, views: 600, likes: 300, followers: 2000 },
  ];

  const recentActivities = [
    { date: "2025-01-19", details: "New campaign 'Healthy Food' launched", status: "Published" },
    { date: "2025-01-18", details: "Campaign 'Winter Sale' awaiting approval", status: "Pending" },
  ];

  const chatMessages = [
    { user: "User", message: "Hi, I need help with my campaign.", timestamp: "10:00 AM" },
    { user: "Admin", message: "How can I assist you?", timestamp: "10:05 AM" },
  ];

  type AnalyticsDataType = {
    [key: string]: {
      summary: number;
      barData: { name: string; value: number }[];
      pieData: number[];
      };
    };

    const analyticsData: AnalyticsDataType = {
      "E-commerce": { 
          summary: 9500, 
          barData: [{ name: "Jan", value: 52 }, { name: "Feb", value: 73 }, { name: "Mar", value: 85 }, { name: "Apr", value: 90 }], 
          pieData: [40, 30, 30] 
      },
      "Listing": { 
          summary: 7200, 
          barData: [{ name: "Jan", value: 44 }, { name: "Feb", value: 56 }, { name: "Mar", value: 60 }, { name: "Apr", value: 75 }], 
          pieData: [50, 20, 30] 
      },
      "Media": { 
          summary: 8100, 
          barData: [{ name: "Jan", value: 60 }, { name: "Feb", value: 75 }, { name: "Mar", value: 82 }, { name: "Apr", value: 90 }], 
          pieData: [30, 40, 30] 
      },
      "News": { 
          summary: 6700, 
          barData: [{ name: "Jan", value: 40 }, { name: "Feb", value: 50 }, { name: "Mar", value: 60 }, { name: "Apr", value: 70 }], 
          pieData: [45, 35, 20] 
      },
      "Reviews": { 
          summary: 7300, 
          barData: [{ name: "Jan", value: 50 }, { name: "Feb", value: 60 }, { name: "Mar", value: 65 }, { name: "Apr", value: 80 }], 
          pieData: [35, 30, 35] 
      },
      "Social Media": { 
          summary: 9200, 
          barData: [{ name: "Jan", value: 70 }, { name: "Feb", value: 85 }, { name: "Mar", value: 90 }, { name: "Apr", value: 100 }], 
          pieData: [25, 50, 25] 
      },
      "Contacts": { 
          summary: 6100, 
          barData: [{ name: "Jan", value: 35 }, { name: "Feb", value: 45 }, { name: "Mar", value: 55 }, { name: "Apr", value: 65 }], 
          pieData: [60, 20, 20] 
      },
      "Value My Car": { 
          summary: 8200, 
          barData: [{ name: "Jan", value: 55 }, { name: "Feb", value: 70 }, { name: "Mar", value: 80 }, { name: "Apr", value: 85 }], 
          pieData: [35, 40, 25] 
      },
      "Subscription": { 
          summary: 7600, 
          barData: [{ name: "Jan", value: 45 }, { name: "Feb", value: 55 }, { name: "Mar", value: 65 }, { name: "Apr", value: 75 }], 
          pieData: [30, 30, 40] 
      },
      "Dealer POS": { 
          summary: 8900, 
          barData: [{ name: "Jan", value: 65 }, { name: "Feb", value: 75 }, { name: "Mar", value: 85 }, { name: "Apr", value: 95 }], 
          pieData: [40, 40, 20] 
      },
      "Hotel/Tourism": { 
          summary: 9400, 
          barData: [{ name: "Jan", value: 75 }, { name: "Feb", value: 85 }, { name: "Mar", value: 90 }, { name: "Apr", value: 100 }], 
          pieData: [35, 50, 15] 
      },
      "Parts": { 
          summary: 6700, 
          barData: [{ name: "Jan", value: 40 }, { name: "Feb", value: 50 }, { name: "Mar", value: 60 }, { name: "Apr", value: 70 }], 
          pieData: [50, 25, 25] 
      },
      "Solar": { 
          summary: 7800, 
          barData: [{ name: "Jan", value: 50 }, { name: "Feb", value: 60 }, { name: "Mar", value: 70 }, { name: "Apr", value: 80 }], 
          pieData: [40, 35, 25] 
      }
  };
  

  const currentData = analyticsData[activeCategory];

  const openSocialMediaPopup = (platform: string) => {
    setActiveSocialMedia(platform);
  };

  const closePopup = () => {
    setActiveSocialMedia(null);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="m-0 font-sans bg-#ffff text-gray-800 ml-[195px] mt-[100px] flex justify-start ">

<div className="w-full max-w-screen-2xl mx-auto px-1 lg:px-1">

      <Sidebar />
      <AdminNavbar />

      {/* Header Section */}
      <header className="bg-[#105080] text-white px-[30px] py-[20px] text-center">
  <h1 className="text-[1.8rem] font-bold m-0">What are you looking for?</h1>
  <input
  type="text"
  placeholder="Search"
  className="w-1/2 p-[10px] my-[15px] rounded-[5px] border-none text-base outline-none bg-[#f0f0f0] text-black"
  value={searchTerm}
  onChange={handleSearchChange}
/>

<button
  onClick={() => console.log(searchTerm)}
  className="py-[10px] px-[15px] bg-[#4CAF50] text-white rounded-[5px] text-base font-bold cursor-pointer transition-colors duration-300 hover:bg-[#388e3c]"
>search</button>
      </header>

      {/* Categories Section */}
      <div className="flex flex-nowrap overflow-x-auto p-[15px] gap-[15px] bg-white shadow-md rounded-lg no-scrollbar">
  {categories.map((category) => (
    <div
      key={category}
      onClick={() => setActiveCategory(category)}
      className={`min-w-[110px] flex-shrink-0 p-[15px] rounded-[8px] text-center text-[0.9rem] cursor-pointer transition-all duration-300 shadow-md
        ${activeCategory === category 
          ? "bg-[#105080] text-white shadow-lg" 
          : "bg-white hover:-translate-y-1 hover:shadow-lg"}`}
    >
      <h3 className="font-semibold">{category}</h3>
      <p>Manage {category.toLowerCase()}</p>
    </div>
  ))}
</div>


      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-[30px]">
  <div className="bg-white rounded-[8px] p-[10px] text-center shadow-md transition-transform duration-300 hover:scale-[1.03]">
    <h2 className="text-lg font-semibold">Account Summary</h2>
    <p className="text-[2.5rem] font-bold text-[#4CAF50]">${currentData.summary}</p>
  </div>

  <div className="bg-white rounded-[8px] p-[10px] shadow-md transition-transform duration-300 hover:scale-[1.03]">
    <h2 className="text-lg font-semibold mb-2">Income</h2>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={currentData.barData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="bg-white rounded-[8px] p-[10px] shadow-md transition-transform duration-300 hover:scale-[1.03]">
    <h2 className="text-lg font-semibold mb-2">Tickets</h2>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={[
            { name: "New", value: currentData.pieData[0] },
            { name: "In Progress", value: currentData.pieData[1] },
            { name: "Completed", value: currentData.pieData[2] },
          ]}
          innerRadius={50}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          <Cell fill="#8884d8" />
          <Cell fill="#82ca9d" />
          <Cell fill="#ffc658" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

      {/* Social Media Section */}
      <section className="my-[30px]">
  <h2 className="mb-[20px] text-xl font-semibold">Social Media Overview</h2>
  <div className="flex flex-wrap gap-[15px]">
    {socialMediaData.map((platform, index) => (
      <div
        key={index}
        onClick={() => openSocialMediaPopup(platform.name)}
        className="flex-1 min-w-[200px] text-white text-center bg-gradient-to-br from-[#105080] to-[#0e3656] p-[20px] rounded-[12px] transition-transform hover:scale-105 hover:shadow-lg cursor-pointer"
      >
        <h3 className="text-lg font-semibold">{platform.name}</h3>
        <p>Campaigns: {platform.campaigns}</p>
        <p>Followers: {platform.followers}</p>
      </div>
    ))}
  </div>
</section>


      {/* Recent Activities */}
      <section className="bg-white p-5 rounded-[12px] shadow-md my-[30px]">
  <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
  <div className="mt-[20px] space-y-[10px]">
    {recentActivities.map((activity, index) => (
      <div
        key={index}
        className="flex justify-between items-center p-[15px] bg-[#f9f9f9] rounded-[8px] shadow-sm"
      >
        <p>{activity.date}</p>
        <p>{activity.details}</p>
        <span
          className={`font-bold ${
            activity.status === "Published" ? "text-[#28a745]" : "text-[#ffc107]"
          }`}
        >
          {activity.status}
        </span>
      </div>
    ))}
  </div>
</section>


      {/* Live Chat */}
      <section className="bg-white p-5 rounded-[12px] shadow-md my-[30px]">
  <h2 className="text-xl font-semibold">Live Chat</h2>
  <div className="max-h-[400px] overflow-y-auto mt-5 space-y-4">
    {chatMessages.map((msg, index) => (
      <div
        key={index}
        className={`text-sm ${
          msg.user === "Admin"
            ? "text-right text-[#28a745]"
            : "text-left text-[#0056b3]"
        }`}
      >
        <p>{msg.message}</p>
        <span className="text-xs block">{msg.timestamp}</span>
      </div>
    ))}
  </div>
</section>


      {/* Social Media Popup */}
      {activeSocialMedia && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
    <div className="bg-white p-5 rounded-[12px] w-[400px] shadow-md">
      <h2 className="text-xl font-semibold mb-4">{activeSocialMedia} Details</h2>
      {socialMediaData
        .filter((platform) => platform.name === activeSocialMedia)
        .map((platform, index) => (
          <div key={index} className="space-y-1 mb-4">
            <p>Campaigns: {platform.campaigns}</p>
            <p>Views: {platform.views}</p>
            <p>Likes: {platform.likes}</p>
            <p>Followers: {platform.followers}</p>
          </div>
        ))}
      <button
        onClick={closePopup}
        className="bg-[#dc3545] text-white px-5 py-2 rounded-[8px] hover:bg-[#b52b37] transition"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
    </div>
  );
};

export default Admin;