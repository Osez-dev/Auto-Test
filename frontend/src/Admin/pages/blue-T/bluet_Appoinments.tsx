import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import Sidebar from '../../Components/Sidebar/Sidebar';

interface Appointment {
  id: number;
  userId: string;
  name: string;
  email: string;
  telephone: string;
  city: string;
  type: 'Blue-T' | 'Value-My-Car';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const BluetAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'Blue-T' | 'Value-My-Car'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/appointments');
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await axios.put(`http://localhost:3000/appointments/${id}/status`, { status: newStatus });
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const typeMatch = filter === 'all' || appointment.type === filter;
    const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;
    return typeMatch && statusMatch;
  });

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (


    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Appointment Requests</h1>
      <AdminNavbar />
      <Sidebar />
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select 
          className="border rounded p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'Blue-T' | 'Value-My-Car')}
        >
          <option value="all">All Types</option>
          <option value="Blue-T">Blue-T</option>
          <option value="Value-My-Car">Value-My-Car</option>
        </select>
        
        <select 
          className="border rounded p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{appointment.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${appointment.type === 'Blue-T' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {appointment.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{appointment.email}</div>
                  <div className="text-sm text-gray-500">{appointment.telephone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(appointment.createdAt), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      appointment.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'approved')}
                      className={`px-3 py-1 text-xs rounded ${
                        appointment.status === 'approved'
                          ? 'bg-green-200 text-green-800 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      disabled={appointment.status === 'approved'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'rejected')}
                      className={`px-3 py-1 text-xs rounded ${
                        appointment.status === 'rejected'
                          ? 'bg-red-200 text-red-800 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                      disabled={appointment.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BluetAppointments;
