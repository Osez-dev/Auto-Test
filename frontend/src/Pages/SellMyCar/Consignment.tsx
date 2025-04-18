import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// interface VehicleInfo {
//   make: string;
//   model: string;
//   year: number;
//   transmission: string;
//   mileage: number;
// }

// interface UserDetails {
//   name: string;
//   email: string;
//   phone: string;
//   notes?: string;
// }

const Consignment: React.FC = ({}) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    vehicle: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      transmission: '',
      mileage: 0,
    },
    user: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append vehicle info
      Object.entries(formData.vehicle).forEach(([key, value]) => {
        formDataToSend.append(`vehicle[${key}]`, value.toString());
      });

      // Append user info
      Object.entries(formData.user).forEach(([key, value]) => {
        if (value) formDataToSend.append(`user[${key}]`, value.toString());
      });

      // Append files
      files.forEach((file, index) => {
        formDataToSend.append(`images`, file, `vehicle_image_${index}.${file.name.split('.').pop()}`);
      });

      // Simulate API call (replace with actual fetch)
      console.log('Form data prepared:', Object.fromEntries(formDataToSend.entries()));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      // Reset form if needed
      // resetForm();
    } catch (error) {
      console.error('Submission error:', error);
      if (error instanceof Error) {
        setSubmitError(error.message || 'Failed to submit form. Please try again.');
      } else {
        setSubmitError('Failed to submit form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.vehicle.make.trim()) {
      setSubmitError('Make is required');
      return false;
    }
    
    if (!formData.vehicle.model.trim()) {
      setSubmitError('Model is required');
      return false;
    }

    if (formData.vehicle.year < 1900 || formData.vehicle.year > new Date().getFullYear() + 1) {
      setSubmitError('Please enter a valid year');
      return false;
    }

    if (files.length === 0) {
      setSubmitError('At least one image is required');
      return false;
    }

    if (!formData.user.name.trim()) {
      setSubmitError('Full name is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.user.email)) {
      setSubmitError('Please enter a valid email');
      return false;
    }

    if (formData.user.phone.length < 8) {
      setSubmitError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vehicle.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [field]: field === 'year' || field === 'mileage' ? parseInt(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value
        }
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      const newPreviewImages: string[] = [];
      const newFiles: File[] = [];

      uploadedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviewImages.push(reader.result as string);
          newFiles.push(file);
          
          if (newPreviewImages.length === uploadedFiles.length) {
            setPreviewImages([...previewImages, ...newPreviewImages]);
            setFiles([...files, ...newFiles]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);

    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="flex w-full mt-4 flex-col items-center">
        <h2 className="text-3xl font-bold text-[#0663B2] mb-6">SELL.. VIA.. US!</h2>
        
        <div className="mb-8 w-full max-w-2xl h-48 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-500">Descriptive Image</span>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          {/* Status messages */}
          {submitError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              Your consignment request has been submitted successfully!
            </div>
          )}

          <div className="bg-[#0663B2] text-white p-4 rounded-t-lg">
            <h3 className="text-xl font-semibold">Vehicle Info</h3>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-b-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-700">Make</label>
              <input 
                type="text" 
                name="vehicle.make" 
                value={formData.vehicle.make}
                onChange={handleInputChange}
                placeholder="Make" 
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700">Model</label>
              <input 
                type="text" 
                name="vehicle.model" 
                value={formData.vehicle.model}
                onChange={handleInputChange}
                placeholder="Model" 
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700">Year</label>
              <input 
                type="number" 
                name="vehicle.year" 
                value={formData.vehicle.year}
                onChange={handleInputChange}
                placeholder="Year" 
                min="1900" 
                max={new Date().getFullYear() + 1}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700">Transmission</label>
              <select 
                name="vehicle.transmission" 
                value={formData.vehicle.transmission}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
                required
              >
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700">Mileage</label>
              <input 
                type="number" 
                name="vehicle.mileage" 
                value={formData.vehicle.mileage}
                onChange={handleInputChange}
                placeholder="Mileage" 
                min="0"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="block text-gray-700">Vehicle Images</label>
              
              <input 
                type="file" 
                ref={fileInputRef}
                name="images" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full p-2 border-2 border-dashed border-[#0663B2] text-[#0663B2] rounded-lg hover:bg-[#0663B2] hover:text-white transition duration-200 mb-4"
              >
                Click to Upload Images
              </button>
              
              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Preview ${index}`} 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-2">Upload multiple images of your vehicle (max 10)</p>
            </div>
          </div>
          
          <div className="bg-[#0663B2] text-white p-4 rounded-t-lg">
            <h3 className="text-xl font-semibold">Your Details</h3>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-b-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-700">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.user.name}
                onChange={handleInputChange}
                placeholder="Full Name" 
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.user.email}
                onChange={handleInputChange}
                placeholder="Email" 
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.user.phone}
                onChange={handleInputChange}
                placeholder="Phone Number" 
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="block text-gray-700">Additional Notes</label>
              <textarea 
                name="notes" 
                value={formData.user.notes}
                onChange={handleInputChange}
                placeholder="Any additional information about the vehicle..."
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0663B2]"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="bg-[#0663B2] hover:bg-[#054d8a] text-white font-bold py-3 px-8 rounded-lg transition duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Submit Consignment Request'
              )}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );  
};   

export default Consignment;