"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQItem[]
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1e50a0]">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about insurance coverage and policies
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <button onClick={() => toggleFAQ(index)} className="flex w-full items-start justify-between text-left">
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <span className="ml-6 flex h-7 items-center">
                    <svg
                      className={`h-6 w-6 transform ${openIndex === index ? "-rotate-180" : "rotate-0"} text-gray-500`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {openIndex === index && (
                  <div className="mt-2 pr-12">
                    <p className="text-base text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="mx-auto max-w-2xl rounded-lg bg-[#f0f4f7] p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Still have questions?</h3>
            <p className="mt-2 text-gray-600">
              Our customer support team is here to help you with any questions you may have about our insurance
              policies.
            </p>
            <div className="mt-4">
              <a
                href="#"
                className="inline-block bg-[#1e50a0] text-white py-2 px-6 rounded-md hover:bg-[#1e50a0]/90 focus:outline-none focus:ring-2 focus:ring-[#1e50a0] focus:ring-offset-2"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
