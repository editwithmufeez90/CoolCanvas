"use client";

import { useState, useRef, useEffect } from "react";
import { products } from "@/data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GallerySlider() {
  const allImages = products.flatMap(p => [p.image, ...(p.gallery || [])]).filter(Boolean);
  const uniqueImages = [...new Set(allImages)];
  
  const [current, setCurrent] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.offsetWidth || 0;
    if (itemWidth > 0) {
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      if (newIndex !== current) setCurrent(newIndex);
    }
  };

  const nextSlide = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.offsetWidth || 0;
    container.scrollBy({ left: itemWidth, behavior: 'smooth' });
  };

  const prevSlide = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.offsetWidth || 0;
    container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  };

  // Auto-scroll logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const itemWidth = container.children[0]?.offsetWidth || 0;
      
      // If we've reached the end, loop back
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  if (uniqueImages.length === 0) return null;

  return (
    <div className="w-full bg-white py-16 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Header */}
        <div className="flex justify-center items-center mb-8 gap-8 text-gray-400">
          <button 
            onClick={prevSlide} 
            className="hover:text-black transition-transform hover:-translate-x-1 p-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold tracking-[0.2em] text-gray-900">
            GALLERY
          </span>
          <button 
            onClick={nextSlide} 
            className="hover:text-black transition-transform hover:translate-x-1 p-2"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Slider */}
        <div className="relative w-full">
           <div 
             ref={scrollContainerRef}
             onScroll={handleScroll}
             className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
           >
             <style dangerouslySetInnerHTML={{__html: `
               div::-webkit-scrollbar { display: none; }
             `}} />
             {uniqueImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="flex-none w-[50%] md:w-[33.333333%] lg:w-[25%] xl:w-[20%] snap-start px-2 sm:px-3"
                >
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <img 
                      src={img} 
                      alt={`Gallery view ${idx + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                      draggable="false"
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
