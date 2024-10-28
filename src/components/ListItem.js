import Link from "next/link";

export default function ListItem({ list, handleDeleteList }) {
	return (
		<div className="p-4 border rounded-lg hover:shadow-lg transition duration-300 w-full bg-white flex flex-col items-start">
			<div className="flex-grow">
				<Link href={`/lists/${list.id}`}>
					<h2 className="text-xl font-bold text-gray-800">{list.name}</h2>
				</Link>
			</div>
			<div className="flex justify-between items-end w-full">
				<p className="text-sm text-gray-600">
					{list.is_public ? "Herkese Açık" : "Özel"} -{" "}
					{new Date(list.created_at).toLocaleString()}
				</p>
				<button
					onClick={() => handleDeleteList(list.id)}
					className="px-4 py-2 bg-red-500 text-white rounded-lg grid"
				>
					Sil
				</button>
			</div>
		</div>
	);
}
