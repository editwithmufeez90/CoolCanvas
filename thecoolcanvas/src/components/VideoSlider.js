"use client";

import { useState, useEffect } from "react";

export function VideoSlider() {
  const items = [
    { type: "image", src: "/images/virat-kohli-1.png" },
    { type: "video", src: "/images/video2.mp4" },
    { type: "image", src: "/images/virat-kohli-2.png" },
    { type: "video", src: "/images/video1.mp4" },
  ];

  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(3);
      } else {
        setItemsPerView(2);
      }
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  return (
    <div className="relative w-full overflow-hidden pb-12">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * (100 / itemsPerView)}%)` }}
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className="shrink-0 px-2 sm:px-3"
            style={{ width: `${100 / itemsPerView}%` }}
          >
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              {item.type === 'video' ? (
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <img src={item.src} alt={`Influencer ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bullets */}
      <div className={`absolute bottom-0 left-0 right-0 flex justify-center gap-3 z-10 transition-opacity ${maxIndex > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
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
