"use client"

import type React from "react"

import { useState } from "react"
import { Car, User, FileText, CheckCircle } from "lucide-react"

interface MultiStepQuotationFormProps {
  onClose: () => void
}

export default function MultiStepQuotationForm({ onClose }: MultiStepQuotationFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    vehicleType: "private",
    vehicleMake: "",
    vehicleModel: "",
    registrationYear: "",
    ncd: "",
    fullName: "",
    contactNumber: "",
    email: "",
    termsAccepted: false,
  })

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would submit the form data to your backend
    console.log("Form submitted:", formData)
    // Move to success step
    setStep(4)
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between items-center mb-8 px-6 pt-6">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-[#1e50a0] text-white" : "bg-gray-200 text-gray-500"}`}
          >
            <Car className="h-4 w-4" />
          </div>
          <div className={`h-1 w-12 ${step >= 2 ? "bg-[#1e50a0]" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-[#1e50a0] text-white" : "bg-gray-200 text-gray-500"}`}
          >
            <User className="h-4 w-4" />
          </div>
          <div className={`h-1 w-12 ${step >= 3 ? "bg-[#1e50a0]" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-[#1e50a0] text-white" : "bg-gray-200 text-gray-500"}`}
          >
            <FileText className="h-4 w-4" />
          </div>
          <div className={`h-1 w-12 ${step >= 4 ? "bg-[#1e50a0]" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 4 ? "bg-[#1e50a0] text-white" : "bg-gray-200 text-gray-500"}`}
          >
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Step {step} of {step === 4 ? 3 : 3}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {renderStepIndicator()}

      <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
        <div className="px-6 pb-6">
          {/* Step 1: Vehicle Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
                <p className="text-sm text-gray-500">Tell us about your vehicle to get accurate quotes</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateFormData("vehicleType", "private")}
                    className={`flex items-center gap-2 p-3 rounded-md border ${
                      formData.vehicleType === "private"
                        ? "bg-[#1e50a0] text-white border-[#1e50a0]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Car className="h-5 w-5" />
                    <span>Private Car</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormData("vehicleType", "commercial")}
                    className={`flex items-center gap-2 p-3 rounded-md border ${
                      formData.vehicleType === "commercial"
                        ? "bg-[#1e50a0] text-white border-[#1e50a0]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Car className="h-5 w-5" />
                    <span>Commercial Vehicle</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="vehicle-make" className="block text-sm font-medium text-gray-700">
                    Vehicle Make
                  </label>
                  <select
                    id="vehicle-make"
                    value={formData.vehicleMake}
                    onChange={(e) => updateFormData("vehicleMake", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#1e50a0] focus:outline-none focus:ring-1 focus:ring-[#1e50a0]"
                  >
                    <option value="" disabled>
                      Select make
                    </option>
                    <option value="toyota">Toyota</option>
                    <option value="honda">Honda</option>
                    <option value="bmw">BMW</option>
                    <option value="mercedes">Mercedes-Benz</option>
                    <option value="audi">Audi</option>
                    <option value="hyundai">Hyundai</option>
                    <option value="kia">Kia</option>
                    <option value="nissan">Nissan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="vehicle-model" className="block text-sm font-medium text-gray-700">
                    Vehicle Model
                  </label>
                  <select
                    id="vehicle-model"
                    value={formData.vehicleModel}
                    onChange={(e) => updateFormData("vehicleModel", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#1e50a0] focus:outline-none focus:ring-1 focus:ring-[#1e50a0]"
                  >
                    <option value="" disabled>
                      Select model
                    </option>
                    <option value="camry">Camry</option>
                    <option value="corolla">Corolla</option>
                    <option value="civic">Civic</option>
                    <option value="accord">Accord</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="registration-year" className="block text-sm font-medium text-gray-700">
                    Registration Year
                  </label>
                  <select
                    id="registration-year"
                    value={formData.registrationYear}
                    onChange={(e) => updateFormData("registrationYear", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#1e50a0] focus:outline-none focus:ring-1 focus:ring-[#1e50a0]"
                  >
                    <option value="" disabled>
                      Select year
                    </option>
                    {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="ncd" className="block text-sm font-medium text-gray-700">
                    No Claim Discount (NCD)
                  </label>
                  <select
                    id="ncd"
                    value={formData.ncd}
                    onChange={(e) => updateFormData("ncd", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#1e50a0] focus:outline-none focus:ring-1 focus:ring-[#1e50a0]"
                  >
                    <option value="" disabled>
                      Select NCD
                    </option>
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-500">Tell us about yourself so we can contact you with quotes</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#1e50a0] focus:outline-none focus:ring-1 focus:ring-[#1e50a0]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    id="contact-number"
                    type="tel"
                    placeholder="8123 4567"
                    value={formData.contactNumber}
                    onChange={(e) => updateFormData("contactNumber", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#1e50a0] focus:outline-none focus:ring-1 focus:ring-[#1e50a0]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-[#1e50a0] focus:outline-none focus:ring-1 focus:ring-[#1e50a0]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Review & Submit</h3>
                <p className="text-sm text-gray-500">Please review your information before submitting</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Vehicle Information</h4>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-500">Vehicle Type:</dt>
                  <dd className="text-gray-900">
                    {formData.vehicleType === "private" ? "Private Car" : "Commercial Vehicle"}
                  </dd>

                  <dt className="text-gray-500">Vehicle Make:</dt>
                  <dd className="text-gray-900">{formData.vehicleMake || "Not specified"}</dd>

                  <dt className="text-gray-500">Vehicle Model:</dt>
                  <dd className="text-gray-900">{formData.vehicleModel || "Not specified"}</dd>

                  <dt className="text-gray-500">Registration Year:</dt>
                  <dd className="text-gray-900">{formData.registrationYear || "Not specified"}</dd>

                  <dt className="text-gray-500">No Claim Discount:</dt>
                  <dd className="text-gray-900">{formData.ncd || "0"}%</dd>
                </dl>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-500">Full Name:</dt>
                  <dd className="text-gray-900">{formData.fullName || "Not specified"}</dd>

                  <dt className="text-gray-500">Contact Number:</dt>
                  <dd className="text-gray-900">{formData.contactNumber || "Not specified"}</dd>

                  <dt className="text-gray-500">Email Address:</dt>
                  <dd className="text-gray-900">{formData.email || "Not specified"}</dd>
                </dl>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => updateFormData("termsAccepted", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1e50a0] focus:ring-[#1e50a0] mt-1"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to receive quotes and information from AUTO STREAM and its partners. I have read and agree to
                  the Terms of Service and Privacy Policy.
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="space-y-6 text-center py-8">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-900">Thank You!</h3>
                <p className="text-gray-500">
                  Your request has been submitted successfully. Our team will review your information and send you the
                  best insurance quotes shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-transparent bg-[#1e50a0] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1e50a0]/90 focus:outline-none focus:ring-2 focus:ring-[#1e50a0] focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1e50a0] focus:ring-offset-2"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1e50a0] focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-[#1e50a0] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1e50a0]/90 focus:outline-none focus:ring-2 focus:ring-[#1e50a0] focus:ring-offset-2"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.termsAccepted}
                  className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    formData.termsAccepted
                      ? "bg-[#1e50a0] hover:bg-[#1e50a0]/90 focus:ring-[#1e50a0]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
