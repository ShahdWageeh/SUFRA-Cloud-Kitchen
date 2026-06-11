"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import AddToCartButton from "./AddToCartButton";

export default function MealActions({ mealId }) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-12 w-36 items-center justify-between rounded-full border border-primary/20 px-4">
        <button 
          aria-label="Decrease quantity" 
          className="text-primary disabled:opacity-50"
          onClick={handleDecrease}
          disabled={quantity <= 1}
        >
          <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
        </button>
        <span className="font-bold">{quantity}</span>
        <button 
          aria-label="Increase quantity" 
          className="text-primary"
          onClick={handleIncrease}
        >
          <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
        </button>
      </div>
      <AddToCartButton 
        mealId={mealId}
        quantity={quantity}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-container"
      >
        <FontAwesomeIcon icon={faCartShopping} className="h-4 w-4" />
        Add to Cart
      </AddToCartButton>
    </div>
  );
}
