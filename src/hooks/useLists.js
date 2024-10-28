import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function useLists() {
	const [lists, setLists] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError("");
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	const fetchLists = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			router.push("/");
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

	useEffect(() => {
		fetchLists();
	}, [router]);

	const searchLists = async (searchTerm) => {
		if (searchTerm.length < 2) return;
		if (searchTerm.length < 3) {
			await fetchLists();
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
			.select("*")
			.eq("user_id", user.id)
			.ilike("name", `%${searchTerm}%`)
			.order("created_at", { ascending: false });

		if (error) {
			setError(error.message);
		} else {
			setLists(data);
		}
	};

	return { lists, error, loading, setError, setLists, searchLists, fetchLists };
}
