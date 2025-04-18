import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import "./transaction.css";

interface Transaction {
  id: number;
  date: string;
  from: string;
  to: string;
  amount: number;
  note: string;
  status: "Completed" | "Processing" | "Canceled";
  type: "Subscription" | "Parts";
}

const sampleTransactions: Transaction[] = [
  { id: 1, date: "2024-02-01", from: "John Doe", to: "Company A", amount: 150.75, note: "Monthly Subscription", status: "Completed", type: "Subscription" },
  { id: 2, date: "2024-02-02", from: "Alice Smith", to: "Company B", amount: 299.99, note: "Annual Subscription", status: "Processing", type: "Subscription" },
  { id: 3, date: "2024-02-03", from: "David Johnson", to: "Company C", amount: 99.50, note: "Spare Part Purchase", status: "Canceled", type: "Parts" },
  { id: 4, date: "2024-02-04", from: "Michael Brown", to: "Company D", amount: 500.00, note: "Enterprise Plan", status: "Completed", type: "Subscription" },
  { id: 5, date: "2024-02-05", from: "Sophia Lee", to: "Company E", amount: 249.99, note: "Hardware Purchase", status: "Processing", type: "Parts" },
  { id: 6, date: "2024-02-06", from: "Chris Wilson", to: "Company F", amount: 50.00, note: "Basic Subscription", status: "Canceled", type: "Subscription" },
];

const AdminTransaction: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    setTimeout(() => {
      setTransactions(sampleTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (transaction) =>
      (statusFilter === "All" || transaction.status === statusFilter) &&
      (typeFilter === "All" || transaction.type === typeFilter) &&
      (transaction.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 20);

    const tableColumn = ["ID", "Date", "From", "To", "Amount", "Note", "Status", "Type"];
    const tableRows: any[] = [];

    transactions.forEach(({ id, date, from, to, amount, note, status, type }) => {
      tableRows.push([id, date, from, to, `$${amount.toFixed(2)}`, note, status, type]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("Transaction_Report.pdf");
  };

  return (
  <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
    <div className="flex justify-start min-h-screen bg-[#f4f6f9] -ml-[200px] font-sans">

      <Sidebar />
      <div className="flex-1 p-5 bg-white ml-48 rounded-lg shadow-lg">

        <AdminNavbar />
        <div className="flex justify-between items-center bg-blue-800 text-white p-5 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold m-0">Transactions</h1>
  <div className="flex gap-4 items-center">
  <input
  type="text"
  placeholder="Search Transactions..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="px-3 py-3 border-2 border-gray-300 rounded-lg w-64 text-gray-800 focus:outline-none focus:border-blue-700 transition-all ease-in-out"
/>

<select 
  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300" 
  value={statusFilter} 
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="All">All Status</option>
  <option value="Completed">Completed</option>
  <option value="Processing">Processing</option>
  <option value="Canceled">Canceled</option>
</select>

<select
  className="px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
  value={typeFilter}
  onChange={(e) => setTypeFilter(e.target.value)}
>
  <option value="All">All Types</option>
  <option value="Subscription">Subscription</option>
  <option value="Parts">Parts</option>
</select>

<button 
  onClick={generateReport} 
  className="px-4 py-3 bg-orange-500 text-white rounded-md font-bold text-lg transition duration-300 ease-in-out hover:bg-orange-400"
>
  Get Report
</button>

          </div>
        </div>
        {loading ? (
          <div className="text-center text-xl text-gray-600 mt-5">Loading data...</div>

        ) : (
          <table className="w-full table-auto mt-5 bg-white rounded-lg shadow-md">
  <thead>
    <tr className="text-left bg-blue-600 text-white font-bold">
      <th className="px-4 py-3">ID</th>
      <th className="px-4 py-3">Date</th>
      <th className="px-4 py-3">From</th>
      <th className="px-4 py-3">To</th>
      <th className="px-4 py-3">Amount</th>
      <th className="px-4 py-3">Note</th>
      <th className="px-4 py-3">Status</th>
      <th className="px-4 py-3">Type</th>
    </tr>
  </thead>
  <tbody>
    {filteredTransactions.map((transaction) => (
      <tr key={transaction.id} className="hover:bg-gray-100">
        <td className="px-4 py-3">{transaction.id}</td>
        <td className="px-4 py-3">{transaction.date}</td>
        <td className="px-4 py-3">{transaction.from}</td>
        <td className="px-4 py-3">{transaction.to}</td>
        <td className="px-4 py-3">${transaction.amount.toFixed(2)}</td>
        <td className="px-4 py-3">{transaction.note}</td>
        <td className="px-4 py-3">
          <span
            className={`px-4 py-2 text-white font-bold rounded-full ${
              transaction.status === "Completed"
                ? "bg-green-500"
                : transaction.status === "Processing"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {transaction.status}
          </span>
        </td>
        <td className="px-4 py-3">{transaction.type}</td>
      </tr>
    ))}
  </tbody>
</table>

        )}
      </div>
    </div>
  </div>
  );
};

export default AdminTransaction;
