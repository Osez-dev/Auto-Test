import React, { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import authService from '../services/authService';
// import './Login.css';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Importing Google and Facebook icons
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [registerDetails, setRegisterDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const authContext = useAuth();

  if (!authContext) {
    setError('Authentication context is not available');
    return null;
  }

  const { login, googleLogin, facebookLogin } = authContext;

  useEffect(() => {
    const savedUser = sessionStorage.getItem('userSession');
    
    if (savedUser) {
      try {
        // Check if it's a Google login attempt
        if (savedUser === 'google') {
          // Handle Google login flow
          return;
        }
        
        // Otherwise, try to parse as JSON
        const userData = JSON.parse(savedUser);
        const { email, role, expiry } = userData;

        if (new Date().getTime() > expiry) {
          sessionStorage.removeItem('userSession');
        } else {
          setEmail(email);
          navigate(role === 'customer' ? '/customer' : '/admin');
        }
      } catch (error) {
        console.error('Error parsing user session:', error);
        sessionStorage.removeItem('userSession');
      }
    }
  }, [navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        const response = await login({ email, password });

        if (response?.profile?.role) {
            const userData = {
                email,
                role: response.profile.role,
                token: response.token,
                expiry: rememberMe 
                    ? new Date().getTime() + 14 * 24 * 60 * 60 * 1000  // 14 days expiry
                    : new Date().getTime() + 1 * 60 * 60 * 1000, // 1 hour expiry
            };

            if (rememberMe) {
              sessionStorage.setItem('userSession', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('userSession', JSON.stringify(userData));
            }

            navigate(response.profile.role === 'customer' ? '/customer' : '/admin');
        } else {
            setError('Invalid user role.');
        }
    } catch (err) {
        setError('Invalid email or password');
    }
};

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authService.register(registerDetails);
      alert('Registration successful! A verification email has been sent. Please check your inbox.');
      setIsLogin(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error registering. Please try again.');
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterDetails({ ...registerDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const token = url.get('token');
  
    if (token) {
      authService.verifyEmail(token)
        .then(() => {
          alert('Email verified successfully! You can now log in.');
          navigate('/login');
        })
        .catch(() => {
          alert('Invalid or expired verification link.');
        });
    }
  }, []);
  return (
    
    <>
      <Navbar />
      <div className="relative flex flex-col items-center min-h-screen py-20 bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://img.freepik.com/free-vector/car-led-lights-realistic-composition-with-view-night-road-silhouettes-automobile-traffic-lights-illustration_1284-28531.jpg?t=st=1739940929~exp=1739944529~hmac=2a110b1d798bf60544639ab3594bf9014040bb6aae2cf1c76f3c92b21998d845&w=996")',
      }}
    >

<div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 bg-white bg-opacity-60 p-10 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-5">{isLogin ? "Login" : "Register"}</h2>
        {error && <p className="text-red-500">{error}</p>}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input
              className="w-full p-4 mb-3 border border-gray-300 rounded-lg bg-gray-100 text-base"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full p-4 mb-3 border border-gray-300 rounded-lg bg-gray-100 text-base"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-gray-600">Remember Me</label>
            </div>
            <p>
              <a href="/forgot-password" className="text-blue-500 hover:text-blue-700">Forgot Password?</a>
            </p>
            <button
              className="w-full py-3 mt-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              type="submit"
            >
              Login
            </button>
            <p className="mt-5 text-gray-600">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => setIsLogin(false)}
              >
                Register here
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              className="w-full p-4 mb-3 border border-gray-300 rounded-lg bg-gray-100 text-base"
              name="firstName"
              placeholder="First Name"
              value={registerDetails.firstName}
              onChange={handleRegisterChange}
              required
            />
            <input
              className="w-full p-4 mb-3 border border-gray-300 rounded-lg bg-gray-100 text-base"
              name="lastName"
              placeholder="Last Name"
              value={registerDetails.lastName}
              onChange={handleRegisterChange}
              required
            />
            <input
              className="w-full p-4 mb-3 border border-gray-300 rounded-lg bg-gray-100 text-base"
              type="email"
              name="email"
              placeholder="Email"
              value={registerDetails.email}
              onChange={handleRegisterChange}
              required
            />
            <input
              className="w-full p-4 mb-3 border border-gray-300 rounded-lg bg-gray-100 text-base"
              name="phoneNumber"
              placeholder="Phone Number"
              value={registerDetails.phoneNumber}
              onChange={handleRegisterChange}
              required
            />
            <input
              className="w-full p-4 mb-3 border border-gray-300 rounded-lg bg-gray-100 text-base"
              type="password"
              name="password"
              placeholder="Password"
              value={registerDetails.password}
              onChange={handleRegisterChange}
              required
            />
            <button
              className="w-full py-3 mt-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              type="submit"
            >
              Register
            </button>
            <p className="mt-5 text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => setIsLogin(true)}
              >
                Login here
              </span>
            </p>
          </form>
        )}

        <button
          className="w-full py-3 mt-5 bg-white text-blue-500 border border-blue-500 rounded-lg flex items-center justify-center gap-3 hover:bg-blue-50 transition"
          onClick={googleLogin}
        >
          <FaGoogle className="text-xl" />
          Sign in with Google
        </button>
        <button
          className="w-full py-3 mt-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition"
          onClick={facebookLogin}
        >
          <FaFacebook className="text-xl" />
          Sign in with Facebook
        </button>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default Login;
