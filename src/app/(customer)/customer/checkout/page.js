"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCreditCard,
  faTruck,
  faPhone,
  faLocationDot,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { ordersService } from "@/services";
import { Button, Input } from "@/components/ui";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, cartTotal, loading: cartLoading, fetchCart } = useCart();

  const [formData, setFormData] = useState({
    shippingAddress: "",
    contactPhone: "",
    paymentMethod: "paymob",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: user.address || "",
        contactPhone: user.phone || "",
      }));
    }
  }, [user]);

  // Redirect if cart is empty and not loading
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      router.replace("/customer/cart");
    }
  }, [cartItems, cartLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shippingAddress || !formData.contactPhone) {
      toast.error("Please provide shipping address and contact phone");
      return;
    }

    setLoading(true);
    try {
      const result = await ordersService.checkout(formData);
      
      if (result.success) {
        toast.success("Order placed successfully!");
        
        // Update global cart state
        await fetchCart();
        
        // If paymobUrl is provided, redirect to it
        if (result.data.paymobUrl) {
          window.location.href = result.data.paymobUrl;
        } else {
          // If cash or no redirect needed, go to orders
          router.push("/customer/orders");
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to place order";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link 
          href="/customer/cart" 
          className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
          Back to Cart
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary">
          Checkout
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        {/* Form Section */}
        <section className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Delivery Info */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 sm:p-8">
              <h2 className="flex items-center gap-3 text-lg font-bold text-text-primary">
                <FontAwesomeIcon icon={faTruck} className="text-primary" />
                Delivery Information
              </h2>
              
              <div className="mt-6 space-y-4">
                <Input
                  label="Shipping Address"
                  name="shippingAddress"
                  placeholder="Street name, Building number, Apartment..."
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Contact Phone"
                  name="contactPhone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 sm:p-8">
              <h2 className="flex items-center gap-3 text-lg font-bold text-text-primary">
                <FontAwesomeIcon icon={faCreditCard} className="text-primary" />
                Payment Method
              </h2>
              
              <div className="mt-6 space-y-4">
                <div 
                  className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
                    formData.paymentMethod === "paymob" 
                      ? "border-primary bg-primary/5" 
                      : "border-primary-container hover:border-primary/50"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "paymob" }))}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                      <FontAwesomeIcon icon={faCreditCard} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-sm">Credit Card / Wallet (Paymob)</p>
                      <p className="text-xs text-text-secondary">Secure payment via Paymob</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === "paymob" ? "border-primary" : "border-gray-300"
                  }`}>
                    {formData.paymentMethod === "paymob" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                </div>

                <div 
                  className="flex opacity-50 cursor-not-allowed items-center justify-between rounded-xl border-2 border-primary-container p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                      <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-sm">Cash on Delivery</p>
                      <p className="text-xs text-text-secondary">Currently unavailable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="hidden lg:flex bg-primary hover:bg-primary-container w-full rounded-full items-center justify-center gap-2 text-base font-bold shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="h-5 w-5 bg-primary hover:bg-primary-container animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Place Order & Pay
                  <span className="ml-2 font-extrabold">${cartTotal.toFixed(2)}</span>
                </>
              )}
            </Button>
          </form>
        </section>

        {/* Order Summary Section */}
        <section className="mt-12 lg:col-span-5 lg:mt-0">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10 sm:p-8">
              <h2 className="text-lg font-bold text-text-primary">Order Summary</h2>
              
              <ul role="list" className="mt-6 divide-y divide-primary-container overflow-hidden">
                {cartItems.map((item) => (
                  <li key={item.mealId._id} className="flex py-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.mealId.image || item.mealId.mealImages?.[0]}
                        alt={item.mealId.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-center">
                      <h3 className="text-sm font-bold text-text-primary">{item.mealId.name}</h3>
                      <p className="text-xs text-text-secondary">Quantity: {item.quantity}</p>
                      <p className="mt-1 text-sm font-bold text-primary">${(item.mealId.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-6 space-y-4 border-t border-primary-container pt-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-text-secondary">Subtotal</dt>
                  <dd className="text-sm font-bold text-text-primary">${cartTotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-text-secondary">Shipping</dt>
                  <dd className="text-sm font-bold text-primary">FREE</dd>
                </div>
                <div className="flex items-center justify-between border-t border-primary-container pt-4">
                  <dt className="text-base font-bold text-text-primary">Total</dt>
                  <dd className="text-base font-extrabold text-primary">${cartTotal.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            <Button
              onClick={handleSubmit}
              size="lg"
              className="lg:hidden bg-primary hover:bg-primary-container w-full rounded-full flex items-center justify-center gap-2 text-base font-bold shadow-md"
              disabled={loading}
            >
              {loading ? "Processing..." : `Place Order - $${cartTotal.toFixed(2)}`}
            </Button>

            <div className="text-center">
              <p className="text-xs text-text-tertiary">
                By placing your order, you agree to Sufras Terms and Conditions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
