"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase/client";
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";
import ItemCard from "@/components/ItemCard";
import ListItemSkeleton from "@/components/ListItemSkeleton";

export default function ListPage({ params }) {
const router = useRouter();
const session = useSession();
const [items, setItems] = useState([]);
const [list, setList] = useState(null);
const [loading, setLoading] = useState(true);
const [itemName, setItemName] = useState(""); // Yeni öğe adı durumu
const [accessDenied, setAccessDenied] = useState(false);
const { id } = params;

const fetchListAndItems = useCallback(async () => {
setLoading(true);
setAccessDenied(false);

// Önce liste bilgisini al
const { data: listData, error: listError } = await supabase
.from("lists")
.select("*")
.eq("id", id)
.single();

if (listError) {
console.error("Liste bulunamadı:", listError);
setAccessDenied(true);
setLoading(false);
return;
}

setList(listData);

// Eğer liste özel ise ve kullanıcı giriş yapmamışsa erişimi engelle
if (!listData.is_public && !session) {
setAccessDenied(true);
setLoading(false);
return;
}

// Eğer liste özel ise ve kullanıcı sahibi değilse erişimi engelle
if (!listData.is_public && session && listData.user_id !== session.user.id) {
setAccessDenied(true);
setLoading(false);
return;
}

// Liste erişimi onaylandı, öğeleri getir
const { data: itemsData, error: itemsError } = await supabase
.from("items")
.select("*")
.eq("list_id", id);

if (itemsError) {
console.error(itemsError);
} else {
setItems(itemsData || []);
}
setLoading(false);
}, [id, session]);

// Liste ve öğelerin listelenmesi
useEffect(() => {
fetchListAndItems();
}, [fetchListAndItems]);

// Update page title
useEffect(() => {
document.title = "Kutu Öğeleri - Boxify";
}, []);

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
setItems([data[0], ...items]); // Yeni öğeyi listeye ekleyin
setItemName(""); // Eklemeden sonra giriş alanını temizle
}
}

// Listeden öğe silme
async function deleteItem(itemId, itemName) {
const confirmed = window.confirm(
`"${itemName}" öğesini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`
);

if (!confirmed) {
return;
}

const { error } = await supabase.from("items").delete().eq("id", itemId);

if (error) {
console.error(error);
} else {
// Öğeyi listeden kaldır
setItems(items.filter((item) => item.id !== itemId));
}
}

// Erişim reddedildiğinde gösterilecek ekran
if (accessDenied) {
return (
<Card>
<div className="text-center py-12">
<div className="mb-6">
<div className="text-6xl mb-4">🔒</div>
<h2 className="text-2xl font-bold text-gray-800 mb-2">Erişim Reddedildi</h2>
<p className="text-gray-600 mb-6">
Bu kutu özeldir ve sadece sahibi tarafından görüntülenebilir.
</p>
</div>
<div className="flex gap-4 justify-center">
<button
onClick={() => router.push("/")}
className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
>
Giriş Yap
</button>
<button
onClick={() => router.push("/explore")}
className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition duration-300"
>
Herkese Açık Kutuları Keşfet
</button>
</div>
</div>
</Card>
);
}

return (
<Card>
<div className="mb-4">
<CardTitle>{list?.name || "Kutu Öğeleri"}</CardTitle>
<div className="flex justify-end -mt-4 mb-4">
<button
onClick={() => router.push("/lists")}
className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
>
Geri
</button>
</div>
</div>

{/* Sadece kutu sahibi öğe ekleyebilir */}
{session && list && session.user.id === list.user_id && (
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
)}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{loading ? (
<ListItemSkeleton />
) : items.length === 0 ? (
<p className="col-span-2 text-center text-gray-600">
Henüz eklenmiş bir öğe yok.
</p>
) : (
items.map((item) => (
<ItemCard
key={item.id}
item={item}
handleDeleteItem={() => deleteItem(item.id, item.name)}
showDeleteButton={session && list && session.user.id === list.user_id}
/>
))
)}
</div>
		</Card>
	);
}
