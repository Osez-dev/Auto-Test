import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./Pages/Login";
import Profile from "./components/Profile";
import Admin from "./Admin/Admin";
import './index.css';

import Home from "./Pages/Home";
import { useAuth } from "./services/AuthContext";

import Users from "./Admin/pages/Users/users";
import PostAd from "./Pages/PostAd/PostAd";
import ListingDetails from "./components/ListingCard/ListingDetails";
import Inventory from "./Pages/Inventory/Vehicles";
import SpareParts from "./Pages/SpareParts/spareParts";
import Adminpart from "./Admin/pages/Parts/Adminpart";
import Reviews from "./Admin/pages/Reviews/reviews";
import AdminSolar from "./Admin/pages/Solar/adminsolar";
import Media from "./Admin/pages/Media/media";
import News from "./Admin/pages/News/adminNews";
import SocialMedia from "./Admin/pages/SocialMedia/socialMedia";
import Contacts from "./Admin/pages/Contacts/contacts";
import ValueMyCar from "./Admin/pages/ValueMyCar/mycar";
import Subscription from "./Admin/pages/Subscription/subscription";
import DealerPOS from "./Admin/pages/DealerPOS/dealerPOS";
import Hotel from "./Admin/pages/Hotel/hotel";
import Transaction from "./Admin/pages/Transactions/transaction";
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import ListingPage from "./Admin/pages/Listing/ListingPage";
import EditListing from "./Admin/pages/Listing/EditListing";
import SellMyCar from "./Pages/SellMyCar/SellMyCar";
import BlueT from "./Pages/Blue-T/BlueT";
import LoanCalculator from "./Admin/pages/LoanCalculator/LoanCalculator";
import AutoNews from "./Pages/News/news";
import NewsDetail from "./Pages/News/NewsDetail";
import Consignment from "./Pages/SellMyCar/Consignment";
import Quicksell from "./Pages/SellMyCar/Quicksell";
import DealerPOSPage from "./Admin/pages/DealerPOS/DealerPOSPage";
import DealerDetails from "./Admin/pages/DealerPOS/dealer_details";
// import insurance from "./Pages/Insurance/insurance";


import './index.css';
import BluetAppointments from "./Admin/pages/blue-T/bluet_Appoinments";
import Insurance from "./Pages/Insurance/Insurance";
// import FloatingChatIcon from "./components/floating-chat/floating-chat";
// import Upgrade from "./Pages/upgrade/upgrade";

const App = () => {
  const authContext = useAuth();
  const user = authContext ? authContext.user : null;

  return (
    <><Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users" element={<Users />} />
      <Route path="/media" element={<Media />} />
      <Route path="/post-ad" element={<PostAd />} />
      {/* <Route path="/upgrade" element={<Upgrade/>} /> */}
      <Route path="/consignment" element={<Consignment />} />
      <Route path="/quicksell" element={<Quicksell />} />
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route path="/edit-listing/:id" element={<EditListing />} />
      <Route path="/Inventory" element={<Inventory />} />
      <Route path="/parts" element={<SpareParts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/adminNews" element={<News />} />
      <Route path="/auto-news" element={<AutoNews />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/social-media" element={<SocialMedia />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/value-my-car" element={<ValueMyCar />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/dealer-pos" element={<DealerPOS />} />
      <Route path="/dealer-pos/:id" element={<DealerPOSPage />} />
      <Route path="/dealer-details/:id" element={<DealerDetails />} />
      <Route path="/sell-my-car" element={<SellMyCar />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/blue-t" element={<BlueT />} />
      <Route path="/loan-calculator" element={<LoanCalculator />} />
      <Route path="/Insurance" element={<Insurance />} />

      {/* Protected Routes */}
      <Route 
        path="/admin" 
        element={user?.role === 'admin' || user?.role === 'Shop_manager' || user?.role === 'Manager' ? <Admin /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/customer" 
        element={user?.role === 'customer' ? <Home/> : <Navigate to="/login" />} 
      />
      <Route 
        path="/adminparts" 
        element={user?.role === 'admin' ? <Adminpart /> : <Navigate to="/login" />}
      />
      <Route 
        path="/adminsolar" 
        element={user?.role === 'admin' ? <AdminSolar /> : <Navigate to="/login" />}
      />
      <Route 
        path="/hotel-tourism" 
        element={user?.role === 'admin' ? <Hotel /> : <Navigate to="/login" />}
      />
      <Route 
        path="/listing" 
        element={user?.role === 'admin' || user?.role === 'Shop_manager' ? <ListingPage /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/transaction" 
        element={user?.role === 'admin' ? <Transaction /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/users" 
        element={user?.role === 'admin' || user?.role === 'Shop_manager' ? <Users /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/media" 
        element={user?.role === 'admin' ? <Media /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/adminnews" 
        element={user?.role === 'admin' || user?.role === 'news_manager' ? <News /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/reviews" 
        element={user?.role === 'admin' ? <Reviews /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/social-media" 
        element={user?.role === 'admin' ? <SocialMedia /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/contacts" 
        element={user?.role === 'admin' ? <Contacts /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/value-my-car" 
        element={user?.role === 'admin' ? <ValueMyCar /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/subscription" 
        element={user?.role === 'admin' ? <Subscription /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/dealer-pos" 
        element={user?.role === 'admin' ? <DealerPOS /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/loan-calculator" 
        element={user?.role === 'admin' ? <LoanCalculator /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/blue-t-request" 
        element={user?.role === 'admin' ? <BluetAppointments /> : <Navigate to="/login" />} 
      />

    </Routes>
    {/* <FloatingChatIcon /> */}
    </>
  );
};

export default App;
