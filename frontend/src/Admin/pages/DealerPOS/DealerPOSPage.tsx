import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCar, FaUsers, FaFileInvoice, FaHome } from 'react-icons/fa';
import { UsersService } from '../../../services/UsersService';
import { getListingsByUserId } from '../../../services/listingService';

const DealerPOSPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('listings');
  const [dealerInfo, setDealerInfo] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [customers] = useState<any[]>([]);
  const [invoices] = useState<any[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchDealerData = async () => {
      try {
        if (!id) {
          console.error("No dealer ID provided");
          navigate("/dealer-pos");
          return;
        }

        const dealerData = await UsersService.getUserById(parseInt(id));
        setDealerInfo(dealerData);

        const listingsData = await getListingsByUserId(parseInt(id));
        setListings(listingsData);

        // TODO: Fetch customers and invoices data
        // const customersData = await fetchCustomers(parseInt(id));
        // setCustomers(customersData);
        // const invoicesData = await fetchInvoices(parseInt(id));
        // setInvoices(invoicesData);
      } catch (error) {
        console.error("Failed to fetch dealer data:", error);
        navigate("/dealer-pos");
      }
    };

    fetchDealerData();
  }, [id, navigate]);

  const DealerSidebar = () => (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Dealer POS</h2>
        {dealerInfo && (
          <p className="text-sm text-gray-600 mb-6">
            {dealerInfo.firstName} {dealerInfo.lastName}
          </p>
        )}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection('listings')}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeSection === 'listings' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCar className="text-lg" />
            <span>Listings ({listings.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('customers')}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeSection === 'customers' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaUsers className="text-lg" />
            <span>Customers ({customers.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('invoices')}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeSection === 'invoices' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaFileInvoice className="text-lg" />
            <span>Invoices ({invoices.length})</span>
          </button>
          <button
            onClick={() => navigate('/dealer-pos')}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 mt-4"
          >
            <FaHome className="text-lg" />
            <span>Back to Dealers</span>
          </button>
        </nav>
      </div>
    </div>
  );

  const ListingsSection = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vehicle Listings</h2>
      <div className="bg-white rounded-lg shadow p-4">
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{listing.title}</h3>
                <p className="text-gray-600">Price: ${listing.price}</p>
                <p className="text-gray-600">Year: {listing.yearofmanufacture}</p>
                <p className="text-gray-600">Mileage: {listing.mileage} km</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No listings found for this dealer</p>
        )}
      </div>
    </div>
  );

  const CustomersSection = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="bg-white rounded-lg shadow p-4">
        {customers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{customer.name}</h3>
                <p className="text-gray-600">Email: {customer.email}</p>
                <p className="text-gray-600">Phone: {customer.phone}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No customers found for this dealer</p>
        )}
      </div>
    </div>
  );

  const InvoicesSection = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      <div className="bg-white rounded-lg shadow p-4">
        {invoices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">Invoice #{invoice.id}</h3>
                <p className="text-gray-600">Amount: ${invoice.amount}</p>
                <p className="text-gray-600">Date: {new Date(invoice.date).toLocaleDateString()}</p>
                <p className="text-gray-600">Status: {invoice.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No invoices found for this dealer</p>
        )}
      </div>
    </div>
  );

  if (!dealerInfo) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DealerSidebar />
      <div className="flex-1 ml-64">
        <div className="p-6">
          {activeSection === 'listings' && <ListingsSection />}
          {activeSection === 'customers' && <CustomersSection />}
          {activeSection === 'invoices' && <InvoicesSection />}
        </div>
      </div>
    </div>
  );
};

export default DealerPOSPage; 