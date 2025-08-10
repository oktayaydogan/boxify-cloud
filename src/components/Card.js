"use client";

export default function Card({ children }) {
return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4">
<div className="w-full max-w-4xl p-6 sm:p-8 bg-white shadow-xl rounded-2xl md:my-12 border border-gray-100">
{children}
</div>
</div>
);
}
