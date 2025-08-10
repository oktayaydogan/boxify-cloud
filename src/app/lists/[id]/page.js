"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";
import ListItem from "@/components/ListItem";
import ListItemSkeleton from "@/components/ListItemSkeleton";

export default function ListPage({ params }) {
	const router = useRouter();
	const [lists, setLists] = useState([]);
	const [loading, setLoading] = useState(true);
	const [itemName, setItemName] = useState(""); // Yeni öğe adı durumu
	const { id } = params;

const fetchItems = useCallback(async () => {
setLoading(true);
const { data, error } = await supabase
.from("items")
.select("*")
.eq("list_id", id);

if (error) {
console.error(error);
} else {
setLists(data);
}
setLoading(false);
}, [id]);

// Öğelerin listelenmesi
useEffect(() => {
fetchItems();
}, [fetchItems]);

	// Listeye öğe ekleme
	async function addItem() {
		if (!itemName) {
			alert("Lütfen bir öğe adı girin.");
			return;
		}

		const { data, error } = await supabase
			.from("items")
			.insert([{ name: itemName, list_id: id }])
			.select(); // Eklenen öğeyi döndürmek için .select() ekleyin

		if (error) {
			console.error(error);
		} else if (data && data.length > 0) {
			setLists([data[0], ...lists]); // Yeni öğeyi listeye ekleyin
			setItemName(""); // Eklemeden sonra giriş alanını temizle
		}
	}

	// Listeden öğe silme
	async function deleteItem(itemId) {
		const { error } = await supabase.from("items").delete().eq("id", itemId);

		if (error) {
			console.error(error);
		} else {
			// Öğeyi listeden kaldır
			setLists(lists.filter((item) => item.id !== itemId));
		}
	}

	return (
		<Card>
			<div className="flex items-center justify-between mb-4">
				<CardTitle>Liste Öğeleri</CardTitle>
				<button
					onClick={() => router.push("/lists")}
					className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
				>
					Geri
				</button>
			</div>

			<div className="flex mb-6 gap-2">
				<input
					type="text"
					value={itemName}
					onChange={(e) => setItemName(e.target.value)}
					placeholder="Öğe adı girin"
					className="flex-grow p-2 border rounded-lg focus:outline-none focus:border-blue-300"
				/>
				<button
					onClick={addItem}
					className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
				>
					Yeni Öğe Ekle
				</button>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{loading ? (
					<ListItemSkeleton />
				) : lists.length === 0 ? (
					<p className="col-span-2 text-center text-gray-600">
						Henüz eklenmiş bir öğe yok.
					</p>
				) : (
					lists.map((item) => (
						<ListItem
							key={item.id}
							list={item}
							handleDeleteList={() => deleteItem(item.id)}
						/>
					))
				)}
			</div>
		</Card>
	);
}
