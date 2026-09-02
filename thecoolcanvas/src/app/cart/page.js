"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight uppercase mb-8 text-center">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl"
          >
            <ShoppingCart className="h-20 w-20 text-gray-300 mb-6" />
            <p className="text-xl text-gray-500 mb-8">Your cart is currently empty.</p>
            <Link 
              href="/collections"
              className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="bg-white lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
            <div className="lg:col-span-8">
              <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {cart.map((product, productIdx) => (
                  <motion.li 
                    key={`${product.id}-${product.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: productIdx * 0.1 }}
                    className="flex py-6 sm:py-10"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32 border border-gray-200 shadow-sm"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link href={`/product/${product.slug}`} className="font-bold text-gray-900 hover:text-gray-800 line-clamp-2">
                                {product.title}
                              </Link>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 font-medium">Size: {product.size}</p>
                          <p className="mt-1 text-sm font-bold text-red-600">Rs. {product.salePrice}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9 flex flex-col items-start sm:items-end gap-4">
                          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(product.id, product.size, product.quantity - 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-bold text-sm bg-gray-50 border-l border-r border-gray-300">
                              {product.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(product.id, product.size, product.quantity + 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id, product.size)}
                            className="text-sm font-bold text-red-600 hover:text-red-500 uppercase tracking-widest underline decoration-2 underline-offset-4"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Order summary */}
            <div className="mt-16 rounded-3xl bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8 border border-gray-100 shadow-sm sticky top-32">
              <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide">Order Summary</h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-bold text-gray-900">Rs. {cartTotal}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-sm text-gray-600">Shipping</dt>
                  <dd className="text-sm font-bold text-green-600 uppercase">Free</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-extrabold text-gray-900 uppercase">Order total</dt>
                  <dd className="text-xl font-black text-gray-900">Rs. {cartTotal}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center rounded-full border border-transparent bg-black px-4 py-4 text-sm font-bold text-white shadow-md hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
