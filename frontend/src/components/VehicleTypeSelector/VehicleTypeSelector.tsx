import React from 'react';
import car from "../../assets/vehicleTypeSelectorIcons/sports-car-icon.svg";
import pickup from "../../assets/vehicleTypeSelectorIcons/pickup.svg";
import Vab from "../../assets/vehicleTypeSelectorIcons/van-svgrepo-com.svg";
import bus from "../../assets/vehicleTypeSelectorIcons/b0de5f11b1679980c2083c5143e0472c.svg";
import commercial from "../../assets/vehicleTypeSelectorIcons/pickup-truck-icon.svg";

const VehicleSelector: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-44">
      {/* Vehicle Buttons */}
      <div className="flex space-x-3">
        <button className="bg-transparent border-none cursor-pointer p-2 transition-transform duration-300 hover:scale-110">
          <img src={car} alt="Car" className="w-24 h-auto" />
        </button>
        <button className="bg-transparent border-none cursor-pointer p-2 transition-transform duration-300 hover:scale-110">
          <img src={Vab} alt="Van" className="w-24 h-auto" />
        </button>
        <button className="bg-transparent border-none cursor-pointer p-2 transition-transform duration-300 hover:scale-110">
          <img src={pickup} alt="Pickup" className="w-24 h-auto" />
        </button>
        <button className="bg-transparent border-none cursor-pointer p-2 transition-transform duration-300 hover:scale-110">
          <img src={bus} alt="Bus" className="w-24 h-auto" />
        </button>
        <button className="bg-transparent border-none cursor-pointer p-2 transition-transform duration-300 hover:scale-110">
          <img src={commercial} alt="Commercial" className="w-24 h-auto" />
        </button>
      </div>

      {/* Vehicle Labels */}
      <div className="flex justify-between gap-16 mt-[-30px] w-full px-8">
        <label className="text-sm font-semibold">Cars</label>
        <label className="text-sm font-semibold">Van</label>
        <label className="text-sm font-semibold">Pickup</label>
        <label className="text-sm font-semibold">Bus</label>
        <label className="text-sm font-semibold">Commercial</label>
      </div>
    </div>
  );
};

export default VehicleSelector;
