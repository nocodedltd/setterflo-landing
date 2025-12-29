import React from 'react';

/**
 * Auth Layout
 * Simple centered layout for authentication pages
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
