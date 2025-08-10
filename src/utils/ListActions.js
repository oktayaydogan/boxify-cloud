import { supabase } from "@/lib/supabase/client";

export const createList = async (listName, setError, setLists, lists, isPublic = false) => {
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
.insert([{ name: listName, user_id: user.id, is_public: isPublic }])
.select();

if (error) {
setError(error.message);
} else {
setLists([data[0], ...lists]);
}
};

export const deleteList = async (id, setError, setLists, lists) => {
	const { error } = await supabase.from("lists").delete().eq("id", id);

	if (error) {
		setError(error.message);
	} else {
		setLists(lists.filter((list) => list.id !== id));
	}
};
