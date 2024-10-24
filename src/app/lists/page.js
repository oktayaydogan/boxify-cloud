"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { FaPlus } from "react-icons/fa"; // FaPlus ikonu import edildi
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";
import ViewModeToggle from "@/components/ViewModeToggle";
import ListItem from "@/components/ListItem";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function ListsPage() {
	const [lists, setLists] = useState([]);
	const [listName, setListName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [viewMode, setViewMode] = useLocalStorage("viewMode", "list");
	const [isInputVisible, setIsInputVisible] = useState(false); // Input'un görünürlüğü için state
	const router = useRouter();

	// Hata mesajını geçici olarak göster
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError("");
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	// Listeleri yükleme
	useEffect(() => {
		const fetchLists = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				router.push("/"); // Eğer oturum açık değilse ana sayfaya yönlendir
				return;
			}

			const { data, error } = await supabase
				.from("lists")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false });

			setLoading(false);
			if (error) {
				setError(error.message);
			} else {
				setLists(data);
			}
		};

		fetchLists();
	}, [router]);

	// Yeni liste oluşturma
	const handleCreateList = async () => {
		if (!listName) {
			setError("Liste adı boş olamaz.");
			return;
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setError("Kullanıcı oturumu açık değil.");
			return;
		}

		const { data, error } = await supabase
			.from("lists")
			.insert([{ name: listName, user_id: user.id, is_public: false }])
			.select();

		if (error) {
			setError(error.message);
		} else {
			setLists([data[0], ...lists]);
			setListName("");
			setError("");
			setIsInputVisible(false); // Liste eklenince input'u gizle
		}
	};

	// Liste silme
	const handleDeleteList = async (id) => {
		const { error } = await supabase.from("lists").delete().eq("id", id);

		if (error) {
			setError(error.message);
		} else {
			setLists(lists.filter((list) => list.id !== id));
		}
	};

	return (
		<Card>
			<CardTitle>Listelerinizi Yönetin</CardTitle>
			{error && <p className="text-center text-red-500 mb-4">{error}</p>}
			<div className="flex justify-between gap-48 items-center mb-4">
				<div className="flex-grow">
					{/* search list */}
					<input
						type="text"
						placeholder="Liste ara"
						className="p-2 w-full border rounded-lg focus:outline-none focus:border-blue-300"
					/>
				</div>
				<div className="flex gap-2 items-center">
					<button
						onClick={() => setIsInputVisible(!isInputVisible)}
						className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-1"
					>
						<FaPlus />
						<span>Yeni Liste</span>
					</button>
					<ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
				</div>
			</div>

			{isInputVisible && (
				<div className="flex w-full mb-6">
					<input
						onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
						type="text"
						value={listName}
						onChange={(e) => setListName(e.target.value)}
						placeholder="Yeni liste adı"
						className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:border-blue-300"
					/>
					<button
						onClick={handleCreateList}
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-300"
					>
						Liste Oluştur
					</button>
				</div>
			)}

			<div
				className={`${
					viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"
				}`}
			>
				{loading && <ListItemSkeleton />}
				{lists.length === 0 && !loading ? (
					<p className="text-center text-gray-600">
						Henüz oluşturulmuş bir listeniz yok.
					</p>
				) : (
					lists.map((list) => (
						<ListItem
							key={list.id}
							list={list}
							handleDeleteList={handleDeleteList}
							viewMode={viewMode}
						/>
					))
				)}
			</div>
		</Card>
	);
}
