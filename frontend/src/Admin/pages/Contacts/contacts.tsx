import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";

interface Contact {
  status: string;
  name: string;
  email: string;
  date: string;
  tags: string;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<Contact>({
    status: "",
    name: "",
    email: "",
    date: "",
    tags: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = () => {
    setContacts([...contacts, newContact]);
    setNewContact({ status: "", name: "", email: "", date: "", tags: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
    <div className="flex w-full h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 overflow-auto bg-white">
        <AdminNavbar />

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <button
            className="px-5 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Add Contact
          </button>
        </div>

        {/* Contacts Table */}
        <div className="px-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={index} className="border">
                  <td className="p-3">{contact.status}</td>
                  <td className="p-3">{contact.name}</td>
                  <td className="p-3">{contact.email}</td>
                  <td className="p-3">{contact.date}</td>
                  <td className="p-3">{contact.tags}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Contact Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add Contact</h2>
              <input
                type="text"
                name="status"
                placeholder="Status"
                value={newContact.status}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border rounded-md"
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newContact.name}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newContact.email}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border rounded-md"
              />
              <input
                type="date"
                name="date"
                value={newContact.date}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border rounded-md"
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags"
                value={newContact.tags}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border rounded-md"
              />

              {/* Modal Actions */}
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700"
                  onClick={handleAddContact}
                >
                  Add
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Contacts;
