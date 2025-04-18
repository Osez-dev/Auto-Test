import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MapPin,
  Battery,
  MessageSquare,
  AlertCircle,
  Search,
  RefreshCw
} from 'lucide-react';
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import axios from "axios";


interface SolarRequest {
  Solar_id: number;
  FullName: string;
  PhoneNumber: string;
  City: string;
  Email: string;
  Usage: number;
  Message?: string;
  Status: "Pending" | "Approved" | "Rejected";
  createdAt?: string;
}

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
}

const AdminSolar: React.FC = () => {
  const [requests, setRequests] = useState<SolarRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.BASE_URL}/solar`);      
      setRequests(response.data as SolarRequest[]);
    } catch (error) {
      console.error("Error fetching solar requests:", error);
      showNotification('error', 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: "Approved" | "Rejected") => {
    try {
      setLoading(true);
      await axios.patch(`${process.env.BASE_URL}/solar/${id}`, { Status: status });
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.Solar_id === id ? { ...req, Status: status } : req
        )
      );
      
      showNotification('success', `Request ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error(`Error updating status:`, error);
      showNotification('error', 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter requests based on search term and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.City.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      selectedStatus === "all" || request.Status.toLowerCase() === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="status-icon approved" size={18} />;
      case "Rejected":
        return <XCircle className="status-icon rejected" size={18} />;
      default:
        return <Clock className="status-icon pending" size={18} />;
    }
  };

  return (
    <div className="admin-page-body">
    <div className="solar-dashboard">
      <Sidebar />
      <main className="solar-main">
        <AdminNavbar />
        
        <div className="solar-wrapper">
          <div className="solar-header">
            <h1 className="solar-title">Solar Installation Requests</h1>
            <button 
              className="solar-refresh-button"
              onClick={fetchRequests}
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'spin' : ''} />
              Refresh
            </button>
          </div>

          <div className="solar-filters">
            <div className="solar-search">
              <Search className="solar-search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="solar-search-input"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="solar-status-filter"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="solar-content">
            {loading ? (
              <div className="solar-loading">
                <RefreshCw className="spin" size={32} />
                <p>Loading requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="solar-empty">
                <AlertCircle size={48} />
                <p>No requests found</p>
              </div>
            ) : (
              <div className="solar-table-container">
                <table className="solar-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Location</th>
                      <th>Usage</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.Solar_id}>
                        <td>#{request.Solar_id}</td>
                        <td className="solar-customer-cell">
                          <User size={16} />
                          <div>
                            <span className="solar-customer-name">{request.FullName}</span>
                            <span className="solar-customer-email">{request.Email}</span>
                          </div>
                        </td>
                        <td>
                          <div className="solar-contact">
                            <Phone size={16} />
                            {request.PhoneNumber}
                          </div>
                        </td>
                        <td>
                          <div className="solar-location">
                            <MapPin size={16} />
                            {request.City}
                          </div>
                        </td>
                        <td>
                          <div className="solar-usage">
                            <Battery size={16} />
                            {request.Usage} kWh
                          </div>
                        </td>
                        <td>
                          <div className="solar-message">
                            <MessageSquare size={16} />
                            {request.Message || "No message"}
                          </div>
                        </td>
                        <td>
                          <div className={`solar-status solar-status-${request.Status.toLowerCase()}`}>
                            {getStatusIcon(request.Status)}
                            {request.Status}
                          </div>
                        </td>
                        <td>
                          {request.Status === "Pending" ? (
                            <div className="solar-actions">
                              <button
                                className="solar-approve-btn"
                                onClick={() => updateStatus(request.Solar_id, "Approved")}
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                              <button
                                className="solar-reject-btn"
                                onClick={() => updateStatus(request.Solar_id, "Rejected")}
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="solar-action-taken">Action Taken</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {notification && (
        <div className={`solar-notification solar-notification-${notification.type}`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {notification.message}
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminSolar;