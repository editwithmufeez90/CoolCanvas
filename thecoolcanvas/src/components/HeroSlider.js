"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function HeroSlider() {
  const originalBanners = [
    "/images/banner_new/IMG_20260829_224249.jpg.jpeg",
    "/images/banner_new/IMG_20260829_224310.jpg.jpeg", 
    "/images/banner_new/IMG_20260829_224326.jpg.jpeg",
    "/images/banner_new/IMG_20260829_224342.jpg.jpeg",
    "/images/banner_new/IMG_20260829_224357.jpg.jpeg"
  ];

  // Ensure we always have at least 3 banners for the 3D effect to work
  const banners = originalBanners.length < 3 
    ? [...originalBanners, ...originalBanners, ...originalBanners].slice(0, 3)
    : originalBanners;

  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 50;

  const handleTouchStart = (clientX) => {
    setTouchStart(clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (clientX) => {
    if (touchStart === null) return;
    setDragOffset(clientX - touchStart);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (touchStart === null) return;
    
    if (dragOffset > minSwipeDistance) {
      setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    } else if (dragOffset < -minSwipeDistance) {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }
    
    setTouchStart(null);
    setDragOffset(0);
  };

  useEffect(() => {
    if (isDragging) return; // Pause auto-play while dragging
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length, isDragging]);

  const getOffset = (index) => {
    let diff = index - current;
    const total = banners.length;
    
    if (diff > Math.floor(total / 2)) {
      diff -= total;
    } else if (diff < -Math.floor(total / 2)) {
      diff += total;
    }
    
    return diff;
  };

  // Estimate item width for dragging calculation (65% of screen on mobile, max 1000)
  const itemWidth = typeof window !== "undefined" ? Math.min(window.innerWidth * 0.65, 1000) : 300;
  // How much of the item width we have dragged (e.g., -0.5 to 0.5)
  const dragProgress = isDragging ? dragOffset / itemWidth : 0;

  return (
    <div 
      className="relative w-full overflow-hidden bg-gray-50 py-10 lg:py-16 select-none"
      onTouchStart={(e) => handleTouchStart(e.targetTouches[0].clientX)}
      onTouchMove={(e) => handleTouchMove(e.targetTouches[0].clientX)}
      onTouchEnd={handleTouchEnd}
      // Mouse drag support for desktop testing
      onMouseDown={(e) => handleTouchStart(e.clientX)}
      onMouseMove={(e) => {
        if (isDragging) handleTouchMove(e.clientX);
      }}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      
      {/* Invisible placeholder to define the height of the slider dynamically based on the image size */}
      <div className="w-[65%] md:w-[50%] lg:w-[40%] max-w-[1000px] mx-auto opacity-0 pointer-events-none">
        <img src={banners[0]} className="w-full h-auto" alt="placeholder" />
      </div>

      <div className="absolute inset-0 top-10 lg:top-16 bottom-10 lg:bottom-16 overflow-hidden">
        {banners.map((banner, index) => {
          // Base integer offset (-2, -1, 0, 1, 2)
          const baseOffset = getOffset(index);
          
          // Continuous offset factors in the drag progress. 
          // If we drag left (negative dragOffset), dragProgress is negative. 
          // A center item (0) shifts towards left (- offset).
          const continuousOffset = baseOffset + dragProgress;
          
          const absOffset = Math.abs(continuousOffset);

          // Interpolated values
          // Position: -50% is center, -120% is left, 20% is right. 
          // It shifts by 70% per offset unit.
          const translateX = -50 + continuousOffset * 70;
          
          // Scale: 1 at center, drops by 0.15 per unit.
          const scale = Math.max(0.5, 1 - absOffset * 0.15);
          
          // Opacity: 1 at center, drops to 0 at offset >= 2
          const opacity = Math.max(0, 1 - absOffset * 0.5);
          
          // Z-Index: Highest at center.
          const zIndex = Math.round(30 - absOffset * 10);
          
          // Blur: 0 at center, 2px at side.
          const blurValue = absOffset * 2;

          // Only enable pointer events on the roughly centered item
          const isCenterPointer = absOffset < 0.5;

          return (
            <div 
              key={index} 
              className={`absolute top-0 h-full w-[65%] md:w-[50%] lg:w-[40%] max-w-[1000px] left-1/2 ${isCenterPointer ? 'cursor-auto' : 'cursor-pointer'} ${isDragging ? 'transition-none' : 'transition-all duration-700 ease-out'}`}
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                zIndex,
                opacity
              }}
              onClick={() => {
                if (!isCenterPointer && !isDragging) {
                  setCurrent(index);
                }
              }}
            >
              <Link 
                href="#shop" 
                className={`block w-full h-full rounded-2xl overflow-hidden shadow-2xl ${!isCenterPointer && 'pointer-events-none'} ${isDragging ? 'transition-none' : 'transition-all duration-700 ease-out'}`}
                style={{ filter: `blur(${blurValue}px)` }}
                onClick={(e) => {
                  if (Math.abs(dragOffset) > 10) e.preventDefault();
                }}
              >
                <img src={banner} className="w-full h-full object-cover" alt={`Banner ${index + 1}`} draggable="false" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Bullet Slider Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-40">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
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
