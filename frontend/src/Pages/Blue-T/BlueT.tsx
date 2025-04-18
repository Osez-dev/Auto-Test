import  { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Container from '../../components/Container/Container'
import Footer from '../../components/Footer'
import axios from 'axios'
import { useAuth } from '../../services/AuthContext'

interface Request {
  id: number;
  userId: number;
  name: string;
  email: string;
  telephone: string;
  city: string;
  type: 'Blue-T' | 'Value-My-Car';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const BlueT = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/appointments');
      // Filter requests to show only those belonging to the current user
      const userRequests = response.data.filter((request: Request) => request.userId === user?.id);
      setRequests(userRequests);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch requests');
      setLoading(false);
    }
  };

  return (
    <div>
        <Navbar />
        <Container>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Your Requests</h2>
              {!user ? (
                <div className="text-center text-gray-500">Please log in to view your requests</div>
              ) : loading ? (
                <div className="text-center">Loading requests...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : requests.length === 0 ? (
                <div className="text-center text-gray-500">No requests found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {requests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${request.type === 'Blue-T' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {request.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{request.name}</div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                            <div className="text-sm text-gray-500">{request.telephone}</div>
                            <div className="text-sm text-gray-500">{request.city}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
        </Container>
        <Footer />
    </div>
  )
}

export default BlueT