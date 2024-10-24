import Link from "next/link";

export default function ListItem({ list, handleDeleteList, viewMode }) {
	return (
		<div
			className={`p-4 border rounded-lg hover:shadow-lg transition duration-300 ${
				viewMode === "grid"
					? "w-full bg-white flex flex-col items-start"
					: "flex items-center justify-between"
			}`}
		>
			<div className="flex-grow">
				<Link href={`/lists/${list.id}`}>
					<h2 className="text-xl font-bold text-gray-800">{list.name}</h2>
					<p className="text-sm text-gray-600">
						{list.is_public ? "Herkese Açık" : "Özel"} -{" "}
						{new Date(list.created_at).toLocaleString()}
					</p>
				</Link>
			</div>
			<button
				onClick={() => handleDeleteList(list.id)}
				className={`mt-4 px-4 py-2 bg-red-500 text-white rounded-lg ${
					viewMode === "grid" ? "self-end" : ""
				}`}
			>
				Sil
			</button>
		</div>
	);
}
