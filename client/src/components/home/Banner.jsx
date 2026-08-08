import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <div
      className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-1000 ease-in-out ${
        isVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="relative w-full px-12 py-2 font-medium text-sm text-primary text-center bg-gradient-to-r from-[var(--color-banner-start)] to-[var(--color-banner-end)]">
          <p className="truncate">
            <span className="mr-2 inline-flex items-center rounded-lg bg-primary px-3.5 py-1.5 text-sm font-semibold leading-none text-white">
              New
            </span>
            AI Features Added
          </p>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            aria-label="Close banner"
            title="Close banner"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
