import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createListing, getUserListings } from "../../services/listingService";
import authService from "../../services/authService";
import Navbar from "../../components/Navbar";
import YearDropdown from "./InnerComponents/YearsDropdowns";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/listings`;
const MAX_FREE_ADS = 5;
const MAX_IMAGES = 6;

// Predefined options for dropdowns
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "CNG", "LPG"];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Van", "Pickup"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "DCT", "AMT"];
const CAR_MAKES = ["Toyota", "Honda", "Nissan", "Mitsubishi", "BMW", "Mercedes", "Audi", "Ford"];
const CAR_MODELS: Record<string, string[]> = {
  "Toyota": ["Corolla", "Camry", "Prius", "RAV4", "Land Cruiser"],
  "Honda": ["Civic", "Accord", "CR-V", "Fit", "City"],
  "Nissan": ["Sunny", "Tiida", "X-Trail", "Leaf", "Patrol"],
  "Mitsubishi": ["Lancer", "Outlander", "Pajero", "Mirage"],
  "BMW": ["3 Series", "5 Series", "X5", "X3"],
  "Mercedes": ["C-Class", "E-Class", "S-Class", "GLC"],
  "Audi": ["A4", "A6", "Q5", "Q7"],
  "Ford": ["Focus", "Fiesta", "Escape", "Ranger"]
};

const PostAd = () => {
  const [formData, setFormData] = useState({
    title: "",
    condition: "",
    regno: "",
    make: "",
    model: "",
    yearofmanufacture: "",
    mileage: 0,
    fuelType: "",
    bodyType: "",
    transmission: "",
    district: "",
    city: "",
    engineCc: 0,
    price: 0,
    sellersNotes: "",
    status: "pending",
    grade: "",
    exteriorColor: "",
    interiorColor: "",
    noOfOwners: 0,
    blueTGrade: "",
    yearOfReg: 0,
    imageUrls: [] as string[],
    registrationImageUrl: "",
    listingFeatures: {
      convenience: [],
      infotainment: [],
      safetyAndSecurity: [],
      interiorAndSeats: [],
      windowsAndLighting: [],
      otherFeatures: [],
    },
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [showMakeSuggestions, setShowMakeSuggestions] = useState(false);
  const [userListings, setUserListings] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [regImagePreview, setRegImagePreview] = useState<string | null>(null);
  const [regImageFile, setRegImageFile] = useState<File | null>(null);
  
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const regImageInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const listings = await getUserListings();
        setUserListings(listings.length);
      } catch (error) {
        console.error("Error fetching user listings:", error);
      }
    };

    fetchUserListings();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile) {
          setUserId(profile.id);
          setUserRole(profile.role);
        } else {
          console.error("Profile not found, redirecting to login.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (formData.make) {
      const models = CAR_MODELS[formData.make] || [];
      setFilteredModels(models);
      if (models.length > 0) {
        setShowModelSuggestions(true);
      }
    } else {
      setFilteredModels([]);
      setShowModelSuggestions(false);
    }
  }, [formData.make]);

  const handleRegImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setRegImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRegImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeRegImage = () => {
    setRegImagePreview(null);
    setRegImageFile(null);
    if (regImageInputRef.current) {
      regImageInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageFiles = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .slice(0, MAX_IMAGES - imagePreviews.length);

    if (imageFiles.length === 0) return;

    const newPreviews: string[] = [];
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPreviews.push(event.target.result as string);
          if (newPreviews.length === imageFiles.length) {
            setImagePreviews(prev => [...prev, ...newPreviews].slice(0, MAX_IMAGES));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfPreviewUrl(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleYearChange = (year: string) => {
    setFormData((prevData) => ({
      ...prevData,
      yearofmanufacture: year,
    }));
  };

  const handleMakeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, make: value }));
    setShowMakeSuggestions(value.length > 0);
  };

  const handleModelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, model: value }));
    setShowModelSuggestions(value.length > 0);
  };

  const selectMake = (make: string) => {
    setFormData(prev => ({ ...prev, make }));
    setShowMakeSuggestions(false);
  };

  const selectModel = (model: string) => {
    setFormData(prev => ({ ...prev, model }));
    setShowModelSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if PDF is required but not uploaded
    if (formData.blueTGrade && formData.blueTGrade !== "" && !pdfFile) {
      alert("Please upload the PDF document for Blue-T grade verification");
      return;
    }

    // Check if registration image is uploaded
    if (!regImageFile) {
      alert("Please upload an image of the vehicle registration number");
      return;
    }

    if (!userId) {
      console.error("User ID is required.");
      return;
    }
    if (userRole !== 'admin' && userListings >= MAX_FREE_ADS) {
      alert("You have reached the free limit. Upgrade to post more ads!");
      return;
    }

   

    try {
      // Upload registration image
      const regImageFormData = new FormData();
      regImageFormData.append('image', regImageFile);
      const regImageResponse = await axios.post(`${API_URL}/upload-registration-image`, regImageFormData);
      const regImageUrl = regImageResponse.data.imageUrl;

      // Upload verification document if exists
      let verificationDocUrl = '';
      if (pdfFile) {
        const pdfFormData = new FormData();
        pdfFormData.append('document', pdfFile);
        const pdfResponse = await axios.post(`${API_URL}/upload-verification-doc`, pdfFormData);
        verificationDocUrl = pdfResponse.data.documentUrl;
      }

      // Upload listing images
      const imageFormData = new FormData();
      if (fileInputRef.current?.files) {
        const files = Array.from(fileInputRef.current.files);
        files.forEach(file => {
          imageFormData.append('images', file);
        });
      }
      const imagesResponse = await axios.post(`${API_URL}/upload-images`, imageFormData);
      const imageUrls = imagesResponse.data.imageUrls;

      const formattedData = {
        ...formData,
        userRole: userRole || "",
        userId,
        yearofmanufacture: Number(formData.yearofmanufacture),
        mileage: Number(formData.mileage),
        engineCc: Number(formData.engineCc),
        price: Number(formData.price),
        noOfOwners: Number(formData.noOfOwners),
        yearOfReg: Number(formData.yearOfReg),
        status: "pending",
        imageUrls,
        registrationImageUrl: regImageUrl,
        verificationDocument: verificationDocUrl
      };

      const response = await createListing(formattedData);
      console.log("Listing created:", response);
      navigate('/');
      alert("Your listing has been submitted for approval. We will review it shortly.");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    }
  };

  const renderPdfUpload = () => (
    <div className="col-span-full mt-2">
      <label className="text-sm font-semibold text-gray-600 mb-2 block">
        Upload Vehicle Inspection Report (PDF required for Blue-T grade)
      </label>
      {pdfPreviewUrl ? (
        <div className="flex items-center gap-2 mb-2">
          <a 
            href={pdfPreviewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Uploaded PDF
          </a>
          <button
            type="button"
            onClick={removePdf}
            className="text-red-500 hover:text-red-700"
          >
            × Remove
          </button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => pdfInputRef.current?.click()}
        >
          <p className="text-gray-500">Click to upload PDF (Max 5MB)</p>
          <input
            type="file"
            ref={pdfInputRef}
            onChange={handlePdfUpload}
            accept=".pdf"
            className="hidden"
          />
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Required when selecting Blue-T grade. Upload the official vehicle inspection report.
      </p>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-5 bg-gray-50 min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto bg-white rounded-lg shadow-sm p-10">
          <h1 className="text-3xl text-gray-800 flex items-center justify-center mb-10 text-center">Post a New Listing</h1>
          <div className="w-full max-w-[1000px] mx-auto">
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              {userRole !== 'admin' && (
                <div className="col-span-full bg-gray-50 p-5 rounded-lg mb-8 border flex flex-col items-center justify-center border-gray-200">
                  <p className="text-gray-600 mb-2">
                    You have used <strong>{userListings}</strong> out of <strong>{MAX_FREE_ADS}</strong> free ad slots.
                  </p>
                  {userListings >= MAX_FREE_ADS && (
                    <p className="text-red-500 font-semibold">
                      You have reached the limit! Upgrade to post more ads.
                    </p>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col gap-2 col-span-full">
                <label className="text-sm font-semibold text-gray-600">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter a descriptive title for your listing"
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Make with suggestions */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-semibold text-gray-600">Make:</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleMakeInput}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all"
                />
                {showMakeSuggestions && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {CAR_MAKES
                      .filter(make => make.toLowerCase().includes(formData.make.toLowerCase()))
                      .map(make => (
                        <div
                          key={make}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectMake(make)}
                        >
                          {make}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Model with suggestions */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-semibold text-gray-600">Model:</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleModelInput}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all"
                />
                {showModelSuggestions && filteredModels.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredModels
                      .filter(model => model.toLowerCase().includes(formData.model.toLowerCase()))
                      .map(model => (
                        <div
                          key={model}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectModel(model)}
                        >
                          {model}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              

              {/* Condition */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Condition:</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10 cursor-pointer"
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Reconditioned">Reconditioned</option>
                </select>
              </div>

              {/* Registration Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Registration Number:</label>
                <input
                  type="text"
                  name="regno"
                  value={formData.regno}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Registration Number Image Upload */}
              <div className="flex flex-col gap-2 col-span-full">
                <label className="text-sm font-semibold text-gray-600">Vehicle Registration Image:</label>
                {regImagePreview ? (
                  <div className="flex items-center gap-4">
                    <img 
                      src={regImagePreview} 
                      alt="Registration Preview" 
                      className="w-32 h-24 object-contain border border-gray-200 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeRegImage}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => regImageInputRef.current?.click()}
                  >
                    <p className="text-gray-500">Click to upload image of vehicle with Registration number plate</p>
                    <input
                      type="file"
                      ref={regImageInputRef}
                      onChange={handleRegImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Upload a clear image of the vehicle with registration number (license plate).
                </p>
              </div>

             

              {/* Year of Manufacture */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Year of Manufacture:</label>
                <YearDropdown
                  id="yearofmanufacture"
                  name="yearofmanufacture"
                  value={formData.yearofmanufacture}
                  onChange={handleYearChange}
                  startYear={1990}
                  endYear={new Date().getFullYear()}
                />
              </div>

              {/* Mileage */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Mileage:</label>
                <input
                  type="number"
                  name="mileage"
                  min={0}
                  step={1}
                  placeholder="Enter mileage in km"
                  value={formData.mileage}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Fuel Type Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Fuel Type:</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10 cursor-pointer"
                >
                  <option value="">Select Fuel Type</option>
                  {FUEL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Body Type Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Body Type:</label>
                <select
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10 cursor-pointer"
                >
                  <option value="">Select Body Type</option>
                  {BODY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Transmission Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Transmission:</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10 cursor-pointer"
                >
                  <option value="">Select Transmission</option>
                  {TRANSMISSIONS.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">District:</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  list="districts"
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3ccircle cx='11' cy='11' r='8'%3e%3c/circle%3e%3cline x1='21' y1='21' x2='16.65' y2='16.65'%3e%3c/line%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10"
                  placeholder="Type to search district..."
                />
                <datalist id="districts">
                  <option value="Colombo" />
                  <option value="Gampaha" />
                  <option value="Kalutara" />
                  <option value="Kandy" />
                  <option value="Matale" />
                  <option value="Nuwara Eliya" />
                  <option value="Galle" />
                  <option value="Matara" />
                  <option value="Hambantota" />
                  <option value="Jaffna" />
                  <option value="Kilinochchi" />
                  <option value="Mannar" />
                  <option value="Mullaitivu" />
                  <option value="Vavuniya" />
                  <option value="Trincomalee" />
                  <option value="Batticaloa" />
                  <option value="Ampara" />
                  <option value="Kurunegala" />
                  <option value="Puttalam" />
                  <option value="Anuradhapura" />
                  <option value="Polonnaruwa" />
                  <option value="Badulla" />
                  <option value="Monaragala" />
                  <option value="Ratnapura" />
                  <option value="Kegalle" />
                </datalist>
              </div>

              {/* City */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Engine CC */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Engine CC:</label>
                <input
                  type="number"
                  name="engineCc"
                  value={formData.engineCc}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Blue T Grade */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Blue T Grade:</label>
                <select
                  name="blueTGrade"
                  value={formData.blueTGrade}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10 cursor-pointer"
                >
                  <option value="">Select Blue T Grade</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              {/* Conditionally render PDF upload when Blue-T grade is selected */}
              {formData.blueTGrade && formData.blueTGrade !== "" && renderPdfUpload()}

              {/* Seller's Notes */}
              <div className="flex flex-col gap-2 col-span-full">
                <label className="text-sm font-semibold text-gray-600">Sellers Notes:</label>
                <textarea
                  name="sellersNotes"
                  value={formData.sellersNotes}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all min-h-[120px]"
                />
              </div>

              {/* Image Upload Section */}
              <div className="col-span-full">
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Upload Images (Max {MAX_IMAGES})</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < MAX_IMAGES && (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer h-24"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="text-gray-500">+ Add Image</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to {MAX_IMAGES} images (JPEG, PNG). First image will be used as the main image.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="col-span-full py-4 px-8 bg-blue-800 text-white rounded-md font-semibold hover:bg-blue-700 hover:shadow-md transition-all mt-8 max-w-[300px] mx-auto disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={userRole !== 'admin' && userListings >= MAX_FREE_ADS}
              >
                {userRole !== 'admin' && userListings >= MAX_FREE_ADS ? "Upgrade to Post More Ads" : "Create Listing"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostAd;