import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
// import "./mycar.css";

interface Car {
  car: string;
  details: string;
  image: string;
  action: string;
}

const ValueMyCar: React.FC = () => {
  const [cars] = useState<Car[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCars = cars.filter((car) =>
    car.car.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
    <div className="flex mt-[-40px] ml-[-200px]">
  <Sidebar />
  <div className="flex-1 p-5 justify-start ml-[200px]">
    <AdminNavbar />
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-semibold text-[#1e293b]">Value My Car</h1>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-[#ddd] rounded-md"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border border-[#ddd] rounded-md"
        >
          <option value="All">All</option>
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
        </select>
      </div>
    </div>
    <div className="mt-5">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-[#ddd] p-2 text-left bg-[#f4f4f4]">Car</th>
            <th className="border border-[#ddd] p-2 text-left bg-[#f4f4f4]">Details</th>
            <th className="border border-[#ddd] p-2 text-left bg-[#f4f4f4]">Images</th>
            <th className="border border-[#ddd] p-2 text-left bg-[#f4f4f4]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCars.map((car, index) => (
            <tr key={index}>
              <td className="border border-[#ddd] p-2">{car.car}</td>
              <td className="border border-[#ddd] p-2">{car.details}</td>
              <td className="border border-[#ddd] p-2">{car.image}</td>
              <td className="border border-[#ddd] p-2">{car.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>
  );
};

export default ValueMyCar;
