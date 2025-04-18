import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../../../services/authService";
import { getListingById, updateListing } from "../../../services/listingService";
import AdminNavbar from "../../Components/AdminNavbar/AdminNavbar";
import Sidebar from "../../Components/Sidebar/Sidebar";

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    title: "",
    condition: "",
    regno: "",
    make: "",
    model: "",
    yearofmanufacture: 0,
    mileage: 0,
    fuelType: "",
    bodyType: "",
    transmission: "",
    district: "",
    city: "",
    engineCc: 0,
    price: 0,
    sellersNotes: "",
    status: "",
    grade: "",
    exteriorColor: "",
    interiorColor: "",
    noOfOwners: 0,
    blueTGrade: "",
    yearOfReg: 0,
    imageUrls: [],
    listingFeatures: {
      convenience: [],
      infotainment: [],
      safetyAndSecurity: [],
      interiorAndSeats: [],
      windowsAndLighting: [],
      otherFeatures: [],
    },
  });

  // Fetch user profile and set userId
  useEffect(() => {
    const fetchProfileAndListing = async () => {
      try {
        setIsLoading(true);
        const profile = await authService.getProfile();
        if (profile) {
          // setUserId(profile.id);
        } else {
          console.error("Profile not found, redirecting to login.");
          navigate("/login");
          return;
        }

        // Fetch listing details and populate form
        const listingData = await getListingById(Number(id));
        if (listingData) {
          setFormData({
            ...listingData,
            listingFeatures: listingData.listingFeatures || {
              convenience: [],
              infotainment: [],
              safetyAndSecurity: [],
              interiorAndSeats: [],
              windowsAndLighting: [],
              otherFeatures: [],
            }
          });
        } else {
          console.error("Listing not found.");
        }
      } catch (err) {
        console.error("Failed to fetch profile or listing:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndListing();
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: typeof formData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle array inputs for listing features
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const value = e.target.value.split(",");
    setFormData((prevData: typeof formData) => ({
      ...prevData,
      listingFeatures: {
        ...prevData.listingFeatures,
        [category]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { id, createdAt, updatedAt, user, userId, ...updateData } = formData;

      const formattedData = {
        ...updateData,
        yearofmanufacture: Number(updateData.yearofmanufacture),
        mileage: Number(updateData.mileage),
        engineCc: Number(updateData.engineCc),
        price: Number(updateData.price),
        noOfOwners: Number(updateData.noOfOwners),
        yearOfReg: Number(updateData.yearOfReg),
        status: 'pending'
      };

      console.log("Final Data Sent to Backend:", formattedData);

      await updateListing(Number(id), formattedData);

      alert("Listing updated successfully! Status set to pending for review.");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("Failed to update listing.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
            <div className="container mx-auto px-6 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Listing</h2>
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Condition</label>
                    <input
                      type="text"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                    <input
                      type="text"
                      name="regno"
                      value={formData.regno}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Make</label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Year of Manufacture</label>
                    <input
                      type="number"
                      name="yearofmanufacture"
                      value={formData.yearofmanufacture}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Mileage</label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                    <input
                      type="text"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Body Type</label>
                    <input
                      type="text"
                      name="bodyType"
                      value={formData.bodyType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Transmission</label>
                    <input
                      type="text"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Engine CC</label>
                    <input
                      type="number"
                      name="engineCc"
                      value={formData.engineCc}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Convenience (comma separated)</label>
                    <input
                      type="text"
                      onChange={(e) => handleArrayChange(e, "convenience")}
                      value={formData.listingFeatures?.convenience?.join(",") || ""}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Infotainment (comma separated)</label>
                    <input
                      type="text"
                      onChange={(e) => handleArrayChange(e, "infotainment")}
                      value={formData.listingFeatures?.infotainment?.join(",") || ""}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Safety and Security (comma separated)</label>
                    <input
                      type="text"
                      onChange={(e) => handleArrayChange(e, "safetyAndSecurity")}
                      value={formData.listingFeatures?.safetyAndSecurity?.join(",") || ""}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Update Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditListing;
