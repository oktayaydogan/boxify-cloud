"use client";

export default function CardTitle({ children }) {
return (
<div className="text-center mb-8">
<h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
{children}
</h1>
<div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
</div>
);
}
