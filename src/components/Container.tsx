import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}
export default function Container({ children, className }: Props) {
  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={`px-4 py-4 max-w-3xl w-full flex items-center ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
