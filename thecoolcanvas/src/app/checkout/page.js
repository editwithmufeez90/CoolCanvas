"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal, directCheckoutItem, setDirectCheckoutItem, updateQuantity } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const checkoutCart = directCheckoutItem ? [directCheckoutItem] : cart;
  const subtotal = directCheckoutItem ? (directCheckoutItem.salePrice * directCheckoutItem.quantity) : cartTotal;
  
  const unique599Ids = new Set(checkoutCart.filter(item => item.salePrice === 599).map(item => item.id));
  const hasPremiumProduct = checkoutCart.some(item => item.salePrice !== 599);
  const are599Eligible = unique599Ids.size >= 2 || hasPremiumProduct;

  let discountAmount = 0;
  if (discountApplied) {
    checkoutCart.forEach(item => {
      if (item.salePrice !== 599 || are599Eligible) {
        discountAmount += (item.salePrice * item.quantity) * 0.10;
      }
    });
  }

  const checkoutTotal = subtotal - discountAmount;

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1 || newQuantity > (item.stock || 10)) return;
    if (directCheckoutItem) {
      setDirectCheckoutItem({ ...directCheckoutItem, quantity: newQuantity });
    } else {
      updateQuantity(item.id, item.size, newQuantity);
    }
  };

  const WHATSAPP_NUMBER = "919004049682"; // Replace with actual number

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    if (couponCode.toUpperCase() === "NEW10") {
      const unique599IdsLocal = new Set(checkoutCart.filter(item => item.salePrice === 599).map(item => item.id));
      const hasPremiumLocal = checkoutCart.some(item => item.salePrice !== 599);
      const are599EligibleLocal = unique599IdsLocal.size >= 2 || hasPremiumLocal;
      const hasEligibleItems = hasPremiumLocal || are599EligibleLocal;

      if (hasEligibleItems) {
        setDiscountApplied(true);
      } else {
        setDiscountApplied(false);
        setCouponError("This offer requires at least 2 different ₹599 products or any premium product.");
      }
    } else {
      setCouponError("Invalid coupon code.");
      setDiscountApplied(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (checkoutCart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);

    const orderDetails = `New Order from ${formData.name}!

Products:
${checkoutCart.map(item => `- ${item.title} (Size: ${item.size}, Qty: ${item.quantity}) - Rs. ${item.salePrice * item.quantity}\n  Product Image: ${window.location.origin}${item.image}`).join('\n\n')}

${discountApplied && discountAmount > 0 ? `Subtotal: Rs. ${subtotal.toFixed(2)}\nDiscount (NEW10): - Rs. ${discountAmount.toFixed(2)}\n` : ''}Total: Rs. ${checkoutTotal.toFixed(2)}

Shipping Address:
${formData.address}, ${formData.pincode}
Phone: ${formData.phone}
Email: ${formData.email}`;

    // Fire email redundacy API
    try {
      await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderDetails,
          email: formData.email,
          name: formData.name
        })
      });
    } catch (error) {
      console.error("Failed to send backup email", error);
    }

    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderDetails)}`;
    window.location.href = whatsappUrl;
    setDirectCheckoutItem(null);
    setIsSubmitting(false);
  };

  if (checkoutCart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-white">
        <h1 className="text-3xl font-bold mb-4 uppercase tracking-tighter text-black">Your cart is empty</h1>
        <Link href="/" className="text-black font-bold uppercase underline tracking-widest hover:text-gray-600 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row-reverse">
      {/* Right Column: Order Summary (Shows first on mobile, then side-by-side) */}
      <div className="w-full lg:w-[45%] bg-gray-50 border-b lg:border-b-0 lg:border-l border-gray-200">
        <div className="max-w-xl mx-auto lg:mx-0 lg:max-w-none px-4 py-8 sm:px-6 lg:px-12 lg:sticky lg:top-0 h-full lg:h-screen lg:overflow-y-auto">
          
          <h2 className="sr-only">Order summary</h2>
          
          <ul className="divide-y divide-gray-200 text-sm font-medium text-gray-900">
            {checkoutCart.map((item) => (
              <li key={`${item.id}-${item.size}`} className="py-6 flex items-start space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-md border border-gray-200 bg-white overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-auto space-y-1">
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <p className="text-gray-500">Size: {item.size}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={() => handleUpdateQuantity(item, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 transition-colors">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => handleUpdateQuantity(item, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 transition-colors">+</button>
                  </div>
                </div>
                <p className="font-bold text-base whitespace-nowrap">Rs. {(item.salePrice * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>

          <div className="py-6 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border outline-none bg-white"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  couponCode.trim() ? "bg-black text-white hover:bg-gray-800" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Apply
              </button>
            </div>
            {discountApplied && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                'NEW10' applied! 10% discount on eligible items.
              </p>
            )}
            {couponError && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                {couponError}
              </p>
            )}
          </div>

          <dl className="space-y-4 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd>Rs. {subtotal.toFixed(2)}</dd>
            </div>
            {discountApplied && discountAmount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <dt>Discount (NEW10)</dt>
                <dd>- Rs. {discountAmount.toFixed(2)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Shipping</dt>
              <dd className="text-gray-900 uppercase font-bold text-xs tracking-wider">Free</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-lg font-bold">
              <dt className="text-base text-gray-900">Total</dt>
              <dd className="text-xl">
                <span className="text-gray-500 text-xs font-normal mr-2">INR</span>
                Rs. {checkoutTotal.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Left Column: Form Details */}
      <div className="w-full lg:w-[55%] bg-white">
        <div className="max-w-xl mx-auto lg:ml-auto lg:mr-0 px-4 pt-8 pb-24 sm:px-6 lg:px-12 lg:pr-24">
          
          <div className="flex flex-col mb-8 gap-4">
            <img src="/images/logo.png" alt="Cool Canvas Logo" className="h-16 lg:h-24 w-auto object-contain self-start" />
            <button onClick={() => { setDirectCheckoutItem(null); router.back(); }} className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-black hover:text-gray-600 transition-colors self-start">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back</span>
            </button>
          </div>

          <form onSubmit={handleCheckout}>
            <div className="mb-10">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Contact</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                    title="Please enter a valid email address (e.g., name@example.com)"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3.5 border transition-colors outline-none"
                  />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    maxLength="10"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    placeholder="Phone number (10 digits)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3.5 border outline-none"
                  />
                </div>
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black h-4 w-4" defaultChecked />
                  <span>Email me with news and offers</span>
                </label>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Delivery</h2>
              <div className="space-y-4">
                <div className="relative">
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3.5 border outline-none bg-white">
                    <option>India</option>
                  </select>
                </div>

                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3.5 border outline-none"
                />

                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3.5 border outline-none"
                />

                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit Indian PIN code"
                  placeholder="PIN code (6 digits)"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3.5 border outline-none"
                />
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Payment</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-500 text-center flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                <p>All transactions are secure and encrypted.</p>
                <p className="mt-2 text-xs">You will be redirected to WhatsApp to complete your purchase via UPI.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-black px-4 py-4 text-base font-bold text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Pay now"}
            </button>
            
            <div className="mt-6 flex justify-center space-x-4 border-t border-gray-200 pt-6">
              <span className="text-xs text-gray-500 hover:text-black cursor-pointer">Refund policy</span>
              <span className="text-xs text-gray-500 hover:text-black cursor-pointer">Privacy policy</span>
              <span className="text-xs text-gray-500 hover:text-black cursor-pointer">Terms of service</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
