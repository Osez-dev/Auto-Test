import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { FaSearch, FaFilter, FaSave } from 'react-icons/fa';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
// import { userService } from '../../../services/userService';
import { showNotification } from '../../../services/notificationService';

const API_URL = `${import.meta.env.VITE_BASE_URL}/users`;
const ROLES = [
  'admin',
  'Dealer',
  'Dealer(admin)',
  'Dealer(Cashier)',
  'Customer',
  'Manager',
  'Blue-T_Head',
  'Valuatiaon_head',
  'Subscription_Management',
  'news_manager',
  'Insurance_Manager',
  'Leasing_Management',
  'Call_Center',
  'Shop_manager',
  'Ad_Manager'
];

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
    // Fetch current user data
    fetchCurrentUser();
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

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/me`);
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleEdit = (user: User) => {
    if (!user || !user._id) {
      alert('Invalid user data');
      return;
    }
    const userId = user._id;
    if (isNaN(parseInt(userId))) {
      alert('Invalid user ID');
      return;
    }
    setEditingUser({ ...user, _id: userId });
  };

  const handleUpdate = async (user: User) => {
    try {
      if (!user || !user._id) {
        alert('Invalid user data');
        return;
      }
      const userId = parseInt(user._id);
      if (isNaN(userId)) {
        alert('Invalid user ID');
        return;
      }
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName: user.name,
          lastName: user.name.split(' ').slice(-1)[0],
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role
        }),
      });
      if (response.ok) {
        await fetchData();
        setEditingUser(null);
        alert('User updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDelete = async (userId: string) => {
    try {
      // await userService.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      showNotification('User deleted successfully');
    } catch (error) {
      showNotification('Error deleting user');
    }
  };

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="m-0 font-['Inter'] bg-[#F3F4F6] text-[#333] ml-[195px] mt-[100px] justify-start">
      <div className="flex w-full min-h-screen justify-start mt-[-40px] ml-[1px]">
        <Sidebar />
        <div className="ml-[80px] w-full px-5 py-3">
          <AdminNavbar />
          <h1 className="text-2xl font-bold text-[#333] mb-5">User Management</h1>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center bg-gray-400 py-2 px-4 rounded-md border border-black">
              <FaSearch className="text-black mr-2" />
              <input
                type="text"
                placeholder="Search By Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-black text-base"
              />
            </div>
            <div className="flex items-center text-base">
              <span className="mr-2">Sort By:</span>
              <span className="text-red-600 font-bold cursor-pointer">Latest</span>
              <FaFilter className="ml-2 cursor-pointer" />
            </div>
          </div>
          <table className="w-full table-auto bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="bg-[#E9ECEF] text-left text-sm font-semibold">
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Last Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: User) => (
                <tr key={user._id} className="border-b border-[#ddd]">
                  <td className="py-3 px-4">
                    {editingUser?._id === user._id ? (
                      <input
                        type="text"
                        value={editingUser.name.split(' ')[0]}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      user.name.split(' ')[0]
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingUser?._id === user._id ? (
                      <input
                        type="text"
                        value={editingUser.name.split(' ').slice(-1)[0]}
                        onChange={(e) => setEditingUser({ ...editingUser, name: editingUser.name.split(' ').slice(0, -1).join(' ') + ' ' + e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      user.name.split(' ').slice(-1)[0]
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingUser?._id === user._id ? (
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setEditingUser({ ...user, email: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingUser?._id === user._id ? (
                      <input
                        type="text"
                        value={user.phoneNumber}
                        onChange={(e) => setEditingUser({ ...user, phoneNumber: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      user.phoneNumber
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingUser?._id === user._id ? (
                      <select
                        value={editingUser.role || 'Customer'}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="border rounded px-2 py-1"
                        disabled={currentUser?._id === user._id}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    ) : (
                      user.role || 'Customer'
                    )}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {editingUser?._id === user._id ? (
                      <>
                        <button
                          className="bg-green-500 text-white py-1 px-3 rounded-md text-sm cursor-pointer hover:bg-green-600 transition duration-300"
                          onClick={() => handleUpdate(user)}
                        >
                          <FaSave className="inline mr-1" />
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white py-1 px-3 rounded-md text-sm cursor-pointer hover:bg-gray-600 transition duration-300"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm cursor-pointer hover:bg-blue-600 transition duration-300"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded-md text-sm cursor-pointer hover:bg-red-600 transition duration-300"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;