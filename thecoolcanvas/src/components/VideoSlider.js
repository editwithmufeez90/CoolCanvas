"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function VideoSlider() {
  const items = [
    { type: "image", src: "/images/virat-kohli-1.png" },
    { type: "video", src: "/images/video2.mp4" },
    { type: "image", src: "/images/virat-kohli-2.png" },
    { type: "video", src: "/images/video1.mp4" },
  ];

  const [current, setCurrent] = useState(0);
  const scrollContainerRef = useRef(null);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  useEffect(() => {
    const updateMax = () => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const itemWidth = container.children[0]?.offsetWidth || 0;
      if (itemWidth > 0) {
        const visibleItems = Math.round(container.clientWidth / itemWidth);
        setMaxIndex(Math.max(0, items.length - visibleItems));
      }
    };
    
    updateMax();
    window.addEventListener('resize', updateMax);
    return () => window.removeEventListener('resize', updateMax);
  }, [items.length]);

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

  const scrollToSlide = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.offsetWidth || 0;
    container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
  };

  const nextSlide = () => {
    if (current < maxIndex) scrollToSlide(current + 1);
  };

  const prevSlide = () => {
    if (current > 0) scrollToSlide(current - 1);
  };

  return (
    <div className="relative w-full overflow-hidden pb-12 group">
      
      {/* Floating Left Arrow */}
      {current > 0 && (
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 -mt-6 z-10 bg-white/80 backdrop-blur hover:bg-white text-black p-3 rounded-full shadow-lg hidden md:group-hover:flex transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto snap-x snap-mandatory scroll-smooth ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          div::-webkit-scrollbar { display: none; }
        `}} />
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex-none w-[70%] md:w-[33.333333%] lg:w-[25%] snap-start px-2 sm:px-3"
          >
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              {item.type === 'video' ? (
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <img src={item.src} alt={`Influencer ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" draggable="false" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Right Arrow */}
      {current < maxIndex && (
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 -mt-6 z-10 bg-white/80 backdrop-blur hover:bg-white text-black p-3 rounded-full shadow-lg hidden md:group-hover:flex transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Bullets */}
      <div className={`absolute bottom-0 left-0 right-0 flex justify-center gap-3 z-10 transition-opacity ${maxIndex > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              current === index 
                ? "bg-black w-6 md:w-8" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
