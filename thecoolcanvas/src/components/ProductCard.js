"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Check } from "lucide-react";

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isAdded, setIsAdded] = useState(false);

  const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <div className="group relative border border-gray-200 rounded-2xl p-3 sm:p-4 bg-white transition-all hover:shadow-md">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-full">
              Save {discount}%
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 leading-snug">
            {product.title}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-medium mt-1">
            Coolcanvas
          </p>
          <div className="mt-1 flex items-center gap-2">
            {product.originalPrice > product.salePrice && (
              <p className="text-xs sm:text-sm font-medium text-gray-400 line-through">
                Rs. {product.originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-sm sm:text-base font-bold text-red-600">
              Rs. {product.salePrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Size Selection */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(size);
                }}
                className={`w-8 h-8 rounded-full border flex justify-center items-center text-xs font-medium transition-colors
                  ${selectedSize === size 
                    ? "border-black bg-black text-white" 
                    : "border-gray-200 bg-white text-gray-900 hover:border-gray-900"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`mt-4 flex w-full items-center justify-center rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${isAdded ? "bg-green-600 border-green-600 text-white" : "border-black bg-white text-black hover:bg-black hover:text-white"}`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added
            </>
          ) : (
            "Add to cart"
          )}
        </button>
      </div>
    </Link>
  );
}
