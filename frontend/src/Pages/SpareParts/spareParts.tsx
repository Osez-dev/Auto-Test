import React, { useEffect, useState } from "react";

import "./SpareParts.css";
import { getAllSparePart } from "../../services/sparePartsService";
import SparePartCard from "../../components/SparePartCard/SparePartCard";

interface SparePart {
  id: number;
  name: string;
  keywords: string[];
  imageUrls: string[] | null | undefined;
  stock: number;
}

const SpareParts: React.FC = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all spare parts on component mount
  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const parts = await getAllSparePart();
        setSpareParts(parts);
      } catch (error: any) {
        console.error("Error fetching spare parts:", error);
        setError(error.message || "Failed to fetch spare parts.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpareParts();
  }, []);

  if (loading) {
    return <div>Loading spare parts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="spare-parts-container">
      <h1>All Spare Parts</h1>
      <div className="spare-parts-grid">
        {spareParts.length > 0 ? (
          spareParts.map((part) => (
            <SparePartCard
              key={part.id}
              id={part.id}
              name={part.name}
              keywords={part.keywords}
              imageUrls={part.imageUrls}
              stock={part.stock}
            />
          ))
        ) : (
          <div>No spare parts available.</div>
        )}
      </div>
    </div>
  );
};

export default SpareParts;