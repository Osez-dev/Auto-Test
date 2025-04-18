import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface FilterState {
  carMake: string;
  carModel: string;
  minPrice: number | string;
  maxPrice: number | string;
  RegYear: string;
  vehicleType: string;
  bodyType: string;
  condition: "New" | "Used" | "Recondition" | "All";
}

interface ApiData {
  vehicleTypes: string[];
  bodyTypes: string[];
  regYears: string[];
}

const HomePageFilter: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterState>({
    carMake: "",
    carModel: "",
    minPrice: "",
    maxPrice: "",
    RegYear: "",
    vehicleType: "",
    bodyType: "",
    condition: "All",
  });

  const [apiData, setApiData] = useState<ApiData>({
    vehicleTypes: [],
    bodyTypes: ["Sedan", "Truck", "Coupe", "SUV", "Hatchback"], // Defaults in case API fails
    regYears: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL || '';
        const [typesRes, categoriesRes, yearsRes] = await Promise.all([
          axios.get(`${baseUrl}/vehicle-types`),
          axios.get(`${baseUrl}/categories`),
          axios.get(`${baseUrl}/registration-years`),
        ]);

        setApiData({
          vehicleTypes: typesRes.data,
          bodyTypes: categoriesRes.data || apiData.bodyTypes, // Fallback to defaults
          regYears: yearsRes.data,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching filter options:", error);
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Reset filters when tab changes
  const handleTabChange = (tab: FilterState["condition"]) => {
    setFilter({
      carMake: "",
      carModel: "",
      minPrice: "",
      maxPrice: "",
      RegYear: "",
      vehicleType: "",
      bodyType: "",
      condition: tab,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Apply all filters with the current tab's condition
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      
      // Always include the condition parameter (even when "All")
      params.append("condition", filter.condition.toLowerCase());
      
      // Apply other filters
      if (filter.carMake) params.append("make", filter.carMake.toLowerCase());
      if (filter.carModel) params.append("model", filter.carModel.toLowerCase());
      if (filter.minPrice) params.append("minPrice", filter.minPrice.toString());
      if (filter.maxPrice) params.append("maxPrice", filter.maxPrice.toString());
      if (filter.RegYear) params.append("year", filter.RegYear);
      if (filter.vehicleType) params.append("vehicleType", filter.vehicleType);
      if (filter.bodyType) params.append("bodyType", filter.bodyType.toLowerCase());

      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const apiUrl = `${baseUrl}/listings?${params.toString()}`;
      console.log("API Request:", apiUrl);

      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data);
      
      // Navigate to inventory page with all parameters
      navigate(`/Inventory?${params.toString()}`);
    } catch (error) {
      console.error('Error searching vehicles:', error);
      // TODO: Add error handling UI
    }
  };

  if (isLoading) return <div>Loading filter options...</div>;

  return (
    <div className="p-5 border border-white rounded-2xl w-[800px] h-[200px] mx-auto relative top-[200px] left-[20px] bg-white/25 shadow-md backdrop-blur-md z-10">
      {/* Condition Tabs */}
      <div className="mb-5 mx-auto shadow-lg shadow-[#000000] bg-[#0663B2] max-w-[600px] p-2 flex justify-center items-center rounded-full relative top-[-45px]">
        {["New", "Used", "Recondition", "All"].map((tab) => (
          <button
            key={tab}
            className={`mr-2 px-4 py-2 border border-gray-300 rounded-full cursor-pointer w-[150px] ${
              filter.condition === tab ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => handleTabChange(tab as FilterState["condition"])}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Filter Inputs */}
      <div className="flex flex-wrap gap-5 relative top-[-45px]">
        <div className="flex gap-2">
          <input
            type="text"
            name="carMake"
            placeholder="Car Make"
            value={filter.carMake}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg flex-1 w-full"
          />

          <input
            type="text"
            name="carModel"
            placeholder="Car Model"
            value={filter.carModel}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg flex-1 w-full"
          />

          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filter.minPrice}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg flex-1 w-full"
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filter.maxPrice}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg flex-1 w-full"
          />
        </div>

        <div className="flex gap-2">
          {/* Registration Year (only for Used vehicles) */}
          {filter.condition === "Used" && (
            <select
              name="RegYear"
              value={filter.RegYear}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg w-f"
            >
              <option value="">Select Year</option>
              {apiData.regYears.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          )}

          {/* Vehicle Type Dropdown */}
          <select
            name="vehicleType"
            value={filter.vehicleType}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg w-f"
          >
            <option value="">Vehicle Type</option>
            {apiData.vehicleTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          {/* Body Type Dropdown */}
          <select
            name="bodyType"
            value={filter.bodyType}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Body Type</option>
            {apiData.bodyTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="px-5 py-2 bg-black text-white rounded-full cursor-pointer shadow-md border border-gray-300"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePageFilter;