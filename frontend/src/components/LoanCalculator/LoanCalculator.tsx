import React, { useEffect, useState } from 'react';
import { LeasingCompany, LoanCalculationResult, loanCalculatorService } from '../../services/loanCalculatorService';
import './LoanCalculator.css';

interface LoanCalculatorProps {
  vehiclePrice: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ vehiclePrice }) => {
  const [leasingCompanies, setLeasingCompanies] = useState<LeasingCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<LeasingCompany | null>(null);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [calculationResult, setCalculationResult] = useState<LoanCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeasingCompanies = async () => {
      try {
        const companies = await loanCalculatorService.getAllCompanies();
        setLeasingCompanies(companies);
      } catch (error) {
        console.error('Error fetching leasing companies:', error);
      }
    };

    fetchLeasingCompanies();
  }, []);

  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const company = leasingCompanies.find(c => c.id === Number(event.target.value));
    setSelectedCompany(company || null);
    setCalculationResult(null);
  };

  const handleCalculate = async () => {
    if (!selectedCompany) return;

    try {
      setLoading(true);
      const result = await loanCalculatorService.calculateLoan({
        vehiclePrice,
        downPayment,
        interestRate: selectedCompany.interestRate,
        termInMonths: selectedCompany.termInMonths
      });
      setCalculationResult(result);
    } catch (error) {
      console.error('Error calculating loan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-calculator">
      <h2>Loan Calculator</h2>
      
      <div className="calculator-form">
        <div className="form-group">
          <label>Vehicle price (Rs.)</label>
          <input
            type="text"
            value={vehiclePrice.toLocaleString()}
            disabled
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Select Leasing Company</label>
          <select
            className="form-control"
            onChange={handleCompanyChange}
            value={selectedCompany?.id || ''}
          >
            <option value="">Select a company</option>
            {leasingCompanies.map(company => (
              <option key={company.id} value={company.id}>
                {company.companyName} ({company.interestRate}% - {company.termInMonths} months)
              </option>
            ))}
          </select>
        </div>

        {selectedCompany && (
          <>
            <div className="form-group">
              <label>Interest rate (%)</label>
              <input
                type="text"
                value={selectedCompany.interestRate}
                disabled
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Loan Term (months)</label>
              <input
                type="text"
                value={selectedCompany.termInMonths}
                disabled
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Down Payment (Rs.)</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="form-control"
                min="0"
                max={vehiclePrice}
              />
            </div>

            <button 
              className="calculate-btn"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </>
        )}

        {calculationResult && (
          <div className="calculation-results">
            <h3>Loan Details</h3>
            <div className="payment-breakdown">
              <div className="breakdown-item">
                <span>Down Payment:</span>
                <span className="amount">Rs. {downPayment.toLocaleString()}</span>
              </div>
              <div className="breakdown-item">
                <span>Monthly Payment:</span>
                <span className="amount">Rs. {calculationResult.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="breakdown-item">
                <span>Total Interest:</span>
                <span className="amount">Rs. {calculationResult.totalInterest.toLocaleString()}</span>
              </div>
              <div className="breakdown-item">
                <span>Total Loan Amount:</span>
                <span className="amount">Rs. {(calculationResult.totalPayment).toLocaleString()}</span>
              </div>
              <div className="breakdown-item total">
                <span>Total Payment (with Down Payment):</span>
                <span className="amount">Rs. {(calculationResult.totalPayment + downPayment).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator; 