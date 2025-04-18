import React, { useState, useEffect } from 'react';

// Types for our filters and API responses
type VehicleMake = {
  id: number;
  name: string;
};

type VehicleModel = {
  id: number;
  makeId: number;
  name: string;
};

type District = {
  id: number;
  name: string;
};

type FilterOptions = {
  makes: VehicleMake[];
  bodyTypes: string[];
  fuelTypes: string[];
  conditions: string[];
  districts: District[];
  transmissions: string[];
};

type VehicleFilters = {
  makeId?: number;
  modelId?: number;
  bodyType?: string;
  districtId?: number;
  maxPrice?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  blueTGrade?: string;
  keywords?: string;
};

const fetchFilterOptions = async (): Promise<FilterOptions> => {
  // Replace with actual API call
  return {
    makes: [
      { id: 1, name: 'Toyota' },
      { id: 2, name: 'Honda' },
      { id: 3, name: 'Ford' },
    ],
    bodyTypes: ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe'],
    fuelTypes: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
    conditions: ['New', 'Used', 'Certified Pre-owned'],
    districts: [
      { id: 1, name: 'Colombo' },
      { id: 2, name: 'Gampaha' },
      { id: 3, name: 'Kandy' },
    ],
    transmissions: ['Automatic', 'Manual', 'CVT', 'DCT']
  };
};

const fetchModelsByMake = async (makeId: number): Promise<VehicleModel[]> => {
  // Replace with actual API call
  if (makeId === 1) {
    return [
      { id: 1, makeId: 1, name: 'Corolla' },
      { id: 2, makeId: 1, name: 'Camry' },
      { id: 3, makeId: 1, name: 'RAV4' },
    ];
  } else if (makeId === 2) {
    return [
      { id: 4, makeId: 2, name: 'Civic' },
      { id: 5, makeId: 2, name: 'Accord' },
    ];
  }
  return [];
};

const AdvancedFilter: React.FC<{
  onFilterChange: (filters: VehicleFilters) => void;
}> = ({ onFilterChange }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<VehicleFilters>({});

  // Load filter options on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
        setLoading(false);
      } catch (err) {
        setError('Failed to load filter options');
        setLoading(false);
      }
    };
    
    loadOptions();
  }, []);

  // Load models when make changes
  useEffect(() => {
    if (filters.makeId) {
      const loadModels = async () => {
        try {
          const models = await fetchModelsByMake(filters.makeId!);
          setModels(models);
          setFilters(prev => ({ ...prev, modelId: undefined }));
        } catch (err) {
          setError('Failed to load models');
        }
      };
      
      loadModels();
    } else {
      setModels([]);
      setFilters(prev => ({ ...prev, modelId: undefined }));
    }
  }, [filters.makeId]);

  // Notify parent component of filter changes
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : 
              ['maxPrice', 'minYear', 'maxYear', 'maxMileage'].includes(name) ? 
              Number(value) : value
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  if (loading) return <div className="p-4 text-center">Loading filters...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!filterOptions) return <div className="p-4 text-center">No filter options available</div>;

  return (
    <div className="bg-white p-4 mt-10 rounded-lg shadow-md sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Filter Vehicles</h2>
      
      <div className="space-y-4">
        {/* Make dropdown */}
        <div>
          <label htmlFor="makeId" className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <select
            id="makeId"
            name="makeId"
            value={filters.makeId || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Makes</option>
            {filterOptions.makes.map(make => (
              <option key={make.id} value={make.id}>{make.name}</option>
            ))}
          </select>
        </div>

        {/* Model dropdown */}
        {filters.makeId && (
          <div>
            <label htmlFor="modelId" className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              id="modelId"
              name="modelId"
              value={filters.modelId || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Models</option>
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Body Type */}
        <div>
          <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 mb-1">
            Body Type
          </label>
          <select
            id="bodyType"
            name="bodyType"
            value={filters.bodyType || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Body Types</option>
            {filterOptions.bodyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type
          </label>
          <select
            id="fuelType"
            name="fuelType"
            value={filters.fuelType || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Fuel Types</option>
            {filterOptions.fuelTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            value={filters.transmission || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Transmissions</option>
            {filterOptions.transmissions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Year Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="minYear" className="block text-sm font-medium text-gray-700 mb-1">
              Min Year
            </label>
            <input
              type="number"
              id="minYear"
              name="minYear"
              min="1900"
              max={new Date().getFullYear()}
              value={filters.minYear || ''}
              onChange={handleInputChange}
              placeholder="Min year"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="maxYear" className="block text-sm font-medium text-gray-700 mb-1">
              Max Year
            </label>
            <input
              type="number"
              id="maxYear"
              name="maxYear"
              min="1900"
              max={new Date().getFullYear()}
              value={filters.maxYear || ''}
              onChange={handleInputChange}
              placeholder="Max year"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price (LKR)
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleInputChange}
            placeholder="No limit"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Max Mileage */}
        <div>
          <label htmlFor="maxMileage" className="block text-sm font-medium text-gray-700 mb-1">
            Max Mileage (km)
          </label>
          <input
            type="number"
            id="maxMileage"
            name="maxMileage"
            value={filters.maxMileage || ''}
            onChange={handleInputChange}
            placeholder="No limit"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Keywords */}
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={filters.keywords || ''}
            onChange={handleInputChange}
            placeholder="Search by keywords..."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilter;