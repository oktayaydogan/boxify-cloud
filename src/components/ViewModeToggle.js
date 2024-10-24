import { FaList, FaTh } from "react-icons/fa";

export default function ViewModeToggle({ viewMode, setViewMode }) {
	return (
		<div className="flex h-10">
			<button
				onClick={() => setViewMode("list")}
				aria-label="Liste görünümüne geç"
				className={`px-4 py-2 flex items-center gap-2 ${
					viewMode === "list"
						? "bg-blue-500 text-white"
						: "bg-gray-200 text-gray-800"
				} rounded-l-lg`}
			>
				<FaList />
			</button>
			<button
				onClick={() => setViewMode("grid")}
				aria-label="Grid görünümüne geç"
				className={`px-4 py-2 flex items-center gap-2 ${
					viewMode === "grid"
						? "bg-blue-500 text-white"
						: "bg-gray-200 text-gray-800"
				} rounded-r-lg`}
			>
				<FaTh />
			</button>
		</div>
	);
}
