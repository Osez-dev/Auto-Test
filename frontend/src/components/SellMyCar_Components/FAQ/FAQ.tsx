import React, { useState } from 'react';
import FaqImage from '../../../assets/images/istockphoto-947931326-170667a.jpg'
import downarrow from '../../../assets/images/icons8-down-arrow.gif'

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container w-[730px] mx-auto mt-5 border border-gray-300 rounded-lg overflow-hidden font-sans">
      {/* FAQ Header */}
      <div className="faq-header bg-gray-100 px-5 py-4 font-bold flex justify-between items-center">
        <span>FREQUENTLY ASKED QUESTIONS (FAQ)</span>
        <span className="arrow">
          <img src={downarrow} alt="Arrow" />
        </span>
      </div>

      <div className="faq-content flex justify-between px-5 py-4">
        {/* FAQ List (Left Side) */}
        <div className="faq-list flex-1 mr-5">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item border border-gray-300 rounded-md mb-2 bg-gray-200">
              <div 
                className="faq-question p-4 text-base flex justify-between cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="plus-icon font-bold">{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && <div className="faq-answer p-4 bg-white border-t border-gray-300">{faq.answer}</div>}
            </div>
          ))}
        </div>

        {/* Right-side Image/Graphic */}
        <div className="faq-image">
          <img src={FaqImage} alt="FAQ Illustration" className="w-[300px] h-auto" />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
