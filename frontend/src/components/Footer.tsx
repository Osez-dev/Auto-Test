import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from "react-icons/fa"; // Import social media icons

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-[#ecf0f1] py-10 mt-12 rounded-t-xl shadow-lg animate-fadeIn">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Auto Stream Section */}
        <div className="footer-section">
          <h4 className="text-[#0663B2] text-lg uppercase mb-4">Auto Stream</h4>
          <ul>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="footer-section">
          <h4 className="text-[#0663B2] text-lg uppercase mb-4">Services</h4>
          <ul>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="footer-section">
          <h4 className="text-[#0663B2] text-lg uppercase mb-4">About Us</h4>
          <ul>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
          </ul>
        </div>

        {/* Additional Company Section */}
        <div className="footer-section">
          <h4 className="text-[#0663B2] text-lg uppercase mb-4">Contact Us</h4>
          <ul>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">0707 554 555</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxxx</li>
            <li className="mb-3 hover:text-[#0663B2] hover:translate-x-2 transition-all">xxxxx</li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section">
          <h4 className="text-[#0663B2] text-lg uppercase mb-4">Follow Us</h4>
          <div className="flex flex-col gap-3">
            <a href="https://www.youtube.com/@autostream.official" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#ecf0f1] hover:text-[#0663B2] transform transition-all hover:scale-110">
              <FaYoutube size={24} />
              <span>YouTube</span>
            </a>
            <a href="https://www.facebook.com/www.autostream.lk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#ecf0f1] hover:text-[#0663B2] transform transition-all hover:scale-110">
              <FaFacebook size={24} />
              <span>Facebook</span>
            </a>
            <a href="https://linkedin.com/company/auto-stream" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#ecf0f1] hover:text-[#0663B2] transform transition-all hover:scale-110">
              <FaLinkedin size={24} />
              <span>LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/autostream.lk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#ecf0f1] hover:text-[#0663B2] transform transition-all hover:scale-110">
              <FaInstagram size={24} />
              <span>Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@autostream.lk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#ecf0f1] hover:text-[#0663B2] transform transition-all hover:scale-110">
              <FaTiktok size={24} />
              <span>TikTok</span>
            </a>
          </div>
        </div>
      </div>

      {/* Description and Copyright */}
      <div className="text-center mt-6 text-sm text-[#bdc3c7]">
        <p>
        “Trusted solution for a smart mobility experience"
        </p>
        <p>
          <a href="/terms-of-service" className="text-[#0663B2] hover:text-[#054a8a] hover:underline">Terms of Service</a> |{" "}
          <a href="/privacy-policy" className="text-[#0663B2] hover:text-[#054a8a] hover:underline">Privacy Policy</a> |{" "}
          <a href="/personal-data-protection" className="text-[#0663B2] hover:text-[#054a8a] hover:underline">Personal Data Protection Statement</a> |{" "}
          © 2024 AutoStream, Sri Lanka. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
