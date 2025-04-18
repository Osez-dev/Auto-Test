import React, { useEffect, useState } from 'react';
// import { useAuth } from '../services/AuthContext';
import authService from '../services/authService';
import { getListingsByUserId, updateListing, getListingById } from '../services/listingService';
import { getFavorites, removeFromFavorites as removeFavorite } from '../services/favoritesService';
import { useNavigate } from 'react-router-dom';
import ListingCard from './ListingCard/ListingCard';
import Navbar from './Navbar';
import AdminNavbar from '../Admin/Components/AdminNavbar/AdminNavbar';
import Sidebar from '../Admin/Components/Sidebar/Sidebar';
import { manageVehicleService } from '../services/manageVehicleService';
// import { showNotification } from '../services/notificationService';

type TabType = 'listings' | 'favorites' | 'manageVehicle';
type VehicleTabType = 'information' | 'serviceHistory';

interface Listing {
  id: number;
  imageUrls: string[];
  title: string;
  yearofmanufacture: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  price: number;
  status?: 'approved' | 'pending' | 'rejected';
  isSold?: boolean;
  [key: string]: any;
}

interface VehicleDetails {
  id: number;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color: string;
  ownershipStatus: 'owned' | 'leased' | 'financed';
  condition: 'excellent' | 'good' | 'fair';
  currentMileage: number;
  userId: number;
}

interface ServiceRecord {
  id: number;
  date: string;
  serviceType: string;
  description: string;
  cost: number;
  mileage: number;
  nextServiceDue: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('listings');
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [vehicleTab, setVehicleTab] = useState<VehicleTabType>('information');
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
    id: 0,
    make: '',
    model: '',
    year: 0,
    registrationNumber: '',
    color: '',
    ownershipStatus: 'owned',
    condition: 'good',
    currentMileage: 0,
    userId: 0
  });
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [newService, setNewService] = useState<Omit<ServiceRecord, 'id'>>({
    date: '',
    serviceType: '',
    description: '',
    cost: 0,
    mileage: 0,
    nextServiceDue: ''
  });
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const [vehicles, setVehicles] = useState<VehicleDetails[]>([]);

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch favorite listings details
  const fetchFavoriteListings = async (userId: number) => {
    try {
      const favoriteIds = getFavorites(userId);
      const favoriteListings = await Promise.all(
        favoriteIds.map(async (id) => {
          try {
            return await getListingById(id);
          } catch (error) {
            console.error(`Error fetching listing ${id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any null values from failed requests
      return favoriteListings.filter((listing): listing is Listing => listing !== null);
    } catch (error) {
      console.error('Error fetching favorite listings:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProfileAndListings = async () => {
      try {
        setIsLoading(true);
        const data = await authService.getProfile();
        if (data) {
          setProfile(data);
          sessionStorage.setItem('userProfile', JSON.stringify(data));

          // Fetch user's listings
          const userListings = await getListingsByUserId(data.id);
          setListings(userListings);

          // Fetch favorite listings
          const favoritedListings = await fetchFavoriteListings(data.id);
          setFavorites(favoritedListings);
        } else {
          console.error('Profile not found, redirecting to login.');
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to fetch profile or listings:', err);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndListings();
  }, [navigate]);

  const handleCardClick = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  const handleEdit = (listingId: number) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleMarkSold = async (listingId: number) => {
    if (window.confirm('Are you sure you want to mark this listing as sold?')) {
      try {
        const listing = listings.find(l => l.id === listingId);
        if (!listing) {
          showNotification('Listing not found', 'error');
          return;
        }

        if (listing.status !== 'approved') {
          showNotification('Only approved listings can be marked as sold', 'error');
          return;
        }

        await updateListing(listingId, { isSold: true });
        setListings(listings.map(listing =>
          listing.id === listingId ? { ...listing, isSold: true } : listing
        ));
        showNotification('Listing marked as sold successfully!', 'success');
      } catch (error) {
        console.error('Error marking listing as sold:', error);
        showNotification('Failed to mark listing as sold', 'error');
      }
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userToken');
    navigate('/login');
  };

  const handleRemoveFromFavorites = async (listingId: number) => {
    if (profile) {
      removeFavorite(profile.id, listingId);
      setFavorites(favorites.filter(fav => fav.id !== listingId));
      showNotification('Removed from favorites', 'success');
    }
  };

  const handleVehicleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleDetails(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'currentMileage' ? Number(value) : value
    }));
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedVehicle?.id) {
        showNotification('Please select a vehicle first', 'error');
        return;
      }

      const serviceData = {
        ...newService,
        vehicleId: selectedVehicle.id,
        date: newService.date ? new Date(newService.date).toISOString() : new Date().toISOString(),
        nextServiceDue: newService.nextServiceDue ? new Date(newService.nextServiceDue).toISOString() : new Date().toISOString(),
      };

      await manageVehicleService.addServiceHistory(serviceData);
      showNotification('Service record added successfully!', 'success');
      
      // Refresh service history
      const updatedHistory = await manageVehicleService.getServiceHistory(selectedVehicle.id);
      setServiceHistory(updatedHistory);

      // Reset form
      setNewService({
        date: '',
        serviceType: '',
        description: '',
        cost: 0,
        mileage: 0,
        nextServiceDue: ''
      });
    } catch (error) {
      console.error('Error adding service record:', error);
      showNotification('Failed to add service record', 'error');
    }
  };

  const handleVehicleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'registrationNumber', 'color', 'ownershipStatus', 'condition', 'currentMileage'];
    const missingFields = requiredFields.filter(field => !vehicleDetails[field as keyof VehicleDetails]);
    
    if (missingFields.length > 0) {
      showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }
    
    try {
      // Format the data to match backend expectations
      const formattedVehicleData = {
        make: vehicleDetails.make,
        model: vehicleDetails.model,
        year: Number(vehicleDetails.year),
        registrationNumber: vehicleDetails.registrationNumber,
        color: vehicleDetails.color,
        ownershipStatus: vehicleDetails.ownershipStatus,
        condition: vehicleDetails.condition,
        currentMileage: Number(vehicleDetails.currentMileage)
      };

      console.log('Submitting vehicle details:', formattedVehicleData);
      // const response = await manageVehicleService.createVehicle(formattedVehicleData);
      showNotification('Vehicle details saved successfully!', 'success');
      
      // Refresh the vehicle list
      const updatedVehicles = await manageVehicleService.getVehicles();
      setVehicles(updatedVehicles);
      
      // Reset the form
      setVehicleDetails({
        id: 0,
        make: '',
        model: '',
        year: 0,
        registrationNumber: '',
        color: '',
        ownershipStatus: 'owned',
        condition: 'good',
        currentMileage: 0,
        userId: 0
      });
      setShowVehicleForm(false);
    } catch (error: any) {
      console.error('Error saving vehicle details:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save vehicle details';
      showNotification(errorMessage, 'error');
    }
  };

  // Add useEffect for fetching vehicle information
  useEffect(() => {
    const fetchVehicleInformation = async () => {
      if (activeTab === 'manageVehicle' && profile) {
        try {
          const vehicleData = await manageVehicleService.getVehicle(profile.id);
          if (vehicleData) {
            setVehicleDetails(vehicleData);
          }
        } catch (error) {
          console.error('Error fetching vehicle information:', error);
          showNotification('Failed to fetch vehicle information', 'error');
        }
      }
    };

    fetchVehicleInformation();
  }, [activeTab, profile]);

  // Add useEffect to fetch vehicles when component mounts
  useEffect(() => {
    const fetchVehicles = async () => {
      if (profile) {
        try {
          const vehicleData = await manageVehicleService.getVehicles();
          // Filter vehicles to only show those belonging to the current user
          const userVehicles = vehicleData.filter((vehicle: VehicleDetails) => vehicle.userId === profile.id);
          setVehicles(userVehicles);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
          showNotification('Failed to fetch vehicles', 'error');
        }
      }
    };

    fetchVehicles();
  }, [profile]);

  // Add useEffect to fetch service history when a vehicle is selected
  useEffect(() => {
    const fetchServiceHistory = async () => {
      if (selectedVehicle) {
        try {
          const history = await manageVehicleService.getServiceHistory(selectedVehicle.id);
          setServiceHistory(history);
        } catch (error) {
          console.error('Error fetching service history:', error);
          showNotification('Failed to fetch service history', 'error');
        }
      }
    };

    fetchServiceHistory();
  }, [selectedVehicle]);

  return (<><>
    {profile && (profile.role != 'Customer') ? (
      <>
        <AdminNavbar />
        <Sidebar />
      </>
    ) : (
      <Navbar />
    )}
  </><div className="min-h-screen bg-gray-100 p-5">

      <div className="max-w-[1200px] mx-auto">


        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-600 py-10">Loading...</p>
          ) : profile ? (
            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="mb-2"><span className="font-semibold">Name:</span> {profile.firstName} {profile.lastName}</p>
                <p className="mb-2"><span className="font-semibold">Email:</span> {profile.email}</p>
                {(profile.role != 'customer') && (
                  <p className="mb-2"><span className="font-semibold">Role:</span> {profile.role}</p>
                )}
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>

              {(profile.role === 'Customer' || profile.role === 'admin') && (
                <>
                  <div className="flex space-x-4 border-b border-gray-200 pb-4 mb-6">
                    <button
                      className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'listings'
                          ? 'text-green-500 border-b-2 border-green-500'
                          : 'text-gray-600 hover:text-green-500'}`}
                      onClick={() => setActiveTab('listings')}
                    >
                      Your Listings
                    </button>
                    <button
                      className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'favorites'
                          ? 'text-green-500 border-b-2 border-green-500'
                          : 'text-gray-600 hover:text-green-500'}`}
                      onClick={() => setActiveTab('favorites')}
                    >
                      Favorites ({favorites.length})
                    </button>
                    <button
                      className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'manageVehicle'
                          ? 'text-green-500 border-b-2 border-green-500'
                          : 'text-gray-600 hover:text-green-500'}`}
                      onClick={() => setActiveTab('manageVehicle')}
                    >
                      Manage My Vehicle
                    </button>
                  </div>

                  {activeTab === 'listings' ? (
                    <>
                      {listings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {listings.map((listing) => (
                            <ListingCard
                              key={listing.id}
                              imageUrls={listing.imageUrls || []}
                              title={listing.title}
                              year={listing.yearofmanufacture}
                              mileage={parseFloat(listing.mileage)}
                              fuelType={listing.fuelType}
                              transmission={listing.transmission}
                              price={listing.price}
                              status={listing.status}
                              isSold={listing.isSold}
                              onMarkSold={listing.status === 'approved' && !listing.isSold ? () => handleMarkSold(listing.id) : undefined}
                              onClick={() => handleCardClick(listing.id.toString())}
                              onEdit={() => handleEdit(listing.id)}
                              showEditButton={true} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-600 py-10 bg-gray-50 rounded-lg">No listings found.</p>
                      )}
                    </>
                  ) : activeTab === 'favorites' ? (
                    <>
                      {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {favorites.map((listing) => (
                            <ListingCard
                              key={listing.id}
                              imageUrls={listing.imageUrls || []}
                              title={listing.title}
                              year={listing.yearofmanufacture}
                              mileage={parseFloat(listing.mileage)}
                              fuelType={listing.fuelType}
                              transmission={listing.transmission}
                              price={listing.price}
                              showRemoveFavorite={true}
                              onRemoveFavorite={() => handleRemoveFromFavorites(listing.id)}
                              onClick={() => handleCardClick(listing.id.toString())} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-600 py-10 bg-gray-50 rounded-lg">No favorites yet.</p>
                      )}
                    </>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex space-x-4 border-b border-gray-200 pb-4 mb-6">
                        <button
                          className={`px-4 py-2 rounded-t-lg transition-colors ${vehicleTab === 'information'
                              ? 'text-blue-500 border-b-2 border-blue-500'
                              : 'text-gray-600 hover:text-blue-500'}`}
                          onClick={() => setVehicleTab('information')}
                        >
                          Vehicle Information
                        </button>
                        <button
                          className={`px-4 py-2 rounded-t-lg transition-colors ${vehicleTab === 'serviceHistory'
                              ? 'text-blue-500 border-b-2 border-blue-500'
                              : 'text-gray-600 hover:text-blue-500'}`}
                          onClick={() => setVehicleTab('serviceHistory')}
                        >
                          Service History
                        </button>
                      </div>

                      {vehicleTab === 'information' ? (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800">Vehicle Details</h3>

                          {/* Previous Vehicles Table */}
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {vehicles.map((vehicle, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.make}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.registrationNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <button
                                        onClick={() => setSelectedVehicle(vehicle)}
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        View
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Add My Vehicle Button */}
                          <div className="flex justify-center mt-6">
                            <button
                              type="button"
                              onClick={() => {
                                setShowVehicleForm(!showVehicleForm);
                                setSelectedVehicle(null);
                                if (!showVehicleForm) {
                                  setVehicleDetails({
                                    id: 0,
                                    make: '',
                                    model: '',
                                    year: 0,
                                    registrationNumber: '',
                                    color: '',
                                    ownershipStatus: 'owned',
                                    condition: 'good',
                                    currentMileage: 0,
                                    userId: 0
                                  });
                                }
                              } }
                              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                              {showVehicleForm ? 'Cancel' : 'Add My Vehicle'}
                            </button>
                          </div>

                          {/* Selected Vehicle Details */}
                          {selectedVehicle && !showVehicleForm && (
                            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                              <h4 className="text-lg font-semibold mb-4">Vehicle Details</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Make</p>
                                  <p className="text-sm text-gray-900">{selectedVehicle.make}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Model</p>
                                  <p className="text-sm text-gray-900">{selectedVehicle.model}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Year</p>
                                  <p className="text-sm text-gray-900">{selectedVehicle.year}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Registration Number</p>
                                  <p className="text-sm text-gray-900">{selectedVehicle.registrationNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Color</p>
                                  <p className="text-sm text-gray-900">{selectedVehicle.color}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Ownership Status</p>
                                  <p className="text-sm text-gray-900">{selectedVehicle.ownershipStatus}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Condition</p>
                                  <p className="text-sm text-gray-900">{selectedVehicle.condition}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Current Mileage</p>
                                  <p className="text-sm text-gray-900">{selectedVehicle.currentMileage}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedVehicle(null)}
                                className="mt-4 text-blue-600 hover:text-blue-900"
                              >
                                Close
                              </button>
                            </div>
                          )}

                          {/* Vehicle Details Form */}
                          {showVehicleForm && (
                            <form onSubmit={handleVehicleDetailsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Make</label>
                                <input
                                  type="text"
                                  name="make"
                                  value={vehicleDetails.make}
                                  onChange={handleVehicleDetailsChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                <input
                                  type="text"
                                  name="model"
                                  value={vehicleDetails.model}
                                  onChange={handleVehicleDetailsChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                <input
                                  type="number"
                                  name="year"
                                  value={vehicleDetails.year}
                                  onChange={handleVehicleDetailsChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                                <input
                                  type="text"
                                  name="registrationNumber"
                                  value={vehicleDetails.registrationNumber}
                                  onChange={handleVehicleDetailsChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input
                                  type="text"
                                  name="color"
                                  value={vehicleDetails.color}
                                  onChange={handleVehicleDetailsChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Ownership Status</label>
                                <select
                                  name="ownershipStatus"
                                  value={vehicleDetails.ownershipStatus}
                                  onChange={handleVehicleDetailsChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="owned">Owned</option>
                                  <option value="leased">Leased</option>
                                  <option value="financed">Financed</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Condition</label>
                                <select
                                  name="condition"
                                  value={vehicleDetails.condition}
                                  onChange={handleVehicleDetailsChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="excellent">Excellent</option>
                                  <option value="good">Good</option>
                                  <option value="fair">Fair</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Current Mileage</label>
                                <input
                                  type="number"
                                  name="currentMileage"
                                  value={vehicleDetails.currentMileage}
                                  onChange={handleVehicleDetailsChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="col-span-2">
                                <button
                                  type="submit"
                                  className="w-full max-w-xs mx-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                  Save Details
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800">Service History</h3>

                          {/* Vehicle Selection Section */}
                          <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h4 className="text-lg font-medium text-gray-700 mb-4">Select Vehicle</h4>
                            {vehicles.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vehicles.map((vehicle) => (
                                  <div
                                    key={vehicle.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedVehicle?.id === vehicle.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'}`}
                                    onClick={() => {
                                      setSelectedVehicle(vehicle);
                                      setVehicleTab('serviceHistory');
                                    } }
                                  >
                                    <div className="font-medium text-gray-900">
                                      {vehicle.make} {vehicle.model}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Year: {vehicle.year}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Registration: {vehicle.registrationNumber}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">No vehicles found. Please add a vehicle first.</p>
                            )}
                          </div>

                          {/* Service History Form - Only show when vehicle is selected */}
                          {selectedVehicle && (
                            <>
                              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                <h4 className="text-lg font-medium text-gray-700 mb-2">Selected Vehicle</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-sm text-gray-500">Make:</span>
                                    <span className="ml-2 font-medium">{selectedVehicle.make}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Model:</span>
                                    <span className="ml-2 font-medium">{selectedVehicle.model}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Year:</span>
                                    <span className="ml-2 font-medium">{selectedVehicle.year}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Registration:</span>
                                    <span className="ml-2 font-medium">{selectedVehicle.registrationNumber}</span>
                                  </div>
                                </div>
                              </div>

                              <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">Date</label>
                                  <input
                                    type="date"
                                    name="date"
                                    value={newService.date}
                                    onChange={(e) => setNewService({ ...newService, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">Service Type</label>
                                  <input
                                    type="text"
                                    name="serviceType"
                                    value={newService.serviceType}
                                    onChange={(e) => setNewService({ ...newService, serviceType: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">Description</label>
                                  <textarea
                                    name="description"
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                    required />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">Cost</label>
                                  <input
                                    type="number"
                                    name="cost"
                                    value={newService.cost}
                                    onChange={(e) => setNewService({ ...newService, cost: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    min="0"
                                    step="0.01" />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">Mileage</label>
                                  <input
                                    type="number"
                                    name="mileage"
                                    value={newService.mileage}
                                    onChange={(e) => setNewService({ ...newService, mileage: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    min="0" />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">Next Service Due</label>
                                  <input
                                    type="date"
                                    name="nextServiceDue"
                                    value={newService.nextServiceDue}
                                    onChange={(e) => setNewService({ ...newService, nextServiceDue: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required />
                                </div>
                                <div className="col-span-2">
                                  <button
                                    type="submit"
                                    className="w-full max-w-xs mx-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                  >
                                    Add Service Record
                                  </button>
                                </div>
                              </form>
                            </>
                          )}

                          {/* Service History List */}
                          <div className="mt-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Past Services</h4>
                            {serviceHistory.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Service Due</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {serviceHistory.map((record) => (
                                      <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.serviceType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{record.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          ${typeof record.cost === 'number' ? record.cost.toFixed(2) : parseFloat(record.cost).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.mileage}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.nextServiceDue).toLocaleDateString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-center text-gray-600 py-10 bg-gray-50 rounded-lg">
                                {selectedVehicle ? 'No service records found for this vehicle.' : 'Please select a vehicle to view service history.'}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-10">Loading profile...</p>
          )}

          {notification && (
            <div className={`fixed bottom-4 right-4 px-4 py-2 rounded text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {notification.message}
            </div>
          )}
        </div>
      </div>
    </div></>
  );
};

export default Profile;