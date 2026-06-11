"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faTrashCan,
  faArrowLeft,
  faBagShopping,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui";

export default function CartPage() {
  const { 
    cartItems, 
    cartTotal, 
    loading, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary-container text-primary">
            <FontAwesomeIcon icon={faBagShopping} size="3x" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Your cart is empty
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          Looks like you havent added any delicious home-cooked meals yet.
        </p>
        <div className="mt-10">
          <Link href="/meals">
            <Button size="lg" className="rounded-full px-8">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Shopping Cart
        </h1>
        <Link 
          href="/meals" 
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>

          <ul role="list" className="divide-y divide-primary-container border-b border-t border-primary-container">
            {cartItems.map((item) => (
              <li key={item.mealId._id} className="flex py-6 sm:py-10">
                <div className="shrink-0">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg sm:h-32 sm:w-32">
                    <Image
                      src={item?.mealId?.images?.[0] || item.mealId.mealImages?.[0]}
                      alt={item.mealId.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link 
                            href={`/meals/${item.mealId._id}`} 
                            className="font-bold text-text-primary hover:text-primary transition-colors"
                          >
                            {item.mealId.name}
                          </Link>
                        </h3>
                      </div>
                      <div className="mt-1 flex text-xs">
                        <p className="font-semibold text-text-secondary">
                          by {item.mealId.chefId?.kitchenName || "Home Chef"}
                        </p>
                      </div>
                      <p className="mt-1 text-sm font-bold text-primary">
                        ${item.mealId.price}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-28 items-center justify-between rounded-full border border-primary/20 px-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.mealId._id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="text-primary disabled:opacity-50"
                          >
                            <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.mealId._id, item.quantity + 1)}
                            disabled={loading}
                            className="text-primary disabled:opacity-50"
                          >
                            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.mealId._id)}
                            disabled={loading}
                            className="-m-2 inline-flex p-2 text-text-tertiary hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <span className="sr-only">Remove</span>
                            <FontAwesomeIcon icon={faTrashCan} className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex space-x-2 text-sm text-text-primary">
                    <span className="font-bold">Subtotal:</span>
                    <span className="font-extrabold text-primary">
                      ${(item.mealId.price * item.quantity).toFixed(2)}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-primary/10 sm:p-8 lg:col-span-5 lg:mt-0"
        >
          <h2 id="summary-heading" className="text-lg font-bold text-text-primary">
            Order Summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-secondary">Subtotal</dt>
              <dd className="text-sm font-bold text-text-primary">${cartTotal.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-primary-container pt-4">
              <dt className="text-sm text-text-secondary">Shipping estimate</dt>
              <dd className="text-sm font-bold text-text-primary">$0.00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-primary-container pt-4">
              <dt className="text-base font-bold text-text-primary">Order total</dt>
              <dd className="text-base font-extrabold text-primary">${cartTotal.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <Link href="/customer/checkout">
              <Button
                size="lg"
                className="w-full rounded-full bg-primary hover:bg-primary-container flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-lg transition-all"
                disabled={loading}
              >
                Go to Checkout
                <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-6">
            <p className="text-center text-xs text-text-secondary">
              Free delivery on your first order from any chef!
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
