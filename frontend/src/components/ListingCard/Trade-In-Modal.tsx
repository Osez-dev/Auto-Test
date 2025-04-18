"use client"

import type React from "react"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { ArrowLeftRight, Check, X, Car, AlertTriangle } from "lucide-react"

interface TradeInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultVehicle?: {
    make: string
    model: string
    year: string
  }
}

// Simple utility function to conditionally join class names
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function TradeInModal({
  open,
  onOpenChange,
  
}: TradeInModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year:  "",
    vin: "",
    mileage: "",
    transmission: "",
    exteriorColor: "",
    interiorColor: "",
    owner: "",
    videoUrl: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    comments: "",
    exteriorCondition: "",
    interiorCondition: "",
    accidentHistory: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // setSelectedFile(e.target.files[0]);
    }
  };

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        backdropRef.current &&
        backdropRef.current.contains(event.target as Node) &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [open, onOpenChange])

  const steps = [
    { id: 1, title: "CAR INFORMATION", subtitle: "Add your vehicle details" },
    { id: 2, title: "VEHICLE CONDITION", subtitle: "Add your vehicle details" },
    { id: 3, title: "CONTACT DETAILS", subtitle: "Your contact details" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Only clear error when user types, but don't show new errors
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateAllSteps = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    // Validate Step 1 fields
    if (!formData.make.trim()) {
      newErrors.make = "Please fill Make field"
      isValid = false
    }
    if (!formData.model.trim()) {
      newErrors.model = "Please fill Model field"
      isValid = false
    }
    if (!formData.vin?.trim()) {
      newErrors.vin = "Please fill VIN field"
      isValid = false
    }
    if (formData.mileage && isNaN(Number(formData.mileage))) {
      newErrors.mileage = "Mileage must be a number"
      isValid = false
    }

    // Validate Step 3 fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Please fill First name field"
      isValid = false
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please fill Last name field"
      isValid = false
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Your E-mail address is invalid"
      isValid = false
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = "Your Phone is invalid"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (currentStep === 1) {
      // Validate Step 1 fields
      if (!formData.make?.trim()) {
        newErrors.make = "Please fill Make field"
        isValid = false
      }
      if (!formData.model?.trim()) {
        newErrors.model = "Please fill Model field"
        isValid = false
      }
      if (!formData.vin?.trim()) {
        newErrors.vin = "Please fill VIN field"
        isValid = false
      }
      if (formData.mileage && isNaN(Number(formData.mileage))) {
        newErrors.mileage = "Mileage must be a number"
        isValid = false
      }
    } else if (currentStep === 3) {
      // Validate Step 3 fields
      if (!formData.firstName?.trim()) {
        newErrors.firstName = "Required field"
        isValid = false
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = "Required field"
        isValid = false
      }
      if (!formData.email?.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Valid email is required"
        isValid = false
      }
      if (!formData.phone?.trim() || formData.phone.length < 10) {
        newErrors.phone = "Valid phone number is required"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    } else {
      // Show errors for current step when validation fails
      const firstErrorElement = document.querySelector('[aria-invalid="true"]')
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  // Modify the handleSubmit function to ensure errors are shown:
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        
        // Validate all steps, not just the current one
        if (validateAllSteps()) {
        console.log("Form submitted:", formData)
        alert("Your trade-in request has been submitted successfully!")
        setTimeout(() => {
            onOpenChange(false)
        }, 1000)
        } else {
        // Scroll to the first error
        const firstErrorElement = document.querySelector('[aria-invalid="true"]')
        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        }
    }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 overflow-y-auto"
      ref={backdropRef}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-5xl rounded-md overflow-hidden shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-black text-white p-6 flex items-center gap-4">
          <ArrowLeftRight className="text-blue-500 h-8 w-8" />
          <div className="-space-y-3">
            <h2 className="text-2xl font-bold text-white">TRADE IN</h2>
            <p className="text-gray-300 ">
              {/* {defaultVehicle.make} {defaultVehicle.model} {defaultVehicle.year} */}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="ml-auto p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 " />
          </button>
        </div>

        {/* Steps */}
        <div className="flex justify-between p-6 bg-white">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center">
              <div
                className={classNames(
                  "w-8 h-8 rounded-full flex items-center justify-center border mb-2",
                  step === s.id && "bg-blue-500 text-white border-blue-500",
                  step > s.id && "bg-white text-blue-500 border-blue-500",
                  step < s.id && "bg-white text-gray-400 border-gray-300",
                )}
              >
                {step > s.id ? <Check className="h-5 w-5" /> : s.id}
              </div>
              <h3 className="font-bold text-sm">{s.title}</h3>
              <p className="text-xs text-gray-500">{s.subtitle}</p>
              <div className={classNames("mt-2 h-1 w-full", step >= s.id ? "bg-blue-500" : "bg-gray-200")} />
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Car Information */}
          {step === 1 && (
            <div className="bg-gray-100 p-6 rounded-md space-y-4">
              {/* Row 1 - 3 fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="make" className="block mb-1 text-sm">
                    Make<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={!!errors.make}
                    required
                  />
                  {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make}</p>}
                </div>
                <div>
                  <label htmlFor="model" className="block mb-1 text-sm">
                    Model<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={!!errors.model}
                    required
                  />
                  {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
                </div>
                <div>
                  <label htmlFor="transmission" className="block mb-1 text-sm">
                    Transmission
                  </label>
                  <input
                    id="transmission"
                    name="transmission"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 2 - 3 fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="mileage" className="block mb-1 text-sm">
                    Mileage
                  </label>
                  <input
                    id="mileage"
                    name="mileage"
                    type="number"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={!!errors.mileage}
                  />
                  {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage}</p>}
                </div>
                <div>
                  <label htmlFor="year" className="block mb-1 text-sm">
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLSelectElement>)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="vin" className="block mb-1 text-sm">
                    VIN<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="vin"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={!!errors.vin}
                    required
                  />
                  {errors.vin && <p className="text-red-500 text-xs mt-1">{errors.vin}</p>}
                </div>
              </div>

              {/* Row 3 - Video URL and File Upload in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Upload your car Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center h-32">
                    <input
                      type="file"
                      id="carPhotos"
                      name="carPhotos"
                      className="hidden"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="carPhotos"
                      className="cursor-pointer px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 inline-block text-sm"
                    >
                      Choose file...
                    </label>
                    <p className="text-sm text-gray-500 mt-2">or drag and drop files here</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="videoUrl" className="block mb-1 text-sm">
                    Provide a hosted video url of your car
                  </label>
                  <input
                    id="videoUrl"
                    name="videoUrl"
                    type="url"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-sm"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>

              {/* Row 4 - Owner and Color Fields in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="exteriorColor" className="block mb-1 text-sm">
                    Exterior color
                  </label>
                  <input
                    id="exteriorColor"
                    name="exteriorColor"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="interiorColor" className="block mb-1 text-sm">
                    Interior color
                  </label>
                  <input
                    id="interiorColor"
                    name="interiorColor"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="owner" className="block mb-1 text-sm">
                    Owner
                  </label>
                  <input
                    id="owner"
                    name="owner"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Step 2: Vehicle Condition */}
          {step === 2 && (
            <div className="bg-gray-100 p-6 rounded-md space-y-8">
              {/* Exterior Condition */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-left">
                  <Car className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">What is the Exterior Condition?</h3>
                </div>
                <div className="flex flex-wrap gap-4 justify-start">
                  {["Extra clean", "Clean", "Average", "Below Average", "I don't know"].map((option) => (
                    <label key={option} className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exteriorCondition"
                        value={option}
                        checked={formData.exteriorCondition === option}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Interior Condition */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-left">
                  <Car className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">What is the Interior Condition?</h3>
                </div>
                <div className="flex flex-wrap gap-4 justify-start">
                  {["Extra clean", "Clean", "Average", "Below Average", "I don't know"].map((option) => (
                    <label key={option} className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="interiorCondition"
                        value={option}
                        checked={formData.interiorCondition === option}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accident History */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-left">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium">Has vehicle been in accident</h3>
                </div>
                <div className="flex flex-wrap gap-4 justify-start">
                  {["Yes", "No", "I don't know"].map((option) => (
                    <label key={option} className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="accidentHistory"
                        value={option}
                        checked={formData.accidentHistory === option}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details */}
          {step === 3 && (
            <div className="bg-gray-100 p-6 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1">
                    First name<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={!!errors.firstName}
                    required
                  />
                   {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">
                    Last name<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={!!errors.lastName}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1">
                    Email Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={!!errors.email}
                    required
                  />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1">
                    Phone number<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={!!errors.phone}
                    required
                  />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="col-span-2">
                  <label htmlFor="comments" className="block mb-1">
                    Comments
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            {step === 3 && (
              <div className="text-xs text-gray-500 max-w-md">
                By submitting this form, you will be requesting trade-in value at no obligation and will be contacted
                within 48 hours by a sales representative.
              </div>
            )}
            <div className="flex gap-2 ml-auto">
              {step > 1 && (
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={handlePrevious}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  
                >
                  SAVE AND FINISH
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

