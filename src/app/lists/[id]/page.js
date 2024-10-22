"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ListPage({ params }) {
	const router = useRouter();

	const [lists, setLists] = useState([]);
	const { id } = params;

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

			if (error) {
				setError(error.message);
			} else {
				setLists(data);
			}
		};

		fetchLists();
	}, [router]);

	return <div>List id {id}</div>;
}
