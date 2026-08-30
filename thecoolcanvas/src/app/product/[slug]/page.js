"use client";

import { products } from "@/data/products";
import { notFound, useRouter } from "next/navigation";
import { useState, use } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Minus, Plus, Check } from "lucide-react";

export default function ProductPage({ params }) {
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  const product = products.find((p) => p.slug === slug);
  const router = useRouter();
  const { addToCart, setDirectCheckoutItem } = useCart();
  
  if (!product) {
    notFound();
  }

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setDirectCheckoutItem({ ...product, size: selectedSize, quantity });
    router.push("/checkout");
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < (product.stock || 10)) setQuantity(q => q + 1);
  };

  // Get other products for "You may also like"
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="w-full relative aspect-[3/4] lg:aspect-auto lg:h-[700px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto p-1 pb-2 scrollbar-hide">
              {product.gallery?.map((img, idx) => (
                <button 
                  key={idx}
                  className={`rounded-xl overflow-hidden shrink-0 w-24 h-24 lg:w-28 lg:h-28 transition-all ${activeImage === img ? 'ring-2 ring-black ring-offset-2' : 'hover:opacity-75'}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${product.title} Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="mt-10 lg:mt-0">
            <p className="text-gray-500 uppercase tracking-widest text-sm mb-2 font-medium">Coolcanvas</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 leading-tight mb-4">
              {product.title}
            </h1>
            
            {/* Pricing */}
            <div className="flex items-center gap-3 mb-2">
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through font-medium">
                  Rs. {product.originalPrice}.00
                </span>
              )}
              <span className="text-2xl font-bold text-red-600">
                Rs. {product.salePrice}.00
              </span>
              {product.originalPrice && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Save {Math.round((1 - product.salePrice/product.originalPrice) * 100)}%
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-6 underline underline-offset-4 decoration-gray-300">
              Shipping calculated at checkout.
            </p>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              <p className="text-sm text-gray-700 font-medium">Low stock: {product.stock || 10} left</p>
            </div>

            {/* Variants / Sizes */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-900 block mb-3">Size</label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] h-12 px-4 rounded-full border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-900 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
               <label className="text-sm font-medium text-gray-900 block mb-3">Quantity</label>
               <div className="flex items-center border border-gray-300 rounded-full w-32 h-12">
                  <button onClick={handleDecreaseQuantity} className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors">
                     <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium text-gray-900">{quantity}</span>
                  <button onClick={handleIncreaseQuantity} className="flex-1 flex justify-center text-gray-500 hover:text-black transition-colors">
                     <Plus className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className={`w-full border-2 h-14 rounded-full font-bold text-base transition-colors flex justify-center items-center ${isAdded ? "bg-green-600 border-green-600 text-white" : "bg-white border-black text-black hover:bg-gray-50"}`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added
                  </>
                ) : (
                  "Add to cart"
                )}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-black text-white h-14 rounded-full font-bold text-base hover:bg-gray-900 transition-colors"
              >
                Buy it now
              </button>
            </div>



            {/* Description */}
            <div className="prose prose-sm text-gray-700 max-w-none">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Lift Your Game, Wear Your Legacy</h3>
              <p className="mb-4">
                This <strong>{product.title}</strong> is designed to sculpt your silhouette and bring elite energy to your wardrobe.
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-gray-300">
                <li><strong>The GOAT Fit:</strong> A bold, oversized structure that emphasizes your frame and mirrors the presence of a legend.</li>
                <li><strong>Performance Aesthetic:</strong> Elevates your streetwear game with a clean, high-contrast tribute.</li>
                <li><strong>Superior Comfort:</strong> Ultra-soft fabric that relieves the tension of the day, letting you move with ease.</li>
                <li><strong>Details:</strong> {product.description}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="border-t border-gray-200 mt-16 pt-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-8">You may also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
               {relatedProducts.map(related => (
                  <ProductCard key={related.id} product={related} />
               ))}
            </div>
         </div>
      </div>
      
    </div>
  );
}
