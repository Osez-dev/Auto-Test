import  { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      verifyEmail(token);
    } else {
      setMessage('Invalid or missing token.');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage('Email verification failed. The link may be expired or invalid.');
    }
  };

  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
