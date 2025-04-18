import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard/ListingCard";
import { getListings } from "../services/listingService";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection/Herosection";
import HomePageFilter from "../components/HomePageFilter/HomePageFilter";
import Container from "../components/Container/Container";
// import FloatingChatIcon from "../components/floating-chat/floating-chat";
// import VehicleSelector from "../components/VehicleTypeSelector/VehicleTypeSelector";

import AdSpace from "../components/SellMyCar_Components/AdSpace/AdSpace";
import OtherVCoptions from "../components/OtherVCoptions/OtherVCoptions";
// import TCard from "../components/Tourism/TCard";//


const Home: React.FC = () => {
  const [listings, setListings] = useState<
    Array<{
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
      condition: string; // Add condition to the listing type
    }>
  >([]);

  const [] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const data = await getListings(false); // false means exclude pending listings
      setListings(data);
    };

    fetchListings();
  }, [navigate]);

  const handleCardClick = (id: number) => {
    navigate(`/listing/${id}`);
  };

  // Filter listings to include only those with condition "New"
  const newListings = listings.filter((listing) => listing.condition.toLowerCase() === "new").slice(0, 6);
  const usedListings = listings.filter((listing) => listing.condition.toLowerCase() === "used").slice(0, 6);
  const reconditionListings = listings.filter((listing) => listing.condition.toLowerCase() === "recondition").slice(0, 6);
 

  return (
    <div style={{ margin: 0 }}>
      <Navbar />
      <HeroSection />
      
      <HomePageFilter />
      
      <Container>
        {/* <VehicleSelector /> */}
        <label className="listings-title mt-56 m-10">New Listings</label>
        <div className="grid grid-cols-2 mt-4 relative left-60 gap-5 ">
        <div className="grid -mx-24 gap-2  grid-cols-3 relative right-20 ">   
          {newListings.map((listing) => (
            <ListingCard 
              key={listing.id}
              imageUrls={listing.imageUrls || []}
              title={listing.title}
              year={listing.yearofmanufacture}
              mileage={parseFloat(listing.mileage)}
              fuelType={listing.fuelType}
              transmission={listing.transmission}
              price={listing.price}
              onClick={() => handleCardClick(listing.id)}
            />
          ))}
        </div>
        <AdSpace width="256px" height="650px" adContent={<img src="ad-banner.jpg" alt="Ad" />} />
        </div>
        <label className="listings-title m-10">Used Listings</label>
        <div className="grid grid-cols-2 mt-4 relative left-60 gap-5">  
        <div className="grid -mx-24 gap-2  grid-cols-3 relative right-20 "> 
          {usedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              imageUrls={listing.imageUrls || []}
              title={listing.title}
              year={listing.yearofmanufacture}
              mileage={parseFloat(listing.mileage)}
              fuelType={listing.fuelType}
              transmission={listing.transmission}
              price={listing.price}
              onClick={() => handleCardClick(listing.id)}
            />
          ))}
         </div>
         <AdSpace width="256px" height="650px" adContent={<img src="ad-banner.jpg" alt="Ad" />} />
        </div>
        <label className="listings-title m-10">Recondition Listings</label>
        <div className="grid grid-cols-2 mt-4 relative left-60 gap-5">   
        <div className="grid -mx-24 gap-2  grid-cols-3 relative right-20 "> 
          {reconditionListings.map((listing) => (
            <ListingCard
              key={listing.id}
              imageUrls={listing.imageUrls || []}
              title={listing.title}
              year={listing.yearofmanufacture}
              mileage={parseFloat(listing.mileage)}
              fuelType={listing.fuelType}
              transmission={listing.transmission}
              price={listing.price}
              onClick={() => handleCardClick(listing.id)}
            />
          ))}
        </div>
          <AdSpace width="256px" height="650px" adContent={<img src="ad-banner.jpg" alt="Ad" />} />
        </div>
        <label className="listings-title">Other Services</label>
        <OtherVCoptions/> 
        {/* <label className="listings-title">Tourism</label>
        <TCard/> */}
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
