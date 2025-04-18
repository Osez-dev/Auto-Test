"use client"

import { useState } from "react"
import MultiStepQuotationForm from "./quotation-form"

export default function GetQuoteButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Button to Open Modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-[#1e50a0] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#1e50a0]/90 focus:outline-none"
      >
        Get a Quotation
      </button>

      {/* Custom Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-[#1e50a0]">Get Your Car Insurance Quote</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Form Content */}
            <div className="mt-4">
              <MultiStepQuotationForm onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}