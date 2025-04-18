import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getListings, deleteListing, updateListing, createListing } from "../../../services/listingService";
import { UsersService } from "../../../services/UsersService";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import { FaEdit, FaEye, FaTrashAlt, FaCheck, FaTimes, FaExclamationCircle, FaFileUpload, FaThLarge, FaList } from 'react-icons/fa';
// import "./ListingPage.css";
import Papa from 'papaparse';

const ListingPage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  // const [sellerRoles, setSellerRoles] = useState<{ [key: number]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    approvalStatus: "all",
    soldStatus: "all",
    fuelType: "all",
    priceRange: "all",
    dateFilter: "all",
    blueTGrade: "all",
    customDateRange: {
      start: "",
      end: ""
    },
    monthFilter: {
      month: "",
      year: ""
    }
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploadError, setCsvUploadError] = useState<string>("");
  const [csvProcessingStatus, setCsvProcessingStatus] = useState({ 
    total: 0, 
    processed: 0,
    isProcessing: false 
  });
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const navigate = useNavigate();

  // Fetch user profile and set userId
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UsersService.getUserById(1); // Replace with actual user ID or auth logic
        if (profile) {
          setUserId(profile.id);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // Handle creating a new listing
  const handleCreateListing = () => {
    navigate('/post-ad');
  };

  // Calculate counts for each status
  const getStatusCounts = () => {
    // Get total counts from all listings
    const allCount = listings.length;
    
    // Get filtered counts based on current filters
    const publishedCount = filteredListings.filter(listing => listing.status === "approved").length;
    const declinedCount = filteredListings.filter(listing => listing.status === "rejected").length;
    const pendingCount = filteredListings.filter(listing => listing.status === "pending").length;

    return {
      all: allCount, // Always show total count
      published: publishedCount, // Changes with filters
      declined: declinedCount, // Changes with filters
      pending: pendingCount // Changes with filters
    };
  };

  // Show notification helper
  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    const fetchListingsAndRoles = async () => {
      setIsLoading(true);
      try {
        // Fetch all listings including pending and rejected ones
        const listingsData = await getListings(true); // true means include pending and rejected listings
        setListings(listingsData);
        setFilteredListings(listingsData);

        // Fetch user roles dynamically
        const rolesMap: { [key: number]: string } = {};

        for (const listing of listingsData) {
          const userId = listing.userId;
          if (!userId) continue;

          try {
            const user = await UsersService.getUserById(userId);
            rolesMap[userId] = user.role;
          } catch (error) {
            console.error(`Failed to fetch role for user ${userId}:`, error);
            rolesMap[userId] = "Unknown";
          }
        }

        // setSellerRoles(rolesMap);
      } catch (error) {
        console.error("Failed to fetch listings or roles:", error);
        showNotification("Failed to fetch listings", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingsAndRoles();
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({
      approvalStatus: "all",
      soldStatus: "all",
      fuelType: "all",
      priceRange: "all",
      dateFilter: "all",
      blueTGrade: "all",
      customDateRange: {
        start: "",
        end: ""
      },
      monthFilter: {
        month: "",
        year: ""
      }
    });
    showNotification("Filters have been reset", "success");
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...listings];

    // Apply search
    if (searchTerm) {
      result = result.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.fuelType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.approvalStatus !== "all") {
      result = result.filter(listing =>
        listing.status === filters.approvalStatus
      );
    }

    if (filters.soldStatus !== "all") {
      result = result.filter(listing =>
        filters.soldStatus === "sold" ? listing.isSold : !listing.isSold
      );
    }

    if (filters.fuelType !== "all") {
      result = result.filter(listing =>
        listing.fuelType === filters.fuelType
      );
    }

    if (filters.blueTGrade !== "all") {
      result = result.filter(listing =>
        listing.blueTGrade === filters.blueTGrade
      );
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter(listing => 
        listing.price >= min && (max ? listing.price <= max : true)
      );
    }

    // Date filtering
    if (filters.dateFilter !== "all") {
      const now = new Date();
      const listingDate = new Date();
      
      result = result.filter(listing => {
        listingDate.setTime(new Date(listing.createdAt).getTime());
        
        switch (filters.dateFilter) {
          case "today":
            return listingDate.toDateString() === now.toDateString();
          case "thisWeek":
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            return listingDate >= weekStart;
          case "thisMonth":
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            return listingDate >= monthStart;
          case "lastMonth":
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
            return listingDate >= lastMonthStart && listingDate <= lastMonthEnd;
          case "custom":
            if (filters.customDateRange.start && filters.customDateRange.end) {
              const startDate = new Date(filters.customDateRange.start);
              const endDate = new Date(filters.customDateRange.end);
              return listingDate >= startDate && listingDate <= endDate;
            }
            return true;
          case "specificMonth":
            if (filters.monthFilter.month && filters.monthFilter.year) {
              const monthStart = new Date(parseInt(filters.monthFilter.year), parseInt(filters.monthFilter.month) - 1, 1);
              const monthEnd = new Date(parseInt(filters.monthFilter.year), parseInt(filters.monthFilter.month), 0);
              return listingDate >= monthStart && listingDate <= monthEnd;
            }
            return true;
          default:
            return true;
        }
      });
    }

    setFilteredListings(result);
  }, [searchTerm, filters, listings]);

  // Get unique fuel types for filter options
  const uniqueFuelTypes = Array.from(new Set(listings.map(listing => listing.fuelType)));

  // Handle deleting a listing
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(id);
        setListings(listings.filter((listing) => listing.id !== id)); // Remove deleted listing
        showNotification("Listing deleted successfully!", "success");
      } catch (error) {
        console.error("Failed to delete listing:", error);
        showNotification("Failed to delete listing", "error");
      }
    }
  };

  // Handle editing a listing
  const handleEdit = (id: number) => {
    navigate(`/edit-listing/${id}`);
  };

  // Handle sold status change
  const handleSoldStatusChange = async (id: number, isSold: boolean) => {
    if (!window.confirm(`Are you sure you want to mark this listing as ${isSold ? 'sold' : 'available'}?`)) {
      return;
    }

    try {
      await updateListing(id, { isSold });
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, isSold } : listing
      ));
      showNotification(
        `Listing marked as ${isSold ? 'sold' : 'available'} successfully!`,
        'success'
      );
    } catch (error) {
      console.error("Failed to update listing sold status:", error);
      showNotification("Failed to update listing status", "error");
    }
  };

  // Handle approval status change
  const handleApprovalStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateListing(id, { status: newStatus });
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, status: newStatus } : listing
      ));
      
      showNotification(
        `Listing ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`,
        'success'
      );

    } catch (error) {
      console.error("Failed to update listing status:", error);
      showNotification("Failed to update status", "error");
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    let newStatus = "all";
    
    switch (tab) {
      case "published":
        newStatus = "approved";
        break;
      case "declined":
        newStatus = "rejected";
        break;
      case "pending":
        newStatus = "pending";
        break;
      default:
        newStatus = "all";
    }
    
    setFilters({ ...filters, approvalStatus: newStatus });
  };

  // Handle CSV file selection
  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setCsvUploadError("");
    } else {
      setCsvUploadError("Please select a valid CSV file");
    }
  };

  // Handle CSV upload and processing
  const handleCsvUpload = async () => {
    if (!csvFile) {
      setCsvUploadError("Please select a CSV file first");
      return;
    }

    if (!userId) {
      setCsvUploadError("User ID is required. Please try again.");
      return;
    }

    try {
      setCsvProcessingStatus({ total: 0, processed: 0, isProcessing: true });
      
      const result = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(csvFile, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject,
        });
      });

      const formattedListings = result.data.map((row: any) => ({
        title: row.title || "",
        condition: row.condition || "",
        regno: row.regno || "",
        make: row.make || "",
        model: row.model || "",
        yearofmanufacture: Number(row.yearofmanufacture) || 0,
        mileage: Number(row.mileage) || 0,
        fuelType: row.fuelType || "",
        bodyType: row.bodyType || "",
        transmission: row.transmission || "",
        district: row.district || "",
        city: row.city || "",
        engineCc: Number(row.engineCc) || 0,
        price: Number(row.price) || 0,
        sellersNotes: row.sellersNotes || "",
        status: "pending",
        userRole: "admin",
        userId: userId,
        grade: row.grade || "",
        exteriorColor: row.exteriorColor || "",
        interiorColor: row.interiorColor || "",
        noOfOwners: Number(row.noOfOwners) || 0,
        blueTGrade: row.blueTGrade || "",
        yearOfReg: Number(row.yearOfReg) || 0,
        imageUrls: row.imageUrls ? row.imageUrls.split(",").map((url: string) => url.trim()) : [],
      }));

      setCsvProcessingStatus(prev => ({ ...prev, total: formattedListings.length }));

      // Process in batches of 10
      const batchSize = 10;
      for (let i = 0; i < formattedListings.length; i += batchSize) {
        const batch = formattedListings.slice(i, i + batchSize);
        await Promise.all(batch.map(listing => createListing(listing)));
        
        setCsvProcessingStatus(prev => ({ 
          ...prev, 
          processed: Math.min(prev.processed + batch.length, prev.total) 
        }));
      }

      showNotification(`Successfully created ${formattedListings.length} listings`, "success");
      // Refresh the listings
      const updatedListings = await getListings();
      setListings(updatedListings);
      setFilteredListings(updatedListings);
      
      // Reset file input and status
      setCsvFile(null);
      setCsvProcessingStatus({ total: 0, processed: 0, isProcessing: false });
      const fileInput = document.getElementById("csvFileInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error processing CSV:", error);
      setCsvUploadError("Error processing CSV file. Please check the format and try again.");
      setCsvProcessingStatus({ total: 0, processed: 0, isProcessing: false });
    }
  };

  // Handle Blue T verification status change
  const handleBlueTVerificationChange = async (id: number, isBlueTVerified: boolean) => {
    if (!window.confirm(`Are you sure you want to ${isBlueTVerified ? 'verify' : 'unverify'} this Blue T grade?`)) {
      return;
    }

    try {
      await updateListing(id, { isBlueTVerified });
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, isBlueTVerified } : listing
      ));
      showNotification(
        `Blue T grade ${isBlueTVerified ? 'verified' : 'unverified'} successfully!`,
        'success'
      );
    } catch (error) {
      console.error("Failed to update Blue T verification status:", error);
      showNotification("Failed to update Blue T verification status", "error");
    }
  };

  // Add handler for select all
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedListings(filteredListings.map(listing => listing.id));
    } else {
      setSelectedListings([]);
    }
  };

  // Add handler for individual selection
  const handleSelectListing = (id: number) => {
    setSelectedListings(prev => {
      if (prev.includes(id)) {
        return prev.filter(listingId => listingId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Add handler for bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedListings.length === 0) {
      showNotification("Please select listings first", "error");
      return;
    }

    if (!window.confirm(`Are you sure you want to ${action} ${selectedListings.length} listings?`)) {
      return;
    }

    try {
      setIsLoading(true);
      if (action === 'delete') {
        // Handle bulk delete
        const promises = selectedListings.map(id => deleteListing(id));
        await Promise.all(promises);
        
        // Update local state by removing deleted listings
        setListings(listings.filter(listing => !selectedListings.includes(listing.id)));
        showNotification(`Successfully deleted ${selectedListings.length} listings`, "success");
      } else {
        // Handle status changes
        const promises = selectedListings.map(id => updateListing(id, { status: action }));
        await Promise.all(promises);

        setListings(listings.map(listing => 
          selectedListings.includes(listing.id) 
            ? { ...listing, status: action } 
            : listing
        ));

        showNotification(`Successfully ${action} ${selectedListings.length} listings`, "success");
      }
      setSelectedListings([]); // Clear selections after action
    } catch (error) {
      console.error(`Failed to ${action} listings:`, error);
      showNotification(`Failed to ${action} listings`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Update total pages when filtered listings change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredListings.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredListings]);

  return (
    <div className="m-0 font-sans bg-#ffff text-gray-800 ml-[195px] mt-[100px] flex justify-start">
    <div className="flex min-h-screen bg-[#f8fafc] justify-start -mt-10 -ml-[200px]">
      <Sidebar />
      <AdminNavbar />
      <div className="flex-1 ml-48 min-h-screen bg-[#f8fafc] relative justify-start -mt-[70px]">
        <div className="flex-1 p-5 bg-white justify-start mt-[75px] ml-[10px] rounded-[10px] shadow-md">
          <div className="flex flex-col items-start gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:mb-6">
            <h2>Listings</h2>
            <div className="flex gap-4 items-center">
              <button 
                className="flex items-center gap-2 px-6 py-3 bg-white text-black border-none rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:-translate-y-[1px] hover:shadow-md"
                onClick={handleCreateListing}
              >
                Create New Listing
              </button>
              <div className="flex gap-2 items-center">
  <input
    type="file"
    id="csvFileInput"
    accept=".csv"
    onChange={handleCsvFileChange}
    className="hidden"
  />
  <a 
    href="/listing_template.csv" 
    download 
    className="inline-block py-2 px-4 bg-gray-600 text-white text-sm rounded-md transition duration-200 hover:bg-gray-700"
    title="Download CSV template"
  >
    Download Template
  </a>
  <button 
    className="flex items-center gap-2 py-2 px-4 bg-blue-500 text-white text-sm rounded-md transition duration-200 hover:bg-blue-600"
    onClick={() => document.getElementById('csvFileInput')?.click()}
  >
    <FaFileUpload /> Upload CSV
  </button>
  {csvFile && (
    <button 
      className="flex items-center gap-2 py-2 px-4 bg-green-500 text-white text-sm rounded-md transition duration-200 hover:bg-green-600"
      onClick={handleCsvUpload}
      disabled={csvProcessingStatus.isProcessing}
    >
      {csvProcessingStatus.isProcessing 
        ? `Processing ${csvProcessingStatus.processed}/${csvProcessingStatus.total}...` 
        : "Process CSV"}
    </button>
  )}
  {csvUploadError && (
    <div className="text-red-500 text-sm mt-2">{csvUploadError}</div>
  )}
</div>

            </div>
          </div>

          <div className="flex gap-4 mb-6">
  <button
    className={`py-2 px-4 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    onClick={() => handleTabChange('all')}
  >
    All ({getStatusCounts().all})
  </button>
  <button
    className={`py-2 px-4 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'published' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    onClick={() => handleTabChange('published')}
  >
    Published ({getStatusCounts().published})
  </button>
  <button
    className={`py-2 px-4 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'declined' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    onClick={() => handleTabChange('declined')}
  >
    Declined ({getStatusCounts().declined})
  </button>
  <button
    className={`py-2 px-4 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    onClick={() => handleTabChange('pending')}
  >
    Pending ({getStatusCounts().pending})
  </button>
</div>


<div className="listing-controls flex justify-between items-center mb-5 gap-5 flex-wrap sm:flex-col sm:items-stretch">
<div className="bulk-actions flex items-center gap-3">
  <span>{selectedListings.length} items selected</span>
  <select 
    className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => handleBulkAction(e.target.value)}
    value=""
  >
    <option value="">Bulk Actions</option>
    <option value="approved">Approve Selected</option>
    <option value="rejected">Reject Selected</option>
    <option value="pending">Set as Pending</option>
    <option value="delete">Delete Selected</option>
  </select>
</div>


<div className="search-section flex items-center gap-3">
  <input
    type="text"
    placeholder="Search listings..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
  />
  {searchTerm && (
    <button
      className="text-lg text-gray-500 hover:text-gray-700"
      onClick={() => setSearchTerm("")}
      title="Clear search"
    >
      ×
    </button>
  )}
</div>


<div className="filter-section flex flex-wrap gap-4 mb-4">
  <select
    value={filters.approvalStatus}
    onChange={(e) => setFilters({ ...filters, approvalStatus: e.target.value })}
    className="filter-select p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    title="Filter by approval status"
  >
    <option value="all">All Approval Status</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>

  <select
    value={filters.soldStatus}
    onChange={(e) => setFilters({ ...filters, soldStatus: e.target.value })}
    className="filter-select p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    title="Filter by sold status"
  >
    <option value="all">All Sold Status</option>
    <option value="sold">Sold</option>
    <option value="available">Available</option>
  </select>

  <select
    value={filters.fuelType}
    onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
    className="filter-select p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    title="Filter by fuel type"
  >
    <option value="all">All Fuel Types</option>
    {uniqueFuelTypes.map(fuelType => (
      <option key={fuelType} value={fuelType}>{fuelType}</option>
    ))}
  </select>

  <select
    value={filters.blueTGrade}
    onChange={(e) => setFilters({ ...filters, blueTGrade: e.target.value })}
    className="filter-select p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    title="Filter by Blue T Grade"
  >
    <option value="all">All Blue T Grades</option>
    <option value="B+">B+</option>
    <option value="B">B</option>
    <option value="B-">B-</option>
    <option value="C">C</option>
    <option value="D">D</option>
    <option value="N/A">N/A</option>
  </select>

  <select
    value={filters.priceRange}
    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
    className="filter-select p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    title="Filter by price range"
  >
    <option value="all">All Prices</option>
    <option value="0-10000">Under $10,000</option>
    <option value="10000-30000">$10,000 - $30,000</option>
    <option value="30000-50000">$30,000 - $50,000</option>
    <option value="50000">$50,000+</option>
  </select>

  <select
    value={filters.dateFilter}
    onChange={(e) => setFilters({ ...filters, dateFilter: e.target.value })}
    className="filter-select p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    title="Filter by date"
  >
    <option value="all">All Dates</option>
    <option value="today">Today</option>
    <option value="thisWeek">This Week</option>
    <option value="thisMonth">This Month</option>
    <option value="lastMonth">Last Month</option>
    <option value="specificMonth">Specific Month</option>
    <option value="custom">Custom Range</option>
  </select>

  {filters.dateFilter === "specificMonth" && (
    <div className="month-filter flex gap-4">
      <select
        value={filters.monthFilter.month}
        onChange={(e) => setFilters({
          ...filters,
          monthFilter: { ...filters.monthFilter, month: e.target.value }
        })}
        className="filter-select p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Select month"
      >
        <option value="">Select Month</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <select
        value={filters.monthFilter.year}
        onChange={(e) => setFilters({
          ...filters,
          monthFilter: { ...filters.monthFilter, year: e.target.value }
        })}
        className="filter-select p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Select year"
      >
        <option value="">Select Year</option>
        {Array.from({ length: 5 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return <option key={year} value={year}>{year}</option>;
        })}
      </select>
    </div>
  )}

  {filters.dateFilter === "custom" && (
    <div className="custom-date-range flex gap-4">
      <input
        type="date"
        value={filters.customDateRange.start}
        onChange={(e) => setFilters({
          ...filters,
          customDateRange: { ...filters.customDateRange, start: e.target.value }
        })}
        className="date-input p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Start date"
      />
      <input
        type="date"
        value={filters.customDateRange.end}
        onChange={(e) => setFilters({
          ...filters,
          customDateRange: { ...filters.customDateRange, end: e.target.value }
        })}
        className="date-input p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="End date"
      />
    </div>
  )}

  <button
    className="reset-filters-btn p-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    onClick={handleResetFilters}
    title="Reset all filters"
  >
    Reset Filters
  </button>

  <div className="view-type-toggle flex gap-4">
    <button
      className={`view-type-btn p-2 border border-gray-300 rounded-md text-sm ${viewType === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-gray-200`}
      onClick={() => setViewType('grid')}
      title="Grid view"
    >
      <FaThLarge />
    </button>
    <button
      className={`view-type-btn p-2 border border-gray-300 rounded-md text-sm ${viewType === 'list' ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-gray-200`}
      onClick={() => setViewType('list')}
      title="List view"
    >
      <FaList />
    </button>
  </div>
</div>

          </div>

          {isLoading ? (
            <div>Loading listings...</div>
          ) : (
            <>
              {filteredListings.length === 0 ? (
                <div className="no-results text-center p-10 bg-gray-50 border-dashed border-2 border-gray-300 text-gray-500 font-medium text-lg">
                No listings found. Try adjusting your filters.
              </div>
              
              ) : viewType === 'list' ? (
                <>
                  <table className="min-w-full table-auto border-collapse border border-gray-200 mt-4">
                    <thead>
                      <tr className="bg-blue-700 text-white">
                        <th className="p-3 text-left">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                            className="select-all-checkbox"
                          />
                        </th>
                        <th className="p-3 text-left">Image</th>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Seller Type</th>
                        <th className="p-3 text-left">Year</th>
                        <th className="p-3 text-left">Blue T Grade</th>
                        <th className="p-3 text-left">Blue T Status</th>
                        <th className="p-3 text-left">Mileage</th>
                        <th className="p-3 text-left">Fuel Type</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Price</th>
                        <th className="p-3 text-left">Mark as Sold</th>
                        <th className="p-3 text-left">Approval Status</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((listing) => (
                        <tr key={listing.id} className="listing-row hover:bg-gray-100">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedListings.includes(listing.id)}
                              onChange={() => handleSelectListing(listing.id)}
                              className="listing-checkbox"
                            />
                          </td>
                          <td className="p-3">
                            <img
                              src={listing.imageUrls?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                              alt={listing.title}
                              className="listing-image w-24 h-16 object-cover rounded"
                            />
                          </td>
                          <td className="p-3">{listing.title}</td>
                          <td className="p-3">{listing.userRole}</td>
                          <td className="p-3">{listing.yearofmanufacture}</td>
                          <td className="p-3">{listing.blueTGrade || "N/A"}</td>
                          <td className="p-3">
                            <div className="blue-t-status-toggle">
                              <button
                                className={`blue-t-toggle-btn ${listing.isBlueTVerified ? 'bg-green-200' : 'bg-blue-200'} p-2 rounded text-white`}
                                onClick={() => handleBlueTVerificationChange(listing.id, !listing.isBlueTVerified)}
                                title={listing.isBlueTVerified ? "Unverify Blue T" : "Verify Blue T"}
                              >
                                {listing.isBlueTVerified ? "VERIFIED" : "Verify Blue T"}
                              </button>
                            </div>
                          </td>
                          <td className="p-3">{parseFloat(listing.mileage).toLocaleString()} km</td>
                          <td className="p-3">{listing.fuelType}</td>
                          <td className="p-3">{new Date(listing.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">Rs.{listing.price.toLocaleString()}</td>
                          <td className="p-3">
                            <div className="sold-status-toggle">
                              <button
                                className={`sold-toggle-btn ${listing.isSold ? 'bg-red-500' : 'bg-green-500'} text-white p-2 rounded`}
                                onClick={() => handleSoldStatusChange(listing.id, !listing.isSold)}
                                title={listing.isSold ? "Mark as Available" : "Mark as Sold"}
                              >
                                {listing.isSold ? "SOLD" : "Mark as Sold"}
                              </button>
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              className={`approval-toggle ${listing.status === "approved" ? 'bg-green-500' : listing.status === "rejected" ? 'bg-red-500' : 'bg-yellow-500'} text-white p-2 rounded`}
                              onClick={() => {
                                if (listing.status === "pending") {
                                  handleApprovalStatusChange(listing.id, "approved");
                                } else if (listing.status === "approved") {
                                  handleApprovalStatusChange(listing.id, "rejected");
                                } else {
                                  handleApprovalStatusChange(listing.id, "approved");
                                }
                              }}
                              title={listing.status === "pending" ? "Pending approval" : listing.status === "approved" ? "Click to reject" : "Click to approve"}
                            >
                              <div className="toggle-icons flex gap-2">
                                <FaCheck className="check-icon" />
                                <FaTimes className="times-icon" />
                                <FaExclamationCircle className="pending-icon" />
                              </div>
                              <span className="toggle-text">
                                {listing.status === "pending" ? "Pending" : listing.status === "approved" ? "Approved" : "Rejected"}
                              </span>
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="action-icons flex gap-3">
                              <button
                                className="icon-btn text-blue-500"
                                onClick={() => handleEdit(listing.id)}
                                title="Edit listing"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="icon-btn text-green-500"
                                onClick={() => navigate(`/listing/${listing.id}`)}
                                title="View listing"
                              >
                                <FaEye />
                              </button>
                              <button
                                className="icon-btn text-red-500"
                                onClick={() => handleDelete(listing.id)}
                                title="Delete listing"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination Controls */}
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-blue-700 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <div className="listing-page flex min-h-screen bg-gray-50">
                  <div className="listing-main-content flex-1 ml-48 min-h-screen bg-gray-50 relative">
                    <div className="listing-content-wrapper flex-1 p-5 bg-white mt-20 ml-2 rounded-xl shadow-lg">
                      <div className="listing-grid grid grid-cols-3 gap-6 mt-6">
                        {currentItems.map((listing) => (
                          <div key={listing.id} className="grid-item bg-white rounded-lg shadow-md overflow-hidden relative">
                            <div className="grid-item-checkbox absolute top-3 left-3 z-10">
                              <input
                                type="checkbox"
                                checked={selectedListings.includes(listing.id)}
                                onChange={() => handleSelectListing(listing.id)}
                                className="listing-checkbox"
                              />
                            </div>
                            <div className="grid-item-image relative">
                              <img
                                src={listing.imageUrls?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt={listing.title}
                                className="w-full h-48 object-cover"
                              />
                              <div className="grid-item-status absolute top-3 right-3 flex justify-between w-full px-2">
                                <div className="status-left">
                                  {listing.isSold && (
                                    <span className="sold-badge bg-red-500 text-white px-2 py-1 rounded-full text-xs">SOLD</span>
                                  )}
                                </div>
                                <div className="status-right">
                                  <span className={`status-badge text-white px-2 py-1 rounded-full text-xs ${listing.status === 'approved' ? 'bg-green-500' : listing.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="grid-item-content p-4">
                              <h3 className="font-semibold text-lg">{listing.title}</h3>
                              <div className="grid-item-details mt-2">
                                <p><strong>Price:</strong> ${listing.price.toLocaleString()}</p>
                                <p><strong>Year:</strong> {listing.yearofmanufacture}</p>
                                <p><strong>Mileage:</strong> {parseFloat(listing.mileage).toLocaleString()} km</p>
                                <p><strong>Fuel Type:</strong> {listing.fuelType}</p>
                                <p><strong>Blue T Grade:</strong> {listing.blueTGrade || "N/A"} 
                                  {listing.isBlueTVerified && <span className="verified-badge text-green-500">✓ Verified</span>}
                                </p>
                              </div>
                              <div className="grid-item-actions flex gap-4 mt-4">
                                <button
                                  className="icon-btn text-blue-500 hover:text-blue-700"
                                  onClick={() => handleEdit(listing.id)}
                                  title="Edit listing"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="icon-btn text-green-500 hover:text-green-700"
                                  onClick={() => navigate(`/listing/${listing.id}`)}
                                  title="View listing"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="icon-btn text-red-500 hover:text-red-700"
                                  onClick={() => handleDelete(listing.id)}
                                  title="Delete listing"
                                >
                                  <FaTrashAlt />
                                </button>
                                <button
                                  className={`approval-toggle text-white p-2 rounded-lg font-semibold ${listing.status === 'approved' ? 'bg-green-500' : listing.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                  onClick={() => {
                                    if (listing.status === "pending") {
                                      handleApprovalStatusChange(listing.id, "approved");
                                    } else if (listing.status === "approved") {
                                      handleApprovalStatusChange(listing.id, "rejected");
                                    } else {
                                      handleApprovalStatusChange(listing.id, "approved");
                                    }
                                  }}
                                >
                                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Pagination Controls for Grid View */}
                      <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === 1
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === page
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === totalPages
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {notification.show && (
            <div className={`notification ${notification.type === 'success' ? 'bg-green-100 text-green-800' : notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} p-4 rounded-lg shadow-md fixed bottom-6 right-6 flex items-center space-x-4 z-50`}>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-opacity-20">
              {notification.type === 'success' ? (
                <FaCheck className="text-green-600" />
              ) : notification.type === 'error' ? (
                <FaTimes className="text-red-600" />
              ) : (
                <FaExclamationCircle className="text-yellow-600" />
              )}
            </div>
            <span>{notification.message}</span>
          </div>
          
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ListingPage;
