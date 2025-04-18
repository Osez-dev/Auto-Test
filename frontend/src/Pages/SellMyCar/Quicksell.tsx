// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Quicksell = () => {
  return (
    <div className="min-h-screen bg-white ">
      <Navbar />
      <div className="max-w-3xl mt-10 mx-auto text-center">
        {/* Header */}
        <h2 className="text-4xl font-serif border-8 font-extrabold text-[#0663B2] mb-6">
          Quick Sell..!
        </h2>
        
        {/* Main content */}
        <div className="space-y-6 text-lg text-gray-800 mb-10">
          <p className="leading-relaxed">
            <span className="font-semibold text-[#0663B2]">QuickSell</span> is a fast and easy way to sell your car. 
            Get an instant cash offer and sell your car in minutes!
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-[#0663B2] mb-4">
              How It Works
            </h3>
            <ul className="space-y-4 text-left">
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-[#0663B2] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">1</span>
                <span>Enter your car's details and receive a cash offer</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-[#0663B2] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">2</span>
                <span>Accept the offer with just one click</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 bg-[#0663B2] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">3</span>
                <span>We'll arrange pickup and instant payment</span>
              </li>
            </ul>
          </div>
          
          <p className="text-2xl font-semibold">
            It's that simple!
          </p>
        </div>
        
        {/* Call to action */}
        <div className="mb-10">
          <p className="text-lg mb-6">
            For more information, visit our website or contact us.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              href="" 
              className="px-6 py-3 bg-[#0663B2] text-white font-medium rounded-lg hover:bg-[#054d8a] transition duration-200"
            >
              Visit Our Website
            </a>
            
            <div className="flex items-center gap-2 p-3 border-2 border-[#0663B2] rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                {/* Placeholder for app icon - replace with actual image */}
                <span className="text-xs text-gray-500">App Icon</span>
              </div>
              <div>
                <p className="text-sm font-medium">Download Mobile App</p>
                <p className="text-xs text-gray-500">Available on iOS & Android</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-[#0663B2] font-medium">
          Thank you for choosing QuickSell!
        </p>
      </div>
        <Footer />
    </div>
  )
}

export default Quicksell;