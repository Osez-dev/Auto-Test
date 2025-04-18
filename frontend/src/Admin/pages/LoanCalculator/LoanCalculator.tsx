import React, { useState, useEffect } from 'react';
// import './LoanCalculator.css';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { loanCalculatorService } from '../../../services/loanCalculatorService';
import { LeasingCompany } from '../../../services/loanCalculatorService';

const LoanCalculator: React.FC = () => {
  const [companies, setCompanies] = useState<LeasingCompany[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<LeasingCompany>>({
    companyName: '',
    interestRate: 0,
    termInMonths: 0,
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await loanCalculatorService.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      alert('Failed to fetch companies. Please try again.');
    }
  };

  const handleOpen = (company?: LeasingCompany) => {
    if (company) {
      setEditMode(true);
      setFormData({
        id: company.id,
        companyName: company.companyName,
        interestRate: company.interestRate,
        termInMonths: company.termInMonths,
      });
    } else {
      setEditMode(false);
      setFormData({
        companyName: '',
        interestRate: 0,
        termInMonths: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setFormData({
      companyName: '',
      interestRate: 0,
      termInMonths: 0,
    });
  };

  const handleDelete = async (id: number, companyName: string) => {
    if (window.confirm(`Are you sure you want to delete ${companyName}?`)) {
      try {
        await loanCalculatorService.deleteCompany(id);
        await fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Failed to delete company. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.companyName?.trim()) {
        alert('Company name is required');
        return;
      }

      // Convert and validate interest rate
      const interestRate = Number(formData.interestRate);
      if (isNaN(interestRate) || interestRate < 0 || interestRate > 100) {
        alert('Interest rate must be a number between 0 and 100');
        return;
      }

      // Convert and validate term
      const termInMonths = Number(formData.termInMonths);
      if (isNaN(termInMonths) || termInMonths < 1 || termInMonths > 360) {
        alert('Term must be a number between 1 and 360 months');
        return;
      }

      const companyData = {
        companyName: formData.companyName.trim(),
        interestRate,
        termInMonths,
      };

      if (editMode && formData.id) {
        // Update existing company
        await loanCalculatorService.updateCompany(formData.id, companyData);
      } else {
        // Create new company
        await loanCalculatorService.createCompany(companyData);
      }
      
      await fetchCompanies();
      handleClose();
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Failed to save company. Please try again.');
    }
  };

  return (
    <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
    <div className="flex min-h-screen bg-[#f8fafc]">
  <Sidebar />
  <main className="flex-1 ml-[12rem] min-h-screen bg-[#f5f5f5] relative">
    <AdminNavbar />
    <div className="max-w-screen-xl mx-auto p-8 pt-[calc(70px+2rem)]">
      <div className="flex justify-between items-center mb-8 p-6">
        <h1 className="text-2xl font-semibold text-[#333]">Leasing Companies Management</h1>
        <button
          className="flex items-center gap-2 py-2 px-6 bg-[#4CAF50] text-white rounded-lg font-medium hover:bg-[#45a049] transition-all"
          onClick={() => handleOpen()}
        >
          <span>+</span> Add Leasing Company
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#333]">Company Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#333]">Interest Rate (%)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#333]">Term (months)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#333]">Created At</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#333]">Updated At</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#333]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-[#f5f5f5]">
                  <td className="px-4 py-3 text-sm text-[#333]">{company.companyName}</td>
                  <td className="px-4 py-3 text-sm text-[#333]">{company.interestRate}</td>
                  <td className="px-4 py-3 text-sm text-[#333]">{company.termInMonths}</td>
                  <td className="px-4 py-3 text-sm text-[#333]">{new Date(company.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-[#333]">{new Date(company.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 bg-[#2196F3] text-white rounded-md text-sm font-medium hover:bg-[#1976D2] transition-all"
                        onClick={() => handleOpen(company)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-[#DC3545] text-white rounded-md text-sm font-medium hover:bg-[#C82333] transition-all"
                        onClick={() => handleDelete(company.id, company.companyName)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#333]">
                {editMode ? 'Edit Leasing Company' : 'Add Leasing Company'}
              </h2>
            </div>

            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-[#333]">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                className="w-full p-3 border border-[#ddd] rounded-md text-sm focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3]"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="interestRate" className="block text-sm font-medium text-[#333]">
                Interest Rate (%)
              </label>
              <input
                id="interestRate"
                type="number"
                className="w-full p-3 border border-[#ddd] rounded-md text-sm focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3]"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="termInMonths" className="block text-sm font-medium text-[#333]">
                Term (months)
              </label>
              <input
                id="termInMonths"
                type="number"
                className="w-full p-3 border border-[#ddd] rounded-md text-sm focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3]"
                value={formData.termInMonths}
                onChange={(e) => setFormData({ ...formData, termInMonths: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-6 py-2 bg-[#f5f5f5] text-[#333] rounded-md font-medium hover:bg-[#e0e0e0] transition-all"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-[#4CAF50] text-white rounded-md font-medium hover:bg-[#45a049] transition-all"
                onClick={handleSubmit}
              >
                {editMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </main>
</div>

    </div>
  );
};

export default LoanCalculator; 