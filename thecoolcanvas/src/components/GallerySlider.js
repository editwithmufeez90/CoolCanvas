"use client";

import { useState, useEffect } from "react";
import { products } from "@/data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GallerySlider() {
  // Flatten all product images and gallery images into a single array
  const allImages = products.flatMap(p => [p.image, ...(p.gallery || [])]).filter(Boolean);
  
  // Keep a unique set of images so we don't repeat the same image back to back
  const uniqueImages = [...new Set(allImages)];
  
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1280) setItemsPerView(5);
      else if (window.innerWidth >= 1024) setItemsPerView(4);
      else if (window.innerWidth >= 768) setItemsPerView(3);
      else setItemsPerView(2);
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, uniqueImages.length - itemsPerView);

  // Auto-scroll logic
  useEffect(() => {
    if (maxIndex <= 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  const nextSlide = () => setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? maxIndex : prev - 1));

  if (uniqueImages.length === 0) return null;

  return (
    <div className="w-full bg-white py-16 overflow-hidden border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Header */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center mb-8 gap-8 text-gray-400">
            <button 
              onClick={prevSlide} 
              className="hover:text-black transition-transform hover:-translate-x-1 p-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold tracking-[0.2em] text-gray-900">
              {current + 1} / {maxIndex + 1}
            </span>
            <button 
              onClick={nextSlide} 
              className="hover:text-black transition-transform hover:translate-x-1 p-2"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Carousel Slider */}
        <div className="relative w-full">
           <div 
             className="flex transition-transform duration-700 ease-in-out"
             style={{ transform: `translateX(-${current * (100 / itemsPerView)}%)` }}
           >
             {uniqueImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <img 
                      src={img} 
                      alt={`Gallery view ${idx + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
