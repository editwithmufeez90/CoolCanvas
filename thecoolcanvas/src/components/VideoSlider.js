"use client";

import { useState, useRef, useEffect } from "react";

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

  const scrollToSlide = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.offsetWidth || 0;
    container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full overflow-hidden pb-12">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          div::-webkit-scrollbar { display: none; }
        `}} />
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex-none w-[50%] md:w-[33.333333%] lg:w-[25%] snap-start px-2 sm:px-3"
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
