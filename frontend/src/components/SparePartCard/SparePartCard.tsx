import React from "react";

interface SparePartCardProps {
  id: number;
  name: string;
  imageUrls: string[] | null | undefined;
  stock: number;
  keywords: string[];
}

const SparePartCard: React.FC<SparePartCardProps> = ({ name, imageUrls, stock }) => {
  const imageUrl =
    imageUrls && imageUrls.length > 0
      ? imageUrls[0]
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="spare-part-card flex flex-col justify-between items-center border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white max-w-[300px] mx-2 my-2 transition-transform transform hover:translate-y-[-5px] hover:shadow-xl">
      <img
        src={imageUrl}
        alt={name}
        className="spare-part-card-image w-full h-[200px] object-cover"
      />
      <div className="spare-part-card-details p-4 text-center w-full">
        <h3 className="text-lg font-semibold text-gray-800 my-2">{name}</h3>
        <p className="text-sm text-gray-600">
          <strong className="text-black font-semibold">Stock:</strong> {stock}
        </p>
      </div>
    </div>
  );
};

export default SparePartCard;
