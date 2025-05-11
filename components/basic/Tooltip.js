import React, { useState, useEffect } from "react";

export const Tooltip = ({ content, children, delay = 300 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isHovered) {
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isHovered, delay]);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <div
        className={`absolute z-50 px-2 py-1 text-sm dark:text-white bg-neutral-100 text-neutral-600 dark:bg-neutral-800 rounded shadow-md -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        {content}
      </div>
    </div>
  );
};
