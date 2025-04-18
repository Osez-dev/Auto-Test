// import React from 'react';

const CityCard = ({ city }: { city: string }) => {
  return (
    <div className="relative mx-8 w-[220px] h-[300px] flex justify-center items-center transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
      
   
      
      {/* Card Content */}
      <div className="relative w-[190px] h-[254px] p-5 bg-white/10 backdrop-blur-lg shadow-lg rounded-lg z-10 flex flex-col justify-center items-center text-white border border-white/20">
        <h2 className="text-3xl font-semibold drop-shadow-md">{city}</h2>
      </div>
    </div>
  );
};

const Card = () => {
  const cities = ["Kandy", "Galle", "Jaffna"];
  return (
    <div className="flex justify-center items-center gap-10 py-10">
      {cities.map((city) => (
        <CityCard key={city} city={city} />
      ))}
    </div>
  );
};

export default Card;
