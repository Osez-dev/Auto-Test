import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";


const Subscription: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    activeSubscriptions: 1000,
    netBilling: 1000,
    netPayments: 1000,
    unpaidInvoices: 1000,
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
    // Implement search functionality here
  };

  return (
  <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f9f9f9]">
  <Sidebar />
  <div className="flex-1 p-6 ml-[200px]">
    <AdminNavbar />
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold text-[#333]">Subscription</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-3 border border-[#ddd] rounded-md w-[250px] focus:outline-none focus:ring-2 focus:ring-[#105080]"
        />
        <button
          onClick={handleSearch}
          className="py-2 px-6 bg-[#105080] text-white rounded-md cursor-pointer hover:bg-[#083060]"
        >
          Search
        </button>
      </div>
    </div>

    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg text-center shadow-md">
        <h2 className="text-lg text-[#555] mb-2">Active Subscriptions</h2>
        <p className="text-2xl font-semibold text-[#105080]">
          {stats.activeSubscriptions.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg text-center shadow-md">
        <h2 className="text-lg text-[#555] mb-2">Net Billing</h2>
        <p className="text-2xl font-semibold text-[#105080]">
          {stats.netBilling.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg text-center shadow-md">
        <h2 className="text-lg text-[#555] mb-2">Net Payments</h2>
        <p className="text-2xl font-semibold text-[#105080]">
          {stats.netPayments.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg text-center shadow-md">
        <h2 className="text-lg text-[#555] mb-2">Unpaid Invoices</h2>
        <p className="text-2xl font-semibold text-[#105080]">
          {stats.unpaidInvoices.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default Subscription;
