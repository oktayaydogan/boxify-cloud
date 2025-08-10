"use client";

import { useState, useCallback, useMemo } from "react";
import { FaPlus, FaSearch, FaTimes, FaSpinner, FaBox } from "react-icons/fa";
import Link from "next/link";
import useLists from "@/hooks/useLists";
import { createList, deleteList } from "@/utils/ListActions";
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";
import ListItem from "@/components/ListItem";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import SearchResultItem from "@/components/SearchResultItem";

export default function ListsPage() {
const { lists, error, loading, setError, setLists, searchLists } = useLists();
const [listName, setListName] = useState("");
const [isInputVisible, setIsInputVisible] = useState(false);
const [isPublic, setIsPublic] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [isSearching, setIsSearching] = useState(false);

const handleCreateList = async () => {
await createList(listName, setError, setLists, lists, isPublic);
setListName("");
setIsInputVisible(false);
setIsPublic(false);
};

const handleSearch = (value) => {
setSearchTerm(value);
setIsSearching(value.length >= 3);
searchLists(value);
};

const handleDeleteItem = useCallback((item) => {
if (item.searchType === 'list') {
deleteList(item.id, setError, setLists, lists);
} else {
// Öğeler için silme işlemi şimdilik desteklenmiyor
console.log('Öğe silme işlemi henüz desteklenmiyor');
}
}, [setError, setLists, lists]);

// Memoize expensive calculations
const memoizedSearchResults = useMemo(() => {
if (!isSearching) return null;
return lists.map((list) => (
<SearchResultItem
key={list.id}
item={list}
searchTerm={searchTerm}
handleDeleteList={() => handleDeleteItem(list)}
/>
));
}, [lists, searchTerm, isSearching, handleDeleteItem]);

const memoizedListResults = useMemo(() => {
if (isSearching) return null;
return lists.map((list) => (
<ListItem
key={list.id}
list={list}
handleDeleteList={() => deleteList(list.id, setError, setLists, lists)}
/>
));
}, [lists, isSearching, setError, setLists]);

	return (
		<Card>
			<CardTitle>Kutularınızı Yönetin</CardTitle>
			{error && <p className="text-center text-red-500 mb-4">{error}</p>}
<div className="flex flex-col gap-4 mb-4">
{/* Search and Actions Row */}
<div className="flex flex-col sm:flex-row justify-between gap-2 items-stretch sm:items-center">
<div className="flex-grow relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaSearch className="h-4 w-4 text-gray-400" />
</div>
<input
type="text"
value={searchTerm}
placeholder="Kutu veya öğe ara..."
className="pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 w-full transition duration-200"
onChange={(e) => handleSearch(e.target.value)}
/>
{searchTerm && (
<button
onClick={() => handleSearch("")}
className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
>
<FaTimes className="h-4 w-4 text-gray-400" />
</button>
)}
{loading && isSearching && (
<div className="absolute inset-y-0 right-8 flex items-center">
<FaSpinner className="h-4 w-4 text-blue-500 animate-spin" />
</div>
)}
</div>
<div className="flex gap-2 items-center">
{!isSearching && lists.length > 0 && (
<Link 
href="/lists/all-items"
className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition duration-300 flex items-center justify-center gap-1 whitespace-nowrap"
>
<FaBox />
<span className="hidden sm:inline">Tüm Öğeler</span>
<span className="sm:hidden">Öğeler</span>
</Link>
)}
<button
onClick={() => setIsInputVisible(!isInputVisible)}
className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-1 whitespace-nowrap"
>
<FaPlus />
<span className="hidden sm:inline">Yeni Kutu</span>
<span className="sm:hidden">Yeni</span>
</button>
</div>
</div>

</div>

{isInputVisible && (
<div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
<h3 className="text-lg font-semibold text-gray-800 mb-4">Yeni Kutu Oluştur</h3>

{/* Kutu Adı */}
<div className="mb-4">
<label className="block text-sm font-medium text-gray-700 mb-2">
Kutu Adı
</label>
<input
onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
type="text"
value={listName}
onChange={(e) => setListName(e.target.value)}
placeholder="Kutu adı girin..."
className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition duration-200"
/>
</div>

{/* Privacy Seçimi */}
<div className="mb-6">
<label className="block text-sm font-medium text-gray-700 mb-3">
Gizlilik Ayarı
</label>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
{/* Özel Liste */}
<div 
onClick={() => setIsPublic(false)}
className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
!isPublic 
? 'border-blue-500 bg-blue-50' 
: 'border-gray-200 hover:border-gray-300'
}`}
>
<div className="flex items-center gap-3">
<div className={`w-4 h-4 rounded-full border-2 ${
!isPublic ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
}`}>
{!isPublic && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
</div>
<div>
<h4 className="font-semibold text-gray-800">🔒 Özel</h4>
<p className="text-sm text-gray-600">Sadece siz görebilirsiniz</p>
</div>
</div>
</div>

{/* Herkese Açık Liste */}
<div 
onClick={() => setIsPublic(true)}
className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
isPublic 
? 'border-green-500 bg-green-50' 
: 'border-gray-200 hover:border-gray-300'
}`}
>
<div className="flex items-center gap-3">
<div className={`w-4 h-4 rounded-full border-2 ${
isPublic ? 'border-green-500 bg-green-500' : 'border-gray-300'
}`}>
{isPublic && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
</div>
<div>
<h4 className="font-semibold text-gray-800">🌍 Herkese Açık</h4>
<p className="text-sm text-gray-600">Herkes görüntüleyebilir</p>
</div>
</div>
</div>
</div>
</div>

{/* Action Buttons */}
<div className="flex gap-3 justify-end">
<button
onClick={() => {
setIsInputVisible(false);
setListName("");
setIsPublic(false);
}}
className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
>
İptal
</button>
<button
onClick={handleCreateList}
disabled={!listName.trim()}
className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
>
Kutu Oluştur
</button>
</div>
</div>
)}

{isSearching && searchTerm.length >= 3 && (
<div className="mb-4 p-3 bg-blue-50 rounded-lg">
<p className="text-sm text-blue-600">
&ldquo;{searchTerm}&rdquo; için arama sonuçları ({lists.length} sonuç bulundu)
</p>
</div>
)}

{isSearching ? (
<div className="grid grid-cols-1 gap-4">
{loading && <ListItemSkeleton />}
{lists.length === 0 && !loading ? (
<p className="text-center text-gray-600">
Arama kriterlerinize uygun sonuç bulunamadı.
</p>
) : (
memoizedSearchResults
)}
</div>
) : (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{loading && <ListItemSkeleton />}
{lists.length === 0 && !loading ? (
<p className="col-span-full text-center text-gray-600">
Henüz oluşturulmuş bir kutunuz yok.
</p>
) : (
memoizedListResults
)}
</div>
)}
		</Card>
	);
}
