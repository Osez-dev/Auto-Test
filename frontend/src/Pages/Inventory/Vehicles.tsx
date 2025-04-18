import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getListings, searchListings } from "../../services/listingService";
import Navbar from "../../components/Navbar";
import SearchBar from "../../components/SearchBar/searchbar";
import ListingCard from "../../components/ListingCard/ListingCard";
import Footer from "../../components/Footer";
import heroimg from "./FRN_MY15_0053_V002.png";
import Container from "../../components/Container/Container";
import AdvancedFilter from "../AdvanceFilter/AdvancedFilter"

interface Listing {
  id: number;
  imageUrls: string[] | null;
  title: string;
  yearofmanufacture: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  blueTGrade: string;
  price: number;
  createdAt: string | null;
  isSold: boolean;
}

  interface VehicleFilters {
    [key: string]: string | number | null | undefined;
  }

  

  const handleFilterChange = async (filters: VehicleFilters) => {
    // Convert filters to query params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
      console.log("Filter Key:", key, "Value:", value);
    });
    
    searchListings(filters).then((response) => {
      const filteredListings = response.data;
      console.log("Filtered Listings:", filteredListings);
    }).catch((error) => {
      console.error("Error fetching filtered listings:", error);
    });
  }


const Inventory: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'sold'>('all');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings(false);
        setListings(data);
      } catch (err) {
        setError("Failed to fetch listings.");
      }
    };

    fetchListings();
  }, []);

  const handleCardClick = (id: number) => {
    navigate(`/listing/${id}`);
  };

  const filteredListings = listings.filter((listing) =>
    filterStatus === 'all' ? true : listing.isSold
  );

  return (
    <>
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <Container>
        <HeroImage /> 
        <Filters
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        <div className="flex gap-3">
        {error && <ErrorMessage message={error} />}
       
        <AdvancedFilter onFilterChange={handleFilterChange} />
        
        <ListingsGrid
          listings={filteredListings}
          onCardClick={handleCardClick}
        />
        </div>
      </Container>
      
    </div>
    <Footer />
    </>
  );
};

const HeroImage: React.FC = () => (
  <div className="">
    <img className="w-[1070px]  h-80 rounded-xl opacity-90 mx-auto" src={heroimg} alt="Hero" />
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <p style={{ color: "red", textAlign: "center" }}>{message}</p>
);

const Filters: React.FC<{
  filterStatus: 'all' | 'sold';
  setFilterStatus: React.Dispatch<React.SetStateAction<'all' | 'sold'>>;
}> = () => (
  <div className="inventory-filters">
    <SearchBar  onSearch={(query) => console.log(query)} />
    
  </div>
);


const ListingsGrid: React.FC<{
  listings: Listing[];
  onCardClick: (id: number) => void;
}> = ({ listings, onCardClick }) => (
  <div className="flex gap-4 justify-end mt-10">
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
        isSold={listing.isSold}
        onClick={() => onCardClick(listing.id)}
      />
    ))}
  </div>
);

export default Inventory;
