"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { FaGlobe, FaUser, FaBox, FaCalendarAlt, FaSearch, FaTimes } from "react-icons/fa";
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import Link from "next/link";

export default function ExplorePage() {
const [publicLists, setPublicLists] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [filteredLists, setFilteredLists] = useState([]);

useEffect(() => {
const fetchPublicLists = async () => {
try {
setLoading(true);
const { data, error } = await supabase
.from("lists")
.select(`
*,
users:user_id (
id,
user_metadata
)
`)
.eq("is_public", true)
.order("created_at", { ascending: false });

if (error) {
console.error("Error fetching public lists:", error);
} else {
setPublicLists(data || []);
setFilteredLists(data || []);
}
} catch (error) {
console.error("Error:", error);
} finally {
setLoading(false);
}
};

fetchPublicLists();
}, []);

useEffect(() => {
if (!searchTerm) {
setFilteredLists(publicLists);
} else {
const filtered = publicLists.filter(list =>
list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
list.users?.user_metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase())
);
setFilteredLists(filtered);
}
}, [searchTerm, publicLists]);

return (
<Card>
<CardTitle>Herkese Açık Kutuları Keşfedin</CardTitle>

{/* Search Bar */}
<div className="mb-6 relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaSearch className="h-4 w-4 text-gray-400" />
</div>
<input
type="text"
value={searchTerm}
placeholder="Kutu veya kullanıcı adı ile ara..."
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

{/* Results Count */}
{!loading && (
<div className="mb-4 p-3 bg-green-50 rounded-lg">
<p className="text-sm text-green-600">
{searchTerm ? (
<>
&ldquo;{searchTerm}&rdquo; için {filteredLists.length} herkese açık kutu bulundu
</>
) : (
<>
Toplam {publicLists.length} herkese açık kutu görüntüleniyor
</>
)}
</p>
</div>
)}

{/* Public Lists Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{loading ? (
Array(6).fill(null).map((_, index) => (
<ListItemSkeleton key={index} />
))
) : filteredLists.length === 0 ? (
<div className="col-span-full text-center py-12">
<FaGlobe className="mx-auto text-gray-400 text-6xl mb-4" />
<p className="text-gray-600 text-lg">
{searchTerm ? "Arama kriterlerinize uygun herkese açık kutu bulunamadı." : "Henüz herkese açık kutu yok."}
</p>
</div>
) : (
filteredLists.map((list) => (
<div
key={list.id}
className="group bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
>
{/* Header */}
<div className="p-4 border-b border-gray-100">
<div className="flex items-center gap-3 mb-2">
<div className="p-2 rounded-full bg-green-100 text-green-600">
<FaGlobe size={16} />
</div>
<Link 
href={`/lists/${list.id}`}
className="flex-1"
>
<h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 transition duration-200 truncate">
{list.name}
</h3>
</Link>
</div>

{/* Creator Info */}
<div className="flex items-center gap-2 text-sm text-gray-600">
<FaUser size={12} />
<Link 
href={`/profile/${list.user_id}`}
className="hover:text-blue-600 transition duration-200"
>
{list.users?.user_metadata?.name || "Anonim Kullanıcı"}
</Link>
</div>
</div>

{/* Body */}
<div className="p-4">
<div className="flex justify-between items-center text-sm text-gray-500">
<div className="flex items-center gap-1">
<FaCalendarAlt size={12} />
<span>
{new Date(list.created_at).toLocaleDateString('tr-TR', {
day: '2-digit',
month: '2-digit',
year: 'numeric'
})}
</span>
</div>
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
🌍 Herkese Açık
</span>
</div>
</div>

{/* Footer */}
<div className="px-4 pb-4">
<Link 
href={`/lists/${list.id}`}
className="block w-full text-center py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition duration-200 font-medium"
>
Kutuyu Görüntüle
</Link>
</div>
</div>
))
)}
</div>
</Card>
);
}
