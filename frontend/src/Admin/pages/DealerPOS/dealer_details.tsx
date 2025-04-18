import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListingsByUserId, deleteListing } from "../../../services/listingService";
// import ListingCard from "../../../components/ListingCard/ListingCard";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import { UsersService } from "../../../services/UsersService";
import { FaUser, FaEnvelope, FaPhone, FaCar, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

// Modal component with two-step confirmation
const Modal = ({ isOpen, onClose, onConfirmSold }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Is the vehicle sold?</h3>
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => onConfirmSold(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Yes
          </button>
          <button 
            onClick={() => onConfirmSold(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            No
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const DealerDetails: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [dealerInfo, setDealerInfo] = useState<any>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentListingId, setCurrentListingId] = useState<number | null>(null);
  // const [isSold, setIsSold] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchDealerAndListings = async () => {
      try {
        if (!id) {
          console.error("No dealer ID provided");
          navigate("/dealer-pos");
          return;
        }

        const dealerData = await UsersService.getUserById(parseInt(id));
        setDealerInfo(dealerData);

        const listingsData = await getListingsByUserId(parseInt(id));
        setListings(listingsData);
      } catch (err) {
        console.error("Failed to fetch dealer or listings:", err);
        navigate("/dealer-pos");
      }
    };
    fetchDealerAndListings();
  }, [id, navigate]);

  const handleDelete = async (id: number, sold: boolean) => {
    try {
      if (sold) {
        console.log(`Listing ${id} marked as sold.`);
      }
      await deleteListing(id);
      setListings(listings.filter(listing => listing.id !== id));
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-listing/${id}`);
  };

  const openModal = (id: number) => {
    setCurrentListingId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentListingId(null);
    // setIsSold(null);
  };

  const confirmSold = (sold: boolean) => {
    // setIsSold(sold);
    if (sold) {
      alert("Is this vehicle sold via AutoStream?");
      handleDelete(currentListingId as number, true);
    } else {
      handleDelete(currentListingId as number, false);
      closeModal();
    }
  };

  if (!dealerInfo) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 ml-16">
          <AdminNavbar />
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-1 ml-16">
        <AdminNavbar />
        <div className="p-6 mt-16">
          {/* Dealer Info Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUser className="text-blue-600 text-2xl" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {dealerInfo.firstName} {dealerInfo.lastName}
                </h1>
              </div>
              <button 
                onClick={() => navigate(`/dealer-pos/${id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dealer POS
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-500" />
                <p className="text-gray-600">{dealerInfo.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-gray-500" />
                <p className="text-gray-600">{dealerInfo.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Listings Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FaCar className="text-blue-600 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">Vehicle Listings</h2>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {listings.length} {listings.length === 1 ? 'Listing' : 'Listings'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  {/* <ListingCard
                    imageUrl={listing.imageUrls?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"}
                    title={listing.title}
                    year={listing.yearofmanufacture}
                    mileage={parseFloat(listing.mileage)}
                    fuelType={listing.fuelType}
                    transmission={listing.transmission}
                    price={listing.price}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                  /> */}
                  <div className="p-4 flex justify-between bg-gray-50">
                    <button 
                      onClick={() => handleEdit(listing.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                    >
                      <FaEdit className="text-sm" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => openModal(listing.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      <FaTrash className="text-sm" />
                      <span>Delete</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <FaCheckCircle className="text-sm" />
                      <span>Sold</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {listings.length === 0 && (
              <div className="text-center py-8">
                <FaCar className="text-gray-400 text-5xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No listings found for this dealer</p>
              </div>
            )}
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirmSold={confirmSold}
            onConfirmAutoStream={confirmSold}
          />
        </div>
      </div>
    </div>
  );
};

export default DealerDetails;
