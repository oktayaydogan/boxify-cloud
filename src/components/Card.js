"use client";

export default function ListsPage({ children }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="w-full max-w-3xl p-8 bg-white shadow-md rounded-lg md:my-12">
				{children}
			</div>
		</div>
	);
}
