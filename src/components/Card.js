"use client";

export default function Card({ children }) {
return (
<div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4">
<div className="w-full max-w-4xl p-6 sm:p-8 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl md:my-12 border border-white/20">
{children}
</div>
</div>
);
}
