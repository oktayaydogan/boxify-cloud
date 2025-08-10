import Link from "next/link";
import { FaList, FaLock, FaGlobe, FaTrash, FaCalendarAlt, FaBox, FaQrcode } from "react-icons/fa";
import { memo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import QRCodeModal from "./QRCodeModal";

function ListItem({ list, handleDeleteList }) {
const [itemCount, setItemCount] = useState(0);
const [loading, setLoading] = useState(true);
const [showQRModal, setShowQRModal] = useState(false);

useEffect(() => {
const fetchItemCount = async () => {
try {
const { count, error } = await supabase
.from("items")
.select("*", { count: "exact", head: true })
.eq("list_id", list.id);

if (error) {
console.error("Error fetching item count:", error);
setItemCount(0);
} else {
setItemCount(count || 0);
}
} catch (error) {
console.error("Error:", error);
setItemCount(0);
} finally {
setLoading(false);
}
};

fetchItemCount();
}, [list.id]);

return (
<div className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 w-full bg-white">
<div className="flex items-start justify-between mb-3">
{/* Icon and Title */}
<div className="flex items-center gap-3 flex-1 min-w-0">
<div className="p-2 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
<FaList size={16} />
</div>
<div className="flex-1 min-w-0">
<Link href={`/lists/${list.id}`} className="block">
<h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition duration-200 truncate">
{list.name}
</h2>
</Link>
{/* Item Count */}
<div className="flex items-center gap-1 mt-1">
<FaBox size={12} className="text-gray-400" />
<span className="text-sm text-gray-500">
{loading ? "..." : `${itemCount} öğe`}
</span>
</div>
</div>
</div>
{/* Action Buttons */}
<div className="flex gap-1">
<button
onClick={(e) => {
e.preventDefault();
setShowQRModal(true);
}}
className="opacity-0 group-hover:opacity-100 p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 flex-shrink-0"
title="QR Kod"
>
<FaQrcode size={14} />
</button>
<button
onClick={(e) => {
e.preventDefault();
handleDeleteList(list.id, list.name);
}}
className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
title="Kutuyu sil"
>
<FaTrash size={14} />
</button>
</div>
</div>

{/* Metadata */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-500">
<div className="flex items-center gap-4">
{/* Privacy Status */}
<div className="flex items-center gap-1">
{list.is_public ? (
<>
<FaGlobe size={12} className="text-green-500" />
<span className="text-green-600 font-medium">Herkese Açık</span>
</>
) : (
<>
<FaLock size={12} className="text-gray-400" />
<span>Özel</span>
</>
)}
</div>
{/* Creation Date */}
<div className="flex items-center gap-1">
<FaCalendarAlt size={12} className="text-gray-400" />
<span className="truncate">
{new Date(list.created_at).toLocaleDateString('tr-TR', {
day: '2-digit',
month: '2-digit', 
year: 'numeric'
})}
</span>
</div>
</div>

{/* Badge */}
<div className="flex-shrink-0">
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
📋 Kutu
</span>
</div>
</div>

{/* QR Code Modal */}
<QRCodeModal
isOpen={showQRModal}
onClose={() => setShowQRModal(false)}
listId={list.id}
listName={list.name}
/>
</div>
);
}

export default memo(ListItem);
