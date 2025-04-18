import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await authService.resetPassword(token, newPassword);
      setMessage('Password reset successfully. You can now log in.');
    } catch (err: any) {
      console.error('Reset Password Error:', err.response?.data?.message || err.message);
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-20 bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://img.freepik.com/free-vector/car-led-lights-realistic-composition-with-view-night-road-silhouettes-automobile-traffic-lights-illustration_1284-28531.jpg?t=st=1739940929~exp=1739944529~hmac=2a110b1d798bf60544639ab3594bf9014040bb6aae2cf1c76f3c92b21998d845&w=996")',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-0"></div>

      {/* Reset Password Container */}
      <div className="relative z-10 max-w-md w-full p-10 bg-white bg-opacity-60 backdrop-blur-lg rounded-xl shadow-xl border border-white border-opacity-20">
        <h2 className="text-2xl font-bold text-black mb-5">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            className="p-4 mb-3 border border-gray-300 rounded-xl bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="p-4 mb-3 border border-gray-300 rounded-xl bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-3 mt-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
            Reset Password
          </button>
        </form>

        {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <div className="mt-5 text-sm">
          <a href="/login" className="text-blue-500 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;