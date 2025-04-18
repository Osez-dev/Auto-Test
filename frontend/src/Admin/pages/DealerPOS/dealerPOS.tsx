import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaUserPlus } from 'react-icons/fa';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';

const API_URL = `${import.meta.env.VITE_BASE_URL}/users`;

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAddUser = async () => {
    const firstName = prompt('Enter First Name:');
    const lastName = prompt('Enter Last Name:');
    const email = prompt('Enter Email:');
    const phoneNumber = prompt('Enter Phone Number:');
    const role = prompt('Enter Role (e.g., Customer, Admin, Moderator):') || 'Customer';

    if (!firstName || !lastName || !email || !phoneNumber) {
      alert('All fields are required!');
      return;
    }

    const newUser = { firstName, lastName, email, phoneNumber, role };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        fetchData();
        alert('User added successfully!');
      } else {
        alert('Failed to add user.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user. Please try again.');
    }
  };

  const handleEdit = (user: any) => {
    const updatedUser = {
      firstName: prompt('Edit First Name:', user.firstName) || user.firstName,
      lastName: prompt('Edit Last Name:', user.lastName) || user.lastName,
      email: prompt('Edit Email:', user.email) || user.email,
      phoneNumber: prompt('Edit Phone Number:', user.phoneNumber) || user.phoneNumber,
      role: prompt('Edit Role:', user.role) || user.role,
    };

    fetch(`${API_URL}/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    })
      .then((response: Response) => {
        if (response.ok) {
          fetchData();
        }
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  const handleDelete = (userId: number) => {
    fetch(`${API_URL}/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setUsers((prevUsers) => prevUsers.filter((user: any) => user.id !== userId));
        }
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const filteredUsers = users
    .filter((user: any) => user.role === "dealer")
    .filter((user: any) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed w-64">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="fixed top-0 right-0 left-64 z-10">
          <AdminNavbar />
        </div>
        <div className="mt-16 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dealers List</h1>
            
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleAddUser}
              >
                <FaUserPlus className="mr-2" /> Add New Dealer
              </button>
              
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search By Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Sort By:</span>
                <span className="text-blue-600 font-medium">Latest</span>
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role || 'Customer'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button 
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            onClick={() => navigate(`/dealer-details/${user.id}`)}
                          >
                            View
                          </button>
                          <button 
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button 
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
