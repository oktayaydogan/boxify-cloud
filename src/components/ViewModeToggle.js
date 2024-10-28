"use client";

import { FaList, FaTh } from "react-icons/fa";

export default function ViewModeToggle({ viewMode, setViewMode }) {
	const ViewModeButton = ({ mode, icon: Icon, label }) => (
		<button
			onClick={() => setViewMode(mode)}
			aria-label={label}
			className={`px-4 py-2 flex items-center gap-2 ${
				viewMode === mode
					? "bg-blue-500 text-white"
					: "bg-gray-200 text-gray-800"
			} ${mode === "list" ? "rounded-l-lg" : "rounded-r-lg"}`}
		>
			<Icon />
		</button>
	);

	return (
		<div className="flex h-10">
			<ViewModeButton mode="list" icon={FaList} label="Liste görünümüne geç" />
			<ViewModeButton mode="grid" icon={FaTh} label="Grid görünümüne geç" />
		</div>
	);
}
