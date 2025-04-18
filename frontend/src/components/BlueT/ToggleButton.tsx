import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../services/AuthContext';


const ToggleButton = () => {
  const [activeForm, setActiveForm] = useState<'Blue-T' | 'Value-My-Car'>('Blue-T');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    city: '',
  });
  const { user } = useAuth();
  const userId = user?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleToggle = (form: 'Blue-T' | 'Value-My-Car') => {
    setActiveForm(form);
    setSubmitStatus(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await axios.post('http://localhost:3000/appointments', {
        ...formData,
        type: activeForm,
        userId: userId // Include user ID in the submission
      });
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        telephone: '',
        city: '',
      });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col text-center mt-10">
      <div className='w flex flex-col justify-center items-center'>
        {/* Toggle Buttons */}
        <div className="flex w-64 justify-between bg-gray-200 p-2 rounded-full mb-5">
          <button 
            className={`flex-1 py-2 rounded-full transition duration-300 ${activeForm === 'Blue-T' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
            onClick={() => handleToggle('Blue-T')}
          >
            {/* Blue-T */}
            Grade My Car
          </button>
          <button 
            className={`flex-1 py-2 rounded-full transition duration-300 ${activeForm === 'Value-My-Car' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
            onClick={() => handleToggle('Value-My-Car')}
          >
            Value My Car
          </button>
        </div>

        {/* Form Container */}
        <div className="relative w-2/3">
          {/* Blue-T Form */}
          {activeForm === 'Blue-T' && (
            <>
              <form className="w-full p-5 bg-white shadow-lg rounded-lg mb-8" onSubmit={handleSubmit}>
                <div className='width-1/2 flex flex-col relative mb-3 mx-auto'>
                  <h1 className="text-2xl font-bold mb-4">Get BLUE-T grading report now.</h1>
                  <p className="text-gray-600 mb-4">Book your Blue-T inspection appointment with us. Our expert team will help you get your vehicle certified.</p>
                  <div className='bg-slate-400 w-full h-42'>
                    <img src="https://autostream.lk/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-10-at-3.37.41%E2%80%AFPM.jpeg"  />
                  </div>
                  <p className='font-bold mb-3 text-xl'>Book your Appointment.</p>
                  <div>
                    <div>
                      <label className="ml-4 mb-2 items-start flex flex-col justify-start">
                      Full Name :
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required 
                          className="w-full p-2 border rounded" 
                        />
                      </label>
                      <label className="ml-4 mb-2 items-start flex flex-col justify-start">
                        Email Address :
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                          className="w-full p-2 border rounded" 
                        />
                      </label>
                      <label className="ml-4 mb-2 items-start flex flex-col justify-start">
                      Telephone No.
                        <input 
                          type="tel" 
                          name="telephone" 
                          value={formData.telephone}
                          onChange={handleInputChange}
                          required 
                          className="w-full p-2 border rounded" 
                        />
                      </label>
                      <label className="ml-4 mb-2 items-start flex flex-col justify-start">
                        City:
                        <input 
                          type="text" 
                          name="city" 
                          value={formData.city}
                          onChange={handleInputChange}
                          required 
                          className="w-full p-2 border rounded" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Blue-T'}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-green-500 mt-2">Appointment request submitted successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-500 mt-2">Error submitting appointment request. Please try again.</p>
                )}
              </form>

              {/* Blue-T Content Section */}
              <div className="w-full text-left">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">What is BLUE-T?</h2>
                <p className="text-gray-700 mb-8">
                With a focus on Exterior, Interior, Frame, and Functionality, Blue-T evaluate grading of vehicle condition. Developed with Japanese experts association, this state-of-the-art system utilizes advanced sensors and AI algorithms for accurate results. 
                The accuracy has been proven with its history of over 10 years.
                </p>

                <div className="aspect-w-16 aspect-h-9 mb-12">
                  <iframe
                    className="w-full h-[500px] rounded-lg"
                    src="https://www.youtube.com/embed/IO3-h0dB9Q0"
                    title="Blue-T Vehicle Grading"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>  

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                  <div className="bg-[#002B4E] text-white p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Accuracy</h3>
                    <p>AI auto-grading algorithms ensuring precise grading results</p>
                  </div>
                  <div className="bg-[#002B4E] text-white p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Convenience</h3>
                    <p>Evaluating within 30 mins anywhere without additional facilities</p>
                  </div>
                  <div className="bg-[#002B4E] text-white p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Stable Quality</h3>
                    <p>Technology-based real-time monitoring enables to maintain high quality</p>
                  </div>
                </div>

                {/* Pain Points Section */}
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-12">Pain points solved</h2>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="text-center">
                      <h3 className="text-4xl font-bold text-[#0066CC] mb-6">Car buyer</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Spending long time to<br />
                        check car condition with<br />
                        worry of condition
                      </p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-4xl font-bold text-[#0066CC] mb-6">Car seller</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Hassling with unfair<br />
                        discount by undervalued<br />
                        condition
                      </p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-4xl font-bold text-[#0066CC] mb-6">Car dealer</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Struggling to manage risks<br />
                        of overrating value at car<br />
                        sourcing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coverage Section */}
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Coverage</h2>
                  <p className="text-xl text-gray-600 mb-8">110+ Value Focused Checkpoints</p>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="bg-[#002B4E] text-white p-12 rounded-lg text-center flex flex-col items-center">
                      <h3 className="text-3xl font-bold mb-6">Interior</h3>
                      <p className="text-lg leading-relaxed">
                        From Cut, Peel,<br />
                        Burn to Smell,<br />
                        Animal hair for<br />
                        comfort.
                      </p>
                    </div>
                    <div className="bg-[#002B4E] text-white p-12 rounded-lg text-center flex flex-col items-center">
                      <h3 className="text-3xl font-bold mb-6">Exterior</h3>
                      <p className="text-lg leading-relaxed">
                        Scratch, Dent,<br />
                        Repaint or Crack<br />
                        for appearance.
                      </p>
                    </div>
                    <div className="bg-[#002B4E] text-white p-12 rounded-lg text-center flex flex-col items-center">
                      <h3 className="text-3xl font-bold mb-6">Frame</h3>
                      <p className="text-lg leading-relaxed">
                        Repair on<br />
                        Accident history<br />
                        for safety and<br />
                        stability
                      </p>
                    </div>
                    <div className="bg-[#002B4E] text-white p-12 rounded-lg text-center flex flex-col items-center">
                      <h3 className="text-3xl font-bold mb-6">Functional</h3>
                      <p className="text-lg leading-relaxed">
                        Electrical, Engine,<br />
                        Transmission or parts<br />
                        for normal driving
                      </p>
                    </div>
                  </div>
                </div>

                {/* Use Cases Section */}
                <h3 className="text-2xl font-bold mb-6">Various Use Cases</h3>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <h4 className="text-xl font-semibold mb-3">Carsale</h4>
                    <p className="text-gray-600">Quick and hasseless deals via validated info</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-semibold mb-3">Asset valuation / Audit</h4>
                    <p className="text-gray-600">For fleet owner, the cost of inspection and maintenance</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-semibold mb-3">Government Inspection</h4>
                    <p className="text-gray-600">For the Government, the cost of inspection and maintenance</p>
                  </div>
                </div>

                {/* Grading Section */}
                <h3 className="text-2xl font-bold mb-6 mt-12">Grading</h3>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="bg-[#002B4E] text-white p-8 rounded-lg text-center">
                    <h4 className="text-3xl font-bold mb-2">B+</h4>
                    <p>Great</p>
                  </div>
                  <div className="bg-[#002B4E] text-white p-8 rounded-lg text-center">
                    <h4 className="text-3xl font-bold mb-2">B</h4>
                    <p>Good</p>
                  </div>
                  <div className="bg-[#002B4E] text-white p-8 rounded-lg text-center">
                    <h4 className="text-3xl font-bold mb-2">B-</h4>
                    <p>Average</p>
                  </div>
                  <div className="bg-[#002B4E] text-white p-8 rounded-lg text-center">
                    <h4 className="text-3xl font-bold mb-2">C</h4>
                    <p>Okay</p>
                  </div>
                  <div className="bg-[#002B4E] text-white p-8 rounded-lg text-center">
                    <h4 className="text-3xl font-bold mb-2">D</h4>
                    <p>Need<br />Attention</p>
                  </div>
                </div>
                {/* <p className="text-gray-500 text-center text-sm mb-12">Click grading to see the vehicle list</p> */}
                {/* have to add clickable  when click section to see the vehicle list */}

                {/* Video Section */}
                <h3 className="text-2xl font-bold mb-6">Want to know more about BLUE-T? Watch the below video.</h3>
                <div className="aspect-w-16 aspect-h-9 mb-12">
                  <iframe
                    className="w-full h-[500px] rounded-lg"
                    src="https://www.youtube.com/embed/0K4TG7Y6gWs"
                    title="Toyota Tech Talk | Episode 10 | Planning to BUY a Used Car? Get BLUE-T Report"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </>
          )}

          {/* Value-My-Car Form */}
          {activeForm === 'Value-My-Car' && (
            <form className="w-full p-5 bg-white shadow-lg rounded-lg" onSubmit={handleSubmit}>
              <div className='width-1/2 flex flex-col relative mb-10 mx-auto'>
                <h1 className="text-2xl font-bold mb-4">Get BLUE-T Valuation report now</h1>
                <p className="text-gray-600 mb-4">Get your car valued by our experts. We provide accurate market valuations for your vehicle.</p>
                <div className='bg-slate-400 w-full h-42'>
                    <img src="https://autostream.lk/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-11-at-3.12.32%E2%80%AFPM.jpeg"  />
                  </div>
              </div>
              <p className='font-bold mb-3 text-xl'>Book a Time Slot with Us!</p>
              <div>
                <div>
                  <label className="ml-4 mb-2 items-start flex flex-col justify-start">
                    Name:
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                      className="w-full p-2 border rounded" 
                    />
                  </label>
                  <label className="ml-4 mb-2 items-start flex flex-col justify-start">
                    Email:
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      className="w-full p-2 border rounded" 
                    />
                  </label>
                  <label className="ml-4 mb-2 items-start flex flex-col justify-start">
                    Telephone:
                    <input 
                      type="tel" 
                      name="telephone" 
                      value={formData.telephone}
                      onChange={handleInputChange}
                      required 
                      className="w-full p-2 border rounded" 
                    />
                  </label>
                  <label className="ml-4 mb-2 items-start flex flex-col justify-start">
                    City:
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      required 
                      className="w-full p-2 border rounded" 
                    />
                  </label>
                </div>
              
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Value-My-Car'}
              </button>
              {submitStatus === 'success' && (
                <p className="text-green-500 mt-2">Appointment request submitted successfully!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 mt-2">Error submitting appointment request. Please try again.</p>
              )}
            </form>
          )}

          {/* Benefits and Every Purpose Sections for Value My Car */}
          {activeForm === 'Value-My-Car' && (
            <div className="mt-16 text-center">
              {/* Benefits Section */}
              <div className="mb-16">
                <h2 className="text-4xl font-bold text-[#0066CC] mb-12">Benefits</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Only one condition based valuation</h3>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Seamless vehicle grading by AI based system</h3>
                  </div>
                </div>
              </div>

              {/* Every Purpose Section */}
              <div className="mb-16">
                <h2 className="text-4xl font-bold text-[#0066CC] mb-12">Every Purpose</h2>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Lease application</h3>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Fleet Disposal</h3>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Market Value Study</h3>
                  </div>
                </div>
              </div>

              {/* Available for Any brand */}
              <h2 className="text-4xl font-bold text-[#0066CC] mb-16">Available for Any brand</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;