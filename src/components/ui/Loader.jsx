"use client";

import { DotLoader } from "react-spinners";

export default function Loader({ size = 60, color = "#964326", fullPage = false, className = "" }) {
  const loader = <DotLoader color={color} size={size} />;

  if (fullPage) {
    return (
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm ${className}`}>
        {loader}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      {loader}
    </div>
  );
}
