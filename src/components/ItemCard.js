import { memo } from "react";
import { FaBox, FaTrash, FaCalendarAlt } from "react-icons/fa";

function ItemCard({ item, handleDeleteItem, showDeleteButton = true }) {
return (
<div className="group p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 w-full bg-white">
<div className="flex items-start justify-between mb-3">
{/* Icon and Title */}
<div className="flex items-center gap-3 flex-1 min-w-0">
<div className="p-2 rounded-full bg-green-100 text-green-600 flex-shrink-0">
<FaBox size={16} />
</div>
<div className="flex-1 min-w-0">
<h3 className="text-lg font-semibold text-gray-800 truncate">
{item.name}
</h3>
</div>
</div>
{/* Delete Button - Sadece showDeleteButton true ise göster */}
{showDeleteButton && (
<button
onClick={(e) => {
e.preventDefault();
handleDeleteItem(item.id);
}}
className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
title="Öğeyi sil"
>
<FaTrash size={14} />
</button>
)}
</div>

{/* Metadata */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-500">
<div className="flex items-center gap-1">
<FaCalendarAlt size={12} className="text-gray-400" />
<span className="truncate">
{new Date(item.created_at).toLocaleDateString('tr-TR', {
day: '2-digit',
month: '2-digit', 
year: 'numeric'
})}
</span>
</div>

{/* Badge */}
<div className="flex-shrink-0">
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
📦 Öğe
</span>
</div>
</div>
</div>
);
}

export default memo(ItemCard);
