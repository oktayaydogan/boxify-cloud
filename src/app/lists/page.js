"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Card from "@/components/Card";

export default function ListsPage() {
	const [lists, setLists] = useState([]);
	const [listName, setListName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

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

		// Oturum açmış kullanıcının kimliğini al
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setError("Kullanıcı oturumu açık değil.");
			return;
		}

		// Yeni liste ekleme
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
			<h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
				Listelerinizi Yönetin
			</h1>
			{error && <p className="text-center text-red-500 mb-4">{error}</p>}
			<div className="flex w-full mb-6">
				<input
					type="text"
					value={listName}
					onChange={(e) => setListName(e.target.value)}
					placeholder="Yeni liste adı"
					className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
				/>
				<button
					onClick={handleCreateList}
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-300"
				>
					Liste Oluştur
				</button>
			</div>
			<div className="space-y-4">
				{loading &&
					// placeholder box
					[1, 2, 3].map((_, index) => (
						<div
							key={index}
							className="animate-pulse flex items-center justify-between p-4 border rounded-lg"
						>
							<div>
								<div className="w-96 h-5 mb-2 bg-gray-200 rounded-lg"></div>
								<div className="w-3/4 h-4 bg-gray-200 rounded-lg"></div>
							</div>

							<div className="w-1/12 h-10 bg-gray-200 rounded-lg"></div>
						</div>
					))}
				{lists.length === 0 && !loading ? (
					<p className="text-center text-gray-600">
						Henüz oluşturulmuş bir listeniz yok.
					</p>
				) : (
					lists.map((list) => (
						<div
							key={list.id}
							className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition duration-300"
						>
							<div>
								<h2 className="text-xl font-bold text-gray-800">
									<Link href={`/lists/${list.id}`}>{list.name}</Link>
								</h2>
								<p className="text-sm text-gray-600">
									{list.is_public ? "Herkese Açık" : "Özel"}
									{" - "}
									{new Date(list.created_at).toLocaleString()}
								</p>
							</div>
							<button
								onClick={() => handleDeleteList(list.id)}
								className="px-4 py-2 bg-red-500 text-white rounded-lg"
							>
								Sil
							</button>
						</div>
					))
				)}
			</div>
		</Card>
	);
}
