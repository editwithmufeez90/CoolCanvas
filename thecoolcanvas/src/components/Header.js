"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Search, X, Menu, Phone } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { products } from "@/data/products";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

export function Header() {
  const { cart } = useCart();
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();

  // Search & Mobile Menu state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [hoveredPath, setHoveredPath] = useState(null);
  
  const isSearchMounted = useRef(false);
  const mobileSearchControls = useAnimation();
  const contactControls = useAnimation();
  const cartControls = useAnimation();
  const logoControls = useAnimation();

  useEffect(() => {
    if (!isSearchMounted.current) {
      isSearchMounted.current = true;
      mobileSearchControls.set({ width: isSearchActive ? "180px" : "40px", backgroundColor: "rgba(255, 255, 255, 0.5)", x: 0 });
      contactControls.set({ x: 0, scaleX: 1, scaleY: 1, rotate: 0 });
      cartControls.set({ x: 0, scaleX: 1, scaleY: 1, rotate: 0 });
      logoControls.set({ x: 0, scaleX: 1, scaleY: 1, rotate: 0 });
      return;
    }
    
    // Physics-based Domino & Magnetic Animation when Search Bar Expands/Collapses
    // Only run this physics simulation on mobile (width < 640px)
    if (window.innerWidth >= 640) return;

    if (isSearchActive) {
      // EXPAND (Magnetic Pull leftward for right icons, Push for logo)
      logoControls.start({
        x: [0, -10, 3, -1, 0], // Hit by expanding search
        scaleX: [1, 0.9, 1.05, 0.98, 1],
        transition: { duration: 0.5, ease: "easeInOut" }
      });
      mobileSearchControls.start({
        width: "180px",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        x: [0, -5, 0],
        transition: { 
          width: { type: "spring", stiffness: 400, damping: 15 },
          backgroundColor: { duration: 0.4 },
          x: { duration: 0.4, ease: "easeInOut" }
        }
      });
      contactControls.start({
        x: [0, -12, 4, -1, 0], // Sucked left towards search
        scaleX: [1, 0.9, 1.1, 0.95, 1],
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.05 }
      });
      cartControls.start({
        x: [0, -10, 3, -1, 0], // Sucked left towards contact
        scaleX: [1, 0.95, 1.05, 0.98, 1],
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.1 }
      });
    } else {
      // COLLAPSE (Domino push rightward for right icons, Vacuum pull for logo)
      logoControls.start({
        x: [0, 10, -2, 1, 0], // Pulled by collapsing search vacuum
        scaleX: [1, 1.05, 0.95, 1.02, 1],
        transition: { duration: 0.5, ease: "easeInOut" }
      });
      mobileSearchControls.start({
        width: "40px",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        x: [0, 15, -2, 0], // Bumps into contact
        transition: { 
          width: { type: "spring", stiffness: 400, damping: 15 },
          backgroundColor: { duration: 0.4 },
          x: { duration: 0.5, ease: "easeInOut" }
        }
      });
      contactControls.start({
        x: [0, 12, -4, 1, 0], // Hit by search, bumps into cart
        scaleX: [1, 1.1, 0.9, 1.05, 1],
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.1 }
      });
      cartControls.start({
        x: [0, 8, -2, 1, 0], // Hit by contact
        scaleX: [1, 1.05, 0.95, 1.02, 1],
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.15 }
      });
    }
  }, [isSearchActive, mobileSearchControls, contactControls, cartControls]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "Premium Collection", href: "/premium-collection" },
    { name: "Contact", href: "/contact" }
  ];

  useEffect(() => {
    if (cartItemsCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  // Fluid Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Split by spaces to allow multi-keyword matching
    const queryTerms = searchQuery.toLowerCase().split(" ").filter(Boolean);

    const results = products.filter(p => {
      const textToSearch = `${p.title} ${p.slug} ${p.description}`.toLowerCase();
      // Returns true only if ALL terms are found anywhere in the product text
      return queryTerms.every(term => textToSearch.includes(term));
    });

    setSearchResults(results);
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      const isOutsideDesktop = searchRef.current && !searchRef.current.contains(event.target);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);

      // If clicking inside EITHER search bar, do nothing.
      // We only close if clicking outside BOTH (or if they don't exist but we clicked outside what does).
      if (
        (!searchRef.current || isOutsideDesktop) &&
        (!mobileSearchRef.current || isOutsideMobile)
      ) {
        setIsSearchActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-black text-white text-xs font-bold uppercase tracking-widest py-2 overflow-hidden flex w-full whitespace-nowrap">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-marquee shrink-0 px-4" aria-hidden={i > 0 ? "true" : "false"}>
            🚚 Only Pre-Paid Orders Available 🚚 &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; 🔥 FLAT 30% OFF • ON ALL T-SHIRTS • LIMITED TIME OFFER &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
          </div>
        ))}
      </div>
      {/* Top Header Row (Logo, Search, Cart) */}
      <div className="bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24 lg:h-32 gap-4 relative">



            {/* Logo */}
            <motion.div animate={logoControls} className="flex shrink-0 items-center origin-left">
              <Link href="/" className="relative flex items-center justify-center">
                {/* Circular background scaled to the width of the logo to touch C and S */}
                <div className="absolute aspect-square w-[102%] bg-white/50 backdrop-blur-sm rounded-full -z-10"></div>
                <img src="/images/logo.png" alt="Cool Canvas Logo" className="h-16 sm:h-20 lg:h-24 w-auto object-contain" />
              </Link>
            </motion.div>

            {/* Search Bar - Desktop & Tablet */}
            <div className="hidden sm:flex absolute left-1/2 transform -translate-x-1/2 justify-center items-center w-full max-w-[500px] z-10 pointer-events-none">
              <motion.div 
                className="w-full relative pointer-events-auto" 
                ref={searchRef}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchActive(true);
                  }}
                  onFocus={() => setIsSearchActive(true)}
                  placeholder="Search tees, hoodies, oversized..."
                  className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-transparent rounded-full text-sm font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                />

                {/* Search Dropdown */}
                {isSearchActive && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.map(product => (
                            <Link
                              href={`/product/${product.slug}`}
                              key={product.id}
                              onClick={() => {
                                setIsSearchActive(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                            >
                              <img src={product.image} alt={product.title} className="w-12 h-12 rounded object-cover" />
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</p>
                                <p className="text-xs text-red-600 font-bold mt-1">Rs. {product.salePrice}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          No products found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Actions (Mobile Menu + Mobile Search + Cart) */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-4">

              {/* Mobile Expandable Inline Search */}
              <div className="sm:hidden flex items-center justify-end z-50" ref={mobileSearchRef}>
                <motion.div
                  animate={mobileSearchControls}
                  initial={{
                    width: isSearchActive ? "180px" : "40px",
                    backgroundColor: "rgba(255, 255, 255, 0.5)"
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center h-10 rounded-full backdrop-blur-sm"
                >
                  <AnimatePresence>
                    {!isSearchActive ? (
                      <motion.button
                        key="search-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsSearchActive(true)}
                        className="absolute right-0 w-10 h-10 flex items-center justify-center text-black hover:text-gray-600 z-10"
                        aria-label="Search"
                      >
                        <Search className="h-6 w-6" />
                      </motion.button>
                    ) : (
                      <motion.div
                        key="search-input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-between px-2"
                      >
                        <input
                          type="text"
                          autoFocus
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search..."
                          className="w-full bg-transparent border-none focus:outline-none text-sm pl-2"
                        />
                        <button
                          onClick={() => { setIsSearchActive(false); setSearchQuery(""); }}
                          className="p-1 shrink-0 text-gray-400 hover:text-black"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Inline Mobile Results */}
                        {searchQuery && (
                          <div className="absolute top-full right-0 w-[240px] mt-4 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                            <div className="max-h-80 overflow-y-auto">
                              {searchResults.length > 0 ? (
                                <div className="py-2">
                                  {searchResults.map(product => (
                                    <Link
                                      href={`/product/${product.slug}`}
                                      key={product.id}
                                      onClick={() => {
                                        setIsSearchActive(false);
                                        setSearchQuery("");
                                      }}
                                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                    >
                                      <img src={product.image} alt={product.title} className="w-10 h-10 rounded object-cover" />
                                      <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.title}</p>
                                        <p className="text-[10px] text-red-600 font-bold">Rs. {product.salePrice}</p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-4 text-center text-gray-500 text-xs">
                                  No products found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Mobile Contact Icon */}
              <motion.div
                animate={contactControls}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="lg:hidden block"
              >
                <Link href="/contact" className="block p-2.5 rounded-full bg-white/50 backdrop-blur-sm text-black hover:bg-white/70 transition-colors" aria-label="Contact">
                  <Phone className="h-6 w-6" />
                </Link>
              </motion.div>

              {/* Cart Icon */}
              <motion.div
                animate={cartControls}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="block"
              >
                <Link
                  href="/cart"
                  className={`block relative p-2.5 rounded-full bg-white/50 backdrop-blur-sm transition-colors ${isAnimating ? "text-blue-600 scale-110" : "text-black hover:bg-white/70"} transform duration-200`}
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tier (Floating below the white header) */}
      <div className="w-full pointer-events-none relative pb-6">
        <div 
          className="hidden lg:flex p-1.5 mt-2 mx-auto bg-white/50 backdrop-blur-md border border-gray-200 rounded-full w-full max-w-[500px] shadow-lg pointer-events-auto"
        >
          <div className="flex items-center justify-between w-full relative rounded-full overflow-hidden">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center justify-center h-10 text-[15px] leading-none transition-colors px-5 rounded-full z-10 ${isActive
                      ? "text-white font-semibold shadow-sm"
                      : "text-gray-600 hover:text-black font-semibold"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-black rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 250, damping: 22, mass: 1.2 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>



      {/* Mobile Bottom Navigation Pill */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
        <div 
          className="p-1.5 bg-white/50 backdrop-blur-md border border-gray-200 rounded-full shadow-2xl pointer-events-auto overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: "none" }}
          onMouseLeave={() => setHoveredPath(null)}
        >
          <div className="flex items-center gap-1 rounded-full overflow-hidden relative w-max mx-auto">
            {navLinks.filter(l => l.name !== "Contact").map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredPath === link.href;
              const showIndicator = hoveredPath ? isHovered : isActive;
              
              return (
                <Link
                  key={`mobile-${link.name}`}
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  className={`relative flex items-center justify-center snap-center h-9 text-[12px] leading-none whitespace-nowrap transition-colors px-4 rounded-full z-10 ${showIndicator
                      ? "text-white font-semibold shadow-sm"
                      : "text-gray-600 hover:text-black font-semibold"
                    }`}
                >
                  {showIndicator && (
                    <motion.div
                      layoutId="active-mobile-nav-pill"
                      className="absolute inset-0 bg-black rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 250, damping: 22, mass: 1.2 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
