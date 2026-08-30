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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

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

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 py-10 lg:py-16">
      
      {/* Invisible placeholder to define the height of the slider dynamically based on the image size */}
      <div className="w-[65%] md:w-[50%] lg:w-[40%] max-w-[1000px] mx-auto opacity-0 pointer-events-none">
        <img src={banners[0]} className="w-full h-auto" alt="placeholder" />
      </div>

      <div className="absolute inset-0 top-10 lg:top-16 bottom-10 lg:bottom-16 overflow-hidden">
        {banners.map((banner, index) => {
          const offset = getOffset(index);
          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;

          let translateX = "-50%";
          let scale = 1;
          let zIndex = 0;
          let opacity = 0;
          let blur = "blur-none";

          if (isCenter) {
            translateX = "-50%";
            scale = 1;
            zIndex = 30;
            opacity = 1;
            blur = "blur-[0.5px]";
          } else if (isLeft) {
            translateX = "-120%"; 
            scale = 0.85;
            zIndex = 20;
            opacity = 0.6;
            blur = "blur-[2px]";
          } else if (isRight) {
            translateX = "20%"; 
            scale = 0.85;
            zIndex = 20;
            opacity = 0.6;
            blur = "blur-[2px]";
          } else {
            // Hidden items behind the stack
            translateX = "-50%";
            scale = 0.5;
            zIndex = 10;
            opacity = 0;
            blur = "blur-md";
          }

          return (
            <div 
              key={index} 
              className={`absolute top-0 h-full w-[65%] md:w-[50%] lg:w-[40%] max-w-[1000px] transition-all duration-700 ease-out left-1/2 ${isCenter ? 'cursor-auto' : 'cursor-pointer'}`}
              style={{
                transform: `translateX(${translateX}) scale(${scale})`,
                zIndex,
                opacity
              }}
              onClick={() => {
                if (isLeft || isRight) setCurrent(index);
              }}
            >
              <Link href="#shop" className={`block w-full h-full transition-all duration-700 rounded-2xl overflow-hidden shadow-2xl ${blur} ${!isCenter && 'pointer-events-none'}`}>
                <img src={banner} className="w-full h-full object-cover" alt={`Banner ${index + 1}`} />
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
