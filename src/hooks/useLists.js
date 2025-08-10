import { useState, useEffect, useCallback } from "react";
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

const fetchLists = useCallback(async () => {
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
}, [router, setError, setLists]);

  useEffect(() => {
    fetchLists();
  }, [router, fetchLists]);

  const searchLists = async (searchTerm) => {
    if (searchTerm.length < 2) {
      await fetchLists();
      return;
    }
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

    setLoading(true);

    // Önce kullanıcının tüm listelerini al
    const { data: userLists, error: userListsError } = await supabase
      .from("lists")
      .select("id")
      .eq("user_id", user.id);

    if (userListsError) {
      setError(userListsError.message);
      setLoading(false);
      return;
    }

    const userListIds = userLists.map(list => list.id);

    // Eğer kullanıcının hiç listesi yoksa sadece liste araması yap
    if (userListIds.length === 0) {
      const listsResult = await supabase
        .from("lists")
        .select("*")
        .eq("user_id", user.id)
        .ilike("name", `%${searchTerm}%`);

      setLoading(false);

      if (listsResult.error) {
        setError(listsResult.error.message);
        return;
      }

      const results = listsResult.data.map(list => ({
        ...list,
        searchType: 'list',
        displayName: list.name,
        parentList: null
      }));

      setLists(results);
      return;
    }

    // Hem liste adlarında hem de öğe adlarında arama yap
    const [listsResult, itemsResult] = await Promise.all([
      // Liste adlarında arama
      supabase
        .from("lists")
        .select("*")
        .eq("user_id", user.id)
        .ilike("name", `%${searchTerm}%`),
      
      // Öğe adlarında arama (sadece kullanıcının listelerinde)
      supabase
        .from("items")
        .select("*, list:lists(id, name)")
        .ilike("name", `%${searchTerm}%`)
        .in("list_id", userListIds)
    ]);

    setLoading(false);

    if (listsResult.error || itemsResult.error) {
      setError(listsResult.error?.message || itemsResult.error?.message);
      return;
    }

    // Sonuçları birleştir ve formatla
    const results = [];
    
    // Liste sonuçlarını ekle
    listsResult.data.forEach(list => {
      results.push({
        ...list,
        searchType: 'list',
        displayName: list.name,
        parentList: null
      });
    });

    // Öğe sonuçlarını ekle
    itemsResult.data.forEach(item => {
      results.push({
        id: `item-${item.id}`,
        originalId: item.id,
        list_id: item.list_id,
        name: item.name,
        searchType: 'item',
        displayName: item.name,
        parentList: item.list,
        created_at: item.created_at
      });
    });

    setLists(results);
  };

	return { lists, error, loading, setError, setLists, searchLists, fetchLists };
}
