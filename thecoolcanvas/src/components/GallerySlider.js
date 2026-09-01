"use client";

import { useState, useRef, useEffect } from "react";
import { products } from "@/data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GallerySlider() {
  // Show only the main image for each product in the global gallery to avoid repetition
  const uniqueImages = [...new Set(products.map(p => p.image).filter(Boolean))];
  
  const [current, setCurrent] = useState(0);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.offsetWidth || 0;
    if (itemWidth > 0) {
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      if (newIndex !== current) setCurrent(newIndex);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
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
        
        <div className="flex justify-center items-center mb-8 gap-8 text-gray-400">
          <span className="text-sm font-semibold tracking-[0.2em] text-gray-900">
            GALLERY
          </span>
        </div>

        {/* Carousel Slider */}
        <div className="relative w-full group">
           
           {/* Floating Left Arrow */}
           <button 
             onClick={prevSlide}
             className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur hover:bg-white text-black p-3 rounded-full shadow-lg hidden md:group-hover:flex transition-all"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>

           <style dangerouslySetInnerHTML={{__html: `
             .hide-scrollbar::-webkit-scrollbar { display: none; }
           `}} />

           <div 
             ref={scrollContainerRef}
             onScroll={handleScroll}
             onMouseDown={handleMouseDown}
             onMouseLeave={handleMouseLeave}
             onMouseUp={handleMouseUp}
             onMouseMove={handleMouseMove}
             className={`flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
           >
             {uniqueImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="flex-none w-[75%] md:w-[33.333333%] lg:w-[25%] xl:w-[20%] snap-start px-2 sm:px-3"
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

           {/* Floating Right Arrow */}
           <button 
             onClick={nextSlide}
             className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur hover:bg-white text-black p-3 rounded-full shadow-lg hidden md:group-hover:flex transition-all"
           >
             <ChevronRight className="w-6 h-6" />
           </button>
        </div>

      </div>
    </div>
  );
}
