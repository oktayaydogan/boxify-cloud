"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { FaArrowLeft, FaBox, FaList, FaSearch, FaTimes } from "react-icons/fa";
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";
import ListItemSkeleton from "@/components/ListItemSkeleton";

export default function AllItemsPage() {
const router = useRouter();
const [allItems, setAllItems] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
const fetchAllItems = async () => {
try {
setLoading(true);
const { data, error } = await supabase
.from("items")
.select(`
*,
lists:list_id (
id,
name
)
`)
.order("created_at", { ascending: false });

if (error) {
console.error("Error fetching items:", error);
} else {
setAllItems(data || []);
setFilteredItems(data || []);
}
} catch (error) {
console.error("Error:", error);
} finally {
setLoading(false);
}
};

fetchAllItems();
}, []);

useEffect(() => {
if (!searchTerm) {
setFilteredItems(allItems);
} else {
const filtered = allItems.filter(item =>
item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.lists?.name.toLowerCase().includes(searchTerm.toLowerCase())
);
setFilteredItems(filtered);
}
}, [searchTerm, allItems]);

const handleDeleteItem = async (itemId) => {
try {
const { error } = await supabase
.from("items")
.delete()
.eq("id", itemId);

if (error) {
console.error("Error deleting item:", error);
} else {
setAllItems(prev => prev.filter(item => item.id !== itemId));
}
} catch (error) {
console.error("Error:", error);
}
};

return (
<Card>
<div className="flex items-center justify-between mb-4">
<CardTitle>Tüm Öğeler</CardTitle>
<button
onClick={() => router.push("/lists")}
className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-300 flex items-center gap-2"
>
<FaArrowLeft />
Geri
</button>
</div>

{/* Search Bar */}
<div className="mb-6 relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaSearch className="h-4 w-4 text-gray-400" />
</div>
<input
type="text"
value={searchTerm}
placeholder="Öğe veya kutu adı ile ara..."
className="pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 w-full transition duration-200"
onChange={(e) => setSearchTerm(e.target.value)}
/>
{searchTerm && (
<button
onClick={() => setSearchTerm("")}
className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
>
<FaTimes className="h-4 w-4 text-gray-400" />
</button>
)}
</div>

{/* Items Count */}
{!loading && (
<div className="mb-4 p-3 bg-blue-50 rounded-lg">
<p className="text-sm text-blue-600">
{searchTerm ? (
<>
&ldquo;{searchTerm}&rdquo; için {filteredItems.length} öğe bulundu
</>
) : (
<>
Toplam {allItems.length} öğe görüntüleniyor
</>
)}
</p>
</div>
)}

{/* Items Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{loading ? (
Array(6).fill(null).map((_, index) => (
<ListItemSkeleton key={index} />
))
) : filteredItems.length === 0 ? (
<div className="col-span-full text-center py-12">
<FaBox className="mx-auto text-gray-400 text-6xl mb-4" />
<p className="text-gray-600 text-lg">
{searchTerm ? "Arama kriterlerinize uygun öğe bulunamadı." : "Henüz hiç öğe eklenmemiş."}
</p>
</div>
) : (
filteredItems.map((item) => (
<div
key={item.id}
className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 bg-white"
>
<div className="flex items-start justify-between mb-3">
<div className="flex items-center gap-3 flex-1 min-w-0">
<div className="p-2 rounded-full bg-green-100 text-green-600 flex-shrink-0">
<FaBox size={16} />
</div>
<div className="flex-1 min-w-0">
<h3 className="text-lg font-semibold text-gray-800 truncate">
{item.name}
</h3>
<div className="flex items-center gap-1 mt-1">
<FaList size={12} className="text-gray-400" />
<span className="text-sm text-gray-500 truncate">
{item.lists?.name || "Silinmiş kutu"}
</span>
</div>
</div>
</div>
<button
onClick={() => handleDeleteItem(item.id)}
className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
title="Öğeyi sil"
>
<FaTimes size={14} />
</button>
</div>

<div className="flex justify-between items-center text-sm text-gray-500">
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
📦 Öğe
</span>
<span>
{new Date(item.created_at).toLocaleDateString('tr-TR', {
day: '2-digit',
month: '2-digit',
year: 'numeric'
})}
</span>
</div>
</div>
))
)}
</div>
</Card>
);
}
