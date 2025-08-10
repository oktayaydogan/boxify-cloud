"use client";

export default function CardTitle({ children }) {
return (
<div className="text-center mb-8">
<h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
{children}
</h1>
<div className="h-1 w-24 bg-gray-600 rounded-full mx-auto"></div>
</div>
);
}
