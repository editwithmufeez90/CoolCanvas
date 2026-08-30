"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "Can I customize my own t-shirt?",
      answer: "Yes, you can contact us on Whatsapp or through Email. We'll print it with high-quality finish."
    },
    {
      question: "What is the fabric quality?",
      answer: "Our t-shirts are made from premium cotton with a comfortable oversized fit."
    },
    {
      question: "Do you offer Cash on Delivery?",
      answer: "No, we accept only pre-paid orders."
    },
    {
      question: "How long does delivery take?",
      answer: "Orders are delivered within 4–7 working days."
    },
    {
      question: "Can I return the product?",
      answer: "Custom products are non-returnable."
    },
    {
      question: "Is the print durable?",
      answer: "Yes, we use high-quality printing that lasts long without fading."
    }
  ];

  // Store multiple open indices so they behave like the screenshot where all can be open
  const [openIndices, setOpenIndices] = useState([0]); // First one open by default

  const toggle = (index) => {
    setOpenIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div 
                key={index} 
                className={`border border-gray-200 rounded-xl overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-white shadow-sm' : 'bg-white hover:bg-gray-50'}`}
              >
                <button
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggle(index)}
                >
                  <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-900 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                  )}
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-gray-600 font-medium">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
