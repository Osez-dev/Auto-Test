import React, { FormEvent, useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import authService from '../../services/authService';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import car from "../../assets/images/login-modal-image.png";

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [registerDetails, setRegisterDetails] = useState({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
    });
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const authContext = useAuth();
    if (!authContext) {
        setError('Authentication context is not available');
        return null;
    }

    const { login, googleLogin, facebookLogin } = authContext;

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
                        ? new Date().getTime() + 14 * 24 * 60 * 60 * 1000
                        : new Date().getTime() + 1 * 60 * 60 * 1000,
                };
                rememberMe ? sessionStorage.setItem('userSession', JSON.stringify(userData)) : sessionStorage.setItem('userSession', JSON.stringify(userData));
                onClose();
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
            alert('Registration successful! A verification email has been sent.');
            setIsLogin(true);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error registering. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex bg-white rounded-lg overflow-hidden max-w-3xl shadow-lg w-full">
                <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${car})` }}></div>
                <div className="w-full md:w-1/2 p-8 flex flex-col items-center relative bg-gray-200">
                    <button className="absolute top-2 right-4 text-sm text-gray-600 hover:text-blue-600" onClick={onClose}>Back to website →</button>
                    <h2 className="text-xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {isLogin ? (
                        <form onSubmit={handleLogin} className="w-full max-w-xs">
                            <input className="w-full p-2 border rounded-md mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input className="w-full p-2 border rounded-md mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div className="flex justify-between items-center mb-4 text-sm">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                    <span>Remember Me</span>
                                </label>
                                <a href="/forgot-password" className="text-blue-600">Forgot Password?</a>
                            </div>
                            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">Login</button>
                            <p className="text-sm mt-3">Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setIsLogin(false)}>Register here</span></p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="w-full max-w-xs">
                            <div className="flex gap-2 mb-2">
                                <input className="w-1/2 p-2 border rounded-md" name="firstName" placeholder="First Name" value={registerDetails.firstName} onChange={(e) => setRegisterDetails({ ...registerDetails, firstName: e.target.value })} required />
                                <input className="w-1/2 p-2 border rounded-md" name="lastName" placeholder="Last Name" value={registerDetails.lastName} onChange={(e) => setRegisterDetails({ ...registerDetails, lastName: e.target.value })} required />
                            </div>
                            <input className="w-full p-2 border rounded-md mb-2" type="email" name="email" placeholder="Email" value={registerDetails.email} onChange={(e) => setRegisterDetails({ ...registerDetails, email: e.target.value })} required />
                            <input className="w-full p-2 border rounded-md mb-2" name="phoneNumber" placeholder="Phone Number" value={registerDetails.phoneNumber} onChange={(e) => setRegisterDetails({ ...registerDetails, phoneNumber: e.target.value })} required />
                            <input className="w-full p-2 border rounded-md mb-4" type="password" name="password" placeholder="Password" value={registerDetails.password} onChange={(e) => setRegisterDetails({ ...registerDetails, password: e.target.value })} required />
                            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">Register</button>
                            <p className="text-sm mt-3">Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setIsLogin(true)}>Login here</span></p>
                        </form>
                    )}
                    <div className="flex items-center w-full my-4">
                        <hr className="flex-grow border-gray-400" />
                        <span className="px-2 text-gray-600 text-sm">Or</span>
                        <hr className="flex-grow border-gray-400" />
                    </div>
                    <div className="flex space-x-3">
                        <button className="flex items-center gap-2 bg-gray-300 py-2 px-4 rounded-md text-sm" onClick={googleLogin}><FaGoogle /> Google</button>
                        <button className="flex items-center gap-2 bg-gray-300 py-2 px-4 rounded-md text-sm" onClick={facebookLogin}><FaFacebook /> Facebook</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
