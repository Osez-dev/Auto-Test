import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import { FaUserCheck, FaBed, FaCalendarCheck, FaCalendarTimes, FaChartBar, FaGlobe } from "react-icons/fa";

const Hotel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Hotel", "Rooms", "Reservations", "Customers"];

  const hotels = [
    { id: 1, name: "Hotel A", location: "City A", description: "Luxury hotel", rating: 4.5, contactEmail: "hotelA@example.com", contactPhone: "123-456-789" },
    { id: 2, name: "Hotel B", location: "City B", description: "Budget-friendly", rating: 4.0, contactEmail: "hotelB@example.com", contactPhone: "987-654-321" },
    { id: 3, name: "Hotel C", location: "City C", description: "Boutique hotel", rating: 4.8, contactEmail: "hotelC@example.com", contactPhone: "555-123-456" },
    { id: 4, name: "Hotel D", location: "City D", description: "Family-friendly", rating: 4.2, contactEmail: "hotelD@example.com", contactPhone: "888-555-666" },
  ];

  const handleEdit = (id: number) => {
    alert(`Edit clicked for Hotel ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`Are you sure you want to delete Hotel ID: ${id}?`)) {
      alert(`Delete confirmed for Hotel ID: ${id}`);
    }
  };

  const renderOverview = () => {
    return (
      <div className="overview-content">
        <div className="modern-card">
          <FaUserCheck className="icon" />
          <h3>New Booking</h3>
        </div>
        <div className="modern-card">
          <FaBed className="icon" />
          <h3>Available Room</h3>
        </div>
        <div className="modern-card">
          <FaCalendarCheck className="icon" />
          <h3>Check In</h3>
        </div>
        <div className="modern-card">
          <FaCalendarTimes className="icon" />
          <h3>Check Out</h3>
        </div>
        <div className="large-modern-card">
          <FaChartBar className="icon" />
          <h3>Reservation Stats</h3>
        </div>
        <div className="large-modern-card">
          <FaGlobe className="icon" />
          <h3>Customer by Country</h3>
        </div>
      </div>
    );
  };

  const renderHotelTable = () => {
    return (
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Hotel ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
              <th>Rating</th>
              <th>Contact Email</th>
              <th>Contact Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.id}</td>
                <td>{hotel.name}</td>
                <td>{hotel.location}</td>
                <td>{hotel.description}</td>
                <td>{hotel.rating}</td>
                <td>{hotel.contactEmail}</td>
                <td>{hotel.contactPhone}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(hotel.id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(hotel.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return renderOverview();
      case "Hotel":
        return renderHotelTable();
      default:
        return <div>No content available for this tab.</div>;
    }
  };

  return (
    <div className="hotel-page">
      <Sidebar />
      <div className="hotel-content">
        <AdminNavbar />
        <div className="hotel-header">
          <h1>Hotel</h1>
          <div className="hotel-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="hotel-body">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Hotel;
