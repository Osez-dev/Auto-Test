import React, { useState } from "react";
import { X } from "lucide-react";

interface ListingCardProps {
  imageUrls: string[];
  title: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  price: number;
  isSold?: boolean;
  status?: 'pending' | 'rejected' | 'approved';
  onMarkSold?: () => void;
  onClick?: () => void;
  showRemoveFavorite?: boolean;
  onRemoveFavorite?: () => void;
  onEdit?: () => void;
  showEditButton?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  imageUrls,
  title,
  fuelType,
  transmission,
  price,
  isSold,
  status,
  onMarkSold,
  onClick,
  showRemoveFavorite,
  onRemoveFavorite,
  onEdit,
  showEditButton,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get the first image URL or use a placeholder
  const mainImageUrl = imageUrls?.[0] 
    ? imageUrls[0].startsWith('http') 
      ? imageUrls[0] 
      : `${import.meta.env.VITE_BASE_URL}${imageUrls[0]}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div
      className="w-64 h-80 rounded-xl overflow-hidden bg-white shadow-lg transition-transform duration-300 ease-in-out hover:translate-y-[-10px] hover:shadow-xl cursor-pointer relative"
      onClick={onClick}
    >
      <div className="relative w-full h-41 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <img 
          src={imageError ? "https://via.placeholder.com/300x200?text=Image+Not+Available" : mainImageUrl}
          alt={title}
          className={`w-full h-44 object-cover transition-transform duration-300 ease-in-out hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-blue-500/40 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        {status && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-md text-sm font-semibold uppercase z-10 ${
            status === 'pending' ? 'bg-yellow-400 text-yellow-900' :
            status === 'rejected' ? 'bg-red-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {status.toUpperCase()}
          </div>
        )}
        {isSold && <div className="absolute top-5 right-[-35px] bg-red-500 text-white px-10 py-2 text-xs font-semibold uppercase z-10 shadow-md rotate-45">SOLD</div>}
        
        {showRemoveFavorite && (
          <button
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 p-1 rounded-full transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFavorite?.();
            }}
          >
            <X size={20} />
          </button>
        )}

        {showEditButton && (
          <button
            className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold uppercase z-10 hover:bg-blue-600 transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-blue-600 mb-2 line-clamp-2">{title}</h3>
        <div className="flex gap-2 text-sm text-gray-600 mb-2">
          <span>{transmission}</span>
          <span>•</span>
          <span>{fuelType}</span>
        </div>
        <div className="text-xl font-bold text-blue-600">Rs. {price.toLocaleString()}</div>
        {onMarkSold && (
          <button
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md font-semibold text-sm uppercase tracking-wide transition-transform duration-300 hover:bg-blue-700 hover:-translate-y-1 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onMarkSold();
            }}
          >
            Mark as Sold
          </button>
        )}
      </div>

      <div className="flex justify-between items-center px-4 pb-4">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg transition-transform duration-300 hover:bg-blue-700 hover:scale-110">
          View Details
        </button>
        <button className="bg-white border border-blue-600 text-blue-600 p-2 rounded-full cursor-pointer transition-transform duration-300 hover:bg-blue-600 hover:text-white hover:scale-110">
          ❤️
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
