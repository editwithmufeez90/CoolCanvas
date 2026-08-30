"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function HeroSlider() {
  const banners = [
    "/images/banner_new/IMG_20260829_224249.jpg.jpeg",
    "/images/banner_new/IMG_20260829_224310.jpg.jpeg", 
    "/images/banner_new/IMG_20260829_224326.jpg.jpeg",
    "/images/banner_new/IMG_20260829_224342.jpg.jpeg",
    "/images/banner_new/IMG_20260829_224357.jpg.jpeg"
  ];

  const [current, setCurrent] = useState(0);
  const scrollContainerRef = useRef(null);

  // Handle manual scroll to update pagination dots
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // Calculate which item is currently centered
    const scrollPosition = container.scrollLeft;
    // We get the first child to measure its width + gap (approximate)
    const itemWidth = container.scrollWidth / banners.length;
    
    if (itemWidth > 0) {
      const newIndex = Math.round(scrollPosition / itemWidth);
      // Ensure index is within bounds
      const safeIndex = Math.max(0, Math.min(newIndex, banners.length - 1));
      if (safeIndex !== current) {
        setCurrent(safeIndex);
      }
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / banners.length;
      
      const isLastSlide = current === banners.length - 1;
      const nextIndex = isLastSlide ? 0 : current + 1;
      
      container.scrollTo({
        left: nextIndex * itemWidth,
        behavior: "smooth"
      });
      
    }, 4000);
    
    return () => clearInterval(timer);
  }, [current, banners.length]);

  const scrollToSlide = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.scrollWidth / banners.length;
    
    container.scrollTo({
      left: index * itemWidth,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative w-full bg-gray-50 py-6 lg:py-12">
      
      {/* Native Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 scroll-smooth"
        style={{ 
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none' /* IE and Edge */
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          /* Hide scrollbar for Chrome, Safari and Opera */
          div::-webkit-scrollbar {
            display: none;
          }
        `}} />
        
        {/* We map original banners */}
        {banners.map((banner, index) => (
          <div 
            key={index} 
            className="flex-none w-[90%] sm:w-[85%] md:w-[60%] lg:w-[45%] max-w-[1000px] snap-center"
          >
            <Link href="#shop" className="block w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img src={banner} className="w-full h-auto object-cover" alt={`Banner ${index + 1}`} />
            </Link>
          </div>
        ))}
      </div>

      {/* Bullet Slider Controls */}
      <div className="absolute bottom-2 lg:bottom-4 left-0 right-0 flex justify-center gap-3 z-40">
        {banners.map((_, index) => (
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
