import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
// import './socialMedia.css';

const SocialMedia: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
          <div className="flex flex-col items-center max-w-3xl mx-auto py-8 px-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Feed</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800">My Post</h3>
      <p className="text-gray-600 mt-2">Display photos, videos, and reels from any connected account.</p>
      <span className="block text-gray-500 mt-2">Posts: 12</span>
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800">Tagged Post</h3>
      <p className="text-gray-600 mt-2">Embed posts that your connected accounts are tagged in.</p>
      <span className="block text-gray-500 mt-2">Tagged: 5</span>
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800">Hashtag Feed</h3>
      <p className="text-gray-600 mt-2">Display public posts that use specific hashtags in their captions.</p>
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800">Shoppable Feed</h3>
      <p className="text-gray-600 mt-2">Create a shoppable feed by connecting posts to products.</p>
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800">Link in Bio</h3>
      <p className="text-gray-600 mt-2">Build your bio link page and link posts to articles, recipes, products, and more.</p>
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800">Combined Feed</h3>
      <p className="text-gray-600 mt-2">Get creative and combine two or more feed types in one.</p>
    </div>
  </div>
  <button 
    className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all"
    onClick={handleNextStep}
  >
    Next Step
  </button>
</div>

          </div>
        );
      case 2:
        return (
          <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
          <div className="flex flex-col items-center max-w-3xl mx-auto py-8 px-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pick a Template</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      Classic
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      Gallery
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      Solo
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      Wave
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      Squircle Grid
    </div>
    <div className="p-6 bg-blue-100 rounded-lg text-center hover:shadow-lg transform transition-all hover:translate-y-[-5px] cursor-pointer">
      Montage
    </div>
  </div>
  <div className="flex justify-center gap-6 mt-6">
    <button 
      className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg text-lg font-medium hover:bg-gray-400 transform hover:scale-105 transition-all"
      onClick={handlePreviousStep}
    >
      &lt; Previous Step
    </button>
    <button 
      className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all"
      onClick={handleNextStep}
    >
      Next Step
    </button>
  </div>
</div>

          </div>
        );
      case 3:
        return (
          <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
          <div className="flex flex-col items-center max-w-3xl mx-auto py-8 px-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Connect and Customize</h2>
  <p className="text-lg text-gray-600 mb-8 max-w-lg text-center">
    Connect your Instagram account, customize your first feed, and display it on your website.
  </p>
  <div className="flex justify-center gap-6 mt-6">
    <button
      className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg text-lg font-medium hover:bg-gray-400 transform hover:scale-105 transition-all"
      onClick={handlePreviousStep}
    >
      &lt; Previous Step
    </button>
    <button
      className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all"
    >
      Connect & Customize
    </button>
  </div>
</div>

          </div>
        );
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    
    <div className="social-media-page">
      <Sidebar />
      <AdminNavbar />
      <div className="social-media-main-content">{renderContent()}</div>
    </div>
    
  );
};

export default SocialMedia;
