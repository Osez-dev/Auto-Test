import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
import authService from '../services/authService';
// import './ForgetPassword.css';
// import Footer from '../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await authService.forgotPassword(email);
      setMessage('A password reset link has been sent to your email.');
    } catch (err: any) {
      console.error('Forgot Password Error:', err.response?.data?.message || err.message);
      setError('Failed to send reset email. Please enter a registered email.');
    }
  };
// dfdf
  return (
    <div className="relative flex flex-col items-center min-h-screen py-20 bg-cover bg-center"
    style={{
      backgroundImage: 'url("https://img.freepik.com/free-vector/car-led-lights-realistic-composition-with-view-night-road-silhouettes-automobile-traffic-lights-illustration_1284-28531.jpg?t=st=1739940929~exp=1739944529~hmac=2a110b1d798bf60544639ab3594bf9014040bb6aae2cf1c76f3c92b21998d845&w=996")',
    }}
  >
    {/* Background Overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-0"></div>

    {/* Forgot Password Container */}
    <div className="relative z-10 bg-white bg-opacity-60 backdrop-blur-lg rounded-xl p-10 max-w-md w-full text-center shadow-xl border border-white border-opacity-20">
      <h2 className="text-2xl font-bold text-blue-900 mb-5">Reset Your Password</h2>
      <p className="text-base text-gray-800 mb-6">Enter your email address below and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          className="p-4 mb-3 border border-gray-300 rounded-xl bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="w-full py-3 mt-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">Send Reset Link</button>
      </form>

      {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  </div>
    
  );
};

export default ForgotPassword;
