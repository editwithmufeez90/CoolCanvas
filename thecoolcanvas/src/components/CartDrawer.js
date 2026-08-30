"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-transform ease-in-out duration-300">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 uppercase">Your Cart</h2>
              <button
                type="button"
                className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <ShoppingCart className="h-12 w-12" />
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cart.map((product) => (
                    <li key={`${product.id}-${product.size}`} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{product.title}</h3>
                            <p className="ml-4 font-bold">Rs. {product.salePrice}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Size: {product.size}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button 
                              onClick={() => updateQuantity(product.id, product.size, product.quantity - 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-1 font-medium">{product.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(product.id, product.size, product.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id, product.size)}
                              className="font-medium text-red-600 hover:text-red-500 underline uppercase text-xs tracking-wider"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p className="uppercase font-bold">Subtotal</p>
                  <p className="font-bold text-xl">Rs. {cartTotal}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-gray-800 uppercase tracking-widest transition-colors w-full"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
